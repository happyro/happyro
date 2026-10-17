from audit_cli import require_audit_command
require_audit_command(__file__)
import subprocess,os,struct,json,hashlib
from pathlib import Path
pid=int(subprocess.check_output(['systemctl','show','--property=MainPID','--value','happyro-map.service'],text=True).strip())
exe=Path(os.readlink(f'/proc/{pid}/exe'));raw=exe.read_bytes();etype=struct.unpack_from('<H',raw,16)[0]
symbols=subprocess.check_output(['nm','-C',str(exe)],text=True);symbol=int(next(l.split()[0] for l in symbols.splitlines() if l.endswith(' B battle_config')),16)
base=0
if etype==3:
 for line in Path(f'/proc/{pid}/maps').read_text().splitlines():
  cols=line.split()
  if len(cols)>=6 and cols[-1]==str(exe) and int(cols[2],16)==0:base=int(cols[0].split('-')[0],16);break
 assert base
else:assert etype==2
fields={k:int(v) for k,v in (l.split() for l in subprocess.check_output(['work/skill-audit/battle-config-offsets', '--run', '--no-color'],text=True).splitlines())}
values={}
with open(f'/proc/{pid}/mem','rb',buffering=0) as f:
 for key,offset in fields.items():f.seek(base+symbol+offset);values[key]=struct.unpack('<i',f.read(4))[0]
assert values['critical_rate']==100
result={'pid':pid,'binary':str(exe),'binarySha256':hashlib.sha256(raw).hexdigest(),'method':'Read-only process memory at ELF battle_config symbol and source-derived int32 member offsets; no process mutation','values':values}
Path('artifacts/skill-live/revalidation/live-battle-config.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
