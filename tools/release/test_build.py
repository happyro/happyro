"""A release is complete only after all five uncached multi-platform builds."""
import argparse
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from tools.deployment.offline import NAMES
from tools.release import images


class BuildTests(unittest.TestCase):
    def test_all_images_are_uncached_and_source_changes_or_failures_never_complete(self):
        for failure in ('none', 'build', 'sources'):
            with self.subTest(failure=failure), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                args = argparse.Namespace(workspace=root, output=root / 'build')
                commands = []
                def run(*command):
                    if command[:3] != ('docker', 'buildx', 'build'):
                        return
                    commands.append(command)
                    if failure == 'build' and len(commands) == 2:
                        raise RuntimeError('build failed')
                    output = command[command.index('--output') + 1].split('dest=', 1)[1]
                    Path(output).write_bytes(b'fixture')
                revisions = [{'root': 'before'}, {'root': 'after' if failure == 'sources' else 'before'}]
                with patch.object(images, 'run', side_effect=run), patch.object(images, 'inspect'), \
                     patch.object(images, 'version', return_value='v9.0.0'), \
                     patch.object(images, 'snapshot', side_effect=revisions):
                    if failure == 'none':
                        images.build(args)
                        state = json.loads((args.output / 'built.json').read_text())
                        self.assertEqual(set(state['images']), set(NAMES))
                    else:
                        with self.assertRaises((RuntimeError, ValueError)):
                            images.build(args)
                        self.assertFalse((args.output / 'built.json').exists())
                self.assertEqual(len(commands), 2 if failure == 'build' else len(NAMES))
                for command in commands:
                    self.assertIn('--no-cache', command)
                    self.assertIn('--pull', command)
                    self.assertEqual(command[command.index('--platform') + 1], 'linux/amd64,linux/arm64')
