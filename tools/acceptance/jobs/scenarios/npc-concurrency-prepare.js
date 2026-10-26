// Pre-fix reproduction; not a passing regression. Use npc-progression-regression.js for the fixed behavior.
assert.equal((await snapshot()).name,'JobDirectF');
await game.locator('[data-job-id="0"]').click();await game.locator('[data-action="apply-job"]').click();await game.locator('.ui-confirm [data-confirm]').click();await game.waitForTimeout(2200);
await command('character.progression.update',{base_level:10,job_level:10});await command('character.skills.learn_all',{});
await game.keyboard.press('Escape');
globalThis.jobNpc=(await import('./dialogue.mjs')).dialogueDriver(game, snapshot);
await jobNpc.travel('izlude_in',74,171);
await game.mouse.move(483,270);await game.waitForTimeout(300);await game.mouse.click(483,270);
await game.waitForTimeout(700);
return {visible:await game.locator('#NpcBox .content').isVisible(),text:await game.locator('#NpcBox .content').isVisible()?await game.locator('#NpcBox .content').innerText():null};
