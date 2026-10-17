const rows=[];for(const name of ['WL_SUMMONFB','WL_SUMMONWB','WL_SUMMONBL','WL_SUMMONSTONE'])rows.push(await live.cast(name,{level:1,wait:3000}));
await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MONSTER_SPAWN();p.monsterId=1847;t.network.sendPacket(p);});
await game.waitForFunction(()=>{let found=false;window.__fourthTest.entities.forEach(e=>{if(e.job===1847)found=true;});return found;});
const target=await game.evaluate(()=>{let found;window.__fourthTest.entities.forEach(e=>{if(e.job===1847)found={id:e.GID,x:e.position[0]|0,y:e.position[1]|0};});return found;});
rows.push(await live.cast('WL_TETRAVORTEX',{target,wait:13000}));return rows;
