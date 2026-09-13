"""Offline delivery checks without Docker, builds, or game services."""
import argparse
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

import images
import manage
from offline import ARCHES, NAMES, archive_metadata, digest, reference, verify_images, verify_loaded


class OfflineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def archive(self, path, tag, arch):
        path.parent.mkdir(parents=True, exist_ok=True)
        config = json.dumps({'os': 'linux', 'architecture': arch}).encode()
        manifest = json.dumps([{'Config': 'config.json', 'RepoTags': [tag],
                                'Layers': ['layer.tar']}]).encode()
        with tarfile.open(path, 'w') as archive:
            for name, data in [('config.json', config), ('manifest.json', manifest), ('layer.tar', b'layer')]:
                entry = tarfile.TarInfo(name)
                entry.size = len(data)
                archive.addfile(entry, io.BytesIO(data))

    def bundle(self):
        release = {'schema': 2, 'version': 'v9.0.0', 'status': 'offline-ready', 'images': {}, 'files': {}}
        (self.root / 'VERSION').write_text('v9.0.0\n')
        for name in ['compose.yaml', '.env.example', 'README.md',
                     'tools/deployment/manage.py', 'tools/deployment/offline.py']:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('fixture')
        release['files'] = {name: digest(self.root / name) for name in [
            'VERSION', 'compose.yaml', '.env.example', 'README.md',
            'tools/deployment/manage.py', 'tools/deployment/offline.py']}
        resources = self.root / 'resources'
        resources.mkdir()
        (resources / 'manifest.json').write_text(json.dumps({'version': 'v9.0.0', 'files': []}))
        release['resource_manifest_sha256'] = digest(resources / 'manifest.json')
        for arch in ARCHES:
            release['images'][arch] = {}
            for name in NAMES:
                path = self.root / 'images' / arch / f'{name}.tar'
                tag = reference(name, release['version'])
                self.archive(path, tag, arch)
                release['images'][arch][name] = archive_metadata(path, tag, arch)
        return release

    def test_complete_bundle_and_tampering(self):
        release = self.bundle()
        verify_images(self.root, release)
        with (self.root / 'images/arm64/admin.tar').open('ab') as stream:
            stream.write(b'changed')
        with self.assertRaisesRegex(ValueError, 'mismatch'):
            verify_images(self.root, release)

    def test_wrong_platform_and_tag(self):
        path = self.root / 'image.tar'
        self.archive(path, 'happyro/admin:v9.0.0', 'arm64')
        with self.assertRaisesRegex(ValueError, 'platform'):
            archive_metadata(path, 'happyro/admin:v9.0.0', 'amd64')
        with self.assertRaisesRegex(ValueError, 'tagged'):
            archive_metadata(path, 'happyro/admin:v8.0.0', 'arm64')

    def test_skopeo_normalized_reference(self):
        path = self.root / 'skopeo.tar'
        self.archive(path, 'docker.io/kugarocks/happyro-gateway:v9.0.0', 'arm64')
        metadata = archive_metadata(path, reference('gateway', 'v9.0.0'), 'arm64')
        self.assertEqual(metadata['tag'], 'docker.io/kugarocks/happyro-gateway:v9.0.0')

    def test_loaded_config_verified_independently_of_manifest_id(self):
        path = self.root / 'local.tar'
        tag = reference('gateway', 'v9.0.0')
        self.archive(path, tag, 'arm64')
        metadata = archive_metadata(path, tag, 'arm64')
        release = {'images': {'arm64': {'gateway': metadata}}}
        info = json.dumps([{'Id': 'sha256:manifest-id', 'Os': 'linux', 'Architecture': 'arm64'}]).encode()

        def save(command, **kwargs):
            self.archive(Path(command[4]), tag, 'arm64')

        with patch('offline.subprocess.check_output', return_value=info), patch('offline.subprocess.run', side_effect=save):
            verify_loaded(release, 'arm64')
            metadata['id'] = 'sha256:changed-config'
            with self.assertRaisesRegex(ValueError, 'does not match'):
                verify_loaded(release, 'arm64')

    def test_prepared_bundle_not_deployable(self):
        release = self.bundle()
        release.update(status='prepared-not-built', images={})
        (self.root / 'release-manifest.json').write_text(json.dumps(release))
        manage.verify(argparse.Namespace(directory=self.root, prepared=True))
        with self.assertRaisesRegex(ValueError, 'offline-ready'):
            manage.verify(argparse.Namespace(directory=self.root))

    def test_import_only_daemon_architecture(self):
        release = self.bundle()
        (self.root / 'release-manifest.json').write_text(json.dumps(release))
        with patch('manage.daemon_architecture', return_value='arm64'), patch('manage.subprocess.run') as run, patch('manage.verify_loaded') as loaded:
            manage.import_images(argparse.Namespace(directory=self.root))
            self.assertEqual(run.call_count, 4)
            self.assertTrue(all('/images/arm64/' in call.args[0][-1] for call in run.call_args_list))
            loaded.assert_called_once_with(release, 'arm64')

    def test_package_commit_mismatch_never_converts(self):
        output = self.root / 'output'
        bundle = self.root / 'bundle'
        output.mkdir()
        bundle.mkdir()
        (output / 'built.json').write_text(json.dumps({'version': 'v9.0.0', 'commits': {'root': 'a'}}))
        (bundle / 'release-manifest.json').write_text(json.dumps({'version': 'v9.0.0', 'commits': {'root': 'b'}, 'status': 'prepared-not-built'}))
        with patch('images.run') as run, self.assertRaisesRegex(ValueError, 'same version'):
            images.package(argparse.Namespace(output=output, bundle=bundle))
        run.assert_not_called()

    def test_deploy_rejects_old_env_before_start(self):
        release = self.bundle()
        (self.root / '.env').write_text('fixture')
        services = {name: {'image': 'old:version', 'pull_policy': 'never'} for name in
                    ['gateway', 'admin', 'admin-init', 'database', 'login', 'char', 'map', 'web-api']}
        with patch('manage.verify', return_value=release), patch('manage.compose') as compose:
            compose.return_value.stdout = json.dumps({'services': services})
            with self.assertRaisesRegex(ValueError, 'Update .env'):
                manage.deploy(argparse.Namespace(directory=self.root))
            self.assertEqual(compose.call_count, 1)
            self.assertEqual(compose.call_args.args[1], 'config')

    def test_package_completes_only_after_all_archives(self):
        output = self.root / 'build'
        output.mkdir()
        (self.root / 'images').mkdir()
        state = {'version': 'v9.0.0', 'commits': {'root': 'a'}, 'images': {}}
        for name in NAMES:
            path = output / f'{name}.tar'
            path.write_bytes(b'oci-fixture')
            state['images'][name] = digest(path)
        (output / 'built.json').write_text(json.dumps(state))
        release = {**state, 'status': 'prepared-not-built', 'images': {}}
        manifest = self.root / 'release-manifest.json'
        manifest.write_text(json.dumps(release))

        def convert(*command):
            destination = command[-1].removeprefix('docker-archive:')
            path, tag = destination.split(':', 1)
            self.archive(Path(path), tag, command[4])
            self.assertEqual(json.loads(manifest.read_text())['status'], 'prepared-not-built')

        with patch('images.verify'), patch('images.inspect'), patch('images.run', side_effect=convert):
            images.package(argparse.Namespace(output=output, bundle=self.root))
        final = json.loads(manifest.read_text())
        self.assertEqual(final['status'], 'offline-ready')
        verify_images(self.root, final)


if __name__ == '__main__':
    unittest.main()
