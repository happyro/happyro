assert.equal((await snapshot()).name,'JobDirectF');
globalThis.jobNpc=(await import('./dialogue.mjs?v=3')).dialogueDriver(game,snapshot);
await command('character.progression.update',{job_id:0,base_level:10,job_level:10});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
await jobNpc.travel('geffen_in',164,123);const npc=await jobNpc.contact(164,124);const dialogue=await jobNpc.run(['我想成为魔法师','我想成为魔法师']);
const s=await snapshot();assert.equal(s.job_id,2);assert.equal(s.job_level,1);
const proof={character:s.name,preparation:'Reset dedicated direct-test role to Novice; Base10 Job10 basic skills learned, skill points0. Actual NPC change thereafter.',npc,dialogue,result:{job:s.job_id,jobLevel:s.job_level,base:s.base_level}};
await fs.writeFile('docs/development/job-change-review/evidence/mage-npc.json',JSON.stringify(proof,null,2));return proof.result;
