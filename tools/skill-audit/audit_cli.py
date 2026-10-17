"""Shared help for persisted diagnostic commands; no-argument calls are inert."""
import sys
from pathlib import Path


def require_audit_command(filename):
    color = '--no-color' not in sys.argv
    sys.argv[:] = [arg for arg in sys.argv if arg != '--no-color']
    args = sys.argv[1:]
    if not args or '--help' in args or '-h' in args:
        def paint(code, value):
            return f'\033[{code}m{value}\033[0m' if color else value
        name = 'tools/skill-audit/' + Path(filename).name
        print(f"\n{paint('1;36', 'HappyRO skill audit')}\n"
              f"{paint('1;33', 'Usage')}\n  python3 {name} {paint('1;32', '--run')} [arguments] [--no-color]\n"
              f"{paint('1;33', 'Example')}\n  {paint('36', f'python3 {name} --help --no-color')}\n"
              '\nRead tools/skill-audit/README.md and script prerequisites before running.\n')
        raise SystemExit(0)
    if '--run' not in args:
        raise SystemExit('Explicit --run required; use --help')
    sys.argv.remove('--run')
