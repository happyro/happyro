assert.equal((await snapshot()).name,'JobDirectF');
const proof={preparation:'6151 and6152 each1 supplied by Adventure Tools after missing-material rejection; random drop probability not tested. Rings obtained from native NPC.',stages:[]};
const file='docs/development/job-change-review/evidence/warlock-materials.json';const record=async(name,dialogue)=>{proof.stages.push({name,...dialogue});await fs.writeFile(file,JSON.stringify(proof,null,2));};
await jobNpc.travel('spl_in02',60,230);await jobNpc.contact(60,231);const missing=await jobNpc.run(['我带来了材料']);assert(missing.pages.some(p=>p.text?.includes('在哪里')));await record('Missing materials',missing);
for(const id of [6151,6152]){await game.waitForTimeout(2200);const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/items/grants',{headers,data:{idempotency_key:crypto.randomUUID(),target:{type:'self'},item_id:id,amount:1}});assert.equal(r.status(),200,await r.text());}
for(const [id,location] of [[2796,8],[2797,128]]){
 await game.evaluate(({id,location})=>{const t=window.__fourthTest,item=t.inventory.getItemById(id),p=new t.packet.CZ.REQ_WEAR_EQUIP();p.index=item.index;p.wearLocation=location;t.network.sendPacket(p);},{id,location});await game.waitForTimeout(500);
}
await jobNpc.contact(60,231);const equipped=await jobNpc.run(['我带来了材料']);assert(equipped.pages.some(p=>p.text?.includes('把魔法石带回来')));await record('Equipped rings rejected',equipped);
const rings=JSON.parse(await fs.readFile('docs/development/job-change-review/evidence/warlock-rings.json')).rings;
for(const {index} of rings){await game.evaluate(index=>{const t=window.__fourthTest,p=new t.packet.CZ.REQ_TAKEOFF_EQUIP();p.index=index;t.network.sendPacket(p);},index);await game.waitForTimeout(500);}
await jobNpc.contact(60,231);const success=await jobNpc.run(['我带来了材料']);assert(success.pages.some(p=>p.text?.includes('所有材料都准备好了')));await record('Materials accepted',success);
proof.remaining=await game.evaluate(()=>[2796,2797,6151,6152].map(id=>({id,present:!!window.__fourthTest.inventory.getItemById(id)})));assert(proof.remaining.every(i=>!i.present));await fs.writeFile(file,JSON.stringify(proof,null,2));return proof.remaining;
