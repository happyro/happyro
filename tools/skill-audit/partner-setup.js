await command('character.progression.update',{job_id:4074,base_level:200,job_level:70});await command('character.stats.update',{str:80,agi:80,vit:100,int:120,dex:120,luk:30});await command('character.skills.learn_all',{});await command('character.vitals.restore',{});

await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=2001;p.mapName='izlude';p.x=125;p.y=120;t.network.sendPacket(p);});await game.waitForTimeout(3000);
const s=await snapshot();return {name:s.name,job:s.job_id,hp:s.hp,maxhp:s.max_hp,map:s.map,position:[s.x,s.y],party:await game.evaluate(()=>({member:window.__fourthTest.session.hasParty,leader:window.__fourthTest.session.isPartyLeader}))};
