#!/usr/bin/env python3
"""Compile the Renewal server's enchant/reform databases for the web client."""
import argparse
import hashlib
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SERVER = ROOT / 'repos/happyro-server'
TARGET = ROOT / 'repos/happyro-client/src/DB/Items/ItemServices.json'


def compile_catalog():
    sources = {}

    def read(relative):
        path = SERVER / relative
        payload = path.read_bytes()
        sources[relative] = hashlib.sha256(payload).hexdigest()
        return yaml.load(payload, Loader=yaml.CSafeLoader).get('Body', []) or []

    items = {}
    records = {}
    for filename in ['item_db_usable.yml', 'item_db_equip.yml', 'item_db_etc.yml']:
        for item in read('db/re/' + filename):
            items[item['AegisName']] = item['Id']
            records[item['Id']] = item
    items.update({item['AegisName']: item['Id'] for item in read('db/import/item_db.yml')})

    item_ids = {name.lower(): item_id for name, item_id in items.items()}

    referenced = set()

    def item_id(name):
        value = item_ids[name.lower()]
        referenced.add(value)
        return value

    def resolve(name):
        return {'base': name, 'id': item_id(name)}

    def materials(entry):
        return [{**resolve(m['Material']), 'count': m.get('Amount', 1)} for m in entry.get('Materials', [])]

    def cost(entry):
        return {'zeny': entry.get('Price', 0), 'materials': materials(entry)}

    def entries(filename):
        # These imports are currently empty. Reject partial overrides rather than
        # silently applying semantics different from rAthena's keyed YAML merge.
        overrides = read('db/import/' + filename)
        if overrides:
            raise ValueError(f'Nonempty db/import/{filename}: compile its keyed override semantics before publishing')
        return read('db/re/' + filename)

    enchant = {}
    for entry in entries('item_enchant.yml'):
        reset = entry.get('Reset', {})
        group = {
            'id': entry['Id'], 'slotOrder': [s['Slot'] for s in entry['Order']],
            'targetItems': [resolve(name) for name, enabled in entry['TargetItems'].items() if enabled],
            'condition': {'minRefine': entry.get('MinimumRefine', 0), 'minGrade': entry.get('MinimumEnchantgrade', 0)},
            'allowRandomOption': entry.get('AllowRandomOptions', True),
            'reset': {'enabled': bool(reset), 'rate': reset.get('Chance', 0), **cost(reset)},
            'caution': '', 'slots': {},
        }
        for s in entry['Slots']:
            group['slots'][s['Slot']] = {
                'slot': s['Slot'], 'require': cost(s), 'successRate': s.get('Chance', 100000),
                'gradeBonus': {b['Enchantgrade']: b['Chance'] for b in s.get('EnchantgradeBonus', [])},
                'random': {g['Enchantgrade']: [{**resolve(e['Item']), 'rate': e['Chance']} for e in g['Items']] for g in s.get('Enchants', [])},
                'perfect': {e['Item']: {**resolve(e['Item']), **cost(e)} for e in s.get('PerfectEnchants', [])},
                'upgrade': {e['Enchant']: {**resolve(e['Enchant']), 'result': resolve(e['Upgrade']), **cost(e)} for e in s.get('Upgrades', [])},
            }
        enchant[entry['Id']] = group

    reform = {'ReformInfo': {}, 'triggers': {}}
    for entry in entries('item_reform.yml'):
        recipes = []
        for s in entry['BaseItems']:
            key = entry['Item'] + ':' + s['BaseItem']
            recipes.append(key)
            reform['ReformInfo'][key] = {
                'BaseItem': s['BaseItem'], 'BaseItemId': item_id(s['BaseItem']),
                'ResultItem': s['ResultItem'], 'ResultItemId': item_id(s['ResultItem']),
                'NeedRefineMin': s.get('MinimumRefine', 0), 'NeedRefineMax': s.get('MaximumRefine', 20),
                'NeedOptionNumMin': s.get('RequiredRandomOptions', 0), 'IsEmptySocket': not s.get('CardsAllowed', True),
                'ChangeRefineValue': s.get('ChangeRefine', 0), 'RandomOptionCode': s.get('RandomOptionGroup'),
                'PreserveSocketItem': not s.get('ClearSlots', False), 'PreserveGrade': not s.get('RemoveEnchantgrade', False),
                'Materials': [{'Material': m['base'], 'MaterialItemID': m['id'], 'Amount': m['count']} for m in materials(s)],
                'InformationString': [],
            }
        reform['triggers'][item_id(entry['Item'])] = recipes
    metadata = {i: {'base': records[i]['AegisName'], 'name': records[i]['Name'], 'slots': records[i].get('Slots', 0), 'weight': records[i].get('Weight', 0)} for i in sorted(referenced)}
    return {'sources': sources, 'items': metadata, 'enchant': enchant, 'reform': reform}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', nargs='?', choices=['generate', 'check'])
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args()
    if not args.command:
        c = (lambda code: '') if args.no_color else (lambda code: '\033[' + code + 'm')
        print(f"\n{c('1;36')}HappyRO item service catalog{c('0')}\n\n{c('1;33')}Usage{c('0')}\n  {c('1;32')}python3 tools/generate-item-services.py generate|check [--no-color]{c('0')}\n\n{c('1;33')}Examples{c('0')}\n  {c('36')}python3 tools/generate-item-services.py generate --no-color{c('0')}\n")
        return
    data = compile_catalog()
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n'
    if args.command == 'generate':
        TARGET.write_text(payload)
    elif TARGET.read_text() != payload:
        raise SystemExit('Item service catalog is stale; run generate')
    print(f"Verified {len(data['enchant'])} enchant groups and {len(data['reform']['triggers'])} reform services")


if __name__ == '__main__':
    main()
