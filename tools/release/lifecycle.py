"""Owned version directories and kernel locks for local release cleanup.

Paths are derived from the workspace and validated version, never taken from a
state file as deletion instructions. Logs and lock files are never deleted.
"""
from tools.deployment import progress
from contextlib import contextmanager
from datetime import datetime, timezone
import fcntl
import json
import os
from pathlib import Path
import re
import shutil
import stat
import tempfile
import uuid

LOCK_ENV = 'HAPPYRO_RELEASE_LOCK_FD'
VERSION_PATTERN = r'v\d+\.\d+\.\d+'
OWNER = '.release-owner.json'


def checked_version(value):
    if not re.fullmatch(VERSION_PATTERN, value):
        raise ValueError('Version must have the form vMAJOR.MINOR.PATCH')
    return value


def plain_path(root, path):
    """Reject links at every workspace-relative component, including broken links."""
    relative = path.relative_to(root)
    current = root
    for part in relative.parts:
        if part in ('..', '.'):
            raise ValueError(f'Unsafe release path: {path}')
        current = current / part
        if current.is_symlink():
            raise ValueError(f'Symlink in release path: {current}')
    return path


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=f'.{path.name}.', suffix='.tmp', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as output:
            json.dump(value, output, ensure_ascii=False, indent=2)
            output.write('\n')
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


class VersionLayout:
    """Registration/locking shared by artifacts with distinct delivery layouts."""
    artifact_directory = ''
    record_directory = ''

    def __init__(self, workspace, version):
        self.root = Path(workspace).resolve(strict=True)
        self.version = checked_version(version)
        self.artifacts = self.root / self.artifact_directory / version
        self.records = self.root / self.record_directory / version
        self.state_path = self.records / 'state.json'
        self.lock_path = self.root / self.record_directory / '.locks' / f'{version}.lock'
        self.validate_paths()

    @property
    def temporary_patterns(self):
        return (f'.{OWNER}.*.tmp',)

    @property
    def intermediates(self):
        return ()

    def validate_deletion(self):
        pass

    def validate_paths(self):
        for path in (self.artifacts, self.records, self.state_path, self.lock_path):
            plain_path(self.root, path)

    def read_state(self):
        self.validate_paths()
        if not self.state_path.exists():
            return None
        data = json.loads(self.state_path.read_text())
        if (not isinstance(data, dict) or data.get('schema') != 1 or data.get('workspace') != str(self.root)
                or data.get('version') != self.version
                or data.get('artifacts') != self.artifacts.relative_to(self.root).as_posix()
                or not re.fullmatch(r'[0-9TZ.]+-[a-f0-9]{8}', data.get('run_id', ''))):
            raise ValueError('Release state does not identify this workspace/version')
        return data

    def save(self, state):
        self.validate_paths()
        atomic_json(self.state_path, state)

    def create(self, source_state):
        self.validate_paths()
        if self.artifacts.exists():
            raise ValueError(f'Release output already exists: {self.artifacts}; use create --rebuild to replace it')
        run_id = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ') + '-' + uuid.uuid4().hex[:8]
        state = {'schema': 1, 'workspace': str(self.root), 'version': self.version,
                 'artifacts': self.artifacts.relative_to(self.root).as_posix(),
                 'run_id': run_id, 'sources': source_state, 'status': 'created', 'stage': None}
        # Registration precedes all large writes, including failed preparation.
        self.save(state)
        self.artifacts.mkdir(parents=True, exist_ok=False)
        atomic_json(self.artifacts / OWNER, {key: state[key] for key in
                    ('schema', 'workspace', 'version', 'artifacts', 'run_id')})
        log_dir = self.records / 'logs' / run_id
        plain_path(self.root, log_dir).mkdir(parents=True, exist_ok=False)
        return state, log_dir


class Layout(VersionLayout):
    artifact_directory = 'artifacts/releases'
    record_directory = 'work/releases'

    def __init__(self, workspace, version):
        super().__init__(workspace, version)
        self.images = self.artifacts / 'images'
        self.bundle = self.artifacts / 'bundle'
        self.zip = self.artifacts / f'happyro-{version}.zip'
        self.split_paths = [self.artifacts / f'happyro-{version}-{suffix}'
                            for suffix in ('runtimes.zip', 'images.zip', 'split.json', 'SPLIT-README.md')]

    @property
    def temporary_patterns(self):
        return (*super().temporary_patterns, f'.{self.zip.name}.*.tmp', '.split-*.tmp')

    @property
    def deliveries(self):
        return (self.zip, *self.split_paths)

    @property
    def intermediates(self):
        return (self.images, self.bundle)

    def validate_deletion(self):
        if (self.bundle / 'custom').exists():
            raise ValueError('Deployment custom/ is not disposable release data')
        if any(path.is_file() for path in (self.bundle / 'data').rglob('*')):
            raise ValueError('Deployment data/ is not empty; refusing cleanup')


class ResourceLayout(VersionLayout):
    artifact_directory = 'artifacts/resources'
    record_directory = 'work/resource-transfers'

    def __init__(self, workspace, version):
        super().__init__(workspace, version)
        self.archive = self.artifacts / f'happyro-{version}-resources-transfer.tar.gz'
        self.checksum = self.archive.with_name(self.archive.name + '.sha256')
        self.manifest = self.artifacts / 'resources-manifest.json'

    @property
    def temporary_patterns(self):
        return (*super().temporary_patterns, f'.{self.archive.name}.*.tmp', f'.{self.manifest.name}.*.tmp')

    @property
    def deliveries(self):
        return (self.archive, self.checksum, self.manifest)


@contextmanager
def version_lock(layout, create=True):
    """Never remove a lock inode: a surviving child may still hold its flock."""
    layout.validate_paths()
    if not create and not layout.lock_path.exists():
        yield None
        return
    if create:
        layout.lock_path.parent.mkdir(parents=True, exist_ok=True)
    flags = os.O_RDWR | os.O_NOFOLLOW | (os.O_CREAT if create else 0)
    descriptor = os.open(layout.lock_path, flags, 0o600)
    try:
        if not stat.S_ISREG(os.fstat(descriptor).st_mode):
            raise ValueError('Release lock must be a regular file')
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError(f'{layout.version} has a running release task; wait for it to exit before cleaning') from None
        yield descriptor
    finally:
        # Closing, rather than LOCK_UN, preserves the lock while inherited child
        # descriptors remain alive after the parent is interrupted or killed.
        os.close(descriptor)


def inherited_options():
    value = os.environ.get(LOCK_ENV)
    if value is None:
        return {}
    descriptor = int(value)
    os.fstat(descriptor)  # A stale/invalid descriptor must not silently disable protection.
    return {'pass_fds': (descriptor,)}


def require_managed_lock(workspace, path):
    """Standalone phase commands cannot write a managed directory without its lock."""
    root = Path(workspace).resolve()
    # Check lexical ancestry before resolve() so a symlink cannot escape detection.
    candidate = Path(os.path.abspath(path))
    try:
        relative = candidate.relative_to(root / 'artifacts/releases')
    except ValueError:
        return
    if not relative.parts:
        raise ValueError('A managed artifact path must select a version')
    layout = Layout(root, relative.parts[0])
    plain_path(root, candidate)
    descriptor = os.environ.get(LOCK_ENV)
    if descriptor is None:
        raise ValueError('Managed release directories are written through offline create or managed stage commands only')
    actual = os.fstat(int(descriptor))
    expected = layout.lock_path.stat()
    if (actual.st_dev, actual.st_ino) != (expected.st_dev, expected.st_ino):
        raise ValueError('Inherited lock does not match the release version')
    try:
        fcntl.flock(int(descriptor), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        raise ValueError('Another process owns the release lock') from None


def cleanup_plan(layout, include_package=False):
    state = layout.read_state()
    state_temps = sorted(layout.records.glob('.state.json.*.tmp'))
    for path in state_temps:
        if path.is_symlink() or not path.is_file():
            raise ValueError(f'Unsafe temporary state file: {path}')
    if not layout.artifacts.exists():
        return state_temps
    if state is None:
        raise ValueError(f'Unregistered output will not be removed: {layout.artifacts}')
    if not layout.artifacts.is_dir():
        raise ValueError('Release output must be a directory')
    owner_path = layout.artifacts / OWNER
    children = sorted(layout.artifacts.iterdir())
    if owner_path.is_file() and not owner_path.is_symlink():
        owner = json.loads(owner_path.read_text())
        if owner != {key: state[key] for key in ('schema', 'workspace', 'version', 'artifacts', 'run_id')}:
            raise ValueError('Release ownership marker differs from its registration')
    elif children:
        # A process can die between mkdir and the first atomic marker rename.
        if state['status'] not in ('created', 'cleaning') or any(
                not p.name.startswith(f'.{OWNER}.') or not p.name.endswith('.tmp') for p in children):
            raise ValueError('Missing release ownership marker; refusing to guess ownership')
    deliveries = set(layout.deliveries)
    allowed = {OWNER, *(p.name for p in (*layout.intermediates, *layout.deliveries))}
    for child in children:
        if child.name not in allowed and not any(child.match(pattern) for pattern in layout.temporary_patterns):
            raise ValueError(f'Unexpected file in managed output: {child}')
    # Validate the entire deletion set before deleting any entry. A staging
    # directory initialized as a deployment is never treated as disposable.
    for path in layout.artifacts.rglob('*'):
        if path.is_symlink():
            raise ValueError(f'Symlink in managed output: {path}')
        if not path.is_dir() and not path.is_file():
            raise ValueError(f'Non-regular artifact: {path}')
        if path.name in ('.env', '.git'):
            raise ValueError(f'Deployment/private data in release output: {path}')
    layout.validate_deletion()
    return state_temps + [p for p in children if p.name != OWNER and (include_package or p not in deliveries)]


@progress.operation('检查并清理版本产物')
def clean_locked(layout, include_package=False, execute=False):
    plan = cleanup_plan(layout, include_package)
    for path in plan:
        progress.message(('Remove: ' if execute else 'Would remove: ') + str(path))
    if not plan:
        progress.message('No disposable artifacts found.')
    retained = [p for p in layout.deliveries if p.exists()]
    if not include_package:
        for path in retained:
            progress.message(f'Keep delivery: {path}')
    if not execute:
        return plan
    state = layout.read_state()
    if state is not None:
        state.update(status='cleaning', stage=None)
        layout.save(state)
    for path in plan:
        if path.is_dir():
            shutil.rmtree(path)
        else:
            path.unlink()
    if layout.artifacts.exists() and (include_package or not retained):
        (layout.artifacts / OWNER).unlink(missing_ok=True)
        layout.artifacts.rmdir()
    if state is not None:
        state.update(status='cleaned', stage=None, retained_package=any(p.exists() for p in layout.deliveries))
        if not state['retained_package']:
            state.pop('package', None)
        layout.save(state)
    return plan
