await live.job(4058,175,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});
let m=(await snapshot()).riding.find(r=>r.kind==='mado');if(m?.active)await command('character.riding.update',{kind:m.kind,enabled:false,fee:m.fee,ticket:m.ticket});
await game.evaluate(()=>{window.__learnState={};window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};});await command('character.skills.reset',{});await game.waitForFunction(()=>window.__learnState[1]&&window.__learnState[2255]?.level===0);
const traversal=await live.learnPrior('Mechanic',2255);
for(let n=1;n<=5;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=2255;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[2255]?.level>=n,n,{timeout:5000,polling:50});}
const sample=()=>game.evaluate(()=>({stats:{...window.__learnStats},skill:structuredClone(window.__learnState[2266])}));
const unmounted=await sample();m=(await snapshot()).riding.find(r=>r.kind==='mado');assert(m);await command('character.riding.update',{kind:m.kind,enabled:true,fee:m.fee,ticket:m.ticket});await game.waitForTimeout(400);
const before=await sample();
for(let n=1;n<=4;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=2266;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[2266]?.level>=n,n,{timeout:5000,polling:50});}
const after=await sample();m=(await snapshot()).riding.find(r=>r.kind==='mado');await command('character.riding.update',{kind:m.kind,enabled:false,fee:m.fee,ticket:m.ticket});await game.waitForTimeout(400);
const off=await sample();await fs.writeFile('artifacts/skill-live/mainframe-passive-live.json',JSON.stringify({traversal,unmounted,before,after,off},null,2));
assert.equal(after.stats[46]-before.stats[46],100);assert.equal(off.stats[46],unmounted.stats[46]);
await command('character.skills.learn_all',{});await command('character.vitals.restore',{});return {def:[unmounted.stats[46],before.stats[46],after.stats[46],off.stats[46]],restored:true};
