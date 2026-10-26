"""Render the production Compose template with non-secret test settings."""
import json
import os
from pathlib import Path
import subprocess


def release_compose():
    root = Path(__file__).resolve().parents[2]
    template = (root / 'deploy/docker/.env.example').read_text()
    values = dict(line.split('=', 1) for line in template.splitlines()
                  if line and not line.startswith('#'))
    release_version = (root / 'deploy/docker/VERSION').read_text().strip()
    values = {key: value.replace('@VERSION@', release_version)
              for key, value in values.items()}
    for key in ('DB_PASSWORD', 'ADMIN_DB_PASSWORD', 'MARIADB_ROOT_PASSWORD',
                'INTERSERVER_PASSWORD', 'GAME_CONTROL_TOKEN'):
        values[key] = 'isolated-test-placeholder'
    # Allow isolated test subnets on hosts already running the production stack.
    for key in ('ADMIN_PROXY_SUBNET', 'ADMIN_PROXY_DYNAMIC_RANGE', 'ADMIN_PROXY_IP'):
        values[key] = os.environ.get('HAPPYRO_TEST_' + key, values[key])
    return json.loads(subprocess.check_output([
        'docker', 'compose', '--env-file', os.devnull,
        '-f', str(root / 'deploy/docker/compose.yml'), 'config', '--format', 'json',
    ], env={**os.environ, **values}, text=True))


def add_proxy_topology(config, release):
    """Use the production network/IPAM and trust settings in an isolated project."""
    network = release['networks']['admin-proxy'].copy()
    network.pop('name', None)  # Compose must namespace it with the test project.
    config['networks'] = {'default': {}, 'admin-proxy': network}
    for name in ('api', 'admin'):
        config['services'][name]['networks'] = release['services'][name]['networks']
    config['services']['api'].setdefault('environment', {})['HTTP_TRUSTED_PROXIES'] = (
        release['services']['api']['environment']['HTTP_TRUSTED_PROXIES'])
