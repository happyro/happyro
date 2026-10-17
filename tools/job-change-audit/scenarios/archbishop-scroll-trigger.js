assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch02');
const proof={before:await game.evaluate(()=>!!window.__fourthTest.inventory.getItemById(12381))};
const {walk}=await import('./walk.mjs?arch=3');
proof.exit=await walk(game,snapshot,[119,57],0);proof.return=await walk(game,snapshot,[119,49],0);
proof.after=await game.evaluate(()=>{const t=window.__fourthTest,i=t.inventory.getItemById(12381);if(!i)return null;t.inventory.useItem(i);return {id:i.ITID,index:i.index};});
await fs.writeFile('docs/development/job-change-review/evidence/archbishop-scroll-trigger.json',JSON.stringify(proof,null,2));return proof;
