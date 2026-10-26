"""Exercise the native launchd environment publication without starting services."""
import os
from pathlib import Path
import plistlib
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]


class NativeServiceEnvironmentTest(unittest.TestCase):
    def publish(self, service, profile):
        source = (ROOT / 'scripts/local/macos-services.sh').read_text()
        begin = source.index('      if [[ "$service" == map')
        end = source.index('      if ! launchctl print "$domain/$label"', begin)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'deploy/rathena').mkdir(parents=True)
            (root / 'deploy/rathena/profile.env').write_text(profile)
            plist = root / 'service.plist'
            plist.write_bytes(plistlib.dumps({'EnvironmentVariables': {'KEEP': 'unchanged'}}))
            subprocess.run(['bash', '-eu', '-c', source[begin:end]], check=True,
                           env={**os.environ, 'project_root': str(root), 'plist': str(plist), 'service': service})
            return plistlib.loads(plist.read_bytes())['EnvironmentVariables']

    def test_character_server_uses_selected_birth_mode(self):
        for mode in ('classic', 'ship'):
            with self.subTest(mode=mode):
                self.assertEqual(self.publish('char', f'HAPPYRO_CHARACTER_START_MODE={mode}\n'),
                                 {'HAPPYRO_CHARACTER_START_MODE': mode, 'KEEP': 'unchanged'})

    def test_empty_birth_mode_uses_classic(self):
        self.assertEqual(self.publish('char', 'HAPPYRO_CHARACTER_START_MODE=\n')['HAPPYRO_CHARACTER_START_MODE'], 'classic')

    def test_map_overrides_preserve_empty_and_explicit_values(self):
        env = self.publish('map', 'HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS=23\nHAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY=0\n')
        self.assertEqual(env['HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS'], '23')
        self.assertEqual(env['HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY'], '0')
        self.assertEqual(env['HAPPYRO_GAME_MAX_WALK_PATH_CELLS'], '')
        self.assertEqual(env['KEEP'], 'unchanged')
        self.assertNotIn('HAPPYRO_CHARACTER_START_MODE', env)
