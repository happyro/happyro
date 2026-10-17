assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch02');
const {walk}=await import('./walk.mjs?arch=3');
const proof={moves:[],attacks:[],preparation:'Existing strengthened test character; native scroll summon; normal walking and attacks'};const file='docs/development/job-change-review/evidence/archbishop-trial-walk.json';
for(const point of [[112,73],[94,123],[93,173],[114,186],[154,211],[201,240],[255,268],[269,302],[203,286],[155,320],[113,327]]){
 try{proof.moves.push({point,steps:await walk(game,snapshot,point,3)});}catch(e){proof.error=e.message;break;}
 let s=await snapshot();if(s.map!=='job3_arch02'){proof.returned={map:s.map,x:s.x,y:s.y};break;}
 for(let n=0;n<12;n++){
  const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[],pos=t.session.Entity.position;t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick&&Math.abs(e.position[0]-pos[0])<=12&&Math.abs(e.position[1]-pos[1])<=12)a.push({id:e.GID,job:e.job});});return a[0];});if(!target)break;
  await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.attacks.push(target);await game.waitForTimeout(600);
 }
 await fs.writeFile(file,JSON.stringify(proof,null,2));
}
let s=await snapshot();proof.final={map:s.map,x:s.x,y:s.y};await fs.writeFile(file,JSON.stringify(proof,null,2));return proof;
