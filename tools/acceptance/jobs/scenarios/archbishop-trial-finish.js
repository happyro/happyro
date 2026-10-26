assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch02');
const {walk}=await import('./walk.mjs?arch=8');
const proof={attacks:[],moves:[],preparation:'Existing strengthened test character; normal Holy Light skill, movement and mercenary commands; no quest writes'};const file='docs/development/job-change-review/evidence/archbishop-trial-finish.json';
const {escortGuard}=await import('./escort.mjs');const guard=escortGuard(game,proof);
const save=()=>fs.writeFile(file,JSON.stringify(proof,null,2));
async function boss(){
 for(let n=0;n<30;n++){
  assert.equal((await snapshot()).map,'job3_arch02');
  const target=await game.evaluate(()=>{let b;window.__fourthTest.entities.forEach(e=>{if(e.job===2036&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick)b={id:e.GID,hp:e.life.hp,pos:Array.from(e.position)};});return b;});
  if(!target)return;
  await game.evaluate(id=>window.__fourthTest.targeting.onUseSkillToId(156,1,id),target.id);proof.attacks.push(target);await save();await game.waitForTimeout(800);
 }
 throw Error('Valkyrie nightmare still present');
}
await boss();await jobNpc.contact(113,327);proof.mercenaryRefusal=await jobNpc.run([],80);await save();
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.MER_COMMAND();p.command=2;t.network.sendPacket(p);});await game.waitForTimeout(1000);
await jobNpc.contact(113,327);proof.firstHandoff=await jobNpc.run([],80);await game.waitForFunction(()=>!!window.__fourthTest.inventory.getItemById(12382),null,{timeout:15000});await save();
await game.evaluate(()=>{const t=window.__fourthTest;t.inventory.useItem(t.inventory.getItemById(12382));});await game.waitForTimeout(1500);
proof.secondSummon=await game.evaluate(()=>{const a=[];window.__fourthTest.entities.forEach(e=>{if(e.job===2038)a.push({id:e.GID,job:e.job});});return a;});assert(proof.secondSummon.length);await save();
for(const point of [[155,320],[203,286],[269,302],[288,283],[278,234],[234,179],[227,169],[244,46]]){
 proof.moves.push({point,steps:await walk(game,snapshot,point,3,guard)});await save();assert.equal((await snapshot()).map,'job3_arch02');
}
await boss();await jobNpc.contact(244,46);proof.secondHandoff=await jobNpc.run([],100);await save();
assert(await game.evaluate(()=>!!window.__fourthTest.inventory.getItemById(6154)),'No horn fragments');
proof.finalWalk=await walk(game,snapshot,[279,234],3,guard);proof.ending=await jobNpc.run([],150);await save();
const s=await snapshot();proof.result={job:s.job_id,base:s.base_level,jobLevel:s.job_level,map:s.map};await save();assert.equal(s.job_id,4063);assert.equal(s.job_level,1);return proof.result;
