// Session fragment: read progress.md and verify current NPC stage before execution.
const stages=[];
await jobNpc.travel('prt_in',69,106);stages.push({npc:await jobNpc.contact(69,107),dialogue:await jobNpc.run(['温莎爵士', '寻找需要骑士','查看周围','阻止魔物','请队伍里的牧师','和队友商量','开聊天室','建议合适','告诉对方出口','可以请你治疗','四处询问'],80)});
await jobNpc.travel('prt_in',70,98);stages.push({npc:await jobNpc.contact(70,99),dialogue:await jobNpc.run(['艾米女士'])});
await fs.writeFile('docs/development/job-change-review/evidence/knight-ethics.json',JSON.stringify(stages,null,2));
return stages.map(s=>({npc:s.npc,last:s.dialogue.pages.slice(-2)}));
