#!/usr/bin/env python3
"""Local Docker maintenance commands. No arguments only prints help."""
import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
DATABASE = 'happyro-database'
SERVICES = ['happyro-admin', 'happyro-web-api', 'happyro-map',
            'happyro-char', 'happyro-login']
OWNED_TABLES = '''achievement bonus_script cart_inventory char_configs
char_reg_num char_reg_str friends hotkey inventory memo merchant_configs
party_bookings quest sc_data skill skillcooldown pet elemental homunculus
mercenary mercenary_owner buyingstores vendings guild_expulsion'''.split()


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def sql(statement):
    return run('docker', 'exec', '-i', DATABASE, 'sh', '-c',
               'exec mariadb --batch --raw --skip-column-names '
               '-uroot -p"$MARIADB_ROOT_PASSWORD" happyro',
               input=statement, text=True, capture_output=True).stdout.strip()


def account_snapshot(account):
    # Hex literals avoid dependence on SQL escaping modes and shell interpolation.
    encoded = account.encode('utf-8').hex()
    accounts = sql(f"SELECT account_id FROM login WHERE BINARY userid = UNHEX('{encoded}');").splitlines()
    if len(accounts) != 1:
        raise ValueError('必须准确匹配一个游戏账号。')
    account_id = int(accounts[0])
    rows = sql(f'''SELECT JSON_OBJECT('id', char_id, 'name', name,
        'party', party_id, 'guild', guild_id, 'partner', partner_id,
        'father', father, 'mother', mother, 'child', child)
        FROM `char` WHERE account_id={account_id} ORDER BY char_id;''')
    characters = [json.loads(line) for line in rows.splitlines()]
    if any(any(c[key] for key in ('party', 'guild', 'partner', 'father', 'mother', 'child'))
           for c in characters):
        raise ValueError('账号角色存在队伍、公会或家庭关系；请先在游戏内解除关系。')
    # Also reject incoming references, including stale membership records.
    if characters:
        ids = ','.join(str(c['id']) for c in characters)
        references = sql(f'''SELECT
          (SELECT COUNT(*) FROM `char` WHERE partner_id IN ({ids}) OR father IN ({ids})
             OR mother IN ({ids}) OR child IN ({ids})) +
          (SELECT COUNT(*) FROM guild_member WHERE char_id IN ({ids})) +
          (SELECT COUNT(*) FROM guild WHERE char_id IN ({ids})) +
          (SELECT COUNT(*) FROM party WHERE leader_char IN ({ids}));''')
        if int(references):
            raise ValueError('检测到其他角色或公会、队伍的关联引用，请先解除关系。')
    return account_id, characters


def deletion_sql(account_id):
    statements = [f'''CREATE TEMPORARY TABLE targets AS
        SELECT char_id FROM `char` WHERE account_id={int(account_id)};''']
    for child, parent, foreign_key, primary_key in [
        ('mail_attachments', 'mail', 'id', 'id'),
        ('skill_homunculus', 'homunculus', 'homun_id', 'homun_id'),
        ('skillcooldown_homunculus', 'homunculus', 'homun_id', 'homun_id'),
        ('skillcooldown_mercenary', 'mercenary', 'mer_id', 'mer_id'),
        ('vending_items', 'vendings', 'vending_id', 'id'),
        ('buyingstore_items', 'buyingstores', 'buyingstore_id', 'id'),
    ]:
        owner = 'dest_id' if parent == 'mail' else 'char_id'
        statements.append(f'''DELETE c FROM `{child}` c JOIN `{parent}` p
            ON c.`{foreign_key}`=p.`{primary_key}` JOIN targets t ON p.`{owner}`=t.char_id;''')
    for inventory in ('inventory', 'cart_inventory'):
        statements.append(f'''DELETE p FROM pet p JOIN `{inventory}` i
            ON p.pet_id=(i.card1 | (i.card2 << 16))
            JOIN targets t ON i.char_id=t.char_id WHERE i.card0=256;''')
    statements += [
        'DELETE m FROM mail m JOIN targets t ON m.dest_id=t.char_id;',
        'UPDATE mail m JOIN targets t ON m.send_id=t.char_id SET m.send_id=0;',
        'DELETE f FROM friends f JOIN targets t ON f.friend_id=t.char_id;',
    ]
    for table in [*OWNED_TABLES, 'char']:
        statements.append(f'DELETE c FROM `{table}` c JOIN targets t ON c.char_id=t.char_id;')
    return '\n'.join(statements)


def reset_characters(args):
    context = run('docker', 'context', 'show', text=True, capture_output=True).stdout.strip()
    details = json.loads(run('docker', 'context', 'inspect', context,
                            text=True, capture_output=True).stdout)[0]
    endpoint = os.environ.get('DOCKER_HOST') or details['Endpoints']['docker']['Host']
    if not endpoint.startswith('unix://'):
        raise ValueError('本工具只支持本机 Unix socket Docker。')
    account_id, characters = account_snapshot(args.account)
    print(f'账号 {args.account}（ID {account_id}）：{len(characters)} 个角色')
    for character in characters:
        print(f"  {character['id']}  {character['name']}")
    if not args.execute or not characters:
        if characters:
            print('仅预览；添加 --execute 才会备份并删除。')
        return
    states = json.loads(run('docker', 'inspect', *SERVICES,
                            text=True, capture_output=True).stdout)
    running = [s['Name'].lstrip('/') for s in states if s['State']['Running']]
    # Stop writers before re-reading targets and taking a consistent full backup.
    mutation_started = False
    try:
        if running:
            run('docker', 'stop', *running)
        if account_snapshot(args.account) != (account_id, characters):
            raise ValueError('停服前后角色列表发生变化，请重新预览。')
        directory = ROOT / 'work/operations/backups'
        directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        backup = directory / f"characters-{account_id}-{datetime.now():%Y%m%d-%H%M%S-%f}.sql"
        with backup.open('xb') as output:
            backup.chmod(0o600)
            run('docker', 'exec', DATABASE, 'sh', '-c',
                'exec mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" '
                '--lock-all-tables --routines --events --triggers --databases happyro',
                stdout=output)
        print(f'完整游戏库备份：{backup}', flush=True)
        mutation_started = True
        sql(deletion_sql(account_id))
        if account_snapshot(args.account)[1]:
            raise ValueError('删除后仍有角色。')
    except Exception:
        if mutation_started:
            print('删除未完整成功：服务保持停止，请使用上述备份恢复后再启动。', file=sys.stderr)
        elif running:
            run('docker', 'start', *reversed(running))
        raise
    else:
        if running:
            run('docker', 'start', *reversed(running))
        print('角色已清空；账号、密码和账号仓库保留。')


def help_text(color):
    def paint(code, text):
        return f'\033[{code}m{text}\033[0m' if color else text
    return '\n' + '\n'.join([
        paint('1;36', 'HappyRO 本机运维工具'),
        '用法：python3 tools/operations/manage.py [--no-color] <子命令> [选项]',
        '', paint('1;33', '子命令'),
        paint('1;32', '  reset-characters --account <账号> [--execute]'),
        '    默认预览；--execute 停写、备份并删除账号的全部角色。',
        '', paint('1;33', '常用例子'),
        paint('36', '  python3 tools/operations/manage.py reset-characters --account happyro'),
        paint('36', '  python3 tools/operations/manage.py reset-characters --account happyro --execute'),
        '', '选项：--no-color 禁用 ANSI 高亮；-h / --help 显示帮助。',
    ]) + '\n\n'


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    color = '--no-color' not in argv
    argv = [arg for arg in argv if arg != '--no-color']
    if not argv or '-h' in argv or '--help' in argv:
        print(help_text(color), end='')
        return 0
    parser = argparse.ArgumentParser(add_help=False)
    commands = parser.add_subparsers(dest='command', required=True)
    reset = commands.add_parser('reset-characters', add_help=False)
    reset.add_argument('--account', required=True)
    reset.add_argument('--execute', action='store_true')
    args = parser.parse_args(argv)
    try:
        reset_characters(args)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'失败：{error}', file=sys.stderr)
        if isinstance(error, subprocess.CalledProcessError) and error.stderr:
            print(error.stderr, file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
