await live.grant(1701);await live.grant(1750,500);await live.equip(1701);await live.equip(1750);
const rows=[];
for(const name of ['AC_CONCENTRATION','AC_DOUBLE','AC_SHOWER','AC_CHARGEARROW'])rows.push(await live.cast(name));
await game.screenshot({path:'artifacts/skill-live/archer.png'});
return rows;
