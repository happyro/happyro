const old=JSON.parse(await fs.readFile('artifacts/skill-live/axe-training-live.json','utf8'));
const rows=[];for(const id of [1351,1501,1201]){await live.equip(id);await game.waitForTimeout(300);rows.push({id,hit:await game.evaluate(()=>window.__learnStats[49])});}
assert.deepEqual(rows.map(r=>r.hit),[547,537,517]);assert.deepEqual(rows,old.after);assert.equal(rows[0].hit-rows[2].hit,30);assert.equal(rows[1].hit-rows[2].hit,20);
await fs.writeFile('artifacts/skill-live/axe-conditional-verify.json',JSON.stringify({skill:await game.evaluate(()=>window.__learnState[2276]),rows,previous:old,limitation:'Initial level-zero HIT was not captured; repeated weapon-condition comparison only.'},null,2));
// Retain new test mace in cart and restore the original axe to inventory.
await game.evaluate(()=>{const t=window.__fourthTest,i=t.inventory.getItemById(1501);if(!i)throw Error('mace missing');const p=new t.packet.CZ.MOVE_ITEM_FROM_BODY_TO_CART();p.index=i.index;p.count=1;t.network.sendPacket(p);});await game.waitForFunction(()=>!window.__fourthTest.inventory.getItemById(1501));
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.MOVE_ITEM_FROM_CART_TO_BODY();p.index=2;p.count=1;t.network.sendPacket(p);});await game.waitForTimeout(500);
let c=(await snapshot()).riding.find(r=>r.kind==='cart');if(!live.axeCartWasActive)await command('character.riding.update',{kind:'cart',enabled:false,fee:c.fee,ticket:c.ticket});
await command('character.skills.learn_all',{});await command('character.vitals.restore',{});return {rows,restored:true,extraTestMaceInCart:true};
