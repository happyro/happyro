const {target,traversal,rows}=JSON.parse(await fs.readFile('artifacts/skill-live/cardinal-mastery-live.json','utf8'));
for(const level of [0,10]){
 if(level)for(let n=1;n<=10;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=5270;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[5270]?.level>=n,n,{timeout:5000,polling:50});}
 for(const id of [1501,1550,0]){
  if(rows.some(r=>r.level===level&&r.id===id))continue;
  if(id)await live.equip(id);else{await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQ_TAKEOFF_EQUIP();p.index=78;t.network.sendPacket(p);});await game.waitForFunction(()=>Boolean(window.__fourthTest.inventory.getItemById(1550)));}await game.waitForTimeout(250);await game.evaluate(target=>{window.__masteryHits=[];const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=target.id;p.action=7;t.network.sendPacket(p);},target);await game.waitForTimeout(8000);await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest[0]=t.session.Entity.position[0]|0;p.dest[1]=t.session.Entity.position[1]|0;t.network.sendPacket(p);});await game.waitForTimeout(400);
  const packets=await game.evaluate(()=>window.__masteryHits);const seen=new Set();const hits=packets.filter(p=>{if(p.GID!==2000000||p.targetGID!==target.id||p.damage<=0||p.action===10)return false;const k=p.startTime+':'+p.GID+':'+p.targetGID;if(seen.has(k))return false;seen.add(k);return true;});assert(hits.length>=3);rows.push({level,id,hits});await fs.writeFile('artifacts/skill-live/cardinal-mastery-live.json',JSON.stringify({target,traversal,rows},null,2));
 }
}
const ranges=rows.map(r=>({level:r.level,id:r.id,min:Math.min(...r.hits.map(p=>p.damage)),max:Math.max(...r.hits.map(p=>p.damage)),count:r.hits.length}));for(const id of [1501,1550])assert(ranges.find(r=>r.id===id&&r.level===10).min>ranges.find(r=>r.id===id&&r.level===0).max);
const dagger=ranges.filter(r=>r.id===0);assert(dagger[1].min<=dagger[0].max&&dagger[0].min<=dagger[1].max);
await fs.writeFile('artifacts/skill-live/cardinal-mastery-ranges.json',JSON.stringify(ranges,null,2));await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});await command('character.skills.learn_all',{});await command('character.vitals.restore',{});return ranges;
