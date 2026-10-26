globalThis.jobNpc=(await import('./dialogue.mjs?load=2')).dialogueDriver(game,snapshot);
assert.equal((await snapshot()).name,"JobAudit2M");assert.equal((await snapshot()).job_id,5);
await command('character.progression.update',{base_level:70,job_level:50});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
await jobNpc.travel("ein_in01",18,27);await jobNpc.contact(18,28);const proof={preparation:'Base70 Job50, skills learned and no remaining skill points; no quest writes',dialogue:await jobNpc.run(["填写申请。"],100)};const s=await snapshot();proof.result={job:s.job_id,map:s.map,x:s.x,y:s.y};await fs.writeFile('docs/development/job-change-review/evidence/blacksmith-registration.json',JSON.stringify(proof,null,2));return proof;
