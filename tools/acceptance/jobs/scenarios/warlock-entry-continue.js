assert.equal((await snapshot()).name,'JobDirectF');
const file='docs/development/job-change-review/evidence/warlock-entry.json';const proof={note:'Safe teleport arrival was91,129; moving toward100,132 then95,132 triggered native OnTouch. No NPC state edited.',stages:[]};
proof.stages.push({name:'Distorted space',...await jobNpc.run(['搜索周围','伸出手臂'])});await fs.writeFile(file,JSON.stringify(proof,null,2));
assert.equal((await snapshot()).map,'spl_in02');await jobNpc.travel('spl_in02',77,106);await jobNpc.contact(77,107);
proof.stages.push({name:'Assistant and master',...await jobNpc.run([0,0,0,'我需要做什么'],100)});await fs.writeFile(file,JSON.stringify(proof,null,2));return proof.stages.at(-1);
