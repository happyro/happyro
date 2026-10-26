"""Export cached NPC source evidence without applying product name changes."""
import argparse
from collections import Counter, defaultdict
from hashlib import sha256
import json
from pathlib import Path
import re
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.localization.npcs.scan_sources import WORK, DOCS, now, write, parse

def key(row):
    return f"{row['source']}:{row['version']}:{row['kind']}:{row['sourceId']}"

def safe(value):
    return str(value if value is not None else '—').replace('|', '\\|').replace('\n', ' ')

def chunks(directory, records, title):
    old_manifest = directory / 'manifest.json'
    previous = json.loads(old_manifest.read_text()).get('chunks', []) if old_manifest.exists() else []
    manifest = []
    for offset in range(0, len(records), 250):
        rows = records[offset:offset + 250]; stem = f'{offset // 250 + 1:03}'
        datafile = directory / 'data' / f'{stem}.json'; write(datafile, rows)
        namefile = directory / 'names' / f'{stem}.md'; namefile.parent.mkdir(parents=True, exist_ok=True)
        table = [f'# {title} {stem}', '', '| 来源键 | 原文名称 | 地图 | 坐标 | 来源 |', '| --- | --- | --- | --- | --- |']
        for r in rows:
            table.append(f"| {safe(r['key'])} | {safe(r['name'])} | {safe(r['map'])} | {r['x']}, {r['y']} | [原页]({r.get('detailUrl') or r.get('sourceUrl')}) |")
        namefile.write_text('\n'.join(table) + '\n')
        manifest.append({'file': f'data/{stem}.json', 'count': len(rows), 'sha256': sha256(datafile.read_bytes()).hexdigest(), 'namesFile': f'names/{stem}.md'})
    keep = {p[k] for p in manifest for k in ('file', 'namesFile')}
    for old in previous:
        for k in ('file', 'namesFile'):
            name = old.get(k)
            if name and name not in keep and (directory / name).is_file():
                (directory / name).unlink()
    return manifest

def read_site(site):
    pages = []; failures = []; discovered = set(); observations = defaultdict(list)
    for path in sorted((WORK / site).glob('*.json')):
        if path.name == 'progress.json': continue
        page = json.loads(path.read_text())
        if 'url' not in page: continue
        if site == 'dvg' and '/npc_info.php?' in page['url']: continue
        if page.get('status') != 'ok': failures.append(page); continue
        raw = path.with_suffix('.html')
        if not raw.exists() or sha256(raw.read_bytes()).hexdigest() != page['sha256']:
            raise ValueError(f'Raw response hash mismatch: {path}')
        parsed = parse(site, raw.read_bytes().decode(page['encoding']), page['url']); discovered.update(parsed['links'])
        pages.append({k: v for k, v in page.items() if k != 'parsed'} | {'kind': parsed['kind'], 'recordCount': len(parsed['records']), 'discoveredLinks': parsed['links']})
        for row in parsed['records']:
            if row['kind'] != 'warp': observations[key(row)].append(row)
    urls = {p['url'] for p in pages}; pending = sorted(discovered - urls)
    records = []
    for identity, rows in observations.items():
        chosen = dict(rows[0]); chosen['key'] = identity
        chosen['observations'] = rows
        distinct = {(r['name'], r['map'], r['x'], r['y']) for r in rows}
        chosen['sourceConflict'] = len(distinct) > 1
        chosen['hasChineseName'] = bool(re.search(r'[\u3400-\u9fff]', chosen['name']))
        chosen['placeholderName'] = chosen['name'] in ('(无形或隐藏)', '', '—')
        records.append(chosen)
    records.sort(key=lambda r: (r['kind'], r['sourceId']))
    progress_file = WORK / site / 'progress.json'
    progress = json.loads(progress_file.read_text()) if progress_file.exists() else {}
    complete = bool(pages) and not pending and not failures
    if site == 'dvg':
        list_pages = [p for p in pages if p['kind'] == 'list']
        complete = complete and len(list_pages) == 60 and len(records) == 5980
        if complete and any(not r.get('sourceUrl') for r in records):
            raise ValueError('DVG record lacks list evidence')
    else:
        complete = complete and {'map_db', 'nsw_npc_search'} <= {p['kind'] for p in pages}
    return records, pages, {'complete': complete, 'failures': failures, 'pendingUrls': pending, 'progress': progress}

def export():
    sources = {}
    for site in ('dvg', 'ro321'):
        records, pages, coverage = read_site(site); sources[site] = records
        directory = DOCS / site
        parts = chunks(directory, records, f'{site} NPC 原始资料')
        write(directory / 'pages.json', pages); write(directory / 'coverage.json', coverage)
        stats = {'site': site, 'exportedAt': now(), 'complete': coverage['complete'], 'records': len(records),
                 'kinds': dict(Counter(r['kind'] for r in records)), 'pages': len(pages), 'chunks': parts,
                 'distinctNames': len({r['name'] for r in records}),
                 'sourceConflicts': sum(r['sourceConflict'] for r in records),
                 'nonChineseNames': sum(not r['hasChineseName'] for r in records),
                 'placeholderNames': sum(r['placeholderName'] for r in records)}
        write(directory / 'manifest.json', stats)
        links = '\n'.join(f"- [{p['namesFile']}（{p['count']} 条）]({p['namesFile']})" for p in parts)
        status = '完成（发现范围内）' if coverage['complete'] else ('尚未完成：访问失败，等待恢复' if coverage['failures'] else '进行中，以下为部分结果')
        (directory / 'README.md').write_text(f"# {site} NPC 扫描\n\n有效页面 {len(pages)}，独立来源键 {len(records)}，不同原文名称 {stats['distinctNames']} 个（同名多地点保留为独立实例）。扫描{status}。\n\n名称分片只收录 NPC 与商店；传送点仅用于发现地图，不计入名称数量。原文不自行翻译，重复来源观察与站内冲突保留在数据中。\n\n[覆盖情况](coverage.json) · [页面证据](pages.json) · [清单与哈希](manifest.json)\n\n{links}\n")
    positions = defaultdict(lambda: {'dvg': [], 'ro321': []})
    for site, records in sources.items():
        for row in records:
            if row['kind'] == 'warp': continue
            positions[(row['map'], row['x'], row['y'])][site].append(row)
    groups = []; counts = Counter()
    for (mapname, x, y), sides in sorted(positions.items()):
        d, r = sides['dvg'], sides['ro321']
        if not d or not r: status = 'only-dvg' if d else 'only-ro321'
        elif len(d) != 1 or len(r) != 1: status = 'ambiguous-position'
        elif d[0]['placeholderName'] or r[0]['placeholderName']: status = 'placeholder-candidate'
        elif ''.join(d[0]['name'].split()) == ''.join(r[0]['name'].split()): status = 'same-name-position-candidate'
        else: status = 'different-name-position-candidate'
        counts[status] += 1
        groups.append({'map': mapname, 'x': x, 'y': y, 'status': status,
                       'dvg': [{'key': a['key'], 'name': a['name']} for a in d],
                       'ro321': [{'key': a['key'], 'name': a['name']} for a in r]})
    directory = DOCS / 'comparison'; parts = []
    for offset in range(0, len(groups), 250):
        path = directory / 'data' / f'{offset // 250 + 1:03}.json'; write(path, groups[offset:offset + 250])
        parts.append({'file': f'data/{path.name}', 'count': len(groups[offset:offset + 250]), 'sha256': sha256(path.read_bytes()).hexdigest()})
    write(directory / 'manifest.json', {'exportedAt': now(), 'counts': dict(counts), 'groups': len(groups), 'chunks': parts,
          'identityPolicy': 'Position-only candidates, not confirmed cross-site NPC identities. No prior NPC mapping used.'})
    (directory / 'README.md').write_text('# 独立位置对比\n\n按地图内部名与精确坐标归组，仅生成候选，不宣称同位置就是同一 NPC。站内 ID 保留命名空间；未使用以前的 NPC 名称治理结果。\n\n' + '\n'.join(f'- {k}：{v}' for k,v in counts.items()) + '\n\n资料仍在扫描时，单站独有数量不代表最终差集。名称仅忽略空白比较，原始繁简均保留，不以自动转换替代身份审核。\n')
    print(json.dumps({site: len(rows) for site,rows in sources.items()} | {'comparisonGroups': len(groups)}, ensure_ascii=False))

def main():
    p = argparse.ArgumentParser(add_help=False);p.add_argument('command', nargs='?', choices=['export']);p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');args=p.parse_args()
    if not args.command or args.help:
        c=lambda code,s:s if args.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','NPC source export')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','export')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 tools/localization/npcs/export_sources.py export')+'\n');return
    export()

if __name__ == '__main__':main()
