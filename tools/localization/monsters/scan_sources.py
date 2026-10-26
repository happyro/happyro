"""Capture monster source records without changing HappyRO product data."""
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
import time
from urllib.parse import parse_qs, urlencode, urljoin, urlsplit
from urllib.request import Request, urlopen

WORK = Path('work/monster-name-sources')
BASE = {'dvg': 'https://ro.dvg.cn/', 'ro321': 'https://ro.ro321.com/'}

def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)

def plain(text):
    return ' '.join(unescape(re.sub(r'<[^>]*>', ' ', text)).split())

class Links(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'): self.links.append(attrs['href'])

class SectionText(HTMLParser):
    """Retain structured page sections without treating display values as game rules."""
    labels = {'mob_spawn': '地图／刷新原文', 'mob_mode': '行为原文',
              'mob_ele': '属性相克原文', 'mob_skill_grid': '技能原文'}
    def __init__(self, text):
        super().__init__(); self.sections = []; self.label = None; self.depth = 0; self.parts = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        if tag != 'div': return
        if self.label is not None: self.depth += 1; return
        classes = dict(attrs).get('class','').split()
        for name, label in self.labels.items():
            if name in classes: self.label = label; self.depth = 1; self.parts = []; break
    def handle_data(self, data):
        if self.label is not None: self.parts.append(data)
    def handle_endtag(self, tag):
        if tag == 'div' and self.label is not None:
            self.depth -= 1
            if self.depth == 0:
                self.sections.append({'label': self.label, 'text': ' '.join(' '.join(self.parts).split())})
                self.label = None

def canonical(url):
    u = urlsplit(url)
    query = parse_qs(u.query)
    if query.get('page_num') == ['1']: del query['page_num']
    return u.scheme + '://' + u.netloc + u.path + '?' + urlencode(sorted((k, v) for k, vs in query.items() for v in vs))

def parse_dvg(text, url):
    page = int(parse_qs(urlsplit(url).query).get('page', ['1'])[0])
    count = re.search(r'([\d,]+) 条 · 第 (\d+) / (\d+) 页', text)
    if not count or int(count[2]) != page: raise ValueError('Missing/wrong DVG pagination')
    total, pages = int(count[1].replace(',', '')), int(count[3])
    records = []
    for card in re.findall(r'<article\b[^>]*class="[^"]*monster-card[^"]*"[^>]*>(.*?)</article>', text, re.S):
        title = re.search(r'<a\b[^>]*id="monster-name-(\d+)"[^>]*>.*?<strong>(.*?)</strong></a>', card, re.S)
        identity = re.search(r'怪物 ID #(\d+) \(([^<]*)\)', card)
        if not title or not identity or title[1] != identity[1]: raise ValueError('DVG identity mismatch')
        sections = []
        # Inner summary tables retain their database/game-in labels separately.
        for match in re.finditer(r'<dt>(.*?)</dt><dd><dl class="monster-summary">(.*?)</dl>', card, re.S):
            sections.append({'label': plain(match[1]), 'fields': [
                {'label': plain(k), 'value': plain(v)}
                for k, v in re.findall(r'<dt>([^<]*)</dt><dd>(.*?)</dd>', match[2], re.S)]})
        relations = []
        for href, label in re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', card, re.S):
            if '/item_info.php?' in href or '/map_info.php?' in href:
                relations.append({'url': urljoin(BASE['dvg'], unescape(href)), 'label': plain(label)})
        records.append({'id': int(title[1]), 'name': unescape(title[2]), 'aegis': unescape(identity[2]),
                        'version': 'cn-live', 'sourceUrl': url,
                        'detailUrl': BASE['dvg'] + 'monster_info.php?id=' + title[1],
                        'sections': sections, 'relations': relations})
    expected = 20 if page < pages else total - 20 * (pages - 1)
    if len(records) != expected or len({r['id'] for r in records}) != expected:
        raise ValueError(f'DVG unexpected records {len(records)} != {expected}')
    return {'records': records, 'total': total, 'pages': pages, 'page': page,
            'links': [BASE['dvg'] + 'monster_list.php?' + urlencode({'sort': 'id', 'page': n}) for n in range(1, pages + 1)]}

def parse_ro(text, url):
    if parse_qs(urlsplit(url).query).get('page') != ['re_mob_db']:
        raise ValueError('Only explicit Renewal monster pages accepted')
    headers = list(re.finditer(r'<span\b[^>]*class=[\'\"]filled_header_text[\'\"][^>]*>([^<]*?)\s*\(([^()<>]+)\)\s*(?:&nbsp;|\s)*ID#(\d+)</span>', text))
    records = []
    for n, match in enumerate(headers):
        chunk = text[match.end():headers[n+1].start() if n+1 < len(headers) else len(text)]
        fields = [{'label': plain(k), 'value': plain(v)} for k, v in re.findall(r'<th\b[^>]*>(.*?)</th>\s*<td\b[^>]*>(.*?)</td>', chunk, re.S)]
        relations = []
        for linkmatch in re.finditer(r'<a\b[^>]*href\s*=\s*[\'\"]([^\'\"]+)[\'\"][^>]*>(.*?)</a>', chunk, re.S):
            href, label = linkmatch.groups()
            q = parse_qs(urlsplit(unescape(href)).query)
            if q.get('page', [''])[0] in ('re_item_db', 'skill_db', 'npc_shop_warp', 're_mob_skill_analysis', 're_mob_db'):
                kind = {'re_item_db':'drop', 'skill_db':'skill', 'npc_shop_warp':'map', 're_mob_skill_analysis':'skill-analysis', 're_mob_db':'companion' if 'mob_id' in q else 'navigation'}[q['page'][0]]
                if kind == 'navigation': continue
                if kind == 'drop' and 'MVP 掉落物品' in chunk[:linkmatch.start()]: kind = 'mvp-drop'
                relations.append({'kind': kind, 'url': urljoin(BASE['ro321'], unescape(href)), 'label': plain(label)})
        if not fields or fields[0]['label'] != 'HP': raise ValueError('Missing monster stats')
        records.append({'id': int(match[3]), 'name': unescape(match[1]).strip(), 'aegis': unescape(match[2]),
                        'version': 'renewal', 'sourceUrl': url,
                        'detailUrl': BASE['ro321'] + 'index.php?page=re_mob_db&mob_id=' + match[3],
                        'sections': [{'label': '复兴属性（页面显示值）', 'fields': fields}, *SectionText(chunk).sections], 'relations': relations})
    if len(records) != len(re.findall(r'ID#\d+', text)): raise ValueError('Unparsed RO321 heading')
    empty_message = '對不起，沒有找到匹配結果。'
    empty = empty_message in plain(text)
    if not records and not empty: raise ValueError('Unrecognized empty RO321 page')
    links = []
    query = parse_qs(urlsplit(url).query)
    for href in Links(text).links:
        link = urljoin(BASE['ro321'], href); q = parse_qs(urlsplit(link).query)
        if urlsplit(link).netloc == 'ro.ro321.com' and q.get('page') == ['re_mob_db'] and 'page_num' in q and q.get('race') == query.get('race'):
            links.append(canonical(link))
    # Site navigation displays first/last pages; fill the intervening page numbers explicitly.
    last = max([int(query.get('page_num', ['1'])[0]), *[int(parse_qs(urlsplit(u).query).get('page_num', ['1'])[0]) for u in links]])
    if 'race' in query:
        for page in range(1, last + 1):
            q = {k: v[0] for k, v in query.items()}; q['page_num'] = str(page)
            links.append(canonical(BASE['ro321'] + 'index.php?' + urlencode(q)))
    return {'records': records, 'links': sorted(set(links)), 'status': 'not-found' if not records else 'ok', 'notFoundMessage': empty_message if not records else None}

def parse(site, raw, url):
    text = raw.decode('utf-8' if site == 'dvg' else 'gb18030')
    if '</html>' not in text.lower(): raise ValueError('Truncated HTML')
    return parse_dvg(text, url) if site == 'dvg' else parse_ro(text, url)

class Scanner:
    def __init__(self, site):
        self.site = site; self.root = WORK / site; self.root.mkdir(parents=True, exist_ok=True); self.last = 0
    def fetch(self, url):
        url = canonical(url); key = sha256(url.encode()).hexdigest()
        rawpath = self.root / (key + '.html'); metapath = self.root / (key + '.json')
        if rawpath.exists() and metapath.exists():
            meta = json.loads(metapath.read_text()); raw = rawpath.read_bytes()
            if meta['sha256'] != sha256(raw).hexdigest(): raise ValueError('Cache hash mismatch')
        else:
            time.sleep(max(0, self.last + 2 - time.monotonic())); self.last = time.monotonic()
            with urlopen(Request(url, headers={'User-Agent': 'HappyRO monster-name reference audit', 'Accept': 'text/html'}), timeout=40) as response:
                raw = response.read(); final = response.url
            meta = {'url': url, 'finalUrl': final, 'fetchedAt': datetime.now(timezone.utc).isoformat(),
                    'encoding': 'utf-8' if self.site == 'dvg' else 'gb18030', 'sha256': sha256(raw).hexdigest(), 'bytes': len(raw)}
            rawpath.write_bytes(raw); write(metapath, meta)
        result = parse(self.site, raw, url)
        return {**meta, **result}
    def run(self, supplement=False):
        with (self.root / 'scan.lock').open('w') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            if supplement:
                existing = json.loads((self.root / 'complete.json').read_text())
                ids = {int(i) for i in json.loads(Path('repos/happyro-api/resources/game-data/monsters/renewal.json').read_text())['monsters']}
                dvg = json.loads((WORK / 'dvg/complete.json').read_text()); ids |= {r['id'] for r in dvg['records']}
                ids -= {r['id'] for r in existing['records']}
                seeds = [BASE['ro321'] + f'index.php?page=re_mob_db&mob_id={i}' for i in sorted(ids)]
                output = 'supplement.json'
            else:
                seeds = ([BASE['dvg'] + 'monster_list.php?page=1&sort=id'] if self.site == 'dvg' else
                         [BASE['ro321'] + f'index.php?page=re_mob_db&race={i}&mob_search=Search&sort_r=0' for i in range(10)])
                output = 'complete.json'
            queue = [canonical(u) for u in seeds]; known = set(queue); results = {}; records = {}; current = None
            status = {'site': self.site, 'mode': output, 'pages': 0, 'pending': len(queue), 'records': 0}
            try:
                while queue:
                    current = queue.pop(0); data = self.fetch(current); results[current] = data
                    for row in data['records']:
                        old = records.get(row['id'])
                        if old and (old['name'], old['aegis']) != (row['name'], row['aegis']): raise ValueError('Conflicting repeated identity')
                        if old and self.site == 'dvg': raise ValueError('Repeated DVG ID')
                        records[row['id']] = row
                    for link in data['links']:
                        link = canonical(link)
                        if link not in known: known.add(link); queue.append(link)
                    status = {'site': self.site, 'mode': output, 'status': 'running', 'pages': len(results), 'pending': len(queue), 'records': len(records), 'current': current}
                    write(self.root / 'status.json', status); print(json.dumps(status), flush=True)
                if self.site == 'dvg' and (len(records) != data['total'] or len(results) != data['pages']): raise ValueError('DVG coverage mismatch')
                write(self.root / output, {'pages': [{k:v for k,v in d.items() if k not in ('records','links')} for d in results.values()],
                                          'records': sorted(records.values(), key=lambda r:r['id']), 'requestedUrls': sorted(known)})
                write(self.root / 'status.json', {**status, 'status': 'complete'})
            except Exception as exc:
                write(self.root / 'status.json', {'site': self.site, 'status': 'stopped-on-error', 'current': current, 'error': str(exc),
                                                  'pages': len(results), 'records': len(records), 'pending': len(queue)})
                raise

def main():
    p = argparse.ArgumentParser(add_help=False)
    p.add_argument('command', nargs='?', choices=['scan', 'supplement'])
    p.add_argument('--site', choices=['dvg','ro321','both'], default='both')
    p.add_argument('--help', action='store_true'); p.add_argument('--no-color', action='store_true')
    args = p.parse_args()
    if not args.command or args.help:
        c = lambda code,text: text if args.no_color else f'\033[{code}m{text}\033[0m'
        print('\n' + c('1;36','HappyRO monster source scan') + '\n\n' + c('1;33','Usage') + '\n  ' + c('1;32','scan') + ' --site dvg|ro321|both\n  ' + c('1;32','supplement') + ' --site ro321\n\n' + c('1;33','Examples') + '\n  ' + c('36','python3 tools/localization/monsters/scan_sources.py scan --site both') + '\n  ' + c('36','python3 tools/localization/monsters/scan_sources.py supplement --site ro321') + '\n\nOptions: --no-color, --help\n'); return
    if args.command == 'supplement' and args.site != 'ro321': p.error('supplement requires --site ro321')
    sites = ['dvg','ro321'] if args.site == 'both' else [args.site]
    with ThreadPoolExecutor(max_workers=len(sites)) as pool:
        list(pool.map(lambda site: Scanner(site).run(args.command == 'supplement'), sites))

if __name__ == '__main__': main()
