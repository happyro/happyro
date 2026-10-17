assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).job_id,4);
const proof=[];
await command('character.progression.update',{base_level:70,job_level:39});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
await jobNpc.travel('prt_church',16,40);await jobNpc.contact(16,41);proof.push({name:'Job39',...await jobNpc.run(['我想成为牧师','是的'])});assert.equal((await snapshot()).job_id,4);
await command('character.progression.update',{job_level:50});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
await jobNpc.contact(16,41);proof.push({name:'Job50',...await jobNpc.run(['我想成为牧师','是的','我准备好了'])});
await fs.writeFile('docs/development/job-change-review/evidence/priest-registration.json',JSON.stringify(proof,null,2));return proof;
