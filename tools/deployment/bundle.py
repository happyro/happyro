"""Validate the self-contained offline bundle using only the standard library."""
from tools.deployment import progress
import json
from pathlib import Path
from tools.deployment.offline import checked_path, verify_images, digest

RUNTIME_FILES = ('manage.py', 'offline.py', 'custom.py', 'bundle.py', 'progress.py')

def is_macos_metadata(relative):
    return any(part == '.DS_Store' or part.startswith('._') for part in Path(relative).parts)


def files(root):
    for path in sorted(root.rglob('*')):
        if is_macos_metadata(path.relative_to(root)):
            continue
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed in packaged resources: {path}')
        if path.is_file() and path != root / 'manifest.json':
            yield path


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


@progress.operation('校验包内资源与镜像完整性')
def verify(args):
    root = args.directory.resolve()
    release = json.loads((root / 'release-manifest.json').read_text())
    if release['schema'] != 2 or (root / 'VERSION').read_text().strip() != release['version']:
        raise ValueError('Bundle version/schema mismatch')
    required = {'VERSION', 'compose.yaml', '.env.example', 'README.md',
                *[f'tools/deployment/{name}' for name in RUNTIME_FILES]}
    required.update(p.relative_to(root).as_posix() for p in files(root / 'examples/custom'))
    if not (root / 'examples/custom/npc/scripts.conf').is_file():
        raise ValueError('Missing customization templates')
    if set(release['files']) != required:
        raise ValueError('Incomplete bundle file checksums')
    for name, expected_hash in release['files'].items():
        if digest(checked_path(root, name)) != expected_hash:
            raise ValueError(f'Bundle file mismatch: {name}')
    resource_root = root / 'resources'
    if resource_root.is_symlink():
        raise ValueError('Resource root cannot be a symlink')
    manifest_path = resource_root / 'manifest.json'
    if digest(manifest_path) != release['resource_manifest_sha256']:
        raise ValueError('Resource manifest does not match this deployment release')
    manifest = json.loads(manifest_path.read_text())
    if manifest['version'] != release['version']:
        raise ValueError('Resource version must match the application version')
    expected = set()
    for entry in manifest['files']:
        relative = Path(entry['path'])
        if relative.is_absolute() or '..' in relative.parts:
            raise ValueError('Unsafe resource manifest path')
        path = resource_root / relative
        if any(parent.is_symlink() for parent in path.parents if parent != root.parent):
            raise ValueError(f'Symlink in resource path: {relative}')
        if not path.is_file() or path.is_symlink() or path.stat().st_size != entry['size'] or digest(path) != entry['sha256']:
            raise ValueError(f'Resource mismatch: {relative}')
        expected.add(relative.as_posix())
    actual = {p.relative_to(resource_root).as_posix() for p in files(resource_root)}
    if actual != expected:
        raise ValueError('Unlisted or missing resource files')
    if not getattr(args, 'prepared', False):
        verify_images(root, release)
    progress.message(f'Verified {len(expected)} resource files for {release["version"]}')
    return release
