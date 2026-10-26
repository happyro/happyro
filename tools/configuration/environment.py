#!/usr/bin/env python3
"""Validate environment consumers and publish the reviewed configuration registry."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
START = '<!-- environment-registry:start -->'
END = '<!-- environment-registry:end -->'


def load():
    return json.loads((ROOT / 'deploy/environment/registry.json').read_text())['fields']


def render(fields):
    labels = {'gateway': 'Gateway', 'map': '地图服', 'api': 'API', 'char': '角色服', 'deployment': '部署入口'}
    lines = [START, '## 配置清单（自动核对）', '',
             '来源：`deploy/environment/registry.json`。默认值为空的覆盖项保留现有配置；下表不是本机正在运行的配置。', '',
             '| 变量 | 所有者 | 类型／范围 | 默认值 | 配置模式 |', '| --- | --- | --- | --- | --- |']
    modes = {'client-default': '客户端偏好默认，可被玩家设置覆盖', 'override': '部署覆盖，页面不能修改', 'startup-apply': '启动应用，独立开关控制编辑', 'process': '进程配置', 'deployment': '部署输入'}
    for name, field in sorted(fields.items()):
        constraints = field['type']
        if 'allowed' in field:
            constraints += ' ' + ', '.join(map(str, field['allowed']))
        if 'minimum' in field or 'min' in field:
            constraints += f" [{field.get('minimum', field.get('min'))}, {field.get('maximum', field.get('max'))}]"
        default = field.get('default')
        if default is None:
            value = '留空保留已有配置' if field['mode'] in ('override', 'startup-apply') else '见用途／程序定义'
        elif field.get('sensitive'):
            value = '敏感；见初始化要求'
        else:
            value = '`' + json.dumps(default, ensure_ascii=False) + '`'
        lines.append(f"| `{name}` | {labels.get(field['owner'], field['owner'])} | {constraints} | {value} | {modes[field['mode']]} |")
    return '\n'.join(lines + ['', END])


def validate(fields):
    problems = []
    client = json.loads((ROOT / 'repos/happyro-client/src/Core/ClientDefaults.schema.json').read_text())['fields']
    for name, field in client.items():
        actual = fields.get(name, {})
        for key in ('type', 'default', 'path', 'min', 'max', 'integer', 'options'):
            if field.get(key) != actual.get(key):
                problems.append(f'Client schema drift: {name}.{key}')
    source = (ROOT / 'repos/happyro-server/src/map/battle.cpp').read_text()
    source = source[source.index('// Deployment overrides'):source.index('const char* battle_environment_override')]
    game = set()
    for match in re.finditer(r'\{ "([A-Z_]+)", "([a-z_]+)", &battle_config\.[a-z_]+, (\d+), (\d+|MAX_WALKPATH), (true|false) \}', source):
        name, key, minimum, maximum, boolean = match.groups()
        game.add(name)
        actual = fields.get(name, {})
        expected = {'key': key, 'minimum': int(minimum), 'maximum': 32 if maximum == 'MAX_WALKPATH' else int(maximum), 'type': 'boolean' if boolean == 'true' else 'integer'}
        for prop, value in expected.items():
            if actual.get(prop) != value:
                problems.append(f'Game schema drift: {name}.{prop}')
        default_source = actual.get('default_source')
        default_text = (ROOT / default_source).read_text() if default_source else ''
        pattern = (rf'\{{\s*"{key}",\s*&battle_config\.\w+,\s*(\d+)'
                   if default_source and default_source.endswith('.cpp')
                   else rf'^{key}:\s*(\w+)')
        default_match = re.search(pattern, default_text, re.M)
        raw_default = default_match.group(1) if default_match else None
        if raw_default in ('yes', 'true', 'on'):
            raw_default = '1'
        elif raw_default in ('no', 'false', 'off'):
            raw_default = '0'
        if raw_default is None or int(raw_default) != actual.get('default'):
            problems.append(f'Game factory default drift: {name}')
    api = (ROOT / 'repos/happyro-api/internal/config/config.go').read_text()
    for line in api.splitlines():
        match = re.search(r'^\s*\w+\s+(\S+)\s+`env:"([A-Z_]+)"(?: envDefault:"([^"]*)")?', line)
        if not match:
            continue
        kind, name, default = match.groups()
        for prefix in (['HAPPYRO_API_ADMIN_DB_', 'HAPPYRO_API_GAME_DB_'] if not name.startswith('HAPPYRO_') else ['']):
            key = prefix + name
            expected_type = {'bool': 'boolean', '*int64': 'integer', 'uint16': 'integer', '[]int': 'integer-list', '[]string': 'string-list', 'time.Duration': 'duration'}.get(kind, kind)
            if kind == 'bool' and default is not None:
                default = default == 'true'
            elif kind in ('uint16', '*int64') and default is not None:
                default = int(default)
            if fields.get(key, {}).get('type') != expected_type or fields.get(key, {}).get('default') != default:
                problems.append(f'API schema drift: {key}')
    compose = json.loads(subprocess.check_output(['docker', 'compose', '-f', str(ROOT / 'deploy/docker/compose.yml'), 'config', '--no-interpolate', '--format', 'json'], text=True))['services']
    for name in client:
        if name not in compose['gateway'].get('environment', {}):
            problems.append(f'Gateway mapping missing: {name}')
    for name in game:
        consumers = [service for service, config in compose.items() if name in config.get('environment', {})]
        if consumers != ['map']:
            problems.append(f'Game override must only reach map: {name}: {consumers}')
    for name in ['HAPPYRO_REGISTRATION_DEFAULT_GROUP_ID', 'HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE']:
        consumers = [service for service, config in compose.items() if name in config.get('environment', {})]
        if consumers != ['api']:
            problems.append(f'Registration setting must only reach api: {name}: {consumers}')
    example = (ROOT / 'deploy/docker/.env.example').read_text()
    template = set(re.findall(r'^([A-Z_]+)=', example, re.M))
    for name in template:
        if name not in fields:
            problems.append(f'Unregistered deployment input: {name}')
    for name in set(client) | game:
        if name not in template:
            problems.append(f'Deployment input missing: {name}')
    gateway = json.loads(subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require('./repos/happyro-gateway/environment').definitions))"], cwd=ROOT, text=True))
    for name, expected in gateway.items():
        for prop, value in expected.items():
            if fields.get(name, {}).get(prop) != value:
                problems.append(f'Gateway schema drift: {name}.{prop}')
    return problems


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('action', nargs='?', choices=('check', 'sync'))
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('--help', action='store_true')
    args = parser.parse_args()
    if args.help or not args.action:
        def color(code, value):
            return value if args.no_color else f'\033[{code}m{value}\033[0m'
        print('\n' + color('1;36', 'HappyRO environment registry') + '\n\n' + color('1;33', 'Commands') + '\n  ' + color('1;32', 'check | sync') + '\n\n' + color('1;33', 'Examples') + '\n  ' + color('36', 'python3 tools/configuration/environment.py check --no-color') + '\n  ' + color('36', 'python3 tools/configuration/environment.py sync') + '\n')
        return 0
    fields = load()
    problems = validate(fields)
    page = ROOT / 'repos/happyro-doc/docs/deploy/environment-variables.md'
    text = page.read_text()
    block = render(fields)
    if args.action == 'sync' and not problems:
        if START in text:
            text = text[:text.index(START)] + block + text[text.index(END) + len(END):]
        else:
            text = text.rstrip() + '\n\n' + block + '\n'
        page.write_text(text)
    elif START not in text or text[text.index(START):text.index(END) + len(END)] != block:
        problems.append('Documentation registry differs; run sync')
    for problem in problems:
        print(problem, file=sys.stderr)
    if problems:
        return 1
    print(f'Validated {len(fields)} environment definitions and deployment ownership')
    return 0


if __name__ == '__main__':
    sys.exit(main())
