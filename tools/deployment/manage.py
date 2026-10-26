#!/usr/bin/env python3
"""Operate verified offline bundles without a source checkout."""
import argparse
from contextvars import ContextVar
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import subprocess
import sys

if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from tools.deployment import custom
from tools.deployment import progress

from tools.deployment.bundle import verify, write_json
from tools.deployment.offline import (NAMES, digest,
                     daemon_architecture, verify_loaded, reference)


COMPOSE_OVERRIDE = ContextVar('compose_override', default=None)


def inherited_lock():
    value = os.environ.get('HAPPYRO_DEPLOYMENT_LOCK_FD')
    if value is None:
        return {}
    descriptor = int(value)
    os.fstat(descriptor)
    return {'pass_fds': (descriptor,)}


@progress.operation('初始化部署配置')
def initialize(args):
    verify(args)
    target = args.directory.resolve() / '.env'
    template = target.with_name('.env.example').read_text()
    values = {key: secrets.token_hex(24) for key in ['HAPPYRO_SERVER_DB_PASSWORD', 'HAPPYRO_API_ADMIN_DB_PASSWORD', 'MARIADB_ROOT_PASSWORD', 'HAPPYRO_SERVER_INTERSERVER_PASSWORD', 'HAPPYRO_GAME_CONTROL_TOKEN']}
    # rAthena inter-server authentication stores passwords in a 24-byte buffer.
    values['HAPPYRO_SERVER_INTERSERVER_PASSWORD'] = secrets.token_hex(10)
    for key, value in values.items():
        template = re.sub(rf'^{key}=.*$', f'{key}={value}', template, flags=re.M)
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as stream:
        stream.write(template)
    initialize_custom_directory(args.directory.resolve())
    progress.message('Created .env with unique secrets. Set public URLs before starting Compose.')


@progress.operation('导入本机架构镜像')
def import_images(args):
    release = verify(args)
    arch = daemon_architecture()
    for index, name in enumerate(NAMES, 1):
        progress.message(f'[{index}/{len(NAMES)}] 导入 {name} linux/{arch}', 'stage')
        with progress.step(f'导入 {name} linux/{arch}'):
            subprocess.run(['docker', 'load', '--input',
                            str(args.directory.resolve() / 'images' / arch / f'{name}.tar')], check=True, **inherited_lock())
    verify_loaded(release, arch)
    progress.message(f'Loaded and verified {release["version"]} linux/{arch} images')


@progress.operation('启动部署服务')
def deploy(args):
    root = args.directory.resolve()
    if not (root / '.env').is_file():
        raise ValueError('Run initialize and edit .env public URLs before deploying')
    release = verify(args)
    config = json.loads(compose(root, 'config', '--format', 'json', capture_output=True, text=True).stdout)
    services = {'gateway': 'gateway', 'admin': 'admin', 'api': 'api', 'api-init': 'api',
                'database': 'database', 'login': 'server', 'char': 'server',
                'map': 'server', 'web-api': 'server'}
    if set(config['services']) != set(services):
        raise ValueError('Unexpected Compose services')
    for service, name in services.items():
        entry = config['services'][service]
        if entry['image'] != reference(name, release['version']) or entry.get('pull_policy') != 'never':
            raise ValueError(f'Update .env image references for this release: {service}')
    custom.validate(custom.custom_root(config))
    verify_loaded(release, daemon_architecture())
    # Apply the game schema before starting upgraded login/web services, including
    # installations that retain an existing database volume.
    compose(root, 'up', '-d', '--wait', '--pull', 'never', '--no-build', 'database')
    compose(root, 'exec', '-T', 'database', 'sh', '-c',
            'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" mariadb --user=root "$MARIADB_DATABASE" '
            '< /opt/rathena/sql/upgrades/upgrade_20261012_sessions.sql')
    compose(root, 'up', '-d', '--pull', 'never', '--no-build')
    compose(root, 'ps', '-a')


def compose(root, *args, **kwargs):
    command = ['docker', 'compose', '--project-directory', str(root), '-f', str(root / 'compose.yaml')]
    override = COMPOSE_OVERRIDE.get()
    if override is not None:
        command += ['-f', str(override)]
    return subprocess.run([*command, *args], check=True, **inherited_lock(), **kwargs)


def custom_config(root):
    return json.loads(compose(root, 'config', '--format', 'json', capture_output=True, text=True).stdout)


def initialize_custom_directory(root):
    destination = custom.custom_root(custom_config(root))
    custom.initialize(destination, root / 'examples/custom')
    progress.message(f'Initialized custom directories at {destination}; existing files preserved')


def initialize_custom(args):
    verify(args)
    initialize_custom_directory(args.directory.resolve())


@progress.operation('刷新自定义资料目录')
def refresh_custom_catalogs(args):
    root = args.directory.resolve()
    verify(args)
    custom.validate(custom.custom_root(custom_config(root)))
    compose(root, 'run', '--rm', '--no-deps', '-T', 'api', 'refresh-custom-catalogs')


@progress.operation('备份部署数据')
def backup(args):
    root, output = args.directory.resolve(), args.output.resolve()
    if output.exists():
        raise ValueError('Backup output already exists')
    running = subprocess.check_output(['docker','compose','--project-directory',str(root),'-f',str(root/'compose.yaml'),'ps','--services','--status','running'], text=True).split()
    if set(running) != {'database'}:
        raise ValueError('Keep only database running for a consistent backup')
    # Callers quiesce writes explicitly; the tool never stops a deployment.
    custom_directory = custom.custom_root(custom_config(root))
    custom.validate(custom_directory)
    output.mkdir(parents=True, mode=0o700)
    custom.backup(custom_directory, output / 'custom-files.tar')
    command = 'exec mariadb-dump --user=root --password="$MARIADB_ROOT_PASSWORD" --single-transaction --routines --events --triggers --databases happyro happyro_log happyro_admin'
    with (output / 'databases.sql').open('wb') as stream:
        compose(root, 'exec', '-T', 'database', 'sh', '-c', command, stdout=stream)
    for service, target, directories in [('api', 'server-settings.tar', ['/run/happyro-settings'])]:
        with (output / target).open('wb') as stream:
            compose(root, 'run', '--rm', '--no-deps', '-T', '--entrypoint', 'tar', service, '-cf', '-', *directories, stdout=stream)
    for name in ['.env', 'compose.yaml', 'release-manifest.json']:
        shutil.copyfile(root / name, output / name)
    write_json(output / 'checksums.json', {p.name: digest(p) for p in output.iterdir() if p.is_file()})
    progress.message(f'Backup saved to {output}; contains secrets, keep private')


@progress.operation('恢复部署数据')
def restore(args):
    if not args.confirm_replace:
        raise ValueError('Restore replaces existing data; use --confirm-replace after stopping all writers')
    root, source = args.directory.resolve(), args.backup.resolve()
    checksums = json.loads((source / 'checksums.json').read_text())
    required = {'databases.sql', 'server-settings.tar', 'custom-files.tar', '.env', 'compose.yaml', 'release-manifest.json'}
    if set(checksums) != required:
        raise ValueError('Incomplete backup; restore older backups with their matching release tools')
    for name, value in checksums.items():
        if Path(name).name != name or digest(source / name) != value:
            raise ValueError('Backup checksum mismatch')
    running = subprocess.check_output(['docker','compose','--project-directory',str(root),'-f',str(root/'compose.yaml'),'ps','--services','--status','running'], text=True).split()
    if set(running) - {'database'}:
        raise ValueError('Stop every service except database before restoring')
    if 'database' not in running:
        raise ValueError('Start database before restoring')
    custom.validate_backup(source / 'custom-files.tar')
    custom_directory = custom.custom_root(custom_config(root))
    with (source / 'databases.sql').open('rb') as stream:
        compose(root, 'exec', '-T', 'database', 'sh', '-c', 'exec mariadb --user=root --password="$MARIADB_ROOT_PASSWORD"', stdin=stream)
    with (source / 'server-settings.tar').open('rb') as stream:
        compose(root, 'run', '--rm', '--no-deps', '-T', '--entrypoint', 'tar', 'api', '-xf', '-', '-C', '/', stdin=stream)
    custom.restore(source / 'custom-files.tar', custom_directory)
    progress.message('Restored databases, custom content and server settings. Use the backed-up environment and matching image release before starting.')


def help_text(no_color):
    def color(code, text):
        return text if no_color else f'\033[{code}m{text}\033[0m'
    print('\n' + color('1;36', 'HappyRO deployment tools') + '\n')
    print(color('1;33', 'Commands'))
    print(color('1;32', '  verify | initialize | initialize-custom | refresh-custom-catalogs | import-images | deploy | backup | restore'))
    print('\n' + color('1;33', 'Examples'))
    for line in ['verify --directory ./happyro-deploy', 'import-images --directory ./happyro-deploy', 'initialize --directory ./happyro-deploy', 'initialize-custom --directory ./happyro-deploy', 'refresh-custom-catalogs --directory ./happyro-deploy', 'deploy --directory ./happyro-deploy', 'backup --directory ./happyro-deploy --output ./backup', 'restore --directory ./happyro-deploy --backup ./backup --confirm-replace']:
        print(color('36', '  python3 tools/deployment/manage.py ' + line))
    print('\nUse --compose-override PATH for an additional Compose file; --no-color disables colors.\n')


def main():
    argv = sys.argv[1:]
    no_color = '--no-color' in argv
    argv = [arg for arg in argv if arg != '--no-color']
    if not argv or argv == ['--help'] or argv == ['help']:
        help_text(no_color)
        return
    parser = argparse.ArgumentParser(description='HappyRO deployment tools')
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ['verify', 'initialize', 'initialize-custom', 'refresh-custom-catalogs', 'import-images', 'deploy', 'backup', 'restore']:
        command = commands.add_parser(name)
        command.add_argument('--directory', type=Path, required=True)
        command.add_argument('--compose-override', type=Path, help='Additional Compose file for this invocation')
        if name == 'backup':
            command.add_argument('--output', type=Path, required=True)
        if name == 'restore':
            command.add_argument('--backup', type=Path, required=True)
            command.add_argument('--confirm-replace', action='store_true')
        if name == 'verify':
            command.add_argument('--prepared', action='store_true', help='Check a preparation bundle before images are packaged')
    progress.configure(no_color=no_color)
    args = parser.parse_args(argv)
    if args.compose_override is not None:
        args.compose_override = args.compose_override.resolve(strict=True)
    token = COMPOSE_OVERRIDE.set(args.compose_override)
    try:
        with progress.step(f'部署命令：{args.command}'):
            dispatch(args)
    finally:
        COMPOSE_OVERRIDE.reset(token)


def dispatch(args):
    {'verify': verify, 'initialize': initialize, 'import-images': import_images,
     'deploy': deploy, 'backup': backup, 'restore': restore, 'initialize-custom': initialize_custom, 'refresh-custom-catalogs': refresh_custom_catalogs}[args.command](args)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        progress.message(str(error), 'failed')
        sys.exit(1)
