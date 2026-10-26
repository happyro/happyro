from pathlib import Path
import tempfile
import json
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from tools.localization.items import dvg_items_scan as scan


def page_html(page, total=5):
    rows = ''.join(f'<img src="/dbsource/items/collection/{i}.png"><span class="tw-font-bold font-16">药水 {i}</span></a><span class="tw-text-xs">物品 ID #{i} (Item_{i})</span>' for i in range(page * 20, page * 20 + 20))
    return (f"<span class='laypage-curr'>{page}</span><a href='/items.php?type=0&p={total}'>末页</a>" + rows + '<footer class="xcz-footer"></footer></html>').encode()


class DvgItemsTests(unittest.TestCase):
    def test_primary_rows_ignore_related_links(self):
        raw = page_html(1) + b'<a href="/itemsinfo.php?id=999">Related item</a>'
        result = scan.parse(raw, 1)
        self.assertEqual(len(result['items']), 20)
        self.assertNotIn('999', result['items'])

    def test_wrong_page_or_access_block_is_rejected(self):
        for raw in [page_html(1), b'<html>Access denied</html>']:
            with self.assertRaisesRegex(ValueError, 'current page'):
                scan.parse(raw, 2)

    def test_partial_batch_survives_access_denial_without_next_batch(self):
        calls = []
        def fetch(root, page, view='list'):
            calls.append(page)
            if page == 2:
                raise HTTPError('url', 403, 'Forbidden', {}, None)
            return scan.parse(page_html(page, 10), page)
        with tempfile.TemporaryDirectory() as directory, patch.object(scan, 'fetch', side_effect=fetch):
            root = Path(directory)
            with self.assertRaises(HTTPError):
                scan.scan(root, 4, 1)
            self.assertEqual(set(calls), {1, 2, 3, 4, 5})
            state = json.loads((root / 'status.json').read_text())
            self.assertFalse(state['complete'])
            self.assertEqual(state['pages'], 4)
            self.assertEqual(state['records'], 80)
            self.assertIn(2, state['missingPages'])

    def test_truncated_source_is_not_a_successful_short_page(self):
        with self.assertRaisesRegex(ValueError, 'Truncated'):
            scan.parse(page_html(1).replace(b'</html>', b''), 1)

    def test_grid_does_not_invent_internal_identity(self):
        raw = ("<span class='laypage-curr'>1</span><a href='/items_grid.php?type=0&p=1'>1</a>"
               '<a href="/itemsinfo.php?id=793"></a><span>ID:793</span></html>').encode()
        self.assertEqual(scan.parse(raw, 1, 'grid')['items'], {'793': {'name': ''}})

    def test_grid_preserves_unescaped_angle_brackets_in_source_name(self):
        raw = ("<span class='laypage-curr'>1</span>"
               '<a href="/itemsinfo.php?id=29646"><超弩級></a><span>ID:29646</span></html>').encode()
        self.assertEqual(scan.parse(raw, 1, 'grid')['items']['29646']['name'], '<超弩級>')
