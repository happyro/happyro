"""Shared validation for the versioned offline bundle (standard library only)."""
import hashlib
import json
from pathlib import Path
import subprocess
import tarfile
import tempfile

NAMES = ('gateway', 'server', 'api', 'admin', 'database')
ARCHES = ('amd64', 'arm64')


def digest(path):
    checksum = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            checksum.update(chunk)
    return checksum.hexdigest()


def reference(name, release_version):
    return f'docker.io/kugarocks/happyro-{name}:{release_version}'


def archive_metadata(path, tag, arch):
    # Read Docker-save format without extracting any archive paths.
    with tarfile.open(path) as archive:
        manifest = json.load(archive.extractfile('manifest.json'))
        if len(manifest) != 1 or manifest[0].get('RepoTags') != [tag]:
            raise ValueError(f'Expected exactly one image tagged {tag}: {path}')
        raw = archive.extractfile(manifest[0]['Config']).read()
        config = json.loads(raw)
        if config.get('os') != 'linux' or config.get('architecture') != arch:
            raise ValueError(f'Wrong image platform: {path}')
        for layer in manifest[0]['Layers']:
            if not archive.getmember(layer).isfile():
                raise ValueError(f'Missing layer in {path}')
    return {'sha256': digest(path), 'size': path.stat().st_size,
            'id': 'sha256:' + hashlib.sha256(raw).hexdigest(),
            'tag': tag, 'platform': f'linux/{arch}'}


def checked_path(root, relative):
    path = Path(relative)
    if path.is_absolute() or '..' in path.parts or not path.parts:
        raise ValueError(f'Unsafe bundle path: {relative}')
    target = root / path
    if target.is_symlink() or any(parent.is_symlink() for parent in target.parents):
        raise ValueError(f'Symlink in bundle path: {relative}')
    return target


def verify_images(root, release):
    if release['status'] != 'offline-ready' or set(release['images']) != set(ARCHES):
        raise ValueError('Bundle is not offline-ready; package all images first')
    for arch in ARCHES:
        if set(release['images'][arch]) != set(NAMES):
            raise ValueError(f'Incomplete images: {arch}')
        for name in NAMES:
            expected = release['images'][arch][name]
            relative = f'images/{arch}/{name}.tar'
            path = checked_path(root, relative)
            actual = archive_metadata(path, reference(name, release['version']), arch)
            if actual != expected:
                raise ValueError(f'Image archive mismatch: {relative}')


def daemon_architecture():
    info = json.loads(subprocess.check_output(['docker', 'info', '--format', '{{json .}}']))
    arch = {'aarch64': 'arm64', 'x86_64': 'amd64'}.get(info['Architecture'], info['Architecture'])
    if info['OSType'] != 'linux' or arch not in ARCHES:
        raise ValueError('Docker must use Linux containers on amd64 or arm64')
    return arch


def verify_loaded(release, arch):
    for expected in release['images'][arch].values():
        info = json.loads(subprocess.check_output(['docker', 'image', 'inspect', expected['tag']]))[0]
        if info['Os'] != 'linux' or info['Architecture'] != arch:
            raise ValueError(f'Local image does not match release: {expected["tag"]}')
        # Docker's containerd store reports a manifest ID, not the config ID.
        # Export the local image to verify the exact config (including layer IDs).
        with tempfile.TemporaryDirectory(prefix='happyro-verify-') as temporary:
            path = Path(temporary) / 'image.tar'
            subprocess.run(['docker', 'image', 'save', '--output', str(path), expected['tag']], check=True)
            with tarfile.open(path) as archive:
                manifest = json.load(archive.extractfile('manifest.json'))
                if len(manifest) != 1:
                    raise ValueError(f'Expected one local image: {expected["tag"]}')
                raw = archive.extractfile(manifest[0]['Config']).read()
                config = json.loads(raw)
            actual = 'sha256:' + hashlib.sha256(raw).hexdigest()
            if actual != expected['id'] or config.get('os') != 'linux' or config.get('architecture') != arch:
                raise ValueError(f'Local image does not match release: {expected["tag"]}')
