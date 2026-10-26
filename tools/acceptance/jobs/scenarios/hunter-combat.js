assert.equal((await snapshot()).name,'JobDirectM');const proof={preparation:'DEX5000 VIT1000 on dedicated test role, normal bow attacks, no quest/timer changes',events:[]};const file='docs/development/job-change-review/evidence/hunter-combat.json';
const path=[[90,77],[90,87],[90,97],[80,87],[70,80],[60,75],[53,73],[63,80],[73,87],[83,97],[93,97],[103,87],[113,78],[123,70],[113,80],[103,90],[93,100],[89,110],[89,120],[89,127],[93,117],[93,107],[93,100]];let point=0;
for(let n=0;n<145;n++){
 const s=await snapshot();assert(s.map==='job_hunte'&&s.x<150,'Trial returned to waiting room or another map');
 const targets=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&e.display?.name==='转职怪物')a.push({id:e.GID,job:e.job,pos:Array.from(e.position),name:e.display.name});});return a;});
 if(targets.length){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},targets[0].id);proof.events.push({attack:targets[0]});}
 else if(point<path.length){const dest=path[point];await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},dest);if(Math.abs(s.x-dest[0])<2&&Math.abs(s.y-dest[1])<2)point++;proof.events.push({move:dest,position:[s.x,s.y]});}
 if(await game.locator('#NpcBox .content').isVisible()){proof.dialogue=await jobNpc.run(['逃脱']);break;}
 await fs.writeFile(file,JSON.stringify(proof,null,2));await game.waitForTimeout(500);
}
await fs.writeFile(file,JSON.stringify(proof,null,2));return {events:proof.events.length,point,dialogue:proof.dialogue};
