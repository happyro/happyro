assert.equal((await snapshot()).name,'JobDirectM');assert.equal((await snapshot()).job_id,3);
await command('character.progression.update',{base_level:70,job_level:50});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
await jobNpc.travel('hu_in01',386,372);await jobNpc.contact(386,373);const proof=await jobNpc.run([0,0,1,1,1,1,0,1,0,0,0,1],100);await fs.writeFile('docs/development/job-change-review/evidence/hunter-interview.json',JSON.stringify(proof,null,2));return proof;
