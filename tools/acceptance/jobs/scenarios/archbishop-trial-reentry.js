assert.equal((await snapshot()).name,'JobAuditF');
const proof={before:await snapshot()};delete proof.before.jobs;
await jobNpc.travel('job3_arch01',29,29);await game.waitForTimeout(1500);await jobNpc.contact(29,34);proof.entry=await jobNpc.run([],100);
await game.waitForTimeout(1000);const s=await snapshot();proof.after={map:s.map,x:s.x,y:s.y};proof.scroll=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12381));
await fs.writeFile('docs/development/job-change-review/evidence/archbishop-trial-reentry.json',JSON.stringify(proof,null,2));return proof;
