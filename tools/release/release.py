#!/usr/bin/env python3
"""Create, inspect, publish and clean versioned release artifacts."""
from functools import partial
from pathlib import Path
import subprocess
import sys

if __package__ in (None, ''):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from tools.cli import Parser, arguments
from tools.deployment import progress
from tools.release import operations, resources, stages, status, workflow

ROOT = Path(__file__).resolve().parents[2]
# One command tree drives parsing, help and routing. Business rules live in modules.
COMMANDS = {
    'offline': {
        'create': ('Build all images and the complete offline package', workflow.create),
        'split': ('Split a registered complete ZIP', operations.split),
        'push': ('Push this version and latest; verify remote manifests', operations.push),
        'clean': ('Preview cleanup; --execute removes selected artifacts', operations.clean),
        'status': ('Inspect registration and files; --verify checks integrity', status.show),
    },
    'resources': {
        'create': ('Archive build inputs; --rebuild replaces prior output', resources.create),
        'clean': ('Preview deletion of the complete resource transfer', operations.clean),
        'status': ('Inspect transfer registration and files', status.show),
    },
    'stage': {
        name: (description, stages.execute) for name, description in (
            ('prepare', 'Prepare a registered version for staged building'),
            ('build', 'Build all images for the prepared version'),
            ('package', 'Assemble and verify the built version'))
    },
}


def parser(plain=False):
    factory = partial(Parser, no_color=plain)
    root = factory(description='HappyRO release tools', epilog='Examples:\n  python3 tools/release/release.py offline create --split\n  python3 tools/release/release.py resources create --rebuild\n\nUse --no-color at any level. No Docker Hub push unless explicitly requested.')
    groups = root.add_subparsers(dest='group', parser_class=factory)
    for group, commands in COMMANDS.items():
        node = groups.add_parser(group, help=f'{group} commands', epilog=f'Examples:\n  python3 tools/release/release.py {group} {next(iter(commands))} --help\n\n--no-color disables terminal colors.')
        actions = node.add_subparsers(dest='action', parser_class=factory)
        for action, (description, handler) in commands.items():
            example = f'python3 tools/release/release.py {group} {action}'
            if action != 'create':
                example += ' --version "$(cat deploy/docker/VERSION)"'
            command = actions.add_parser(action, help=description, description=description,
                                         epilog=f'Examples:\n  {example}\n\n--no-color disables terminal colors.')
            command.set_defaults(handler=handler)
            command.add_argument('--workspace', type=Path, default=ROOT, help='Source workspace (default: this repository)')
            command.add_argument('--version', required=action != 'create', help='Target version; create defaults to deploy/docker/VERSION')
            if action == 'create':
                command.add_argument('--rebuild', action='store_true', help='Validate inputs, then remove and rebuild prior output')
                if group == 'offline':
                    command.add_argument('--split', action='store_true', help='Also create split delivery ZIPs')
                    command.add_argument('--push', action='store_true', help='Explicitly push version and latest after packaging')
            if action == 'clean':
                command.add_argument('--execute', action='store_true', help='Perform deletion; otherwise preview only')
                if group == 'offline':
                    command.add_argument('--include-package', action='store_true', help='Also remove full/split ZIPs and reports')
            if action == 'status':
                command.add_argument('--verify', action='store_true', help='Read artifact content and verify checksums; may take time')
            if action == 'push':
                command.add_argument('--evidence', type=Path, help='New directory for remote verification evidence')
    return root


def main(argv=None):
    values, plain = arguments(list(sys.argv[1:] if argv is None else argv))
    args = parser(plain).parse_args(values)
    if not hasattr(args, 'handler'):
        args.help_parser.print_help()
        return
    progress.configure(no_color=plain)
    args.workspace = args.workspace.resolve(strict=True)
    return args.handler(args)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        progress.message(str(error), 'failed')
        sys.exit(1)
