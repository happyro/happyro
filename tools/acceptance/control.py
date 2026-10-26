#!/usr/bin/env python3
"""Execute one reviewed scenario against an explicitly selected local browser session."""
import argparse
import json
from pathlib import Path
import sys
import urllib.error
import urllib.request


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    plain = '--no-color' in argv
    argv = [arg for arg in argv if arg != '--no-color']
    if not argv or argv in (['--help'], ['-h']):
        paint = lambda code, text: text if plain else f'\033[{code}m{text}\033[0m'
        print('\n' + paint('1;36', 'HappyRO browser scenario controller') + '\n')
        print(paint('1;33', 'Usage'))
        print(paint('1;32', '  --run FILE --port PORT [--timeout SECONDS] [--no-color]'))
        print('\n' + paint('1;33', 'Example'))
        print(paint('36', '  python3 tools/acceptance/control.py --run tools/acceptance/skills/scenarios/init.js --port 9341') + '\n')
        return 0
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--run', type=Path, required=True, metavar='FILE')
    parser.add_argument('--port', type=int, required=True)
    parser.add_argument('--timeout', type=float, default=2400)
    args = parser.parse_args(argv)
    if not 1024 < args.port <= 65535 or args.timeout <= 0:
        parser.error('port must be 1025..65535 and timeout must be positive')
    request = urllib.request.Request(f'http://127.0.0.1:{args.port}',
        data=json.dumps({'code': args.run.read_text()}).encode(), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
            payload = json.load(response)
        if not payload.get('ok'):
            raise ValueError(payload.get('error', 'Scenario failed'))
        print(json.dumps(payload, ensure_ascii=False))
        return 0
    except urllib.error.HTTPError as error:
        print(error.read().decode(), file=sys.stderr)
        return 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError) as error:
        sys.exit(str(error))
