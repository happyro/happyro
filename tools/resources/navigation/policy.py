"""NAVI policy rules; no filesystem or network access."""
from __future__ import annotations
import re
from .syntax import clean, string_value, normalize_info, INTEGER, MESSAGES, STRING
from .terrain import connected_safe_arrival

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
