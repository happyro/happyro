"""Shared argparse presentation for source-side tools, with inert group help."""
import argparse


class Parser(argparse.ArgumentParser):
    def __init__(self, *args, no_color=False, **kwargs):
        self.no_color = no_color
        kwargs.setdefault('allow_abbrev', False)
        kwargs.setdefault('formatter_class', argparse.RawDescriptionHelpFormatter)
        super().__init__(*args, **kwargs)
        self.set_defaults(help_parser=self)

    def format_help(self):
        lines = super().format_help().strip().splitlines()
        def paint(code, value):
            return value if self.no_color else f'\033[{code}m{value}\033[0m'
        commands = {name for action in self._actions if isinstance(action, argparse._SubParsersAction)
                    for name in action.choices}
        result = []
        for index, line in enumerate(lines):
            code = '36'
            if index == 0:
                code = '1;36'
            elif line and not line.startswith(' '):
                code = '1;33'
            elif line.lstrip().startswith(('--', '-h', '{')) or (line.split() and line.split()[0] in commands):
                code = '1;32'
            result.append(paint(code, line) if line else '')
        return '\n' + '\n'.join(result) + '\n\n'


def arguments(argv):
    """Allow --no-color at every nesting level without argparse overrides."""
    return [value for value in argv if value != '--no-color'], '--no-color' in argv
