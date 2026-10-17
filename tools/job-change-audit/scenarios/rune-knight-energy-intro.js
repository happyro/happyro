assert.equal((await snapshot()).name,'JobAuditM');
const proof={stages:[]};const file='docs/development/job-change-review/evidence/rune-knight-energy-intro.json';
const record=async(name,result)=>{proof.stages.push({name,...result});await fs.writeFile(file,JSON.stringify(proof,null,2));};
await jobNpc.contact(55,50);await record('Renoa transport',await jobNpc.run(['是的，我准备好了']));
assert.equal((await snapshot()).map,'mid_camp');
await jobNpc.contact(235,250);await record('Serpeone',await jobNpc.run());
await jobNpc.contact(235,250);await record('Insufficient energy',await jobNpc.run(['我收集了足够能量']));
return proof.stages.map(s=>({name:s.name,last:s.pages.at(-1)}));
