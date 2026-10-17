// Pre-fix reproduction; not a passing regression. Use npc-progression-regression.js for the fixed behavior.
assert.equal((await snapshot()).name,'JobDirectF');
await game.locator('#NpcBox .next').click();await game.locator('#NpcMenu [data-index="1"]').click();await game.locator('#NpcMenu .ok').click();
await game.locator('#NpcBox .next').click();await game.locator('#NpcMenu [data-index="0"]').click();await game.locator('#NpcMenu .ok').click();
const dialogue=await game.locator('#NpcBox .content').innerText();
const before=await snapshot();assert.equal(before.job_id,0);
await game.locator('#game-tools').click();await game.locator('.tab-button[data-tab="character"]').click();
await game.locator('[data-job-id="4"]').click();await game.locator('[data-action="apply-job"]').click();await game.locator('.ui-confirm [data-confirm]').click();await game.waitForTimeout(2200);
const during=await snapshot();
await game.keyboard.press('Escape');
const visible=await game.locator('#NpcBox .next').isVisible();
if(visible){await game.locator('#NpcBox .next').click();await game.waitForTimeout(500);}
const after=await snapshot();
const proof={character:after.name,dialogue,before:before.job_id,toolChangeWhileNpcOpen:during.job_id,npcContinues:visible,afterNpc:after.job_id};
await fs.writeFile('docs/development/job-change-review/evidence/npc-job-change-concurrency-before.json',JSON.stringify(proof,null,2));
return proof;
