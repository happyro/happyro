#!/usr/bin/env python3
"""Read-only NPC naming inventory. Reports are candidates, not translation approval."""
import argparse
import bisect
import collections
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[3]
SERVER = ROOT / 'repos/happyro-server'
NPC_TYPES = {'script', 'duplicate', 'shop', 'cashshop', 'itemshop', 'pointshop', 'marketshop', 'barter', 'warp', 'warp2'}
NAME_COMMANDS = {'setnpcdisplay', 'getnpcid', 'donpcevent', 'doevent', 'enablenpc', 'disablenpc', 'hideoffnpc', 'hideonnpc', 'movenpc', 'npcspeed', 'npcwalkto', 'npcstop', 'getvariableofnpc', 'getarg', 'strnpcinfo', 'instance_npcname', 'duplicate', 'duplicatenpc', 'npcname', 'npctalk', 'npctalkself', 'callfunc', 'npcshopattach', 'npcshopopen', 'npcshopadditem', 'npcshopdelitem', 'npcshopitem', 'close', 'close2'}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def lex(source):
    """Keep offsets/newlines; comments and strings cannot introduce code/braces."""
    comments = list(source)
    code = list(source)
    literals = []
    problems = []
    i = 0
    n = len(source)
    while i < n:
        start = i
        if source.startswith('//', i):
            end = source.find('\n', i)
            i = n if end < 0 else end
            for j in range(start, i):
                comments[j] = code[j] = ' '
        elif source.startswith('/*', i):
            end = source.find('*/', i + 2)
            if end < 0:
                problems.append({'offset': i, 'kind': 'unterminated_comment'})
            i = n if end < 0 else end + 2
            for j in range(start, i):
                if source[j] != '\n':
                    comments[j] = code[j] = ' '
        elif source[i] == '"':
            closed = False
            i += 1
            while i < n:
                if source[i] == '\\':
                    i += 2
                elif source[i] == '"':
                    i += 1
                    closed = True
                    break
                else:
                    i += 1
            i = min(i, n)
            if not closed:
                problems.append({'offset': start, 'kind': 'unterminated_string'})
            raw = source[start + 1:i - 1]
            # Do not interpret script escapes, encoding or dynamic interpolation.
            literals.append({'offset': start, 'end': i, 'value': raw})
            for j in range(start, i):
                if source[j] != '\n':
                    code[j] = ' '
        else:
            i += 1
    return ''.join(comments), ''.join(code), literals, problems


def loaded_files(server=SERVER):
    configs = {}
    scripts = []
    directives = []
    stack = set()
    def visit(relative):
        if relative in stack:
            raise ValueError(f'Config import cycle: {relative}')
        stack.add(relative)
        path = server / relative
        source = path.read_text(encoding='utf-8-sig')
        configs[relative] = digest(path.read_bytes())
        stripped, _, _, problems = lex(source)
        if problems:
            raise ValueError(f'Invalid configuration: {relative}: {problems}')
        for line_no, line in enumerate(stripped.splitlines(), 1):
            match = re.match(r'^\s*(import|npc|delnpc):\s*(\S+)', line, re.I)
            if not match:
                continue
            kind, target = match.groups()
            target = target.replace('\\', '/')
            directives.append({'path': relative, 'line': line_no, 'kind': kind, 'target': target})
            if kind.lower() == 'import':
                visit(target)
            elif kind.lower() == 'npc':
                scripts.append(target)
            elif target == 'all':
                scripts.clear()
            else:
                scripts[:] = [p for p in scripts if p != target]
        stack.remove(relative)
    for entry in ['npc/re/scripts_main.conf', 'conf/script_athena.conf']:
        visit(entry)
    return configs, scripts, directives


def parse_script(source, path, loaded):
    clean, code, literals, problems = lex(source)
    starts = [0] + [m.end() for m in re.finditer('\n', source)]
    def line_at(offset):
        return bisect.bisect_right(starts, offset)
    rows = []
    depth = 0
    offset = 0
    unknown = []
    for line, masked in zip(clean.splitlines(keepends=True), code.splitlines(keepends=True)):
        if depth == 0 and masked.strip():
            cols = re.split(r'\t+', line.strip())
            if len(cols) >= 3:
                match = re.fullmatch(r'([a-zA-Z_][a-zA-Z_0-9]*)(?:\((.*)\))?', cols[1])
                kind = match[1] if match else ''
                if kind in NPC_TYPES or cols[0] == 'function' and kind == 'script':
                    raw = cols[2].strip()
                    display, separator, internal = raw.partition('::')
                    if not separator:
                        internal = raw
                    visible = display.split('#', 1)[0]
                    location = cols[0].split(',')
                    sprite = cols[3].split(',')[0] if len(cols) > 3 else ''
                    entity_kind = 'function' if cols[0] == 'function' else kind
                    hidden = not visible or cols[0] == '-' or sprite in ('-1', 'HIDDEN_WARP_NPC') or kind in ('warp', 'warp2')
                    rows.append({'audit_id': digest((path+'\0'+internal+'\0'+cols[0]).encode())[:20], 'path': path, 'line': line_at(offset), 'offset': offset, 'loaded': loaded, 'kind': entity_kind, 'location': cols[0], 'map': location[0] if len(location) > 1 else None, 'raw_name': raw, 'display_name': visible, 'server_display_name': display, 'internal_name': internal, 'explicit_internal_name': bool(separator), 'sprite': sprite, 'hidden': hidden, 'duplicate_of': match[2] if kind == 'duplicate' else None, 'display_bytes': len(display.encode()), 'internal_bytes': len(internal.encode()), 'dialogue_titles': [], 'review': 'deferred_unloaded' if not loaded else 'pending'})
                elif kind not in {'mapflag', 'monster', 'boss_monster', 'monster_boss', 'boss'}:
                    unknown.append({'line': line_at(offset), 'text': line.strip()[:200]})
            elif not re.match(r'^\s*[{};]', masked):
                unknown.append({'line': line_at(offset), 'text': line.strip()[:200]})
        for ch in masked:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth < 0:
                    problems.append({'offset': offset, 'kind': 'unmatched_close_brace'})
                    depth = 0
        offset += len(line)
    if depth:
        problems.append({'offset': len(source), 'kind': 'unclosed_braces', 'depth': depth})
    row_offsets = [row['offset'] for row in rows]
    strings = []
    for item in literals:
        owner_index = bisect.bisect_right(row_offsets, item['offset']) - 1
        owner = rows[owner_index] if owner_index >= 0 else None
        item = dict(item, line=line_at(item['offset']), owner=owner['audit_id'] if owner else None)
        strings.append(item)
        prefix = code[max(0,item['offset']-60):item['offset']]
        title = re.fullmatch(r'(?:\^[0-9a-fA-F]{6})?\[([^\[\]]+)\](?:\^[0-9a-fA-F]{6})?', item['value'])
        if owner and title and re.search(r'\bmes\s*$', prefix):
            owner['dialogue_titles'].append({'line':item['line'], 'name':title[1]})
    commands = []
    # All executable name-related occurrences; expressions are retained for manual review.
    command_pattern = re.compile(r'(?<![\w.@$#])('+'|'.join(sorted(NAME_COMMANDS))+r')(?![\w$:#])')
    header_ranges = []
    for row in rows:
        end = source.find('\n', row['offset'])
        end = len(source) if end < 0 else end
        brace = code.find('{', row['offset'], end)
        header_ranges.append((row['offset'], brace if brace >= 0 else end))
    for match in command_pattern.finditer(code):
        if any(start <= match.start() < (end if end >= 0 else len(source)) for start,end in header_ranges):
            continue
        if match[0] in ('getarg', 'close', 'close2'):
            continue
        line_end = code.find(';', match.start())
        owner_index = bisect.bisect_right(row_offsets, match.start()) - 1
        commands.append({'path':path, 'line':line_at(match.start()), 'command':match[0], 'expression':clean[match.start():line_end if line_end>=0 else len(clean)].strip(), 'owner':rows[owner_index]['audit_id'] if owner_index>=0 else None, 'loaded':loaded})
    return rows, strings, commands, [{'path':path, 'loaded':loaded, **x} for x in problems], unknown


def scan(output):
    configs, ordered, directives = loaded_files()
    loaded = set(ordered)
    files = sorted(set(str(p.relative_to(SERVER)) for p in (SERVER/'npc').rglob('*.txt')) | loaded)
    definitions, strings, commands, errors, manifest = [], [], [], [], []
    for path in files:
        raw = (SERVER/path).read_bytes()
        source = raw.decode('utf-8-sig', errors='replace')
        rows, literals, calls, issues, unknown = parse_script(source, path, path in loaded)
        definitions.extend(rows)
        commands.extend(calls)
        errors.extend(issues)
        strings.extend(dict(item, path=path, loaded=path in loaded) for item in literals)
        manifest.append({'path':path,'loaded':path in loaded,'sha256':digest(raw),'definitions':len(rows), 'unclassified_top_level':unknown, 'encoding_replacements':source.count('\ufffd')})
    index = collections.defaultdict(list)
    for row in definitions:
        if row['loaded'] and row['kind'] != 'function':
            index[row['internal_name']].append(row['audit_id'])
    # Duplicates execute the source body, but retain their own visible identity.
    by_internal = {r['internal_name']: r for r in definitions if r['loaded'] and r['kind'] != 'function'}
    for row in definitions:
        if not row['loaded'] or not row['duplicate_of']:
            continue
        source = row
        seen = {row['internal_name']}
        while source['duplicate_of']:
            target = by_internal.get(source['duplicate_of'])
            if target is None or target['internal_name'] in seen:
                row['duplicate_resolution'] = 'unresolved_or_cycle'
                break
            seen.add(target['internal_name'])
            source = target
        else:
            row['duplicate_resolution'] = source['audit_id']
            row['inherited_dialogue_titles'] = source['dialogue_titles']
    references = []
    for item in strings:
        name = item['value'].split('::',1)[0]
        if name in index:
            references.append({k:item[k] for k in ('path','loaded','line','owner','value')} | {'targets':index[name]})
    translations = json.loads((ROOT/'repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json').read_text())
    candidates = []
    for row in definitions:
        if not row['loaded']:
            continue
        flags = []
        titles = sorted(set(item['name'] for item in row.get('inherited_dialogue_titles', row['dialogue_titles'])))
        row['catalog_translation'] = translations.get(row['display_name'],row['display_name'])
        if row['display_bytes'] > 50 or row['internal_bytes'] > 50:
            flags.append('name_over_50_bytes')
        if not row['hidden'] and row['kind']!='function':
            if re.search(r'[A-Za-z]', row['display_name']):
                flags.append('latin_display')
            if titles and row['catalog_translation'] not in titles:
                flags.append('display_not_in_dialogue_titles')
        if flags:
            candidates.append({'audit_id':row['audit_id'],'path':row['path'],'line':row['line'],'name':row['display_name'],'translated':row['catalog_translation'],'titles':titles,'flags':flags})
    repos = ['.']+['repos/happyro-'+name for name in ('admin','api','client','doc','gateway','server')]
    summary = {'scope':'repository Renewal configuration, not proof of live runtime loading', 'script_files':len(files),'loaded_files':len(loaded),'unloaded_files':len(set(files)-loaded),'loaded_definition_files':sum(any(r['loaded'] and r['path']==p and r['kind'] not in ('warp','warp2','function') for r in definitions) for p in loaded),'definitions':len(definitions),'loaded_definitions':sum(r['loaded'] for r in definitions),'loaded_kinds':dict(collections.Counter(r['kind'] for r in definitions if r['loaded'])),'matching_name_literals':len(references),'name_command_candidates':len(commands),'candidates':len(candidates),'loaded_lexical_errors':sum(e['loaded'] for e in errors), 'unloaded_lexical_errors':sum(not e['loaded'] for e in errors),'unclassified_files':sum(bool(f['unclassified_top_level']) for f in manifest),'config_hashes':configs,'repeated_loads':{p:n for p,n in collections.Counter(ordered).items() if n>1},'baseline':{p:subprocess.check_output(['git','-C',str(ROOT/p),'rev-parse','HEAD'],text=True).strip() for p in repos},'resource_version':(ROOT/'deploy/docker/VERSION').read_text().strip()}
    output.mkdir(parents=True,exist_ok=True)
    for name,data in [('summary',summary),('files',manifest),('definitions',definitions),('references',references),('commands',commands),('candidates',candidates),('errors',errors),('config-directives',directives)]:
        (output/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in summary.items() if k not in ('config_hashes','baseline')},ensure_ascii=False,indent=2))
    return 1 if any(x['loaded'] for x in errors) else 0


def main():
    color = '--no-color' not in sys.argv
    def c(code,text):
        return f'\033[{code}m{text}\033[0m' if color else text
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command',nargs='?',choices=['scan'])
    parser.add_argument('--output',type=Path,default=ROOT/'work/npc-name-audit/current')
    parser.add_argument('--no-color',action='store_true')
    parser.add_argument('-h','--help',action='store_true')
    args=parser.parse_args()
    if args.help or not args.command:
        print('\n'+c('1;36','HappyRO NPC name audit')+'\n\n'+c('1;33','Usage')+'\n  python3 tools/localization/npcs/audit.py '+c('1;32','scan')+' [--output PATH] [--no-color]\n\n'+c('1;33','Examples')+'\n  '+c('36','python3 tools/localization/npcs/audit.py scan --no-color')+'\n')
        return 0
    return scan(args.output)


if __name__ == '__main__':
    sys.exit(main())
