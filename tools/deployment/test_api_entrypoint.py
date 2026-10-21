"""Exercise the container entrypoint without a database or live deployment."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ENTRYPOINT = Path(__file__).resolve().parents[2] / 'repos/happyro-api/deploy/docker/entrypoint.sh'


class AdminGoEntrypointTest(unittest.TestCase):
    def run_entrypoint(self, args, fail=''):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            log = root / 'calls'
            api = root / 'happyro-api'
            api.write_text('#!/bin/sh\nprintf "api %s\\n" "$*" >> "$CALL_LOG"\n')
            api.chmod(0o755)
            gosu = root / 'gosu'
            gosu.write_text('''#!/bin/sh
printf 'gosu %s\\n' "$*" >> "$CALL_LOG"
if [ -n "$FAIL_STEP" ] && [ "$3" = "$FAIL_STEP" ]; then exit 17; fi
''')
            gosu.chmod(0o755)
            env = {**os.environ, 'PATH': f'{root}:/usr/bin:/bin', 'CALL_LOG': str(log), 'FAIL_STEP': fail}
            result = subprocess.run(['sh', str(ENTRYPOINT), *args], env=env, capture_output=True, text=True)
            return result, log.read_text().splitlines() if log.exists() else []

    def test_no_arguments_and_help_do_not_initialize(self):
        for args in ([], ['--help'], ['--no-color'], ['-h'], ['initialize', '--help'], ['refresh-custom-catalogs', '--help', '--no-color']):
            result, calls = self.run_entrypoint(args)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(calls, [])
            self.assertIn('initialize', result.stdout)
            self.assertIn('refresh-custom-catalogs', result.stdout)
            self.assertTrue(result.stdout.startswith('\n'))
            self.assertTrue(result.stdout.endswith('\n\n'))
            if '--no-color' in args:
                self.assertNotIn('\x1b[', result.stdout)
            else:
                self.assertIn('\x1b[1;36m', result.stdout)

    def test_invalid_options_never_initialize(self):
        for args in (['initialize', '--unknown'], ['initialize', '--help', '--unknown'],
                     ['refresh-custom-catalogs', 'unexpected'], ['--no-color', 'initialize']):
            result, calls = self.run_entrypoint(args)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(calls, [])

    def test_initialization_orders_migrations_account_and_atomic_catalog_import(self):
        result, calls = self.run_entrypoint(['initialize', '--no-color'])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls[:2], ['gosu www-data happyro-api migrate --no-color', 'gosu www-data happyro-api init --no-color'])
        self.assertEqual(len(calls), 4)
        self.assertIn('python3 /opt/happyro/catalogs.py refresh', calls[2])
        self.assertIn('happyro-api catalog import --client-items', calls[3])
        for flag in ('--server-items', '--monsters', '--npcs'):
            self.assertIn(flag, calls[3])

    def test_initialization_stops_on_failure(self):
        result, calls = self.run_entrypoint(['initialize'], fail='migrate')
        self.assertEqual(result.returncode, 17)
        self.assertEqual(len(calls), 1)

    def test_serve_help_only_calls_go_help(self):
        result, calls = self.run_entrypoint(['serve', '--help', '--no-color'])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, ['gosu www-data happyro-api serve --help --no-color'])

    def test_management_commands_forward_arguments_without_shell_reinterpretation(self):
        result, calls = self.run_entrypoint(['users', 'password', 'operator', '--password-stdin'])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, ['gosu www-data happyro-api users password operator --password-stdin'])


if __name__ == '__main__':
    unittest.main()
