"""Customization upgrade, backup and catalog behavior without Docker."""
import argparse
import copy
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

from tools.deployment import custom
from tools.release import package


class CustomTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.templates = self.root / 'templates'
        self.write(self.templates / 'npc/scripts.conf', '// empty\n')
        self.write(self.templates / 'db/item_db.yml', 'Header: {Type: ITEM_DB, Version: 3}\n')
        self.write(self.templates / 'db/mob_db.yml', 'Header: {Type: MOB_DB, Version: 4}\n')
        self.user = self.root / 'custom'
        custom.initialize(self.user, self.templates)

    def write(self, path, text):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        return path

    def test_upgrade_preserves_user_files_and_fills_only_missing_templates(self):
        self.write(self.user / 'db/item_db.yml', 'user changes')
        self.write(self.templates / 'db/item_db.yml', 'new version')
        self.write(self.templates / 'db/new_db.yml', 'new template')
        custom.initialize(self.user, self.templates)
        self.assertEqual((self.user / 'db/item_db.yml').read_text(), 'user changes')
        self.assertEqual((self.user / 'db/new_db.yml').read_text(), 'new template')

    def test_archive_roundtrip_removes_files_absent_in_backup(self):
        self.write(self.user / 'npc/overrides/custom/a.txt', '// original')
        self.write(self.user / 'resources/texture/test.bmp', 'image')
        archive = self.root / 'custom.tar'
        custom.backup(self.user, archive)
        self.write(self.user / 'npc/overrides/custom/a.txt', '// changed')
        self.write(self.user / 'resources/extra.bmp', 'extra')
        custom.restore(archive, self.user)
        self.assertEqual((self.user / 'npc/overrides/custom/a.txt').read_text(), '// original')
        self.assertEqual((self.user / 'resources/texture/test.bmp').read_text(), 'image')
        self.assertFalse((self.user / 'resources/extra.bmp').exists())

    def test_rejects_symlinks_and_manifest_overrides(self):
        link = self.user / 'resources/link'
        link.symlink_to(self.templates)
        with self.assertRaises(ValueError): custom.validate(self.user)
        link.unlink()
        self.write(self.user / 'npc/overrides/re/scripts_main.conf', '')
        with self.assertRaisesRegex(ValueError, 'Only .txt'): custom.validate(self.user)

    def test_archive_rejects_traversal_links_and_incomplete_backups(self):
        for name, kind in [('../escape', tarfile.REGTYPE), ('npc/evil', tarfile.SYMTYPE), ('unrelated', tarfile.REGTYPE)]:
            archive = self.root / 'bad.tar'
            with tarfile.open(archive, 'w') as tar:
                entry = tarfile.TarInfo(name); entry.type = kind
                if kind == tarfile.SYMTYPE: entry.linkname = '/etc/passwd'
                tar.addfile(entry, io.BytesIO(b''))
            with self.assertRaises(ValueError): custom.validate_backup(archive)

    def test_packaging_rejects_live_custom_files_even_without_env(self):
        with self.assertRaisesRegex(ValueError, 'user custom'):
            package.validate_zip_target(self.root, self.root.parent / 'package.zip')

    def test_custom_root_uses_resolved_compose_paths(self):
        config = {'services': {'map': {'volumes': [
            {'source': str(self.user / 'npc'), 'target': '/opt/happyro/custom/npc'}]}}}
        self.assertEqual(custom.custom_root(config), self.user)



if __name__ == '__main__': unittest.main()
