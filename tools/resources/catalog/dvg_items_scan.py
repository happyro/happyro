"""Scan DVG's public items.php listing with bounded concurrency and raw-page evidence."""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import fcntl
import gzip
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import time

if __package__ in {None, ''}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.resources.catalog.item_names import download
from tools.resources.catalog.ro321_scan import write_json

ROW = re.compile(r'<span class="tw-font-bold font-16">([^<]*)</span>\s*</a>\s*<span class="tw-text-xs">物品 ID #(\d+) \((.*?)\)</span>', re.S)


def url(page, view='list'):
    endpoint = 'items_grid.php' if view == 'grid' else 'items.php'
    return f'https://ro.dvg.cn/{endpoint}?type=0&p={page}'


def parse(raw, page, view='list'):
    text = raw.decode('utf-8')
    current = re.search(r"<span class='laypage-curr'>(\d+)</span>", text)
    if not current or int(current[1]) != page:
        raise ValueError(f'Wrong or missing current page: requested {page}')
    endpoint = 'items_grid.php' if view == 'grid' else 'items.php'
    links = [int(p) for p in re.findall('/' + re.escape(endpoint) + r'\?type=0(?:&|&amp;)p=(\d+)', text)]
    total = max([page, *links])
    items = {}
    if view == 'grid':
        rows = re.findall(r'<a href="/itemsinfo.php\?id=(\d+)">((?:(?!</a>).)*)</a>\s*<span[^>]*>ID:(\d+)</span>', text, re.S)
        for linked_id, name, item_id in rows:
            if linked_id != item_id or item_id in items:
                raise ValueError(f'Wrong or duplicate grid ID on page {page}: {item_id}')
            items[item_id] = {'name': html.unescape(name).strip()}
        headings = re.findall(r'>ID:(\d+)</span>', text)
        size = 100
    else:
        for name, item_id, aegis in ROW.findall(text):
            if item_id in items:
                raise ValueError(f'Duplicate ID on page {page}: {item_id}')
            items[item_id] = {'name': html.unescape(name).strip(), 'aegis': html.unescape(aegis).strip()}
        headings = re.findall(r'物品 ID\s*#(\d+)\s*\(', text)
        size = 20
    if set(headings) != set(items) or len(headings) != len(items):
        raise ValueError(f'Unparsed or duplicate item heading on page {page}')
    if '</html>' not in text:
        raise ValueError(f'Truncated source HTML on page {page}')
    if not 1 <= len(items) <= size or (page < total and len(items) != size):
        raise ValueError(f'Unexpected item count on page {page}: {len(items)}')
    return {'url': url(page, view), 'sha256': hashlib.sha256(raw).hexdigest(), 'pages': total, 'items': items}


def fetch(root, page, view='list'):
    path = root / 'pages' / f'{page:04}.html.gz'
    if path.exists():
        raw = gzip.decompress(path.read_bytes())
    else:
        raw = download(url(page, view))
    result = parse(raw, page, view)
    if not path.exists():
        tmp = path.with_suffix('.tmp')
        tmp.write_bytes(gzip.compress(raw, mtime=0))
        tmp.replace(path)
    write_json(root / 'pages' / f'{page:04}.json', result)
    return result


def scan(root, workers, interval, view='list'):
    (root / 'pages').mkdir(parents=True, exist_ok=True)
    items, seen_pages = {}, set()
    total = None
    def accept(page, result):
        if result['pages'] != total:
            raise ValueError(f'Pagination changed at {page}: {result["pages"]} != {total}')
        overlap = set(items) & set(result['items'])
        if overlap:
            raise ValueError(f'IDs repeated across pages at {page}: {sorted(overlap)}')
        items.update({i: {**row, 'source': result['url']} for i, row in result['items'].items()})
        seen_pages.add(page)
    def checkpoint(error=None, complete=False):
        write_json(root / 'names.json', dict(sorted(items.items(), key=lambda row: int(row[0]))))
        write_json(root / 'status.json', {'fetchedAt': datetime.now(timezone.utc).isoformat(),
                   'source': url(1, view), 'pages': len(seen_pages), 'expectedPages': total,
                   'records': len(items), 'complete': complete, 'error': error, 'workers': workers,
                   'missingPages': sorted(set(range(1, (total or 0) + 1)) - seen_pages)})
    try:
        first = fetch(root, 1, view)
        total = first['pages']
        accept(1, first)
        for page in range(2, total + 1):
            if (root / 'pages' / f'{page:04}.html.gz').exists():
                accept(page, fetch(root, page, view))
        checkpoint()
        missing = sorted(set(range(1, total + 1)) - seen_pages)
        with ThreadPoolExecutor(max_workers=workers) as pool:
            for offset in range(0, len(missing), workers):
                if offset:
                    time.sleep(interval)
                batch = missing[offset:offset + workers]
                jobs = {pool.submit(fetch, root, page, view): page for page in batch}
                failure = None
                for future in as_completed(jobs):
                    try:
                        accept(jobs[future], future.result())
                    except Exception as error:
                        failure = error
                checkpoint(str(failure) if failure else None)
                if failure:
                    raise failure
                print(f'{len(seen_pages)}/{total} pages; {len(items)} IDs', flush=True)
        checkpoint(complete=True)
        print(f'Complete: {len(seen_pages)} pages, {len(items)} IDs', flush=True)
    except BaseException as error:
        checkpoint(error=f'{type(error).__name__}: {error}')
        raise


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv or set(argv) <= {'--no-color'} or '--help' in argv or '-h' in argv:
        def c(code, value):
            return value if '--no-color' in argv else f'\033[{code}m{value}\033[0m'
        print('\n' + c('1;36', 'DVG items.php full scan') + '\n\n' + c('1;33', 'Usage') + '\n  '
              + c('1;32', 'scan') + ' --output DIR [--view list|grid] [--workers 4] [--interval 1] [--no-color]\n\n'
              + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/resources/catalog/dvg_items_scan.py scan --output work/item-name-sources/dvg-items --workers 4 --interval 1') + '\n')
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['scan'])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--view', choices=['list', 'grid'], default='list')
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--interval', type=float, default=1)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    if not 1 <= args.workers <= 4 or args.interval < 1:
        parser.error('Use 1–4 workers and at least a 1-second interval between batches')
    args.output.mkdir(parents=True, exist_ok=True)
    with (args.output / 'scan.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        scan(args.output, args.workers, args.interval, args.view)


if __name__ == '__main__':
    main()
