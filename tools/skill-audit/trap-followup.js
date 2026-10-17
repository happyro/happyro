const rows=[];
const p=await game.evaluate(()=>{const e=window.__fourthTest.session.Entity;return {x:e.position[0]|0,y:e.position[1]|0};});
rows.push(await live.cast('HT_FREEZINGTRAP',{target:{x:p.x+1,y:p.y},wait:2000}));
rows.push(await live.cast('WH_DEEPBLINDTRAP',{target:{x:p.x+3,y:p.y+3},wait:6000}));
rows.push(await live.cast('WH_SOLIDTRAP',{target:{x:p.x-3,y:p.y+3},wait:6000}));
const units=await game.evaluate(()=>{const a=[];window.__fourthTest.entities.forEach(e=>{if(e.objecttype!==0)a.push({id:e.GID,job:e.job,type:e.objecttype,pos:Array.from(e.position)});});return a;});
await fs.writeFile('artifacts/skill-live/trap-units.json',JSON.stringify(units,null,2));
return {rows,units};
