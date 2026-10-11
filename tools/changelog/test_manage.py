"""Exercise synchronization against isolated repositories, including rejection paths."""
import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location('changelog_manage', Path(__file__).with_name('manage.py'))
manage = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(manage)


class ChangelogTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.daily = self.root / 'changelog/2026/10/2026-10-12.md'
        self.daily.parent.mkdir(parents=True)
        self.daily.write_text('# 2026-10-12\n\n## 修复\n\n- `[client]` 修复显示。\n')
        self.release = self.root / 'changelog/releases/v0.3.2.md'
        self.release.parent.mkdir()
        self.release.write_text('# v0.3.2\n\n## Historical formatting\n\n- Original body.\n')
        (self.root / 'changelog/README.md').write_text(
            '- [date](2026/10/2026-10-12.md)\n- [release](releases/v0.3.2.md)\n')
        archive = self.root / 'changelog/archive/raw.md'
        archive.parent.mkdir()
        archive.write_text('Original bytes must stay here.\n')
        self.config = self.root / 'repos/happyro-doc/docs/.vitepress/config.js'
        self.config.parent.mkdir(parents=True)
        self.config.write_text('const changelog = [\n]\n\nexport default {}\n')

    def test_sync_is_idempotent_preserves_release_and_excludes_archive(self):
        self.assertEqual(manage.sync(self.root), 3)
        self.assertEqual(manage.sync(self.root), 0)
        self.assertEqual(manage.source_errors(self.root), [])
        self.assertEqual(manage.mirror_errors(self.root), [])
        doc = self.root / 'repos/happyro-doc/docs/changelog'
        self.assertEqual((doc / 'releases/v0.3.2.md').read_bytes(), self.release.read_bytes())
        self.assertFalse((doc / 'archive').exists())
        (doc / '2026/10/2026-10-12.md').write_text('drift')
        self.assertTrue(manage.mirror_errors(self.root))
        self.assertEqual(manage.sync(self.root), 1)

    def test_invalid_source_or_config_never_writes_copies(self):
        before = self.config.read_bytes()
        self.daily.write_text(self.daily.read_text().replace('`[client]`', '[client]'))
        with self.assertRaisesRegex(ValueError, 'scope'):
            manage.sync(self.root)
        self.assertEqual(before, self.config.read_bytes())
        self.assertFalse((self.root / 'repos/happyro-doc/docs/changelog').exists())
        self.daily.write_text('# 2026-10-12\n\n## 修复\n\n- `[client]` 修复显示。\n')
        self.config.write_text('export default {}\n')
        with self.assertRaisesRegex(ValueError, 'navigation block'):
            manage.sync(self.root)
        self.assertFalse((self.root / 'repos/happyro-doc/docs/changelog').exists())

    def test_missing_index_and_extra_doc_pages_fail(self):
        index = self.root / 'changelog/README.md'
        index.write_text('')
        self.assertTrue(manage.source_errors(self.root))
        index.write_text('- [date](2026/10/2026-10-12.md)\n- [release](releases/v0.3.2.md)\n')
        extra = self.root / 'repos/happyro-doc/docs/changelog/archive/raw.md'
        extra.parent.mkdir(parents=True)
        extra.write_text('Do not delete this silently')
        before = self.config.read_bytes()
        with self.assertRaisesRegex(ValueError, 'Unexpected doc pages'):
            manage.sync(self.root)
        self.assertEqual(extra.read_text(), 'Do not delete this silently')
        self.assertEqual(before, self.config.read_bytes())

    def test_compact_lists_pass_and_loose_lists_fail(self):
        compact = '# 2026-10-12\n\n## 修复\n\n- `[client]` 修复显示。\n- `[server]` 修复名称。\n'
        self.daily.write_text(compact)
        self.assertEqual(manage.source_errors(self.root), [])
        self.daily.write_text(compact.replace('。\n- ', '。\n\n- '))
        self.assertTrue(any('compact list' in e for e in manage.source_errors(self.root)))

    def test_no_command_only_prints_help(self):
        script = Path(manage.__file__).resolve()
        for args in [[], ['--no-color'], ['--help']]:
            result = subprocess.run([sys.executable, str(script), *args], cwd=self.root,
                                    capture_output=True, text=True, check=True)
            self.assertTrue(result.stdout.startswith('\n'))
            self.assertTrue(result.stdout.endswith('\n\n'))
            self.assertNotIn('Synchronized', result.stdout)
            self.assertEqual('\033[' in result.stdout, '--no-color' not in args)


if __name__ == '__main__':
    unittest.main()
