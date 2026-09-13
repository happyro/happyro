#!/usr/bin/env python3
"""Prepare and operate offline bundles; only deploy explicitly starts services."""
import argparse
import base64
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import subprocess
import sys
import tempfile
import zipfile

from offline import (NAMES, commits, version, checked_path, verify_images, digest,
                     daemon_architecture, verify_loaded, reference)


def files(root):
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed in packaged resources: {path}')
        if path.is_file() and path != root / 'manifest.json':
            yield path


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def copy_directory(source, target):
    if not source.is_dir():
        raise ValueError(f'Missing resource directory: {source}')
    list(files(source))  # Reject links before copying.
    shutil.copytree(source, target)


def prepare(args):
    root, output = args.workspace.resolve(), args.output.resolve()
    release_version = version(root)
    source_commits = commits(root)
    if output.exists():
        raise ValueError('Output must be a new directory; existing deployments are never overwritten')
    kro = root / 'inputs/runtime/kro-20211105/client'
    sources = {
        'catalog/items': root / 'work/game-data/items/kro-20211105',
        'catalog/monsters': root / 'work/game-data/monsters/kro-20211105',
        'catalog/npcs': root / 'repos/happyro-admin/backend/resources/game-data/world/npcs',
        'catalog/maps': root / 'repos/happyro-admin/backend/resources/game-data/world/maps',
        'catalog/terrain': root / 'repos/happyro-admin/backend/resources/game-data/world/terrain',
    }
    ini = (kro / 'DATA.INI').read_text()
    grfs = re.findall(r'^\s*\d+\s*=\s*([^\r\n]+\.grf)\s*$', ini, re.I | re.M)
    if not grfs or any(Path(name).name != name or not (kro / name).is_file() for name in grfs):
        raise ValueError('DATA.INI must reference existing GRF basenames')
    for source in sources.values():
        if not source.is_dir():
            raise ValueError(f'Missing resource directory: {source}')
    output.mkdir(parents=True)
    shutil.copyfile(root / 'deploy/docker/compose.yml', output / 'compose.yaml')
    env = (root / 'deploy/docker/.env.example').read_text().replace('@VERSION@', release_version)
    (output / '.env.example').write_text(env)
    shutil.copyfile(root / 'docs/operations/docker-deployment.md', output / 'README.md')
    tool = output / 'tools/deployment/manage.py'
    tool.parent.mkdir(parents=True)
    shutil.copyfile(Path(__file__), tool)
    shutil.copyfile(Path(__file__).with_name('offline.py'), tool.with_name('offline.py'))
    (output / 'VERSION').write_text(release_version + '\n')
    (output / 'images').mkdir()
    resources = output / 'resources'
    for name in ['database', 'admin-storage', 'control-socket', 'server-settings', 'server-logs', 'gateway-logs']:
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
    if commits(root) != source_commits:
        raise ValueError('Source commits changed while preparing')
    bundle_files = ['VERSION', 'compose.yaml', '.env.example', 'README.md',
                    'tools/deployment/manage.py', 'tools/deployment/offline.py']
    write_json(output / 'release-manifest.json', {'schema': 2, 'version': release_version,
        'commits': source_commits, 'files': {name: digest(output / name) for name in bundle_files},
        'resource_manifest_sha256': digest(resources / 'manifest.json'),
        'images': {}, 'status': 'prepared-not-built'})
    print(f'Prepared {output}; {len(entries)} resource files. No images were built or pushed.')


def verify(args):
    root = args.directory.resolve()
    release = json.loads((root / 'release-manifest.json').read_text())
    if release['schema'] != 2 or (root / 'VERSION').read_text().strip() != release['version']:
        raise ValueError('Bundle version/schema mismatch')
    required = {'VERSION', 'compose.yaml', '.env.example', 'README.md',
                'tools/deployment/manage.py', 'tools/deployment/offline.py'}
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
    print(f'Verified {len(expected)} resource files for {release["version"]}')
    return release


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
    data = root / 'data'
    if data.is_dir() and any(path.is_file() for path in data.rglob('*')):
        raise ValueError('Offline bundle data/ must not contain runtime files')
    paths = sorted(root.rglob('*'))
    if any(path.is_symlink() for path in paths):
        raise ValueError('Symlinks are not allowed in an offline bundle archive')
    return paths


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
    print(f'Offline bundle archive: {output}')


def initialize(args):
    verify(args)
    target = args.directory.resolve() / '.env'
    template = target.with_name('.env.example').read_text()
    values = {key: secrets.token_hex(24) for key in ['DB_PASSWORD', 'ADMIN_DB_PASSWORD', 'MARIADB_ROOT_PASSWORD', 'INTERSERVER_PASSWORD', 'GAME_CONTROL_TOKEN']}
    # rAthena inter-server authentication stores passwords in a 24-byte buffer.
    values['INTERSERVER_PASSWORD'] = secrets.token_hex(10)
    values['APP_KEY'] = 'base64:' + base64.b64encode(secrets.token_bytes(32)).decode()
    for key, value in values.items():
        template = re.sub(rf'^{key}=.*$', f'{key}={value}', template, flags=re.M)
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as stream:
        stream.write(template)
    print('Created .env with unique secrets. Set public URLs before starting Compose.')


def import_images(args):
    release = verify(args)
    arch = daemon_architecture()
    for name in NAMES:
        subprocess.run(['docker', 'load', '--input',
                        str(args.directory.resolve() / 'images' / arch / f'{name}.tar')], check=True)
    verify_loaded(release, arch)
    print(f'Loaded and verified {release["version"]} linux/{arch} images')


def deploy(args):
    root = args.directory.resolve()
    if not (root / '.env').is_file():
        raise ValueError('Run initialize and edit .env public URLs before deploying')
    release = verify(args)
    config = json.loads(compose(root, 'config', '--format', 'json', capture_output=True, text=True).stdout)
    services = {'gateway': 'gateway', 'admin': 'admin', 'admin-init': 'admin',
                'database': 'database', 'login': 'server', 'char': 'server',
                'map': 'server', 'web-api': 'server'}
    if set(config['services']) != set(services):
        raise ValueError('Unexpected Compose services')
    for service, name in services.items():
        entry = config['services'][service]
        if entry['image'] != reference(name, release['version']) or entry.get('pull_policy') != 'never':
            raise ValueError(f'Update .env image references for this release: {service}')
    verify_loaded(release, daemon_architecture())
    compose(root, 'up', '-d', '--pull', 'never', '--no-build')
    compose(root, 'ps', '-a')


def compose(root, *args, **kwargs):
    return subprocess.run(['docker', 'compose', '--project-directory', str(root), '-f', str(root / 'compose.yaml'), *args], check=True, **kwargs)


def backup(args):
    root, output = args.directory.resolve(), args.output.resolve()
    if output.exists():
        raise ValueError('Backup output already exists')
    running = subprocess.check_output(['docker','compose','--project-directory',str(root),'-f',str(root/'compose.yaml'),'ps','--services','--status','running'], text=True).split()
    if set(running) != {'database'}:
        raise ValueError('Keep only database running for a consistent backup')
    # Callers quiesce writes explicitly; the tool never stops a deployment.
    output.mkdir(parents=True, mode=0o700)
    command = 'exec mariadb-dump --user=root --password="$MARIADB_ROOT_PASSWORD" --single-transaction --routines --events --triggers --databases happyro happyro_log happyro_admin'
    with (output / 'databases.sql').open('wb') as stream:
        compose(root, 'exec', '-T', 'database', 'sh', '-c', command, stdout=stream)
    for service, target, directories in [('admin', 'admin-files.tar', ['/opt/admin/storage', '/run/happyro-settings'])]:
        with (output / target).open('wb') as stream:
            compose(root, 'run', '--rm', '--no-deps', '-T', '--entrypoint', 'tar', service, '-cf', '-', *directories, stdout=stream)
    for name in ['.env', 'compose.yaml', 'release-manifest.json']:
        shutil.copyfile(root / name, output / name)
    write_json(output / 'checksums.json', {p.name: digest(p) for p in output.iterdir() if p.is_file()})
    print(f'Backup saved to {output}; contains secrets, keep private')


def restore(args):
    if not args.confirm_replace:
        raise ValueError('Restore replaces existing data; use --confirm-replace after stopping all writers')
    root, source = args.directory.resolve(), args.backup.resolve()
    checksums = json.loads((source / 'checksums.json').read_text())
    for name, value in checksums.items():
        if Path(name).name != name or digest(source / name) != value:
            raise ValueError('Backup checksum mismatch')
    running = subprocess.check_output(['docker','compose','--project-directory',str(root),'-f',str(root/'compose.yaml'),'ps','--services','--status','running'], text=True).split()
    if set(running) - {'database'}:
        raise ValueError('Stop every service except database before restoring')
    if 'database' not in running:
        raise ValueError('Start database before restoring')
    with (source / 'databases.sql').open('rb') as stream:
        compose(root, 'exec', '-T', 'database', 'sh', '-c', 'exec mariadb --user=root --password="$MARIADB_ROOT_PASSWORD"', stdin=stream)
    with (source / 'admin-files.tar').open('rb') as stream:
        compose(root, 'run', '--rm', '--no-deps', '-T', '--entrypoint', 'tar', 'admin', '-xf', '-', '-C', '/', stdin=stream)
    print('Restored databases and admin files. Use the backed-up APP_KEY and matching image release before starting.')


def help_text(no_color):
    def color(code, text):
        return text if no_color else f'\033[{code}m{text}\033[0m'
    print('\n' + color('1;36', 'HappyRO deployment tools') + '\n')
    print(color('1;33', 'Commands'))
    print(color('1;32', '  prepare | verify | initialize | import-images | deploy | backup | restore'))
    print('\n' + color('1;33', 'Examples'))
    for line in ['prepare --workspace . --output artifacts/deployment/release', 'verify --directory ./happyro-deploy', 'import-images --directory ./happyro-deploy', 'initialize --directory ./happyro-deploy', 'deploy --directory ./happyro-deploy', 'backup --directory ./happyro-deploy --output ./backup', 'restore --directory ./happyro-deploy --backup ./backup --confirm-replace']:
        print(color('36', '  python3 tools/deployment/manage.py ' + line))
    print('\nUse --no-color for plain output; COMMAND --help lists arguments.\n')


def main():
    argv = sys.argv[1:]
    no_color = '--no-color' in argv
    argv = [arg for arg in argv if arg != '--no-color']
    if not argv or argv == ['--help'] or argv == ['help']:
        help_text(no_color)
        return
    parser = argparse.ArgumentParser(description='HappyRO deployment tools')
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ['prepare', 'verify', 'initialize', 'import-images', 'deploy', 'backup', 'restore']:
        command = commands.add_parser(name)
        if name == 'prepare':
            command.add_argument('--workspace', type=Path, required=True)
        else:
            command.add_argument('--directory', type=Path, required=True)
        if name in ['prepare', 'backup']:
            command.add_argument('--output', type=Path, required=True)
        if name == 'restore':
            command.add_argument('--backup', type=Path, required=True)
            command.add_argument('--confirm-replace', action='store_true')
        if name == 'verify':
            command.add_argument('--prepared', action='store_true', help='Check a preparation bundle before images are packaged')
    args = parser.parse_args(argv)
    {'prepare': prepare, 'verify': verify, 'initialize': initialize, 'import-images': import_images,
     'deploy': deploy, 'backup': backup, 'restore': restore}[args.command](args)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
