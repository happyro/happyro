"""Verify and publish the captured map-name references and merge recommendations."""
import argparse
from collections import Counter
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import parse_qs, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.localization.maps.scan_names import ro_links, write, aggregate

class EvidenceParser(HTMLParser):
    """Independent structural extraction for the source-name verification gate."""
    def __init__(self, text):
        super().__init__(); self.capture = None; self.values = []; self.text = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('class') == 'database-card-title':
            self.capture = tag; self.text = []; self.key = parse_qs(urlsplit(attrs['href']).query)['id'][0]
        elif tag == 'title':
            self.capture = tag; self.text = []; self.key = None
    def handle_data(self, data):
        if self.capture: self.text.append(data)
    def handle_endtag(self, tag):
        if tag == self.capture:
            self.values.append((self.key, ' '.join(''.join(self.text).split())))
            self.capture = None

class AreaEvidenceParser(HTMLParser):
    def __init__(self,text):
        super().__init__();self.current=None;self.capture=False;self.text=[];self.records=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        if tag=='tr':self.current=None
        if tag=='b':self.capture=True;self.text=[]
        if tag=='br' and self.capture:self.text.append('\n')
    def handle_data(self,data):
        if self.capture:self.text.append(data)
    def handle_endtag(self,tag):
        if tag!='b' or not self.capture:return
        value=''.join(self.text).strip();self.capture=False
        if value.startswith('地图名称:'):self.current=value.split(':',1)[1].strip()
        if value.startswith('区域:') and self.current:
            parts=re.split(r'\n\s*-\s*',value)
            if len(parts)>1:self.records.append((self.current,' '.join(parts[-1].split())))

def verify(root, site):
    status = json.loads((root/site/'status.json').read_text())
    if not status['complete'] or status['pending'] or status['error']: raise ValueError(f'{site} not complete')
    pages = json.loads((root/site/'pages.json').read_text())
    records = json.loads((root/site/'records.json').read_text())
    if len(pages) != status['pages'] or len(records) != status['records']: raise ValueError('Status count mismatch')
    seen = set(); extracted = []; closure = set()
    for page in pages:
        raw = Path(page['rawPath']).read_bytes()
        if sha256(raw).hexdigest() != page['sha256']: raise ValueError('Raw hash mismatch')
        url = page['url']
        if url in seen: raise ValueError('Duplicate URL')
        seen.add(url)
        text = raw.decode('utf-8' if site == 'dvg' else 'gb18030')
        values = EvidenceParser(text).values
        if site == 'dvg':
            independent = {(k,n) for k,n in values if k}
            if independent != {(r['map'],r['name']) for r in page['records']}: raise ValueError('DVG independent name mismatch')
        else:
            discovered=ro_links(text);closure.update(discovered)
            if page.get('empty'):raise ValueError('Empty page requires explicit source evidence')
            if 'page=areainfo&' in url and not any('page=npc_shop_warp&' in u for u in discovered):raise ValueError('Area page missing map entries')
            if 'page=areainfo&' in url:
                if set(AreaEvidenceParser(text).records)!={(r['map'],r['name']) for r in page['records']}:raise ValueError('RO321 area independent name mismatch: '+url)
            for row in ([] if 'page=areainfo&' in url else page['records']):
                titles = [n for k,n in values if k is None]
                if not titles or not titles[0].startswith(row['name']+' - '+row['map']+' '): raise ValueError('RO321 independent name mismatch')
        extracted.extend({**r, 'sourceUrl':url} for r in page['records'])
    if site=='ro321':
        extracted,conflicts=aggregate(pages)
        if conflicts:raise ValueError('Unresolved source conflicts')
    if sorted(extracted,key=lambda r:r['map']) != sorted(records,key=lambda r:r['map']): raise ValueError('Page/record mismatch')
    if len({r['map'] for r in records}) != len(records): raise ValueError('Duplicate map identity')
    if site == 'dvg':
        if len(records) != pages[0]['total'] or len(pages) != pages[0]['pages']: raise ValueError('Incomplete pagination')
        if {int(parse_qs(urlsplit(p['url']).query)['page'][0]) for p in pages}!=set(range(1,len(pages)+1)):raise ValueError('Page number coverage mismatch')
        if len({r['siteId'] for r in records}) != len(records): raise ValueError('Duplicate DVG site ID')
    else:
        covered={r['map'] for r in records}
        if any(parse_qs(urlsplit(u).query).get('map',[''])[0] not in covered for u in closure-seen):raise ValueError('Unscanned linked maps/areas')
        if set(status.get('detailSampleUrls',[]))-seen:raise ValueError('Missing sample details')
    return records,pages,{'passed':True,'pages':len(pages),'records':len(records),'uniqueMaps':len(records),'independentHtmlNames':True,'rawHashes':True,'directoryNameCoverage':site=='ro321','detailSamples':len(status.get('detailSampleUrls',[]))}

def esc(value):
    return str(value if value is not None else '—').replace('|','\\|').replace('\n',' ')

def table(headers, rows):
    return '\n'.join(['| '+' | '.join(headers)+' |','| '+' | '.join(['---']*len(headers))+' |']+['| '+' | '.join(esc(v) for v in row)+' |' for row in rows])

def shards(dest, stem, rows):
    results=[]
    for n,start in enumerate(range(0,len(rows),250),1):
        path=dest/stem/f'{n:03}.json';write(path,rows[start:start+250]);results.append({'file':str(path.relative_to(dest)),'count':len(rows[start:start+250]),'sha256':sha256(path.read_bytes()).hexdigest()})
    return results

def names(dest, title, rows, columns, values):
    index=[]
    for n,start in enumerate(range(0,len(rows),250),1):
        part=rows[start:start+250];path=dest/'names'/f'{n:03}.md';path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(f'# {title} {n}\n\n'+table(columns,[values(r) for r in part])+'\n')
        index.append(f'- [{part[0]["map"]} — {part[-1]["map"]}（{len(part)} 条）](names/{n:03}.md)')
    return '\n'.join(index)

def usable(name):
    return bool(name and re.search(r'[\u3400-\u9fff]',name) and not re.search(r'[\u3040-\u30ff\uac00-\ud7af\ufffd]',name))

def publish_source(dest, site, verified):
    records,pages,check=verified
    records=sorted(records,key=lambda r:r['map'])
    out=dest/site;data=shards(out,'data',records);pagefiles=shards(out,'pages',pages)
    index=names(out,f'{site} 地图名称',records,['内部地图名','来源名称','链接'],lambda r:[r['map'],r['name'],f'[来源]({r["sourceUrl"]})'])
    internal_conflicts=[r for r in records if len({e['name'] for e in r.get('evidence',[])})>1]
    write(out/'name-conflicts.json',internal_conflicts)
    write(out/'manifest.json',{'status':'complete','sameSiteNameConflicts':len(internal_conflicts),'usableChineseNames':sum(usable(r['name']) for r in records),'records':len(records),'contentPages':len(pages),'shards':data,'pageShards':pagefiles,'version':'国服正式服 / 简体中文' if site=='dvg' else 're','emptyPages':[p['url'] for p in pages if p.get('empty')]})
    missing_note=f'其中 {sum(not usable(r["name"]) for r in records)} 项没有可用中文名称，{sum(r.get("width") is None for r in records)} 项缺少尺寸；缺失信息保持原样。' if site=='dvg' else ''
    (out/'README.md').write_text(f'# {site} 地图名称扫描\n\n已采集 {len(pages)} 个内容页面，取得 {len(records)} 个不重复内部地图名。{missing_note}\n\n原文与来源独立保存，每 250 条拆分；manifest 记录分片哈希，pages 记录页面 URL、原始 HTML 哈希、抓取时间和发现链接。仅 RO321 复兴后版本参与本次扫描。扫描覆盖已发现公开目录及地图链接的名称；区域页明确列出单张地图名称时直接保留，只有区域标签、缺名或冲突才请求详情。详情中新发现的链接继续补查；不逐一请求已取得名称的详情，不声明覆盖隐藏地图或所有传送网络。\n\n'+index+'\n')
    if site=='ro321':
        (out/'name-conflicts.md').write_text('# RO321 站内名称差异\n\n同一地图在不同区域页或详情页名称不同时，保留全部证据并优先采用地图详情页名称。共 '+str(len(internal_conflicts))+' 项；详细来源见 [JSON](name-conflicts.json)。\n\n'+table(['地图键','各来源名称','采用详情名称'],[[r['map'],' / '.join(sorted({e['name'] for e in r['evidence']})),r['name']] for r in internal_conflicts])+'\n')
        with (out/'README.md').open('a') as f:f.write('\n[站内名称差异](name-conflicts.md)：保留全部候选，冲突以详情页名称为准。\n')
    write(dest/site/'verification.json',check)
    return {r['map']:r for r in records}

def export(root, dest):
    sources={}; checks={}
    verified={site:verify(root,site) for site in ['dvg','ro321']}
    for site in ['dvg','ro321']:
        sources[site]=publish_source(dest,site,verified[site]);checks[site]=verified[site][2]
    node="import maps from './repos/happyro-client/src/DB/Map/MapTable.js'; console.log(JSON.stringify(Object.entries(maps).map(([k,v])=>({map:k.replace(/\\.rsw$/,''),name:v.displayName??null,mainTitle:v.signName?.mainTitle??null,subTitle:v.signName?.subTitle??null}))));"
    project_rows=json.loads(subprocess.check_output(['node','--input-type=module','-e',node],text=True));project={r['map']:r for r in project_rows}
    if len(project)!=len(project_rows): raise ValueError('Duplicate project maps')
    project_files=['repos/happyro-client/src/DB/Map/MapTable.js','repos/happyro-client/src/DB/Map/MapNameTranslations.js']
    write(dest/'project.json',{'sourceHashes':{f:sha256(Path(f).read_bytes()).hexdigest() for f in project_files},'records':sorted(project.values(),key=lambda r:r['map'])})
    merged=[]
    for key in sorted(set(project)|set(sources['dvg'])|set(sources['ro321'])):
        d=sources['dvg'].get(key);r=sources['ro321'].get(key);p=project.get(key)
        status=('sources-agree' if d['name']==r['name'] else 'source-name-conflict') if d and r else 'dvg-only' if d else 'ro321-only' if r else 'project-only'
        if d and r and status=='source-name-conflict' and re.sub(r'\s+','',d['name'])==re.sub(r'\s+','',r['name']): status='source-whitespace-difference'
        selected=d if d and usable(d['name']) else r if r and usable(r['name']) else None
        source='dvg' if selected is d and d else 'ro321-re' if selected else 'project-retained' if p else 'unresolved'
        name=selected['name'] if selected else p['name'] if p else None
        user_named=bool(p and p['name']=='初心者修炼场')
        if user_named: name=p['name'];source='user-preference';selected=None
        merged.append({'map':key,'project':p,'dvg':d,'ro321Renewal':r,'comparisonStatus':status,'recommendedName':name,'selectedSource':source,'sourceUrl':selected['sourceUrl'] if selected else None,'reason':'保留用户此前明确指定的“初心者修炼场”命名' if user_named else '优先采用小册子国服中文原名；缺少可用中文时采用 RO321 复兴后中文原名' if selected else '缺少可确认的中文来源；保留项目现名或留空，不自行翻译','changesProjectName':bool(p and name!=p['name']),'externalNameConfirmed':selected is not None})
    out=dest/'merged';data=shards(out,'data',merged)
    write(out/'rules.json',{'identity':'exact internal map name','priority':['explicit user preference','DVG Chinese name','RO321 Renewal Chinese name','retain project name or null'],'userPreferences':{'existingName:初心者修炼场':'初心者修炼场'},'applyToGame':False,'ro321InternalConflictPolicy':'retain every source; prefer explicit map detail name over area label','sourceManifestHashes':{site:sha256((dest/site/'manifest.json').read_bytes()).hexdigest() for site in sources},'projectSnapshotHash':sha256((dest/'project.json').read_bytes()).hexdigest()})
    index=names(out,'合并地图名称建议',merged,['内部地图名','项目现名','建议名称','来源','对照状态'],lambda r:[r['map'],r['project']['name'] if r['project'] else None,r['recommendedName'],r['selectedSource'],r['comparisonStatus']])
    conflicts=[r for r in merged if r['comparisonStatus'] in {'source-name-conflict','source-whitespace-difference'}]
    conflictindex=names(dest/'comparison','两站地图名称差异',conflicts,['内部地图名','小册子','RO321 复兴后','建议采用','来源'],lambda r:[r['map'],r['dvg']['name'],r['ro321Renewal']['name'],r['recommendedName'],r['selectedSource']])
    write(out/'manifest.json',{'status':'recommendations-complete-not-applied','records':len(merged),'projectMaps':len(project),'projectDvgCoverage':len(set(project)&set(sources['dvg'])),'projectRo321Coverage':len(set(project)&set(sources['ro321'])),'comparisonCounts':dict(Counter(r['comparisonStatus'] for r in merged)),'selectionCounts':dict(Counter(r['selectedSource'] for r in merged)),'changesProjectName':sum(r['changesProjectName'] for r in merged),'shards':data})
    (out/'README.md').write_text(f'# 地图名称合并建议\n\n按内部地图名合并 {len(merged)} 项，其中项目现有 {len(project)} 项。\n\n规则：优先小册子国服中文原名，其次 RO321 复兴后中文原名；仅内部名、英文、日文等不当作可用中文翻译。没有可靠中文来源时保留项目现名，项目也无名称时留空。候选原名与链接全部保留。此处为来源优先级建议，尚未应用到游戏；用户此前明确指定的“初心者修炼场”优先保留，标注为 user-preference。\n\n'+index+'\n')
    (dest/'comparison').mkdir(parents=True,exist_ok=True)
    (dest/'comparison'/'README.md').write_text(f'# 两站地图名称差异\n\n共 {len(conflicts)} 项原文不同；包含别名、地名用字、楼层、空格及英文未翻译等情况，不把差异一律认定为错误。\n\n'+conflictindex+'\n')
    write(dest/'verification.json',{'passed':True,'sources':checks,'projectMaps':len(project),'mergedMaps':len(merged),'productApplied':False})
    readme=dest/'README.md';s=readme.read_text();s=s.replace('小册子已完成并通过核验：[完整名称清单](dvg/README.md)。RO321 仍在采集，完成后输出两站合并对照；以各站最终 manifest 和 verification 记录为完成依据。',f'扫描及合并对照已完成；核验见 [verification.json](verification.json)。\n\n- [小册子原始名称](dvg/README.md)\n- [RO321 复兴后原始名称](ro321/README.md)\n- [两站名称差异](comparison/README.md)\n- [合并建议](merged/README.md)\n\n本次未修改产品地图名称，未提交或推送。');readme.write_text(s)
    print(json.dumps(json.loads((out/'manifest.json').read_text()),ensure_ascii=False,indent=2))

def main():
    args=sys.argv[1:]
    if not args or set(args)<={'--no-color'} or '--help' in args:
        def c(code,text): return text if '--no-color' in args else f'\033[{code}m{text}\033[0m'
        print('\n'+c('1;36','HappyRO map-name evidence exporter')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','export --input DIR --output DIR [--no-color]')+'\n\n'+c('1;33','Example')+'\n  '+c('36','python3 tools/localization/maps/export_names.py export --input work/map-name-sources --output docs/localization/map-name-scans')+'\n');return
    p=argparse.ArgumentParser();p.add_argument('command',choices=['export']);p.add_argument('--input',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--no-color',action='store_true');a=p.parse_args(args);export(a.input,a.output)
if __name__=='__main__':main()
