import os
from pathlib import Path
import plistlib
import subprocess
import tempfile
import unittest

import native_api


class NativeAdminTest(unittest.TestCase):
    def test_generated_service_loads_environment_and_preserves_quoted_paths(self):
        with tempfile.TemporaryDirectory(prefix='happyro native ') as directory:
            root = Path(directory).resolve()
            backend = root / 'repos/happyro-api'
            backend.mkdir(parents=True)
            (backend / 'go.mod').write_text('module test\n')
            binary = root / 'go api'
            binary.write_text('#!/bin/sh\n[ "$1" = serve ] && [ "$HTTP_LISTEN" = "127.0.0.1:18081" ] && [ "$TEST_VALUE" = "a b" ]\n')
            binary.chmod(0o755)
            environment = root / 'go environment'
            environment.write_text("HTTP_LISTEN=127.0.0.1:18081\nTEST_VALUE='a b'\n")
            output = root / 'service.plist'
            native_api.prepare(root, binary, environment, output)
            config = plistlib.loads(output.read_bytes())
            self.assertEqual(config['Label'], 'local.happyro.api')
            self.assertNotIn('EnvironmentVariables', config)
            result = subprocess.run(config['ProgramArguments'], cwd=config['WorkingDirectory'], env={'PATH': '/usr/bin:/bin'}, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            with self.assertRaises(FileExistsError):
                native_api.prepare(root, binary, environment, output)
            environment.write_text('return 17\n')
            result = subprocess.run(config['ProgramArguments'], cwd=config['WorkingDirectory'], capture_output=True)
            self.assertEqual(result.returncode, 17)

    def test_no_arguments_only_print_help(self):
        script = Path(native_api.__file__)
        with tempfile.TemporaryDirectory() as directory:
            result = subprocess.run(['python3', str(script), '--no-color'], cwd=directory, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            self.assertTrue(result.stdout.startswith('\n'))
            self.assertTrue(result.stdout.endswith('\n\n'))
            self.assertNotIn('\x1b[', result.stdout)
            self.assertEqual(os.listdir(directory), [])

    def test_service_start_rejects_legacy_entrypoint_before_database(self):
        script = Path(native_api.__file__).resolve().parents[2] / 'scripts/local/macos-services.sh'
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            target = root / 'scripts/local/macos-services.sh'
            target.parent.mkdir(parents=True)
            target.write_bytes(script.read_bytes())
            plist = root / 'work/runtime/native/launchd/local.happyro.api.plist'
            plist.parent.mkdir(parents=True)
            plist.write_bytes(plistlib.dumps({'ProgramArguments': ['/usr/bin/php', 'artisan', 'serve']}))
            commands = root / 'commands'
            commands.mkdir()
            (commands / 'uname').write_text('#!/bin/sh\nprintf Darwin\n')
            (commands / 'uname').chmod(0o755)
            result = subprocess.run(['bash', str(target), 'start', '--no-color'], env={**os.environ, 'PATH': str(commands) + ':' + os.environ['PATH']}, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('still uses PHP', result.stderr)
            self.assertNotIn('database:', result.stdout)
