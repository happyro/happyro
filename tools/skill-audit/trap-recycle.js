await live.job(4257,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});await live.grant(1065,5);
const before=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(1065).count);
const pos=await game.evaluate(()=>{const e=window.__fourthTest.session.Entity;return {x:(e.position[0]|0)+2,y:e.position[1]|0};});
await live.cast('HT_FREEZINGTRAP',{target:pos,wait:1800});const row=live.results.at(-1);const unit=row.observed.packets.find(p=>p.name==='PACKET_ZC_SKILL_ENTRY5');assert(unit,'Trap placed');
const placed=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(1065).count);assert.equal(placed,before-1);
await live.cast('HT_REMOVETRAP',{target:{id:unit.AID},wait:2000});const removed=live.results.at(-1);
const after=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(1065).count);
await fs.writeFile('artifacts/skill-live/trap-recycle.json',JSON.stringify({before,placed,after,placement:row.observed,removal:removed.observed},null,2));assert.equal(after,before);return {before,placed,after};
