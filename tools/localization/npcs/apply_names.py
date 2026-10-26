"""Apply independent source names to uniquely matched local NPC display fields."""
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
from tools.localization.npcs.scan_sources import DOCS, write

SERVER = Path('repos/happyro-server')
CATALOG = Path('repos/happyro-api/resources/game-data/world/npc-catalog.json')
REPORT = DOCS / 'application' / 'changes.json'

def rename_definition(raw, target):
    display, sep, internal = raw.partition('::')
    if not sep: internal = raw
    suffix = '#' + display.split('#',1)[1] if '#' in display else ''
    new_display = target + suffix
    if len(new_display.encode()) > 50: raise ValueError('display-name-too-long')
    if len(internal.encode()) > 50: raise ValueError('existing-internal-name-too-long')
    return new_display + '::' + internal

def apply():
    if REPORT.exists(): raise ValueError('Application already recorded; verify existing changes instead of reapplying')
    source_bytes=CATALOG.read_bytes();entries=json.loads(source_bytes)['entries']
    positions=defaultdict(list)
    for entry in entries:positions[entry['map'],entry['x'],entry['y']].append(entry)
    translations=json.loads(Path('repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json').read_text())
    groups=[]
    for p in sorted((DOCS/'merged/data').glob('*.json')):groups.extend(json.loads(p.read_text()))
    changes=[]; decisions=[]; files={};originals={}
    for group in groups:
        target=group['preferredName'];local=positions[group['map'],group['x'],group['y']]
        state='no-local-position';change=None
        if local:
            if not target:state='no-chinese-decision'
            elif len(local)!=1:state='multiple-local-identities'
            elif local[0]['display_name']==target:state='already-equal'
            else:
                entry=local[0]; sources=[s for s in group['sources'] if s['source']=='dvg']
                if len(sources)!=1 or sources[0].get('spriteId') is None or sources[0]['spriteId']!=entry['sprite_id']:
                    state='hold-no-matching-sprite-evidence'
                elif sources[0]['name']!=target:
                    state='hold-target-not-from-matched-source'
                elif translations.get(target,target)!=target:
                    state='hold-client-remaps-target'
                else:
                    path=entry['source']['path'];line_no=entry['source']['line'];full=SERVER/path
                    if path not in files:
                        originals[path]=full.read_bytes(); files[path]=originals[path].decode().splitlines(keepends=True)
                    line=files[path][line_no-1];indent=line[:len(line)-len(line.lstrip(' \t'))];cols=re.split(r'(\t+)',line[len(indent):])
                    assert len(cols)>=7 and cols[4].strip()==entry['name'],entry['id']
                    # No offsets, references, suffixes or script code are rewritten.
                    try:new=rename_definition(entry['name'],target)
                    except ValueError as exc:state='hold-'+str(exc)
                    else:
                        cols[4]=cols[4].replace(entry['name'],new,1);files[path][line_no-1]=indent+''.join(cols)
                        state='applied-display-name'
                        change={'groupId':group['groupId'],'oldId':entry['id'],'path':path,'line':line_no,
                                'before':entry['name'],'after':new,'oldDisplayName':entry['display_name'],
                                'target':target,'spriteId':entry['sprite_id'],'sourceKey':sources[0]['key'],
                                'sourceUrl':sources[0]['sourceUrl'],
                                'identityEvidence':'unique local NPC + exact map/coordinates + identical numeric sprite ID',
                                'internalName':new.split('::',1)[1]}
                        changes.append(change)
        decisions.append({'groupId':group['groupId'],'status':state,'preferredName':target,'localIds':[e['id'] for e in local]})
    backup=Path('work/npc-name-application/before');backup.mkdir(parents=True,exist_ok=True)
    changed_files=[]
    for path,lines in files.items():
        data=''.join(lines).encode()
        if data==originals[path]:continue
        old=backup/path;old.parent.mkdir(parents=True,exist_ok=True)
        assert not old.exists();old.write_bytes(originals[path]);(SERVER/path).write_bytes(data)
        changed_files.append({'path':path,'beforeSha256':sha256(originals[path]).hexdigest(),'afterSha256':sha256(data).hexdigest()})
    write(REPORT,{'catalogBeforeSha256':sha256(source_bytes).hexdigest(),'changes':changes,'files':changed_files})
    write(DOCS/'application/outcomes.json',decisions)
    summary={'status':'applied-pending-verification','sourceGroups':len(groups),'changedNpcs':len(changes),'changedFiles':len(changed_files),'outcomes':dict(Counter(d['status'] for d in decisions))}
    write(DOCS/'application/result.json',summary);print(json.dumps(summary,ensure_ascii=False))

def main():
    p=argparse.ArgumentParser(add_help=False);p.add_argument('command',nargs='?',choices=['apply']);p.add_argument('--help',action='store_true');p.add_argument('--no-color',action='store_true');a=p.parse_args()
    if not a.command or a.help:
        c=lambda code,s:s if a.no_color else f'\033[{code}m{s}\033[0m'
        print('\n'+c('1;36','Apply independently reviewed NPC names')+'\n\n'+c('1;33','Usage')+'\n  '+c('1;32','apply')+' [--no-color]\n\n'+c('1;33','Example')+'\n  '+c('36','python3 tools/localization/npcs/apply_names.py apply --no-color')+'\n');return
    apply()
if __name__=='__main__':main()
