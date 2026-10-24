"""Align independently scanned NPC identities and produce traceable name decisions."""
import argparse
from collections import Counter, defaultdict
from hashlib import sha256
import json
from pathlib import Path
import re
from scan_sources import DOCS, write

PLACEHOLDERS = {'', '—', '(无形或隐藏)'}

def normalized(name):
    # Whitespace is only a comparison aid. The chosen name remains verbatim.
    return ''.join(name.split())

def usable(row):
    return row['name'] not in PLACEHOLDERS and bool(re.search(r'[\u3400-\u9fff]', row['name'])) and not row.get('sourceConflict')

def decide(rows):
    sides = {site: [r for r in rows if r['source'] == site] for site in ('dvg', 'ro321')}
    d, r = sides['dvg'], sides['ro321']
    if len(rows) == 1:
        identity = 'single-source'
    elif len(d) == len(r) == 1 and normalized(d[0]['name']) == normalized(r[0]['name']) and usable(d[0]) and usable(r[0]):
        identity = 'aligned-name-and-position'
    else:
        identity = 'unresolved-position-candidate'
    if len(d) > 1 or len(r) > 1:
        return identity, 'hold-multiple-identities', None, '同位置存在多个实例，不选择统一名称'
    choices = [x for x in rows if usable(x)]
    if not choices:
        return identity, 'hold-no-chinese-evidence', None, '只有非中文、隐藏占位或站内冲突资料，不自行翻译'
    selected = next((x for x in choices if x['source'] == 'dvg'), choices[0])
    if len(rows) == 1:
        return identity, 'retain-single-source', selected, '保留单站有据中文名，不宣称跨站校准'
    if identity == 'aligned-name-and-position':
        return identity, 'agree', selected, '同地图、坐标且中文名忽略空白一致；使用 DVG 原文'
    if len(choices) == 1:
        return identity, 'prefer-chinese-pending-identity', selected, '仅一站提供可用中文名；仅作候选，另一站身份未证实'
    return identity, 'prefer-dvg-pending-identity', selected, '两站中文异名：候选优先当前国服导航来源 DVG；不以此证明另一名称错误或身份相同'

def load_sources():
    rows = []; fingerprints = {}
    for site in ('dvg', 'ro321'):
        directory = DOCS / site
        manifest = json.loads((directory / 'manifest.json').read_text())
        assert manifest['complete']
        fingerprints[site] = sha256((directory / 'manifest.json').read_bytes()).hexdigest()
        for part in manifest['chunks']:
            p = directory / part['file']; assert sha256(p.read_bytes()).hexdigest() == part['sha256']
            rows.extend(json.loads(p.read_text()))
    return rows, fingerprints

def build():
    rows, fingerprints = load_sources()
    groups = defaultdict(list)
    for row in rows: groups[row['map'], row['x'], row['y']].append(row)
    output = []; seen = set()
    for (mapname, x, y), members in sorted(groups.items()):
        members.sort(key=lambda r: r['key'])
        identity, decision, selected, reason = decide(members)
        sources = []
        for row in members:
            assert row['key'] not in seen; seen.add(row['key'])
            sources.append({k: row.get(k) for k in ('key', 'source', 'kind', 'name', 'sourceUrl', 'detailUrl', 'spriteId', 'imageUrl')})
        output.append({'groupId': f'{mapname}:{x}:{y}', 'map': mapname, 'x': x, 'y': y,
                       'identityStatus': identity, 'decision': decision,
                       'preferredName': selected['name'] if selected else None,
                       'preferredSourceKey': selected['key'] if selected else None,
                       'reason': reason, 'sources': sources,
                       'requiresIdentityReview': identity == 'unresolved-position-candidate',
                       'applyToGame': False})
    assert len(seen) == len(rows)
    root = DOCS / 'merged'; parts = []
    def md(value):return str(value if value is not None else '—').replace('|', '\\|').replace('\n',' ')
    for offset in range(0,len(output),250):
        batch=output[offset:offset+250]; stem=f'{offset//250+1:03}'
        p=root/'data'/f'{stem}.json';write(p,batch)
        page=root/'decisions'/f'{stem}.md';page.parent.mkdir(parents=True,exist_ok=True)
        lines=[f'# NPC 名称校准 {stem}','','| 地图 / 坐标 | DVG 原名 | RO321 原名 | 建议名称 | 决策 |','| --- | --- | --- | --- | --- |']
        for g in batch:
            names={site:' / '.join(s['name'] for s in g['sources'] if s['source']==site) for site in ('dvg','ro321')}
            lines.append('| '+' | '.join(map(md,[g['groupId'],names['dvg'],names['ro321'],g['preferredName'],g['decision']]))+' |')
        page.write_text('\n'.join(lines)+'\n')
        parts.append({'file':f'data/{stem}.json','decisions':f'decisions/{stem}.md','count':len(batch),'sha256':sha256(p.read_bytes()).hexdigest()})
    review=[{'groupId':g['groupId'],'decision':g['decision'],'sources':[s['key'] for s in g['sources']]} for g in output if g['requiresIdentityReview'] or g['preferredName'] is None]
    write(root/'review-queue.json',review)
    stats={'inputRecords':len(rows),'groups':len(output),'sourceManifests':fingerprints,
           'identityCounts':dict(Counter(g['identityStatus'] for g in output)),
           'decisionCounts':dict(Counter(g['decision'] for g in output)),
           'reviewGroups':len(review),'productChanges':False,'chunks':parts}
    write(root/'manifest.json',stats)
    text='''# NPC 身份对齐与名称校准

这是基于本次两站扫描的独立决策表，未读取旧 NPC 名称方案，也未读取游戏名称来反推网站结论。名称均直接选自来源，不自行翻译。不修改游戏。

## 身份规则

地图内部名与精确坐标生成位置候选；只有两站各一条、可用中文名忽略空白一致时，标记“名称与位置对齐”。此标记为资料层面的对齐，不等于运行脚本身份已验证。

同位置异名、多记录、英文或隐藏标签不强制合并身份。同名不同位置保持独立。RO321 的图片 URL 是标签图，不是 NPC 形象 ID；不能与 DVG 的 spriteId 比较。两站版本不同，单站缺失不代表另一站错误。坐标不同不自动靠近匹配。

## 名称规则

- `agree`：两站一致，保留 DVG 原文。
- `retain-single-source`：仅单站收录且有可用中文名，原样保留。
- `prefer-chinese-pending-identity`：仅一站有可用中文名，以该名为候选，身份仍待核对。
- `prefer-dvg-pending-identity`：两站中文不同，候选优先 DVG 当前国服导航原文；这是统一的来源选择策略，不是对名称真实性或同一身份的断言。
- `hold-multiple-identities`：同位置多记录，不选择统一名。
- `hold-no-chinese-evidence`：没有可信中文原文，不自行翻译，不把隐藏标签当名称。

空白只用于比较，不改写选定原文；不做未经核实的繁简或专名替换。每项记录有原名、来源键、URL、建议名、理由和身份状态。

## 待核对边界

校准已覆盖全部来源记录；有歧义者明确保留，不伪装成确定答案。`review-queue.json` 保存身份待核对或缺中文依据的组。后续只有要应用具体项时，才按需查详情、任务上下文或脚本标识。本阶段不批量下载详情，不自动应用待核对候选。

'''
    text+='## 统计\n\n'+ '\n'.join(f'- `{k}`：{v}' for k,v in stats['decisionCounts'].items())+'\n\n'
    text+='## 分片\n\n'+'\n'.join(f"- [{p['decisions']}]({p['decisions']})" for p in parts)+'\n'
    (root/'README.md').write_text(text)
    print(json.dumps({k:v for k,v in stats.items() if k not in ('chunks','sourceManifests')},ensure_ascii=False))

def main():
    p=argparse.ArgumentParser(add_help=False);p.add_argument('command',nargs='?',choices=['build']);p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');a=p.parse_args()
    if not a.command or a.help:
        c=lambda code,s:s if a.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','NPC identity and name review')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','build')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 tools/resources/npcs/reconcile_names.py build --no-color')+'\n');return
    build()
if __name__=='__main__':main()
