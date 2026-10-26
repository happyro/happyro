"""Controller failures must not silently pass or replay a stateful scenario."""
import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from tools.acceptance import control


class ControlTests(unittest.TestCase):
    def test_help_has_no_network_effect(self):
        with patch.object(control.urllib.request, 'urlopen') as request, contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(control.main(['--no-color']), 0)
        request.assert_not_called()

    def test_explicit_port_and_failed_scenario_response(self):
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / 'scenario.js'
            file.write_text('return 42;')
            for success in (True, False):
                response = io.BytesIO(json.dumps({'ok': success, 'value': 42, 'error': 'scenario failed'}).encode())
                with patch.object(control.urllib.request, 'urlopen', return_value=response) as request, contextlib.redirect_stdout(io.StringIO()):
                    if success:
                        self.assertEqual(control.main(['--run', str(file), '--port', '9341']), 0)
                    else:
                        with self.assertRaisesRegex(ValueError, 'scenario failed'):
                            control.main(['--run', str(file), '--port', '9341'])
                request.assert_called_once()
                self.assertEqual(request.call_args.args[0].full_url, 'http://127.0.0.1:9341')
                self.assertEqual(json.loads(request.call_args.args[0].data)['code'], 'return 42;')
