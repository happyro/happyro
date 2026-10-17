assert.equal((await snapshot()).name,'JobDirectF');
const result={character:'JobDirectF',line:2,scope:'Actual Adventure Tools UI changes with normal character-selection re-entry after every stage',stages:[]};const file='docs/development/job-change-review/evidence/direct-mage-relog.json';
for(const job of [0,2,9,4001,4003,4010,4061,4255]){
 await game.locator('#game-tools').click();await game.locator('.tab-button[data-tab="character"]').click();await game.locator(`[data-job-id="${job}"]`).click();await game.locator('[data-action="apply-job"]').click();await game.locator('.ui-confirm [data-confirm]').click();await game.waitForTimeout(1500);
 const before=await snapshot();assert.equal(before.job_id,job);assert.equal(before.job_level,1);const skillsBefore=await game.evaluate(()=>window.__fourthTest.skills.getSkills().map(s=>({id:s.SKID,level:s.level})).sort((a,b)=>a.id-b.id));
 await game.keyboard.press('Escape');await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.RESTART();p.type=1;t.network.sendPacket(p);});await game.locator('#slot1').waitFor({state:'visible',timeout:30000});await game.locator('#slot1').click();await game.locator('.charinfo .ok').click();await game.waitForFunction(job=>window.__fourthTest.session.Playing&&window.__fourthTest.session.Entity?.job===job,job,{timeout:90000});await game.waitForTimeout(1500);
 const after=await snapshot();assert.equal(after.job_id,job);assert.equal(after.job_level,1);assert.equal(after.base_level,before.base_level);assert.deepEqual(after.traits,before.traits);
 const skillsAfter=await game.evaluate(()=>window.__fourthTest.skills.getSkills().map(s=>({id:s.SKID,level:s.level})).sort((a,b)=>a.id-b.id));assert.deepEqual(skillsAfter,skillsBefore);
 if(job===0||job===4001)assert(!skillsAfter.some(s=>s.id>=5214&&s.id<=5229),'Novice retained Arch Mage skills');
 result.stages.push({job,base:after.base_level,jobLevel:after.job_level,traits:after.traits.enabled,skills:skillsAfter,persisted:true});await fs.writeFile(file,JSON.stringify(result,null,2));
}
result.passed=true;await fs.writeFile(file,JSON.stringify(result,null,2));return {stages:result.stages.length,passed:true};
