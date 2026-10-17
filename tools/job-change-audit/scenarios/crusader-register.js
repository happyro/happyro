globalThis.jobNpc=(await import('./dialogue.mjs?load=3')).dialogueDriver(game,snapshot);
assert.equal((await snapshot()).name,"JobDirectF");assert.equal((await snapshot()).job_id,1);
await command('character.progression.update',{base_level:70,job_level:50});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
const {walk}=await import('./walk.mjs?arch=11');
await jobNpc.travel('prontera',156,354);await walk(game,snapshot,[156,357],0);assert.equal((await snapshot()).map,'prt_cas');
await walk(game,snapshot,[268,175],0);await walk(game,snapshot,[174,235],0);await walk(game,snapshot,[251,75],3);await jobNpc.contact(251,75);const proof={preparation:'Base70 Job50, skills learned and no remaining skill points; no quest writes',dialogue:await jobNpc.run(["我想为圣战做准备！", "是的。"],100)};const s=await snapshot();proof.result={job:s.job_id,map:s.map,x:s.x,y:s.y};await fs.writeFile('docs/development/job-change-review/evidence/crusader-registration.json',JSON.stringify(proof,null,2));return proof;
