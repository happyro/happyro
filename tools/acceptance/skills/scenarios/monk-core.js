const rows=[];
await live.job(4016,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:100,dex:120,luk:30});await live.grant(1801);await live.equip(1801);
rows.push(await live.cast('MO_CALLSPIRITS',{wait:2500}));rows.push(await live.cast('MO_ABSORBSPIRITS',{wait:1500}));
for(const name of ['MO_INVESTIGATE','MO_FINGEROFFENSIVE','MO_BLADESTOP','CH_PALMSTRIKE','MO_BALKYOUNG']){rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast(name,{wait:name==='MO_BLADESTOP'?11000:6500}));}
rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast('MO_EXPLOSIONSPIRITS',{wait:1500}));rows.push(await live.cast('CH_SOULCOLLECT',{wait:2000}));rows.push(await live.cast('MO_EXTREMITYFIST',{wait:6500}));
rows.push(await live.cast('MO_STEELBODY',{wait:6500}));
await game.screenshot({path:'artifacts/skill-live/champion.png'});return rows;
