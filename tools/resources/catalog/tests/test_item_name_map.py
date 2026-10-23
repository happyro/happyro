import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from tools.resources.catalog.merge_item_names import load_sources, merge, SOURCES


class MappingTests(unittest.TestCase):
    def test_identity_priority_and_grid_provenance(self):
        project = {str(i): {'AegisName': f'Item_{i}', 'names': {'zh-CN': '原名'}} for i in range(1, 6)}
        def row(name, identity=None):
            r = {'name': name, 'source': 'https://example.com/item'}
            if identity is not None:
                r['aegis'] = identity
            return r
        sources = {
            'dvg-list': {'1': row('列表名 [1]', 'Item_1'), '2': row('English', 'Item_2'),
                         '3': row('错误名称', 'Wrong'), '4': row('未命名道具', 'Item_4')},
            'dvg-grid': {'1': row('网格名'), '2': row('网格中文'), '3': row('网格错误'), '5': row('无身份中文')},
            'ro321': {'1': row('其他名称', 'Item_1'), '3': row('正确名称', 'Item_3'),
                      '4': row('日本語カナ', 'Item_4'), '9': row('项目外名称', 'Item_9')}}
        records, selected, unresolved, conflicts = merge(sources, project)
        self.assertEqual(selected['1']['name'], '列表名')
        self.assertIn('1', conflicts)
        self.assertEqual(selected['2']['name'], '网格中文')
        self.assertIsNone(selected['2']['sourceAegis'])
        self.assertEqual(selected['2']['identitySources'], ['dvg-list'])
        self.assertEqual(selected['3']['identitySources'], ['ro321'])
        self.assertEqual(records['3']['candidates'][0]['decision'], 'identity_conflict')
        self.assertEqual(set(unresolved), {'4', '5'})
        self.assertEqual(records['9']['reason'], 'outside_project')
        self.assertNotIn('9', selected)
        exclusions = {'2': {'source': 'dvg-grid', 'name': '网格中文', 'reason': 'unverified_language'}}
        records, selected, unresolved, _ = merge(sources, project, exclusions)
        self.assertNotIn('2', selected)
        self.assertIn('2', unresolved)
        self.assertEqual(records['2']['candidates'][1]['decision'], 'unverified_language')

    def test_corrupt_or_missing_shard_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for folder in SOURCES.values():
                dest = root / folder; dest.mkdir(parents=True)
                raw = json.dumps({'1': {'name': '名称'}}).encode()
                (dest / '001.json').write_bytes(raw)
                (dest / 'manifest.json').write_text(json.dumps({'records': 1, 'scanDate': '2026-10-24', 'parts': [
                    {'file': '001.json', 'records': 1, 'sha256': hashlib.sha256(raw).hexdigest()}]}))
            sources, _ = load_sources(root)
            self.assertEqual(len(sources), 3)
            (root / 'ro321/001.json').write_text('{}')
            with self.assertRaisesRegex(ValueError, 'hash mismatch'):
                load_sources(root)
