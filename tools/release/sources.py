"""Track the exact Git-visible working sources, including uncommitted changes."""
from tools.deployment import progress
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess

REPOS = ('.', 'repos/happyro-client', 'repos/happyro-gateway',
         'repos/happyro-server', 'repos/happyro-admin', 'repos/happyro-api')


def version(root):
    value = (root / 'deploy/docker/VERSION').read_text().strip()
    if not re.fullmatch(r'v\d+\.\d+\.\d+', value):
        raise ValueError('Invalid deploy/docker/VERSION')
    return value


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args])


def paths(root):
    return sorted(set(git(root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z').split(b'\0')) - {b''})


def repository(root):
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    status = git(root, 'status', '--porcelain', '-z')
    names = paths(root)
    checksum = hashlib.sha256()
    for name in names:
        relative = Path(os.fsdecode(name))
        if relative.is_absolute() or '..' in relative.parts:
            raise ValueError('Unsafe source path')
        path = root / relative
        if any(parent.is_symlink() for parent in path.parents if parent != root.parent):
            raise ValueError(f'Symlink source directory: {relative}')
        try:
            before = path.lstat()
        except FileNotFoundError:
            record = [os.fsdecode(name), 'deleted']
        else:
            if stat.S_ISLNK(before.st_mode):
                record = [os.fsdecode(name), 'symlink', os.readlink(path)]
            elif stat.S_ISREG(before.st_mode):
                content = hashlib.sha256()
                with path.open('rb') as source:
                    for chunk in iter(lambda: source.read(1024 * 1024), b''):
                        content.update(chunk)
                after = path.lstat()
                if (before.st_ino, before.st_size, before.st_mtime_ns, before.st_mode) != (
                        after.st_ino, after.st_size, after.st_mtime_ns, after.st_mode):
                    raise ValueError(f'Source changed while hashing: {relative}')
                record = [os.fsdecode(name), 'file', bool(before.st_mode & 0o111), content.hexdigest()]
            else:
                raise ValueError(f'Unsupported source entry (including Git submodules): {relative}')
        checksum.update(json.dumps(record, ensure_ascii=True, separators=(',', ':')).encode() + b'\n')
    if (git(root, 'rev-parse', 'HEAD').decode().strip() != head
            or git(root, 'status', '--porcelain', '-z') != status or paths(root) != names):
        raise ValueError('Source state changed while fingerprinting')
    return {'head': head, 'dirty': bool(status), 'tree_sha256': checksum.hexdigest(),
            'files': len(names), 'fingerprint': 'git-visible-working-tree-v1'}


@progress.operation('计算六个仓库的源码指纹')
def snapshot(root):
    root = Path(root).resolve()
    return {repo: repository(root / repo) for repo in REPOS}
