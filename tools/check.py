#!/usr/bin/env python3
"""Run tools tests and CLI contracts without invoking a release or game scenario."""
import argparse
import ast
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def run(command, **kwargs):
    print('+ ' + ' '.join(map(str, command)), flush=True)
    subprocess.run(command, cwd=ROOT, check=True, **kwargs)


def contracts():
    commands = json.loads((ROOT / 'tools/commands.json').read_text())
    for entry in commands:
        file = ROOT / entry['path']
        if not file.is_file():
            raise ValueError(f'Missing registered tool: {file}')
        if file.suffix == '.py':
            command = [sys.executable, '-m', file.relative_to(ROOT).with_suffix('').as_posix().replace('/', '.')]
        else:
            command = ['bash' if file.suffix == '.sh' else 'node', str(file)]
        # Both colored and plain help must remain inert and runnable.
        for args in ([], ['--no-color']):
            result = subprocess.run(command + args, cwd=ROOT, capture_output=True, text=True, timeout=30)
            if result.returncode or not result.stdout.startswith('\n') or not result.stdout.endswith('\n\n'):
                raise ValueError(f'Invalid no-argument help: {entry["path"]}\n{result.stdout}\n{result.stderr}')
            if args and '\x1b[' in result.stdout:
                raise ValueError(f'--no-color ignored: {entry["path"]}')
    print(f'CLI contracts passed: {len(commands)} entries, colored and plain help', flush=True)


def main(argv=None):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', nargs='?', choices=['test', 'contracts'])
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('--help', '-h', action='store_true')
    args = parser.parse_args(argv)
    if not args.command or args.help:
        def color(code, text):
            return text if args.no_color else f'\033[{code}m{text}\033[0m'
        print('\n' + color('1;36', 'HappyRO tools verification') + '\n')
        print(color('1;33', 'Commands'))
        print(color('1;32', '  test | contracts'))
        print('\n' + color('1;33', 'Examples'))
        print(color('36', '  python3 tools/check.py test --no-color'))
        print('\nInstall tools/requirements.txt and run npm ci --prefix tools first.\n')
        return
    for file in (ROOT / 'tools').rglob('*.py'):
        if 'node_modules' not in file.parts:
            ast.parse(file.read_text(), filename=str(file))
    if args.command == 'test':
        # Resolve macOS /var symlinks once; path validation remains enabled.
        temporary = ROOT / 'work/tools-test-tmp'
        temporary.mkdir(parents=True, exist_ok=True)
        environment = {**os.environ, 'TMPDIR': str(temporary.resolve())}
        run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tools', '-t', '.', '-p', 'test_*.py'], env=environment)
        run([sys.executable, '-m', 'unittest', 'discover', '-s', 'repos/happyro-api/tools', '-p', 'test_*.py'], env=environment)
        node_tests = sorted(str(p.relative_to(ROOT)) for p in (ROOT / 'tools').rglob('*.test.mjs') if 'node_modules' not in p.parts)
        run(['node', '--test', *node_tests], env=environment)
        run(['node', 'tools/check-syntax.mjs', '--run'])
    contracts()


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        sys.exit(str(error))
