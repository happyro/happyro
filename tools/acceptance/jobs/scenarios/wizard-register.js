assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).job_id,2);
const proof={character:'JobDirectF',stages:[]};const file='docs/development/job-change-review/evidence/wizard-registration.json';
for(const jobLevel of [39,50]){
 await command('character.progression.update',{base_level:99,job_level:jobLevel});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:0});
 await jobNpc.travel('gef_tower',111,36);await jobNpc.contact(111,37);const dialogue=await jobNpc.run(['我想成为巫师','是的，我要申请']);
 const s=await snapshot();assert.equal(s.job_id,2);
 if(jobLevel===39)assert(dialogue.pages.some(p=>p.text?.includes('至少要职业等级 40')));
 if(jobLevel===50)assert(dialogue.pages.some(p=>p.text?.includes('通过第一项测试')));
 proof.stages.push({jobLevel,dialogue,job:s.job_id});await fs.writeFile(file,JSON.stringify(proof,null,2));
}
return proof.stages.map(s=>({jobLevel:s.jobLevel,last:s.dialogue.pages.at(-1)}));
