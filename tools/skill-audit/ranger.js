const rows=[];await live.job(4062,200,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:99,luk:30});await live.equip(1701);await live.equip(1750);await live.grant(6124,1);
let s=await snapshot();let f=s.riding.find(r=>r.kind==='falcon');if(f?.active)await command('character.riding.update',{kind:'falcon',enabled:false,fee:f.fee,ticket:f.ticket});
for(const name of ['RA_ARROWSTORM','RA_AIMEDBOLT','RA_FEARBREEZE','RA_WUGMASTERY','RA_WUGSTRIKE','RA_WUGBITE','RA_SENSITIVEKEEN','RA_WUGRIDER'])rows.push(await live.cast(name));
await game.screenshot({path:'artifacts/skill-live/ranger-mounted.png'});
rows.push(await live.cast('RA_WUGRIDER'));
rows.push(await live.cast('RA_CAMOUFLAGE'));
rows.push(await live.cast('RA_CAMOUFLAGE'));
rows.push(await live.cast('RA_UNLIMIT'));
return rows;
