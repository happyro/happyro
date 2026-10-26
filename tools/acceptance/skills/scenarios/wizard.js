const rows=[];
await live.job(2);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
await live.grant(717,30);await live.grant(715,30);await live.grant(716,30);
for(const name of ['MG_SIGHT','MG_NAPALMBEAT','MG_SOULSTRIKE','MG_COLDBOLT','MG_FROSTDIVER','MG_STONECURSE','MG_FIREBALL','MG_FIREWALL','MG_FIREBOLT','MG_LIGHTNINGBOLT','MG_THUNDERSTORM','MG_SAFETYWALL','MG_ENERGYCOAT'])rows.push(await live.cast(name,{wait:7000}));
await live.job(4010,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
for(const name of ['WZ_FIREPILLAR','WZ_SIGHTRASHER','WZ_METEOR','WZ_JUPITEL','WZ_VERMILION','WZ_ICEWALL','WZ_FROSTNOVA','WZ_STORMGUST','WZ_EARTHSPIKE','WZ_HEAVENDRIVE','WZ_QUAGMIRE','WZ_ESTIMATION','HW_MAGICCRASHER','HW_MAGICPOWER','HW_NAPALMVULCAN','HW_GANBANTEIN','HW_GRAVITATION','WZ_SIGHTBLASTER']){if(name==='WZ_SIGHTRASHER')await live.cast('MG_SIGHT');rows.push(await live.cast(name,{wait:8000}));}
await game.screenshot({path:'artifacts/skill-live/high-wizard.png'});return rows;
