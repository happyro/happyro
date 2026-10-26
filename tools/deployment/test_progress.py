"""Progress remains observable while blocked and always stops after failure."""
from contextlib import redirect_stdout
import io
import threading
import unittest
from unittest.mock import patch

from tools.deployment import progress


class ProgressTests(unittest.TestCase):
    def test_heartbeat_and_failure_stop_worker_and_propagate(self):
        output = io.StringIO()
        waiting = threading.Event()
        original = progress.message

        def observe(text, kind='info'):
            original(text, kind)
            if '[进行中]' in text:
                waiting.set()

        with patch.object(progress, '_enabled', True), patch.object(progress, '_plain', True), \
                patch.object(progress, 'message', side_effect=observe), redirect_stdout(output):
            with self.assertRaisesRegex(ValueError, 'failure'):
                with progress.step('blocked task', interval=0.01):
                    self.assertTrue(waiting.wait(2))
                    raise ValueError('failure')
            captured = output.getvalue()
            self.assertIn('[进行中]', captured)
            self.assertIn('[未完成]', captured)
            self.assertNotIn('[完成]', captured)
            self.assertNotIn('\033[', captured)
            self.assertEqual(progress._stack, [])

    def test_color_and_plain_preserve_same_messages(self):
        outputs = []
        for plain in (False, True):
            output = io.StringIO()
            with patch.object(progress, '_enabled', True), patch.object(progress, '_plain', plain), \
                    redirect_stdout(output):
                progress.message('ready', 'done')
            outputs.append(output.getvalue())
        self.assertEqual(outputs, ['\033[1;32mready\033[0m\n', 'ready\n'])
