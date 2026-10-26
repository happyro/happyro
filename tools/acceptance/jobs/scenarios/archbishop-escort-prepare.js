assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch01');
const proof={failureChats:await game.evaluate(()=>window.__fourthTest.chat._shadow.querySelector('.content')?.innerText),preparation:'200 mercenary red potions (12184) for normal consumable healing of the native escort; no quest variables changed'};
await snapshot();const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/items/grants',{headers,data:{idempotency_key:crypto.randomUUID(),target:{type:'self'},item_id:12184,amount:200}});assert.equal(r.status(),200,await r.text());
await fs.writeFile('docs/development/job-change-review/evidence/archbishop-escort-preparation.json',JSON.stringify(proof,null,2));return {prepared:true};
