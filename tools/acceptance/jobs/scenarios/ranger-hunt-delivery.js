assert.equal((await snapshot()).name,'JobDirectM');
const {walk}=await import('./walk.mjs?ranger=2');
const proof={preparation:'Dragon Tail killed normally; quest 8257 hunt count 1/1 in ranger-hunt.json. One wing prepared with adventure tool; natural drop not verified.'};
await walk(game,snapshot,[91,169],2);await jobNpc.contact(91,169);proof.missing=await jobNpc.run([],80);
await snapshot();const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/items/grants',{headers,data:{idempotency_key:crypto.randomUUID(),target:{type:'self'},item_id:7064,amount:1}});assert.equal(r.status(),200,await r.text());
await jobNpc.contact(91,169);proof.delivery=await jobNpc.run([],80);proof.consumed=await game.evaluate(()=>!window.__fourthTest.inventory.getItemById(7064));assert(proof.consumed);
await fs.writeFile('docs/development/job-change-review/evidence/ranger-hunt-delivery.json',JSON.stringify(proof,null,2));return proof;
