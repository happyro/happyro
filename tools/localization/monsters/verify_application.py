"""Verify reviewed monster names against their sources and every generated catalog."""
import argparse
import ast
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess
import sys

from tools.resources.catalog.monster import javascript_table


ROOT = Path(__file__).resolve().parents[3]
DOCS = ROOT / 'docs/localization/monster-name-scans'


def read(path):
    return json.loads(path.read_text())


def historical(repo, revision, path):
    return subprocess.check_output(['git', '-C', str(ROOT / repo), 'show', f'{revision}:{path}']).decode()


def server_names(text):
    result = {}
    for block in re.split(r'^  - Id: ', text, flags=re.M)[1:]:
        mid = int(block.splitlines()[0])
        aegis = re.search(r'^    AegisName: (.+)$', block, re.M)[1].strip()
        name = re.search(r'^    Name: (.+)$', block, re.M)[1].strip()
        if name.startswith(('"', "'")):
            name = ast.literal_eval(name)
        result[mid] = (aegis, name)
    return result


def verify():
    decisions = read(DOCS / 'application/decisions.json')
    assert len({r['id'] for r in decisions}) == len(decisions), 'Duplicate reviewed ID'
    baseline = read(DOCS / 'project-baseline.json')
    original = {r['id']: r for r in baseline['records']}
    assert set(original) == {r['id'] for r in decisions}, 'Incomplete project review'
    repositories = baseline['repositories']
    server_path = ROOT / 'repos/happyro-server/db/re/mob_db.yml'
    current_text = server_path.read_text()
    old_text = historical('repos/happyro-server', repositories['repos/happyro-server'], 'db/re/mob_db.yml')
    without_names = lambda text: re.sub(r'^    (?:JapaneseName|Name): .*$', '    Name: <reviewed>', text, flags=re.M)
    assert without_names(current_text) == without_names(old_text), 'Monster mechanics or identities changed'
    server = server_names(current_text)
    client = javascript_table((ROOT / 'repos/happyro-client/src/DB/Monsters/MonsterNameTable.js').read_text(), 'client')
    assert set(original) <= set(client), 'Client name lookup omits project monsters'
    sprites = javascript_table((ROOT / 'repos/happyro-client/src/DB/Monsters/MonsterTable.js').read_text(), 'sprites')
    api = read(ROOT / 'repos/happyro-api/resources/game-data/monsters/renewal.json')['monsters']
    old_api = json.loads(historical('repos/happyro-api', repositories['repos/happyro-api'], 'resources/game-data/monsters/renewal.json'))['monsters']
    english_mercenaries = server_names(historical('repos/happyro-server', '2fe6ab3dc4d8', 'db/re/mercenary_db.yml'))
    mercenary_path = ROOT / 'repos/happyro-server/db/re/mercenary_db.yml'
    old_mercenaries = historical('repos/happyro-server', repositories['repos/happyro-server'], 'db/re/mercenary_db.yml')
    assert without_names(mercenary_path.read_text()) == without_names(old_mercenaries), 'Mercenary mechanics changed'
    mercenaries = server_names(mercenary_path.read_text())
    assets = read(ROOT / 'repos/happyro-api/resources/game-data/monsters/monster-assets.json')['monsters']
    web_catalog = read(ROOT / 'repos/happyro-client/applications/pwa/data/monsters/catalog.json')
    web = {r['id']: r for r in web_catalog['monsters']}
    assert web_catalog['source']['sha256'] == sha256((ROOT / 'repos/happyro-api/resources/game-data/monsters/renewal.json').read_bytes()).hexdigest()
    wire_names = javascript_table((ROOT / 'repos/happyro-client/src/DB/Monsters/MonsterServerNameTable.js').read_text(), 'wire labels')
    expected_wire_names = {}
    assert set(original) == set(server) == set(web) == {int(k) for k in api}
    changes = []
    for r in decisions:
        mid = r['id']
        assert r['old'] == original[mid]['name']
        assert server[mid] == (r['aegis'], r['serverName']), mid
        assert client.get(mid, r['serverName']) == api[str(mid)]['names']['zh-CN'] == web[mid]['name'] == r['name'], mid
        assert api[str(mid)]['spriteName'] == assets[str(mid)]['spriteName'] == sprites.get(mid), mid
        old, new = old_api[str(mid)], api[str(mid)]
        assert {k: v for k, v in old.items() if k not in ('names', 'spriteName', 'JapaneseName')} == {
            k: v for k, v in new.items() if k not in ('names', 'spriteName', 'JapaneseName')
        }, mid
        if 'JapaneseName' in old:
            assert new['JapaneseName'] == r['serverName'], mid
        if mid in mercenaries:
            assert mercenaries[mid] == (r['aegis'], r['name']), mid
        if mid in (3569, 3570):
            assert english_mercenaries[mid] == (r['aegis'], new['names']['en-US']), mid
            assert mercenaries[mid] == (r['aegis'], r['name']), mid
        else:
            assert old['names']['en-US'] == new['names']['en-US'], mid
        wire_name = r['serverName'].encode()[:23].decode(errors='ignore')
        if wire_name != r['name'] and len(r['name'].encode()) > 23:
            expected_wire_names[mid] = wire_name
        if r['name'] != r['old']:
            assert r['evidence'], f'Unsourced change {mid}'
            assert any(r['name'] == name.strip() for e in r['evidence'] for name in e['name'].split(' / ')), mid
            changes.append(mid)
    assert wire_names == expected_wire_names, 'Stale or incorrect default wire labels'
    enabled_scripts = set()
    visited_configs = set()

    def visit_config(relative):
        if relative in visited_configs:
            return
        visited_configs.add(relative)
        text = (ROOT / 'repos/happyro-server' / relative).read_text()
        text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
        for line in text.splitlines():
            match = re.fullmatch(r'(import|npc):\s*(\S+)', line.split('//', 1)[0].strip())
            if match:
                if match[1] == 'import':
                    visit_config(match[2])
                else:
                    enabled_scripts.add(match[2])

    for config in ('npc/re/scripts_main.conf', 'conf/script_athena.conf'):
        visit_config(config)
    static_spawn_count = 0
    for relative in enabled_scripts:
        if not relative.startswith('npc/re/mobs/'):
            continue
        for line in (ROOT / 'repos/happyro-server' / relative).read_text().splitlines():
            if line.lstrip().startswith('//'):
                continue
            match = re.search(r'\t(?:boss_)?monster\t([^\t]+)\t(\d+),', line)
            if not match:
                continue
            label, mid = match[1].split(',', 1)[0], int(match[2])
            if mid in server:
                assert label in (server[mid][1], api[str(mid)]['names']['zh-CN'], '--en--', '--ja--'), (relative, mid, label)
                static_spawn_count += 1
    by_aegis = {r['aegis']: r for r in decisions}
    navigation_pattern = re.compile(r'<NAVI>\[([^\]]+)\]<INFO>([^,<>]+),0,0,3,[^<>]+</INFO></NAVI>')
    navigation_count = 0
    for path in (ROOT / 'localization/sources/kro-20211105/merged/files/lub').glob('*.json'):
        for match in navigation_pattern.finditer(path.read_text()):
            label, aegis = match.groups()
            if aegis in by_aegis:
                assert label == by_aegis[aegis]['name'], (path.name, aegis, label)
                navigation_count += 1
    for r in read(DOCS / 'application/navigation-quest-summaries.json'):
        record = read(ROOT / r['path'])['data'][str(r['questId'])]
        assert record[r['field']] == r['after'], r
    quest_text = (ROOT / 'repos/happyro-server/db/re/quest_db.yml').read_text()
    quest_targets = {}
    for block in re.split(r'^  - Id: ', quest_text, flags=re.M)[1:]:
        quest_targets[int(block.splitlines()[0])] = set(re.findall(r'^      - Mob: (\S+)', block, re.M))
    quest_tables = {}
    for r in read(DOCS / 'application/deep-quest-field-fixes.json'):
        assert r['aegis'] in quest_targets[r['targetQuestId']], r
        assert by_aegis[r['aegis']]['name'] == r['name'], r
        if r['path'] not in quest_tables:
            quest_tables[r['path']] = read(ROOT / r['path'])['data']
        assert quest_tables[r['path']][str(r['questId'])][r['field']] == r['after'], r
    references = read(DOCS / 'application/applied-spawn-references.json') + read(
        DOCS / 'application/applied-dialogue-references.json')
    character_references = read(DOCS / 'application/character-references.json')
    script_paths = {r['path'] for r in references} | {
        r['path'] for r in character_references if r['path'].startswith('repos/happyro-server/')}
    character_names = {'玛拉姆': '马岚', '米利亚姆': '米丽安', '苏阿德': '苏亚德'}
    for path in script_paths:
        relative = str(Path(path).relative_to('repos/happyro-server'))
        expected = historical('repos/happyro-server', repositories['repos/happyro-server'], relative)
        for r in references:
            if r['path'] == path:
                expected = expected.replace(r['before'], r['after'])
        for old, new in character_names.items():
            expected = expected.replace(old, new)
        assert expected.replace('\r\n', '\n') == (ROOT / path).read_text(), path
    result = {'status': 'passed', 'reviewedIds': len(decisions), 'changedNames': len(changes),
              'verifiedNavigationLabels': navigation_count,
              'verifiedOrdinarySpawnLabels': static_spawn_count,
              'checks': ['source-backed names', 'server/client/API/adventure names', 'complete ID coverage',
                         'unchanged monster mechanics and identities', 'current sprite mappings',
                         'current UTF-8 packet labels', 'alternate server display names', 'adventure source hash',
                         'same-ID English mercenary titles', 'exact reviewed NPC script replacements',
                         'all shared monster/mercenary names', 'ID-bound navigation labels and quest summaries',
                         'reviewed hunting and cooldown quest fields', 'enabled ordinary map spawn labels']}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def main(argv=None):
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or all(a in ('--help', '-h', '--no-color') for a in args):
        color = '--no-color' not in args
        paint = lambda code, text: f'\033[{code}m{text}\033[0m' if color else text
        print('\n' + paint('1;36', 'HappyRO monster application verification') + '\n')
        print(paint('1;33', 'Usage') + '\n  ' + paint('1;32', 'verify') + ' [--no-color] [--output PATH]\n')
        print(paint('1;33', 'Example') + '\n  ' + paint('36', 'python3 -m tools.localization.monsters.verify_application verify --no-color') + '\n')
        return 0
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['verify'])
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('--output', type=Path)
    options = parser.parse_args(args)
    result = verify()
    if options.output:
        options.output.parent.mkdir(parents=True, exist_ok=True)
        options.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
