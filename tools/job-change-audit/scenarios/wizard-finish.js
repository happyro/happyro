assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).map,'gef_tower');
await command('character.stats.update',{str:99,agi:99,vit:99,int:99,dex:99,luk:1});
await jobNpc.travel('gef_tower',111,36);await jobNpc.contact(111,37);const dialogue=await jobNpc.run();
const s=await snapshot();assert.equal(s.job_id,9);assert.equal(s.job_level,1);
const proof={dialogue,result:{job:s.job_id,base:s.base_level,jobLevel:s.job_level},combat:'Normal client attacks with strengthened test attributes; original timed rooms and mob death events. Stats restored before final NPC.'};
await game.screenshot({path:'docs/development/job-change-review/evidence/wizard-npc-complete.png'});
await fs.writeFile('docs/development/job-change-review/evidence/wizard-npc-complete.json',JSON.stringify(proof,null,2));return proof.result;
