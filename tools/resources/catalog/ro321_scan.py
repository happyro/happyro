"""Resume the complete public RO321 Renewal item lists at a bounded request rate."""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import fcntl
import hashlib
import json
from pathlib import Path
import re
import sys
import time

if __package__ in {None, ''}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.resources.catalog.item_names import download, parse_names

# Public item-type navigation; each type has its own pagination.
ITEM_TYPES = (0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 18, 91)


def write_json(path, value):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


def page_url(kind, page):
    return f'https://ro.ro321.com/index.php?page=re_item_db&item_type={kind}&page_num={page}'


def parse_page(raw, kind, page):
    text = raw.decode('gb18030')
    items = parse_names('ro321', text)
    if not items:
        raise ValueError(f'Empty or unrecognized item list: {kind}/{page}')
    # Near the end, the site omits the last-page shortcut but keeps numbered links.
    links = re.findall(r"page_num=(\d+)['\"]\s+class\s*=\s*['\"]page_m['\"]", text)
    pages = max([page, *(int(value) for value in links)])
    if pages < page:
        raise ValueError('Pagination moved behind requested page')
    return {'url': page_url(kind, page), 'sha256': hashlib.sha256(raw).hexdigest(),
            'pages': pages, 'items': items}


def merge_items(items, result):
    for item_id, item in result['items'].items():
        existing = items.get(item_id)
        if existing and (existing['name'], existing['aegis']) != (item['name'], item['aegis']):
            raise ValueError(f'Conflicting RO321 item ID: {item_id}')
        items[item_id] = {**item, 'source': result['url']}


def scan(root, interval):
    cache = root / 'ro321-lists'
    cache.mkdir(parents=True, exist_ok=True)
    snapshot_path = root / 'ro321-names.json'
    items = json.loads(snapshot_path.read_text()) if snapshot_path.exists() else {}
    status_path = root / 'source-status.json'
    state = json.loads(status_path.read_text()) if status_path.exists() else {}
    counts, completed = {}, set()
    requests = 0
    last_request = None

    def checkpoint(error=None, complete=False):
        write_json(snapshot_path, items)
        state['fetchedAt'] = datetime.now(timezone.utc).isoformat()
        state['ro321'] = {**state.get('ro321', {}), 'scope': 'Renewal public item list pages and supplemental details',
                          'pages': len(completed), 'expectedPages': sum(counts.values()),
                          'types': {str(k): v for k, v in counts.items()}, 'records': len(items),
                          'complete': complete, 'error': error, 'requestsThisRun': requests,
                          'runState': 'complete' if complete else 'stopped' if error else 'running',
                          'detailPages': len(list((root / 'ro321').glob('*.json'))) + int((root / 'ro321-recheck.json').exists())}
        state['ro321'].pop('pauseReason', None)
        write_json(status_path, state)

    def get_page(kind, page):
        nonlocal last_request, requests
        path = cache / f'{kind}-{page:04}.json'
        if path.exists():
            result = json.loads(path.read_text())
            if result['url'] != page_url(kind, page) or not re.fullmatch('[0-9a-f]{64}', result['sha256']):
                raise ValueError(f'Invalid cache provenance: {path}')
        else:
            if last_request is not None:
                time.sleep(max(0, interval - (time.monotonic() - last_request)))
            requests += 1
            raw = download(page_url(kind, page))
            last_request = time.monotonic()
            result = parse_page(raw, kind, page)
            if kind in counts and result['pages'] != counts[kind]:
                raise ValueError(f'Pagination changed for type {kind}; review before continuing')
            merge_items(items, result)
            write_json(path, result)
        merge_items(items, result)
        completed.add((kind, page))
        return result

    try:
        for kind in ITEM_TYPES:
            counts[kind] = get_page(kind, 1)['pages']
        # Account for all existing pages before making any further request.
        for kind in ITEM_TYPES:
            for page in range(2, counts[kind] + 1):
                if (cache / f'{kind}-{page:04}.json').exists():
                    get_page(kind, page)
        checkpoint()
        # Round robin prevents the large weapon category from starving other types.
        for page in range(2, max(counts.values()) + 1):
            for kind in ITEM_TYPES:
                if page > counts[kind] or (kind, page) in completed:
                    continue
                get_page(kind, page)
                checkpoint()
                print(f'{len(completed)}/{sum(counts.values())} pages; {len(items)} IDs; type={kind} page={page}', flush=True)
        checkpoint(complete=True)
        print(f'Complete: {len(completed)} pages, {len(items)} IDs', flush=True)
    except BaseException as error:
        checkpoint(error=f'{type(error).__name__}: {error}')
        raise


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv or set(argv) <= {'--no-color'} or '--help' in argv or '-h' in argv:
        def c(code, value):
            return value if '--no-color' in argv else f'\033[{code}m{value}\033[0m'
        print('\n' + c('1;36', 'RO321 resumable item scan') + '\n\n' + c('1;33', 'Usage') + '\n  '
              + c('1;32', 'scan') + ' --output DIR [--interval SECONDS] [--no-color]\n\n'
              + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/resources/catalog/ro321_scan.py scan --output work/item-name-sources --interval 8') + '\n')
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['scan'])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--interval', type=float, default=8)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    if args.interval < 2:
        parser.error('--interval must be at least 2 seconds')
    args.output.mkdir(parents=True, exist_ok=True)
    with (args.output / 'ro321-scan.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        scan(args.output, args.interval)


if __name__ == '__main__':
    main()
