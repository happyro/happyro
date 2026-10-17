assert.equal((await snapshot()).name,'JobDirectF');
globalThis.jobNpc=(await import('./dialogue.mjs')).dialogueDriver(game, snapshot);
await command('character.progression.update',{job_id:0,base_level:10,job_level:10});
await command('character.skills.learn_all',{});
await jobNpc.travel('izlude_in',74,171);await jobNpc.contact(74,172);
await game.locator('#NpcBox .next').click();await game.locator('#NpcMenu [data-index="1"]').click();await game.locator('#NpcMenu .ok').click();
await game.locator('#NpcBox .next').click();await game.locator('#NpcMenu [data-index="0"]').click();await game.locator('#NpcMenu .ok').click();
const proof={character:'JobDirectF',before:(await snapshot()).job_id,rejections:[]};
await game.locator('#game-tools').click();await game.locator('.tab-button[data-tab="character"]').click();
await game.locator('[data-job-id="4"]').click();await game.locator('[data-action="apply-job"]').click();
const responsePromise=game.waitForResponse(r=>r.url().endsWith('/character/commands')&&r.request().method()==='POST');
await game.locator('.ui-confirm [data-confirm]').click();const response=await responsePromise;
assert.equal(response.status(),409);proof.uiRejection=await response.json();assert.equal(proof.uiRejection.error.code,'character_progression_busy');
for(const payload of [{base_level:20},{job_level:5}]){
 await game.waitForTimeout(2200);
 const r=await game.request.post(`${api}/commands`,{headers,data:{idempotency_key:crypto.randomUUID(),type:'character.progression.update',payload}});
 assert.equal(r.status(),409);proof.rejections.push({payload,status:r.status(),body:await r.json()});
}
let s=await snapshot();assert.equal(s.job_id,0);assert.equal(s.base_level,10);assert.equal(s.job_level,10);
proof.unchanged={job:s.job_id,base:s.base_level,jobLevel:s.job_level};
await game.screenshot({path:'docs/development/job-change-review/evidence/npc-progression-blocked.png'});
await game.keyboard.press('Escape');await game.locator('#NpcBox .next').click();await game.waitForTimeout(500);
s=await snapshot();assert.equal(s.job_id,1);proof.nativeJob=s.job_id;
await game.locator('#NpcBox .close').click();
await command('character.progression.update',{job_id:4});s=await snapshot();assert.equal(s.job_id,4);proof.afterDialogueJob=s.job_id;
await fs.writeFile('docs/development/job-change-review/evidence/npc-progression-regression.json',JSON.stringify(proof,null,2));return proof;
