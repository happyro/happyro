#!/usr/bin/env python3
"""Build all images, then assemble a single offline deployment bundle."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

from offline import ARCHES, NAMES, archive_metadata, commits, digest, reference, version
from manage import verify, write_json


def run(*args):
    subprocess.run(args, check=True)


def inspect(reference):
    manifest = json.loads(subprocess.check_output(['skopeo', 'inspect', '--raw', reference]))
    platforms = {f'{m.get("platform", {}).get("os")}/{m.get("platform", {}).get("architecture")}'
                 for m in manifest.get('manifests', [])}
    if not {f'linux/{arch}' for arch in ARCHES} <= platforms:
        raise ValueError(f'{reference} must contain both amd64 and arm64')


def build(args):
    root, output = args.workspace.resolve(), args.output.resolve()
    state = {'version': version(root), 'commits': commits(root), 'images': {}}
    run('skopeo', '--version')
    run('docker', 'buildx', 'inspect')
    output.mkdir(parents=True, exist_ok=False)
    for name in NAMES:
        archive = output / f'{name}.tar'
        run('docker', 'buildx', 'build', '--no-cache', '--pull', '--platform',
            'linux/amd64,linux/arm64', '--file', str(root / f'deploy/docker/{name}/Dockerfile'),
            '--output', f'type=oci,dest={archive}', str(root))
        inspect(f'oci-archive:{archive}')
        state['images'][name] = digest(archive)
    if commits(root) != state['commits']:
        raise ValueError('Sources changed while building; discard this build')
    write_json(output / 'built.json', state)
    print('All four images built and checked. Nothing was pushed or deployed.')


def package(args):
    output, bundle = args.output.resolve(), args.bundle.resolve()
    state = json.loads((output / 'built.json').read_text())
    release = json.loads((bundle / 'release-manifest.json').read_text())
    if release['status'] != 'prepared-not-built':
        raise ValueError('Use a prepared bundle; do not overwrite a completed release')
    if state['version'] != release['version'] or state['commits'] != release['commits']:
        raise ValueError('Images and bundle must have the same version and source commits')
    verify(argparse.Namespace(directory=bundle, prepared=True))
    if set(state['images']) != set(NAMES):
        raise ValueError('Build must contain all four images')
    for name in NAMES:
        archive = output / f'{name}.tar'
        if digest(archive) != state['images'][name]:
            raise ValueError(f'Changed OCI artifact: {name}')
        inspect(f'oci-archive:{archive}')
    if any((bundle / 'images').iterdir()):
        raise ValueError('images/ must be empty; preserve or move partial output before retrying')
    images = {}
    for arch in ARCHES:
        target = bundle / 'images' / arch
        target.mkdir()
        images[arch] = {}
        for name in NAMES:
            archive = target / f'{name}.tar'
            tag = reference(name, release['version'])
            run('skopeo', '--override-os', 'linux', '--override-arch', arch, 'copy',
                f'oci-archive:{output}/{name}.tar', f'docker-archive:{archive}:{tag}')
            images[arch][name] = archive_metadata(archive, tag, arch)
    release.update(images=images, status='offline-ready')
    write_json(bundle / 'release-manifest.json', release)
    print('Offline bundle complete: configuration, resources and both image architectures.')


def main():
    argv = [arg for arg in sys.argv[1:] if arg != '--no-color']
    if not argv or argv == ['--help']:
        c = lambda code, s: s if '--no-color' in sys.argv else f'\033[{code}m{s}\033[0m'
        print('\n' + c('1;36', 'HappyRO offline image release') + '\n\n' + c('1;33', 'Commands'))
        print(c('1;32', '  build | package') + '\n\n' + c('1;33', 'Examples'))
        print(c('36', '  python3 tools/deployment/images.py build --workspace . --output artifacts/images/release'))
        print(c('36', '  python3 tools/deployment/images.py package --output artifacts/images/release --bundle artifacts/deployment/release') + '\n')
        return
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest='command', required=True)
    builder = commands.add_parser('build')
    builder.add_argument('--workspace', type=Path, required=True)
    builder.add_argument('--output', type=Path, required=True)
    packager = commands.add_parser('package')
    packager.add_argument('--output', type=Path, required=True, help='Directory containing built.json and four OCI archives')
    packager.add_argument('--bundle', type=Path, required=True)
    args = parser.parse_args(argv)
    {'build': build, 'package': package}[args.command](args)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
