import unittest
from tools.localization.items.item_names import parse_names, base_name, is_chinese_name
from tools.localization.items.sync_item_names import sync_database, sync_item_info


class ItemNameTests(unittest.TestCase):
    def test_extracts_only_primary_rows_and_decodes_entities(self):
        page = '<a id="ro8-item-name-501" href="/item_info.php?id=501"><img><strong>名称 &amp; 原文</strong></a><span>物品 ID #501 (Red_Potion)</span><a href="/item_info.php?id=502">关联物品</a>'
        self.assertEqual(parse_names('dvg', page), {'501': {'name': '名称 & 原文', 'aegis': 'Red_Potion'}})

    def test_ro321_keeps_name_and_identity_together(self):
        page = "<span class='btext_L'> 红色药水 </span></b>&nbsp; 物品 ID# 501 (Red_Potion)</div>"
        self.assertEqual(parse_names('ro321', page)['501'], {'name': '红色药水', 'aegis': 'Red_Potion'})

    def test_rejects_untranslated_or_placeholder_names(self):
        self.assertTrue(is_chinese_name('红色药水'))
        for name in ['未命名道具', '未知物品', '(null)', 'Red Potion', '[衣装] エンジェリックリボン', '药水�', '药水포션']:
            self.assertFalse(is_chinese_name(name))

    def test_rejects_duplicate_primary_ids(self):
        row = '<a id="ro8-item-name-501"><strong>红色药水</strong></a><span>物品 ID #501 (Red_Potion)'
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            parse_names('dvg', row * 2)

    def test_removes_slot_decoration_only(self):
        self.assertEqual(base_name('手杖 [4]'), '手杖')
        self.assertEqual(base_name('古雅帽子[1]'), '古雅帽子')
        self.assertEqual(base_name('[租赁] 手杖'), '[租赁] 手杖')
        self.assertEqual(base_name('礼盒 [100]'), '礼盒 [100]')

    def test_database_changes_only_name_and_keeps_newlines(self):
        source = '  - Id: 501\r\n    AegisName: Red_Potion\r\n    Name: 旧名\r\n    Script: |\r\n      itemheal 45,0;\r\n  - Id: 502\r\n    Name: 其它\r\n'
        result = sync_database(source, {'501': {'name': '红色药水'}})
        self.assertEqual(result, source.replace('Name: 旧名', 'Name: "红色药水"'))
        self.assertEqual(sync_database(result, {'501': {'name': '红色药水'}}), result)

    def test_unidentified_equipment_does_not_leak_identified_name(self):
        payload = {'data': {'501': {'identifiedDisplayName': '旧名', 'unidentifiedDisplayName': '旧名', 'slotCount': 0},
                            '4001': {'identifiedDisplayName': '旧卡片', 'unidentifiedDisplayName': '卡片', 'slotCount': 0}}}
        sync_item_info(payload, {'501': {'name': '红色药水'}, '4001': {'name': '波利卡片'}})
        self.assertEqual(payload['data']['501']['unidentifiedDisplayName'], '红色药水')
        self.assertEqual(payload['data']['4001'], {'identifiedDisplayName': '波利卡片', 'unidentifiedDisplayName': '卡片', 'slotCount': 0})

class ItemReferenceTests(unittest.TestCase):
    def test_uses_id_even_when_an_old_name_is_ambiguous(self):
        from tools.localization.items.item_references import sync_item_links
        text = '<ITEM>蓝色宝石<INFO>717</INFO></ITEM>'
        self.assertEqual(sync_item_links(text, {'717': {'name': '蓝色魔力矿石'}}), '<ITEM>蓝色魔力矿石<INFO>717</INFO></ITEM>')

    def test_preserves_brackets_color_and_unknown_ids(self):
        from tools.localization.items.item_references import sync_item_links
        text = '<ITEM>^FF0000[旧名]^000000<INFO>717</INFO></ITEM> <ITEM>其它<INFO>999</INFO></ITEM>'
        self.assertEqual(sync_item_links(text, {'717': {'name': '蓝色魔力矿石'}}), '<ITEM>^FF0000[蓝色魔力矿石]^000000<INFO>717</INFO></ITEM> <ITEM>其它<INFO>999</INFO></ITEM>')

class ItemDescriptionRegressionTests(unittest.TestCase):
    def test_item_renaming_preserves_skill_and_role_meaning(self):
        import json
        from pathlib import Path
        root = Path(__file__).resolve().parents[4]
        items = json.loads((root / 'localization/sources/kro-20211105/merged/files/lub/itemInfo_true.json').read_text())['data']
        descriptions = lambda item_id: '\n'.join(items[item_id]['identifiedDescriptionName'])
        self.assertIn('龙之吐息', descriptions('5936'))
        self.assertIn('为狙击手制作', descriptions('5748'))
        self.assertIn('神圣十字钝器', descriptions('1528'))
        self.assertIn('贵族魔法斗篷', descriptions('450021'))
        self.assertNotIn('贵族魔法圣衣', descriptions('450021'))

class ReferenceSnapshotTests(unittest.TestCase):
    def run_incremental(self, failure=False):
        import json
        import tempfile
        from pathlib import Path
        from unittest.mock import patch
        from tools.localization.items import item_names
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            previous = {'501': {'name': '红色药水', 'aegis': 'Red_Potion', 'source': 'cached'}}
            snapshot = root / 'ro321-names.json'
            snapshot.write_text(json.dumps(previous))
            ids = root / 'ids.json'
            ids.write_text('[501, 502, 503]')
            result = {'url': 'detail', 'items': {'502': {'name': '赤色药水', 'aegis': 'Orange_Potion'}}}
            with patch.object(item_names, 'fetch', side_effect=RuntimeError('HTTP 403') if failure else None, return_value=result) as mocked_fetch:
                args = ['fetch', '--source', 'ro321', '--output', directory, '--ids', str(ids), '--limit', '1']
                if failure:
                    with self.assertRaisesRegex(RuntimeError, '403'):
                        item_names.main(args)
                else:
                    item_names.main(args)
            mocked_fetch.assert_called_once_with('ro321', 502, root / 'ro321')
            saved = json.loads(snapshot.read_text())
            self.assertEqual(saved['501'], previous['501'])
            self.assertEqual(set(saved), {'501'} if failure else {'501', '502'})
            status = json.loads((root / 'source-status.json').read_text())['ro321']
            self.assertEqual(status['lastRunComplete'], not failure)
            self.assertFalse(status['complete'])
            self.assertEqual(status['records'], len(saved))

    def test_single_id_fetch_preserves_existing_snapshot(self):
        self.run_incremental()

    def test_access_denial_preserves_existing_snapshot(self):
        self.run_incremental(failure=True)


class ScriptReferenceTests(unittest.TestCase):
    def test_preserves_code_comments_and_escapes_source_quotes(self):
        from tools.localization.items.item_references import sync_script_item_links
        link = '<ITEM>旧名<INFO>501</INFO></ITEM>'
        script = '// ' + link + '\n/* ' + link + ' */\nmes "' + link + '"; getitem 501,1;\r\n'
        result = sync_script_item_links(script, {'501': {'name': '药水"特别版'}})
        self.assertEqual(result, '// ' + link + '\n/* ' + link + ' */\nmes "<ITEM>药水\\"特别版<INFO>501</INFO></ITEM>"; getitem 501,1;\r\n')
        self.assertEqual(sync_script_item_links(result, {'501': {'name': '药水"特别版'}}), result)
