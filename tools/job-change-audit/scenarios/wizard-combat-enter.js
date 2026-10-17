assert.equal((await snapshot()).name,'JobDirectF');
await command('character.stats.update',{str:5000,agi:99,vit:1000,int:99,dex:500,luk:1});await command('character.vitals.restore',{});
await jobNpc.contact(102,24);const dialogue=await jobNpc.run(['我想听听','继续测试']);
const s=await snapshot();assert.equal(s.map,'job_wiz');
await fs.writeFile('docs/development/job-change-review/evidence/wizard-combat-entry.json',JSON.stringify({preparation:'STR5000 AGI99 VIT1000 INT99 DEX500 LUK1; strengthened dedicated test role, not a difficulty benchmark',dialogue,arrival:{map:s.map,x:s.x,y:s.y}},null,2));return {map:s.map,x:s.x,y:s.y,rooms:await game.locator('#EntityRoom button').allTextContents()};
