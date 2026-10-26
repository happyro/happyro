"""Resource transfers preserve build inputs and cannot clean release artifacts."""
import argparse
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

from tools.release import resources
from tools.release.lifecycle import Layout, version_lock
from tools.release.operations import clean
from tools.deployment.offline import digest


class ResourceTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        (self.root / 'deploy/docker').mkdir(parents=True)
        (self.root / 'deploy/docker/VERSION').write_text('v9.0.0\n')
        for name in resources.INPUTS:
            path = self.root / name
            path.mkdir(parents=True)
            (path / 'empty').mkdir()
            (path / 'payload').write_bytes(b'input\x00bytes')
            (path / '._junk').write_text('metadata')
            (path / '.DS_Store').mkdir()
            (path / '.DS_Store/ignored').write_text('metadata')
        self.args = argparse.Namespace(workspace=self.root, version=None)

    def cleanup(self, include=True, execute=True):
        clean(argparse.Namespace(workspace=self.root, version='v9.0.0', group='resources',
                                 include_package=include, execute=execute))

    def test_roundtrip_manifest_no_overwrite_and_isolated_cleanup(self):
        output = resources.create(self.args)
        layout = resources.ResourceLayout(self.root, 'v9.0.0')
        manifest = json.loads(layout.manifest.read_text())
        self.assertEqual(manifest['archive']['sha256'], digest(output))
        self.assertEqual(layout.checksum.read_text(), f'{digest(output)}  {output.name}\n')
        with tarfile.open(output) as archive:
            self.assertFalse(any('._' in n or '.DS_Store' in n for n in archive.getnames()))
            for name in resources.INPUTS:
                self.assertEqual(archive.extractfile(name + '/payload').read(), b'input\x00bytes')
                self.assertTrue(archive.getmember(name + '/empty').isdir())
        with self.assertRaisesRegex(ValueError, 'already exists'):
            resources.create(self.args)
        release = Layout(self.root, 'v9.0.0')
        release.create({})
        self.cleanup(execute=False)
        self.assertTrue(output.exists())
        self.cleanup()
        self.assertFalse(layout.artifacts.exists())
        self.assertTrue(release.artifacts.exists())
        self.assertTrue(resources.create(self.args).exists())

    def test_missing_input_symlink_and_wrong_version_fail_before_registration(self):
        layout = resources.ResourceLayout(self.root, 'v9.0.0')
        self.args.version = 'v9.0.1'
        with self.assertRaises(ValueError):
            resources.create(self.args)
        self.args.version = None
        path = self.root / resources.INPUTS[0] / 'link'
        path.symlink_to(self.root / resources.INPUTS[1])
        with self.assertRaisesRegex(ValueError, 'regular'):
            resources.create(self.args)
        self.assertFalse(layout.artifacts.exists())
        path.unlink()
        (self.root / resources.INPUTS[0]).rename(self.root / 'missing')
        with self.assertRaisesRegex(ValueError, 'Missing'):
            resources.create(self.args)

    def test_source_mutation_and_busy_lock(self):
        layout = resources.ResourceLayout(self.root, 'v9.0.0')
        with version_lock(layout), self.assertRaises(ValueError):
            resources.create(self.args)
        original = resources.write_archive
        def mutate(root, target, entries):
            (root / resources.INPUTS[0] / 'payload').write_bytes(b'changed bytes')
            original(root, target, entries)
        with patch.object(resources, 'write_archive', side_effect=mutate):
            with self.assertRaisesRegex(ValueError, 'changed'):
                resources.create(self.args)
        self.assertFalse(layout.archive.exists())
        self.cleanup()
        self.assertFalse(layout.artifacts.exists())

    def test_rebuild_preflight_preserves_old_package_then_replaces_it(self):
        output = resources.create(self.args)
        previous = digest(output)
        self.args.rebuild = True
        self.args.version = 'v9.0.1'
        with self.assertRaises(ValueError):
            resources.create(self.args)
        self.assertEqual(digest(output), previous)
        self.args.version = None
        with patch.object(resources, 'inventory', side_effect=ValueError('missing input')):
            with self.assertRaises(ValueError):
                resources.create(self.args)
        self.assertEqual(digest(output), previous)
        layout = resources.ResourceLayout(self.root, 'v9.0.0')
        with version_lock(layout), self.assertRaises(ValueError):
            resources.create(self.args)
        self.assertEqual(digest(output), previous)
        (self.root / resources.INPUTS[0] / 'payload').write_bytes(b'new contents')
        resources.create(self.args)
        self.assertNotEqual(digest(output), previous)
        with tarfile.open(output) as archive:
            self.assertEqual(archive.extractfile(resources.INPUTS[0] + '/payload').read(), b'new contents')

    def test_rebuild_after_write_failure_cleans_partial_batch(self):
        self.args.rebuild = True
        with patch.object(resources, 'write_archive', side_effect=OSError('write failed')):
            with self.assertRaises(OSError):
                resources.create(self.args)
        self.assertTrue(resources.create(self.args).exists())
