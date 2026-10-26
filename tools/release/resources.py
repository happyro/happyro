"""Transfer build inputs between workspaces; not an installable runtime split."""
import hashlib
import os
from pathlib import Path
import stat
import tarfile

from tools.deployment import progress
from tools.deployment.bundle import is_macos_metadata
from tools.deployment.offline import digest
from tools.release.lifecycle import ResourceLayout, atomic_json, clean_locked, plain_path, version_lock
from tools.release.sources import version

INPUTS = ('inputs/runtime/kro-20211105', 'work/game-data/items/kro-20211105',
          'work/game-data/monsters/kro-20211105')


@progress.operation('扫描资源并生成文件清单与 SHA-256')
def inventory(root):
    entries = []
    for relative in INPUTS:
        source = plain_path(root, root / relative)
        if not source.is_dir():
            raise ValueError(f'Missing resource directory: {source}')
        progress.message(f'资源目录：{relative}')
        for directory, dirs, names in os.walk(source, followlinks=False):
            dirs[:] = sorted(name for name in dirs if not is_macos_metadata(name))
            for name in sorted(dirs + names):
                if is_macos_metadata(name):
                    continue
                path = Path(directory) / name
                mode = path.lstat().st_mode
                if not (stat.S_ISREG(mode) or stat.S_ISDIR(mode)):
                    raise ValueError(f'Only regular files/directories can be transferred: {path}')
                if stat.S_ISDIR(mode):
                    entries.append({'path': path.relative_to(root).as_posix(), 'type': 'directory'})
                else:
                    entries.append({'path': path.relative_to(root).as_posix(),
                                    'size': path.stat().st_size, 'sha256': digest(path)})
    return sorted(entries, key=lambda entry: entry['path'])


@progress.operation('写入资源传输归档')
def write_archive(root, target, entries):
    with tarfile.open(target, 'w:gz', format=tarfile.PAX_FORMAT) as archive:
        # Include empty input roots; file parents are created by tar extraction.
        for relative in INPUTS:
            archive.add(root / relative, arcname=relative, recursive=False)
        for entry in entries:
            path = plain_path(root, root / entry['path'])
            info = archive.gettarinfo(str(path), arcname=entry['path'])
            if entry.get('type') == 'directory':
                if not info.isdir():
                    raise ValueError(f'Resource type changed: {path}')
                archive.addfile(info)
                continue
            if not info.isfile():
                raise ValueError(f'Resource type changed: {path}')
            with path.open('rb') as source:
                archive.addfile(info, source)


@progress.operation('读取归档并逐项验证内容')
def verify_archive(path, entries):
    expected = {entry['path']: entry for entry in entries}
    seen = set()
    with tarfile.open(path, 'r:gz') as archive:
        for info in archive:
            if info.isdir() and info.name in INPUTS:
                continue
            if info.name not in expected or info.name in seen:
                raise ValueError(f'Unexpected resource archive member: {info.name}')
            entry = expected[info.name]
            if entry.get('type') == 'directory':
                if not info.isdir():
                    raise ValueError(f'Resource type changed: {info.name}')
                seen.add(info.name)
                continue
            if not info.isfile():
                raise ValueError(f'Unexpected resource type: {info.name}')
            with archive.extractfile(info) as source:
                actual = hashlib.file_digest(source, 'sha256').hexdigest()
            entry = expected[info.name]
            if info.size != entry['size'] or actual != entry['sha256']:
                raise ValueError(f'Resource changed during archive creation: {info.name}')
            seen.add(info.name)
    if seen != expected.keys():
        raise ValueError('Resource archive is incomplete')


@progress.operation('生成跨机器构建资源包')
def create(args):
    root = args.workspace.resolve(strict=True)
    release_version = version(root)
    if args.version and args.version != release_version:
        raise ValueError('Requested version must match deploy/docker/VERSION')
    layout = ResourceLayout(root, release_version)
    with version_lock(layout):
        if layout.artifacts.exists() and not getattr(args, 'rebuild', False):
            raise ValueError('Resource output already exists; use resources create --rebuild to replace it')
        entries = inventory(root)
        if version(root) != release_version:
            raise ValueError('VERSION changed during resource preflight')
        if getattr(args, 'rebuild', False):
            clean_locked(layout, include_package=True, execute=True)
        state, _ = layout.create({})
        temporary = layout.archive.with_name('.' + layout.archive.name + '.writing.tmp')
        try:
            write_archive(root, temporary, entries)
            verify_archive(temporary, entries)
            if inventory(root) != entries or version(root) != release_version:
                raise ValueError('Resource inputs or VERSION changed while packaging')
            checksum = digest(temporary)
            manifest = {'schema': 1, 'version': release_version, 'inputs': list(INPUTS),
                        'files': entries, 'archive': {'name': layout.archive.name,
                                                    'size': temporary.stat().st_size, 'sha256': checksum}}
            atomic_json(layout.manifest, manifest)
            layout.checksum.write_text(f'{checksum}  {layout.archive.name}\n')
            temporary.rename(layout.archive)
            state.update(status='resources-ready', files=sum('sha256' in entry for entry in entries), archive_sha256=checksum)
            layout.save(state)
        except BaseException:
            temporary.unlink(missing_ok=True)
            state.update(status='failed')
            layout.save(state)
            raise
        progress.message(f'Resource transfer ready: {layout.archive}\nFiles: {state["files"]}\nSHA-256: {checksum}', 'done')
        return layout.archive
