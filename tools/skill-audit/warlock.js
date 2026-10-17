const rows=[];await live.job(4061,200,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
for(const name of ['WL_SOULEXPANSION','WL_FROSTMISTY','WL_JACKFROST','WL_MARSHOFABYSS','WL_RECOGNIZEDSPELL','WL_SIENNAEXECRATE','WL_DRAINLIFE','WL_CRIMSONROCK','WL_HELLINFERNO','WL_COMET','WL_CHAINLIGHTNING','WL_EARTHSTRAIN','WL_TELEKINESIS_INTENSE'])rows.push(await live.cast(name,{wait:10000}));
const target=await live.spawn();rows.push(await live.cast('WL_WHITEIMPRISON',{target,wait:2000}));rows.push(await live.cast('WL_SOULEXPANSION',{target,wait:7000}));
for(const name of ['WL_SUMMONFB','WL_SUMMONBL','WL_SUMMONWB','WL_SUMMONSTONE'])rows.push(await live.cast(name,{wait:3000}));
rows.push(await live.cast('WL_TETRAVORTEX',{wait:13000}));
rows.push(await live.cast('WL_SUMMONFB',{wait:3000}));rows.push(await live.cast('WL_RELEASE',{wait:5000}));
rows.push(await live.cast('WL_STASIS',{level:1,wait:5000}));await game.waitForTimeout(21000);
await game.screenshot({path:'artifacts/skill-live/warlock.png'});return rows;
