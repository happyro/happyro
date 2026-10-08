#!/usr/bin/env python3
"""Refresh declarative catalog snapshots from versioned data and custom sources.

This does not execute NPC code, predict dynamic rewards or render client sprites.
"""
import argparse
import copy
import hashlib
import json
from pathlib import Path
import re
import sys
import yaml


def contained(root, relative):
    relative = Path(relative)
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError(f'Unsafe custom path: {relative}')
    path = root / relative
    if path.is_symlink() or any(parent.is_symlink() for parent in path.parents):
        raise ValueError(f'Symlinks are not supported: {path}')
    return path


def directives(path):
    for number, raw in enumerate(path.read_text().splitlines(), 1):
        line = raw.split('//', 1)[0].strip()
        if not line:
            continue
        match = re.fullmatch(r'(npc|import|delnpc):\s*(\S+)', line)
        if match:
            yield match[1], match[2]
        elif path.name == 'scripts.conf' or 'additions' in path.parts:
            raise ValueError(f'Invalid custom manifest directive at {path}:{number}')


def npc_sources(server, custom):
    enabled, active = {}, set()

    def visit(root, relative, user=False):
        path = contained(root, relative)
        if path in active:
            raise ValueError(f'Circular NPC import: {path}')
        active.add(path)
        for kind, target in directives(path):
            rel = Path(target)
            if user and (not rel.parts or rel.parts[0] != 'additions' or kind == 'delnpc'):
                raise ValueError('Custom NPC manifests may only load additions/')
            if kind == 'import':
                if user and rel.suffix != '.conf':
                    raise ValueError('Custom imports must be .conf files')
                visit(root, target, user)
            elif kind == 'delnpc':
                if target == 'all': enabled.clear()
                else: enabled.pop(target, None)
            elif target == 'clear' and not user:
                enabled.clear()
            else:
                source = contained(root, target)
                key = f'custom/npc/{target}' if user else target
                changed = user
                if user and rel.suffix != '.txt':
                    raise ValueError('Custom NPC sources must be .txt files')
                if not user and rel.parts[0] == 'npc' and rel.suffix == '.txt':
                    override = contained(custom / 'overrides', Path(*rel.parts[1:]))
                    if override.exists(): source, changed = override, True
                if not source.is_file():
                    raise ValueError(f'Missing NPC script: {source}')
                enabled[key] = (source, changed)
        active.remove(path)

    visit(server, 'conf/script_athena.conf')
    visit(server, 'npc/re/scripts_main.conf')
    visit(custom, 'scripts.conf', True)
    used = {source for source, changed in enabled.values() if changed}
    for path in (custom / 'overrides').rglob('*'):
        if path.is_file() and path not in used:
            print(f'Warning: NPC override is not loaded: {path}', file=sys.stderr)
    return enabled


def npc_catalog(base, server, custom):
    result = copy.deepcopy(base)
    sources = npc_sources(server, custom)
    entries = [entry for entry in result['entries']
               if entry['source']['path'] in sources and not sources[entry['source']['path']][1]]
    originals = {entry['id']: entry for entry in base['entries']}
    sprites = {entry['sprite_key']: entry['sprite_id'] for entry in base['entries'] if entry.get('sprite_id') is not None}
    images = {entry['display_sprite_id'] for entry in base['entries'] if entry.get('image_available')}
    maps = {entry['map']: entry.get('map_name_zh_cn') for entry in base['entries']}
    for logical, (source, changed) in sources.items():
        if not changed:
            continue
        # Remove multiline comments before scanning static tab-delimited definitions.
        contents = re.sub(r'/\*.*?\*/', lambda match: '\n' * match[0].count('\n'), source.read_text(), flags=re.S)
        for line_number, raw in enumerate(contents.splitlines(), 1):
            if raw.lstrip().startswith('//'): continue
            columns = re.split(r'\t+', raw.strip())
            if len(columns) < 4: continue
            location = re.fullmatch(r'([\w@-]+),(\d+),(\d+),(\d+)', columns[0])
            kind = re.fullmatch(r'(script|shop|cashshop|itemshop|pointshop|duplicate)(?:\((.*?)\))?', columns[1])
            if not location or not kind or kind[2] == 'DISABLED': continue
            name, sprite_key = columns[2].strip(), columns[3].split(',')[0].strip()
            display = re.split(r'#|::', name)[0].strip()
            if not display or sprite_key == '-1': continue
            map_name, x, y, direction = location.groups()
            key = f'{map_name}:{x}:{y}:{name}'
            sprite = int(sprite_key) if sprite_key.isdigit() else sprites.get(sprite_key)
            old = originals.get(key, {})
            entry = {
                'id': key, 'map': map_name, 'x': int(x), 'y': int(y), 'direction': int(direction),
                'name': name, 'source_name': display, 'display_name': display, 'type': kind[1],
                'sprite_key': sprite_key, 'sprite_id': sprite, 'enabled': True, 'dynamic': False,
                'map_name_zh_cn': maps.get(map_name), 'image_available': sprite in images,
                'display_sprite_id': sprite if sprite in images else None,
                'navigation': old.get('navigation') if old.get('sprite_id') == sprite else None,
                'source': {'path': logical, 'line': line_number},
            }
            entry['capabilities'] = {'can_route': True, 'can_teleport_to_npc': entry['navigation'] is not None}
            entry['game_visible'] = True
            entries.append(entry)
    seen = {}
    for order, entry in enumerate(entries):
        key = entry['id']
        seen[key] = seen.get(key, 0) + 1
        if seen[key] > 1: entry['id'] = f'{key}:{seen[key]}'
        entry['catalog_order'] = order
    result['entries'] = entries
    result['content_sha256'] = hashlib.sha256(json.dumps(entries, sort_keys=True).encode()).hexdigest()
    result['stats'] = {'entries': len(entries), 'enabled_files': len(sources)}
    result['sources']['custom'] = True
    return result


def merge_record(current, update, kind):
    result = copy.deepcopy(current)
    for key, value in update.items():
        if key == 'Id': continue
        if key == 'Name':
            result['names'] = {**result.get('names', {}), 'zh-CN': value}
            result['names'].setdefault('en-US', update.get('AegisName', value))
        elif key in ('Drops', 'MvpDrops') and kind == 'MOB_DB':
            drops = result.setdefault(key, [])
            limit = 10 if key == 'Drops' else 3
            for drop in value:
                index = drop.get('Index', len(drops))
                if not isinstance(index, int) or index < 0 or index > len(drops) or index >= limit:
                    raise ValueError(f'Invalid {key} index: {index}')
                if 'Item' not in drop or 'Rate' not in drop:
                    raise ValueError(f'{key} entries require Item and Rate')
                replacement = {k: v for k, v in drop.items() if k != 'Index'}
                if index == len(drops): drops.append(replacement)
                else: drops[index] = replacement
        elif isinstance(value, dict):
            # Jobs resets its mask; other bitfields update individual flags.
            initial = {} if key == 'Jobs' or 'All' in value else result.get(key, {})
            result[key] = {**initial, **value}
        else:
            result[key] = value
    if kind == 'ITEM_DB':
        if 'Buy' in update and 'Sell' not in update: result['Sell'] = update['Buy'] // 2
        if 'Sell' in update and 'Buy' not in update: result['Buy'] = update['Sell'] * 2
    if not result.get('AegisName') or not result.get('names'):
        raise ValueError('New catalog records require AegisName and Name')
    return result


def database_catalog(base, custom, filename, kind, key):
    result = copy.deepcopy(base)
    records = result[key]
    active = set()

    def read(relative):
        path = contained(custom, relative)
        if path in active: raise ValueError(f'Circular database import: {path}')
        active.add(path)
        payload = yaml.safe_load(path.read_text())
        if not isinstance(payload, dict) or payload.get('Header', {}).get('Type') != kind:
            raise ValueError(f'Invalid database header: {path}')
        version = payload['Header'].get('Version')
        maximum = {'ITEM_DB': 3, 'MOB_DB': 5}[kind]
        if not isinstance(version, int) or not 1 <= version <= maximum:
            raise ValueError(f'Unsupported {kind} version in {path}: {version}')
        if payload['Header'].get('Clear'): records.clear()
        body = payload.get('Body') or []
        if not isinstance(body, list):
            raise ValueError(f'Database Body must be a list: {path}')
        for entry in body:
            if not isinstance(entry, dict) or not isinstance(entry.get('Id'), int) or entry['Id'] <= 0:
                raise ValueError(f'Invalid database record ID in {path}')
            item_id = str(entry['Id'])
            records[item_id] = merge_record(records.get(item_id, {}), entry, kind)
        for entry in payload.get('Footer', {}).get('Imports', []):
            if entry.get('Mode', 'Renewal') != 'Renewal': continue
            target = Path(entry['Path'])
            if target.parts[:2] != ('db', 'import'):
                raise ValueError(f'Custom catalog imports must stay in db/import/: {target}')
            read(Path(*target.parts[2:]))
        active.remove(path)

    read(filename)
    result['custom'] = True
    return result


def refresh(base, server, custom, output):
    def load(name): return json.loads((base / name).read_text())
    # Validate and build all outputs before writing any snapshot or importing DB rows.
    outputs = {
        'items/renewal.json': database_catalog(load('items/renewal.json'), custom / 'db', 'item_db.yml', 'ITEM_DB', 'items'),
        'monsters/renewal.json': database_catalog(load('monsters/renewal.json'), custom / 'db', 'mob_db.yml', 'MOB_DB', 'monsters'),
        'world/npc-catalog.json': npc_catalog(load('world/npc-catalog.json'), server, custom / 'npc'),
    }
    if not outputs['items/renewal.json']['items'] or not outputs['monsters/renewal.json']['monsters']:
        raise ValueError('Empty item or monster catalog is invalid; check custom Header.Clear before importing')
    for name, payload in outputs.items():
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        temporary = target.with_suffix('.tmp')
        temporary.write_text(json.dumps(payload, ensure_ascii=False) + '\n')
        temporary.replace(target)
    print('Refreshed custom NPC, item and monster declaration snapshots')


def main():
    argv = [arg for arg in sys.argv[1:] if arg != '--no-color']
    if not argv or argv == ['--help']:
        color = (lambda code, text: text) if '--no-color' in sys.argv else (lambda code, text: f'\033[{code}m{text}\033[0m')
        print('\n' + color('1;36', 'HappyRO custom catalogs') + '\n')
        print(color('1;33', 'Usage'))
        print(color('1;32', '  refresh --base PATH --server PATH --custom PATH --output PATH'))
        print('\n' + color('1;33', 'Example'))
        print(color('36', 'python3 catalogs.py refresh --base /opt/happyro/catalog-base --server /opt/happyro/server-base --custom /opt/happyro/custom --output /opt/admin/resources/game-data') + '\n')
        return
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['refresh'])
    for name in ['base', 'server', 'custom', 'output']: parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args(argv)
    refresh(args.base, args.server, args.custom, args.output)


if __name__ == '__main__':
    try: main()
    except (ValueError, OSError, yaml.YAMLError) as error: sys.exit(str(error))
