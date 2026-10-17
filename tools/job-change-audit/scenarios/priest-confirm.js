assert.equal((await snapshot()).name,'JobAuditF');
await command('character.stats.update',{str:99,agi:99,vit:99,int:99,dex:99,luk:1});
await jobNpc.travel('prt_church',16,40);await jobNpc.contact(16,41);const dialogue=await jobNpc.run();const s=await snapshot();await fs.writeFile('docs/development/job-change-review/evidence/priest-npc-complete.json',JSON.stringify({dialogue,result:{job:s.job_id,jobLevel:s.job_level}},null,2));assert.equal(s.job_id,8);return {job:s.job_id,jobLevel:s.job_level};
