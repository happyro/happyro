assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).map,'job3_war01');
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[28,24];t.network.sendPacket(p);});await game.waitForTimeout(1500);
await game.locator('#EntityRoom button').dblclick();await game.waitForTimeout(1500);assert.equal((await snapshot()).map,'job3_war02');
const proof={attacks:[],started:new Date().toISOString(),method:'Normal attacks; Fire Bolt10 against Hollow Stone; original arena state and timers.'};const file='docs/development/job-change-review/evidence/warlock-arena-combat.json';const deadline=Date.now()+480000;
while(Date.now()<deadline){
 const s=await snapshot();if(s.map!=='job3_war02'){proof.returned={map:s.map,job:s.job_id};break;}
 if(await game.locator('#NpcBox .content').isVisible()){proof.dialogue=await jobNpc.run();await fs.writeFile(file,JSON.stringify(proof,null,2));break;}
 const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0)a.push({id:e.GID,job:e.job,hp:e.life.hp,pos:Array.from(e.position)});});return a[0];});
 if(target){await game.evaluate(target=>{const t=window.__fourthTest;if(target.job===2035)t.targeting.onUseSkillToId(19,10,target.id);else{const p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=target.id;p.action=7;t.network.sendPacket(p);}},target);proof.attacks.push(target);}
 await fs.writeFile(file,JSON.stringify(proof,null,2));await game.waitForTimeout(1000);
}
proof.endedAt=new Date().toISOString();await fs.writeFile(file,JSON.stringify(proof,null,2));return {attacks:proof.attacks.length,returned:proof.returned,dialogue:proof.dialogue};
