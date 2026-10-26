"""Isolation, failure handling and deletion boundaries without starting product containers."""
import argparse
from contextlib import redirect_stdout
import io
import json
import os
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.acceptance.offline import environment as env, checks
from tools.deployment import manage as deployment
from tools.release.lifecycle import Layout, clean_locked


class EnvironmentTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.batch = env.Batch(self.root, 'v9.0.0', 'smoke')
        self.archive = self.root / 'package.zip'
        with zipfile.ZipFile(self.archive, 'w') as archive:
            archive.writestr('happyro-v9.0.0/VERSION', 'v9.0.0')
        self.state = self.batch.create(self.archive)

    def test_names_distinguish_versions_batches_and_workspaces(self):
        other = self.root / 'other'
        other.mkdir()
        projects = [env.Batch(root, version, batch).project for root, version, batch in [
            (self.root, 'v9.0.0', 'Manual_1'), (self.root, 'v9.0.0', 'manual-1'),
            (self.root, 'v9.0.1', 'Manual_1'), (other, 'v9.0.0', 'Manual_1')]]
        self.assertEqual(len(set(projects)), 4)
        for project in projects:
            self.assertRegex(project, r'^happyro-test-manual-1-[a-f0-9]{16}$')

    def test_registered_project_is_immutable_and_identity_is_checked(self):
        self.state['project'] = 'registered-test-project'
        self.batch.save(self.state)
        loaded = env.Batch(self.root, 'v9.0.0', 'smoke')
        self.assertEqual(loaded.project, 'registered-test-project')
        self.assertEqual(loaded.load()['project'], loaded.project)
        self.state['workspace'] = '/different-workspace'
        self.batch.save(self.state)
        with self.assertRaises(ValueError):
            env.Batch(self.root, 'v9.0.0', 'smoke')

    def test_safe_extraction_and_archive_path_rejections(self):
        with patch.object(env, 'verify', return_value={'version': 'v9.0.0'}):
            env.extract(self.archive, self.batch)
        self.assertEqual((self.batch.bundle / 'VERSION').read_text(), 'v9.0.0')
        for name in ('../escape', 'happyro-v9.0.0/../escape', 'happyro-v9.0.0/.env',
                     'happyro-v9.0.0/custom/npc/private.txt', 'happyro-v9.0.0/data/database/state'):
            with self.subTest(name=name), zipfile.ZipFile(self.archive, 'w') as archive:
                archive.writestr(name, 'bad')
            with self.assertRaises(ValueError):
                env.extract(self.archive, self.batch)
        self.assertFalse((self.root / 'escape').exists())

    def test_zip_links_rejected(self):
        with zipfile.ZipFile(self.archive, 'w') as archive:
            info = zipfile.ZipInfo('happyro-v9.0.0/link')
            info.external_attr = (stat.S_IFLNK | 0o777) << 16
            archive.writestr(info, '../../outside')
        with self.assertRaises(ValueError):
            env.extract(self.archive, self.batch)

    def test_symlink_paths_and_forged_identity_rejected(self):
        with self.assertRaises(ValueError):
            env.Batch(self.root, 'v9.0.0', '../escape')
        self.batch.install.rmdir()
        self.batch.install.symlink_to(self.root)
        with self.assertRaises(ValueError):
            self.batch.load()
        self.batch.install.unlink()
        self.batch.install.mkdir()
        state = {**self.state, 'workspace': '/elsewhere'}
        self.batch.save(state)
        with self.assertRaises(ValueError):
            self.batch.load()

    def test_clean_preview_and_failed_shutdown_never_delete(self):
        fixture = self.batch.install / 'keep'
        fixture.write_text('keep')
        with patch.object(env, 'stop_locked') as stop, redirect_stdout(io.StringIO()):
            env.clean(self.batch)
            stop.assert_not_called()
        with patch.object(env, 'stop_locked', side_effect=RuntimeError('docker unavailable')), redirect_stdout(io.StringIO()):
            with self.assertRaises(RuntimeError):
                env.clean(self.batch, True)
        self.assertTrue(fixture.exists())

    def test_clean_deletes_batch_and_allows_reuse_without_removing_other_data(self):
        other = env.Batch(self.root, 'v9.0.0', 'other')
        other.create(self.archive)
        (self.batch.install / 'data').write_text('test database')
        (self.batch.root / 'report.json').write_text('{}')
        with patch.object(env, 'stop_locked') as stop, patch.object(self.batch, 'owned_networks', return_value=[]), redirect_stdout(io.StringIO()):
            env.clean(self.batch, True)
            stop.assert_called_once()
        self.assertFalse(self.batch.install.exists())
        self.assertTrue(other.install.exists())
        self.assertFalse(self.batch.root.exists())
        self.assertTrue(self.batch.lock_path.exists())
        again = env.Batch(self.root, 'v9.0.0', 'smoke')
        again.create(self.archive)
        self.assertEqual(again.load()['status'], 'preparing')
        self.assertTrue(self.archive.exists())

    def test_cleanup_refuses_remaining_networks_and_busy_batch(self):
        with env.locked(self.batch), self.assertRaisesRegex(ValueError, 'active command'):
            env.clean(self.batch, True)
        with patch.object(env, 'stop_locked'), patch.object(self.batch, 'owned_networks', return_value=['network']):
            with self.assertRaisesRegex(ValueError, 'networks still exist'):
                env.clean(self.batch, True)
        self.assertTrue(self.batch.state_path.exists())

    def test_cleanup_without_installation_still_checks_docker_ownership(self):
        self.batch.install.rmdir()
        self.state['env_sha256'] = 'installation already removed'
        self.batch.save(self.state)
        with patch.object(self.batch, 'owned_containers', return_value=[]), patch.object(self.batch, 'owned_networks', return_value=[]):
            env.clean(self.batch, True)
        self.assertFalse(self.batch.root.exists())

    def test_release_clean_never_removes_acceptance_installation(self):
        layout = Layout(self.root, 'v9.0.0')
        layout.create({})
        with redirect_stdout(io.StringIO()):
            clean_locked(layout, include_package=True, execute=True)
        self.assertTrue(self.batch.install.exists())

    def test_batch_lock_survives_inherited_child(self):
        with env.locked(self.batch):
            with self.assertRaisesRegex(ValueError, 'active command'):
                with env.locked(self.batch):
                    pass
            process = subprocess.Popen(['python3', '-c', 'import sys;sys.stdin.read()'],
                                       stdin=subprocess.PIPE, **env.child_options())
        try:
            with self.assertRaisesRegex(ValueError, 'active command'):
                with env.locked(self.batch):
                    pass
        finally:
            process.communicate(timeout=5)
        with env.locked(self.batch):
            pass

    def test_shell_environment_cannot_redirect_compose(self):
        self.batch.bundle.mkdir()
        (self.batch.bundle / '.env.example').write_text('HAPPYRO_CUSTOM_DIR=./custom\n')
        with patch.dict(os.environ, {'HAPPYRO_CUSTOM_DIR': '/production', 'COMPOSE_PROJECT_NAME': 'production'}):
            self.assertNotIn('HAPPYRO_CUSTOM_DIR', self.batch.env())
            self.assertNotIn('COMPOSE_PROJECT_NAME', self.batch.env())

    def test_unknown_containers_refuse_operation(self):
        foreign = [{'Config': {'Labels': {'com.docker.compose.project': self.batch.project,
                                         'com.docker.compose.project.working_dir': '/production'}}}]
        with patch.object(env.subprocess, 'check_output', side_effect=['id\n', json.dumps(foreign)]):
            with self.assertRaisesRegex(ValueError, 'different deployment'):
                self.batch.owned_containers()

    def test_networks_avoid_existing_ranges_and_fit_all_services(self):
        occupied = [{'IPAM': {'Config': [{'Subnet': '172.31.0.0/24'}]}},
                    {'IPAM': {'Config': None}}, {'IPAM': None}]
        with patch.object(env.subprocess, 'check_output', side_effect=['net\n', json.dumps(occupied)]):
            default, proxy = env.available_networks()
        self.assertFalse(default.overlaps(proxy))
        self.assertGreater(default.num_addresses - 2, len(env.SERVICES))
        self.assertNotEqual(str(default), '172.31.0.0/24')

    def test_health_requires_every_service_and_successful_init(self):
        services = {name: {'status': 'running', 'health': 'healthy'} for name in env.SERVICES}
        services['api-init'] = {'status': 'exited', 'exit_code': 0}
        self.assertTrue(checks.healthy(services))
        services['api-init']['exit_code'] = 1
        self.assertFalse(checks.healthy(services))
        services['api-init']['exit_code'] = 0
        del services['map']
        self.assertFalse(checks.healthy(services))

    def test_failed_check_overwrites_old_success_report(self):
        self.batch.bundle.mkdir()
        (self.batch.bundle / '.env').write_text('HAPPYRO_GAME_PUBLIC_URL=http://127.0.0.1:33381\nHAPPYRO_ADMIN_PUBLIC_URL=http://127.0.0.1:33382\n')
        self.state.update(gateway_url='http://127.0.0.1:33381', admin_url='http://127.0.0.1:33382')
        self.batch.save(self.state)
        (self.batch.root / 'report.json').write_text('{"status":"passed"}')
        with patch.object(self.batch, 'check_config'), patch.object(self.batch, 'run_tool', side_effect=ValueError('invalid bundle')), redirect_stdout(io.StringIO()):
            with self.assertRaises(ValueError):
                checks.check(self.batch)
        report = json.loads((self.batch.root / 'report.json').read_text())
        self.assertEqual(report['status'], 'failed')
        self.assertEqual(report['error_type'], 'ValueError')

    def test_compose_override_is_explicit_and_default_unchanged(self):
        with patch.object(deployment.subprocess, 'run') as run:
            deployment.compose(self.root, 'ps')
            self.assertEqual(run.call_args.args[0].count('-f'), 1)
            token = deployment.COMPOSE_OVERRIDE.set(self.root / 'override.json')
            try:
                deployment.compose(self.root, 'ps')
            finally:
                deployment.COMPOSE_OVERRIDE.reset(token)
            self.assertEqual(run.call_args.args[0].count('-f'), 2)
            self.assertIn(str(self.root / 'override.json'), run.call_args.args[0])

    def test_real_compose_config_keeps_ports_names_and_mounts_isolated(self):
        # Render the actual product template through configure; never start Docker services.
        source = Path(__file__).resolve().parents[3]
        self.batch.bundle.mkdir()
        (self.batch.bundle / 'compose.yaml').write_bytes((source / 'deploy/docker/compose.yml').read_bytes())
        template = (source / 'deploy/docker/.env.example').read_text().replace('@VERSION@', 'v9.0.0')
        (self.batch.bundle / '.env.example').write_text(template)
        def initialize(action):
            self.assertEqual(action, 'initialize')
            text = template
            for key in ('HAPPYRO_SERVER_DB_PASSWORD', 'HAPPYRO_API_ADMIN_DB_PASSWORD', 'MARIADB_ROOT_PASSWORD', 'HAPPYRO_SERVER_INTERSERVER_PASSWORD', 'HAPPYRO_GAME_CONTROL_TOKEN'):
                text = text.replace(key + '=\n', key + '=fixture\n')
            (self.batch.bundle / '.env').write_text(text)
        import ipaddress
        networks = (ipaddress.ip_network('172.31.4.0/24'), ipaddress.ip_network('172.31.5.0/29'))
        with patch.object(self.batch, 'run_tool', side_effect=initialize), \
             patch.object(env, 'available_networks', return_value=networks):
            env.configure(self.batch, self.state)
        config = json.loads(self.batch.compose('config', '--format', 'json'))
        self.assertEqual(config['name'], self.batch.project)
        self.assertEqual(config['services']['gateway']['ports'][0]['host_ip'], '127.0.0.1')
        self.assertEqual(config['services']['admin']['networks']['admin-proxy']['ipv4_address'], '172.31.5.2')
        self.assertEqual(config['services']['api']['environment']['HAPPYRO_API_TRUSTED_PROXIES'], '172.31.5.2')
        self.batch.check_config(self.state)

    def test_http_200_with_error_status_is_not_healthy(self):
        from unittest.mock import MagicMock
        response = MagicMock()
        response.__enter__.return_value = response
        response.status = 200
        response.read.return_value = b'{"status":"error"}'
        opener = MagicMock()
        opener.open.return_value = response
        with patch.object(checks.urllib.request, 'build_opener', return_value=opener):
            with self.assertRaisesRegex(ValueError, 'healthy status'):
                checks.http_checks({'gateway_url': 'http://127.0.0.1:33381', 'admin_url': 'http://127.0.0.1:33382'})
