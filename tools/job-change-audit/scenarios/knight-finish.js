// Session fragment: read progress.md and verify current NPC stage before execution.
const s=await snapshot();assert.equal(s.map,'prt_in','Patience test must return player naturally');
await jobNpc.travel('prt_in',87,91);const npc=await jobNpc.contact(87,92);
const interview=await jobNpc.run(['我想参加转职测试','为了变得更强','我能保护他人','进一步了解骑士','骑士可以选择'],80);
await jobNpc.travel('prt_in',88,100);const captain=await jobNpc.contact(88,101);const final=await jobNpc.run([],80);
const after=await snapshot();assert.equal(after.job_id,7);
await fs.writeFile('docs/development/job-change-review/evidence/knight-npc-complete.json',JSON.stringify({npc,interview,captain,final,result:{name:after.name,job:after.job_id,base:after.base_level,jobLevel:after.job_level}},null,2));
await game.screenshot({path:'docs/development/job-change-review/evidence/knight-npc-complete.png'});
return {job:after.job_id,last:final.pages.slice(-3)};
