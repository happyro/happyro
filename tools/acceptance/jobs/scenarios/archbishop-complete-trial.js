assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch01');
const count=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12184)?.count||0);
if(count<400){await snapshot();const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/items/grants',{headers,data:{idempotency_key:crypto.randomUUID(),target:{type:'self'},item_id:12184,amount:400-count}});assert.equal(r.status(),200,await r.text());}
await fs.writeFile('docs/development/job-change-review/evidence/archbishop-final-attempt-preparation.json',JSON.stringify({method:'Restore native mercenary potion supply to 400 before entering; test materials only, no quest or mercenary state writes',before:count,added:Math.max(0,400-count)},null,2));
for(const name of ['archbishop-entry-regression.js','archbishop-trial-escort-fast.js','archbishop-trial-finish.js']){
 const code=await fs.readFile('tools/acceptance/jobs/scenarios/'+name,'utf8');await eval('(async()=>{'+code+'})()');
 const s=await snapshot();assert.equal(s.map,'job3_arch02','Trial returned before '+name+' finished');
}
return {job:(await snapshot()).job_id};
