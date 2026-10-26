"""Verify scan evidence, published shards and cross-site candidate coverage."""
import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.localization.npcs.scan_sources import DOCS, WORK, parse
from tools.localization.npcs.export_sources import read_site

def read(path):
    return json.loads(path.read_text())

def verify(allow_partial=False):
    all_keys = set(); expected_candidates = set(); counts = {}
    for site in ('dvg', 'ro321'):
        directory = DOCS / site; manifest = read(directory / 'manifest.json')
        if not allow_partial and not manifest['complete']:
            raise ValueError(f'{site}: scan is incomplete')
        published = []
        for chunk in manifest['chunks']:
            path = directory / chunk['file']; rows = read(path)
            assert sha256(path.read_bytes()).hexdigest() == chunk['sha256'], path
            assert len(rows) == chunk['count'] and 0 < len(rows) <= 250, path
            assert (directory / chunk['namesFile']).exists(), path
            published.extend(rows)
        assert {p.relative_to(directory).as_posix() for p in (directory / 'data').glob('*.json')} == {c['file'] for c in manifest['chunks']}
        assert {p.relative_to(directory).as_posix() for p in (directory / 'names').glob('*.md')} == {c['namesFile'] for c in manifest['chunks']}
        assert len(published) == manifest['records']
        assert len({r['key'] for r in published}) == len(published)
        assert dict(Counter(r['kind'] for r in published)) == manifest['kinds']
        pages = read(directory / 'pages.json')
        for page in pages:
            raw = WORK / site / (sha256(page['url'].encode()).hexdigest() + '.html')
            b = raw.read_bytes(); assert sha256(b).hexdigest() == page['sha256'], raw
            parsed = parse(site, b.decode(page['encoding']), page['url'])
            assert len(parsed['records']) == page['recordCount'], page['url']
            assert parsed['links'] == page['discoveredLinks'], page['url']
            cached = read(raw.with_suffix('.json'))
            assert parsed['records'] == cached['parsed']['records'], page['url']
        # Live scans may have advanced beyond the exported snapshot. Compare with only
        # the exported URLs so a partial export still has a precise verification boundary.
        source_observations = {}
        for page in pages:
            cached = read(WORK / site / (sha256(page['url'].encode()).hexdigest() + '.json'))
            for row in cached['parsed']['records']:
                if row['kind'] == 'warp': continue
                identity = f"{row['source']}:{row['version']}:{row['kind']}:{row['sourceId']}"
                source_observations.setdefault(identity, []).append(row)
        assert set(source_observations) == {r['key'] for r in published}
        for row in published:
            canonical = lambda rows: sorted(json.dumps(r, ensure_ascii=False, sort_keys=True) for r in rows)
            assert canonical(row['observations']) == canonical(source_observations[row['key']]), row['key']
            assert row['key'] not in all_keys; all_keys.add(row['key'])
            if row['kind'] != 'warp': expected_candidates.add(row['key'])
        if manifest['complete']:
            _, current_pages, coverage = read_site(site)
            assert coverage['complete'] and len(current_pages) == len(pages)
        counts[site] = {'pages': len(pages), 'records': len(published), 'complete': manifest['complete']}
    directory = DOCS / 'comparison'; manifest = read(directory / 'manifest.json'); groups = []
    for chunk in manifest['chunks']:
        path = directory / chunk['file']; b = path.read_bytes(); rows = json.loads(b)
        assert sha256(b).hexdigest() == chunk['sha256']; assert len(rows) == chunk['count']; groups.extend(rows)
    assert len(groups) == manifest['groups']
    assert dict(Counter(g['status'] for g in groups)) == manifest['counts']
    actual = [r['key'] for g in groups for site in ('dvg', 'ro321') for r in g[site]]
    assert len(actual) == len(set(actual)) and set(actual) == expected_candidates
    print(json.dumps({'verified': counts, 'candidateGroups': len(groups)}, ensure_ascii=False))

def main():
    p = argparse.ArgumentParser(add_help=False);p.add_argument('command', nargs='?', choices=['verify']);p.add_argument('--allow-partial',action='store_true');p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');args=p.parse_args()
    if not args.command or args.help:
        c=lambda code,s:s if args.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','NPC source verification')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','verify')+' [--allow-partial] [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 tools/localization/npcs/verify_sources.py verify')+'\n');return
    verify(args.allow_partial)

if __name__ == '__main__': main()
