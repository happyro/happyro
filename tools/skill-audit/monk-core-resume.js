const rows=[];rows.push(await live.cast('MO_FINGEROFFENSIVE',{wait:6500}));
for(const name of ['MO_BLADESTOP','CH_PALMSTRIKE','MO_BALKYOUNG']){rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast(name,{wait:name==='MO_BLADESTOP'?11000:6500}));}
rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast('MO_EXPLOSIONSPIRITS',{wait:1500}));rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast('MO_EXTREMITYFIST',{wait:6500}));rows.push(await live.cast('MO_STEELBODY',{wait:6500}));
await game.screenshot({path:'artifacts/skill-live/champion.png'});return rows;
