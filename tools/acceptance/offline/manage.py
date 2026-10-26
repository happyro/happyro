#!/usr/bin/env python3
"""Create and inspect isolated deployments from final offline ZIPs."""
from functools import partial
from pathlib import Path
import subprocess
import sys

if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from tools.acceptance.offline import checks, environment, inspection

from tools.deployment import progress
from tools.cli import Parser, arguments

ROOT = Path(__file__).resolve().parents[3]


def parser(plain=False):
    factory = partial(Parser, no_color=plain)
    result = factory(description='HappyRO offline acceptance', epilog='Examples:\n  python3 tools/acceptance/offline/manage.py list\n  python3 tools/acceptance/offline/manage.py start --version "$(cat deploy/docker/VERSION)" --batch smoke-1\n\n--no-color disables colors. Packaging does not start acceptance.')
    commands = result.add_subparsers(dest='command', parser_class=factory)
    descriptions = {
        'start': 'Extract and start a new isolated batch',
        'check': 'Check package, services, HTTP and Luo An login/movement',
        'stop': 'Stop this batch, retaining data and evidence',
        'clean': 'Preview deletion; --execute removes the entire batch and evidence',
        'list': 'List registered batches without contacting Docker',
        'status': 'Read recorded batch state and current container health',
    }
    for name, description in descriptions.items():
        example = f'python3 tools/acceptance/offline/manage.py {name}'
        if name != 'list':
            example += ' --version "$(cat deploy/docker/VERSION)" --batch smoke-1'
        command = commands.add_parser(name, help=description, description=description,
                                      epilog=f'Examples:\n  {example}\n\n--no-color disables colors.')
        command.add_argument('--workspace', type=Path, default=ROOT, help='Source workspace')
        command.add_argument('--version', required=name != 'list', help='Target version; list can filter by version')
        if name != 'list':
            command.add_argument('--batch', required=True, help='Acceptance batch name')
        if name == 'start':
            command.add_argument('--archive', type=Path, help='Complete ZIP; defaults to managed version ZIP')
            command.add_argument('--gateway-port', type=int, help='Loopback game port; otherwise chosen automatically')
            command.add_argument('--admin-port', type=int, help='Loopback admin port; otherwise chosen automatically')
        if name == 'check':
            command.add_argument('--health-timeout', type=int, default=300, help='Health wait seconds, 1–3600; browser has its own 300-second limit')
            command.add_argument('--browser-path', type=Path, help='Chromium executable; defaults to Chrome')
        if name == 'clean':
            command.add_argument('--execute', action='store_true', help='Delete data, reports, logs and registration')
    return result


def main(argv=None):
    values, plain = arguments(list(sys.argv[1:] if argv is None else argv))
    args = parser(plain).parse_args(values)
    if args.command is None:
        args.help_parser.print_help()
        return
    progress.configure(no_color=plain)
    if args.command == 'list':
        return inspection.list_batches(args)
    if args.command == 'status':
        return inspection.status(args)
    batch = environment.Batch(args.workspace, args.version, args.batch)
    if args.command == 'start':
        archive = args.archive or batch.workspace / 'artifacts/releases' / batch.version / f'happyro-{batch.version}.zip'
        environment.start(batch, archive, args.gateway_port, args.admin_port)
    elif args.command == 'check':
        if not 1 <= args.health_timeout <= 3600:
            raise ValueError('Health wait timeout must be between 1 and 3600 seconds')
        checks.check(batch, args.health_timeout, args.browser_path)
    elif args.command == 'stop':
        environment.stop(batch)
    else:
        environment.clean(batch, args.execute)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        progress.message(str(error), 'failed')
        sys.exit(1)
