"""Opt-in Docker regression for the actual release proxy address allocation."""
import ipaddress
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
import uuid

from tools.deployment.deployment_test_support import add_proxy_topology, release_compose


@unittest.skipUnless(os.environ.get('HAPPYRO_NETWORK_TEST_IMAGE'),
                     'requires a local image with sleep and true')
class ProxyNetworkTest(unittest.TestCase):
    def test_api_first_start_and_replacement_preserve_admin_address(self):
        release = release_compose()
        image = os.environ['HAPPYRO_NETWORK_TEST_IMAGE']
        config = {'name': 'happyro-proxy-test-' + uuid.uuid4().hex[:12], 'services': {}}
        for name in ('api', 'admin'):
            config['services'][name] = {
                'image': image, 'pull_policy': 'never', 'entrypoint': ['sleep', '120'],
                'healthcheck': {'test': ['CMD', 'true'], 'interval': '1s',
                                'timeout': '1s', 'retries': 10},
            }
        config['services']['admin']['depends_on'] = release['services']['admin']['depends_on']
        add_proxy_topology(config, release)
        with tempfile.TemporaryDirectory(prefix='happyro-proxy-test-') as temporary:
            path = Path(temporary) / 'compose.json'
            path.write_text(json.dumps(config))
            command = ['docker', 'compose', '-f', str(path)]

            def compose(*args, check=True):
                result = subprocess.run(command + list(args), capture_output=True, text=True, timeout=45)
                if check and result.returncode:
                    self.fail(result.stdout + result.stderr)
                return result

            def addresses():
                result = {}
                for name in ('api', 'admin'):
                    identifier = compose('ps', '-q', name).stdout.strip()
                    container = json.loads(subprocess.check_output(['docker', 'inspect', identifier]))[0]
                    result[name] = container['NetworkSettings']['Networks'][config['name'] + '_admin-proxy']['IPAddress']
                return result

            try:
                compose('up', '-d', '--wait', '--wait-timeout', '20')
                pool = ipaddress.ip_network(config['networks']['admin-proxy']['ipam']['config'][0]['ip_range'])
                expected = config['services']['api']['environment']['HTTP_TRUSTED_PROXIES']
                for recreate in (False, True):
                    if recreate:
                        compose('up', '-d', '--no-deps', '--force-recreate', '--wait', '--wait-timeout', '20', 'api')
                    actual = addresses()
                    self.assertEqual(actual['admin'], expected)
                    self.assertNotEqual(actual['api'], actual['admin'])
                    self.assertIn(ipaddress.ip_address(actual['api']), pool)
                    self.assertNotIn(ipaddress.ip_address(actual['admin']), pool)
            finally:
                compose('down', '--timeout', '1')
