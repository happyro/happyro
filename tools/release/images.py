#!/usr/bin/env python3
"""Build all images, then assemble a single offline deployment bundle."""
from tools.deployment import progress
import argparse
import json
from pathlib import Path
import subprocess
import sys

from tools.deployment.offline import ARCHES, NAMES, archive_metadata, digest, reference
from tools.release.sources import snapshot, version
from tools.release.lifecycle import inherited_options
from tools.release.package import create_zip, validate_zip_target
from tools.deployment.bundle import verify, write_json


def run(*args):
    subprocess.run(args, check=True, **inherited_options())


def inspect(reference):
    manifest = json.loads(subprocess.check_output(['skopeo', 'inspect', '--raw', reference]))
    platforms = {f'{m.get("platform", {}).get("os")}/{m.get("platform", {}).get("architecture")}'
                 for m in manifest.get('manifests', [])}
    if not {f'linux/{arch}' for arch in ARCHES} <= platforms:
        raise ValueError(f'{reference} must contain both amd64 and arm64')


@progress.operation('无缓存构建五类双架构镜像')
def build(args):
    root, output = args.workspace.resolve(), args.output.resolve()
    run(sys.executable, str(root / 'tools/resources/navigation/review.py'), 'check', '--root', str(root), '--no-color')
    state = {'version': version(root), 'sources': snapshot(root), 'images': {}}
    run('skopeo', '--version')
    run('docker', 'buildx', 'inspect')
    output.mkdir(parents=True, exist_ok=False)
    for index, name in enumerate(NAMES, 1):
        progress.message(f'[{index}/{len(NAMES)}] 镜像：{name}', 'stage')
        with progress.step(f'构建并校验 {name} amd64/arm64'):
            archive = output / f'{name}.tar'
            run('docker', 'buildx', 'build', '--no-cache', '--pull', '--platform',
                'linux/amd64,linux/arm64', '--file', str(root / (f'repos/happyro-{name}/deploy/docker/Dockerfile' if name in ('api', 'admin') else f'deploy/docker/{name}/Dockerfile')),
                '--output', f'type=oci,dest={archive}', str(root))
            inspect(f'oci-archive:{archive}')
            state['images'][name] = digest(archive)
    if snapshot(root) != state['sources']:
        raise ValueError('Sources changed while building; discard this build')
    write_json(output / 'built.json', state)
    progress.message('All five images built and checked. Nothing was pushed or deployed.')


@progress.operation('转换双架构镜像并组装离线包')
def package(args):
    output, bundle = args.output.resolve(), args.bundle.resolve()
    state = json.loads((output / 'built.json').read_text())
    release = json.loads((bundle / 'release-manifest.json').read_text())
    delivery = bundle.parent / f'happyro-{release["version"]}.zip'
    if release['status'] != 'prepared-not-built':
        raise ValueError('Use a prepared bundle; do not overwrite a completed release')
    if state['version'] != release['version'] or state['sources'] != release['sources']:
        raise ValueError('Images and bundle must have the same version and source states')
    verify(argparse.Namespace(directory=bundle, prepared=True))
    validate_zip_target(bundle, delivery)
    if set(state['images']) != set(NAMES):
        raise ValueError('Build must contain all five images')
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
    verify(argparse.Namespace(directory=bundle, prepared=False))
    create_zip(bundle, delivery, release)
    progress.message('Offline ZIP complete: configuration, resources and both image architectures.')
