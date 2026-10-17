assert.equal((await snapshot()).name,'JobDirectM');assert.equal((await snapshot()).hp,0);
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.RESTART();p.type=0;t.network.sendPacket(p);});await game.waitForTimeout(1500);await command('character.vitals.restore',{});
await jobNpc.travel('tur_dun01',93,165);const s=await snapshot();return {map:s.map,hp:s.hp};
