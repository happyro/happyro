assert.equal((await snapshot()).name,'JobDirectM');
await jobNpc.contact(156,36);
const proof={registration:await jobNpc.run(['再告诉我一次任务内容','我开始'],80)};
const {walk}=await import('./walk.mjs?ranger=2');
proof.walk=await walk(game,snapshot,[91,169],2);
await jobNpc.contact(91,169);
proof.instructor=await jobNpc.run(['我是来参加测试的'],80);
await fs.writeFile('docs/development/job-change-review/evidence/ranger-survival.json',JSON.stringify(proof,null,2));
return proof;
