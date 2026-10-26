#!/usr/bin/env python3
"""Prepare a macOS Go API launchd plist without loading or restarting services."""
import argparse
import os
from pathlib import Path
import plistlib
import sys


def prepare(workspace, binary, environment, output):
    workspace = workspace.resolve(strict=True)
    binary = binary.resolve(strict=True)
    environment = environment.resolve(strict=True)
    backend = workspace / 'repos/happyro-api'
    if not (backend / 'go.mod').is_file():
        raise ValueError('workspace does not contain the HappyRO API')
    if not binary.is_file() or not os.access(binary, os.X_OK):
        raise ValueError('binary must be an executable file')
    if not environment.is_file():
        raise ValueError('environment must be a file with Go configuration')
    logs = workspace / 'work/runtime/native/logs'
    logs.mkdir(parents=True, exist_ok=True)
    config = {
        'Label': 'local.happyro.api',
        'ProgramArguments': ['/bin/bash', '-c',
                             'set -e; set -a; source "$1"; set +a; exec "$2" serve',
                             'happyro-api', str(environment), str(binary)],
        'WorkingDirectory': str(backend),
        'RunAtLoad': True,
        'KeepAlive': True,
        'ThrottleInterval': 5,
        'StandardOutPath': str(logs / 'api.log'),
        'StandardErrorPath': str(logs / 'api-error.log'),
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation avoids silently replacing an installed service definition.
    with output.open('xb') as target:
        plistlib.dump(config, target)
    return output


def main(argv=None):
    args = list(sys.argv[1:] if argv is None else argv)
    plain = '--no-color' in args
    args = [value for value in args if value != '--no-color']
    if not args or args == ['--help'] or args == ['-h']:
        def color(code, value):
            return value if plain else f'\033[{code}m{value}\033[0m'
        print('\n' + color('1;36', 'HappyRO API launchd configuration') + '\n')
        print(color('1;33', 'Usage'))
        print('  ' + color('1;32', 'prepare --workspace PATH --binary PATH --environment PATH --output PATH') + ' [--no-color]\n')
        print(color('1;33', 'Example'))
        print('  ' + color('36', 'python3 tools/operations/native_api.py prepare --workspace . --binary work/runtime/native/bin/happyro-api --environment work/runtime/native/api.env --output work/runtime/native/launchd/local.happyro.api.go.plist') + '\n')
        return 0
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['prepare'])
    for flag in ['workspace', 'binary', 'environment', 'output']:
        parser.add_argument('--' + flag, type=Path, required=True)
    values = parser.parse_args(args)
    try:
        print(prepare(values.workspace, values.binary, values.environment, values.output))
    except (OSError, ValueError) as error:
        parser.exit(1, f'{error}\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
