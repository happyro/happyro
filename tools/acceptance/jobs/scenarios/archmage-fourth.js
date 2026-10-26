assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).job_id,4061);
const proof={stages:[]};const file='docs/development/job-change-review/evidence/archmage-fourth.json';
for(const [name,base,job,points,choice,expected] of [['Base below200',199,70,0,null,4061],['Job below70',200,69,0,null,4061],['Unused skill point',200,70,1,null,4061],['Cancel',200,70,0,'暂不转职',4061],['Confirm',200,70,0,'确认四转',4255]]){
 await command('character.progression.update',{base_level:base,job_level:job});await command('character.skills.learn_all',{});await command('character.points.update',{skill_points:points});
 await jobNpc.travel('prontera',153,192);await jobNpc.contact(153,193);const dialogue=await jobNpc.run(choice?[choice]:[]);
 const s=await snapshot();assert.equal(s.job_id,expected);if(expected===4255){assert.equal(s.job_level,1);assert.equal(s.base_level,200);assert(s.traits.enabled);}
 proof.stages.push({name,dialogue,result:{job:s.job_id,base:s.base_level,jobLevel:s.job_level,traits:s.traits,skillPoints:s.skill_points}});await fs.writeFile(file,JSON.stringify(proof,null,2));
}
return proof.stages.map(s=>({name:s.name,job:s.result.job}));
