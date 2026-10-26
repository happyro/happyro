"""Opt-in publication must never happen on a normal or failed packaging run."""
import argparse
from contextlib import ExitStack, redirect_stdout
import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.release import workflow, release, publish
from tools.release.lifecycle import Layout, version_lock


class WorkflowPublishTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.args = argparse.Namespace(workspace=self.root, version='v9.0.0', split=False, push=False)
        self.layout = Layout(self.root, self.args.version)
        self.events = []
        self.stack = ExitStack()
        self.addCleanup(self.stack.close)
        self.stack.enter_context(redirect_stdout(io.StringIO()))
        self.stack.enter_context(patch.object(workflow, 'preflight', return_value={'.': 'fixture'}))
        self.stack.enter_context(patch.object(workflow.sources, 'version', return_value=self.args.version))
        self.stack.enter_context(patch.object(workflow.sources, 'snapshot', return_value={'.': 'fixture'}))
        self.stack.enter_context(patch.object(workflow, 'verify'))
        self.worker = self.stack.enter_context(patch.object(workflow, 'run_phase', side_effect=self.phase))
        self.publisher = self.stack.enter_context(patch.object(publish, 'publish', side_effect=self.push))

    def phase(self, layout, phase, descriptor, log_path):
        self.events.append(phase)
        if phase == 'package':
            with zipfile.ZipFile(layout.zip, 'w') as archive:
                archive.writestr('fixture', b'offline ZIP')

    def push(self, args):
        self.events.append('push')
        self.assertEqual(args.images, self.layout.images)
        self.assertEqual(args.bundle, self.layout.bundle)
        self.assertTrue(self.layout.zip.exists())
        self.assertEqual(self.layout.read_state()['stage'], 'push')
        with self.assertRaisesRegex(ValueError, 'running release task'):
            with version_lock(self.layout):
                pass
        args.evidence.mkdir()
        (args.evidence / 'verified.json').write_text('{}')

    def test_default_run_and_rebuild_never_publish(self):
        workflow.execute(self.args)
        workflow.execute(self.args, rebuild=True)
        self.publisher.assert_not_called()
        self.assertEqual(self.layout.read_state()['status'], 'packaged')

    def test_explicit_push_occurs_after_package_and_split(self):
        self.args.push = True
        self.args.split = True
        with patch.object(workflow.split, 'split_locked', side_effect=lambda layout: self.events.append('split')):
            workflow.execute(self.args)
        self.assertEqual(self.events, ['prepare', 'build', 'package', 'split', 'push'])
        state = self.layout.read_state()
        self.assertEqual(state['status'], 'published')
        self.assertTrue((self.root / state['publication']['evidence'] / 'verified.json').exists())

    def test_build_or_split_failure_prevents_publish(self):
        self.args.push = True
        self.worker.side_effect = RuntimeError('build failed')
        with self.assertRaises(RuntimeError):
            workflow.execute(self.args)
        self.publisher.assert_not_called()
        self.worker.side_effect = self.phase
        self.args.split = True
        with patch.object(workflow.split, 'split_locked', side_effect=RuntimeError('split failed')):
            with self.assertRaises(RuntimeError):
                workflow.execute(self.args, rebuild=True)
        self.publisher.assert_not_called()

    def test_push_failure_retains_zip_and_records_failed_stage(self):
        self.args.push = True
        self.publisher.side_effect = RuntimeError('registry failed')
        with self.assertRaises(RuntimeError):
            workflow.execute(self.args)
        state = self.layout.read_state()
        self.assertEqual(state['status'], 'failed')
        self.assertEqual(state['stage'], 'push')
        self.assertTrue(self.layout.zip.exists())
        self.assertIn('package', state)

    def test_cli_push_requires_explicit_flag_and_standalone_push_remains_available(self):
        for command in ('run', 'rebuild'):
            for enabled in (False, True):
                with patch.object(workflow, 'execute') as execute:
                    release.main(['offline', 'create', *(['--rebuild'] if command == 'rebuild' else []), '--version', 'v9.0.0'] + (['--push'] if enabled else []))
                    self.assertEqual(execute.call_args.args[0].push, enabled)
        state, _ = self.layout.create({})
        state.update(status='packaged', package={'path': str(self.layout.zip)})
        self.layout.save(state)
        with patch.object(publish, 'publish') as push:
            release.main(['offline', 'push', '--workspace', str(self.root), '--version', self.layout.version])
            push.assert_called_once()
            self.assertEqual(push.call_args.args[0].images, self.layout.images)
            self.assertEqual(push.call_args.args[0].bundle, self.layout.bundle)

    def test_managed_standalone_push_holds_and_passes_lock(self):
        state, _ = self.layout.create({})
        state.update(status='packaged', package={'path': str(self.layout.zip)})
        self.layout.save(state)
        with patch.object(publish, 'publish') as push:
            release.main(['offline', 'push', '--workspace', str(self.root), '--version', self.layout.version])
            self.assertIsInstance(push.call_args.args[0].lock_fd, int)

    def test_skopeo_copy_inherits_release_lock(self):
        with version_lock(self.layout) as descriptor, patch.object(publish.subprocess, 'run') as run:
            publish.copy('oci-archive:fixture', 'docker://fixture:latest', lock_fd=descriptor)
            self.assertEqual(run.call_args.kwargs['pass_fds'], (descriptor,))
