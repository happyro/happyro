#!/usr/bin/env python3
"""Audit canonical TIPBOX content and publish a deterministic client help catalog."""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path('localization/sources/kro-20211105/merged/files/lub/tipbox.json')
RUNTIME = Path('repos/happyro-client/src/DB/Help/TipBox.json')
TAG = re.compile(r'<TIPBOX>(.*?)<INFO>(.*?)</INFO></TIPBOX>', re.I | re.S)
OPEN = re.compile(r'<TIPBOX(?:\s[^>]*)?>', re.I)
CLOSE = re.compile(r'</TIPBOX\s*>', re.I)
INTEGER = re.compile(r'[1-9][0-9]*\Z')
STRING = re.compile(r'"((?:\\.|[^"\\])*)"')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def strings(value, pointer=''):
    if isinstance(value, str):
        yield pointer, value
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from strings(child, f'{pointer}/{index}')
    elif isinstance(value, dict):
        for key, child in value.items():
            escaped = str(key).replace('~', '~0').replace('/', '~1')
            yield from strings(child, f'{pointer}/{escaped}')


def compile_catalog(source, source_path=str(SOURCE), source_hash=''):
    entries, rejected = {}, []
    for key, value in sorted(source.items(), key=lambda pair: (not pair[0].isdigit(), int(pair[0]) if pair[0].isdigit() else pair[0])):
        title = value.get('Title', '').split('#', 1)[0].strip() if isinstance(value, dict) else ''
        pages = [page for page in value.get('Page', []) if isinstance(page, str) and page.strip()] if isinstance(value, dict) and isinstance(value.get('Page'), list) else []
        if not INTEGER.fullmatch(key) or not title or not pages:
            rejected.append({'id': key, 'reason': 'invalid_id' if not INTEGER.fullmatch(key) else 'empty_title' if not title else 'empty_pages'})
            continue
        image = value.get('Image', '')
        layout = value.get('Imgcoord', {})
        entries[key] = {'title': title, 'pages': pages, 'image': image if isinstance(image, str) else '',
                        'imageLayout': {'size': layout.get('Size', 100), 'position': layout.get('Position', 5)}}
    return {'schema': 1, 'source': {'path': source_path, 'sha256': source_hash}, 'entries': entries}, rejected


def scan_text(text, location, entries):
    refs, malformed = [], []
    matches = list(TAG.finditer(text))
    for match in matches:
        label, info = match[1], match[2].strip()
        nested = bool(OPEN.search(label))
        status = 'nested_markup' if nested else 'invalid_id' if not INTEGER.fullmatch(info) else 'missing_target' if info not in entries else 'available'
        refs.append({**location, 'offset': match.start(), 'label': label, 'info': info, 'status': status})
    for match in OPEN.finditer(text):
        if not any(start.start() == match.start() for start in matches):
            malformed.append({**location, 'offset': match.start(), 'reason': 'unmatched_open', 'excerpt': text[match.start():match.start() + 200]})
    for match in CLOSE.finditer(text):
        if not any(full.end() == match.end() for full in matches):
            malformed.append({**location, 'offset': match.start(), 'reason': 'unmatched_close', 'excerpt': text[max(0, match.start() - 100):match.end()]})
    return refs, malformed


def clean_script(source):
    return re.sub(r'"(?:\\.|[^"\\])*"|//[^\n]*|/\*[\s\S]*?\*/',
                  lambda match: match[0] if match[0].startswith('"') else re.sub(r'[^\n]', ' ', match[0]), source)


def scan_file(job, root, entries):
    path, category = job
    text = path.read_text(encoding='utf-8', errors='strict')
    if not re.search(r'TIPBOX', text, re.I):
        return None
    rel = path.relative_to(root).as_posix()
    locations = []
    if path.suffix == '.json':
        locations = [(dict(path=rel, category=category, pointer=pointer), value) for pointer, value in strings(json.loads(text)) if 'tipbox' in value.lower()]
    elif category == 'server_npc':
        clean = clean_script(text)
        locations = [(dict(path=rel, category=category, line=clean.count('\n', 0, match.start()) + 1), match[1]) for match in STRING.finditer(clean) if 'tipbox' in match[1].lower()]
    elif path.suffix == '.html':
        locations = [(dict(path=rel, category=category, line=1), text)]
    else:
        # JS is executable renderer code, not a second catalog. Count literal complete content only;
        # parser regexes and HTML construction fragments are not user-visible references.
        locations = [(dict(path=rel, category=category, line=text.count('\n', 0, match.start()) + 1), match[0]) for match in TAG.finditer(text)]
    refs, malformed = [], []
    for location, value in locations:
        found, broken = scan_text(value, location, entries)
        refs.extend(found)
        malformed.extend(broken)
    return {'path': rel, 'sha256': digest(path), 'references': refs, 'malformed': malformed} if refs or malformed else None


def graph_cycles(graph):
    """Return strongly connected components; navigation back-links are valid, not failures."""
    index, indices, low, stack, inside, result = 0, {}, {}, [], set(), []
    def visit(node):
        nonlocal index
        indices[node] = low[node] = index
        index += 1
        stack.append(node)
        inside.add(node)
        for target in sorted(graph.get(node, [])):
            if target not in indices:
                visit(target)
                low[node] = min(low[node], low[target])
            elif target in inside:
                low[node] = min(low[node], indices[target])
        if low[node] == indices[node]:
            component = []
            while True:
                target = stack.pop()
                inside.remove(target)
                component.append(target)
                if target == node:
                    break
            if len(component) > 1 or node in graph.get(node, set()):
                result.append(sorted(component, key=int))
    for node in sorted(graph, key=int):
        if node not in indices:
            visit(node)
    return sorted(result, key=lambda group: (-len(group), group))


def audit(root, workers=8):
    source_path = root / SOURCE
    raw = json.loads(source_path.read_text())
    catalog, rejected = compile_catalog(raw, str(SOURCE), digest(source_path))
    entries = catalog['entries']
    jobs = []
    for path in sorted((root / 'localization/sources/kro-20211105/merged/files').rglob('*.json')):
        category = 'help_pages' if path == source_path else 'items' if path.name == 'itemInfo_true.json' else 'localized_other'
        jobs.append((path, category))
    jobs.extend((path, 'server_npc') for path in sorted((root / 'repos/happyro-server/npc').rglob('*.txt')))
    jobs.extend((path, 'client_content') for path in sorted((root / 'repos/happyro-client/src').rglob('*')) if path.is_file() and path.suffix in {'.json', '.js', '.html'} and path != root / RUNTIME)
    with ThreadPoolExecutor(max_workers=workers) as pool:
        files = [value for value in pool.map(lambda job: scan_file(job, root, entries), jobs) if value]
    refs = [ref for file in files for ref in file['references']]
    malformed = [ref for file in files for ref in file['malformed']]
    graph = defaultdict(set)
    for ref in refs:
        if ref['category'] == 'help_pages' and ref['status'] == 'available':
            graph[ref['pointer'].split('/')[1]].add(ref['info'])
    cycles = graph_cycles(graph)
    incoming = {ref['info'] for ref in refs if ref['status'] == 'available'}
    by_category = {}
    for category in sorted({ref['category'] for ref in refs} | {ref['category'] for ref in malformed}):
        selected = [ref for ref in refs if ref['category'] == category]
        owners = {(ref['path'], ref.get('pointer', '').split('/')[2] if category == 'items' else ref.get('pointer', '').split('/')[1] if category == 'help_pages' else ref.get('line')) for ref in selected}
        by_category[category] = {'occurrences': len(selected), 'uniqueTargets': len({ref['info'] for ref in selected}),
                                 'owners': len(owners), 'statuses': dict(Counter(ref['status'] for ref in selected)),
                                 'malformed': sum(ref['category'] == category for ref in malformed)}
    counts = {'sourceEntries': len(raw), 'availableEntries': len(entries), 'rejectedEntries': len(rejected),
              'pages': sum(len(entry['pages']) for entry in entries.values()), 'entriesWithImages': sum(bool(entry['image']) for entry in entries.values()),
              'referenceOccurrences': len(refs), 'uniqueReferencedIds': len({ref['info'] for ref in refs}),
              'availableReferences': sum(ref['status'] == 'available' for ref in refs),
              'statuses': dict(Counter(ref['status'] for ref in refs)), 'malformed': len(malformed),
              'unreferencedEntries': len(set(entries) - incoming), 'cyclicComponents': len(cycles),
              'selfLinks': sum(node in targets for node, targets in graph.items()), 'filesScanned': len(jobs)}
    report = {'schema': 1, 'catalogSource': catalog['source'], 'scope': 'Canonical merged localization JSON; all server NPC TXT source strings (including nonloaded scripts); client production JSON/HTML and literal complete JS tags. Runtime/official/generated copies and tests excluded to avoid duplicate counting. Counts are source references, not live NPC instances.',
              'counts': counts, 'byCategory': by_category, 'rejectedEntries': rejected,
              'missingTargets': sorted({ref['info'] for ref in refs if ref['status'] == 'missing_target'}, key=int),
              'unreferencedEntries': sorted(set(entries) - incoming, key=int), 'cycles': cycles,
              'sources': [{k: file[k] for k in ('path', 'sha256')} for file in files], 'references': refs, 'malformed': malformed}
    return catalog, report


def encode(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def report_markdown(report):
    counts = report['counts']
    lines = ['# TIPBOX 全量内容审查', '', report['scope'], '', '## 汇总', '']
    lines.extend(f'- {key}: {value}' for key, value in counts.items())
    lines += ['', '## 来源分类', '', '| 分类 | 引用次数 | 独立目标 | 内容所属项 | 状态 |', '| --- | ---: | ---: | ---: | --- |']
    lines += [f"| {category} | {value['occurrences']} | {value['uniqueTargets']} | {value['owners']} | {value['statuses']} |" for category, value in report['byCategory'].items()]
    lines += ['', '## 处理规则', '', '- 目标为现有非空帮助条目时允许点击。', '- INFO 非正整数、目标缺失或条目为空时只保留文案，不暴露标签和编号。', '- 帮助目录和“返回目录”等链接会形成环；这是正常阅读导航，不递归展开全部条目。', '- 无入链条目仍保留，可被后续内容或直接入口访问。', '', '## 缺失目标', '', ', '.join(report['missingTargets']) or '无', '', '## 证据', '', '逐条引用、JSON pointer／脚本行号、异常、环和源哈希见 audit.json。', '']
    return '\n'.join(lines)


def help_text(color):
    def paint(code, value):
        return f'\x1b[{code}m{value}\x1b[0m' if color else value
    return '\n' + paint('1;36', 'HappyRO TIPBOX 审查与数据生成') + '\n\n' + paint('1;33', '用法') + '\n  python3 tools/tipbox-review/review.py ' + paint('1;32', 'generate|check') + ' [--publish] [--workers 8] [--no-color]\n\n' + paint('1;33', '命令') + '\n  ' + paint('1;32', 'generate') + '  审查全部来源并写入 work/tipbox-review；--publish 同步客户端目录\n  ' + paint('1;32', 'check') + '     重算数据并验证客户端目录与源数据一致\n\n' + paint('1;33', '常用例子') + '\n  ' + paint('36', 'python3 tools/tipbox-review/review.py generate --publish --workers 8') + '\n  ' + paint('36', 'python3 tools/tipbox-review/review.py check --no-color') + '\n\n'


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if not argv or '--help' in argv or '-h' in argv or argv == ['--no-color']:
        print(help_text('--no-color' not in argv), end='')
        return 0
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=('generate', 'check'))
    parser.add_argument('--publish', action='store_true')
    parser.add_argument('--workers', type=int, default=8)
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('--workspace', type=Path, default=ROOT)
    parser.add_argument('--output', type=Path, default=ROOT / 'work/tipbox-review')
    args = parser.parse_args(argv)
    if not 1 <= args.workers <= 32:
        parser.error('--workers must be between 1 and 32')
    if args.publish and args.command != 'generate':
        parser.error('--publish is only valid with generate')
    catalog, report = audit(args.workspace.resolve(), args.workers)
    encoded = encode(catalog)
    if args.command == 'check':
        path = args.workspace / RUNTIME
        if not path.is_file() or path.read_text() != encoded:
            print('TIPBOX catalog differs from canonical source; run generate --publish after reviewing changes.', file=sys.stderr)
            return 1
    else:
        args.output.mkdir(parents=True, exist_ok=True)
        (args.output / 'TipBox.json').write_text(encoded)
        (args.output / 'audit.json').write_text(encode(report))
        (args.output / 'report.md').write_text(report_markdown(report))
        if args.publish:
            path = args.workspace / RUNTIME
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(encoded)
    print(json.dumps({'command': args.command, **report['counts'], 'byCategory': report['byCategory']}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
