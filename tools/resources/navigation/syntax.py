"""NAVI syntax rules; no filesystem or network access."""
from __future__ import annotations
import re

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
