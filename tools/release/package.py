"""Prepare release resources and create distributable ZIPs; never operate a deployment."""
from tools.deployment import progress
import json
from pathlib import Path
import re
import shutil
import tempfile
import zipfile
from tools.deployment.bundle import RUNTIME_FILES, files, is_macos_metadata, write_json
from tools.deployment.offline import digest
from tools.release.sources import snapshot, version

@progress.operation('复制资源目录')
def copy_directory(source, target):
    if not source.is_dir():
        raise ValueError(f'Missing resource directory: {source}')
    list(files(source))  # Reject links before copying.
    shutil.copytree(source, target, ignore=lambda directory, names: [
        name for name in names if is_macos_metadata(name)])


def resource_inputs(root):
    kro = root / 'inputs/runtime/kro-20211105/client'
    sources = {
        'catalog/items': root / 'work/game-data/items/kro-20211105',
        'catalog/monsters': root / 'work/game-data/monsters/kro-20211105',
        'catalog/npcs': root / 'repos/happyro-api/resources/game-data/world/npcs',
        'catalog/maps': root / 'repos/happyro-api/resources/game-data/world/maps',
        'catalog/terrain': root / 'repos/happyro-api/resources/game-data/world/terrain',
    }
    ini = (kro / 'DATA.INI').read_text()
    grfs = re.findall(r'^\s*\d+\s*=\s*([^\r\n]+\.grf)\s*$', ini, re.I | re.M)
    if not grfs or any(Path(name).name != name or not (kro / name).is_file() for name in grfs):
        raise ValueError('DATA.INI must reference existing GRF basenames')
    for source in sources.values():
        if not source.is_dir():
            raise ValueError(f'Missing resource directory: {source}')
    for name in ('AI', 'BGM', 'System', 'data'):
        if not (kro / name).is_dir():
            raise ValueError(f'Missing runtime resource directory: {kro / name}')
    return kro, sources, grfs


@progress.operation('准备离线部署与资源')
def prepare(args):
    root, output = args.workspace.resolve(), args.output.resolve()
    release_version = version(root)
    source_state = snapshot(root)
    if output.exists():
        raise ValueError('Output must be a new directory; existing deployments are never overwritten')
    kro, sources, grfs = resource_inputs(root)
    output.mkdir(parents=True)
    shutil.copyfile(root / 'deploy/docker/compose.yml', output / 'compose.yaml')
    env = (root / 'deploy/docker/.env.example').read_text().replace('@VERSION@', release_version)
    (output / '.env.example').write_text(env)
    shutil.copyfile(root / 'docs/operations/docker-deployment.md', output / 'README.md')
    tool = output / 'tools/deployment/manage.py'
    tool.parent.mkdir(parents=True)
    deployment_tools = Path(__file__).resolve().parents[1] / 'deployment'
    for name in RUNTIME_FILES:
        shutil.copyfile(deployment_tools / name, tool.with_name(name))
    copy_directory(root / 'deploy/docker/custom-templates', output / 'examples/custom')
    copy_directory(root / 'repos/happyro-server/db/import-tmpl', output / 'examples/custom/db')
    (output / 'VERSION').write_text(release_version + '\n')
    (output / 'images').mkdir()
    resources = output / 'resources'
    for name in ['database', 'control-socket', 'server-settings', 'server-logs', 'gateway-logs']:
        (output / 'data' / name).mkdir(parents=True)
    game = resources / 'kro-20211105'
    game.mkdir(parents=True)
    for name in ['DATA.INI', *grfs]:
        if (kro / name).is_symlink():
            raise ValueError(f'Unexpected link: {name}')
        shutil.copyfile(kro / name, game / name)
    for name in ['AI', 'BGM', 'System', 'data']:
        copy_directory(kro / name, game / name)
    for destination, source in sources.items():
        copy_directory(source, resources / destination)
    for path in resources.rglob('*'):
        path.chmod(0o755 if path.is_dir() else 0o644)
    entries = [{'path': p.relative_to(resources).as_posix(), 'size': p.stat().st_size, 'sha256': digest(p)} for p in files(resources)]
    write_json(resources / 'manifest.json', {'schema': 1, 'version': release_version, 'source': 'kro-20211105 runtime and generated catalog images', 'files': entries})
    if snapshot(root) != source_state:
        raise ValueError('Source state changed while preparing')
    bundle_files = ['VERSION', 'compose.yaml', '.env.example', 'README.md',
                    *[f'tools/deployment/{name}' for name in RUNTIME_FILES]]
    bundle_files += [p.relative_to(output).as_posix() for p in files(output / 'examples/custom')]
    write_json(output / 'release-manifest.json', {'schema': 2, 'version': release_version,
        'sources': source_state, 'files': {name: digest(output / name) for name in bundle_files},
        'resource_manifest_sha256': digest(resources / 'manifest.json'),
        'images': {}, 'status': 'prepared-not-built'})
    progress.message(f'Prepared {output}; {len(entries)} resource files. No images were built or pushed.')


def validate_zip_target(root, output):
    root, output = root.resolve(), output.resolve()
    if output.suffix.lower() != '.zip':
        raise ValueError('Offline bundle output must use the .zip extension')
    if output.is_relative_to(root):
        raise ValueError('Offline bundle archive must be outside the source directory')
    if output.exists():
        raise ValueError('Offline bundle archive must not already exist')
    if (root / '.env').exists():
        raise ValueError('Remove .env before creating an offline bundle archive')
    if (root / 'custom').exists():
        raise ValueError('Do not package user custom/; distribute examples/custom only')
    data = root / 'data'
    if data.is_dir() and any(path.is_file() and not is_macos_metadata(path.relative_to(data))
                             for path in data.rglob('*')):
        raise ValueError('Offline bundle data/ must not contain runtime files')
    paths = [path for path in sorted(root.rglob('*'))
             if not is_macos_metadata(path.relative_to(root))]
    if any(path.is_symlink() for path in paths):
        raise ValueError('Symlinks are not allowed in an offline bundle archive')
    return paths


@progress.operation('生成完整 ZIP')
def create_zip(root, output, release):
    root, output = root.resolve(), output.resolve()
    paths = validate_zip_target(root, output)

    output.parent.mkdir(parents=True, exist_ok=True)
    archive_root = f'happyro-{release["version"]}'
    with tempfile.NamedTemporaryFile(prefix=f'.{output.name}.', suffix='.tmp',
                                     dir=output.parent, delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with zipfile.ZipFile(temporary_path, 'w', compression=zipfile.ZIP_DEFLATED,
                             compresslevel=6, allowZip64=True) as archive:
            archive.writestr(f'{archive_root}/', b'')
            for path in paths:
                relative = path.relative_to(root).as_posix()
                archive.write(path, f'{archive_root}/{relative}')
        with zipfile.ZipFile(temporary_path) as archive:
            broken = archive.testzip()
            if broken is not None:
                raise ValueError(f'ZIP integrity check failed: {broken}')
        temporary_path.replace(output)
    finally:
        temporary_path.unlink(missing_ok=True)
    progress.message(f'Offline bundle archive: {output}')
