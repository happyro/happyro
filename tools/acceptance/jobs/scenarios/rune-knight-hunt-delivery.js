assert.equal((await snapshot()).name,'JobAuditM');
const proof={stages:[]};const file='docs/development/job-change-review/evidence/rune-knight-hunt-delivery.json';
const record=async(name,result)=>{proof.stages.push({name,...result});await fs.writeFile(file,JSON.stringify(proof,null,2));};
await jobNpc.travel('mid_camp',235,249);await jobNpc.contact(235,250);const delivered=await jobNpc.run(['我收集了足够能量']);assert(delivered.pages.some(p=>p.text?.includes('已积累足够')));await record('Energy accepted',delivered);
await jobNpc.contact(235,250);await record('Return to headquarters',await jobNpc.run(['现在回去']));
assert.equal((await snapshot()).map,'job3_rune01');await jobNpc.travel('job3_rune01',55,49);await jobNpc.contact(55,50);await record('Renoa rune task',await jobNpc.run());return proof.stages.map(s=>({name:s.name,last:s.pages.at(-1)}));
