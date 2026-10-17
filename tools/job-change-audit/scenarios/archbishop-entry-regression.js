assert.equal((await snapshot()).name,'JobAuditF');
await jobNpc.travel('job3_arch01',29,29);await jobNpc.contact(29,34);
const file='docs/development/job-change-review/evidence/archbishop-entry-after.json';
const proof={dialogue:await game.locator('#NpcBox .content').innerText()};
// A normal slow reader must not lose trial ownership before entering.
await game.waitForTimeout(3500);let s=await snapshot();proof.beforeClose={map:s.map,x:s.x,y:s.y};assert.equal(s.map,'job3_arch01');
await game.locator('#NpcBox .close').click();await game.waitForTimeout(1800);s=await snapshot();proof.entered={map:s.map,x:s.x,y:s.y};assert.equal(s.map,'job3_arch02');await fs.writeFile(file,JSON.stringify(proof,null,2));
await game.waitForFunction(()=>!!window.__fourthTest.inventory.getItemById(12381),null,{timeout:15000});
proof.scroll=await game.evaluate(()=>{const i=window.__fourthTest.inventory.getItemById(12381);return i?{id:i.ITID,index:i.index}:null;});assert(proof.scroll,'Required trial scroll missing');
await game.evaluate(()=>{const t=window.__fourthTest;t.inventory.useItem(t.inventory.getItemById(12381));});await game.waitForTimeout(1200);
proof.summon=await game.evaluate(()=>{const a=[];window.__fourthTest.entities.forEach(e=>{if(e.job===2037)a.push({id:e.GID,job:e.job});});return a;});assert(proof.summon.length,'No trial Valkyrie summoned');
await fs.writeFile(file,JSON.stringify(proof,null,2));return proof;
