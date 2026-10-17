assert.equal((await snapshot()).name,'JobAuditM');
// Native knight audit has finished; JobDirectM retains the in-progress ranger quest.
const chains=[
[1,[0,3,11,4001,4004,4012,4062,4257]],
[3,[0,4,8,4001,4005,4009,4063,4256]],
[4,[0,1,14,4001,4002,4015,4073,4258]],
[5,[0,6,12,4001,4007,4013,4065,4254]],
[6,[0,5,10,4001,4006,4011,4064,4253]],
[7,[0,2,16,4001,4003,4017,4074,4261]],
[8,[0,5,18,4001,4006,4019,4078,4259]],
[9,[0,4,15,4001,4005,4016,4077,4262]],
[10,[0,6,17,4001,4007,4018,4079,4260]],
['11M',[0,3,19,4001,4004,4020,4075,4263]]
];
const completed=[];
for(const [line,jobs] of chains){
 const result={character:'JobAuditM',line,scope:'Actual Adventure Tools UI; normal character-selection re-entry and skill-state comparison after every stage',stages:[]};
 const file=`docs/development/job-change-review/evidence/direct-line-${line}-relog.json`;
 for(const job of jobs){
 await game.locator('#game-tools').click();await game.locator('.tab-button[data-tab="character"]').click();await game.locator(`[data-job-id="${job}"]`).click();await game.locator('[data-action="apply-job"]').click();await game.locator('.ui-confirm [data-confirm]').click();await game.waitForTimeout(1500);
 const before=await snapshot();assert.equal(before.job_id,job);assert.equal(before.job_level,1);const skillsBefore=await game.evaluate(()=>window.__fourthTest.skills.getSkills().map(s=>({id:s.SKID,level:s.level})).sort((a,b)=>a.id-b.id));
 await game.keyboard.press('Escape');await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.RESTART();p.type=1;t.network.sendPacket(p);});await game.locator('#slot0').waitFor({state:'visible',timeout:30000});await game.locator('#slot0').click();await game.locator('.charinfo .ok').click();await game.waitForFunction(job=>window.__fourthTest.session.Playing&&window.__fourthTest.session.Entity?.job===job,job,{timeout:90000});await game.waitForTimeout(1500);
 const after=await snapshot();assert.equal(after.job_id,job);assert.equal(after.job_level,1);assert.equal(after.base_level,before.base_level);assert.deepEqual(after.traits,before.traits);
 const skillsAfter=await game.evaluate(()=>window.__fourthTest.skills.getSkills().map(s=>({id:s.SKID,level:s.level})).sort((a,b)=>a.id-b.id));assert.deepEqual(skillsAfter,skillsBefore);
 if(job===0||job===4001)assert(!skillsAfter.some(s=>s.id>=5201&&s.id<=5400),'Novice retained fourth-job skills');
 result.stages.push({job,base:after.base_level,jobLevel:after.job_level,traits:after.traits.enabled,skills:skillsAfter,persisted:true});await fs.writeFile(file,JSON.stringify(result,null,2));
 }
 result.passed=true;await fs.writeFile(file,JSON.stringify(result,null,2));completed.push(line);
}
return {completed};
