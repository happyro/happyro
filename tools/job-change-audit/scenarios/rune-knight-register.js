assert.equal((await snapshot()).name,'JobAuditM');assert.equal((await snapshot()).job_id,4008);
globalThis.jobNpc=(await import('./dialogue.mjs?v=2')).dialogueDriver(game, snapshot);
await command('character.progression.update',{base_level:99,job_level:70});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
const proof={preparation:'Base99 Job70 and skills prepared; no quest variables or job modified.',stages:[]};
const record=async(name,result)=>{proof.stages.push({name,...result});await fs.writeFile('docs/development/job-change-review/evidence/rune-knight-registration.json',JSON.stringify(proof,null,2));};
await jobNpc.travel('prt_in',162,23);await jobNpc.contact(162,24);await record('Manuel',await jobNpc.run(['好，我们喝一杯','我准备成为符文骑士']));
await jobNpc.travel('glast_01',44,362);await jobNpc.contact(44,363);await record('Jungberg',await jobNpc.run(['我来成为符文骑士']));
await jobNpc.travel('gl_knt02',150,54);await jobNpc.contact(150,55);await record('Staff',await jobNpc.run());return proof;
