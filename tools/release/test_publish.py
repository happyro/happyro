"""Publication ordering and full-index identity, without contacting a registry."""
import argparse
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from tools.deployment.offline import NAMES, digest
from tools.release import publish


def index(salt=''):
    return json.dumps({'manifests': [
        {'platform': {'os': 'linux', 'architecture': arch}, 'digest': f'sha256:{arch}{salt}'}
        for arch in ('amd64', 'arm64')]}).encode()


class PublishTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        self.args = argparse.Namespace(workspace=self.root, version='v9.0.0', images=self.root / 'images',
                                       bundle=self.root / 'bundle', evidence=self.root / 'evidence')
        self.args.images.mkdir()
        (self.root / 'deploy/docker').mkdir(parents=True)
        (self.root / 'deploy/docker/VERSION').write_text('v9.0.0')
        self.state = {'version': 'v9.0.0', 'sources': {'root': 'revision'}, 'images': {}}
        for name in NAMES:
            file = self.args.images / f'{name}.tar'
            file.write_bytes(name.encode())
            self.state['images'][name] = digest(file)
        (self.args.images / 'built.json').write_text(json.dumps(self.state))
        patcher = patch.object(publish, 'verify', return_value=self.state)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_explicit_version_does_not_silently_follow_changed_source_version(self):
        (self.root / 'deploy/docker/VERSION').write_text('v10.0.0')
        with patch.object(publish, 'raw_index', return_value=index()), patch.object(publish, 'copy') as copy:
            publish.publish(self.args)
        self.assertTrue(all(call.args[1].endswith(':v9.0.0') for call in copy.call_args_list[:5]))

    def test_all_versions_precede_latest_and_final_remote_reads_match_local(self):
        with patch.object(publish, 'raw_index', return_value=index()) as inspect, patch.object(publish, 'copy') as copy:
            publish.publish(self.args)
        targets = [call.args[1] for call in copy.call_args_list]
        self.assertEqual(len(targets), 10)
        self.assertTrue(all(t.endswith(':v9.0.0') for t in targets[:5]))
        self.assertTrue(all(t.endswith(':latest') for t in targets[5:]))
        self.assertEqual(inspect.call_count, 20)
        result = json.loads((self.args.evidence / 'verified.json').read_text())
        self.assertEqual(set(result['images']), set(NAMES))
        self.assertEqual(result['images']['api']['manifests'], json.loads(index())['manifests'])

    def test_corrupt_last_archive_prevents_every_push(self):
        (self.args.images / f'{NAMES[-1]}.tar').write_bytes(b'corrupt')
        with patch.object(publish, 'raw_index', return_value=index()), patch.object(publish, 'copy') as copy:
            with self.assertRaisesRegex(ValueError, 'Changed OCI'):
                publish.publish(self.args)
        copy.assert_not_called()

    def test_wrong_version_index_never_updates_latest(self):
        def inspect(ref):
            return index('wrong') if ref.startswith('docker:') else index()
        with patch.object(publish, 'raw_index', side_effect=inspect), patch.object(publish, 'copy') as copy:
            with self.assertRaisesRegex(ValueError, 'differs from local'):
                publish.publish(self.args)
        self.assertEqual(copy.call_count, 1)
        self.assertFalse((self.args.evidence / 'verified.json').exists())

    def test_final_latest_mismatch_is_not_reported_as_success(self):
        def inspect(ref):
            return index('wrong') if ref.endswith(':latest') else index()
        with patch.object(publish, 'raw_index', side_effect=inspect), patch.object(publish, 'copy'):
            with self.assertRaisesRegex(ValueError, 'differs from the local full index'):
                publish.publish(self.args)
        self.assertFalse((self.args.evidence / 'verified.json').exists())

    def test_single_architecture_is_rejected(self):
        raw = json.dumps({'manifests': json.loads(index())['manifests'][:1]}).encode()
        with patch.object(publish.subprocess, 'check_output', return_value=raw):
            with self.assertRaisesRegex(ValueError, 'Missing amd64/arm64'):
                publish.raw_index('fixture')

    def test_copy_preserves_all_platforms_and_digests(self):
        with patch.object(publish.subprocess, 'run') as run:
            publish.copy('oci-archive:fixture', 'docker://test/image:latest')
        self.assertIn('--all', run.call_args.args[0])
        self.assertIn('--preserve-digests', run.call_args.args[0])
        self.assertTrue(run.call_args.kwargs['check'])
