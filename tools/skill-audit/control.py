from audit_cli import require_audit_command
require_audit_command(__file__)
import sys,json,urllib.request,urllib.error
if len(sys.argv)<2:
 print('\nUsage: python3 tools/skill-audit/control.py CODE_FILE\n');sys.exit()
code=open(sys.argv[1]).read()
port=int(sys.argv[2]) if len(sys.argv)>2 else 9341
req=urllib.request.Request('http://127.0.0.1:'+str(port),data=json.dumps({'code':code}).encode(),headers={'Content-Type':'application/json'})
try:
 with urllib.request.urlopen(req,timeout=2400) as r: print(r.read().decode())
except urllib.error.HTTPError as e:print(e.read().decode());sys.exit(1)
