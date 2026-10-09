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

import catalogs
import custom
import manage


class CustomTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
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
            manage.validate_zip_target(self.root, self.root.parent / 'package.zip')

    def test_custom_root_uses_resolved_compose_paths(self):
        config = {'services': {'map': {'volumes': [
            {'source': str(self.user / 'npc'), 'target': '/opt/happyro/custom/npc'}]}}}
        self.assertEqual(custom.custom_root(config), self.user)

    def test_override_and_additions_follow_load_list_not_directory_scan(self):
        server = self.root / 'server'
        self.write(server / 'conf/script_athena.conf', '// none')
        self.write(server / 'npc/re/scripts_main.conf', 'npc: npc/a.txt\n')
        self.write(server / 'npc/a.txt', 'prontera,1,2,4\tscript\tOld\t100,{\n}\n')
        old = {'id': 'prontera:1:2:Old', 'map': 'prontera', 'source': {'path': 'npc/a.txt'},
               'sprite_key': '100', 'sprite_id': 100, 'display_sprite_id': 100, 'image_available': True}
        base = {'entries': [old], 'sources': {}, 'version': 'baseline'}
        self.write(self.user / 'npc/overrides/a.txt', '// disabled')
        self.write(self.user / 'npc/additions/a.txt', 'prontera,4,5,4\tscript\tNew\t100,{\n}\n')
        self.write(self.user / 'npc/additions/not_loaded.txt', 'prontera,8,9,4\tscript\tHidden\t100,{\n}\n')
        self.write(self.user / 'npc/scripts.conf', 'npc: additions/a.txt\n')
        result = catalogs.npc_catalog(base, server, self.user / 'npc')
        self.assertEqual([e['name'] for e in result['entries']], ['New'])
        self.assertTrue(result['entries'][0]['game_visible'])
        self.assertFalse(result['entries'][0]['capabilities']['can_teleport_to_npc'])
        (self.user / 'npc/overrides/a.txt').unlink()
        self.assertEqual(len(catalogs.npc_catalog(base, server, self.user / 'npc')['entries']), 2)

    def test_nested_custom_import_and_cycle(self):
        server = self.root / 'server'
        self.write(server / 'conf/script_athena.conf', '')
        self.write(server / 'npc/re/scripts_main.conf', '')
        self.write(self.user / 'npc/scripts.conf', 'import: additions/event.conf')
        self.write(self.user / 'npc/additions/event.conf', 'npc: additions/event.txt')
        self.write(self.user / 'npc/additions/event.txt', '// event')
        self.assertEqual(len(catalogs.npc_sources(server, self.user / 'npc')), 1)
        self.write(self.user / 'npc/additions/event.conf', 'import: additions/event.conf')
        with self.assertRaisesRegex(ValueError, 'Circular'): catalogs.npc_sources(server, self.user / 'npc')

    def test_database_overlay_keeps_omitted_fields_and_reverts_from_base(self):
        base = {'items': {'501': {'AegisName': 'Red_Potion', 'names': {'zh-CN': '红色药水'}, 'Buy': 10, 'Sell': 5, 'Weight': 70}}}
        original = copy.deepcopy(base)
        self.write(self.user / 'db/item_db.yml', 'Header: {Type: ITEM_DB, Version: 3}\nBody:\n- Id: 501\n  Buy: 20\n  Name: 定制药水\n')
        result = catalogs.database_catalog(base, self.user / 'db', 'item_db.yml', 'ITEM_DB', 'items')
        self.assertEqual(result['items']['501']['Weight'], 70)
        self.assertEqual(result['items']['501']['Sell'], 10)
        self.assertEqual(base, original)
        self.write(self.user / 'db/item_db.yml', 'Header: {Type: ITEM_DB, Version: 3}\n')
        self.assertEqual(catalogs.database_catalog(base, self.user / 'db', 'item_db.yml', 'ITEM_DB', 'items')['items'], base['items'])

    def test_database_drop_index_replaces_and_unindexed_appends(self):
        base = {'AegisName': 'Poring', 'names': {'zh-CN': '波利'}, 'Drops': [{'Item': 'Apple', 'Rate': 100}]}
        result = catalogs.merge_record(base, {'Drops': [{'Index': 0, 'Item': 'Apple', 'Rate': 500}, {'Item': 'Red_Potion', 'Rate': 200}]}, 'MOB_DB')
        self.assertEqual([d['Rate'] for d in result['Drops']], [500, 200])
        with self.assertRaises(ValueError): catalogs.merge_record(base, {'Drops': [{'Index': 8, 'Item': 'Apple', 'Rate': 1}]}, 'MOB_DB')

    def test_database_import_modes_and_clear(self):
        base = {'items': {'1': {'AegisName': 'Old', 'names': {'zh-CN': 'Old'}}}}
        self.write(self.user / 'db/item_db.yml', 'Header: {Type: ITEM_DB, Version: 3, Clear: true}\nFooter:\n  Imports:\n  - Path: db/import/new.yml\n    Mode: Renewal\n  - Path: db/import/missing.yml\n    Mode: Prerenewal\n')
        self.write(self.user / 'db/new.yml', 'Header: {Type: ITEM_DB, Version: 3}\nBody:\n- Id: 2\n  AegisName: New\n  Name: New\n')
        result = catalogs.database_catalog(base, self.user / 'db', 'item_db.yml', 'ITEM_DB', 'items')
        self.assertEqual(list(result['items']), ['2'])
        self.write(self.user / 'db/new.yml', 'Header: {Type: ITEM_DB, Version: 3}\nFooter:\n  Imports:\n  - Path: db/import/item_db.yml\n')
        with self.assertRaisesRegex(ValueError, 'Circular'): catalogs.database_catalog(base, self.user / 'db', 'item_db.yml', 'ITEM_DB', 'items')


if __name__ == '__main__': unittest.main()
