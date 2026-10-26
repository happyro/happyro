assert.equal((await snapshot()).name,'JobAuditM');
const file='docs/development/job-change-review/evidence/rune-knight-hunt-delivery.json';const proof=JSON.parse(await fs.readFile(file));
proof.stages.push({name:'Return to headquarters',...await jobNpc.run(['现在回去'])});await fs.writeFile(file,JSON.stringify(proof,null,2));
assert.equal((await snapshot()).map,'job3_rune01');await jobNpc.travel('job3_rune01',55,49);await jobNpc.contact(55,50);proof.stages.push({name:'Renoa rune task',...await jobNpc.run()});await fs.writeFile(file,JSON.stringify(proof,null,2));return proof.stages.at(-1);
