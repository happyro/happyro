const rows=[];
await live.job(6);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});await live.grant(1201);await live.equip(1201);
for(const name of ['TF_STEAL','TF_POISON','TF_SPRINKLESAND','TF_PICKSTONE','TF_THROWSTONE','TF_DETOXIFY','TF_BACKSLIDING','TF_HIDING','TF_HIDING'])rows.push(await live.cast(name,{wait:5000}));
await live.job(4013,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});await live.grant(1250);await live.equip(1250);await live.grant(716,20);await live.grant(678,15);
for(const name of ['AS_ENCHANTPOISON','AS_POISONREACT','AS_SONICBLOW','AS_VENOMDUST','AS_SPLASHER','ASC_EDP','ASC_BREAKER','ASC_METEORASSAULT','AS_CLOAKING','AS_CLOAKING'])rows.push(await live.cast(name,{wait:6500}));
rows.push(await live.cast('TF_HIDING'));rows.push(await live.cast('AS_GRIMTOOTH'));rows.push(await live.cast('TF_HIDING'));
await game.screenshot({path:'artifacts/skill-live/assassin-cross.png'});return rows;
