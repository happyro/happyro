from audit_cli import require_audit_command
require_audit_command(__file__)
import os,sys,subprocess
from pathlib import Path
if len(sys.argv)!=2:
 print('\nUsage: python3 tools/skill-audit/db-read.py "SELECT ..."\n');sys.exit()
query=sys.argv[1]
if not query.lstrip().upper().startswith('SELECT '):raise ValueError('Read-only SELECT required')
env=dict(line.split('=',1) for line in Path('work/runtime/mariadb-10.11/compose.env').read_text().splitlines() if '=' in line and not line.startswith('#'))
r=subprocess.run(['docker','exec','-e','MYSQL_PWD='+env['MARIADB_ROOT_PASSWORD'],'happyro-mariadb','mariadb','-uroot','-N',env['DB_MAIN_DATABASE'],'-e',query],capture_output=True,text=True)
print(r.stdout)
if r.returncode:print(r.stderr);sys.exit(r.returncode)
