// Session fragment: read progress.md and verify current NPC stage before execution.
globalThis.jobNpc=(await import('./dialogue.mjs')).dialogueDriver(game, snapshot);
await command('character.progression.update',{base_level:70,job_level:50});
await command('character.skills.learn_all',{});
await command('character.points.update',{skill_points:0});
await jobNpc.travel('prt_in',88,100);const npc=await jobNpc.contact(88,101);
const dialogue=await jobNpc.run(['我想转职为骑士','是的，我要申请']);
await fs.writeFile('docs/development/job-change-review/evidence/knight-registration.json',JSON.stringify({npc,preparation:'Base70 Job50, learn_all skills, skill_points0; no quest variables edited',dialogue},null,2));
return dialogue;
