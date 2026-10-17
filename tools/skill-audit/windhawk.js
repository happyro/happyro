const rows=[];await live.job(4257,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:99,luk:30});await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});
await live.equip(1701);await live.equip(1750);await live.grant(1000311,1);
const s=await snapshot();for(const kind of ['warg_rider','warg','falcon']){const r=s.riding.find(r=>r.kind===kind);if(r?.active)await command('character.riding.update',{kind,enabled:false,fee:r.fee,ticket:r.ticket});}
for(const name of ['WH_HAWK_M','WH_WIND_SIGN','WH_HAWKRUSH','WH_GALESTORM','WH_CRESCIVE_BOLT','WH_CALAMITYGALE','WH_HAWKBOOMERANG','WH_WILD_WALK'])rows.push(await live.cast(name));
await game.screenshot({path:'artifacts/skill-live/windhawk.png'});return rows;
