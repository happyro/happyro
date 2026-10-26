// Prerequisite: complete native Priest quest on JobAuditF. Does not alter quest variables.
const initial=await snapshot();assert.equal(initial.name,'JobAuditF');assert.equal(initial.job_id,8);
await command('character.progression.update',{base_level:99,job_level:50});
await command('character.skills.learn_all',{});
await command('character.points.update',{skill_points:0});
const items=await game.evaluate(()=>{const inv=window.__fourthTest.inventory,a=[];for(let n=2;n<202;n++){const item=inv.getItemByIndex(n);if(item)a.push({id:item.ITID,index:item.index,count:item.count||1});}return a;});
for(const item of items){
 await game.evaluate(item=>{const t=window.__fourthTest,p=new t.packet.CZ.ITEM_THROW2();p.Index=item.index;p.count=item.count;t.network.sendPacket(p);},item);
 await game.waitForTimeout(200);
}
const before=await snapshot();assert(before.zeny<=1285000);
if(before.zeny<1285000){
 const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/currency/zeny/grants',{headers,data:{idempotency_key:crypto.randomUUID(),amount:1285000-before.zeny}});assert.equal(r.status(),200,await r.text());
}
const stages=[];
const checkpoint=async()=>fs.writeFile('docs/development/job-change-review/evidence/priest-rebirth-progress.json',JSON.stringify({stages},null,2));
await jobNpc.travel('yuno_in02',88,163);stages.push({npc:await jobNpc.contact(88,164),dialogue:await jobNpc.run(['捐赠'])});
assert.equal((await snapshot()).zeny,0);await checkpoint();
await jobNpc.travel('yuno_in02',93,206);stages.push({npc:await jobNpc.contact(93,207),dialogue:await jobNpc.run()});await checkpoint();
await jobNpc.travel('yuno_in05',49,42);const heart=await jobNpc.contact(49,43).catch(e=>({note:'Heart warps immediately without a dialogue',error:e.message}));
await game.waitForTimeout(2000);assert.equal((await snapshot()).map,'valkyrie');
await jobNpc.travel('valkyrie',48,85);stages.push({npc:await jobNpc.contact(48,86),dialogue:await jobNpc.run([],80)});
const after=await snapshot();assert.equal(after.job_id,4001);assert.equal(after.base_level,1);assert.equal(after.job_level,1);
await fs.writeFile('docs/development/job-change-review/evidence/priest-rebirth.json',JSON.stringify({preparation:'Base99 Job50, learned skills and zero spare points, discarded test items, exactly1285000 Zeny; all quest stages via native NPC',discardedItems:items,stages,heart,result:{job:after.job_id,base:after.base_level,jobLevel:after.job_level,skillPoints:after.skill_points,zeny:after.zeny}},null,2));
return {job:after.job_id,base:after.base_level,jobLevel:after.job_level};
