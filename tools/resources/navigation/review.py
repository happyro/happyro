#!/usr/bin/env python3
"""Compile an offline NAVI decision table; no network or runtime preflight."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import struct
import zlib

if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from tools.resources.navigation.syntax import TAG, clean, normalize_info, script_links, json_strings
from tools.resources.navigation.terrain import decode_cache, static_touch_areas, unsafe_touch_cells
from tools.resources.navigation.policy import static_npcs, classify, review_dialogue_target

ROOT = Path(__file__).resolve().parents[3]






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
        for name in ('review.py', 'syntax.py', 'terrain.py', 'policy.py'):
            tool_source = self.read(self.root / 'tools/resources/navigation' / name)
            if tool_source != Path(__file__).with_name(name).read_bytes():
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
    print('  python3 tools/resources/navigation/review.py ' + c('1;32', 'generate|check') + ' [--root PATH] [--output PATH] [--no-color]')
    print('\n' + c('1;33', '命令'))
    print('  ' + c('1;32', 'generate') + ' 生成审查清单与明细，不更新已发布客户端清单')
    print('  ' + c('1;32', 'check') + '    验证客户端清单与当前全部输入完全一致，过期时失败')
    print('\n' + c('1;33', '常用例子'))
    print('  ' + c('36', 'python3 tools/resources/navigation/review.py generate'))
    print('  ' + c('36', 'python3 tools/resources/navigation/review.py check --no-color') + '\n')


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
