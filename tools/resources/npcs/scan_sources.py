"""Independently capture public NPC names and positional evidence from two sites."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import fcntl
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import threading
import time
from urllib.error import HTTPError
from urllib.parse import parse_qs, urlencode, urljoin, urlsplit
from urllib.request import Request, urlopen

BASE = {'dvg': 'https://ro.dvg.cn/', 'ro321': 'https://ro.ro321.com/'}
WORK = Path('work/npc-source-scan')
DOCS = Path('docs/localization/npc-source-scans')

def now():
    return datetime.now(timezone.utc).isoformat()

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)

def plain(value):
    return ' '.join(unescape(re.sub(r'<[^>]*>', ' ', value)).split())

class Links(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'): self.links.append(attrs['href'])

def ro_url(page, **kwargs):
    return BASE['ro321'] + 'index.php?' + urlencode({'page': page, **kwargs, 're_mob': 1})

def ro_links(text):
    result = set()
    for href in Links(text).links:
        u = urlsplit(urljoin(BASE['ro321'], href)); q = parse_qs(u.query)
        if u.hostname not in ('ro.ro321.com', 'ro321.com'): continue
        if q.get('re_mob') == ['0']: continue
        page = q.get('page', [''])[0]
        key = 'area' if page == 'areainfo' else 'map' if page == 'npc_shop_warp' else None
        value = q.get(key, [''])[0] if key else ''
        # Only follow explicit Renewal links; warp targets are extracted separately.
        if key and q.get('re_mob') == ['1'] and re.fullmatch(r'[\w@()-]+', value):
            result.add(ro_url(page, **{key: value}))
    return sorted(result)

def parse_ro(text, url):
    q = parse_qs(urlsplit(url).query); page = q['page'][0]
    links = ro_links(text)
    if page in ('map_db', 'areainfo', 'nsw_npc_search'):
        if not links: raise ValueError('Directory contains no Renewal map links')
        return {'records': [], 'links': links, 'kind': page}
    mapname = q['map'][0]
    if not re.search(r"id=['\"]npc_block['\"]", text):
        raise ValueError('Missing NPC map block')
    if not re.search(r'\(' + re.escape(mapname) + r'\)', text):
        raise ValueError('Map identity not found')
    labels = {}
    for kind, sid, name in re.findall(r"id=['\"]t#(npc|shop|warp)_(\d+)['\"][^>]*>(.*?)</a>", text, re.S):
        key = (kind, int(sid)); name = plain(name)
        if key in labels and labels[key] != name: raise ValueError('Conflicting repeated ID')
        labels[key] = name
    records = []
    for kind, sid, attrs, body in re.findall(r"<div id=['\"](npc|shop|warp)_(\d+)['\"]([^>]*)>(.*?)</div>", text, re.S):
        key = (kind, int(sid))
        if key not in labels: raise ValueError('Map marker has no label')
        pos = re.search(r"title=['\"]([^'\"() ]+) \((\d+),\s*(\d+)\)", attrs)
        if not pos or pos[1] != mapname: raise ValueError('Missing or inconsistent map coordinates')
        href = re.search(r"href=['\"]([^'\"]+)['\"]", body)
        img = re.search(r"<img[^>]+src=['\"]([^'\"]+)['\"]", body)
        row = {'source': 'ro321', 'version': 'renewal', 'kind': kind, 'sourceId': int(sid),
               'name': labels[key], 'map': mapname, 'x': int(pos[2]), 'y': int(pos[3]),
               'sourceUrl': url, 'detailUrl': urljoin(BASE['ro321'], unescape(href[1])) if href else None,
               'imageUrl': unescape(img[1]) if img else None}
        records.append(row)
        if kind == 'warp':
            target = re.search(r'去\s+([\w@()-]+)\s*\(', row['name'])
            if target: links.append(ro_url('npc_shop_warp', map=target[1]))
    if set(labels) != {(r['kind'], r['sourceId']) for r in records}:
        raise ValueError('Not all list entries have map markers')
    for kind in ('npc', 'shop', 'warp'):
        declared = re.search(r'\ball_' + kind + r'_arr\s*=\s*new Array\((.*?)\)', text, re.S)
        if declared is not None:
            expected = {int(x) for x in re.findall(kind + r'_(\d+)', declared[1])}
            actual = {r['sourceId'] for r in records if r['kind'] == kind}
            if actual != expected: raise ValueError('Map index and parsed markers disagree: ' + kind)
    return {'records': records, 'links': sorted(set(links)), 'kind': 'map', 'map': mapname}

def parse_dvg_list(text, url):
    page = int(parse_qs(urlsplit(url).query).get('page', ['1'])[0])
    match = re.search(r'([\d,]+) 条 · 第 (\d+) / (\d+) 页', text)
    if not match or int(match[2]) != page: raise ValueError('Missing/wrong pagination')
    total, pages = int(match[1].replace(',', '')), int(match[3])
    rows = []
    for card in re.findall(r'<article class="npc-card">(.*?)</article>', text, re.S):
        title = re.search(r'<a class="npc-card-name" href="([^"]+)"[^>]*>(.*?)</a>', card, re.S)
        pos = re.search(r'/navi ([\w@()-]+) (\d+)/(\d+)', card)
        image = re.search(r'/dbsource/npc/(\d+)\.', card)
        if not title or not pos: raise ValueError('Incomplete NPC card')
        detail = urljoin(BASE['dvg'], unescape(title[1])); sid = int(parse_qs(urlsplit(detail).query)['id'][0])
        rows.append({'source': 'dvg', 'version': 'cn-live', 'kind': 'npc', 'sourceId': sid,
                     'name': plain(title[2]), 'map': pos[1], 'x': int(pos[2]), 'y': int(pos[3]),
                     'spriteId': int(image[1]) if image else None, 'sourceUrl': url, 'detailUrl': detail})
    if len(rows) != (100 if page < pages else total - 100 * (pages - 1)):
        raise ValueError('Unexpected list size')
    if len({r['sourceId'] for r in rows}) != len(rows): raise ValueError('Duplicate list ID')
    links = [BASE['dvg'] + 'npc_list.php?' + urlencode({'sort': 'id', 'page': n}) for n in range(1, pages + 1)]
    return {'records': rows, 'links': links, 'kind': 'list', 'page': page, 'total': total, 'pages': pages}

def parse_dvg_detail(text, url):
    fields = {plain(k): plain(v) for k, v in re.findall(r'<dt>(.*?)</dt><dd>(.*?)</dd>', text, re.S)}
    sid = int(parse_qs(urlsplit(url).query)['id'][0])
    if fields.get('NPC ID') != str(sid) or not fields.get('名称'): raise ValueError('Missing/wrong NPC details')
    nav = re.search(r'<code class="npc-navigation">/navi ([\w@()-]+) (\d+)/(\d+)</code>', text)
    if not nav: raise ValueError('Missing NPC navigation')
    related = []
    for title, content in re.findall(r'<details\b[^>]*><summary>(.*?)</summary>(.*?)</details>', text, re.S):
        title = plain(title)
        if not any(k in title for k in ['游戏内记录', '国服补充记录', '同位置脚本记录']): continue
        values = [json.loads(unescape(x)) for x in re.findall(r'<pre\b[^>]*>(.*?)</pre>', content, re.S)]
        count = re.search(r'·\s*(\d+)\s*条', title)
        if not count or len(values) != int(count[1]): raise ValueError('Associated record count mismatch')
        related.append({'label': title, 'records': values})
    row = {'source': 'dvg', 'version': 'cn-live', 'kind': 'npc', 'sourceId': sid, 'name': fields['名称'],
           'map': nav[1], 'x': int(nav[2]), 'y': int(nav[3]), 'fields': fields, 'related': related, 'detailUrl': url}
    return {'records': [row], 'links': [], 'kind': 'detail'}

def parse(site, text, url):
    if site == 'ro321': return parse_ro(text, url)
    return parse_dvg_detail(text, url) if '/npc_info.php?' in url else parse_dvg_list(text, url)

class Scanner:
    def __init__(self, site, interval, workers=2):
        self.site = site; self.interval = interval; self.workers = workers; self.next_start = 0; self.lock = threading.Lock()
        self.directory = WORK / site; self.directory.mkdir(parents=True, exist_ok=True)
    def fetch(self, url):
        key = sha256(url.encode()).hexdigest(); meta = self.directory / (key + '.json'); raw = self.directory / (key + '.html')
        if meta.exists() and raw.exists():
            data = json.loads(meta.read_text())
            if data.get('status') == 'ok' and sha256(raw.read_bytes()).hexdigest() == data['sha256']:
                data['parsed'] = parse(self.site, raw.read_bytes().decode(data['encoding']), url)
                return data
        attempts = []
        for attempt in range(3):
            with self.lock:
                wait = max(0, self.next_start - time.monotonic())
                if wait: time.sleep(wait)
                self.next_start = time.monotonic() + self.interval
            started = now()
            try:
                req = Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; HappyRO reference audit)', 'Accept': 'text/html'})
                with urlopen(req, timeout=35) as response:
                    body = response.read(); status = response.status; final_url = response.url
                encoding = 'gb18030' if self.site == 'ro321' else 'utf-8'
                parsed = parse(self.site, body.decode(encoding), url)
                raw.write_bytes(body)
                data = {'url': url, 'finalUrl': final_url, 'fetchedAt': started, 'httpStatus': status,
                        'encoding': encoding, 'sha256': sha256(body).hexdigest(), 'bytes': len(body),
                        'status': 'ok', 'attempts': attempts, 'parsed': parsed}
                write(meta, data); return data
            except Exception as exc:
                code = exc.code if isinstance(exc, HTTPError) else None
                attempts.append({'at': started, 'error': str(exc), 'httpStatus': code})
                if code in (403, 429): break
                if attempt < 2: time.sleep(10 * (attempt + 1))
        data = {'url': url, 'status': 'failed', 'attempts': attempts}; write(meta, data); return data
    def run(self):
        lockfile = (self.directory / 'scan.lock').open('w')
        fcntl.flock(lockfile, fcntl.LOCK_EX | fcntl.LOCK_NB)
        seeds = ([BASE['dvg'] + 'npc_list.php?sort=id&page=1'] if self.site == 'dvg' else
                 [ro_url('map_db'), BASE['ro321'] + 'index.php?page=nsw_npc_search'])
        queue = list(seeds); known = set(queue); results = {}; failures = []
        with ThreadPoolExecutor(max_workers=self.workers) as executor:
            while queue:
                # Finish directory discovery before detail requests.
                queue.sort(key=lambda u: ('npc_info.php' in u, u))
                batch = queue[:self.workers]; del queue[:self.workers]
                for data in executor.map(self.fetch, batch):
                    results[data['url']] = data
                    if data['status'] != 'ok': failures.append(data); continue
                    for link in data['parsed']['links']:
                        if link not in known: known.add(link); queue.append(link)
                stats = {'site': self.site, 'updatedAt': now(), 'completedPages': len(results) - len(failures),
                         'failedPages': len(failures), 'pendingPages': len(queue),
                         'recordsSeen': sum(len(d.get('parsed', {}).get('records', [])) for d in results.values()),
                         'status': 'running'}
                write(self.directory / 'progress.json', stats)
                print(json.dumps(stats), flush=True)
                if failures:
                    stats['status'] = 'stopped-on-error'; write(self.directory / 'progress.json', stats); return
        stats['status'] = 'complete'; write(self.directory / 'progress.json', stats)
        print(json.dumps(stats), flush=True)

def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', nargs='?', choices=['scan'])
    parser.add_argument('--site', choices=['dvg', 'ro321', 'both'], default='both')
    parser.add_argument('--interval', type=float, default=2)
    parser.add_argument('--workers', type=int, default=2)
    parser.add_argument('--no-color', action='store_true'); parser.add_argument('--help', action='store_true')
    args = parser.parse_args()
    if not args.command or args.help:
        c = (lambda code, text: text if args.no_color else f'\033[{code}m{text}\033[0m')
        print('\n' + c('1;36', 'NPC source scan') + '\n\n' + c('1;33', 'Usage') + '\n  ' + c('1;32', 'scan') + ' --site dvg|ro321|both [--interval 2] [--workers 2] [--no-color]\n\n' + c('1;33', 'Example') + '\n  ' + c('36', 'python3 tools/resources/npcs/scan_sources.py scan --site both') + '\n')
        return
    if args.interval < 0.5: parser.error('interval must be at least 0.5 seconds')
    if not 1 <= args.workers <= 4: parser.error('workers must be between 1 and 4')
    sites = ['dvg', 'ro321'] if args.site == 'both' else [args.site]
    with ThreadPoolExecutor(max_workers=len(sites)) as executor:
        list(executor.map(lambda site: Scanner(site, args.interval, args.workers).run(), sites))

if __name__ == '__main__': main()
