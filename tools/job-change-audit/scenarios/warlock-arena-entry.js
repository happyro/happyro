assert.equal((await snapshot()).name,'JobDirectF');
await command('character.stats.update',{str:5000,agi:99,vit:1000,int:5000,dex:500,luk:1});await command('character.vitals.restore',{});
const proof={preparation:'Strengthened dedicated role; original NPC arena conditions and timers unchanged',stages:[]};const file='docs/development/job-change-review/evidence/warlock-arena-entry.json';
await jobNpc.travel('spl_in02',80,107);await jobNpc.contact(80,108);proof.stages.push({name:'Master',...await jobNpc.run()});await fs.writeFile(file,JSON.stringify(proof,null,2));
await jobNpc.travel('spl_in02',84,102);await jobNpc.contact(84,103);proof.stages.push({name:'Assistant',...await jobNpc.run()});await fs.writeFile(file,JSON.stringify(proof,null,2));
assert.equal((await snapshot()).map,'job3_war01');return {map:'job3_war01'};
