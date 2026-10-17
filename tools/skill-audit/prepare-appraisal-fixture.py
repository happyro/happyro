from audit_cli import require_audit_command
require_audit_command(__file__)
import sys, subprocess, json
from pathlib import Path
if sys.argv[1:] != ['--apply']:
 print('\nUsage: python3 tools/skill-audit/prepare-appraisal-fixture.py --apply\n');sys.exit()
env=dict(line.split('=',1) for line in Path('work/runtime/mariadb-10.11/compose.env').read_text().splitlines() if '=' in line and not line.startswith('#'))
def query(sql):
 r=subprocess.run(['docker','exec','-e','MYSQL_PWD='+env['MARIADB_ROOT_PASSWORD'],'happyro-mariadb','mariadb','-uroot','--batch',env['DB_MAIN_DATABASE'],'-e',sql],capture_output=True,text=True,check=True);return r.stdout
before=query('SELECT * FROM inventory WHERE id=427 AND char_id=150000 AND nameid=1504');Path('artifacts/skill-live/appraisal-fixture-before.tsv').write_text(before)
result=query("START TRANSACTION; UPDATE inventory i JOIN `char` c ON c.char_id=i.char_id SET i.identify=0 WHERE i.id=427 AND i.char_id=150000 AND i.nameid=1504 AND i.refine=0 AND i.identify=1 AND i.equip=0 AND c.name='happyro1' AND c.online=0; SELECT ROW_COUNT() AS fixture_rows; COMMIT; SELECT id,char_id,nameid,refine,identify,equip FROM inventory WHERE id=427;")
Path('artifacts/skill-live/appraisal-fixture-applied.tsv').write_text(result);print(result)
