// Run through control.py against JobDirectF, port 9361. Real UI changes; no NPC claims.
assert.equal((await snapshot()).name,'JobDirectF');
await game.locator('#game-tools').click();
await game.locator('.tab-button[data-tab="character"]').click();
await game.locator('[data-action="apply-job"]').waitFor();
const chains=[
 [1,[0,3,11,4001,4004,4012,4062,4257]],
 [2,[0,2,9,4001,4003,4010,4061,4255]],
 [3,[0,4,8,4001,4005,4009,4063,4256]],
 [4,[0,1,14,4001,4002,4015,4073,4258]],
 [5,[0,6,12,4001,4007,4013,4065,4254]],
 [6,[0,5,10,4001,4006,4011,4064,4253]],
 [7,[0,2,16,4001,4003,4017,4074,4261]],
 [8,[0,5,18,4001,4006,4019,4078,4259]],
 [9,[0,4,15,4001,4005,4016,4077,4262]],
 [10,[0,6,17,4001,4007,4018,4079,4260]],
 ['11F',[0,3,20,4001,4004,4021,4076,4264]],
 [12,[0,1,7,4001,4002,4008,4060,4252]]
];
const result=JSON.parse(await fs.readFile('docs/development/job-change-review/evidence/direct-female.json','utf8').catch(()=> 'null')) || {character:'JobDirectF',scope:'Adventure UI transition checks; native NPC and relog not covered',startedAt:new Date().toISOString(),chains:[]};
for(const [line,jobs] of chains){
 if(result.chains.some(c=>c.line===line&&c.transitionsPassed))continue;
 const previous=result.chains.find(c=>c.line===line);
 if(previous){(result.interruptedAttempts ||= []).push(previous);result.chains=result.chains.filter(c=>c.line!==line);}
 const record={line,stages:[]};result.chains.push(record);
 for(const id of jobs){
  const before=await snapshot();
  if(before.job_id===id){record.stages.push({job:id,baseline:true});continue;}
  await game.locator(`[data-job-id="${id}"]`).click();
  await game.locator('[data-action="apply-job"]').click();
  await game.locator('.ui-confirm [data-confirm]').click();
  await game.waitForTimeout(2300);
  const after=await snapshot();
  assert.equal(after.job_id,id,`line ${line}, job ${id}`);
  assert.equal(after.job_level,1);
  assert(after.base_level>=after.min_base_level&&after.base_level<=after.max_base_level);
  const client=await game.evaluate(()=>({job:window.__fourthTest.session.Entity.job,skills:Object.keys(window.__fourthTest.skills)}));
  assert.equal(client.job,id);
  record.stages.push({from:before.job_id,to:id,base:after.base_level,jobLevel:after.job_level,skillPoints:after.skill_points,traitsEnabled:after.traits.enabled,clientJob:client.job});
  await fs.writeFile('docs/development/job-change-review/evidence/direct-female.json',JSON.stringify(result,null,2));
 }
 record.transitionsPassed=true;
 await fs.writeFile('docs/development/job-change-review/evidence/direct-female.json',JSON.stringify(result,null,2));
 await game.screenshot({path:`docs/development/job-change-review/evidence/direct-line-${line}.png`});
 console.log('Direct transition chain',line,'passed; persistence and native still separate');
}
await fs.writeFile('docs/development/job-change-review/evidence/direct-female.json',JSON.stringify(result,null,2));
return {chains:result.chains.length,transitions:result.chains.reduce((n,c)=>n+c.stages.filter(s=>!s.baseline).length,0)};
