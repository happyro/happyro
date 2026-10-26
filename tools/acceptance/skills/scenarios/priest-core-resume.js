const rows=[];

for(const name of ['AL_CRUCIS','AL_ANGELUS','AL_BLESSING','AL_CURE','AL_HOLYLIGHT'])rows.push(await live.cast(name,{wait:6500}));
await live.job(4009,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
await live.grant(523,20);await live.grant(717,30);
for(const name of ['PR_IMPOSITIO','PR_SUFFRAGIUM','PR_ASPERSIO','PR_SANCTUARY','PR_SLOWPOISON','PR_STRECOVERY','PR_KYRIE','PR_MAGNIFICAT','PR_GLORIA','PR_LEXDIVINA','PR_LEXAETERNA','PR_MAGNUS','HP_ASSUMPTIO','HP_BASILICA'])rows.push(await live.cast(name,{wait:8000}));
await game.screenshot({path:'artifacts/skill-live/high-priest.png'});return rows;
