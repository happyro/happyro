"""Content identity tracks dirty sources without changing the user's Git state."""
from pathlib import Path
import subprocess
import tempfile
import unittest

from tools.release.sources import repository


class SourcesTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name).resolve()
        self.git('init', '-q')
        (self.root / '.gitignore').write_text('work/\n')
        (self.root / 'source.txt').write_text('original')
        self.git('add', '.')
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
                 '-c', 'commit.gpgsign=false', 'commit', '-qm', 'test(source): Create fixture')

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.root), *args])

    def test_dirty_tracked_and_untracked_changes_are_recorded(self):
        original = repository(self.root)
        (self.root / 'source.txt').write_text('edited')
        edited = repository(self.root)
        self.assertFalse(original['dirty'])
        self.assertTrue(edited['dirty'])
        self.assertEqual(edited['head'], original['head'])
        self.assertNotEqual(edited['tree_sha256'], original['tree_sha256'])
        (self.root / 'new.txt').write_text('new source')
        added = repository(self.root)
        self.assertNotEqual(added['tree_sha256'], edited['tree_sha256'])
        self.assertEqual(added['files'], edited['files'] + 1)
        self.assertEqual(self.git('diff', '--cached'), b'')

    def test_ignored_outputs_do_not_change_source_identity(self):
        original = repository(self.root)
        (self.root / 'work').mkdir()
        (self.root / 'work/log').write_text('build log')
        self.assertEqual(repository(self.root), original)

    def test_deletions_and_executable_mode_changes_are_visible(self):
        original = repository(self.root)
        (self.root / 'source.txt').chmod(0o755)
        executable = repository(self.root)
        self.assertNotEqual(original['tree_sha256'], executable['tree_sha256'])
        (self.root / 'source.txt').unlink()
        deleted = repository(self.root)
        self.assertNotEqual(executable['tree_sha256'], deleted['tree_sha256'])

    def test_editing_an_already_dirty_file_changes_identity(self):
        (self.root / 'source.txt').write_text('dirty-one')
        before = repository(self.root)
        (self.root / 'source.txt').write_text('dirty-two')
        after = repository(self.root)
        self.assertEqual(before['dirty'], after['dirty'])
        self.assertNotEqual(before['tree_sha256'], after['tree_sha256'])
