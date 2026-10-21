#!/usr/bin/env python3
"""Generate all character appearance catalogs from the shared reviewed source."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path('config/character-appearance.json')
TARGETS = {
    'server': Path('repos/happyro-server/src/common/character_appearance_data.hpp'),
    'client': Path('repos/happyro-client/src/DB/Jobs/CharacterAppearanceTable.generated.js'),
    'admin': Path('repos/happyro-api/internal/catalog/appearance.go'),
}
SEX = {'any': -1, 'female': 0, 'male': 1}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def integer(value, low, high):
    return type(value) is int and low <= value <= high


def keys(value, required, optional=()):
    require(isinstance(value, dict), 'Expected an object')
    require(set(required) <= value.keys() <= set(required) | set(optional),
            f'Invalid fields: expected {required}, optional {optional}; got {list(value)}')


def text(value):
    return isinstance(value, str) and bool(value.strip()) and not any(ord(c) < 32 for c in value)


def validate(data):
    keys(data, ('schemaVersion', 'default', 'branches'))
    require(type(data['schemaVersion']) is int and data['schemaVersion'] == 1, 'Unsupported schemaVersion')
    require(type(data['default']) is int and data['default'] == 0, 'Default must be 0')
    require(isinstance(data['branches'], list) and bool(data['branches']), 'Branches must be a nonempty list')
    branch_keys, job_ids, option_ids = set(), set(), set()
    for branch in data['branches']:
        keys(branch, ('key', 'label', 'sex', 'jobs', 'options'))
        key = branch['key']
        require(isinstance(key, str) and re.fullmatch(r'[a-z][a-z0-9_]*', key), 'Invalid branch key')
        require(key not in branch_keys, f'Duplicate branch {key}')
        branch_keys.add(key)
        require(text(branch['label']), f'Invalid branch label: {key}')
        require(isinstance(branch['sex'], str) and branch['sex'] in SEX, f'Invalid sex: {key}')
        require(isinstance(branch['jobs'], list) and bool(branch['jobs']), f'No jobs: {key}')
        require(isinstance(branch['options'], list), f'Invalid options: {key}')
        local_jobs = {}
        for job in branch['jobs']:
            keys(job, ('id', 'stage'), ('mountedOf',))
            require(integer(job['id'], 1, 65535), f'Job ID outside uint16: {job}')
            require(job['id'] not in job_ids, f'Duplicate job ID {job["id"]}')
            job_ids.add(job['id'])
            require(integer(job['stage'], 1, 4), f'Invalid job stage: {job}')
            if 'mountedOf' in job:
                require(integer(job['mountedOf'], 1, 65535), f'Invalid mountedOf: {job}')
            local_jobs[job['id']] = job
        mounted_bases = set()
        for job in branch['jobs']:
            if 'mountedOf' not in job:
                continue
            base = local_jobs.get(job['mountedOf'])
            require(base is not None and 'mountedOf' not in base and base['stage'] == job['stage'],
                    f'Invalid mounted base or stage: {job}')
            require(base['id'] not in mounted_bases, f'Ambiguous mounted mapping: {base["id"]}')
            mounted_bases.add(base['id'])
        option_jobs = set()
        for option in branch['options']:
            keys(option, ('id', 'label', 'stage', 'job', 'mountedJob', 'mountLabel'))
            require(integer(option['id'], 1, 65535), f'Option ID outside uint16: {option}')
            require(option['id'] not in option_ids, f'Duplicate option ID {option["id"]}')
            option_ids.add(option['id'])
            require(text(option['label']), f'Invalid option label: {option}')
            require(integer(option['stage'], 1, 3), f'Invalid option stage: {option}')
            require(integer(option['job'], 1, 65535), f'Invalid option job: {option}')
            base = local_jobs.get(option['job'])
            require(base is not None and 'mountedOf' not in base and base['stage'] == option['stage'],
                    f'Option job missing, mounted, cross-branch or wrong stage: {option}')
            require(base['id'] not in option_jobs, f'Duplicate option body: {base["id"]}')
            option_jobs.add(base['id'])
            require(any(j['stage'] > option['stage'] for j in local_jobs.values()),
                    f'Option has no later eligible stage: {option}')
            mount_id = option['mountedJob']
            if mount_id is None:
                require(option['mountLabel'] is None and base['id'] not in mounted_bases,
                        f'Missing bound mount or unexpected mount label: {option}')
            else:
                require(integer(mount_id, 1, 65535), f'Invalid mountedJob: {option}')
                mount = local_jobs.get(mount_id)
                require(mount is not None and mount.get('mountedOf') == base['id'] and mount['stage'] == option['stage'],
                        f'Invalid bound mount: {option}')
                require(text(option['mountLabel']), f'Missing mount label: {option}')
    return data


def render(data):
    validate(data)
    canonical = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
    digest = hashlib.sha256(canonical).hexdigest()
    provenance = f'Generated from {SOURCE.as_posix()}; canonical SHA-256: {digest}. Do not edit.'
    jobs, options, cpp_jobs, cpp_options = {}, {}, [], []
    for branch_index, branch in enumerate(data['branches'], 1):
        sex = SEX[branch['sex']]
        for job in branch['jobs']:
            item = {'branch': branch['key'], 'stage': job['stage'], 'sex': sex, 'mountedOf': job.get('mountedOf', 0)}
            jobs[job['id']] = item
            cpp_jobs.append((job['id'], branch_index, job['stage'], sex, item['mountedOf']))
        for option in branch['options']:
            item = {'id': option['id'], 'branch': branch['key'], 'stage': option['stage'], 'sex': sex,
                    'job': option['job'], 'mountedJob': option['mountedJob'] or 0,
                    'name': option['label'], 'mountLabel': option['mountLabel']}
            options[option['id']] = item
            cpp_options.append((option['id'], branch_index, option['stage'], sex, item['job'], item['mountedJob'],
                                json.dumps(item['name'], ensure_ascii=False),
                                'nullptr' if item['mountLabel'] is None else json.dumps(item['mountLabel'], ensure_ascii=False)))
    def cpp_array(kind, name, rows):
        contents = '\n'.join('    {' + ', '.join(map(str, row)) + '},' for row in sorted(rows))
        return f'inline constexpr std::array<{kind}, {len(rows)}> {name} = {{{{\n{contents}\n}}}};\n'
    server = (f'// {provenance}\n#ifndef HAPPYRO_CHARACTER_APPEARANCE_DATA_HPP\n'
              '#define HAPPYRO_CHARACTER_APPEARANCE_DATA_HPP\n#include <array>\n\n'
              'namespace character_appearance_data {\n'
              'struct Job { int id, branch, stage, sex, mounted_of; };\n'
              'struct Option { int id, branch, stage, sex, job, mounted_job; const char* name; const char* mount_label; };\n'
              + cpp_array('Job', 'jobs', cpp_jobs) + cpp_array('Option', 'options', cpp_options)
              + '} // namespace character_appearance_data\n#endif\n')
    def js_value(value):
        if isinstance(value, str):
            return "'" + value.replace('\\', '\\\\').replace("'", "\\'") + "'"
        return json.dumps(value, ensure_ascii=False)
    client = f'// {provenance}\n'
    for name, value in [('characterAppearanceJobs', jobs), ('characterAppearanceOptions', options)]:
        entries = []
        for ident, item in sorted(value.items()):
            fields = ',\n'.join(f'\t\t{key}: {js_value(field)}' for key, field in item.items())
            entries.append(f'\t{ident}: {{\n{fields}\n\t}}')
        client += f'export const {name} = {{\n' + ',\n'.join(entries) + '\n};\n'
    client = client.replace('\n', '\r\n')
    admin = (f'// {provenance}\npackage catalog\n\n'
             'func ValidAppearance(id int64) bool {\n\tswitch id {\n\tcase '
             + ', '.join(map(str, [0] + sorted(options)))
             + ':\n\t\treturn true\n\tdefault:\n\t\treturn false\n\t}\n}\n')
    return {'server': server, 'client': client, 'admin': admin}


def run(root, command):
    data = json.loads((root / SOURCE).read_text(encoding='utf-8'))
    expected = render(data)
    drift = []
    for name, path in TARGETS.items():
        target = root / path
        content = expected[name].encode('utf-8')
        if command == 'generate':
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
        elif not target.is_file() or target.read_bytes() != content:
            drift.append(path.as_posix())
    if drift:
        raise ValueError('Generated catalog drift: ' + ', '.join(drift))
    return list(TARGETS.values())


def help_text(color=True):
    def c(code, value):
        return f'\033[{code}m{value}\033[0m' if color else value
    return ('\n' + c('1;36', 'HappyRO character appearance catalogs') + '\n\n'
            + c('1;33', 'Usage') + '\n  python3 tools/character-appearance/generate.py [--no-color] <command>\n\n'
            + c('1;33', 'Commands') + '\n  ' + c('1;32', 'generate') + '  Validate source and regenerate all three catalogs\n  '
            + c('1;32', 'check') + '     Validate source and fail if any catalog differs\n\n'
            + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/character-appearance/generate.py generate') + '\n  '
            + c('36', 'python3 tools/character-appearance/generate.py check --no-color') + '\n\n')


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', nargs='?', choices=('generate', 'check'))
    parser.add_argument('--no-color', action='store_true')
    parser.add_argument('-h', '--help', action='store_true')
    args = parser.parse_args(argv)
    if args.help or args.command is None:
        print(help_text(not args.no_color), end='')
        return 0
    try:
        paths = run(ROOT, args.command)
    except (ValueError, OSError) as error:
        print(f'Error: {error}', file=sys.stderr)
        return 1
    print(f'{args.command}: {len(paths)} catalogs verified' if args.command == 'check' else f'Generated {len(paths)} catalogs')
    return 0


if __name__ == '__main__':
    sys.exit(main())
