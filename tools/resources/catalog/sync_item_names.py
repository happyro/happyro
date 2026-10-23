"""Apply the reviewed ID/name source map without altering gameplay fields."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from tools.resources.catalog.item_references import sync_item_links, sync_script_item_links
DEFAULT_MAP = ROOT / 'localization/item-names/zh-CN.json'
ITEM_INFO = ROOT / 'localization/sources/kro-20211105/merged/files/lub/itemInfo_true.json'


def sync_database(text: str, names: dict) -> str:
    item_id = None
    aegis = None
    output = []
    for line in text.splitlines(keepends=True):
        match = re.match(r'  - Id: (\d+)\s*$', line)
        if match:
            item_id = match[1]
            aegis = None
        match = re.match(r'    AegisName: ([^\r\n]+)', line)
        if match:
            aegis = match[1].strip().strip(chr(34)).strip(chr(39))
        if item_id in names and re.match(r'    Name:', line):
            expected = names[item_id].get('aegis')
            if expected is not None and aegis is not None and expected.casefold() != aegis.casefold():
                raise ValueError(f'item {item_id}: expected {expected}, got {aegis}')
            ending = '\r\n' if line.endswith('\r\n') else '\n'
            line = '    Name: ' + json.dumps(names[item_id]['name'], ensure_ascii=False) + ending
        output.append(line)
    return ''.join(output)


def sync_reference_tree(value, names):
    if isinstance(value, str):
        return sync_item_links(value, names)
    if isinstance(value, list):
        return [sync_reference_tree(entry, names) for entry in value]
    if isinstance(value, dict):
        return {key: sync_reference_tree(entry, names) for key, entry in value.items()}
    return value


def sync_item_info(payload: dict, names: dict) -> None:
    for item_id, item in payload['data'].items():
        if item_id not in names:
            continue
        previous = item['identifiedDisplayName']
        name = names[item_id]['name']
        item['identifiedDisplayName'] = name
        # Generic unidentified names (e.g. "卡片", "帽子") must stay unidentified.
        if item['unidentifiedDisplayName'] == previous:
            item['unidentifiedDisplayName'] = name


def sync_drop_names(payload, names):
    for groups in payload['drops'].values():
        for rows in groups.values():
            if not isinstance(rows, list):
                continue
            for row in rows:
                item_id = str(row['itemId'])
                if item_id not in names:
                    raise ValueError(f'unknown drop item: {item_id}')
                row['name'] = names[item_id]['name']


def render_crafting_materials(recipes, names):
    result = []
    for recipe in recipes:
        result.append(recipe['outputID'] + '#')
        for material in recipe['materials']:
            name = names[material['itemID']]['name']
            result.append(f"{name} × {material['quantity']}")
        result.append('#')
    return '\n'.join(result) + '\n'


def usage(color=True):
    def c(code, text):
        return f'\033[{code}m{text}\033[0m' if color else text
    print('\n' + c('1;36', 'HappyRO source-backed item names') + '\n\n' + c('1;33', 'Usage') + '\n  '
          + c('1;32', 'apply | check') + ' [--map PATH] [--no-color]\n\n' + c('1;33', 'Examples') + '\n  '
          + c('36', 'python3 tools/resources/catalog/sync_item_names.py check --no-color') + '\n  '
          + c('36', 'python3 tools/resources/catalog/sync_item_names.py apply') + '\n')


def main(argv):
    if not argv or set(argv) <= {'--no-color'} or '--help' in argv or '-h' in argv:
        usage('--no-color' not in argv)
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['apply', 'check'])
    parser.add_argument('--map', type=Path, default=DEFAULT_MAP)
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    source = json.loads(args.map.read_text())
    names = source['items']
    for item_id, entry in names.items():
        if not item_id.isdigit() or not entry['name'].strip() or not entry['source'].startswith('https://'):
            raise ValueError(f'invalid mapping entry: {item_id}')
    paths = sorted((ROOT / 'repos/happyro-server/db/re').glob('item_db_*.yml'))
    paths.append(ROOT / 'repos/happyro-server/db/import/item_db.yml')
    changes = []
    updates = {}
    for path in paths:
        before = path.read_bytes().decode('utf-8')
        after = sync_database(before, names)
        if after != before:
            changes.append(str(path.relative_to(ROOT)))
            updates[path] = after.encode('utf-8')
    before = json.loads(ITEM_INFO.read_text())
    after = json.loads(ITEM_INFO.read_text())
    sync_item_info(after, names)
    after = sync_reference_tree(after, names)
    reviewed = json.loads((ROOT / 'localization/item-names/reviewed-references.json').read_text())
    prose_path = ROOT / 'localization/client/data/skill-description-prose.zh-CN.json'
    prose = json.loads(prose_path.read_text())
    original_prose = dict(prose)
    for reference in reviewed['skillProse']:
        replacement = reference['prefix'] + names[reference['itemID']]['name'] + reference['suffix']
        current = prose[reference['skillID']]
        if reference['old'] not in current and replacement not in current:
            raise ValueError(f'reviewed skill reference missing: {reference}')
        prose[reference['skillID']] = current.replace(reference['old'], replacement)
    if prose != original_prose:
        changes.append(str(prose_path.relative_to(ROOT)))
        updates[prose_path] = (json.dumps(prose, ensure_ascii=False, indent=2) + '\n').encode()
    for reference in reviewed['itemDescriptions']:
        target = names[reference['itemID']]['name']
        owner = after['data'][reference['ownerID']]
        for field in ['identifiedDescriptionName', 'unidentifiedDescriptionName']:
            owner[field] = [line.replace(reference['old'], target) for line in owner[field]]
    if after != before:
        changes.append(str(ITEM_INFO.relative_to(ROOT)))
        updates[ITEM_INFO] = (json.dumps(after, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    for filename in ['OngoingQuestInfoList.json', 'OngoingQuestInfoList_True.json', 'tipbox.json']:
        path = ITEM_INFO.parent / filename
        payload = json.loads(path.read_text())
        synced = sync_reference_tree(payload, names)
        if synced != payload:
            changes.append(str(path.relative_to(ROOT)))
            updates[path] = (json.dumps(synced, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    npc_root = ROOT / 'repos/happyro-server/npc'
    for reference in reviewed['scriptLabels']:
        path = ROOT / 'repos/happyro-server' / reference['path']
        before = updates.get(path, path.read_bytes()).decode('utf-8')
        name = names[reference['itemID']]['name']
        replacement = 'mes ' + json.dumps('- ' + name, ensure_ascii=False) + ';'
        after = before.replace(reference['old'], replacement)
        if reference['old'] not in before and replacement not in before:
            raise ValueError(f'reviewed label missing: {reference}')
        if before != after:
            changes.append(str(path.relative_to(ROOT)))
            updates[path] = after.encode('utf-8')
    for path in sorted(npc_root.rglob('*.txt')):
        if 'pre-re' in path.relative_to(npc_root).parts:
            continue
        raw = updates.get(path, path.read_bytes())
        if b'<ITEM>' not in raw:
            continue
        before = raw.decode('utf-8', errors='surrogateescape')
        after = sync_script_item_links(before, names)
        if after != before:
            changes.append(str(path.relative_to(ROOT)))
            updates[path] = after.encode('utf-8', errors='surrogateescape')
    catalog_root = ROOT / 'repos/happyro-api/resources/game-data/items'
    catalog_names = {}
    for filename in ['renewal.json', 'client-kro-20211105.json']:
        payload = json.loads((catalog_root / filename).read_text())
        catalog_names.update({i: {'name': row['names']['zh-CN']} for i, row in payload['items'].items()})
    catalog_names.update(names)
    recipes = json.loads((ROOT / 'localization/item-names/crafting-materials.json').read_text())['recipes']
    craft_path = ROOT / 'localization/client/data/metalprocessitemlist.txt'
    craft_text = render_crafting_materials(recipes, names)
    if craft_path.read_text() != craft_text:
        changes.append(str(craft_path.relative_to(ROOT)))
        updates[craft_path] = craft_text.encode('utf-8')
    item_hash = hashlib.sha256((catalog_root / 'client-kro-20211105.json').read_bytes()).hexdigest()
    for filename in ['drops.json', 'catalog.json']:
        path = ROOT / 'repos/happyro-client/applications/pwa/data/monsters' / filename
        before = json.loads(path.read_text())
        after = json.loads(path.read_text())
        if filename == 'drops.json':
            sync_drop_names(after, catalog_names)
        after['source']['itemsSha256'] = item_hash
        if before != after:
            changes.append(str(path.relative_to(ROOT)))
            updates[path] = (json.dumps(after, ensure_ascii=False, separators=(',', ':')) + '\n').encode()
    if args.command == 'check':
        for filename in ['renewal.json', 'client-kro-20211105.json']:
            catalog_path = ROOT / 'repos/happyro-api/resources/game-data/items' / filename
            items = json.loads(catalog_path.read_text())['items']
            for item_id in set(items) & set(names):
                if items[item_id]['names']['zh-CN'] != names[item_id]['name']:
                    changes.append(f'{catalog_path.relative_to(ROOT)}: {item_id}')
        services = json.loads((ROOT / 'repos/happyro-client/src/DB/Items/ItemServices.json').read_text())['items']
        for item_id in set(services) & set(names):
            if services[item_id]['name'] != names[item_id]['name']:
                changes.append(f'ItemServices.json: {item_id}')
        prefix_path = ROOT / 'localization/client/data/cardprefixnametable.txt'
        for line in prefix_path.read_text().splitlines():
            if not line or line.startswith('//'):
                continue
            item_id, name, _ = line.split('#', 2)
            if item_id in names and name != names[item_id]['name']:
                changes.append(f'cardprefixnametable.txt: {item_id}')
    if changes and args.command == 'check':
        raise SystemExit('Out-of-date item names:\n' + '\n'.join(changes))
    if args.command == 'apply':
        for path, content in updates.items():
            path.write_bytes(content)
    print(f'{args.command}: {len(names)} mapped IDs, {len(set(changes))} changes')


if __name__ == '__main__':
    main(sys.argv[1:])
