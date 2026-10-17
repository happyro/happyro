const rows=[];await live.cast('PA_GOSPEL',{wait:1200});
await live.job(4073,200,70);await live.grant(523,20);await live.equip(1401);await live.equip(2101);
for(const name of ['LG_CANNONSPEAR','LG_BANISHINGPOINT','LG_TRAMPLE','LG_SHIELDPRESS','LG_REFLECTDAMAGE','LG_PINPOINTATTACK','LG_FORCEOFVANGUARD','LG_SHIELDSPELL','LG_EXEEDBREAK','LG_OVERBRAND','LG_PRESTIGE','LG_BANDING','LG_MOONSLASHER','LG_RAYOFGENESIS','LG_PIETY','LG_EARTHDRIVE','LG_INSPIRATION','LG_KINGS_GRACE'])rows.push(await live.cast(name,{wait:7500}));
await live.job(4258,275,60);await live.equip(1401);await live.equip(2101);await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});
for(const name of ['IG_GUARD_STANCE','IG_GUARDIAN_SHIELD','IG_REBOUND_SHIELD','IG_HOLY_SHIELD','IG_ATTACK_STANCE','IG_GRAND_JUDGEMENT','IG_JUDGEMENT_CROSS','IG_SHIELD_SHOOTING','IG_OVERSLASH','IG_CROSS_RAIN','IG_RADIANT_SPEAR','IG_IMPERIAL_CROSS','IG_IMPERIAL_PRESSURE'])rows.push(await live.cast(name,{wait:8500}));
await game.screenshot({path:'artifacts/skill-live/imperial-guard.png'});return rows;
