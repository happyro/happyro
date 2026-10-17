const target=await live.durable();
await command('character.vitals.restore',{});
const rows=[];rows.push(await live.cast('GC_ROLLINGCUTTER',{restore:false,wait:1200}));rows.push(await live.cast('GC_CROSSRIPPERSLASHER',{target,restore:false,wait:6500}));
await fs.writeFile('artifacts/skill-live/rolling-combo.json',JSON.stringify({target,rows},null,2));return rows;
