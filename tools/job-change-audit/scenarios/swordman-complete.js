// Session fragment: read progress.md and verify current NPC stage before execution.
const log=[];const read=async()=>log.push(await game.locator('#NpcBox .content').innerText());
await game.locator('#NpcMenu [data-index="1"]').click();
await game.locator('#NpcMenu .ok').click();
await game.waitForTimeout(300);await read();
await game.locator('#NpcBox .next').click();
await game.locator('#NpcMenu [data-index="0"]').click();
await game.locator('#NpcMenu .ok').click();
await game.waitForTimeout(300);await read();
await game.locator('#NpcBox .next').click();
await game.waitForTimeout(500);await read();
const after=await snapshot();assert.equal(after.job_id,1);
await game.screenshot({path:'docs/development/job-change-review/evidence/swordman-npc.png'});
await game.locator('#NpcBox .close').click();
const proof={character:after.name,preparation:['Base10 Job10 via adventure API','learn_all basic skills via adventure API','normal navigation teleport to izlude_in 74,171'],interaction:'CONTACTNPC from browser; all subsequent choices and next/close clicked in actual dialogue UI',dialogue:log,result:{job:after.job_id,baseLevel:after.base_level,jobLevel:after.job_level,skillPoints:after.skill_points},scope:'Novice to Swordman only; complete knight/crusader chains not yet verified'};
await fs.writeFile('docs/development/job-change-review/evidence/swordman-npc.json',JSON.stringify(proof,null,2));return proof;
