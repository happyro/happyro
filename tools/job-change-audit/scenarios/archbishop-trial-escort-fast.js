assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch02');
const {walk}=await import('./walk.mjs?arch=8');
const proof={startedAt:new Date().toISOString(),moves:[],attacks:[],preparation:'Existing strengthened test character; native scroll summon; normal diagonal walking; Holy Light and prepared mercenary red potions protect native summon'};const file='docs/development/job-change-review/evidence/archbishop-trial-escort-fast.json';
const {escortGuard}=await import('./escort.mjs');const guard=escortGuard(game,proof);
for(const point of [[112,73],[94,123],[93,173],[114,186],[154,211],[201,240],[255,268],[269,302],[203,286],[155,320],[113,327]]){
 try{proof.moves.push({point,steps:await walk(game,snapshot,point,3,guard)});}catch(e){proof.error=e.message;break;}
 let s=await snapshot();if(s.map!=='job3_arch02'){proof.returned={map:s.map,x:s.x,y:s.y};proof.chat=await game.evaluate(()=>window.__fourthTest.chat._shadow.querySelector('.content')?.innerText);break;}
 for(let n=0;n<6;n++){
  const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[],pos=t.session.Entity.position;t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick&&Math.abs(e.position[0]-pos[0])<=6&&Math.abs(e.position[1]-pos[1])<=6)a.push({id:e.GID,job:e.job});});return a[0];});if(!target)break;
  await game.evaluate(id=>{window.__fourthTest.targeting.onUseSkillToId(156,1,id);},target.id);proof.attacks.push(target);await game.waitForTimeout(600);
 }
 await fs.writeFile(file,JSON.stringify(proof,null,2));
}
let s=await snapshot();proof.endedAt=new Date().toISOString();proof.final={map:s.map,x:s.x,y:s.y};await fs.writeFile(file,JSON.stringify(proof,null,2));return proof;
