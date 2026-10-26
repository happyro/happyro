"""Read-only observations; a recorded successful run is not a content check."""
import argparse
import json
import zipfile

from tools.deployment import progress
from tools.deployment.bundle import verify
from tools.deployment.offline import digest
from tools.release import resources
from tools.release.lifecycle import ResourceLayout, plain_path, version_lock
from tools.release.operations import layout_for


def checked_file(layout, path, metadata):
    plain_path(layout.root, path)
    if not path.is_file() or path.stat().st_size != metadata['size'] or digest(path) != metadata['sha256']:
        raise ValueError(f'Missing or changed artifact: {path}')


@progress.operation('验证已登记产物的当前内容')
def verify_content(layout, state):
    if not state:
        raise ValueError('Cannot verify artifacts without a registration')
    result = {}
    if isinstance(layout, ResourceLayout):
        for path in layout.deliveries:
            plain_path(layout.root, path)
        manifest = json.loads(layout.manifest.read_text())
        if manifest['version'] != layout.version or manifest['archive']['name'] != layout.archive.name:
            raise ValueError('Resource manifest identity mismatch')
        if manifest['archive']['sha256'] != state.get('archive_sha256'):
            raise ValueError('Resource manifest differs from registered checksum')
        checked_file(layout, layout.archive, manifest['archive'])
        if layout.checksum.read_text() != f'{state["archive_sha256"]}  {layout.archive.name}\n':
            raise ValueError('Resource checksum file mismatch')
        resources.verify_archive(layout.archive, manifest['files'])
        return {'archive_and_manifest': 'passed'}
    if layout.zip.exists():
        metadata = state.get('package', {})
        if metadata.get('path') != layout.zip.relative_to(layout.root).as_posix():
            raise ValueError('ZIP is not recorded as a completed package')
        checked_file(layout, layout.zip, metadata)
        with zipfile.ZipFile(layout.zip) as archive:
            if archive.testzip():
                raise ValueError('ZIP CRC mismatch')
        result['complete_zip'] = 'passed'
    else:
        result['complete_zip'] = 'missing'
    if layout.bundle.exists():
        plain_path(layout.root, layout.bundle)
        release = json.loads((layout.bundle / 'release-manifest.json').read_text())
        if release['version'] != layout.version or release['sources'] != state['sources']:
            raise ValueError('Bundle registration mismatch')
        verify(argparse.Namespace(directory=layout.bundle, prepared=release['status'] == 'prepared-not-built'))
        result['bundle'] = 'passed'
    else:
        result['bundle'] = 'missing'
    if layout.images.exists():
        plain_path(layout.root, layout.images)
        built = json.loads((layout.images / 'built.json').read_text())
        from tools.deployment.offline import NAMES
        if built['version'] != layout.version or built['sources'] != state['sources'] or set(built['images']) != set(NAMES):
            raise ValueError('Image build registration mismatch')
        for name, checksum in built['images'].items():
            path = plain_path(layout.root, layout.images / f'{name}.tar')
            if digest(path) != checksum:
                raise ValueError(f'OCI checksum mismatch: {name}')
        result['oci_images'] = 'passed'
    else:
        result['oci_images'] = 'missing'
    if any(path.exists() for path in layout.split_paths):
        for path in layout.split_paths:
            plain_path(layout.root, path)
        report = json.loads(layout.split_paths[2].read_text())
        if report['schema'] != 2 or report['version'] != layout.version or report['run_id'] != state['run_id'] or report['source'] != state.get('package'):
            raise ValueError('Split registration mismatch')
        if set(report['archives']) != {path.name for path in layout.split_paths[:2]}:
            raise ValueError('Incomplete split report')
        note = layout.split_paths[3]
        if report['readme']['name'] != note.name:
            raise ValueError('Split README identity mismatch')
        checked_file(layout, note, report['readme'])
        for path in layout.split_paths[:2]:
            checked_file(layout, path, report['archives'][path.name])
            with zipfile.ZipFile(path) as archive:
                if archive.read(note.name) != note.read_bytes():
                    raise ValueError('Split README differs between deliveries')
        result['split_archives'] = 'passed'
    else:
        result['split_archives'] = 'missing'
    if all(value == 'missing' for value in result.values()):
        raise ValueError('No artifacts available to verify')
    return result


def show(args):
    layout = layout_for(args)
    state = layout.read_state()
    paths = (*layout.intermediates, *layout.deliveries)
    for path in paths:
        plain_path(layout.root, path)
    result = {'version': layout.version, 'group': args.group, 'registered': state is not None,
              'recorded_status': state.get('status') if state else None,
              'recorded_stage': state.get('stage') if state else None,
              'artifacts': {str(p): p.exists() for p in paths}, 'integrity': 'not_checked'}
    if args.verify:
        try:
            with version_lock(layout, create=False):
                result['integrity'] = verify_content(layout, layout.read_state())
        except (ValueError, OSError, KeyError, zipfile.BadZipFile) as error:
            result['integrity'] = 'failed'
            progress.message(json.dumps(result, ensure_ascii=False, indent=2))
            raise ValueError(f'Artifact verification failed: {error}') from error
    progress.message(json.dumps(result, ensure_ascii=False, indent=2))
    return result
