"""Owned, isolated installations of final ZIPs; never mutate release artifacts."""
from tools.deployment import progress
from contextlib import contextmanager
from contextvars import ContextVar
from datetime import datetime, timezone
import fcntl
import hashlib
import ipaddress
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import socket
import stat
import subprocess
import sys
import zipfile

from tools.deployment.bundle import verify
from tools.deployment.offline import digest
from tools.release.lifecycle import atomic_json, checked_version, plain_path

LOCK_FD = ContextVar('acceptance_lock', default=None)


def child_options():
    descriptor = LOCK_FD.get()
    return {'pass_fds': (descriptor,)} if descriptor is not None else {}


SERVICES = ('database', 'login', 'char', 'map', 'web-api', 'api-init', 'api', 'admin', 'gateway')


def now():
    return datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')


class Batch:
    def __init__(self, workspace, version, batch):
        if not re.fullmatch(r'[a-zA-Z0-9][a-zA-Z0-9_.-]{0,79}', batch) or '..' in batch:
            raise ValueError('Batch must be a simple name without path components or ..')
        self.workspace = Path(workspace).resolve(strict=True)
        self.version = checked_version(version)
        self.name = batch
        self.root = self.workspace / 'work/releases' / version / 'acceptance' / batch
        self.install = self.root / 'install'
        self.bundle = self.install / f'happyro-{version}'
        self.override = self.root / 'compose.acceptance.json'
        self.state_path = self.root / 'state.json'
        self.lock_path = self.root.parent / '.locks' / f'{batch}.lock'
        slug = re.sub(r'[^a-z0-9-]', '-', batch.lower())
        self.project = 'happyro-test-' + slug + '-' + hashlib.sha256(str(self.root).encode()).hexdigest()[:16]
        self.validate()
        # A registered deployment's project is immutable, even if the naming
        # policy changes. Validate ownership before adopting its stored name.
        if self.state_path.exists():
            state = json.loads(self.state_path.read_text())
            expected = self.identity()
            if any(state.get(key) != value for key, value in expected.items() if key != 'project'):
                raise ValueError('Acceptance batch does not belong to this workspace/version')
            project = state.get('project', '')
            if not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,127}', project):
                raise ValueError('Invalid registered Compose project')
            self.project = project

    def validate(self):
        for path in (self.root, self.install, self.bundle, self.override, self.state_path, self.lock_path,
                     self.root / 'logs', self.root / 'evidence', self.bundle / '.env',
                     self.bundle / 'compose.yaml', self.bundle / '.env.example'):
            plain_path(self.workspace, path)

    def load(self):
        self.validate()
        state = json.loads(self.state_path.read_text())
        if any(state.get(key) != value for key, value in self.identity().items()):
            raise ValueError('Acceptance batch does not belong to this workspace/version')
        return state

    def identity(self):
        return {'schema': 1, 'workspace': str(self.workspace), 'version': self.version,
                'batch': self.name, 'project': self.project}

    def save(self, state):
        self.validate()
        atomic_json(self.state_path, state)

    def create(self, archive):
        self.root.mkdir(parents=True, mode=0o700, exist_ok=False)
        for name in ('logs', 'evidence', 'install'):
            (self.root / name).mkdir(mode=0o700)
        state = {**self.identity(), 'status': 'preparing', 'source': str(archive), 'sha256': digest(archive)}
        self.save(state)
        return state

    def env(self):
        # Shell variables must not redirect Compose to production volumes/ports.
        keys = set()
        for file in (self.bundle / '.env.example', self.bundle / '.env'):
            if file.exists():
                keys.update(line.split('=', 1)[0] for line in file.read_text().splitlines() if '=' in line)
        values = {key: value for key, value in os.environ.items()
                  if key not in keys and not key.startswith('COMPOSE_')
                  and key != 'HAPPYRO_DEPLOYMENT_LOCK_FD'}
        if LOCK_FD.get() is not None:
            values['HAPPYRO_DEPLOYMENT_LOCK_FD'] = str(LOCK_FD.get())
        return values

    def command(self, *args):
        return ['docker', 'compose', '--project-directory', str(self.bundle), '--env-file', str(self.bundle / '.env'),
                '-p', self.project, '-f', str(self.bundle / 'compose.yaml'), '-f', str(self.override), *args]

    def check_config(self, state):
        self.validate()
        if (digest(self.bundle / '.env') != state.get('env_sha256')
                or digest(self.override) != state.get('override_sha256')
                or digest(self.bundle / 'compose.yaml') != state.get('compose_sha256')):
            raise ValueError('Acceptance configuration changed; restore it before operating this batch')

    def compose(self, *args):
        return subprocess.check_output(self.command(*args), env=self.env(), text=True, **child_options())

    def owned_containers(self):
        ids = subprocess.check_output(['docker', 'ps', '-aq', '--filter', f'label=com.docker.compose.project={self.project}'], text=True).split()
        if not ids:
            return []
        containers = json.loads(subprocess.check_output(['docker', 'inspect', *ids], text=True))
        for container in containers:
            labels = container['Config']['Labels']
            if (labels.get('com.docker.compose.project') != self.project or
                    labels.get('com.docker.compose.project.working_dir') != str(self.bundle)):
                raise ValueError('Docker project belongs to a different deployment; refusing to operate it')
        return containers

    def owned_networks(self):
        return subprocess.check_output(['docker', 'network', 'ls', '-q', '--filter',
                                        f'label=com.docker.compose.project={self.project}'], text=True).split()

    def run_tool(self, action):
        # Execute the actual runtime tool delivered in the package.
        log = self.root / 'logs' / f'{now()}-{action}.log'
        command = [sys.executable, str(self.bundle / 'tools/deployment/manage.py'), action,
                   '--directory', str(self.bundle), '--compose-override', str(self.override), '--no-color']
        progress.message(f'日志：{log}')
        with progress.step(f'部署阶段：{action}'), log.open('x') as output:
            subprocess.run(command, env=self.env(), cwd=self.bundle, stdout=output,
                           stderr=subprocess.STDOUT, check=True, **child_options())
        return log


@contextmanager
def locked(batch):
    batch.validate()
    batch.lock_path.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(batch.lock_path, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('This acceptance batch has an active command') from None
        token = LOCK_FD.set(descriptor)
        try:
            yield
        finally:
            LOCK_FD.reset(token)
    finally:
        os.close(descriptor)


@progress.operation('解压离线包并校验文件')
def extract(archive_path, batch):
    prefix = f'happyro-{batch.version}/'
    seen = set()
    with zipfile.ZipFile(archive_path) as archive:
        for info in archive.infolist():
            path = PurePosixPath(info.filename)
            mode = stat.S_IFMT(info.external_attr >> 16)
            if (info.filename in seen or not info.filename.startswith(prefix) or '..' in path.parts
                    or '\\' in info.filename or path.is_absolute()
                    or path.as_posix() != info.filename.rstrip('/')
                    or mode not in (0, stat.S_IFDIR, stat.S_IFREG)):
                raise ValueError(f'Unsafe ZIP member: {info.filename}')
            relative = path.parts[1:]
            if '.env' in relative or '.git' in relative or (relative and relative[0] == 'custom'):
                raise ValueError('ZIP contains private deployment state')
            if relative and relative[0] == 'data' and not info.is_dir():
                raise ValueError('ZIP contains runtime data')
            seen.add(info.filename)
        for info in archive.infolist():
            target = batch.install / info.filename
            if info.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(info) as source, target.open('xb') as output:
                    shutil.copyfileobj(source, output, 1024 * 1024)
    release = verify(type('Options', (), {'directory': batch.bundle, 'prepared': False})())
    if release['version'] != batch.version:
        raise ValueError('ZIP version does not match the requested version')


def free_port():
    with socket.socket() as listener:
        listener.bind(('127.0.0.1', 0))
        return listener.getsockname()[1]


def available_networks():
    ids = subprocess.check_output(['docker', 'network', 'ls', '-q'], text=True).split()
    records = json.loads(subprocess.check_output(['docker', 'network', 'inspect', *ids], text=True)) if ids else []
    used = [ipaddress.ip_network(config['Subnet']) for network in records
            for config in ((network.get('IPAM') or {}).get('Config') or []) if config.get('Subnet')]
    chosen = []
    for subnet in ipaddress.ip_network('172.31.0.0/16').subnets(new_prefix=24):
        if not any(subnet.overlaps(other) for other in used):
            chosen.append(subnet)
            if len(chosen) == 2:
                return chosen[0], next(chosen[1].subnets(new_prefix=29))
    raise ValueError('No free pair of Docker test networks within 172.31.0.0/16')


@progress.operation('初始化独立配置、端口和网络')
def configure(batch, state, gateway_port=None, admin_port=None):
    ports = [gateway_port or free_port(), admin_port or free_port()]
    if len(set(ports)) != 2 or any(not 1024 <= port <= 65535 for port in ports):
        raise ValueError('Two distinct non-privileged ports are required')
    for port in ports:
        with socket.socket() as listener:
            listener.bind(('127.0.0.1', port))
    default, proxy = available_networks()
    values = {
        'COMPOSE_PROJECT_NAME': batch.project, 'GATEWAY_PORT': f'127.0.0.1:{ports[0]}',
        'ADMIN_PORT': f'127.0.0.1:{ports[1]}', 'GAME_PUBLIC_URL': f'http://127.0.0.1:{ports[0]}',
        'ADMIN_PUBLIC_URL': f'http://127.0.0.1:{ports[1]}', 'RESOURCE_DIR': './resources',
        'DATA_DIR': './data', 'CUSTOM_DIR': './custom', 'ADMIN_PROXY_SUBNET': str(proxy),
        'ADMIN_PROXY_DYNAMIC_RANGE': str(list(proxy.subnets(new_prefix=30))[1]),
        'ADMIN_PROXY_IP': str(proxy.network_address + 2),
    }
    override = {'name': batch.project, 'services': {name: {'container_name': f'{batch.project}-{name}'} for name in SERVICES},
                'networks': {'default': {'ipam': {'config': [{'subnet': str(default)}]}}}}
    atomic_json(batch.override, override)
    # initialize reads the template and creates unique secrets plus custom files.
    # Keep the package template immutable; adjust .env only after initialization.
    template = dict(line.split('=', 1) for line in (batch.bundle / '.env.example').read_text().splitlines()
                    if '=' in line and not line.startswith('#'))
    if any(template.get(key) != value for key, value in
           {'RESOURCE_DIR': './resources', 'DATA_DIR': './data', 'CUSTOM_DIR': './custom'}.items()):
        raise ValueError('Package must initialize data/custom inside its own directory')
    batch.run_tool('initialize')
    env_path = batch.bundle / '.env'
    lines = env_path.read_text().splitlines()
    keys = {line.split('=', 1)[0] for line in lines if '=' in line}
    if not values.keys() <= keys:
        raise ValueError('Package environment template lacks required isolation fields')
    env_path.write_text('\n'.join(f'{key}={values[key]}' if (key := line.split('=', 1)[0]) in values else line for line in lines) + '\n')
    state.update(gateway_url=values['GAME_PUBLIC_URL'], admin_url=values['ADMIN_PUBLIC_URL'],
                 env_sha256=digest(env_path), override_sha256=digest(batch.override),
                 compose_sha256=digest(batch.bundle / 'compose.yaml'))
    batch.save(state)
    config = json.loads(batch.compose('config', '--format', 'json'))
    if config.get('name') != batch.project or set(config['services']) != set(SERVICES):
        raise ValueError('Unexpected Compose project/services')
    for name, service in config['services'].items():
        if service.get('container_name') != f'{batch.project}-{name}':
            raise ValueError('Container name is not isolated')
        for volume in service.get('volumes', []):
            if volume['type'] != 'bind' or not Path(volume['source']).resolve().is_relative_to(batch.bundle):
                raise ValueError('Acceptance volumes must remain inside this installation')
        for port in service.get('ports', []):
            if port.get('host_ip') != '127.0.0.1':
                raise ValueError('Acceptance ports must bind to loopback')


@progress.operation('启动离线验收环境')
def start(batch, archive, gateway_port=None, admin_port=None):
    archive = archive.resolve(strict=True)
    with locked(batch):
        if batch.root.exists():
            raise ValueError('Batch already exists; choose a new batch name')
        if batch.owned_containers():
            raise ValueError('Project already has containers')
        with progress.step('计算输入 ZIP 的 SHA-256'):
            state = batch.create(archive)
        try:
            extract(archive, batch)
            progress.message('复核输入 ZIP，确认解压期间文件未变化')
            if digest(archive) != state['sha256']:
                raise ValueError('Archive changed during extraction')
            configure(batch, state, gateway_port, admin_port)
            batch.run_tool('import-images')
            batch.run_tool('deploy')
            state['status'] = 'started'
            batch.save(state)
        except BaseException as error:
            state.update(status='start-failed', error_type=type(error).__name__)
            batch.save(state)
            raise
    progress.message(f'Batch: {batch.name}\nGame: {state["gateway_url"]}/applications/pwa/index.html\nAdmin: {state["admin_url"]}')


def stop_locked(batch, state):
    containers = batch.owned_containers()
    if state.get('env_sha256') and batch.install.exists():
        batch.check_config(state)
        log = batch.root / 'logs' / f'{now()}-stop.log'
        progress.message(f'日志：{log}')
        with progress.step('停止容器并移除批次网络'), log.open('x') as output:
            subprocess.run(batch.command('down', '--remove-orphans', '--timeout', '30'), env=batch.env(),
                           check=True, stdout=output, stderr=subprocess.STDOUT, **child_options())
    elif containers:
        raise ValueError('Incomplete configuration with existing containers; manual inspection required')
    if batch.owned_containers():
        raise ValueError('Containers still exist; cleanup refused')
    state['status'] = 'stopped'
    batch.save(state)


@progress.operation('停止验收环境')
def stop(batch):
    with locked(batch):
        state = batch.load()
        if state['status'] == 'cleaned':
            return
        stop_locked(batch, state)


@progress.operation('清理整个验收批次')
def clean(batch, execute=False):
    with locked(batch):
        state = batch.load()
        progress.message(f'{"Remove" if execute else "Would remove"}: {batch.root}; includes installation, database, reports, logs and screenshots')
        if not execute:
            return
        stop_locked(batch, state)
        if batch.owned_networks():
            raise ValueError('Batch networks still exist; cleanup refused')
        # Keep the lock inode outside the deleted batch directory so concurrent
        # starts and cleanup always synchronize on the same lock.
        batch.validate()
        with progress.step('删除整个批次，包括数据、报告、日志和截图'):
            shutil.rmtree(batch.root)
