"""Opt-in round trip against disposable Go Admin/Database images; no live services."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import socket
import shutil
import tempfile
import time
import unittest
import uuid

import manage


@unittest.skipUnless(os.environ.get('HAPPYRO_GO_API_TEST_IMAGE') and os.environ.get('HAPPYRO_GO_DATABASE_TEST_IMAGE'), 'requires local Go Admin and Database test images')
class AdminGoBackupTest(unittest.TestCase):
    def test_restores_management_game_settings_and_custom_content(self):
        with tempfile.TemporaryDirectory(prefix='happyro-backup-') as directory:
            root = Path(directory).resolve()
            settings = root / 'settings'
            settings.mkdir()
            custom = root / 'custom'
            for name in ('npc', 'db', 'resources'):
                (custom / name).mkdir(parents=True)
            templates = Path(__file__).resolve().parents[2] / 'repos/happyro-server/db/import-tmpl'
            for name in ('item_db.yml', 'mob_db.yml'):
                shutil.copyfile(templates / name, custom / 'db' / name)
            (custom / 'npc/scripts.conf').write_text('// backed up custom scripts\n')
            (settings / 'battle_conf.txt').write_text('base_exp_rate: 250\n')
            admin_image = os.environ['HAPPYRO_GO_API_TEST_IMAGE']
            db_image = os.environ['HAPPYRO_GO_DATABASE_TEST_IMAGE']
            config = {
                'name': 'happyro-backup-' + uuid.uuid4().hex[:12],
                'services': {
                    'database': {'image': db_image, 'pull_policy': 'never', 'tmpfs': ['/var/lib/mysql'], 'environment': {
                        'MARIADB_ROOT_PASSWORD': 'backup-test-root', 'MARIADB_DATABASE': 'happyro',
                        'MARIADB_USER': 'happyro', 'MARIADB_PASSWORD': 'backup-test-game',
                        'HAPPYRO_LOG_DATABASE': 'happyro_log', 'HAPPYRO_ADMIN_PASSWORD': 'backup-test-admin',
                        'HAPPYRO_INTERSERVER_USER': 'interserver', 'HAPPYRO_INTERSERVER_PASSWORD': 'backuptestserver',
                    }},
                    'api': {'image': admin_image, 'pull_policy': 'never', 'environment': {
                        'DB_HOST': 'database', 'DB_DATABASE': 'happyro_admin',
                        'DB_USERNAME': 'happyro_admin', 'DB_PASSWORD': 'backup-test-admin',
                        'GAME_DB_HOST': 'database', 'GAME_DB_DATABASE': 'happyro',
                        'GAME_LOG_DB_DATABASE': 'happyro_log', 'GAME_DB_USERNAME': 'happyro_admin',
                        'GAME_DB_PASSWORD': 'backup-test-admin', 'APP_URL': 'http://localhost:8080',
                        'GAME_MAP_INDEX_PATH': '/opt/api/resources/map_index.txt',
                        'GAME_SERVER_BATTLE_CONFIG_PATH': '/run/happyro-settings/battle_conf.txt',
                    }, 'volumes': [
                        {'type': 'bind', 'source': str(settings), 'target': '/run/happyro-settings'},
                        {'type': 'bind', 'source': str(custom), 'target': '/opt/happyro/custom', 'read_only': True},
                    ]},
                    # The production tool resolves the customization root from the map mount.
                    'map': {'image': admin_image, 'pull_policy': 'never', 'volumes': [
                        {'type': 'bind', 'source': str(custom / 'npc'), 'target': '/opt/happyro/custom/npc'},
                    ]},
                },
            }
            browser_probe = os.environ.get('HAPPYRO_GO_BROWSER_PROBE')
            browser_url = None
            if browser_probe:
                with socket.socket() as listener:
                    listener.bind(('127.0.0.1', 0))
                    port = listener.getsockname()[1]
                browser_url = f'http://127.0.0.1:{port}'
                config['services']['api']['ports'] = [f'127.0.0.1:{port}:8080']
                config['services']['api']['environment']['APP_URL'] = browser_url
            (root / 'compose.yaml').write_text(json.dumps(config))
            (root / '.env').write_text('# isolated round-trip environment\n')
            (root / 'release-manifest.json').write_text('{"test":"Go backup round trip"}\n')

            def compose(*args, check=True):
                result = subprocess.run(['docker', 'compose', '--project-directory', str(root), '-f', str(root / 'compose.yaml'), *args], capture_output=True, text=True)
                if check and result.returncode:
                    self.fail(f'Compose {args[0]} failed:\n{result.stdout}\n{result.stderr}')
                return result

            def sql(statement):
                return compose('exec', '-T', 'database', 'mariadb', '-uroot', '-pbackup-test-root', '-N', '-e', statement).stdout.strip()

            try:
                compose('up', '-d', 'database')
                deadline = time.monotonic() + 60
                while True:
                    # TCP becomes available after all initialization scripts have finished.
                    ready = compose('exec', '-T', 'database', 'mariadb', '-h127.0.0.1', '-uroot', '-pbackup-test-root', '-N', '-e', 'SELECT 1', check=False)
                    if ready.returncode == 0:
                        break
                    if time.monotonic() >= deadline:
                        self.fail(compose('logs', 'database').stdout)
                    time.sleep(0.25)
                # Exercise the actual first-install entrypoint, including the
                # unprivileged catalog-baseline read and custom catalog refresh.
                compose('run', '--rm', '--no-deps', '-T', 'api', 'initialize', '--no-color')
                compose('up', '-d', 'api')
                deadline = time.monotonic() + 30
                while compose('exec', '-T', 'api', 'curl', '-fsS', 'http://localhost:8080/api/health', check=False).returncode != 0:
                    if time.monotonic() >= deadline:
                        self.fail(compose('logs', 'api').stdout)
                    time.sleep(0.25)
                probe = '''import http.cookiejar,json,urllib.request,urllib.parse
base='http://localhost:8080'
jar=http.cookiejar.CookieJar()
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
for route in ['/','/user/login','/user/login/']:
 with client.open(base+route) as r: assert b'<html' in r.read().lower()
client.open(base+'/api/auth/csrf').close()
csrf=next(c.value for c in jar if c.name=='XSRF-TOKEN')
request=urllib.request.Request(base+'/api/auth/login',data=json.dumps({'username':'admin','password':'admin'}).encode(),headers={'Content-Type':'application/json','Origin':origin,'X-XSRF-TOKEN':urllib.parse.unquote(csrf)})
with client.open(request) as r: assert r.status==200
with client.open(base+'/api/auth/user') as r: assert 'admin' in json.dumps(json.load(r))
with client.open(base+'/api/game-data/items?perPage=1') as r: assert len(json.load(r)['data']) == 1
'''
                probe = 'origin=' + repr(config['services']['api']['environment']['APP_URL']) + '\n' + probe
                compose('exec', '-T', 'api', 'python3', '-c', probe)
                if browser_probe:
                    subprocess.run(['node', browser_probe, browser_url], check=True, timeout=120)
                # Stop the API before intentionally replacing backed-up rows.
                compose('stop', 'api')
                sql("UPDATE happyro.login SET email='snapshot@example.com' WHERE userid='happyro'")
                backup = root / 'backup'
                manage.backup(argparse.Namespace(directory=root, output=backup))
                self.assertTrue((backup / 'server-settings.tar').is_file())
                self.assertFalse((backup / 'admin-files.tar').exists())
                sql("UPDATE happyro_admin.users SET username='changed' WHERE username='admin'; UPDATE happyro.login SET email='changed@example.com' WHERE userid='happyro'")
                (settings / 'battle_conf.txt').write_text('base_exp_rate: 900\n')
                (custom / 'npc/scripts.conf').write_text('// changed after backup\n')
                manage.restore(argparse.Namespace(directory=root, backup=backup, confirm_replace=True))
                self.assertEqual(sql('SELECT username FROM happyro_admin.users'), 'admin')
                self.assertEqual(sql("SELECT email FROM happyro.login WHERE userid='happyro'"), 'snapshot@example.com')
                self.assertEqual((settings / 'battle_conf.txt').read_text(), 'base_exp_rate: 250\n')
                self.assertEqual((custom / 'npc/scripts.conf').read_text(), '// backed up custom scripts\n')
            finally:
                compose('down', '--volumes', '--remove-orphans', check=False)


if __name__ == '__main__':
    unittest.main()
