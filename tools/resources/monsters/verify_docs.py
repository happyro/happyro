"""Check exported records, source attribution, merge coverage and Markdown indexes."""
import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re

from .merge_sources import DOCS
from .scan_sources import WORK, write

def records(root):
    manifest=json.loads((root/'manifest.json').read_text());rows=[]
    for part in manifest['parts']:
        p=root/part['path'];raw=p.read_bytes()
        if sha256(raw).hexdigest()!=part['sha256']:raise ValueError(f'Shard hash mismatch: {p}')
        batch=json.loads(raw)
        if len(batch)!=part['count']:raise ValueError('Shard count mismatch')
        rows.extend(batch)
    if len(rows)!=manifest['count'] or len({x['id'] for x in rows})!=len(rows):raise ValueError('Manifest count or duplicate ID')
    if [x['id'] for x in rows]!=sorted(x['id'] for x in rows):raise ValueError('Unsorted records')
    markdown_ids=[]
    for p in sorted((root/'names').glob('*.md')):
        markdown_ids.extend(int(x) for x in re.findall(r'^\| (\d+) \|',p.read_text(),re.M))
    if markdown_ids!=[x['id'] for x in rows]:raise ValueError('Readable name pages disagree')
    return {x['id']:x for x in rows}

def verify():
    sources={site:records(DOCS/site) for site in ['dvg','ro321']}
    for site in sources:
        files=['complete.json']+(['supplement.json'] if site=='ro321' else [])
        originals={x['id']:x for file in files for x in json.loads((WORK/site/file).read_text())['records']}
        if originals!=sources[site]:raise ValueError('Source export differs from verified capture')
    merged=records(DOCS/'merged');baseline=json.loads((DOCS/'project-baseline.json').read_text())
    local={x['id']:x for x in baseline['records']}
    if set(merged)!=set(local)|set(sources['dvg'])|set(sources['ro321']):raise ValueError('Merge union incomplete')
    for mid,row in merged.items():
        if row['currentName']!=(local.get(mid) or {}).get('name'):raise ValueError('Project baseline mismatch')
        identities=set()
        for site in sources:
            source=sources[site].get(mid)
            if source:
                identities.add(source['aegis'])
                for key,value in row['sources'][site].items():
                    if source[key]!=value:raise ValueError('Source identity/provenance changed')
                for key in ['sections','relations']:
                    if row['information'][site][key]!=source[key]:raise ValueError('Lost related source information')
            elif site in row['sources'] or site in row['information']:raise ValueError('Fabricated source')
        if mid in local:identities.add(local[mid]['aegis'])
        selected=row['selectedSource']
        if row['selectedName'] is not None:
            if len(identities)>1 or selected not in sources:raise ValueError('Unsafe selected identity')
            if row['selectedName']!=sources[selected][mid]['name'].strip():raise ValueError('Selected name is not source text')
    summary=json.loads((DOCS/'summary.json').read_text())
    if summary['unionIds']!=len(merged) or summary['categories']!=dict(Counter(x['category'] for x in merged.values())):raise ValueError('Summary mismatch')
    if summary['differentFromProject']!=sum(bool(x['selectedName'] is not None and x['currentName'] is not None and x['selectedName']!=x['currentName']) for x in merged.values()):raise ValueError('Changed-name count mismatch')
    for p in DOCS.rglob('*.md'):
        for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
            if not target.startswith(('http://','https://','#')) and not (p.parent/target).exists():raise ValueError('Broken document link: '+str(p)+' '+target)
    result={'status':'passed','sourceIds':{site:len(rows) for site,rows in sources.items()},'mergedIds':len(merged),'checks':['all shard SHA-256/counts','independent verified source exports','union coverage','readable name tables','source identity and related information retention','selected names copied verbatim from identified source','summary counts','relative Markdown links']}
    write(DOCS/'document-verification.json',result);print(json.dumps(result,ensure_ascii=False,indent=2))

def main():
    p=argparse.ArgumentParser(add_help=False);p.add_argument('command',nargs='?',choices=['verify']);p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');a=p.parse_args()
    if not a.command or a.help:
        c=lambda code,s:s if a.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','Monster document verification')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','verify')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 -m tools.resources.monsters.verify_docs verify')+'\n');return
    verify()

if __name__=='__main__':main()
