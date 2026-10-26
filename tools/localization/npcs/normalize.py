#!/usr/bin/env python3
"""Apply reviewed exact naming rules without changing NPC identities or script code."""
import argparse
import collections
import json
from pathlib import Path
import re
import sys
import sys
from pathlib import Path
if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tools.localization.npcs.audit import ROOT, SERVER, digest, parse_script, lex

DEFAULT_RULES = ROOT / 'localization/npc-names/normalization.json'


def is_display_argument(code, offset, reviewed_call=None, source=None):
    # Identify the top-level argument, not a string inside a nested lookup call.
    commands = {'mes': None, 'mesf': {0}, 'npctalk': {0}, 'unittalk': {1},
                'select': None, 'prompt': None, 'menu': 'even', 'announce': {0},
                'mapannounce': {1}, 'message': {1}, 'monster': {3}, 'areamonster': {5}}
    if reviewed_call:
        if reviewed_call['command'] not in ('callsub', 'callfunc', 'setarray'):
            raise ValueError('Only reviewed display calls and selector arrays are supported')
        commands[reviewed_call['command']] = {reviewed_call['argument']}
    prefix = code[:offset]
    matches = list(re.finditer(r'(?<![\w.@$#])(' + '|'.join(commands) + r')\b', prefix))
    if not matches:
        return False
    match = matches[-1]
    tail = prefix[match.end():].lstrip()
    if reviewed_call and match[0] == reviewed_call['command']:
        if reviewed_call['command'] == 'callfunc':
            raw_tail = (source or '')[match.end():offset].lstrip()
            callee_matches = re.match(r'\(?\s*"' + re.escape(reviewed_call['callee']) + r'"\s*,', raw_tail)
        else:
            callee_matches = re.match(re.escape(reviewed_call['callee']) + r'\s*,', tail)
        if not callee_matches:
            return False
    depth = 0
    argument = 0
    if tail.startswith('('):
        tail = tail[1:]
    for ch in tail:
        if ch in '([{':
            depth += 1
        elif ch in ')]}':
            depth -= 1
            if depth < 0:
                return False
        elif ch == ';':
            return False
        elif ch == ',' and depth == 0:
            argument += 1
    allowed = commands[match[0]]
    if depth != 0:
        return False
    if allowed == 'even':
        return argument % 2 == 0
    return allowed is None or argument in allowed


def script_signature(source, path):
    rows = parse_script(source, path, True)[0]
    _, code, _, errors = lex(source)
    for row in reversed(rows):
        start = source.index(row['raw_name'], row['offset'])
        code = code[:start] + '<NPC_NAME>' + code[start+len(row['raw_name']):]
    return ''.join(code.split())


def apply_dynamic_titles(source, rules):
    for rule in rules:
        if rule['surface'] not in ('dynamic_title', 'identity_comparison'):
            continue
        if rule['surface'] == 'dynamic_title':
            expected = 'mes "[" + strnpcinfo(1) + "]";'
            valid = bool(re.fullmatch(r'mes \"[^\"]*\";', rule['old']))
        else:
            expected = rule['old'].replace('strnpcinfo(0)', 'strnpcinfo(3)', 1)
            valid = bool(re.fullmatch(r'if \(strnpcinfo\(0\) == \"[^\"]*\"\)', rule['old']))
        if rule['new'] != expected or not valid:
            raise ValueError('Only reviewed title/identity expression changes are supported')
        lines = source.splitlines(keepends=True)
        index = rule['line'] - 1
        if lines[index].strip() == expected:
            continue
        if lines[index].strip() != rule['old']:
            raise ValueError(f'Stale dynamic title: {rule}')
        lines[index] = lines[index].replace(rule['old'], expected, 1)
        source = ''.join(lines)
    return source


def transform(source, path, rules):
    source = apply_dynamic_titles(source, rules)
    original_signature = script_signature(source, path)
    original_rows = parse_script(source,path,True)[0]
    for rule in rules:
        if rule['surface'] in ('dynamic_title', 'identity_comparison'):
            continue
        old, new = rule['old'], rule['new']
        if old == new:
            raise ValueError(f'No-op rule: {rule}')
        rows, literals, _, errors, _ = parse_script(source,path,True)
        if errors:
            raise ValueError(f'Cannot modify lexically invalid script {path}')
        replacements = []
        if rule['surface'] == 'definition':
            matches = [r for r in rows if r['internal_name'] == rule['internal_name']]
            if len(matches) != 1:
                raise ValueError(f'Expected one internal identity: {rule}')
            row = matches[0]
            if row['display_name'] == new:
                continue
            if row['display_name'] != old:
                raise ValueError(f'Stale display name: {rule}')
            suffix = row['server_display_name'][len(old):]
            raw_new = new + suffix + '::' + row['internal_name']
            start = source.index(row['raw_name'],row['offset'])
            replacements.append((start,start+len(row['raw_name']),raw_new))
        elif rule['surface'] == 'literal':
            scoped = [v for v in literals if rule.get('line') is None or v['line'] == rule['line']]
            matches = [v for v in scoped if v['value'] == old]
            if not matches and any(v['value'] == new for v in scoped):
                continue
            if not matches:
                raise ValueError(f'Missing literal: {rule}')
            _, masked_code, _, _ = lex(source)
            for match in matches:
                if rule.get('line') is not None and match['line'] != rule['line']:
                    continue
                allowed = is_display_argument(masked_code, match['offset'], rule.get('display_call'), source)
                if rule.get('display_variable'):
                    prefix = masked_code[max(0, match['offset'] - 100):match['offset']]
                    variable = re.escape(rule['display_variable'])
                    allowed = bool(re.search(r'(?:set\s+' + variable + r'\s*,|' + variable + r'\s*=)\s*$', prefix))
                if not allowed:
                    raise ValueError(f'Literal is not a direct display argument: {path}:{match["line"]}')
                if old.count(':') != new.count(':'):
                    raise ValueError(f'Normalization changed colon delimiters: {path}:{match["line"]}')
                replacements.append((match['offset']+1,match['end']-1,new))
            if not replacements:
                raise ValueError(f'Literal not found at reviewed line: {rule}')
        else:
            raise ValueError(f'Unknown script rule: {rule}')
        for start,end,value in sorted(replacements,reverse=True):
            source=source[:start]+value+source[end:]
    final_rows, _, _, final_errors, _ = parse_script(source,path,True)
    if final_errors:
        raise ValueError(f'Normalization introduced invalid script syntax: {path}: {final_errors}')
    if script_signature(source, path) != original_signature:
        raise ValueError(f'Normalization changed executable code: {path}')
    identity_fields = ('kind','location','internal_name','sprite','duplicate_of')
    if [[r[k] for k in identity_fields] for r in original_rows] != [[r[k] for k in identity_fields] for r in final_rows]:
        raise ValueError(f'NPC identity changed: {path}')
    if any(r['display_bytes']>50 or r['internal_bytes']>50 for r in final_rows):
        raise ValueError(f'NPC name exceeds 50 bytes: {path}')
    return source


def run(rules_path,write):
    document=json.loads(rules_path.read_text())
    groups=collections.defaultdict(list)
    for rule in document['rules']:
        if not rule.get('reason') or not rule.get('evidence'):
            raise ValueError(f'Rule missing review evidence: {rule}')
        groups[rule['path']].append(rule)
    pending=[]
    for path,rules in groups.items():
        file=ROOT/path
        before=file.read_bytes()
        if path=='repos/happyro-client/src/DB/NpcNameTranslations.zh-CN.json':
            data=json.loads(before)
            for rule in rules:
                if rule['surface']!='translation':raise ValueError(rule)
                current=data.get(rule['key'])
                if current not in (rule['old'],rule['new']):raise ValueError(f'Stale translation: {rule}')
                data[rule['key']]=rule['new']
            after=(json.dumps(data,ensure_ascii=False,indent=2)+'\n').encode()
        elif path.startswith('repos/happyro-server/npc/'):
            # Round-trip untouched legacy resource bytes, never decode/re-encode with replacement.
            source=before.decode('utf-8',errors='surrogateescape')
            relative=str(file.relative_to(SERVER))
            after=transform(source,relative,rules).encode('utf-8',errors='surrogateescape')
        else:
            raise ValueError(f'Unsupported normalization source: {path}')
        pending.append((file,before,after))
    report=[]
    for file,before,after in pending:
        report.append({'path':str(file.relative_to(ROOT)),'before_sha256':digest(before),'after_sha256':digest(after),'changed':before!=after})
        if write and before!=after:file.write_bytes(after)
    out=ROOT/'work/npc-name-audit'
    out.mkdir(parents=True,exist_ok=True)
    (out/('apply-report.json' if write else 'preview-report.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'{"Applied" if write else "Previewed"} {len(document["rules"])} reviewed rules; {sum(r["changed"] for r in report)} files changed.')


def main():
    parser=argparse.ArgumentParser(add_help=False)
    parser.add_argument('command',nargs='?',choices=['preview','apply'])
    parser.add_argument('--rules',type=Path,default=DEFAULT_RULES)
    parser.add_argument('--no-color',action='store_true')
    parser.add_argument('-h','--help',action='store_true')
    args=parser.parse_args()
    def c(code,text):return text if args.no_color else f'\033[{code}m{text}\033[0m'
    if args.help or not args.command:
        print('\n'+c('1;36','HappyRO NPC name normalization')+'\n\n'+c('1;33','Usage')+'\n  python3 tools/localization/npcs/normalize.py '+c('1;32','preview|apply')+' [--rules PATH] [--no-color]\n\n'+c('1;33','Examples')+'\n  '+c('36','python3 tools/localization/npcs/normalize.py preview --no-color')+'\n')
        return
    run(args.rules,args.command=='apply')

if __name__=='__main__':main()
