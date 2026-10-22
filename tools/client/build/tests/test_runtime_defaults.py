from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]


class RuntimeDefaultsDeploymentTests(unittest.TestCase):
    def test_every_client_default_is_available_in_native_and_docker_environments(self):
        fields = json.loads((ROOT / 'repos/happyro-client/src/Core/ClientDefaults.schema.json').read_text())['fields']
        compose = (ROOT / 'deploy/docker/compose.yml').read_text()
        templates = ['deploy/remote-client/.env.example', 'deploy/docker/.env.example', 'repos/happyro-gateway/.env.example']
        for name in fields:
            with self.subTest(variable=name):
                self.assertEqual(compose.count(f'      {name}: ${{{name}:-}}\n'), 1)
                for template in templates:
                    self.assertEqual((ROOT / template).read_text().splitlines().count(f'{name}='), 1, template)

    def test_root_config_and_client_install_both_forward_the_runtime_defaults(self):
        for name in ['configs/Config.happyro.js', 'repos/happyro-client/applications/pwa/Config.happyro.js']:
            with self.subTest(config=name):
                self.assertIn('clientDefaults: (window.ROConfigRuntime || {}).clientDefaults || {}', (ROOT / name).read_text())


if __name__ == '__main__':
    unittest.main()
