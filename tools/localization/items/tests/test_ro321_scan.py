import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from tools.localization.items import ro321_scan as scan


def page(item_id, count=2):
    return (f"<span class='btext_L'>测试物品</span></b>物品 ID# {item_id} (Item_{item_id})"
            f"<a href='page_num={count}' class = 'page_m' title='最后'>末页</a>").encode('gb18030')


class ScanTests(unittest.TestCase):
    def test_denial_preserves_progress_and_resume_skips_cache(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            denied = HTTPError('url', 403, 'Forbidden', {}, None)
            with patch.object(scan, 'ITEM_TYPES', (4,)), patch.object(scan, 'download', side_effect=[page(501), denied]) as fetch, patch.object(scan.time, 'sleep'):
                with self.assertRaises(HTTPError):
                    scan.scan(root, 8)
                self.assertEqual(fetch.call_count, 2)
            status = json.loads((root / 'source-status.json').read_text())['ro321']
            self.assertFalse(status['complete'])
            self.assertEqual(status['runState'], 'stopped')
            self.assertEqual(status['pages'], 1)
            self.assertIn('501', json.loads((root / 'ro321-names.json').read_text()))
            with patch.object(scan, 'ITEM_TYPES', (4,)), patch.object(scan, 'download', return_value=page(502)) as fetch:
                scan.scan(root, 8)
                fetch.assert_called_once_with(scan.page_url(4, 2))
            status = json.loads((root / 'source-status.json').read_text())['ro321']
            self.assertTrue(status['complete'])
            self.assertEqual(status['runState'], 'complete')
            self.assertEqual(status['pages'], status['expectedPages'])
            self.assertEqual(status['records'], 2)

    def test_conflicting_identity_cannot_overwrite_evidence(self):
        existing = {'501': {'name': '测试物品', 'aegis': 'Other_Item', 'source': 'prior'}}
        with self.assertRaisesRegex(ValueError, 'Conflicting'):
            scan.merge_items(existing, scan.parse_page(page(501), 4, 1))
        self.assertEqual(existing['501']['aegis'], 'Other_Item')

    def test_block_page_is_not_an_empty_success(self):
        with self.assertRaisesRegex(ValueError, 'unrecognized'):
            scan.parse_page(b'<html>Access denied</html>', 4, 1)

    def test_near_end_pagination_without_last_shortcut(self):
        raw = page(501, 11).replace(b" title='", b" data-title='")
        self.assertEqual(scan.parse_page(raw, 10, 6)['pages'], 11)
