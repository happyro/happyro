const rows=[];
await live.job(1);await live.grant(1101);await live.equip(1101);
for(const name of ['SM_BASH','SM_MAGNUM','SM_PROVOKE','SM_ENDURE','SM_AUTOBERSERK'])rows.push(await live.cast(name,{wait:6500}));
await live.job(4015,99,70);await live.grant(1401);await live.grant(2101);await live.equip(1401);await live.equip(2101);
for(const name of ['CR_AUTOGUARD','CR_SHIELDCHARGE','CR_SHIELDBOOMERANG','CR_REFLECTSHIELD','CR_HOLYCROSS','CR_GRANDCROSS','CR_DEFENDER','CR_SPEARQUICKEN','PA_PRESSURE','PA_SHIELDCHAIN','CR_SHRINK','PA_GOSPEL'])rows.push(await live.cast(name,{wait:7500}));
await game.screenshot({path:'artifacts/skill-live/paladin.png'});return rows;
