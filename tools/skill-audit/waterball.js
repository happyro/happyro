await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=3002;p.mapName='izlude';p.x=120;p.y=120;t.network.sendPacket(p);});await game.waitForTimeout(2000);
await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MONSTER_SPAWN();p.monsterId=1096;t.network.sendPacket(p);});
await game.waitForFunction(()=>{let found=false;window.__fourthTest.entities.forEach(e=>{if(e.job===1096)found=true;});return found;});
const target=await game.evaluate(()=>{let found;window.__fourthTest.entities.forEach(e=>{if(e.job===1096)found={id:e.GID,x:e.position[0]|0,y:e.position[1]|0};});return found;});
const row=await live.cast('WZ_WATERBALL',{target,wait:10000});await game.screenshot({path:'artifacts/skill-live/waterball.png'});return row;
