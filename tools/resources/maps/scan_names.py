"""Capture public map-name references with resumable, hashed HTML evidence."""
import argparse
import fcntl
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import time
from urllib.parse import parse_qs, urlencode, urljoin, urlsplit
from urllib.request import Request, urlopen

BASE = {'dvg': 'https://ro.dvg.cn/', 'ro321': 'https://ro.ro321.com/'}

def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)

class Links(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])

def plain(text):
    return ' '.join(unescape(re.sub('<[^>]+>', ' ', text)).split())

def ro_links(text):
    result = set()
    for href in Links(text).links:
        u = urlsplit(urljoin(BASE['ro321'], href))
        if u.hostname not in {'ro.ro321.com', 'ro321.com'}: continue
        q = parse_qs(u.query)
        if q.get('re_mob') != ['1']: continue
        page = q.get('page', [''])[0]
        key = 'area' if page == 'areainfo' else 'map' if page == 'npc_shop_warp' else None
        value = q.get(key, [''])[0] if key else ''
        if key and re.fullmatch(r'[a-zA-Z0-9_@()-]+', value):
            result.add(BASE['ro321'] + 'index.php?' + urlencode({'page': page, key: value, 're_mob': '1'}))
    return sorted(result)

def parse_dvg(text, page):
    m = re.search(r'([\d,]+) 条 · 第 (\d+) / (\d+) 页', text)
    if not m or int(m[2]) != page: raise ValueError('Missing/wrong pagination')
    total, pages = int(m[1].replace(',', '')), int(m[3])
    cards = re.findall(r'<article class="database-card">(.*?)</article>', text, re.S)
    rows = []
    for card in cards:
        title = re.search(r'class="database-card-title" href="([^"]+)">(.*?)</a>', card, re.S)
        key = re.search(r'#(\d+) · ([^<]+)</p>', card)
        size = re.search(r'(\d+|—) × (\d+|—) · ([^<]+)</p>', card)
        if not (title and key and size): raise ValueError('Unparsed map card')
        mapname = unescape(key[2]).strip()
        if parse_qs(urlsplit(unescape(title[1])).query).get('id') != [mapname]: raise ValueError('Map ID mismatch')
        rows.append({'map': mapname, 'name': plain(title[2]), 'siteId': int(key[1]),
                     'width': int(size[1]) if size[1] != '—' else None, 'height': int(size[2]) if size[2] != '—' else None, 'region': unescape(size[3]),
                     'detailUrl': urljoin(BASE['dvg'], unescape(title[1]))})
    if len(rows) != (20 if page < pages else total - 20 * (pages - 1)): raise ValueError('Wrong page count')
    if len({r['map'] for r in rows}) != len(rows): raise ValueError('Duplicate maps')
    return {'records': rows, 'total': total, 'pages': pages}

def parse_ro(text, url):
    q = parse_qs(urlsplit(url).query); page = q.get('page', [''])[0]
    links = ro_links(text)
    if page == 'map_db':
        if not links: raise ValueError('Empty map directory')
        return {'records': [], 'links': links}
    if page == 'areainfo':
        if not any('page=npc_shop_warp&' in link for link in links): raise ValueError('Area page has no map entries')
        # Area headings provide shorter labels; retain as separate evidence, not canonical names.
        records = []
        for tr in re.findall(r'<tr\b[^>]*>(.*?)</tr>', text, re.S | re.I):
            m = re.search(r'地图名称:\s*([a-zA-Z0-9_@()-]+)(?=\s|<)', tr)
            n = re.search(r'区域:\s*(.*?)</b>', tr, re.S)
            if m and n:
                parts=re.split(r'<br\s*/?>\s*-\s*', n[1], flags=re.I)
                records.append({'map': m[1], 'areaLabel': plain(n[1]), 'name': plain(parts[-1]) if len(parts)>1 else None})
        names=[{'map':r['map'],'name':r['name'],'version':'re'} for r in records if r['name']]
        return {'records': names, 'areaLabels': records, 'links': links}
    mapname = q['map'][0]
    m = re.search(r"<span class='clear_ctext'>(.*?)</span>\s*\(" + re.escape(mapname) + r'\)', text, re.S)
    title = re.search(r'<title>(.*?)</title>', text, re.S)
    if not m:
        raise ValueError('Missing map name: ' + mapname)
    name = plain(m[1])
    if not title or not plain(title[1]).startswith(name + ' - ' + mapname + ' '): raise ValueError('Title/body mismatch')
    return {'records': [{'map': mapname, 'name': name, 'version': 're'}], 'links': links}

def fetch(root, site, url):
    key = sha256(url.encode()).hexdigest()[:24]
    rawpath = root / site / 'html' / (key + '.html')
    meta = rawpath.with_suffix('.json')
    if rawpath.exists() and meta.exists():
        raw = rawpath.read_bytes(); old = json.loads(meta.read_text())
        if old['url'] != url or old['sha256'] != sha256(raw).hexdigest(): raise ValueError('Invalid cached evidence')
    else:
        with urlopen(Request(url, headers={'User-Agent': 'HappyRO item-name reference audit'}), timeout=30) as response:
            raw = response.read()
        rawpath.parent.mkdir(parents=True, exist_ok=True)
        rawpath.write_bytes(raw)
        write(meta, {'url': url, 'sha256': sha256(raw).hexdigest(), 'fetchedAt': datetime.now(timezone.utc).isoformat()})
    text = raw.decode('utf-8' if site == 'dvg' else 'gb18030')
    if '</html>' not in text.lower(): raise ValueError('Incomplete HTML')
    data = parse_dvg(text, int(parse_qs(urlsplit(url).query).get('page', ['1'])[0])) if site == 'dvg' else parse_ro(text, url)
    return {**json.loads(meta.read_text()), **data, 'rawPath': str(rawpath)}

def aggregate(pages):
    grouped={}
    for page in pages:
        for row in page['records']:
            grouped.setdefault(row['map'],[]).append({**row,'sourceUrl':page['url']})
    result=[];conflicts=set()
    for key, evidence in sorted(grouped.items()):
        details=[r for r in evidence if 'page=npc_shop_warp&' in r['sourceUrl']]
        selected=details or evidence
        if len({r['name'] for r in selected}) != 1:
            conflicts.add(key);continue
        result.append({**selected[0], 'evidence':evidence})
    return result, conflicts

def scan(root, site, interval, verify_maps=()):
    first = BASE[site] + ('map_list.php?page=1' if site == 'dvg' else 'index.php?page=map_db')
    sample_urls={BASE['ro321']+'index.php?'+urlencode({'page':'npc_shop_warp','map':key,'re_mob':'1'}) for key in verify_maps} if site=='ro321' else set()
    queue = {first}|sample_urls; done = {}; error = None
    def checkpoint():
        if site=='ro321': records,_=aggregate(list(done.values()))
        else: records=[{**r,'sourceUrl':url} for url,data in sorted(done.items()) for r in data['records']]
        write(root / site / 'records.json', records)
        write(root / site / 'pages.json', list(done.values()))
        write(root / site / 'status.json', {'complete': not queue and not error, 'pages': len(done),
            'records': len(records), 'detailSampleUrls':sorted(sample_urls), 'pending': sorted(queue), 'error': error, 'intervalSeconds': interval,
            'version': 'site default: 国服-正式服 / 简体中文' if site == 'dvg' else 're',
            'updatedAt': datetime.now(timezone.utc).isoformat()})
    try:
        with ThreadPoolExecutor(max_workers=2) as pool:
            while queue:
                batch = sorted(queue, key=lambda x: ('npc_shop_warp' in x, x))[:2]
                jobs = []
                for url in batch:
                    cached = root / site / 'html' / (sha256(url.encode()).hexdigest()[:24] + '.json')
                    if not (cached.exists() and cached.with_suffix('.html').exists()): time.sleep(interval)
                    jobs.append((url, pool.submit(fetch, root, site, url)))
                for url, future in jobs:
                    data = future.result(); done[url] = data; queue.remove(url)
                    if site == 'dvg':
                        if any(d['total'] != data['total'] or d['pages'] != data['pages'] for d in done.values()):
                            raise ValueError('Pagination changed')
                        queue.update(BASE[site] + f'map_list.php?page={i}' for i in range(1, data['pages'] + 1))
                    else:
                        queue.update(data['links'])
                    queue.difference_update(done)
                if site=='ro321':
                    known,conflicts=aggregate(list(done.values()));covered={r['map'] for r in known}
                    queue={u for u in queue if u in sample_urls or parse_qs(urlsplit(u).query).get('map',[''])[0] not in covered}
                    queue.update(BASE['ro321']+'index.php?'+urlencode({'page':'npc_shop_warp','map':key,'re_mob':'1'}) for key in conflicts)
                    queue.difference_update(done)
                checkpoint()
                print(f'{site}: {len(done)} pages; {sum(len(d["records"]) for d in done.values())} records; {len(queue)} pending', flush=True)
    except BaseException as e:
        error = f'{type(e).__name__}: {e}'; checkpoint(); raise
    checkpoint()

def main():
    args = sys.argv[1:]
    if not args or set(args) <= {'--no-color'} or '--help' in args:
        def c(code, text): return text if '--no-color' in args else f'\033[{code}m{text}\033[0m'
        print('\n' + c('1;36', 'HappyRO map-name source scanner') + '\n\n' + c('1;33', 'Usage') + '\n  ' + c('1;32', 'scan --site dvg|ro321 --output DIR [--interval 2] [--verify-map NAME] [--no-color]') + '\n\n' + c('1;33', 'Example') + '\n  ' + c('36', 'python3 tools/resources/maps/scan_names.py scan --site dvg --output work/map-name-sources') + '\n'); return
    p = argparse.ArgumentParser(); p.add_argument('command', choices=['scan']); p.add_argument('--site', choices=BASE, required=True); p.add_argument('--output', type=Path, required=True); p.add_argument('--interval', type=float, default=2); p.add_argument('--no-color', action='store_true'); p.add_argument('--verify-map', action='append',default=[]); a=p.parse_args(args)
    if a.interval < 1: p.error('Minimum request interval is 1 second')
    (a.output/a.site).mkdir(parents=True,exist_ok=True)
    with (a.output/a.site/'scan.lock').open('w') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        scan(a.output, a.site, a.interval, a.verify_map)

if __name__ == '__main__': main()
