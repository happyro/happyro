assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).job_id,4010);
const proof={stages:[]};const file='docs/development/job-change-review/evidence/warlock-npc-complete.json';
await jobNpc.travel('spl_in02',84,102);await jobNpc.contact(84,103);proof.stages.push({name:'Assistant accepts arena',...await jobNpc.run()});assert(proof.stages.at(-1).pages.some(p=>p.text?.includes('成功结晶')));await fs.writeFile(file,JSON.stringify(proof,null,2));
await command('character.stats.update',{str:99,agi:99,vit:99,int:99,dex:99,luk:1});
await jobNpc.travel('spl_in02',80,107);await jobNpc.contact(80,108);proof.stages.push({name:'Master changes job',...await jobNpc.run()});
const s=await snapshot();assert.equal(s.job_id,4061);assert.equal(s.job_level,1);proof.result={job:s.job_id,base:s.base_level,jobLevel:s.job_level};await fs.writeFile(file,JSON.stringify(proof,null,2));await game.screenshot({path:'docs/development/job-change-review/evidence/warlock-npc-complete.png'});return proof.result;
