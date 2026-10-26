"""Publish independent source snapshots and a provenance-preserving monster merge."""
import argparse
from collections import Counter
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import parse_qs, urlsplit

from .scan_sources import WORK, write
from .verify_sources import verify

DOCS = Path('docs/localization/monster-name-scans')
API = Path('repos/happyro-api/resources/game-data/monsters/renewal.json')

def digest(path): return sha256(path.read_bytes()).hexdigest()
def markdown(value): return str(value if value is not None else '—').replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('|','\\|').replace('\n',' ')
def qualified(row): return bool(row and re.search(r'[\u3400-\u9fff]',row['name']) and not re.search(r'[\uac00-\ud7af?？\ufffd]',row['name']))

def decide(dvg, ro, local):
    rows = [r for r in [dvg,ro] if r]
    identities = {r['aegis'] for r in rows}
    if local: identities.add(local['AegisName'])
    if len(identities)>1:
        return None, None, 'identity-conflict', '同一 ID 的内部名不一致，不自动选名'
    if dvg and ro:
        category = 'both-agree' if dvg['name'].strip()==ro['name'].strip() else 'name-conflict'
    else: category = 'dvg-only' if dvg else 'ro321-only' if ro else 'no-source'
    if qualified(dvg): return dvg['name'].strip(), 'dvg', category, '身份吻合，采用小册子国服中文；两站原文同时保留'
    if qualified(ro): return ro['name'].strip(), 'ro321', category, '小册子无可用中文，采用身份吻合的 RO321 复兴中文'
    return None, None, category, '没有可靠中文来源（缺失、外文或损坏），保留项目现名；不自行翻译'

def chunks(root, records):
    (root/'data').mkdir(parents=True,exist_ok=True)
    parts=[]
    for offset in range(0,len(records),250):
        file=root/'data'/f'{offset//250+1:03}.json';batch=records[offset:offset+250]
        write(file,batch);parts.append({'path':str(file.relative_to(root)),'count':len(batch),'sha256':digest(file)})
    write(root/'manifest.json',{'count':len(records),'parts':parts})
    return parts

def name_pages(root, records, merged=False):
    directory=root/'names';directory.mkdir(parents=True,exist_ok=True)
    links=[]
    for offset in range(0,len(records),100):
        batch=records[offset:offset+100];filename=f'{offset//100+1:03}.md';links.append(f'- [{batch[0]["id"]}—{batch[-1]["id"]}](names/{filename})')
        if merged:
            text='# 魔物名称合并对照\n\n| ID | 内部名 | 项目现名 | 小册子 | RO321 复兴 | 合并候选 | 状态 |\n| --- | --- | --- | --- | --- | --- | --- |\n'
            for r in batch:
                text+='| '+' | '.join(markdown(v) for v in [r['id'],r['aegis'],r['currentName'],r['dvgName'],r['ro321Name'],r['selectedName'],r['category']])+' |\n'
        else:
            text='# 魔物名称来源清单\n\n| ID | 内部名 | 原文名称 | 来源 |\n| --- | --- | --- | --- |\n'
            for r in batch:text+=f'| {r["id"]} | {markdown(r["aegis"])} | {markdown(r["name"])} | [页面]({r["sourceUrl"]}) |\n'
        (directory/filename).write_text(text)
    return '\n'.join(links)

def field_differences(dvg,ro):
    # Only compare explicitly named equivalent display fields, not formula-derived Attack/Attack2.
    if not dvg or not ro:return []
    d={x['label']:x['value'] for s in dvg['sections'] if s['label']=='怪物属性' for x in s.get('fields',[])}
    r={x['label']:x['value'] for s in ro['sections'] for x in s.get('fields',[])}
    pairs=[('等级','等级(LV)'),('HP','HP'),('种族','种族'),('属性','属性'),('体型','体型'),('基本经验','基本经验值(base)'),('职业经验','职业经验值(Job)'),('防御力','防御力'),('魔法防御','魔法防御')]+[(x,x) for x in ['Str','Agi','Vit','Int','Dex','Luk']]
    differences=[]
    for a,b in pairs:
        dv,rv=d.get(a),r.get(b)
        if dv is None or rv is None:continue
        left,right=dv,rv
        if a=='体型':left={'小型':'小','中型':'中','大型':'大'}.get(left,left)
        if left!=right:differences.append({'field':a,'dvg':dv,'ro321':rv})
    return differences

def publish():
    verification=[verify('dvg'),verify('ro321'),verify('ro321','supplement.json')]
    d=json.loads((WORK/'dvg/complete.json').read_text());r=json.loads((WORK/'ro321/complete.json').read_text());s=json.loads((WORK/'ro321/supplement.json').read_text())
    r['records']+=s['records'];r['pages']+=s['pages'];r['requestedUrls']+=s['requestedUrls']
    if len({x['id'] for x in r['records']})!=len(r['records']):raise ValueError('Supplement overlaps primary scan')
    r['records'].sort(key=lambda x:x['id'])
    local=json.loads(API.read_text())['monsters']; local={int(k):v for k,v in local.items()}
    drows={x['id']:x for x in d['records']};rrows={x['id']:x for x in r['records']}
    queried={int(parse_qs(urlsplit(p['url']).query)['mob_id'][0]) for p in s['pages']}
    missing=(set(local)|set(drows))-set(rrows)
    if not missing<=queried:raise ValueError('Not all source/project gaps checked')
    DOCS.mkdir(parents=True,exist_ok=True)
    write(DOCS/'document-verification.json',{'status':'pending'})
    for site,data in [('dvg',d),('ro321',r)]:
        root=DOCS/site;chunks(root,data['records']);write(root/'pages.json',data['pages'])
        index=name_pages(root,data['records'])
        (root/'README.md').write_text(f'# {"RO小册子" if site=="dvg" else "RO321 复兴"}魔物来源\n\n独立采集 {len(data["pages"])} 个页面，保存 {len(data["records"])} 个唯一 ID。仅包含本次核实的来源，不推断隐藏数据。\n\n原始 HTML 在 `work/monster-name-sources/{site}/`；本目录 pages.json 保留 URL、时间、编码、SHA-256 与页面状态，manifest.json 校验每 250 条分片。结构化资料保留站点显示字段及相关链接，数值不自动写入游戏。\n\n{index}\n')
    merged=[]
    for mid in sorted(set(local)|set(drows)|set(rrows)):
        dr,rr,lr=drows.get(mid),rrows.get(mid),local.get(mid)
        selected,source,category,reason=decide(dr,rr,lr)
        current=lr['names']['zh-CN'] if lr else None
        comparison=('identity-conflict' if category=='identity-conflict' else
                    ('both-chinese-agree' if dr['name'].strip()==rr['name'].strip() else 'both-chinese-conflict') if qualified(dr) and qualified(rr) else
                    'dvg-chinese-only' if qualified(dr) else 'ro321-chinese-only' if qualified(rr) else 'no-qualified-chinese')
        merged.append({'id':mid,'aegis':lr['AegisName'] if lr else (dr or rr)['aegis'],
                       'currentName':current,'dvgName':dr['name'] if dr else None,'ro321Name':rr['name'] if rr else None,
                       'selectedName':selected,'selectedSource':source,'category':category,'reason':reason,
                       'comparisonStatus':comparison,
                       'needsReview':category in ('name-conflict','identity-conflict') or selected is None,
                       'reviewFlags':([site+'-missing-character' for site,row in [('dvg',dr),('ro321',rr)] if row and re.search(r'[?？\ufffd]',row['name'])])+(['dvg-name-is-prefix-of-ro321'] if dr and rr and len(dr['name'].strip())>=2 and rr['name'].strip().startswith(dr['name'].strip()) and len(rr['name'].strip())>len(dr['name'].strip()) else []) + [site+'-contains-hangul' for site,row in [('dvg',dr),('ro321',rr)] if row and re.search(r'[\uac00-\ud7af]',row['name'])],
                       'differsFromProject':bool(lr and selected is not None and selected!=current),
                       'sources':{site:{k:row[k] for k in ['name','aegis','version','sourceUrl','detailUrl']} for site,row in [('dvg',dr),('ro321',rr)] if row},
                       'information':{site:{k:row[k] for k in ['sections','relations']} for site,row in [('dvg',dr),('ro321',rr)] if row},
                       'fieldDifferences':field_differences(dr,rr)})
    root=DOCS/'merged';chunks(root,merged);index=name_pages(root,merged,True)
    counts=dict(Counter(x['category'] for x in merged));changed=sum(x['differsFromProject'] for x in merged)
    summary={'createdAt':datetime.now(timezone.utc).isoformat(),'sources':{'dvg':len(drows),'ro321':len(rrows)},'projectIds':len(local),'unionIds':len(merged),'categories':counts,'usableNameComparison':dict(Counter(x['comparisonStatus'] for x in merged)),'differentFromProject':changed,
             'sourceChineseNames':{'dvg':sum(qualified(x) for x in drows.values()),'ro321':sum(qualified(x) for x in rrows.values())},
             'sourceDamagedNames':{site:sum(bool(re.search(r'[?？\ufffd]',x['name'])) for x in rows.values()) for site,rows in [('dvg',drows),('ro321',rrows)]},
             'sourceHangulNames':{site:sum(bool(re.search(r'[\uac00-\ud7af]',x['name'])) for x in rows.values()) for site,rows in [('dvg',drows),('ro321',rrows)]},
             'coverage':{'bothSources':len(set(drows)&set(rrows)),'projectMissingDvg':sorted(set(local)-set(drows)),'sourceOnlyIds':sorted((set(drows)|set(rrows))-set(local))},
             'selectedSources':dict(Counter(x['selectedSource'] or 'none' for x in merged)),
             'withFieldDifferences':sum(bool(x['fieldDifferences']) for x in merged),'ro321MissingAfterLookup':sorted(missing),'supplementRequests':len(s['pages'])}
    write(DOCS/'summary.json',summary);write(DOCS/'verification.json',verification)
    write(DOCS/'project-baseline.json',{'path':str(API),'sha256':digest(API),'repositories':{repo:subprocess.check_output(['git','-C',repo,'rev-parse','HEAD'],text=True).strip() for repo in ['.','repos/happyro-server','repos/happyro-client','repos/happyro-api']},'records':[{'id':mid,'aegis':x['AegisName'],'name':x['names']['zh-CN']} for mid,x in sorted(local.items())]})
    (root/'README.md').write_text(f'# 魔物名称与信息合并\n\n共 {len(merged)} 个来源／项目 ID，{changed} 个项目 ID 的候选名称与现名不同。候选仅供后续应用审查；本轮不修改产品数据。\n\n名称按 ID 和内部名匹配，内部名冲突不自动选择。身份吻合时优先小册子国服中文，其次 RO321 复兴中文；没有可靠中文保持候选为空并保留现名，不自行翻译。该默认规则逐条写入 reason。两站冲突与身份问题见 [冲突表](conflicts.md)。needsReview 标记冲突或无中文候选；reviewFlags 提示可能的截断／前缀差异，不能据此自动认定错字或删除变体信息。\n\n相关信息按来源并排合并到 information，不覆盖彼此；fieldDifferences 比较明确同义字段，体型只为比较规范化。`—` 保留原文，不擅自解释为 0。掉落、地图、技能链接及来源标签保留，网站计算攻击力不等同于项目 Attack/Attack2。\n\n{index}\n')
    conflicts=[x for x in merged if x['category'] in ['name-conflict','identity-conflict']]
    lines=['# 两站名称与身份冲突','', '| ID | 项目内部名 | 小册子内部名／名称 | RO321 内部名／名称 | 合并候选 | 选择理由 |','| --- | --- | --- | --- | --- | --- |']
    for x in conflicts:
        def val(site):
            q=x['sources'].get(site);return q['aegis']+' / '+q['name'] if q else None
        lines.append('| '+' | '.join(markdown(v) for v in [x['id'],x['aegis'],val('dvg'),val('ro321'),x['selectedName'],x['reason']])+' |')
    (root/'conflicts.md').write_text('\n'.join(lines)+'\n')
    for filename,title,subset in [
        ('chinese-conflicts.md','两站均有可用中文的名称冲突',[x for x in merged if x['comparisonStatus']=='both-chinese-conflict']),
        ('unresolved.md','缺少可靠中文或身份不一致',[x for x in merged if x['selectedName'] is None]),
        ('changes.md','与项目现名不同的候选',[x for x in merged if x['differsFromProject']])]:
        lines=['# '+title,'',f'共 {len(subset)} 个 ID；仅记录对照与候选，未应用到产品。','',
               '| ID | 内部名 | 项目现名 | 小册子原文 | RO321 原文 | 合并候选 | 来源／原因 |',
               '| --- | --- | --- | --- | --- | --- | --- |']
        for x in subset:
            lines.append('| '+' | '.join(markdown(v) for v in [x['id'],x['aegis'],x['currentName'],x['dvgName'],x['ro321Name'],x['selectedName'],(x['selectedSource'] or 'none')+' / '+x['reason']])+' |')
        (root/filename).write_text('\n'.join(lines)+'\n')
    (DOCS/'README.md').write_text(f'''# 魔物名称与资料来源扫描

扫描完成后分别保存两站资料，再按 ID／内部名合并；未修改游戏数据。

| 来源 | 页面 | 唯一魔物 ID |
| --- | --- | --- |
| [RO小册子](dvg/README.md) | {len(d['pages'])} | {len(drows)} |
| [RO321 复兴](ro321/README.md) | {len(r['pages'])} | {len(rrows)} |
| 项目当前 API Renewal 目录 | — | {len(local)} |

[完整合并对照](merged/README.md) · [两站中文冲突](merged/chinese-conflicts.md) · [全部原文差异](merged/conflicts.md) · [候选修改](merged/changes.md) · [未决项](merged/unresolved.md) · [统计](summary.json) · [独立验证](verification.json) · [文档校验](document-verification.json)

## 采集范围

小册子遍历无过滤、ID 排序的魔物列表及全部分页，记录国服正式服／简体中文列表的名称、内部名、属性、游戏内战斗参数、掉落及地图链接。RO321 遍历十种种族的复兴目录及全部分页，补查小册子与本项目仍未覆盖的 ID，记录名称、属性、掉落／技能／地图链接。未逐页采集小册子全部详情的深层技能条件、刷新明细；相关详情链接保留供后续专项审查。

RO321 只接受 `page=re_mob_db`。`page=mob_db&re_mob=1` 仍可能返回复兴前数据，禁止混用。RO321 明确返回无匹配结果的 ID 单独记录；目录范围不代表网站无链接隐藏记录。两站可能共有上游，交叉一致不等于官方版本确认。

## 合并结果

两站原文相同 {counts.get('both-agree',0)} 项、不同 {counts.get('name-conflict',0)} 项；原文差异也包括中文与外文，不全部视为两套中文译名冲突。

| 可用中文对照 | ID 数 |
| --- | --- |
| 两站中文一致 | {summary['usableNameComparison'].get('both-chinese-agree',0)} |
| 两站中文冲突 | {summary['usableNameComparison'].get('both-chinese-conflict',0)} |
| 仅小册子提供可用中文 | {summary['usableNameComparison'].get('dvg-chinese-only',0)} |
| 仅 RO321 提供可用中文 | {summary['usableNameComparison'].get('ro321-chinese-only',0)} |
| 无可靠中文候选 | {summary['usableNameComparison'].get('no-qualified-chinese',0)} |

- 含可用中文字形的来源名称：小册子 {summary['sourceChineseNames']['dvg']}，RO321 {summary['sourceChineseNames']['ro321']}；收录 ID 不等于全部已有中文名。原文含问号／替换字符的条目为 {json.dumps(summary['sourceDamagedNames'],ensure_ascii=False)}，只保留原文证据、不选作候选；原文含韩文的条目为 {json.dumps(summary['sourceHangulNames'],ensure_ascii=False)}，不选作可靠中文；纯英文／内部名保留原文，不自行翻译；RSX-0806 等本就可能是合法字母名称，未选为中文候选不表示其错误。
- 项目名称不同的合并候选：{changed}；这不是已确认错误或已应用修改的数量。
- 两站可比较属性存在差异：{summary['withFieldDifferences']} 个 ID；所有来源值保留，不自动改写游戏规则。
- 缺少可靠中文或身份冲突时不制造名称。原始名称中的符号、变体编号和前后缀保留。

## 证据与复现

原始 HTML、断点与扫描日志位于本机 `work/monster-name-sources/`。正式文档按 250 条 JSON／100 条 Markdown 分片；源页面列表保存 URL、抓取时间、编码、哈希。project-baseline.json 固定项目目录内容哈希、各仓库提交与当前名称。

```sh
python3 tools/localization/monsters/scan_sources.py scan --site both
python3 tools/localization/monsters/scan_sources.py supplement --site ro321
python3 -m tools.localization.monsters.verify_sources verify
python3 -m tools.localization.monsters.merge_sources publish
python3 -m tools.localization.monsters.verify_docs verify
```

每站单连接、两次请求开始时间至少间隔 2 秒，缓存按哈希校验；请求／解析失败停止该站并记录断点，不将失败页面算作不存在。解析器回归与独立 HTMLParser 对所有页面名称及内部名逐项复核，覆盖分页连续性、重复 ID 与分片哈希。
''')
    print(json.dumps(summary,ensure_ascii=False,indent=2))

def main():
    p=argparse.ArgumentParser(add_help=False);p.add_argument('command',nargs='?',choices=['publish']);p.add_argument('--no-color',action='store_true');p.add_argument('--help',action='store_true');args=p.parse_args()
    if not args.command or args.help:
        c=lambda code,s:s if args.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','Monster source merge')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','publish')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 -m tools.localization.monsters.merge_sources publish')+'\n');return
    publish()

if __name__=='__main__':main()
