"""Run a reviewed browser scenario in the local audit session."""
import argparse
import json
from pathlib import Path
import sys
import urllib.request
import urllib.error

if len(sys.argv) == 1 or '--help' in sys.argv or '-h' in sys.argv:
    def p(code, text):
        return text if '--no-color' in sys.argv else f'\033[{code}m{text}\033[0m'
    print('\n' + p('1;36', 'HappyRO job-change browser scenario'))
    print(p('1;33', 'Usage'))
    print('  python3 tools/job-change-audit/control.py ' + p('1;32', '--run') + ' FILE [--port 9351] [--no-color]')
    print(p('1;33', 'Example'))
    print(p('36', '  python3 tools/job-change-audit/control.py --run work/job-change-audit/scenario.js'))
    print('\nOnly run reviewed scenarios against dedicated audit characters.\n')
    sys.exit(0)
parser = argparse.ArgumentParser()
parser.add_argument('--run', action='store_true', required=True)
parser.add_argument('--no-color', action='store_true')
parser.add_argument('--port', type=int, default=9351)
parser.add_argument('file', type=Path)
args = parser.parse_args()
req = urllib.request.Request(f'http://127.0.0.1:{args.port}', data=json.dumps({'code': args.file.read_text()}).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=2400) as response:
        print(response.read().decode())
except urllib.error.HTTPError as error:
    print(error.read().decode())
    sys.exit(1)
