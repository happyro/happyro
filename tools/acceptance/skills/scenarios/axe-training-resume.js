assert.equal(await game.evaluate(()=>window.__learnState[2276]?.level),0);
const ids=[1351,1501,1201];
// Cycle weapons so each subsequent item is in inventory when equipped.
const sample=async()=>{const rows=[];for(const id of ids){if(!await game.evaluate(id=>Boolean(window.__fourthTest.inventory.getItemById(id)),id))await live.grant(id);await live.equip(id);await game.waitForTimeout(250);rows.push({id,hit:await game.evaluate(()=>window.__learnStats[49])});}return rows;};
const before=await sample();
for(let n=1;n<=10;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=2276;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[2276]?.level>=n,n,{timeout:5000,polling:50});}
const after=await sample();
await fs.writeFile('artifacts/skill-live/axe-training-live.json',JSON.stringify({before,after},null,2));
assert.deepEqual(after.map((r,i)=>r.hit-before[i].hit),[30,20,0]);
await command('character.skills.learn_all',{});await command('character.vitals.restore',{});return {before,after,restored:true};
