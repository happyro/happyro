assert.equal((await snapshot()).name,'JobAuditF');const proof=[];
for(const [y,choices] of [[45,['恶魔，滚出我的视线','闭嘴']],[80,['不成交','我永远不会听你的']],[115,['上帝会保护我','滚开，卑鄙的恶魔']],[150,['不，巴风特']]]){
 if(!await game.locator('#NpcBox .content').isVisible()) {
  let s=await snapshot();
  while(s.y<y-1){const dest=Math.min(y-1,s.y+10);await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[168,dest];t.network.sendPacket(p);},dest);await game.waitForTimeout(1800);const next=await snapshot();assert(next.y!==s.y,'Walk did not advance');s=next;if(await game.locator('#NpcBox .content').isVisible())break;}
 }
 await game.locator('#NpcBox .content').waitFor({state:'visible',timeout:20000});proof.push({y,...await jobNpc.run(choices)});
 await fs.writeFile('docs/development/job-change-review/evidence/priest-temptations.json',JSON.stringify(proof,null,2));
}
return proof.map(p=>({y:p.y,waiting:p.waiting}));
