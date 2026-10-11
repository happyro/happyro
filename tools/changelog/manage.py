#!/usr/bin/env python3
"""Validate root changelogs and synchronize their documentation-site copies."""
import argparse
from collections import defaultdict
from datetime import date
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ('新增', '优化', '修复', '移除', '部署与维护', '验证与待办')
SCOPES = ('root', 'client', 'server', 'admin', 'gateway')
SCOPE = re.compile(r'^- `\[([a-z]+(?:/[a-z]+)*)\]` \S')
NAV = re.compile(r'const changelog = \[.*?\n\](?=\n\nexport default)', re.S)


def sources(root):
    base = root / 'changelog'
    return sorted(base.glob('20*/*/*.md')) + sorted((base / 'releases').glob('*.md'))


def navigation(root):
    base = root / 'changelog'
    releases = sorted((base / 'releases').glob('*.md'),
                      key=lambda p: tuple(map(int, p.stem[1:].split('.'))), reverse=True)
    lines = ['const changelog = [', '  {', "    text: '版本摘要',", '    items: [']
    for p in releases:
        title = p.read_text().splitlines()[0].removeprefix('# ')
        if not re.fullmatch(r'v\d+\.\d+\.\d+(?: · 未发布)?', title):
            raise ValueError(f'{p}: invalid release title')
        lines.append(f"      {{ text: '{title}', link: '/changelog/releases/{p.stem}' }},")
    lines += ['    ],', '  },']
    months = defaultdict(list)
    for p in sorted(base.glob('20*/*/*.md'), reverse=True):
        months[p.stem[:7]].append(p)
    for month, files in months.items():
        lines += ['  {', f"    text: '{month}',", '    collapsed: true,', '    items: [']
        for p in files:
            link = p.relative_to(base).with_suffix('').as_posix()
            lines.append(f"      {{ text: '{p.stem}', link: '/changelog/{link}' }},")
        lines += ['    ],', '  },']
    return '\n'.join(lines + [']'])


def source_errors(root):
    errors = []
    base = root / 'changelog'
    paths = sources(root)
    readme = (base / 'README.md').read_text()
    for p in paths:
        rel = p.relative_to(base)
        text = p.read_text()
        lines = text.splitlines()
        def fail(message):
            errors.append(f'{rel}: {message}')
        if f']({rel.as_posix()})' not in readme:
            fail('missing README index link')
        if not lines or not lines[0].startswith('# '):
            fail('missing page title')
        if rel.parts[0] == 'releases':
            # Published release bodies are historical source material, not daily logs.
            continue
        try:
            date.fromisoformat(p.stem)
            if rel.as_posix() != f'{p.stem[:4]}/{p.stem[5:7]}/{p.stem}.md':
                fail('date path does not match filename')
        except ValueError:
            fail('invalid date')
        if not lines or lines[0] != '# ' + p.stem:
            fail('title must match date')
        if not text.endswith('\n') or text.endswith('\n\n') or '\n\n\n' in text:
            fail('use one blank line between blocks and one final newline')
        headings = [line[3:] for line in lines if line.startswith('## ')]
        if not headings or any(h not in SECTIONS for h in headings):
            fail('use the documented Chinese section names')
        elif headings != sorted(set(headings), key=SECTIONS.index):
            fail('sections must be unique and in the documented order')
        current = None
        section_items = defaultdict(int)
        for i, line in enumerate(lines):
            if line.rstrip() != line:
                fail(f'line {i+1}: trailing whitespace')
            if line.startswith('#') and i and lines[i-1]:
                fail(f'line {i+1}: heading needs a preceding blank line')
            if line.startswith('#') and i+1 < len(lines) and lines[i+1]:
                fail(f'line {i+1}: heading needs a following blank line')
            if line.startswith('## '):
                current = line[3:]
            if line.startswith('- '):
                match = SCOPE.match(line)
                if not match:
                    fail(f'line {i+1}: missing canonical repository scope')
                else:
                    names = match[1].split('/')
                    if names != [s for s in SCOPES if s in names]:
                        fail(f'line {i+1}: invalid, duplicate or unordered scope')
                if current is None:
                    fail(f'line {i+1}: entry outside a section')
                section_items[current] += 1
                if i and lines[i-1] and not lines[i-1].startswith('- '):
                    fail(f'line {i+1}: list needs a preceding blank line')
                if i >= 2 and not lines[i-1] and lines[i-2].startswith('- '):
                    fail(f'line {i+1}: consecutive entries must form a compact list')
        for heading in headings:
            if not section_items[heading]:
                fail(f'empty section: {heading}')
    return errors


def mirror_errors(root):
    errors = []
    base = root / 'changelog'
    target = root / 'repos/happyro-doc/docs/changelog'
    expected = {p.relative_to(base) for p in sources(root)}
    actual = {p.relative_to(target) for p in target.rglob('*.md')}
    for rel in sorted(expected):
        p = target / rel
        if not p.is_file() or p.read_bytes() != (base / rel).read_bytes():
            errors.append(f'doc/{rel}: missing or differs from root')
    for rel in sorted(actual - expected):
        errors.append(f'doc/{rel}: unexpected page (archives stay in root only)')
    config = root / 'repos/happyro-doc/docs/.vitepress/config.js'
    match = NAV.search(config.read_text())
    if not match or match[0] != navigation(root):
        errors.append('doc sidebar: missing, stale or inconsistent changelog navigation')
    return errors


def sync(root):
    errors = source_errors(root)
    if errors:
        raise ValueError('\n'.join(errors))
    config = root / 'repos/happyro-doc/docs/.vitepress/config.js'
    text = config.read_text()
    if len(NAV.findall(text)) != 1:
        raise ValueError('Expected exactly one changelog navigation block; nothing written')
    updated = NAV.sub(lambda _: navigation(root), text)
    base = root / 'changelog'
    target = root / 'repos/happyro-doc/docs/changelog'
    expected = {p.relative_to(base) for p in sources(root)}
    extras = {p.relative_to(target) for p in target.rglob('*.md')} - expected
    if extras:
        raise ValueError(f'Unexpected doc pages; resolve explicitly before sync: {sorted(map(str, extras))}')
    changed = 0
    for p in sources(root):
        dest = target / p.relative_to(base)
        data = p.read_bytes()
        if not dest.exists() or dest.read_bytes() != data:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            changed += 1
    if updated != text:
        config.write_text(updated)
        changed += 1
    return changed


def help_text(color):
    def paint(code, text):
        return f'\033[{code}m{text}\033[0m' if color else text
    return '\n' + '\n'.join([
        paint('1;36', 'HappyRO changelog 检查与同步'), '',
        paint('1;33', '用法'),
        '  python3 tools/changelog/manage.py [--no-color] <check|sync>', '',
        paint('1;33', '命令'),
        '  ' + paint('1;32', 'check') + '  只读检查格式、根/doc 正文一致性及索引',
        '  ' + paint('1;32', 'sync') + '   验证根日志后同步正文与文档站侧栏', '',
        paint('1;33', '常用例子'),
        paint('36', '  python3 tools/changelog/manage.py check'),
        paint('36', '  python3 tools/changelog/manage.py sync'),
        paint('36', '  python3 tools/changelog/manage.py --no-color check'), '',
        '无参数或 --help 仅显示帮助；--no-color 禁用 ANSI 高亮。',
    ]) + '\n\n'


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', nargs='?', choices=['check', 'sync'])
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('--help', '-h', action='store_true')
    args = parser.parse_args(argv)
    if args.help or args.command is None:
        print(help_text(not args.no_color), end='')
        return 0
    try:
        if args.command == 'sync':
            print(f'Synchronized {sync(ROOT)} files.')
        errors = source_errors(ROOT) + mirror_errors(ROOT)
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'PASS: {len(sources(ROOT))} pages; format, indexes and root/doc copies agree.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
