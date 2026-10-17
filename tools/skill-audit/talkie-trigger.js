await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=4200;p.mapName='izlude';p.x=124;p.y=122;t.network.sendPacket(p);});
await game.waitForFunction(()=>window.__fourthTest.entities.get(2000000)&&window.__fourthTest.session.Playing,null,{timeout:30000});
await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[122,122];t.network.sendPacket(p);});await game.waitForTimeout(2000);
const observed=await live.partner('return await game.evaluate(()=>window.__talkie);');await fs.writeFile('artifacts/skill-live/talkie-trigger.json',JSON.stringify(observed,null,2));await game.screenshot({path:'artifacts/skill-live/talkie-trigger.png'});return observed;
