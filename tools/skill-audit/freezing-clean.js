await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=1002;p.mapName='izlude';p.x=120;p.y=120;t.network.sendPacket(p);});await game.waitForTimeout(5000);
const s=await snapshot();assert.equal(s.map,'izlude');
return await live.cast('HT_FREEZINGTRAP',{target:{x:s.x+2,y:s.y},wait:6000});
