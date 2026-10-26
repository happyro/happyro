const rows=[];
await live.job(4063,200,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
await live.grant(523,20);await live.grant(717,40);
for(const name of ['AB_JUDEX','AB_ANCILLA','AB_ADORAMUS','AB_CLEMENTIA','AB_CANTO','AB_CHEAL','AB_EPICLESIS','AB_PRAEFATIO','AB_ORATIO','AB_LAUDAAGNUS','AB_LAUDARAMUS','AB_RENOVATIO','AB_HIGHNESSHEAL','AB_CLEARANCE','AB_EXPIATIO','AB_DUPLELIGHT','AB_SILENTIUM','AB_SECRAMENT','AB_OFFERTORIUM','AB_VITUPERATUM'])rows.push(await live.cast(name,{wait:8000}));
await live.job(4256,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});
await live.grant(1501);await live.equip(1501);
for(const name of ['CD_REPARATIO','CD_MEDIALE_VOTUM','CD_ARGUTUS_VITA','CD_ARGUTUS_TELUM','CD_ARBITRIUM','CD_PRESENS_ACIES','CD_EFFLIGO','CD_COMPETENTIA','CD_PNEUMATICUS_PROCELLA','CD_DILECTIO_HEAL','CD_RELIGIO','CD_BENEDICTUM','CD_PETITIO','CD_FRAMEN','CD_DIVINUS_FLOS'])rows.push(await live.cast(name,{wait:8500}));
await game.screenshot({path:'artifacts/skill-live/cardinal.png'});return rows;
