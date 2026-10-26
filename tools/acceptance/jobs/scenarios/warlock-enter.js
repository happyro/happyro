assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).job_id,4010);
await command('character.progression.update',{base_level:99,job_level:70});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
const proof={stages:[]};const file='docs/development/job-change-review/evidence/warlock-entry.json';
await jobNpc.travel('morocc',94,132);
if(!await game.locator('#NpcBox .content').isVisible()){
 await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[95,132];t.network.sendPacket(p);});
 await game.locator('#NpcBox .content').waitFor({state:'visible',timeout:15000});
}
proof.stages.push({name:'Distorted space',...await jobNpc.run(['搜索周围','伸出手臂'])});
await fs.writeFile(file,JSON.stringify(proof,null,2));assert.equal((await snapshot()).map,'spl_in02');
await jobNpc.travel('spl_in02',77,106);await jobNpc.contact(77,107);proof.stages.push({name:'Assistant',...await jobNpc.run()});await fs.writeFile(file,JSON.stringify(proof,null,2));return proof.stages.at(-1);
