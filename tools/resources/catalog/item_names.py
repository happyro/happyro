"""Fetch public item-name references and retain per-page provenance.

Only ID, name and AegisName are extracted; descriptions/gameplay data are not imported.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import time
from urllib.request import Request, urlopen
from urllib.error import HTTPError

DVG_ROW = re.compile(r'id="ro8-item-name-(\d+)"[^>]*>.*?<strong>(.*?)</strong></a><span>物品 ID #\d+ \((.*?)\)')
RO321_ROW = re.compile(r"<span class='btext_L'>(.*?)</span></b>.*?物品 ID#\s*(\d+)\s*\((.*?)\)", re.S)


def parse_names(source: str, text: str) -> dict:
    rows = DVG_ROW.findall(text) if source == 'dvg' else [(i, n, a) for n, i, a in RO321_ROW.findall(text)]
    result = {}
    for item_id, name, aegis in rows:
        if item_id in result:
            raise ValueError(f'duplicate item ID: {item_id}')
        result[item_id] = {'name': html.unescape(re.sub(r'<[^>]+>', '', name)).strip(), 'aegis': html.unescape(aegis).strip()}
    return result


def is_chinese_name(name: str) -> bool:
    # Kanji alone is not sufficient: many untranslated Japanese labels contain it.
    return bool(re.search(r'[\u3400-\u9fff]', name)) and not bool(
        re.search(r'[\u3040-\u30ff\uac00-\ud7af\ufffd]|\(null\)|未命名(?:道具|物品)|未知物品', name, re.I)
    )


def base_name(name: str) -> str:
    # Website headings append slot counts; clients render Slots/slotCount separately.
    return re.sub(r'\s*\[[0-4]\]$', '', name).strip()


def download(url: str) -> bytes:
    for attempt in range(4):
        try:
            with urlopen(Request(url, headers={'User-Agent': 'HappyRO item-name reference audit'}), timeout=30) as response:
                return response.read()
        except HTTPError as error:
            if error.code in {401, 403, 429} or attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))
    raise AssertionError('unreachable')


def fetch(source: str, key: int, cache: Path) -> dict:
    url = (f'https://ro.dvg.cn/item_list.php?sort=id&view=list&page={key}' if source == 'dvg'
           else f'https://ro.ro321.com/index.php?page=re_item_db&item_id={key}')
    path = cache / f'{key:04}.json'
    if path.exists():
        result = json.loads(path.read_text())
        if result['url'] != url:
            raise ValueError(f'wrong cache URL: {path}')
        return result
    raw = download(url)
    text = raw.decode('utf-8' if source == 'dvg' else 'gb18030')
    items = parse_names(source, text)
    if source == 'dvg' and not items:
        raise ValueError(f'empty list: {url}')
    if source == 'ro321' and set(items) - {str(key)}:
        raise ValueError(f'unexpected search results: {url}')
    if source == 'ro321' and not items and not any(value in text for value in ['没有找到', '沒有找到', '没有任何', '沒有任何', '找不到', 'No items', '無符合', '无符合']):
        raise ValueError(f'unrecognized empty response: {url}')
    result = {'url': url, 'sha256': hashlib.sha256(raw).hexdigest(), 'items': items}
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    time.sleep(.3)
    return result


def usage(color=True):
    def c(code, text):
        return f'\033[{code}m{text}\033[0m' if color else text
    print('\n' + c('1;36', 'HappyRO item name references') + '\n\n' + c('1;33', 'Usage') + '\n  '
          + c('1;32', 'fetch') + ' --source dvg|ro321 --output DIR [--ids JSON] [--limit N] [--interval SECONDS] [--no-color]\n\n'
          + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/resources/catalog/item_names.py fetch --source dvg --output work/item-name-sources')
          + '\n  ' + c('36', 'python3 tools/resources/catalog/item_names.py fetch --source ro321 --ids work/item-name-sources/missing-ids.json --output work/item-name-sources') + '\n')


def main(argv):
    if not argv or set(argv) <= {'--no-color'} or '-h' in argv or '--help' in argv:
        usage('--no-color' not in argv)
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['fetch'])
    parser.add_argument('--source', choices=['dvg', 'ro321'], required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--ids', type=Path)
    parser.add_argument('--limit', type=int, default=20)
    parser.add_argument('--interval', type=float, default=5.0)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    if args.limit < 1 or args.interval < 5:
        parser.error('--limit must be positive and --interval must be at least 5 seconds')
    cache = args.output / args.source
    cache.mkdir(parents=True, exist_ok=True)
    if args.source == 'dvg':
        first = download('https://ro.dvg.cn/item_list.php').decode('utf-8')
        match = re.search(r'([\d,]+) 条 · 第 1 / (\d+) 页', first)
        if not match:
            raise ValueError('pagination not found')
        expected, pages = int(match[1].replace(',', '')), int(match[2])
        keys = range(1, pages + 1)
    else:
        if not args.ids:
            parser.error('--ids is required for ro321')
        keys = sorted({int(i) for i in json.loads(args.ids.read_text())})
        expected = None
    snapshot_path = args.output / f'{args.source}-names.json'
    previous = json.loads(snapshot_path.read_text()) if snapshot_path.exists() else {}
    if args.source == 'ro321':
        keys = [key for key in keys if str(key) not in previous][:args.limit]
    items = {}
    complete = False
    failure = None
    try:
        keys = list(keys)
        workers = 1 if args.source == 'ro321' else 4
        with ThreadPoolExecutor(max_workers=workers) as pool:
            # Bound pending requests so an access denial stops the crawl promptly.
            for offset in range(0, len(keys), workers):
                batch = keys[offset:offset + workers]
                if args.source == 'ro321' and offset:
                    time.sleep(args.interval)
                for result in pool.map(lambda key: fetch(args.source, key, cache), batch):
                    for item_id, item in result['items'].items():
                        if item_id in items:
                            raise ValueError(f'duplicate item ID across pages: {item_id}')
                        items[item_id] = {**item, 'source': result['url']}
                    if args.source == 'ro321':
                        snapshot_path.write_text(json.dumps({**previous, **items}, ensure_ascii=False, indent=2) + '\n')
                        print(f'{offset + 1}/{len(keys)} checked: {result["url"]}', flush=True)
                if (offset + len(batch)) % 100 == 0:
                    print(f'{offset + len(batch)}/{len(keys)} pages, {len(items)} items', flush=True)
        if expected is not None and len(items) != expected:
            raise ValueError(f'expected {expected} items, received {len(items)}')
        complete = True
    except Exception as error:
        failure = str(error)
        raise
    finally:
        # A requested-ID run is incremental; a denied crawl must not erase prior evidence.
        snapshot = items if args.source == 'dvg' and complete else {**previous, **items}
        snapshot_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
        status_path = args.output / 'source-status.json'
        status = json.loads(status_path.read_text()) if status_path.exists() else {}
        status['fetchedAt'] = datetime.now(timezone.utc).isoformat()
        status[args.source] = {**status.get(args.source, {}),
                               'scope': 'all public item list pages' if args.source == 'dvg' else 'partial public lists and requested item IDs',
                               'records': len(snapshot), 'complete': complete if args.source == 'dvg' else False,
                               'error': failure, 'lastRunComplete': complete,
                               'lastRunRecords': len(items), 'lastRunRequested': len(keys)}
        status_path.write_text(json.dumps(status, ensure_ascii=False, indent=2) + '\n')
    print(f'Complete: {len(items)} items')



if __name__ == '__main__':
    main(sys.argv[1:])
