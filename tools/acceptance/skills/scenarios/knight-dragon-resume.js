const rows=[];
let s=await snapshot();let mount=s.riding.find(r=>r.kind==='dragon');assert(mount);if(!mount.active)await command('character.riding.update',{kind:mount.kind,enabled:true,fee:mount.fee,ticket:mount.ticket});
for(const name of ['RK_DRAGONBREATH','RK_DRAGONBREATH_WATER','RK_DRAGONHOWLING'])rows.push(await live.cast(name,{wait:7000}));
await live.job(4252,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});s=await snapshot();mount=s.riding.find(r=>r.kind==='dragon');if(mount&&!mount.active)await command('character.riding.update',{kind:mount.kind,enabled:true,fee:mount.fee,ticket:mount.ticket});
for(const name of ['DK_SERVANTWEAPON','DK_CHARGINGPIERCE','DK_HACKANDSLASHER','DK_DRAGONIC_AURA','DK_MADNESS_CRUSHER','DK_VIGOR','DK_STORMSLASH','DK_DRAGONIC_BREATH','DK_DRAGONIC_PIERCE'])rows.push(await live.cast(name,{wait:8000}));
const target=await live.durable();rows.push(await live.cast('DK_SERVANT_W_SIGN',{target,wait:1500}));rows.push(await live.cast('DK_SERVANT_W_PHANTOM',{target,wait:7000}));
await game.screenshot({path:'artifacts/skill-live/dragon-knight.png'});return rows;
