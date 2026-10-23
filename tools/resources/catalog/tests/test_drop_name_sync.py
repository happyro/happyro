import copy
import unittest
from tools.resources.catalog.sync_item_names import sync_drop_names


class DropNameSyncTests(unittest.TestCase):
    def test_normal_and_mvp_drops_keep_gameplay_and_assets(self):
        payload = {'drops': {'1001': {'drops': [{'itemId': 990, 'name': '旧名', 'rate': 100, 'icon': '990.png'}],
                                    'mvpDrops': [{'itemId': 990, 'name': '旧名', 'rate': 50}], 'count': 2}}}
        expected = copy.deepcopy(payload)
        expected['drops']['1001']['drops'][0]['name'] = '火灵矿石'
        expected['drops']['1001']['mvpDrops'][0]['name'] = '火灵矿石'
        sync_drop_names(payload, {'990': {'name': '火灵矿石'}})
        self.assertEqual(payload, expected)
        sync_drop_names(payload, {'990': {'name': '火灵矿石'}})
        self.assertEqual(payload, expected)

    def test_unknown_id_is_not_silently_skipped(self):
        with self.assertRaisesRegex(ValueError, 'unknown drop item: 990'):
            sync_drop_names({'drops': {'1': {'drops': [{'itemId': 990, 'name': '旧名'}]}}}, {})
