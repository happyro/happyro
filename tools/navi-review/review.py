#!/usr/bin/env python3
"""Compile an offline NAVI decision table; no network or runtime preflight."""
from __future__ import annotations

import argparse
from collections import deque
import hashlib
import json
from pathlib import Path
import re
import struct
import sys
import zlib

ROOT = Path(__file__).resolve().parents[2]
TAG = re.compile(r'<NAVI>(.*?)<INFO>(.*?)</INFO></NAVI>', re.I | re.S)
STRING = re.compile(r'"((?:\\.|[^"\\])*)"')
INTEGER = re.compile(r'^[0-9]+$')
TEMPLATE_FILES = {
    'npc/re/guides/navigation.txt': 'F_Navi',
    'npc/re/quests/garden_of_time.txt': 'F_mesnavi',
}
MESSAGES = {
    'invalid_coordinate': '目标坐标格式错误，暂不可传送',
    'unknown_target': '导航目标尚未确认，暂不可传送',
    'unsupported_map': '当前客户端不支持该地图',
    'map_not_configured': '目标地图尚未开放',
    'map_cache_missing': '目标地图资料尚未确认',
    'map_forbidden': '目标地图禁止直接传入',
    'out_of_bounds': '目标坐标超出地图范围，暂不可传送',
    'no_safe_candidate': '目标附近没有已确认的安全落点',
    'default_arrival_unreviewed': '该链接没有明确落点，暂不可直接传送',
}


def clean(source: str) -> str:
    """Remove comments without changing offsets or touching quoted content."""
    return re.sub(r'"(?:\\.|[^"\\])*"|//[^\n]*|/\*[\s\S]*?\*/',
                  lambda m: m[0] if m[0].startswith('"') else re.sub(r'[^\n]', ' ', m[0]), source)


def normalize_info(info: str) -> str:
    parts = [part.strip() for part in info.split(',')]
    parts[0] = re.sub(r'\.(gat|rsw)$', '', parts[0], flags=re.I).lower()
    for index in (1, 2):
        if len(parts) > index and INTEGER.fullmatch(parts[index]):
            parts[index] = str(int(parts[index]))
    while parts and parts[-1] == '':
        parts.pop()
    return ','.join(parts)


def string_value(expression: str) -> str | None:
    match = STRING.fullmatch(expression.strip())
    if not match:
        return None
    # Script expressions here need quotes/backslashes only, not Python's unicode_escape.
    return re.sub(r'\\(["\\])', r'\1', match[1])


def calls(source: str, name: str):
    """Find balanced helper calls, including multiple calls per line."""
    for match in re.finditer(r'\b' + re.escape(name) + r'\s*\(', source):
        start = match.end()
        depth, quote, escaped = 1, False, False
        args, part = [], start
        for i in range(start, len(source)):
            ch = source[i]
            if quote:
                if escaped:
                    escaped = False
                elif ch == '\\':
                    escaped = True
                elif ch == '"':
                    quote = False
            elif ch == '"':
                quote = True
            elif ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
                if depth == 0:
                    args.append(source[part:i].strip())
                    yield match.start(), args
                    break
            elif ch == ',' and depth == 1:
                args.append(source[part:i].strip())
                part = i + 1
        else:
            raise ValueError(f'Unterminated {name} call')


def script_links(source: str, relative: str):
    source = clean(source)
    expected_templates = {
        'npc/re/guides/navigation.txt': 'return"<NAVI>["+getarg(0)+"]<INFO>"+getarg(1)+",0,000,0</INFO></NAVI>";',
        'npc/re/quests/garden_of_time.txt': 'return"<NAVI>["+getarg(0)+"]<INFO>"+getarg(1)+","+getarg(2)+","+getarg(3)+",0,101,0</INFO></NAVI>";',
    }
    if relative in expected_templates and expected_templates[relative] not in re.sub(r'\s+', '', source):
        raise ValueError(f'NAVI helper semantics changed: {relative}; review required')
    rows = []
    for match in STRING.finditer(source):
        value = string_value(match[0])
        tags = list(TAG.finditer(value))
        openings = len(re.findall(r'<NAVI>', value, re.I))
        if openings != len(tags):
            # Only the two known, inspected helpers construct a tag across strings.
            if not (relative in TEMPLATE_FILES and value == '<NAVI>['):
                raise ValueError(f'Unresolved NAVI construction: {relative}:{source.count(chr(10), 0, match.start()) + 1}')
        for tag in tags:
            rows.append({'line': source.count('\n', 0, match.start()) + 1,
                         'info': tag[2], 'label': tag[1], 'kind': 'literal'})
    for name in ('F_Navi', 'F_mesnavi'):
        for offset, args in calls(source, name):
            if name == 'F_Navi' and len(args) < 2:
                continue  # No-argument enabled check / single-argument help message.
            label = string_value(args[0]) if args else None
            line = source.count('\n', 0, offset) + 1
            if label is None:
                raise ValueError(f'Unreviewed dynamic {name} label: {relative}:{line}')
            infos = []
            if name == 'F_Navi':
                target = string_value(args[1])
                if target is not None:
                    infos = [target + ',0,000,0']
                else:
                    dynamic = re.fullmatch(r'\.@map\$\s*\+\s*("(?:\\.|[^"\\])*")', args[1])
                    assignment = re.search(r'set\s+\.@map\$\s*,\s*strnpcinfo\(4\)\s*;', source)
                    if relative != 'npc/re/guides/guides_izlude.txt' or not dynamic or not assignment:
                        raise ValueError(f'Unreviewed dynamic F_Navi target: {relative}:{line}')
                    maps = sorted(set(re.findall(r'^([^,\s]+),\d+,\d+,\d+\s+duplicate\(GuideIzlude\)', source, re.M)))
                    if not maps or not set(maps) <= {'izlude', 'izlude_a', 'izlude_b', 'izlude_c', 'izlude_d'}:
                        raise ValueError('GuideIzlude map instances changed; review required')
                    infos = [map_name + string_value(dynamic[1]) + ',0,000,0' for map_name in maps]
            elif len(args) == 4:
                map_name = string_value(args[1])
                if map_name is not None and INTEGER.fullmatch(args[2]) and INTEGER.fullmatch(args[3]):
                    infos = [f'{map_name},{args[2]},{args[3]},0,101,0']
            if not infos:
                raise ValueError(f'Unreviewed {name} arguments: {relative}:{line}')
            for info in infos:
                rows.append({'line': line, 'info': info, 'label': label, 'kind': name})
    return rows


def json_strings(value, location='$'):
    if isinstance(value, str):
        yield location, value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from json_strings(item, f'{location}.{key}')
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from json_strings(item, f'{location}[{index}]')


def decode_cache(data: bytes):
    if len(data) < 8:
        raise ValueError('Truncated map cache header')
    _, count = struct.unpack_from('<IH', data)
    offset, result = 8, {}
    for _ in range(count):
        name, width, height, length = struct.unpack_from('<12shhi', data, offset)
        offset += 20
        if width <= 0 or height <= 0 or length < 0 or offset + length > len(data):
            raise ValueError('Invalid map cache entry')
        cells = zlib.decompress(data[offset:offset + length])
        offset += length
        if len(cells) != width * height:
            raise ValueError('Invalid map cell count')
        result[name.split(b'\0')[0].decode('ascii')] = (width, height, cells)
    if offset != len(data):
        raise ValueError('Trailing map cache data')
    return result


def static_touch_areas(sources):
    """Read placed trigger declarations, including duplicates, without running scripts.

    npc_setcells uses declared spans, not the presence of an OnTouch label.
    Hidden/disabled declarations are included: scripts can enable them later.
    """
    definitions, placed = {}, []
    for relative, text in sources:
        source = clean(text)
        masked = STRING.sub(lambda m: re.sub(r'[^\n]', ' ', m[0]), source)
        depth = 0
        for line_number, (line, code) in enumerate(zip(source.splitlines(), masked.splitlines()), 1):
            if depth == 0:
                fields = re.split(r'\t+', line.strip(), maxsplit=3)
                if len(fields) == 4:
                    location, declaration, name, arguments = fields
                    kind = declaration.split('(', 1)[0].lower()
                    if kind in ('script', 'warp', 'warp2', 'duplicate'):
                        name = name.split('::')[-1]
                        reference = None
                        if kind == 'duplicate':
                            match = re.fullmatch(r'duplicate\(([^)]+)\)', declaration, re.I)
                            if not match:
                                raise ValueError(f'Unreviewed NPC duplicate: {relative}:{line_number}')
                            reference = match[1]
                        record = {'kind': kind, 'reference': reference, 'arguments': arguments,
                                  'source': relative, 'line': line_number}
                        # Function declarations are not named NPC instances.
                        if location != 'function':
                            definitions[name] = record
                        if location != '-' and location != 'function':
                            match = re.fullmatch(r'([^,\s]+),\s*(-?\d+),\s*(-?\d+),\s*-?\d+(?:,.*)?', location)
                            if not match:
                                raise ValueError(f'Unreviewed NPC placement: {relative}:{line_number}')
                            placed.append((match[1].lower(), int(match[2]), int(match[3]), record))
            depth += code.count('{') - code.count('}')
        if depth != 0:
            raise ValueError(f'Unbalanced NPC script: {relative}')

    def resolve(record, seen):
        if record['kind'] != 'duplicate':
            return record['kind']
        name = record['reference']
        if name in seen:
            raise ValueError(f'Cyclic NPC duplicate: {name}')
        if name not in definitions:
            # A duplicate without spans cannot contribute a trigger area.
            # Span-bearing unresolved duplicates must never silently be ignored.
            if ',' in record['arguments']:
                raise ValueError(f'Unresolved NPC trigger duplicate: {name}')
            return 'other'
        return resolve(definitions[name], seen | {name})

    areas = {}
    for map_name, x, y, record in placed:
        kind = resolve(record, set())
        pattern = r'^\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,|\s*$)' if kind in ('warp', 'warp2') else r'^[^,]+,\s*(-?\d+)\s*,\s*(-?\d+)(?:\s*,|\s*$)'
        span = re.match(pattern, record['arguments']) if kind in ('script', 'warp', 'warp2') else None
        if span:
            xs, ys = int(span[1]), int(span[2])
            if xs >= 0 and ys >= 0:
                areas.setdefault(map_name, []).append((x - xs, y - ys, x + xs, y + ys))
    return areas



def static_npcs(sources):
    """Read loaded top-level placements and complete bodies, never quoted declarations."""
    definitions, placed = {}, []
    duplicate_names = set()
    unstable_names, unstable_sources = set(), set()
    for relative, text in sources:
        source = clean(text)
        masked = STRING.sub(lambda m: re.sub(r'[^\n]', ' ', m[0]), source)
        depth, current = 0, None
        offset = 0
        for line_number, (line, code) in enumerate(zip(source.splitlines(True), masked.splitlines(True)), 1):
            if depth == 0:
                fields = re.split(r'\t+', line.strip(), maxsplit=3)
                if len(fields) == 4:
                    location, declaration, name, arguments = fields
                    kind = declaration.split('(', 1)[0].lower()
                    if kind in ('script', 'warp', 'warp2', 'duplicate', 'shop', 'cashshop', 'itemshop', 'pointshop', 'marketshop', 'trader') and location != 'function':
                        record = {'kind': kind, 'name': name.split('::')[-1],
                                  'displayName': name.split('::')[0].split('#')[0],
                                  'arguments': arguments, 'source': relative, 'line': line_number,
                                  'hidden': '(' in declaration and kind != 'duplicate',
                                  'body': '', 'bodyStartLine': line_number}
                        if kind == 'duplicate':
                            match = re.fullmatch(r'duplicate\(([^)]+)\)', declaration, re.I)
                            if not match:
                                raise ValueError(f'Unreviewed duplicate: {relative}:{line_number}')
                            record['reference'] = match[1]
                        if record['name'] in definitions:
                            duplicate_names.add(record['name'])
                        definitions[record['name']] = record
                        if location != '-':
                            match = re.fullmatch(r'([^,\s]+),\s*(-?\d+),\s*(-?\d+),\s*-?\d+(?:,.*)?', location)
                            if not match:
                                raise ValueError(f'Unreviewed NPC placement: {relative}:{line_number}')
                            record.update(map=match[1].lower(), x=int(match[2]), y=int(match[3]))
                            placed.append(record)
                        if '{' in code:
                            current = record
                            current['_start'] = offset + code.index('{') + 1
            depth += code.count('{') - code.count('}')
            if current is not None and depth == 0:
                current['body'] = source[current.pop('_start'):offset + code.rindex('}')]
                current['endLine'] = line_number
                current = None
            offset += len(line)
        for match in re.finditer(r'\b(?:disablenpc|hidenpc|cloakonnpc|cloakoffnpc|cloakonnpcself|cloakoffnpcself|enablenpc|shownpc|npcmove|setnpcdisplay)\b', masked):
            tail = source[match.end():].lstrip().removeprefix('(').lstrip()
            argument = re.match(r'"(?:\\.|[^"\\])*"', tail)
            if argument and tail[argument.end():].lstrip().startswith((';', ',', ')')):
                unstable_names.add(string_value(argument[0]))
            else:
                unstable_sources.add(relative)
    for record in list(definitions.values()) + placed:
        record['conditional'] = record['name'] in unstable_names or record['source'] in unstable_sources

    def resolve(record, seen=None):
        seen = set() if seen is None else seen
        if record['kind'] != 'duplicate':
            return record
        name = record['reference']
        if name in seen or name not in definitions:
            return None
        return resolve(definitions[name], seen | {name})

    for record in placed:
        base = resolve(record)
        record['base'] = base
        record['effectiveKind'] = base['kind'] if base else 'unresolved'
        record['conditional'] = (record.get('conditional', record['source'] in unstable_sources) or bool(base and (base['conditional'] or base['hidden'])) or
                                 record['name'] in duplicate_names or len(record['name'].encode('utf-8')) > 50)
        sprite = record['arguments'].split(',', 1)[0].strip()
        record['visible'] = not record['hidden'] and sprite not in ('-1', '0', '139', '32767', 'JT_INVISIBLE', 'HIDDEN_WARP_NPC', 'FAKE_NPC')
    return definitions, placed


def connected_safe_arrival(map_name, x, y, cache, unsafe_cells, occupied):
    """Find a safe cell reachable from the target without crossing a wall.

    Match server diagonal movement: both orthogonal neighbours must be walkable.
    Targets on wall cells cannot establish a connected interaction/entrance area.
    """
    width, height, cells = cache[map_name]
    def walkable(cx, cy):
        return 0 <= cx < width and 0 <= cy < height and cells[cx + cy * width] in (0, 3, 6)
    if not walkable(x, y):
        return None
    mask = unsafe_cells.get(map_name)
    seen, queue = {(x, y)}, deque([(x, y)])
    while queue:
        cx, cy = queue.popleft()
        if (5 <= cx < width - 5 and 5 <= cy < height - 5 and
                (mask is None or not mask[cx + cy * width]) and (cx, cy) not in occupied):
            return cx, cy
        for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)):
            nx, ny = cx + dx, cy + dy
            if (nx, ny) in seen or max(abs(nx - x), abs(ny - y)) > 12 or not walkable(nx, ny):
                continue
            if dx and dy and (not walkable(cx + dx, cy) or not walkable(cx, cy + dy)):
                continue
            seen.add((nx, ny))
            queue.append((nx, ny))
    return None




def normalize_label(value):
    value = re.sub(r'\^[0-9a-fA-F]{6}|<[^>]*>', '', value)
    return re.sub(r'[\s\[\]【】（）()·・「」『』]', '', value).lower()


def facility_label(row):
    facility_words = r'店|公会|旅馆|酒店|锻造厂|酒馆|酒吧|港口|码头|大楼|入口|出口|城门|教堂|神殿|学院|学校|广场|博物馆|图书馆|机场|飞空艇|竞技场|练武场|城堡|宫殿|研究所|研究院|事务所|工厂|剧场|剧院|医院|旅店|商会'
    people_words = r'店员|工作人员|商人|服务人员|管理员|专家|助手|向导|传送人员'
    return row['kind'] == 'F_Navi' and re.search(facility_words, row['label']) and not re.search(people_words, row['label'])


def target_labels(npc, references, target_type='npc'):
    if target_type == 'entrance':
        return sorted({normalize_label(row['label']) for row in references if facility_label(row)})
    names = {normalize_label(npc['displayName'])}
    base = npc.get('base')
    if base:
        for match in re.finditer(r'\bmes\s+"(\[[^"\n]+\])"\s*;', base['body']):
            names.add(normalize_label(match[1]))
    labels = {normalize_label(row['label']) for row in references}
    return sorted(label for label in labels if any(len(label) >= 2 and len(name) >= 2 and
                  (label in name or name in label) for name in names))

def review_dialogue_target(entry, references, placements, maps, supported, flags, cache, unsafe_cells):
    if entry['kind'] == 'monster':
        return {'allowed': False, 'teleportAllowed': False, 'reason': 'not_coordinate'}
    # Viewing a known target is distinct from having permission or a safe cell to teleport.
    if entry['kind'] != 'coordinate' and entry.get('reason') not in ('map_forbidden', 'no_safe_candidate'):
        return {'allowed': False, 'teleportAllowed': False, 'reason': entry.get('reason', 'not_coordinate')}
    map_name, x, y = entry['mapName'], entry['x'], entry['y']
    nearby = [npc for npc in placements if npc.get('map') == map_name and
              max(abs(npc['x'] - x), abs(npc['y'] - y)) <= 2]
    # A guide points at a facility entrance, whereas a resource NPC link does not.
    facility = any(facility_label(row) for row in references)
    candidates = []
    rejected = []
    for npc in nearby:
        kind = npc['effectiveKind']
        if npc['conditional'] or npc['hidden']:
            rejected.append('target_conditional')
            continue
        if kind in ('warp', 'warp2'):
            if not facility:
                continue
            base = npc['base']
            parts = [part.strip() for part in base['arguments'].split(',')]
            if len(parts) < 5 or parts[2] not in maps or parts[2] not in supported or parts[2] in flags:
                rejected.append('entrance_destination_unavailable')
                continue
            if parts[2] not in cache or not INTEGER.fullmatch(parts[3]) or not INTEGER.fullmatch(parts[4]):
                rejected.append('entrance_destination_unavailable')
                continue
            dw, dh, dc = cache[parts[2]]
            tx, ty = int(parts[3]), int(parts[4])
            if tx <= 0 or ty <= 0 or tx >= dw or ty >= dh or dc[tx + ty * dw] not in (0, 3, 6):
                rejected.append('entrance_destination_unavailable')
                continue
            target_type = 'entrance'
        elif kind in ('script', 'shop', 'cashshop', 'itemshop', 'pointshop', 'marketshop', 'trader') and npc['visible']:
            if not target_labels(npc, references):
                rejected.append('target_identity_unconfirmed')
                continue
            target_type = 'npc'
        else:
            rejected.append('target_hidden_or_unresolved')
            continue
        candidates.append((abs(npc['x'] - x) + abs(npc['y'] - y), npc, target_type))
    if not candidates:
        return {'allowed': False, 'teleportAllowed': False, 'reason': sorted(rejected)[0] if rejected else 'target_missing'}
    candidates.sort(key=lambda row: (row[0], row[1]['name']))
    distance, npc, target_type = candidates[0]
    if len(candidates) > 1 and candidates[1][0] == distance:
        return {'allowed': False, 'teleportAllowed': False, 'reason': 'target_ambiguous'}
    occupied = {(row['x'], row['y']) for row in placements if row.get('map') == map_name}
    arrival = connected_safe_arrival(map_name, npc['x'], npc['y'], cache, unsafe_cells, occupied)
    if arrival is None:
        return {'allowed': False, 'teleportAllowed': False, 'reason': 'target_no_connected_arrival'}
    result = {'allowed': True, 'teleportAllowed': entry['kind'] == 'coordinate' and arrival is not None,
              'targetType': target_type, 'npcName': npc['name'],
              'labels': target_labels(npc, references, target_type),
              'evidence': {'source': npc['source'], 'line': npc['line'], 'x': npc['x'], 'y': npc['y']}}
    if arrival is not None:
        result.update(arrivalX=arrival[0], arrivalY=arrival[1])
    if not result['teleportAllowed']:
        result['teleportReason'] = entry.get('reason', 'target_no_connected_arrival')
    return result

def unsafe_touch_cells(areas, cache):
    """Match npc_setcells walkability, then the server's two-cell safety margin."""
    masks = {}
    for map_name, rectangles in areas.items():
        if map_name not in cache:
            continue
        width, height, cells = cache[map_name]
        mask = bytearray(width * height)
        for left, bottom, right, top in rectangles:
            for y in range(max(0, bottom), min(height - 1, top) + 1):
                # A wall does not get CELL_NPC. Expand contiguous walkable runs,
                # not the whole rectangle, so a wall-only trigger blocks nothing.
                run = None
                end = min(width - 1, right)
                for x in range(max(0, left), end + 2):
                    walkable = x <= end and cells[x + y * width] in (0, 3, 6)
                    if walkable and run is None:
                        run = x
                    if not walkable and run is not None:
                        start, stop = max(0, run - 2), min(width, x + 2)
                        for cy in range(max(0, y - 2), min(height - 1, y + 2) + 1):
                            mask[cy * width + start:cy * width + stop] = b'\1' * (stop - start)
                        run = None
        masks[map_name] = mask
    return masks


def classify(info, maps, supported, flags, cache, monsters, unsafe_cells):
    parts = normalize_info(info).split(',')
    first = parts[0]
    # Only the observed monster-search form can route into the monster catalogue.
    if len(parts) == 6 and parts[1:] == ['0', '0', '3', '-222', '1'] and first in monsters:
        return {'kind': 'monster', 'monsterId': monsters[first], 'monsterCode': first.upper()}
    row = {'kind': 'blocked'}
    if len(parts) < 3 or not INTEGER.fullmatch(parts[1]) or not INTEGER.fullmatch(parts[2]):
        reason = 'invalid_coordinate'
    else:
        x, y = int(parts[1]), int(parts[2])
        row.update(mapName=first, x=x, y=y)
        if first not in maps:
            reason = 'map_not_configured'
        elif first not in supported:
            reason = 'unsupported_map'
        elif first in flags:
            reason = 'map_forbidden'
        elif first not in cache:
            reason = 'map_cache_missing'
        else:
            width, height, cells = cache[first]
            if x >= width or y >= height or x > 65534 or y > 65534:
                reason = 'out_of_bounds'
            elif x == 0 and y == 0:
                reason = 'default_arrival_unreviewed'
            else:
                unsafe = unsafe_cells.get(first)
                candidates = any(cells[cx + cy * width] in (0, 3, 6) and
                                 (unsafe is None or not unsafe[cx + cy * width])
                                 for cy in range(max(5, y - 12), min(height - 5, y + 12) + 1)
                                 for cx in range(max(5, x - 12), min(width - 5, x + 12) + 1))
                if candidates:
                    return {'kind': 'coordinate', 'mapName': first, 'x': x, 'y': y}
                reason = 'no_safe_candidate'
    row.update(reason=reason, message=MESSAGES[reason])
    return row


class Review:
    def __init__(self, root):
        self.root = root
        self.server = root / 'repos/happyro-server'
        self.sources = {}

    def read(self, path):
        data = path.read_bytes()
        self.sources[path.relative_to(self.root).as_posix()] = hashlib.sha256(data).hexdigest()
        return data

    def conf(self, path, kind, seen=None):
        seen = set() if seen is None else seen
        if path in seen:
            return set()
        if not path.exists():
            raise ValueError(f'Missing imported configuration: {path}')
        seen.add(path)
        result = set()
        for key, value in re.findall(r'^\s*(\w+):\s*([^\r\n]+)', clean(self.read(path).decode()), re.M):
            value = value.strip()
            if key == kind:
                result.add(value)
            if key == 'import' or (key == 'npc' and value.endswith('.conf')):
                result |= self.conf(self.server / value, kind, seen)
        return result

    def validate_local_overrides(self):
        # Release inputs are committed templates. A local development override
        # must not silently masquerade as that reviewed baseline.
        for name in ('map_cache.dat', 'mob_db.yml'):
            local = self.server / 'db/import' / name
            baseline = self.server / 'db/import-tmpl' / name
            if local.exists() and local.read_bytes() != baseline.read_bytes():
                raise ValueError(f'Local db/import/{name} differs from the reviewed release baseline; review and update db/import-tmpl before generating or checking NAVI targets')

    def compile(self):
        self.validate_local_overrides()
        loaded = self.conf(self.server / 'npc/re/scripts_main.conf', 'npc')
        maps = self.conf(self.server / 'conf/maps_athena.conf', 'map')
        flags, rows, cache, monsters, scripts = set(), [], {}, {}, []
        # Hash every file in the scanned corpora: a newly added NAVI cannot evade check.
        for path in sorted((self.server / 'npc').rglob('*.txt')):
            source = self.read(path).decode('utf-8')
            relative = path.relative_to(self.server).as_posix()
            if relative not in loaded:
                continue
            scripts.append((relative, source))
            flags.update(re.findall(r'^([^\s,]+)\s+mapflag\s+nowarpto\b', clean(source), re.M))
            for row in script_links(source, relative):
                rows.append({'source': path.relative_to(self.root).as_posix(), **row})
        resources = self.root / 'localization/sources/kro-20211105/merged/files/lub'
        for path in sorted(resources.glob('*.json')):
            source = self.read(path).decode('utf-8')
            if '<navi>' not in source.lower():
                continue
            for location, text in json_strings(json.loads(source)):
                matches = list(TAG.finditer(text))
                if len(matches) != len(re.findall(r'<NAVI>', text, re.I)):
                    raise ValueError(f'Unclosed NAVI: {path}:{location}')
                for match in matches:
                    rows.append({'source': path.relative_to(self.root).as_posix(), 'location': location,
                                 'info': match[2], 'label': match[1], 'kind': 'resource'})
        for relative in ('db/map_cache.dat', 'db/re/map_cache.dat', 'db/import-tmpl/map_cache.dat'):
            path = self.server / relative
            if path.exists():
                cache.update(decode_cache(self.read(path)))
        supported_path = self.root / 'repos/happyro-client/src/DB/Map/SupportedMapTable.js'
        supported_source = self.read(supported_path).decode()
        supported = set(re.findall(r"'([^']+)'", supported_source.split('new Set([', 1)[1].split(']);', 1)[0]))
        for relative in ('db/re/mob_db.yml', 'db/import-tmpl/mob_db.yml'):
            path = self.server / relative
            if path.exists():
                text = self.read(path).decode()
                for block in re.split(r'(?m)^  - Id: ', text)[1:]:
                    match = re.search(r'^    AegisName:\s*(\S+)', block, re.M)
                    if match:
                        monsters[match[1].lower()] = int(block.splitlines()[0])
        for relative in ('src/map/happyro_navigation.cpp', 'src/map/happyro_navigation.hpp', 'src/map/map.cpp', 'src/map/map_channel.hpp',
                         'src/map/npc.cpp', 'src/map/npc.hpp', 'src/map/pc.cpp', 'src/map/path.cpp', 'src/common/mmo.hpp', 'db/map_index.txt'):
            self.read(self.server / relative)
        tool_source = self.read(self.root / 'tools/navi-review/review.py')
        if tool_source != Path(__file__).read_bytes():
            raise ValueError('Run the NAVI review tool from the target workspace; tool versions differ')
        unsafe_cells = unsafe_touch_cells(static_touch_areas(scripts), cache)
        _, placements = static_npcs(scripts)
        entries, references = {}, {}
        for row in rows:
            key = normalize_info(row['info'])
            entries[key] = classify(row['info'], maps, supported, flags, cache, monsters, unsafe_cells)
            row['key'] = key
            references.setdefault(key, []).append(row)
        for key, entry in entries.items():
            entry['dialogueTarget'] = review_dialogue_target(entry, references[key], placements,
                maps, supported, flags, cache, unsafe_cells)
        payload = {'schema': 1, 'accessPolicy': 'adventure-tools-server-rules', 'sources': dict(sorted(self.sources.items())), 'entries': dict(sorted(entries.items()))}
        payload['version'] = hashlib.sha256(serialize(payload).encode()).hexdigest()
        return payload, rows



def serialize(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n'


def usage(color=True):
    c = lambda code, text: f'\033[{code}m{text}\033[0m' if color else text
    print('\n' + c('1;36', 'HappyRO NAVI 提前审查清单'))
    print('\n' + c('1;33', '用法'))
    print('  python3 tools/navi-review/review.py ' + c('1;32', 'generate|check') + ' [--root PATH] [--output PATH] [--no-color]')
    print('\n' + c('1;33', '命令'))
    print('  ' + c('1;32', 'generate') + ' 生成审查清单与明细，不更新已发布客户端清单')
    print('  ' + c('1;32', 'check') + '    验证客户端清单与当前全部输入完全一致，过期时失败')
    print('\n' + c('1;33', '常用例子'))
    print('  ' + c('36', 'python3 tools/navi-review/review.py generate'))
    print('  ' + c('36', 'python3 tools/navi-review/review.py check --no-color') + '\n')


def main(argv=None):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', nargs='?', choices=('generate', 'check'))
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('-h', '--help', action='store_true')
    args = parser.parse_args(argv)
    if args.help or not args.command:
        usage(not args.no_color)
        return 0
    try:
        payload, rows = Review(args.root.resolve()).compile()
        if args.command == 'generate':
            output = args.output or args.root / 'work/navi-review/navi-targets.json'
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(serialize(payload), encoding='utf-8')
            output.with_name(output.stem + '-evidence.json').write_text(serialize(rows), encoding='utf-8')
            counts = {kind: sum(row['kind'] == kind for row in payload['entries'].values()) for kind in ('coordinate', 'monster', 'blocked')}
            print(f'Generated {len(payload["entries"])} NAVI targets from {len(rows)} references: {counts}')
            print(output)
        else:
            output = args.output or args.root / 'repos/happyro-client/src/DB/Navigation/NaviTargets.json'
            if not output.exists() or json.loads(output.read_text()) != payload:
                raise ValueError('NAVI review is stale or missing. Generate, review the changes, and replace the client manifest before building.')
            print(f'NAVI review verified: {len(payload["entries"])} targets, version {payload["version"]}')
        return 0
    except (ValueError, OSError, UnicodeError, struct.error, zlib.error) as error:
        print(f'NAVI review failed: {error}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
