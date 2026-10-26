"""Offline delivery checks without Docker, builds, or game services."""
import argparse
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch
import zipfile
import subprocess
import sys

from tools.release import images, package
from tools.deployment import manage, bundle
from tools.deployment.offline import ARCHES, NAMES, archive_metadata, digest, reference, verify_images, verify_loaded


class OfflineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()

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

    def test_gateway_socket_proxy_is_configurable_in_release_templates(self):
        repository = Path(__file__).resolve().parents[2]
        environment = (repository / 'deploy/docker/.env.example').read_text()
        compose = (repository / 'deploy/docker/compose.yml').read_text()
        self.assertIn('\nSOCKET_PROXY_URL=\n', environment)
        self.assertIn('SOCKET_PROXY_URL: ${SOCKET_PROXY_URL:-}', compose)

    def bundle(self):
        release = {'schema': 2, 'version': 'v9.0.0', 'status': 'offline-ready', 'images': {}, 'files': {}}
        (self.root / 'VERSION').write_text('v9.0.0\n')
        for name in ['compose.yaml', '.env.example', 'README.md',
                     'tools/deployment/manage.py', 'tools/deployment/offline.py', 'tools/deployment/custom.py', 'tools/deployment/bundle.py', 'tools/deployment/progress.py', 'examples/custom/npc/scripts.conf']:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('fixture')
        release['files'] = {name: digest(self.root / name) for name in [
            'VERSION', 'compose.yaml', '.env.example', 'README.md',
            'tools/deployment/manage.py', 'tools/deployment/offline.py', 'tools/deployment/custom.py', 'tools/deployment/bundle.py', 'tools/deployment/progress.py', 'examples/custom/npc/scripts.conf']}
        resources = self.root / 'resources'
        resources.mkdir()
        (resources / 'manifest.json').write_text(json.dumps({'version': 'v9.0.0', 'files': []}))
        release['resource_manifest_sha256'] = digest(resources / 'manifest.json')
        (self.root / 'data/database').mkdir(parents=True)
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
        with (self.root / 'images/arm64/api.tar').open('ab') as stream:
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

        with patch('tools.deployment.offline.subprocess.check_output', return_value=info), patch('tools.deployment.offline.subprocess.run', side_effect=save):
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
        with patch('tools.deployment.manage.daemon_architecture', return_value='arm64'), patch('tools.deployment.manage.subprocess.run') as run, patch('tools.deployment.manage.verify_loaded') as loaded:
            manage.import_images(argparse.Namespace(directory=self.root))
            self.assertEqual(run.call_count, len(NAMES))
            self.assertTrue(all('/images/arm64/' in call.args[0][-1] for call in run.call_args_list))
            loaded.assert_called_once_with(release, 'arm64')

    def test_package_commit_mismatch_never_converts(self):
        output = self.root / 'output'
        bundle = self.root / 'bundle'
        output.mkdir()
        bundle.mkdir()
        (output / 'built.json').write_text(json.dumps({'version': 'v9.0.0', 'sources': {'root': 'a'}}))
        (bundle / 'release-manifest.json').write_text(json.dumps({'version': 'v9.0.0', 'sources': {'root': 'b'}, 'status': 'prepared-not-built'}))
        with patch('tools.release.images.run') as run, self.assertRaisesRegex(ValueError, 'same version'):
            images.package(argparse.Namespace(output=output, bundle=bundle))
        run.assert_not_called()

    def test_deploy_rejects_old_env_before_start(self):
        release = self.bundle()
        (self.root / '.env').write_text('fixture')
        services = {name: {'image': 'old:version', 'pull_policy': 'never'} for name in
                    ['gateway', 'admin', 'api', 'api-init', 'database', 'login', 'char', 'map', 'web-api']}
        with patch('tools.deployment.manage.verify', return_value=release), patch('tools.deployment.manage.compose') as compose:
            compose.return_value.stdout = json.dumps({'services': services})
            with self.assertRaisesRegex(ValueError, 'Update .env'):
                manage.deploy(argparse.Namespace(directory=self.root))
            self.assertEqual(compose.call_count, 1)
            self.assertEqual(compose.call_args.args[1], 'config')

    def test_schema_failure_prevents_starting_game_services(self):
        release = {'version': 'v9.0.0'}
        (self.root / '.env').write_text('fixture')
        names = {'gateway': 'gateway', 'admin': 'admin', 'api': 'api', 'api-init': 'api',
                 'database': 'database', 'login': 'server', 'char': 'server',
                 'map': 'server', 'web-api': 'server'}
        config = {'services': {service: {'image': reference(image, release['version']),
                  'pull_policy': 'never'} for service, image in names.items()}}
        calls = []
        def compose(root, *args, **kwargs):
            calls.append(args)
            if args[0] == 'config':
                return argparse.Namespace(stdout=json.dumps(config))
            if args[0] == 'exec':
                raise RuntimeError('schema failed')
        with patch('tools.deployment.manage.verify', return_value=release), patch('tools.deployment.manage.compose', side_effect=compose), \
             patch('tools.deployment.manage.custom.custom_root'), patch('tools.deployment.manage.custom.validate'), \
             patch('tools.deployment.manage.verify_loaded'), patch('tools.deployment.manage.daemon_architecture', return_value='amd64'):
            with self.assertRaisesRegex(RuntimeError, 'schema failed'):
                manage.deploy(argparse.Namespace(directory=self.root))
        starts = [call for call in calls if call[0] == 'up']
        self.assertEqual(len(starts), 1)
        self.assertEqual(starts[0][-1], 'database')

    def test_package_completes_only_after_all_archives(self):
        output = self.root / 'build'
        bundle = self.root / 'bundle'
        output.mkdir()
        (bundle / 'images').mkdir(parents=True)
        (bundle / 'data/database').mkdir(parents=True)
        state = {'version': 'v9.0.0', 'sources': {'root': 'a'}, 'images': {}}
        for name in NAMES:
            path = output / f'{name}.tar'
            path.write_bytes(b'oci-fixture')
            state['images'][name] = digest(path)
        (output / 'built.json').write_text(json.dumps(state))
        release = {**state, 'status': 'prepared-not-built', 'images': {}}
        manifest = bundle / 'release-manifest.json'
        manifest.write_text(json.dumps(release))

        def convert(*command):
            destination = command[-1].removeprefix('docker-archive:')
            path, tag = destination.split(':', 1)
            self.archive(Path(path), tag, command[4])
            self.assertEqual(json.loads(manifest.read_text())['status'], 'prepared-not-built')

        with patch('tools.release.images.verify'), patch('tools.release.images.inspect'), patch('tools.release.images.run', side_effect=convert):
            archive = self.root / 'happyro-v9.0.0.zip'
            images.package(argparse.Namespace(output=output, bundle=bundle))
        final = json.loads(manifest.read_text())
        self.assertEqual(final['status'], 'offline-ready')
        verify_images(bundle, final)
        self.assertTrue(archive.is_file())
        self.assertFalse(Path(str(archive) + '.sha256').exists())
        with zipfile.ZipFile(archive) as packaged:
            self.assertIsNone(packaged.testzip())
            self.assertIn('happyro-v9.0.0/release-manifest.json', packaged.namelist())
            self.assertIn('happyro-v9.0.0/images/arm64/api.tar', packaged.namelist())
            self.assertIn('happyro-v9.0.0/data/database/', packaged.namelist())

    def test_prepare_filters_macos_metadata_without_changing_sources(self):
        workspace = self.root / 'workspace'
        output = self.root / 'prepared'
        sources = [
            'inputs/runtime/kro-20211105/client/AI',
            'inputs/runtime/kro-20211105/client/BGM',
            'inputs/runtime/kro-20211105/client/System',
            'inputs/runtime/kro-20211105/client/data',
            'work/game-data/items/kro-20211105',
            'work/game-data/monsters/kro-20211105',
            *[f'repos/happyro-api/resources/game-data/world/{name}'
              for name in ['npcs', 'maps', 'terrain']],
            'deploy/docker/custom-templates',
            'repos/happyro-server/db/import-tmpl',
        ]
        for name in sources:
            source = workspace / name
            source.mkdir(parents=True)
            (source / 'real.txt').write_text('resource')
            (source / '.DS_Store').write_bytes(b'finder')
            (source / '._real.txt').write_bytes(b'appledouble')
            (source / '._directory').mkdir()
            (source / '._directory/nested').write_bytes(b'metadata')
        for name, content in {
            'deploy/docker/compose.yml': 'services: {}',
            'deploy/docker/.env.example': 'VERSION=@VERSION@',
            'docs/operations/docker-deployment.md': 'Deployment',
            'deploy/docker/custom-templates/npc/scripts.conf': '// template',
            'inputs/runtime/kro-20211105/client/DATA.INI': '0=data.grf',
            'inputs/runtime/kro-20211105/client/data.grf': 'grf',
        }.items():
            path = workspace / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content)
        with patch('tools.release.package.snapshot', return_value={'root': 'fixture'}), \
             patch('tools.release.package.version', return_value='v9.0.0'):
            package.prepare(argparse.Namespace(workspace=workspace, output=output))
        self.assertFalse(any(bundle.is_macos_metadata(p.relative_to(output)) for p in output.rglob('*')))
        self.assertTrue((workspace / sources[0] / '._real.txt').exists())
        manifest = json.loads((output / 'resources/manifest.json').read_text())
        self.assertEqual(len(manifest['files']), 11)
        self.assertTrue((output / '.env.example').exists())
        manage.verify(argparse.Namespace(directory=output, prepared=True))
        # The copied tools must run with neither the source checkout nor PYTHONPATH.
        result = subprocess.run([sys.executable, '-I', str(output / 'tools/deployment/manage.py'),
                                 'verify', '--directory', str(output), '--prepared'],
                                cwd=self.root, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_zip_omits_metadata_added_after_preparation(self):
        release = self.bundle()
        (self.root / 'release-manifest.json').write_text(json.dumps(release))
        for name in ['.DS_Store', 'resources/._image.png',
                     'examples/custom/.DS_Store', 'data/database/._state']:
            (self.root / name).write_bytes(b'metadata')
        (self.root / 'resources/._directory').mkdir()
        (self.root / 'resources/._directory/file').write_bytes(b'metadata')
        manage.verify(argparse.Namespace(directory=self.root))
        with tempfile.TemporaryDirectory() as destination:
            archive_path = Path(destination) / 'bundle.zip'
            package.create_zip(self.root, archive_path, release)
            with zipfile.ZipFile(archive_path) as archive:
                self.assertFalse(any(bundle.is_macos_metadata(name) for name in archive.namelist()))
                self.assertIn('happyro-v9.0.0/.env.example', archive.namelist())
                extracted = Path(destination) / 'extracted'
                archive.extractall(extracted)
            manage.verify(argparse.Namespace(directory=extracted / 'happyro-v9.0.0'))

    def test_zip_rejects_secrets_and_non_zip_output(self):
        release = self.bundle()
        (self.root / 'release-manifest.json').write_text(json.dumps(release))
        with self.assertRaisesRegex(ValueError, '\\.zip extension'):
            package.create_zip(self.root, self.root.parent / 'bundle.tar.gz', release)
        (self.root / '.env').write_text('secret')
        with self.assertRaisesRegex(ValueError, 'Remove .env'):
            package.create_zip(self.root, self.root.parent / 'bundle.zip', release)
        (self.root / '.env').unlink()
        (self.root / 'data/database/runtime-file').write_text('state')
        with self.assertRaisesRegex(ValueError, 'must not contain runtime files'):
            package.create_zip(self.root, self.root.parent / 'bundle.zip', release)


if __name__ == '__main__':
    unittest.main()
