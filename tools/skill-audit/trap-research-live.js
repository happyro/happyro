await live.job(4056,175,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});
await game.evaluate(()=>{window.__learnState={};window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};});
await command('character.skills.reset',{});
await game.waitForFunction(()=>window.__learnState[1]&&window.__learnState[2248]?.level===0);
const traversal=await live.learnPrior('Ranger',2248);
assert.equal(traversal.target.level,0);
const sample=()=>game.evaluate(()=>({stats:{...window.__learnStats},int:window.__audit.packets.filter(p=>p.statusType===16).at(-1),skill:structuredClone(window.__learnState[2248])}));
const before=await sample();
for(let n=1;n<=10;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=2248;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[2248]?.level>=n,n,{timeout:5000,polling:50});}
const after=await sample();
await command('character.stats.update',{str:1000,agi:80,vit:80,int:110,dex:120,luk:120});await game.waitForTimeout(300);
const controlled=await sample();
await fs.writeFile('artifacts/skill-live/trap-research-live.json',JSON.stringify({traversal,before,after,controlled},null,2));
assert.equal(after.int.plusStatus-before.int.plusStatus,10);
assert.equal(controlled.int.defaultStatus+controlled.int.plusStatus,before.int.defaultStatus+before.int.plusStatus);
assert.equal(controlled.stats[8]-before.stats[8],400);
await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});await command('character.skills.learn_all',{});await command('character.vitals.restore',{});
return {int:[before.int,after.int],maxsp:[before.stats[8],after.stats[8],controlled.stats[8]],restored:true};
