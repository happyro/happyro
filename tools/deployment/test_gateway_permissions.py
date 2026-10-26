"""Linux permission checks; set HAPPYRO_GATEWAY_TEST_IMAGE to an image with the entrypoint and gosu."""
import os
import subprocess
import unittest


@unittest.skipUnless(os.environ.get('HAPPYRO_GATEWAY_TEST_IMAGE'), 'requires Gateway permission test image')
class GatewayPermissionsTest(unittest.TestCase):
    def run_container(self, script, *options):
        return subprocess.run([
            'docker', 'run', '--rm', *options, '--user', '0:0', '--entrypoint', 'sh',
            os.environ['HAPPYRO_GATEWAY_TEST_IMAGE'], '-ec', script,
        ], capture_output=True, text=True)

    def test_foreign_owners_and_existing_logs(self):
        for uid in (0, 2000):
            with self.subTest(uid=uid):
                result = self.run_container(f'''
mkdir -p /opt/gateway/logs/nested
printf old > /opt/gateway/logs/nested/old.log
chown -R {uid}:{uid} /opt/gateway/logs
chmod 500 /opt/gateway/logs /opt/gateway/logs/nested
chmod 400 /opt/gateway/logs/nested/old.log
# Reproduce the old non-root process failing before initialization.
if gosu node sh -c 'echo fail >> /opt/gateway/logs/nested/old.log'; then exit 1; fi
happyro-gateway sh -ec '
    test "$(id -u)" = 1000
    test "$(id -g)" = 1000
    printf new >> /opt/gateway/logs/nested/old.log
    test "$(cat /opt/gateway/logs/nested/old.log)" = oldnew
    touch /opt/gateway/logs/new.log
'
# Initialization is repeatable and does not truncate logs.
happyro-gateway sh -ec 'test "$(cat /opt/gateway/logs/nested/old.log)" = oldnew'
''', '--tmpfs', '/opt/gateway/logs')
                self.assertEqual(result.returncode, 0, result.stderr)

    def test_links_do_not_change_external_files(self):
        result = self.run_container('''
mkdir -p /opt/gateway/logs /outside
touch /outside/file
chmod 400 /outside/file
ln -s /outside /opt/gateway/logs/link
happyro-gateway true
test "$(stat -c '%u:%g:%a' /outside/file)" = 0:0:400
''')
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_read_only_mount_fails_before_start(self):
        result = self.run_container('happyro-gateway sh -c "echo APP_STARTED"',
                                    '--tmpfs', '/opt/gateway/logs:ro')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('cannot initialize /opt/gateway/logs', result.stderr)
        self.assertNotIn('APP_STARTED', result.stdout)

    def test_help_does_not_initialize_logs(self):
        result = self.run_container('''
# The image precreates logs; remove only this disposable container fixture.
rmdir /opt/gateway/logs
happyro-gateway
happyro-gateway --no-color
test ! -e /opt/gateway/logs
''')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(result.stdout.startswith('\n'))
        self.assertTrue(result.stdout.endswith('\n\n'))


if __name__ == '__main__':
    unittest.main()
