"""Run NAVI verification using only the Gateway stage's declared COPY inputs."""
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]


class GatewayNaviStageTest(unittest.TestCase):
    def test_declared_inputs_are_sufficient(self):
        dockerfile = (ROOT / 'deploy/docker/gateway/Dockerfile').read_text()
        stage = dockerfile.split('FROM node:', 1)[0]
        (ROOT / 'work').mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(prefix='gateway-navi-', dir=ROOT / 'work') as directory:
            workspace = Path(directory)
            for line in stage.splitlines():
                if not line.startswith('COPY '):
                    continue
                _, source, target = shlex.split(line)
                destination = workspace / target
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.symlink_to(ROOT / source, target_is_directory=(ROOT / source).is_dir())
            result = subprocess.run([
                sys.executable, str(workspace / 'tools/resources/navigation/review.py'),
                'check', '--root', str(workspace), '--no-color',
            ], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
