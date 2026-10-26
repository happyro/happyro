assert.equal((await snapshot()).name,'JobAuditM');assert.equal((await snapshot()).map,'job3_rune01');
const proof={stages:[]};const file='docs/development/job-change-review/evidence/rune-knight-library.json';
const record=async(name,result)=>{proof.stages.push({name,...result});await fs.writeFile(file,JSON.stringify(proof,null,2));};
await jobNpc.travel('job3_rune01',90,51);await jobNpc.contact(90,50);const first=await jobNpc.run();assert(first.pages.some(p=>p.text?.includes('测试结束了')));await record('First test accepted',first);
await jobNpc.travel('job3_rune01',80,61);await jobNpc.contact(80,60);await record('Captain',await jobNpc.run());
await jobNpc.travel('job3_rune01',55,49);await jobNpc.contact(55,50);await record('Renoa',await jobNpc.run());
return proof.stages.map(s=>({name:s.name,last:s.pages.at(-1)}));
