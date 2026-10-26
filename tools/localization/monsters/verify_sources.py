"""Independently verify captured names with HTMLParser, then source coverage."""
import argparse
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlsplit

from .scan_sources import WORK, canonical, write, parse, plain

class Headings(HTMLParser):
    def __init__(self, site):
        super().__init__(); self.site = site; self.rows = []; self.capture = None
        self.depth = 0; self.parts = []; self.current = None; self.article_text = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.site == 'dvg':
            if tag == 'article' and 'monster-card' in a.get('class','').split():
                self.current = {}; self.article_text = []
            if self.current is not None and tag == 'a' and a.get('id','').startswith('monster-name-'):
                self.capture = 'a'; self.parts = []; self.current['id'] = int(a['id'].removeprefix('monster-name-'))
        else:
            if tag == 'div' and 'mob_stat_head' in a.get('class','').split():
                self.capture = 'div'; self.depth = 1; self.parts = []
            elif self.capture == 'div' and tag == 'div': self.depth += 1
    def handle_data(self, data):
        if self.capture: self.parts.append(data)
        if self.current is not None: self.article_text.append(data)
    def handle_endtag(self, tag):
        if self.site == 'dvg':
            if tag == 'a' and self.capture == 'a':
                self.current['name'] = ''.join(self.parts).strip(); self.capture = None
            if tag == 'article' and self.current is not None:
                text = ' '.join(self.article_text)
                identity = re.search(r'怪物 ID\s*#(\d+)\s*\(([^)]+)\)', text)
                if not identity or int(identity[1]) != self.current['id']: raise ValueError('Independent DVG identity mismatch')
                self.current['aegis'] = identity[2]; self.rows.append(self.current); self.current = None
        elif tag == 'div' and self.capture == 'div':
            self.depth -= 1
            if not self.depth:
                text = ''.join(self.parts).strip()
                identity = re.fullmatch(r'(.*?)\s*\(([^()]+)\)\s*ID#(\d+)', text)
                if not identity: raise ValueError('Independent RO321 heading invalid: '+text)
                self.rows.append({'id': int(identity[3]), 'name': identity[1].strip(), 'aegis': identity[2]}); self.capture = None

def verify(site, filename='complete.json'):
    root = WORK / site; result = json.loads((root / filename).read_text())
    expected = {r['id']: (r['name'].strip(), r['aegis']) for r in result['records']}
    actual = {}; pages = result['pages']; races = {}; counts = []
    if {p['url'] for p in pages} != set(result['requestedUrls']): raise ValueError('Unprocessed requested URLs')
    for page in pages:
        key = sha256(page['url'].encode()).hexdigest(); raw = (root / (key+'.html')).read_bytes()
        if sha256(raw).hexdigest() != page['sha256']: raise ValueError('Raw hash mismatch')
        text = raw.decode(page['encoding']); parser = Headings(site); parser.feed(text)
        if len({r['id'] for r in parser.rows}) != len(parser.rows): raise ValueError('Duplicate heading in page')
        for row in parser.rows:
            value = (row['name'],row['aegis'])
            if row['id'] in actual: raise ValueError('Cross-page duplicate/conflict')
            actual[row['id']] = value
        query = parse_qs(urlsplit(page['url']).query)
        if 'race' in query:
            race=query['race'][0]
            races.setdefault(race, []).append(int(query.get('page_num',['1'])[0]))
            expected_race=['无形','不死','动物','植物','昆虫','鱼贝','恶魔','人形','天使','龙'][int(race)]
            for record in parse(site,raw,page['url'])['records']:
                fields={x['label']:x['value'] for section in record['sections'] for x in section.get('fields',[])}
                if fields.get('种族')!=expected_race: raise ValueError('Wrong race filter: '+page['url'])
        if site == 'dvg':
            declared = re.search(r'([\d,]+) 条 · 第 (\d+) / (\d+) 页',text)
            if not declared: raise ValueError('Missing pagination')
            counts.append(tuple(int(x.replace(',','')) for x in declared.groups()))
        if filename == 'supplement.json':
            requested = int(query['mob_id'][0])
            if not parser.rows and '對不起，沒有找到匹配結果。' not in plain(text): raise ValueError('Empty detail without explicit not-found evidence')
            if parser.rows and {r['id'] for r in parser.rows} != {requested}: raise ValueError('Wrong supplemental ID')
    if actual != expected: raise ValueError('Independent names disagree with captured records')
    if races:
        if set(races) != {str(i) for i in range(10)}: raise ValueError('Missing race directory')
        for race, numbers in races.items():
            if sorted(numbers) != list(range(1,max(numbers)+1)): raise ValueError('Race page gaps: '+race)
    if counts:
        totals = {x[0] for x in counts}; lastpages = {x[2] for x in counts}
        if totals != {len(actual)} or lastpages != {len(pages)}: raise ValueError('DVG total mismatch')
        if sorted(x[1] for x in counts) != list(range(1,len(pages)+1)): raise ValueError('DVG page gaps')
    return {'site': site, 'file': filename, 'pages': len(pages), 'uniqueIds': len(actual),
            'independentHeadingCheck': True, 'rawHashes': True, 'racePages': {k:len(v) for k,v in races.items()}}

def main():
    p=argparse.ArgumentParser(add_help=False);p.add_argument('command',nargs='?',choices=['verify']);p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');args=p.parse_args()
    if not args.command or args.help:
        c=lambda code,s:s if args.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','Monster source verification')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','verify')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 -m tools.localization.monsters.verify_sources verify')+'\n');return
    result=[verify('dvg'),verify('ro321'),verify('ro321','supplement.json')]
    write(WORK/'verification.json',result);print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
