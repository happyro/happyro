"""Verify list coverage and source-cache consistency without network requests."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

if __package__ in {None, ''}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.localization.items.ro321_scan import ITEM_TYPES, merge_items, page_url, write_json


def audit(root):
    cache = root / 'ro321-lists'
    missing, errors, categories = [], [], {}
    items = {}
    page_count = 0
    for kind in ITEM_TYPES:
        first = cache / f'{kind}-0001.json'
        if not first.exists():
            missing.append(first.name)
            continue
        total = json.loads(first.read_text())['pages']
        seen = set()
        pages = 0
        for number in range(1, total + 1):
            path = cache / f'{kind}-{number:04}.json'
            if not path.exists():
                missing.append(path.name)
                continue
            row = json.loads(path.read_text())
            if row['url'] != page_url(kind, number) or row['pages'] != total:
                errors.append(f'{path.name}: URL or pagination mismatch')
            if not re.fullmatch('[0-9a-f]{64}', row['sha256']):
                errors.append(f'{path.name}: invalid raw-page hash')
            count = len(row['items'])
            if not 1 <= count <= 12 or (number < total and count != 12):
                errors.append(f'{path.name}: unexpected row count {count}')
            repeated = seen.intersection(row['items'])
            if repeated:
                errors.append(f'{path.name}: repeated IDs within category: {sorted(repeated)}')
            seen.update(row['items'])
            try:
                merge_items(items, row)
            except ValueError as error:
                errors.append(f'{path.name}: {error}')
            pages += 1
        categories[str(kind)] = {'expectedPages': total, 'pages': pages, 'uniqueIDs': len(seen)}
        page_count += pages
    for path in sorted((root / 'ro321').glob('*.json')) + list(root.glob('ro321-recheck.json')):
        try:
            merge_items(items, json.loads(path.read_text()))
        except ValueError as error:
            errors.append(f'{path.name}: {error}')
    snapshot = json.loads((root / 'ro321-names.json').read_text())
    for item_id, row in items.items():
        actual = snapshot.get(item_id)
        if actual is None or (actual['name'], actual['aegis']) != (row['name'], row['aegis']):
            errors.append(f'{item_id}: snapshot differs from cached source')
    state = json.loads((root / 'source-status.json').read_text())['ro321']
    # Extra snapshot IDs can be a page arriving during a live audit. At completion
    # every ID must have cached provenance, and counts must match the actual files.
    if state['complete']:
        unexplained = set(snapshot) - set(items)
        if unexplained:
            errors.append(f'Unexplained snapshot IDs: {sorted(unexplained)}')
        if state['pages'] != page_count or state['records'] != len(snapshot):
            errors.append('Final status counters differ from cache/snapshot')
    return {'complete': state['complete'] and not missing and not errors,
            'pages': page_count, 'expectedPages': sum(v['expectedPages'] for v in categories.values()),
            'cachedIDs': len(items), 'snapshotIDs': len(snapshot), 'categories': categories,
            'missingPages': missing, 'errors': errors}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv or set(argv) <= {'--no-color'} or '--help' in argv or '-h' in argv:
        def c(code, value):
            return value if '--no-color' in argv else f'\033[{code}m{value}\033[0m'
        print('\n' + c('1;36', 'RO321 cache audit') + '\n\n' + c('1;33', 'Usage') + '\n  '
              + c('1;32', 'check') + ' --references DIR [--require-complete] [--no-color]\n\n'
              + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/localization/items/audit_ro321.py check --references work/item-name-sources --require-complete') + '\n')
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['check'])
    parser.add_argument('--references', type=Path, required=True)
    parser.add_argument('--require-complete', action='store_true')
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    result = audit(args.references)
    write_json(args.references / 'ro321-cache-audit.json', result)
    print(json.dumps({key: value for key, value in result.items() if key not in {'categories', 'missingPages'}}, ensure_ascii=False))
    if result['errors'] or (args.require_complete and not result['complete']):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
