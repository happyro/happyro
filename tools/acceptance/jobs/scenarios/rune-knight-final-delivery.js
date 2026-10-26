assert.equal((await snapshot()).name,'JobAuditM');const proof=[];
for(const [x,y] of [[114,50],[114,50],[80,60]]){await jobNpc.travel('job3_rune01',x,y-1);await jobNpc.contact(x,y);proof.push({npc:[x,y],...await jobNpc.run([])});}
await fs.writeFile('docs/development/job-change-review/evidence/rune-knight-final-delivery.json',JSON.stringify(proof,null,2));return {proof,job:(await snapshot()).job_id};
