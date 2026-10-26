await game.waitForFunction(()=>window.__fourthTest.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:120000});
await live.job(4261,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
const rows=[];for(const name of ['SO_SUMMON_AGNI','SO_SUMMON_AQUA','SO_SUMMON_VENTUS','SO_SUMMON_TERA']){rows.push(await live.cast(name,{level:3,wait:5500}));rows.push(await live.cast('SO_EL_CONTROL',{level:3,wait:1000}));rows.push(await live.cast('SO_EL_ACTION',{target:await live.durable(),wait:6500}));}
await fs.writeFile('artifacts/skill-live/elemental-fixed.json',JSON.stringify(rows,null,2));await game.screenshot({path:'artifacts/skill-live/elemental-fixed.png'});return rows;
