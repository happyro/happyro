assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job_prist');
await jobNpc.contact(24,187);const proof=await jobNpc.run(['是的，我了解','我准备好了']);await fs.writeFile('docs/development/job-change-review/evidence/priest-spirit-entry.json',JSON.stringify(proof,null,2));return proof;
