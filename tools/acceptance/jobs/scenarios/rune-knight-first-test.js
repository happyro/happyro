assert.equal((await snapshot()).name,'JobAuditM');
const proof={preparation:'Lord Knight Base99 Job70, STR/AGI/VIT/DEX99 INT30 LUK1; NPC quest progress unchanged',stages:[]};
const save=async()=>fs.writeFile('docs/development/job-change-review/evidence/rune-knight-first-test.json',JSON.stringify(proof,null,2));
await command('character.stats.update',{str:99,agi:99,vit:99,int:30,dex:99,luk:1});
await jobNpc.travel('job3_rune01',80,61);await jobNpc.contact(80,60);proof.stages.push({name:'Captain',...await jobNpc.run()});await save();
await jobNpc.travel('job3_rune01',90,51);await jobNpc.contact(90,50);proof.stages.push({name:'Lunarea',...await jobNpc.run(['现在前往测试场'])});await save();
return {map:(await snapshot()).map,last:proof.stages.at(-1)};
