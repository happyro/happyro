"""Round-trip payloads, delivery instructions and cleanup boundaries for split ZIPs."""
import argparse
from contextlib import redirect_stdout
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.deployment.offline import digest
from tools.release import split, release, workflow, status
from tools.release.lifecycle import Layout, clean_locked, version_lock


class SplitTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.layout = Layout(self.root, 'v9.1.0')
        self.state, self.logs = self.layout.create({'root': 'fixture'})
        self.prefix = 'happyro-v9.1.0/'
        self.payload = {
            self.prefix: b'',
            self.prefix + 'VERSION': b'v9.1.0\n',
            self.prefix + 'release-manifest.json': json.dumps({'schema': 2, 'version': 'v9.1.0', 'status': 'offline-ready'}).encode(),
            self.prefix + 'README.md': '完整部署说明'.encode(),
            self.prefix + '.env.example': b'VERSION=v9.1.0\n',
            self.prefix + 'resources/': b'',
            self.prefix + 'resources/data.grf': bytes(range(256)) * 100,
            self.prefix + 'images/amd64/server.tar': b'amd64 fixture',
            self.prefix + 'images/arm64/server.tar': b'arm64 fixture',
            self.prefix + 'data/database/': b'',
        }
        self.write_source()

    def write_source(self):
        with zipfile.ZipFile(self.layout.zip, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            for name, content in self.payload.items():
                archive.writestr(name, content)
        self.state.update(status='packaged', package={
            'path': self.layout.zip.relative_to(self.root).as_posix(),
            'size': self.layout.zip.stat().st_size, 'sha256': digest(self.layout.zip)})
        self.layout.save(self.state)

    def run_split(self):
        with redirect_stdout(io.StringIO()):
            return split.split(argparse.Namespace(workspace=self.root, version=self.layout.version))

    def test_roundtrip_readmes_and_report(self):
        original_hash = digest(self.layout.zip)
        paths = self.run_split()
        merged = {}
        notes = []
        for index, path in enumerate(paths[:2]):
            with zipfile.ZipFile(path) as archive:
                for name in archive.namelist():
                    content = archive.read(name)
                    if name.endswith('-SPLIT-README.md'):
                        notes.append(content)
                    else:
                        self.assertNotIn(name, merged)
                        merged[name] = content
                        if index == 0:
                            self.assertTrue(name.startswith(self.prefix + 'resources/'))
                if index == 1:
                    self.assertEqual(archive.read(self.prefix + 'README.md'), self.payload[self.prefix + 'README.md'])
        self.assertEqual(merged, self.payload)
        self.assertEqual(len(notes), 2)
        self.assertEqual(notes[0], notes[1])
        self.assertEqual(paths[3].read_bytes(), notes[0])
        for value in (original_hash, self.state['run_id'], 'verify --directory .', 'initialize --directory .', 'deploy --directory .'):
            self.assertIn(value.encode(), notes[0])
        report = json.loads(paths[2].read_text())
        self.assertEqual(report['readme'], {'name': paths[3].name,
                         'size': paths[3].stat().st_size, 'sha256': digest(paths[3])})
        for path in paths[:2]:
            self.assertEqual(report['archives'][path.name]['sha256'], digest(path))
        self.assertEqual(digest(self.layout.zip), original_hash)
        self.assertFalse(list(self.layout.artifacts.glob('.split-*')))

    def test_status_rejects_missing_or_changed_external_readme(self):
        self.run_split()
        note = self.layout.split_paths[3]
        with redirect_stdout(io.StringIO()):
            self.assertEqual(status.verify_content(self.layout, self.state)['split_archives'], 'passed')
            note.write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'Missing or changed artifact'):
                status.verify_content(self.layout, self.state)
            note.unlink()
            with self.assertRaisesRegex(ValueError, 'Missing or changed artifact'):
                status.verify_content(self.layout, self.state)

    def test_external_readme_alone_prevents_overwrite(self):
        note = self.layout.split_paths[3]
        note.write_bytes(b'keep')
        with self.assertRaisesRegex(ValueError, 'already exist'):
            self.run_split()
        self.assertEqual(note.read_bytes(), b'keep')

    def test_publish_failure_removes_all_new_deliveries(self):
        original_replace = Path.replace
        def fail_report(path, target):
            if target == self.layout.split_paths[2]:
                raise OSError('report publication failed')
            return original_replace(path, target)
        with patch.object(Path, 'replace', fail_report):
            with self.assertRaisesRegex(OSError, 'report publication failed'):
                self.run_split()
        self.assertFalse(any(p.exists() for p in self.layout.split_paths))
        self.assertEqual(digest(self.layout.zip), self.state['package']['sha256'])

    def test_refuses_changed_unregistered_and_existing_deliveries(self):
        self.layout.zip.write_bytes(b'changed')
        with self.assertRaisesRegex(ValueError, 'unchanged complete ZIP'):
            self.run_split()
        self.write_source()
        self.layout.save({k: v for k, v in self.state.items() if k != 'package'})
        with self.assertRaisesRegex(ValueError, 'unchanged complete ZIP'):
            self.run_split()
        self.layout.save(self.state)
        self.run_split()
        before = [p.read_bytes() for p in self.layout.split_paths]
        with self.assertRaisesRegex(ValueError, 'already exist'):
            self.run_split()
        self.assertEqual(before, [p.read_bytes() for p in self.layout.split_paths])

    def test_unsafe_or_incomplete_source_never_publishes(self):
        for name in ('../escape', self.prefix + '../escape', self.prefix + 'resources/../escape'):
            with self.subTest(name=name):
                self.payload[name] = b'bad'
                self.write_source()
                with self.assertRaisesRegex(ValueError, 'Unsafe'):
                    self.run_split()
                del self.payload[name]
                self.assertFalse(any(p.exists() for p in self.layout.split_paths))
        self.payload[self.prefix + 'release-manifest.json'] = b'{"version":"v9.1.0","status":"prepared-not-built"}'
        self.write_source()
        with self.assertRaisesRegex(ValueError, 'offline-ready'):
            self.run_split()

    def test_failure_cleans_staging_and_keeps_original(self):
        with patch.object(split, 'entry_digest', side_effect=OSError('read failure')):
            with self.assertRaises(OSError):
                self.run_split()
        self.assertEqual(digest(self.layout.zip), self.state['package']['sha256'])
        self.assertFalse(any(p.exists() for p in self.layout.split_paths))
        self.assertFalse(list(self.layout.artifacts.glob('.split-*')))

    def test_cleanup_preserves_deliveries_by_default_and_removes_all_when_requested(self):
        self.run_split()
        self.layout.images.mkdir()
        (self.layout.images / 'partial.tar').write_bytes(b'partial')
        interrupted = self.layout.artifacts / '.split-interrupted.tmp'
        interrupted.mkdir()
        (interrupted / 'partial.zip').write_bytes(b'partial')
        with redirect_stdout(io.StringIO()), version_lock(self.layout):
            clean_locked(self.layout)
            self.assertTrue(self.layout.images.exists())
            clean_locked(self.layout, execute=True)
            self.assertFalse(self.layout.images.exists())
            self.assertFalse(interrupted.exists())
            for path in (self.layout.zip, *self.layout.split_paths):
                self.assertTrue(path.exists())
            self.assertEqual(self.layout.read_state()['package'], self.state['package'])
            clean_locked(self.layout, include_package=True, execute=True)
        self.assertFalse(self.layout.artifacts.exists())
        self.assertTrue(self.logs.exists())
        self.assertTrue(self.layout.state_path.exists())

    def test_locked_version_rejects_split(self):
        with version_lock(self.layout):
            with self.assertRaisesRegex(ValueError, 'running release task'):
                self.run_split()

    def test_symlink_delivery_rejected_without_touching_target(self):
        target = self.root / 'outside'
        target.write_bytes(b'keep')
        self.layout.split_paths[0].symlink_to(target)
        with self.assertRaisesRegex(ValueError, 'already exist'):
            self.run_split()
        self.assertEqual(target.read_bytes(), b'keep')

    def test_cli_routes_split_and_optional_workflow_flag(self):
        with patch.object(split, 'split') as invoke:
            release.main(['offline', 'split', '--version', 'v9.1.0', '--workspace', str(self.root)])
            self.assertEqual(invoke.call_args.args[0].version, 'v9.1.0')
        for command in ('run', 'rebuild'):
            with patch.object(workflow, 'execute') as invoke:
                release.main(['offline', 'create', *(['--rebuild'] if command == 'rebuild' else []), '--version', 'v9.1.0', '--split'])
                self.assertTrue(invoke.call_args.args[0].split)
                self.assertEqual(invoke.call_args.kwargs['rebuild'], command == 'rebuild')

    def test_rebuild_split_replaces_all_deliveries_and_records_verified_package(self):
        self.run_split()
        phases = []
        def run_phase(layout, phase, descriptor, log_path):
            phases.append(phase)
            if phase == 'prepare':
                self.assertFalse(layout.zip.exists())
                self.assertFalse(any(p.exists() for p in layout.split_paths))
            if phase == 'package':
                with zipfile.ZipFile(layout.zip, 'w') as archive:
                    for name, content in self.payload.items():
                        archive.writestr(name, content)
        args = argparse.Namespace(workspace=self.root, version=self.layout.version, split=True)
        with patch.object(workflow, 'preflight', return_value={'root': 'fixture'}), \
             patch.object(workflow.sources, 'version', return_value=self.layout.version), \
             patch.object(workflow.sources, 'snapshot', return_value={'root': 'fixture'}), \
             patch.object(workflow, 'run_phase', side_effect=run_phase), \
             patch.object(workflow, 'verify'), redirect_stdout(io.StringIO()):
            workflow.execute(args, rebuild=True)
        self.assertEqual(phases, ['prepare', 'build', 'package'])
        state = self.layout.read_state()
        self.assertEqual(state['status'], 'packaged')
        self.assertNotEqual(state['run_id'], self.state['run_id'])
        self.assertEqual(json.loads(self.layout.split_paths[2].read_text())['run_id'], state['run_id'])
        self.assertTrue(self.logs.exists())
