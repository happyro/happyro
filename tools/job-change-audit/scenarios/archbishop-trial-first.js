assert.equal((await snapshot()).name,'JobAuditF');assert.equal((await snapshot()).map,'job3_arch01');
await command('character.stats.update',{str:5000,agi:5000,vit:10000,int:5000,dex:500,luk:500});await command('character.vitals.restore',{});
const proof={preparation:'Existing level99/job70, learned skills; strengthened dedicated test role; no quest or timer writes',moves:[]};const file='docs/development/job-change-review/evidence/archbishop-trial-first.json';
await jobNpc.contact(29,34);proof.entry=await jobNpc.run([],80);await game.waitForTimeout(2000);assert.equal((await snapshot()).map,'job3_arch02');
proof.scroll=await game.evaluate(()=>{const t=window.__fourthTest,i=t.inventory.getItemById(12381);if(!i)throw Error('Trial did not provide scroll');t.inventory.useItem(i);return {id:i.ITID,index:i.index};});await game.waitForTimeout(1000);
proof.summon=await game.evaluate(()=>{const a=[];window.__fourthTest.entities.forEach(e=>{if(e.job===2037)a.push({id:e.GID,job:e.job});});return a;});assert(proof.summon.length,'No Valkyrie incarnation visible');await fs.writeFile(file,JSON.stringify(proof,null,2));
const {walk}=await import('./walk.mjs?arch=3');
try{proof.moves=await walk(game,snapshot,[113,327],5);const s=await snapshot();proof.result={map:s.map,x:s.x,y:s.y,hp:s.hp};assert.equal(s.map,'job3_arch02');}catch(e){proof.error=e.message;}
await fs.writeFile(file,JSON.stringify(proof,null,2));return proof;
