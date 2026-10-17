assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).job_id,4063);
await jobNpc.contact(273,235);const proof={exit:await jobNpc.run([],80)};await game.waitForTimeout(1200);const s=await snapshot();proof.returned={map:s.map,x:s.x,y:s.y};assert.equal(s.map,'job3_arch01');await fs.writeFile('docs/development/job-change-review/evidence/archbishop-npc-complete.json',JSON.stringify(proof,null,2));
await command('character.stats.update',{str:99,agi:99,vit:99,int:99,dex:99,luk:99});await command('character.vitals.restore',{});
for(const file of ['cardinal-fourth.js','cardinal-relog.js']){const code=await fs.readFile('tools/job-change-audit/scenarios/'+file,'utf8');await eval('(async()=>{'+code+'})()');}
return {job:(await snapshot()).job_id};
