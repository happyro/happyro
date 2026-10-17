// Session fragment: read progress.md and verify current NPC stage before execution.
const out=[];
await jobNpc.travel('prt_in',75,106);out.push({npc:await jobNpc.contact(75,107),dialogue:await jobNpc.run(['我想参加测试'])});
await jobNpc.travel('prt_in',71,90);out.push({npc:await jobNpc.contact(71,91),dialogue:await jobNpc.run(['安德鲁爵士','弗拉姆贝尔格','挑衅 Lv.10','长矛回旋镖','风灵之矛','80%','告诉初心者','在战斗前线','荣誉'])});
await jobNpc.travel('prt_in',79,93);out.push({npc:await jobNpc.contact(79,94),dialogue:await jobNpc.run(['西拉库斯爵士'])});
await fs.writeFile('docs/development/job-change-review/evidence/knight-exams-start.json',JSON.stringify(out,null,2));
return {stages:out.map(s=>({npc:s.npc,last:s.dialogue.pages.slice(-2)})),state:await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>a.push({id:e.GID,name:e.display?.name,pos:Array.from(e.position),job:e.job}));return a})};
