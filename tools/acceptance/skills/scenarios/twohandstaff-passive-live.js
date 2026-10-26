await live.job(4255,275,60);
await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});
await game.evaluate(()=>{window.__learnState={};});
await command('character.skills.reset',{});
if(!await game.evaluate(()=>Boolean(window.__fourthTest.inventory.getItemById(2000))))await live.grant(2000);
const staffIndex=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(2000).index);
if(!await game.evaluate(index=>window.__fourthTest.inventory.equippedItems.includes(index),staffIndex))await live.equip(2000);
const traversal=await live.learnPrior('Arch_Mage',5228);
assert.equal(traversal.target.level,0);
const sample=()=>game.evaluate(()=>({stats:{...window.__learnStats},skill:structuredClone(window.__learnState[5228])}));
const before=await sample();
for(let n=1;n<=10;n++){
 await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=5228;t.network.sendPacket(p);});
 await game.waitForFunction(n=>window.__learnState[5228]?.level>=n,n,{timeout:5000,polling:50});
}
const after=await sample();
await game.evaluate(index=>{const t=window.__fourthTest,p=new t.packet.CZ.REQ_TAKEOFF_EQUIP();p.index=index;t.network.sendPacket(p);},staffIndex);
await game.waitForFunction(()=>Boolean(window.__fourthTest.inventory.getItemById(2000)));
await game.waitForTimeout(200);
const unequipped=await sample();
await live.equip(2000);await game.waitForTimeout(200);
const reequipped=await sample();
await fs.writeFile('artifacts/skill-live/twohandstaff-passive-live.json',JSON.stringify({traversal,before,after,unequipped,reequipped},null,2));
assert.equal(after.stats[226]-before.stats[226],20);
assert.equal(after.stats[226]-unequipped.stats[226],20);
assert.equal(reequipped.stats[226],after.stats[226]);
await command('character.skills.learn_all',{});await command('character.vitals.restore',{});
return {upgrades:traversal.learned.length,smatk:[before.stats[226],after.stats[226],unequipped.stats[226],reequipped.stats[226]]};
