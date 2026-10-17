assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'prt_church');const proof=[];
await jobNpc.contact(16,41);proof.push({npc:'Bishop',...await jobNpc.run()});
await jobNpc.travel('prt_church',27,23);await jobNpc.contact(27,24);proof.push({npc:'Cecilia',...await jobNpc.run([0,1,0,0,1,1,0,0],80)});
await fs.writeFile('docs/development/job-change-review/evidence/priest-oath.json',JSON.stringify(proof,null,2));return proof;
