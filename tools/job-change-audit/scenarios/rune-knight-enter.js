assert.equal((await snapshot()).name,'JobAuditM');
globalThis.jobNpc=(await import('./dialogue.mjs?v=3')).dialogueDriver(game,snapshot);
const path='docs/development/job-change-review/evidence/rune-knight-registration.json';const proof=JSON.parse(await fs.readFile(path));
const record=async(name,result)=>{proof.stages.push({name,...result});await fs.writeFile(path,JSON.stringify(proof,null,2));};
await jobNpc.contact(44,363);await record('Jungberg',await jobNpc.run(['我来成为符文骑士']));
await jobNpc.travel('gl_knt02',150,54);await jobNpc.contact(150,55);await record('Staff',await jobNpc.run());
return {map:(await snapshot()).map,last:proof.stages.at(-1)};
