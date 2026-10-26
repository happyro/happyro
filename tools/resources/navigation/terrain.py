"""NAVI terrain rules; no filesystem or network access."""
from __future__ import annotations
from collections import deque
import struct
import zlib
import re
from .syntax import clean, STRING

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
