const rows=[];
await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=3001;p.mapName='izlude';p.x=120;p.y=120;t.network.sendPacket(p);});await game.waitForTimeout(2500);
rows.push(await live.cast('WZ_FIREPILLAR',{target:{x:122,y:122},wait:7000}));
rows.push(await live.cast('WZ_STORMGUST',{wait:10000}));
await live.spawn();rows.push(await live.cast('WZ_FROSTNOVA',{wait:7000}));
return rows;
