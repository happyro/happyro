"""Publish a verified OCI batch, then compare all remote manifests with that batch."""
from tools.deployment import progress
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

from tools.deployment.bundle import verify
from tools.deployment.offline import ARCHES, NAMES, digest, reference


def raw_index(reference_name):
    raw = subprocess.check_output([
        'skopeo', 'inspect', '--raw', '--retry-times', '5', reference_name,
    ])
    manifests = json.loads(raw).get('manifests', [])
    platforms = {(m.get('platform', {}).get('os'), m.get('platform', {}).get('architecture'))
                 for m in manifests}
    if not {('linux', arch) for arch in ARCHES} <= platforms:
        raise ValueError(f'Missing amd64/arm64 manifests: {reference_name}')
    return raw


@progress.operation('传输双架构镜像')
def copy(source, target, lock_fd=None):
    progress.message(f'{source} -> {target}')
    subprocess.run(['skopeo', 'copy', '--all', '--preserve-digests',
                    '--retry-times', '5', '--retry-delay', '5s', source, target], check=True,
                   **({'pass_fds': (lock_fd,)} if lock_fd is not None else {}))


@progress.operation('推送 Docker Hub 并核对远程摘要')
def publish(args):
    workspace, images, bundle = args.workspace.resolve(), args.images.resolve(), args.bundle.resolve()
    release_version = args.version
    state = json.loads((images / 'built.json').read_text())
    release = verify(argparse.Namespace(directory=bundle, prepared=False))
    if state['version'] != release['version'] or state['version'] != release_version:
        raise ValueError('Build, bundle and requested version must match')
    if state['sources'] != release['sources']:
        raise ValueError('Build and bundle source states differ')
    if set(state['images']) != set(NAMES):
        raise ValueError('Build must contain all five images')
    # Validate the entire batch before the first remote mutation.
    local = {}
    for name in NAMES:
        archive = images / f'{name}.tar'
        if digest(archive) != state['images'][name]:
            raise ValueError(f'Changed OCI artifact: {name}')
        local[name] = raw_index(f'oci-archive:{archive}')
    output = args.evidence.resolve()
    output.mkdir(parents=True, exist_ok=False)
    for name, raw in local.items():
        (output / f'{name}-local.json').write_bytes(raw)
    for name in NAMES:
        target = f'docker://{reference(name, release_version)}'
        copy(f'oci-archive:{images / (name + ".tar")}', target, lock_fd=getattr(args, 'lock_fd', None))
        remote = raw_index(target)
        (output / f'{name}-version.json').write_bytes(remote)
        if remote != local[name]:
            raise ValueError(f'Published version differs from local OCI: {name}')
    # latest must not move until every version tag has passed verification.
    for name in NAMES:
        copy(f'docker://{reference(name, release_version)}', f'docker://{reference(name, "latest")}',
             lock_fd=getattr(args, 'lock_fd', None))
    results = {}
    for name in NAMES:
        for tag in (release_version, 'latest'):
            raw = raw_index(f'docker://{reference(name, tag)}')
            (output / f'{name}-{tag}.json').write_bytes(raw)
            if raw != local[name]:
                raise ValueError(f'Remote {name}:{tag} differs from the local full index')
        results[name] = {'index': 'sha256:' + hashlib.sha256(local[name]).hexdigest(),
                         'manifests': json.loads(local[name])['manifests']}
        progress.message(f'OK happyro-{name}: {release_version} == latest == local OCI')
    (output / 'verified.json').write_text(json.dumps(
        {'version': release_version, 'sources': state['sources'], 'images': results}, indent=2) + '\n')
