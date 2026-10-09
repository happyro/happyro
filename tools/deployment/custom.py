"""User-owned customization lifecycle; never merge or replace files on upgrade."""
from pathlib import Path
import os
import shutil
import tarfile
import tempfile

DIRECTORIES = ('npc', 'db', 'resources')


def checked_files(root):
    if root.is_symlink():
        raise ValueError(f'Customization root cannot be a symlink: {root}')
    for path in sorted(root.rglob('*')):
        if path.is_symlink() or not (path.is_file() or path.is_dir()):
            raise ValueError(f'Customization must contain regular files/directories: {path}')
        if path.is_file():
            yield path


def custom_root(config):
    mounts = config['services']['map'].get('volumes', [])
    source = next((entry['source'] for entry in mounts if entry.get('target') == '/opt/happyro/custom/npc'), None)
    if source is None:
        raise ValueError('Missing custom NPC mount in Compose')
    root = Path(source).absolute().parent
    if root == Path(root.anchor) or root.is_symlink():
        raise ValueError('CUSTOM_DIR must be a dedicated directory, not a filesystem root or symlink')
    return root


def initialize(root, templates):
    list(checked_files(root))
    for name in (*DIRECTORIES, 'npc/additions', 'npc/overrides'):
        (root / name).mkdir(parents=True, exist_ok=True)
    for source in checked_files(templates):
        destination = root / source.relative_to(templates)
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not destination.exists():
            with destination.open('xb') as stream:
                stream.write(source.read_bytes())
            destination.chmod(0o644)
    validate(root)


def validate(root):
    if not root.is_dir():
        raise ValueError('Missing CUSTOM_DIR; run initialize-custom first')
    list(checked_files(root))
    for name in DIRECTORIES:
        if not (root / name).is_dir():
            raise ValueError(f'Missing custom directory: {name}; run initialize-custom')
    if not (root / 'npc/scripts.conf').is_file():
        raise ValueError('Missing custom/npc/scripts.conf')
    for path in (root / 'npc/overrides').rglob('*'):
        if path.is_file() and path.suffix != '.txt':
            raise ValueError(f'Only .txt NPC scripts may be overridden: {path}')


def backup(root, target):
    validate(root)
    with tarfile.open(target, 'w') as archive:
        for path in sorted(root.rglob('*')):
            archive.add(path, arcname=path.relative_to(root).as_posix(), recursive=False)


def validate_backup(source):
    with tarfile.open(source) as archive:
        names = set()
        directories = set()
        for entry in archive.getmembers():
            path = Path(entry.name)
            if path.is_absolute() or '..' in path.parts or not path.parts or not (entry.isfile() or entry.isdir()):
                raise ValueError('Unsafe custom backup member')
            canonical = path.as_posix()
            if canonical in names:
                raise ValueError('Duplicate custom backup member')
            names.add(canonical)
            if entry.isdir(): directories.add(canonical)
        if 'npc/scripts.conf' not in names or not set(DIRECTORIES).issubset(directories):
            raise ValueError('Incomplete custom backup')


def restore(source, root):
    validate_backup(source)
    root.parent.mkdir(parents=True, exist_ok=True)
    list(checked_files(root))
    with tempfile.TemporaryDirectory(prefix='.happyro-custom-', dir=root.parent) as temporary:
        stage = Path(temporary) / 'restored'
        stage.mkdir()
        with tarfile.open(source) as archive:
            for entry in archive.getmembers():
                target = stage / entry.name
                if entry.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with target.open('xb') as output:
                        shutil.copyfileobj(archive.extractfile(entry), output)
                    target.chmod(0o644)
        validate(stage)
        previous = Path(temporary) / 'previous'
        if root.exists():
            os.rename(root, previous)
        try:
            os.rename(stage, root)
        except OSError:
            if previous.exists():
                os.rename(previous, root)
            raise
