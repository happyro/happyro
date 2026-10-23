import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from tools.resources.catalog import audit_ro321 as checker
from tools.resources.catalog.ro321_scan import page_url


class AuditTests(unittest.TestCase):
    def fixture(self, directory, duplicate=False, missing=False):
        root = Path(directory)
        cache = root / 'ro321-lists'
        cache.mkdir()
        items = {}
        for page in [1, 2]:
            if missing and page == 2:
                continue
            start = 501 if duplicate or page == 1 else 513
            rows = {str(i): {'name': f'物品{i}', 'aegis': f'Item_{i}'} for i in range(start, start + 12)}
            url = page_url(4, page)
            (cache / f'4-{page:04}.json').write_text(json.dumps({'url': url, 'pages': 2, 'sha256': 'a' * 64, 'items': rows}))
            items.update({i: {**row, 'source': url} for i, row in rows.items()})
        (root / 'ro321-names.json').write_text(json.dumps(items))
        (root / 'source-status.json').write_text(json.dumps({'ro321': {'complete': True, 'pages': 2, 'records': len(items)}}))
        return root

    def test_verifies_complete_cache_independently(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(checker, 'ITEM_TYPES', (4,)):
            result = checker.audit(self.fixture(directory))
            self.assertTrue(result['complete'])
            self.assertEqual(result['cachedIDs'], 24)

    def test_repeated_response_is_not_complete(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(checker, 'ITEM_TYPES', (4,)):
            result = checker.audit(self.fixture(directory, duplicate=True))
            self.assertFalse(result['complete'])
            self.assertIn('repeated IDs', '\n'.join(result['errors']))

    def test_missing_page_overrides_success_status(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(checker, 'ITEM_TYPES', (4,)):
            result = checker.audit(self.fixture(directory, missing=True))
            self.assertFalse(result['complete'])
            self.assertEqual(result['missingPages'], ['4-0002.json'])
