"""Opt-in API/Admin/Database round trip using the release proxy topology."""
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

from tools.deployment import manage
from tools.deployment.deployment_test_support import add_proxy_topology, release_compose


@unittest.skipUnless(all(os.environ.get(name) for name in (
    'HAPPYRO_GO_API_TEST_IMAGE', 'HAPPYRO_GO_DATABASE_TEST_IMAGE', 'HAPPYRO_ADMIN_TEST_IMAGE')),
    'requires local API, Admin and Database test images')
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
            api_image = os.environ['HAPPYRO_GO_API_TEST_IMAGE']
            db_image = os.environ['HAPPYRO_GO_DATABASE_TEST_IMAGE']
            config = {
                'name': 'happyro-backup-' + uuid.uuid4().hex[:12],
                'services': {
                    'database': {'image': db_image, 'pull_policy': 'never', 'tmpfs': ['/var/lib/mysql'], 'environment': {
                        'MARIADB_ROOT_PASSWORD': 'backup-test-root', 'MARIADB_DATABASE': 'happyro',
                        'MARIADB_USER': 'happyro', 'MARIADB_PASSWORD': 'backup-test-game',
                        'HAPPYRO_SERVER_LOG_DB_NAME': 'happyro_log', 'HAPPYRO_API_ADMIN_DB_PASSWORD': 'backup-test-admin',
                        'HAPPYRO_SERVER_INTERSERVER_USERNAME': 'interserver', 'HAPPYRO_SERVER_INTERSERVER_PASSWORD': 'backuptestserver',
                    }},
                    'api': {'image': api_image, 'pull_policy': 'never', 'environment': {
                        'HAPPYRO_API_ADMIN_DB_HOST': 'database', 'HAPPYRO_API_ADMIN_DB_NAME': 'happyro_admin',
                        'HAPPYRO_API_ADMIN_DB_USERNAME': 'happyro_admin', 'HAPPYRO_API_ADMIN_DB_PASSWORD': 'backup-test-admin',
                        'HAPPYRO_API_GAME_DB_HOST': 'database', 'HAPPYRO_API_GAME_DB_NAME': 'happyro',
                        'HAPPYRO_API_GAME_LOG_DB_NAME': 'happyro_log', 'HAPPYRO_API_GAME_DB_USERNAME': 'happyro_admin',
                        'HAPPYRO_API_GAME_DB_PASSWORD': 'backup-test-admin', 'HAPPYRO_ADMIN_PUBLIC_URL': 'http://localhost:8080',
                        'HAPPYRO_API_MAP_INDEX_PATH': '/opt/api/resources/map_index.txt',
                        'HAPPYRO_API_BATTLE_CONFIG_PATH': '/run/happyro-settings/battle_conf.txt',
                    }, 'volumes': [
                        {'type': 'bind', 'source': str(settings), 'target': '/run/happyro-settings'},
                        {'type': 'bind', 'source': str(custom), 'target': '/opt/happyro/custom', 'read_only': True},
                    ]},
                    # The production tool resolves the customization root from the map mount.
                    'map': {'image': api_image, 'pull_policy': 'never', 'volumes': [
                        {'type': 'bind', 'source': str(custom / 'npc'), 'target': '/opt/happyro/custom/npc'},
                    ]},
                },
            }
            browser_probe = os.environ.get('HAPPYRO_GO_BROWSER_PROBE')
            browser_url = None
            config['services']['admin'] = {
                'image': os.environ['HAPPYRO_ADMIN_TEST_IMAGE'], 'pull_policy': 'never',
                'read_only': True, 'tmpfs': ['/tmp'],
                'cap_drop': ['ALL'], 'security_opt': ['no-new-privileges:true'],
            }
            release = release_compose()
            add_proxy_topology(config, release)
            config['services']['api']['healthcheck'] = release['services']['api']['healthcheck']
            config['services']['admin']['healthcheck'] = release['services']['admin']['healthcheck']
            config['services']['admin']['depends_on'] = release['services']['admin']['depends_on']
            if browser_probe:
                with socket.socket() as listener:
                    listener.bind(('127.0.0.1', 0))
                    port = listener.getsockname()[1]
                browser_url = f'http://127.0.0.1:{port}'
                config['services']['admin']['ports'] = [f'127.0.0.1:{port}:8080']
                config['services']['api']['environment']['HAPPYRO_ADMIN_PUBLIC_URL'] = browser_url
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
jar=http.cookiejar.CookieJar()
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
client.open(base+'/api/auth/csrf').close()
csrf=next(c.value for c in jar if c.name=='XSRF-TOKEN')
request=urllib.request.Request(base+'/api/auth/login',data=json.dumps({'username':'admin','password':'admin'}).encode(),headers={'Content-Type':'application/json','Origin':origin,'X-XSRF-TOKEN':urllib.parse.unquote(csrf),'X-Forwarded-For':'203.0.113.99','X-Real-IP':'203.0.113.99'})
with client.open(request) as r: assert r.status==200
with client.open(base+'/api/auth/user') as r: assert 'admin' in json.dumps(json.load(r))
with client.open(base+'/api/game-data/items?perPage=1') as r: assert len(json.load(r)['data']) == 1
'''
                probe = 'origin=' + repr(config['services']['api']['environment']['HAPPYRO_ADMIN_PUBLIC_URL']) + '\n' + probe
                compose('exec', '-T', 'api', 'python3', '-c', "base='http://localhost:8080'\n" + probe)
                compose('up', '-d', '--wait', '--wait-timeout', '45', 'admin')
                identifier = compose('ps', '-q', 'api').stdout.strip()
                container = json.loads(subprocess.check_output(['docker', 'inspect', identifier]))[0]
                client_ip = container['NetworkSettings']['Networks'][config['name'] + '_admin-proxy']['IPAddress']
                compose('exec', '-T', 'api', 'python3', '-c', "base='http://admin:8080'\n" + probe)
                self.assertEqual(sql("SELECT last_login_ip FROM happyro_admin.users WHERE username='admin'"), client_ip)
                self.assertEqual(sql("SELECT ip_address FROM happyro_admin.audit_logs WHERE action='auth.login_succeeded' ORDER BY id DESC LIMIT 1"), client_ip)
                if browser_probe:
                    subprocess.run(['node', browser_probe, browser_url], check=True, timeout=120)
                # The backup tool requires only the database to remain running.
                compose('stop', 'admin', 'api')
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
