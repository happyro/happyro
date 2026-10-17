// Session fragment: read progress.md and verify current NPC stage before execution.
const fights=[];
for(let stage=0;stage<3;stage++){
 const kills=[];const deadline=Date.now()+150000;
 while(Date.now()<deadline){
  if(await game.locator('#NpcBox .content').isVisible())break;
  const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0)a.push({id:e.GID,name:e.display?.name,job:e.job,pos:Array.from(e.position),hp:e.life.hp})});return a[0]});
  if(!target){await game.waitForTimeout(300);continue;}
  await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p)},target.id);
  kills.push(target);
  await game.waitForTimeout(900);
 }
 const dialogue=await jobNpc.run([]);fights.push({stage:stage+1,targets:kills,dialogue});
 await fs.writeFile('docs/development/job-change-review/evidence/knight-combat.json',JSON.stringify({preparation:'Base70 Job50, STR/AGI/VIT/DEX99 INT30 LUK1, learned Swordman skills; real attacks only',fights},null,2));
 if(!(await game.locator('#NpcBox .content').count())&&Date.now()>deadline)throw Error('Battle timed out');
 await game.waitForTimeout(1000);
}
return {fights:fights.map(f=>({stage:f.stage,attacks:f.targets.length,last:f.dialogue.pages.slice(-1)})),map:(await snapshot()).map};
