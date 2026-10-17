assert.equal((await snapshot()).name,'JobAuditF');
await command('character.stats.update',{str:5000,agi:99,vit:1000,int:99,dex:500,luk:1});await command('character.vitals.restore',{});
const proof={preparation:'Dedicated test character strengthened; ordinary attacks and walking; no quest edits.',stages:[]};
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[168,160];t.network.sendPacket(p);});await game.waitForTimeout(2000);
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[168,170];t.network.sendPacket(p);});await game.waitForTimeout(2000);
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[168,177];t.network.sendPacket(p);});await game.waitForTimeout(2000);
const entrance=await snapshot();assert(entrance.x<120,'Did not enter mummy corridor');
for(const y of [50,60,70,80,90,100,103]){
 for(let n=0;n<30;n++){
  if(await game.locator('#NpcBox .content').isVisible())await jobNpc.run([]);
  const s=await snapshot();if(s.map!=='job_prist')break;
  const target=await game.evaluate(()=>{let found;window.__fourthTest.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&!found)found={id:e.GID,job:e.job};});return found;});
  await game.evaluate(({target,y})=>{const t=window.__fourthTest;const p=target?new t.packet.CZ.REQUEST_ACT2():new t.packet.CZ.REQUEST_MOVE2();if(target){p.targetGID=target.id;p.action=7;}else p.dest=[98,y];t.network.sendPacket(p);},{target,y});
  proof.stages.push({y,target});await game.waitForTimeout(650);
  const after=await snapshot();if(!target&&Math.abs(after.y-y)<2)break;
 }
}
const s=await snapshot();proof.result={map:s.map,x:s.x,y:s.y};assert.equal(s.map,'prt_church','Trial did not return to church');await fs.writeFile('docs/development/job-change-review/evidence/priest-mummies.json',JSON.stringify(proof,null,2));return proof.result;
