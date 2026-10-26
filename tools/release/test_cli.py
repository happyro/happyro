"""Public command contracts, read-only inspection and managed stage transitions."""
import argparse
from contextlib import redirect_stdout, redirect_stderr, ExitStack
import io
import json
import os
import subprocess
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.release import release, resources, stages, status, workflow
from tools.release.lifecycle import Layout, LOCK_ENV, ResourceLayout
from tools.deployment.offline import digest
from tools.acceptance.offline import manage, inspection
from tools.acceptance.offline.environment import Batch


class CLIContracts(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()

    def test_all_help_is_inert_colored_or_plain_and_all_actions_parse(self):
        paths = [[], *[[group] for group in release.COMMANDS],
                 *[[group, action, '--help'] for group, commands in release.COMMANDS.items() for action in commands]]
        for plain in (False, True):
            for path in paths:
                output = io.StringIO()
                with redirect_stdout(output):
                    try:
                        release.main(path + (['--no-color'] if plain else []))
                    except SystemExit as error:
                        self.assertEqual(error.code, 0)
                value = output.getvalue()
                self.assertTrue(value.startswith('\n') and value.endswith('\n\n'))
                self.assertEqual('\033[' in value, not plain)
        with patch.object(workflow, 'execute') as execute:
            release.main(['--no-color', 'offline', 'create', '--workspace', str(self.root), '--rebuild'])
        args = execute.call_args.args[0]
        self.assertIsNone(args.version)
        self.assertFalse(args.push)
        self.assertTrue(execute.call_args.kwargs['rebuild'])

    def test_removed_commands_and_ambiguous_parameters_rejected(self):
        commands = [['run'], ['rebuild'], ['push'], ['clean'], ['prepare'],
                    ['resources', '--rebuild'], ['offline', 'push'],
                    ['offline', 'push', '--version', 'v9.0.0', '--images', '/tmp/images'],
                    ['stage', 'build', '--version', 'v9.0.0', '--output', '/tmp/output'],
                    ['resources', 'clean', '--version', 'v9.0.0', '--include-package']]
        with redirect_stderr(io.StringIO()):
            for command in commands:
                with self.assertRaises(SystemExit) as error:
                    release.main(command)
                self.assertEqual(error.exception.code, 2)
            with self.assertRaises(SystemExit):
                manage.main(['check', '--version', 'v9.0.0', '--batch', 'one', '--timeout', '1'])
        with patch.object(manage.checks, 'check') as check:
            manage.main(['check', '--workspace', str(self.root), '--version', 'v9.0.0', '--batch', 'one', '--health-timeout', '12'])
        self.assertEqual(check.call_args.args[1], 12)
        self.assertFalse((self.root / 'work').exists())

    def test_absent_status_and_list_do_not_create_directories_or_claim_verified(self):
        with redirect_stdout(io.StringIO()):
            for group in ('offline', 'resources'):
                result = release.main([group, 'status', '--workspace', str(self.root), '--version', 'v9.0.0'])
                self.assertFalse(result['registered'])
                self.assertEqual(result['integrity'], 'not_checked')
            self.assertEqual(manage.main(['list', '--workspace', str(self.root)]), [])
        self.assertEqual(list(self.root.iterdir()), [])

    def test_offline_status_checks_actual_bytes_not_recorded_success(self):
        layout = Layout(self.root, 'v9.0.0')
        state, _ = layout.create({})
        with zipfile.ZipFile(layout.zip, 'w') as archive:
            archive.writestr('test', 'content')
        state.update(status='packaged', package={'path': layout.zip.relative_to(self.root).as_posix(),
                    'size': layout.zip.stat().st_size, 'sha256': digest(layout.zip)})
        layout.save(state)
        args = argparse.Namespace(workspace=self.root, version=layout.version, group='offline', verify=False)
        with redirect_stdout(io.StringIO()):
            self.assertEqual(status.show(args)['integrity'], 'not_checked')
            args.verify = True
            self.assertEqual(status.show(args)['integrity']['complete_zip'], 'passed')
            layout.zip.write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'verification failed'):
                status.show(args)
        self.assertEqual(layout.read_state()['status'], 'packaged')

    def test_resources_cli_rebuild_verify_and_clean_are_isolated(self):
        (self.root / 'deploy/docker').mkdir(parents=True)
        (self.root / 'deploy/docker/VERSION').write_text('v9.0.0')
        for name in resources.INPUTS:
            source = self.root / name
            source.mkdir(parents=True)
            (source / 'input').write_text('resource')
        layout = ResourceLayout(self.root, 'v9.0.0')
        base = ['--workspace', str(self.root), '--version', layout.version, '--no-color']
        with redirect_stdout(io.StringIO()):
            release.main(['resources', 'create', *base])
            self.assertEqual(release.main(['resources', 'status', '--verify', *base])['integrity']['archive_and_manifest'], 'passed')
            layout.checksum.write_text('wrong')
            with self.assertRaises(ValueError):
                release.main(['resources', 'status', '--verify', *base])
            release.main(['resources', 'create', '--rebuild', *base])
            release.main(['resources', 'clean', *base])
            self.assertTrue(layout.archive.exists())
            release.main(['resources', 'clean', '--execute', *base])
            self.assertFalse(layout.artifacts.exists())

    def test_acceptance_list_and_status_distinguish_registration_from_runtime(self):
        archive = self.root / 'fixture.zip'
        archive.write_bytes(b'fixture')
        batch = Batch(self.root, 'v9.0.0', 'one')
        state = batch.create(archive)
        state['status'] = 'started'
        batch.save(state)
        args = argparse.Namespace(workspace=self.root, version='v9.0.0', batch='one')
        before = {str(p) for p in self.root.rglob('*')}
        with redirect_stdout(io.StringIO()), patch.object(Batch, 'owned_containers', return_value=[]):
            rows = inspection.list_batches(args)
            self.assertEqual(rows[0]['batch'], 'one')
            result = inspection.status(args)
            self.assertEqual(result['recorded_status'], 'started')
            self.assertFalse(result['runtime_healthy'])
            self.assertEqual(result['integrity'], 'not_checked')
        with redirect_stdout(io.StringIO()), patch.object(Batch, 'owned_containers', side_effect=OSError('Docker offline')):
            self.assertIsNone(inspection.status(args)['runtime_healthy'])
        self.assertEqual({str(p) for p in self.root.rglob('*')}, before)

    def test_managed_stages_share_registration_and_enforce_order_and_sources(self):
        (self.root / 'deploy/docker').mkdir(parents=True)
        (self.root / 'deploy/docker/VERSION').write_text('v9.0.0')
        layout = Layout(self.root, 'v9.0.0')
        base = ['--workspace', str(self.root), '--version', layout.version, '--no-color']
        events = []
        def invoke_worker(layout, phase, descriptor, log):
            # Exercise CLI's internal worker branch with a real inherited lock inode.
            with patch.dict(os.environ, {LOCK_ENV: str(descriptor)}):
                release.main(['stage', phase, *base])
        def prepare(options):
            events.append('prepare')
            options.output.mkdir()
        def build(options):
            events.append('build')
            options.output.mkdir()
        def package(options):
            events.append('package')
            with zipfile.ZipFile(layout.zip, 'w') as archive:
                archive.writestr('fixture', 'offline')
        with ExitStack() as stack:
            stack.enter_context(redirect_stdout(io.StringIO()))
            stack.enter_context(patch.object(workflow, 'preflight', return_value={'source': 'one'}))
            snapshot = stack.enter_context(patch.object(workflow.sources, 'snapshot', return_value={'source': 'one'}))
            stack.enter_context(patch.object(workflow, 'verify'))
            stack.enter_context(patch.object(workflow, 'run_phase', side_effect=invoke_worker))
            stack.enter_context(patch.object(stages.package, 'prepare', side_effect=prepare))
            stack.enter_context(patch.object(stages.images, 'build', side_effect=build))
            stack.enter_context(patch.object(stages.images, 'package', side_effect=package))
            with self.assertRaisesRegex(ValueError, 'requires'):
                release.main(['stage', 'build', *base])
            release.main(['stage', 'prepare', *base])
            self.assertEqual(layout.read_state()['status'], 'prepared')
            with self.assertRaises(ValueError):
                release.main(['stage', 'package', *base])
            release.main(['stage', 'build', *base])
            self.assertEqual(layout.read_state()['status'], 'built')
            release.main(['stage', 'package', *base])
            self.assertEqual(layout.read_state()['status'], 'packaged')
            self.assertEqual(events, ['prepare', 'build', 'package'])
            release.main(['offline', 'clean', '--include-package', '--execute', *base])
            self.assertFalse(layout.artifacts.exists())
            release.main(['stage', 'prepare', *base])
            snapshot.return_value = {'source': 'changed'}
            with self.assertRaisesRegex(ValueError, 'Source state changed'):
                release.main(['stage', 'build', *base])
            self.assertEqual(layout.read_state()['status'], 'failed')

    def test_real_prepare_worker_process_inherits_lock_and_writes_managed_bundle(self):
        directories = [
            'inputs/runtime/kro-20211105/client/' + name for name in ('AI', 'BGM', 'System', 'data')
        ] + [
            'work/game-data/items/kro-20211105', 'work/game-data/monsters/kro-20211105',
            'repos/happyro-server/db/import-tmpl',
            *['repos/happyro-api/resources/game-data/world/' + name for name in ('npcs', 'maps', 'terrain')],
        ]
        for relative in directories:
            target = self.root / relative
            target.mkdir(parents=True)
            (target / 'fixture').write_text('fixture')
        for relative, content in {
            '.gitignore': '/repos/\n/work/\n/artifacts/\n/inputs/\n',
            'deploy/docker/VERSION': 'v9.0.0',
            'deploy/docker/compose.yml': 'services: {}',
            'deploy/docker/.env.example': 'VERSION=@VERSION@',
            'docs/operations/docker-deployment.md': 'Fixture deployment',
            'deploy/docker/custom-templates/npc/scripts.conf': '// fixture',
            'inputs/runtime/kro-20211105/client/DATA.INI': '0=data.grf',
            'inputs/runtime/kro-20211105/client/data.grf': 'fixture grf',
        }.items():
            target = self.root / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
        for relative in workflow.sources.REPOS:
            repo = self.root / relative
            repo.mkdir(parents=True, exist_ok=True)
            (repo / 'source-fixture').write_text('source')
            for command in (['init', '-q'], ['add', '.'],
                            ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
                             '-c', 'commit.gpgsign=false', 'commit', '-qm', 'test(fixture): Initialize source']):
                subprocess.run(['git', '-C', str(repo), *command], check=True, capture_output=True)
        layout = Layout(self.root, 'v9.0.0')
        from tools.release.lifecycle import version_lock
        with version_lock(layout) as descriptor, redirect_stdout(io.StringIO()):
            state, logs = layout.create(workflow.sources.snapshot(self.root))
            workflow.complete_phase(layout, state, 'prepare', descriptor, logs)
        self.assertEqual(layout.read_state()['status'], 'prepared')
        self.assertTrue((layout.bundle / 'release-manifest.json').is_file())
        self.assertNotIn('\033[', (logs / 'prepare.log').read_text())
        args = argparse.Namespace(workspace=self.root, version=layout.version, group='offline', verify=True)
        with redirect_stdout(io.StringIO()):
            self.assertEqual(status.show(args)['integrity']['bundle'], 'passed')
