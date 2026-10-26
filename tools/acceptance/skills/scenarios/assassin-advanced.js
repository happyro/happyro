const rows=[];
await live.job(4065,200,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});
for(const name of ['GC_VENOMIMPRESS','GC_CROSSIMPACT','GC_DARKILLUSION','GC_WEAPONBLOCKING','GC_PHANTOMMENACE','GC_HALLUCINATIONWALK','GC_DARKCROW','GC_CLOAKINGEXCEED','GC_CLOAKINGEXCEED'])rows.push(await live.cast(name,{wait:6500}));
const victim=await live.spawn();rows.push(await live.cast('GC_ROLLINGCUTTER',{wait:300}));rows.push(await live.cast('GC_CROSSRIPPERSLASHER',{target:victim,restore:false,wait:6500}));
await live.job(4254,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});
for(const name of ['SHC_SHADOW_EXCEED','SHC_SAVAGE_IMPACT','ASC_EDP','SHC_POTENT_VENOM','SHC_SHADOW_STAB','SHC_ENCHANTING_SHADOW','SHC_FATAL_SHADOW_CROW','SHC_CROSS_SLASH'])rows.push(await live.cast(name,{wait:6500}));
rows.push(await live.cast('SHC_IMPACT_CRATER',{wait:1500}));rows.push(await live.cast('SHC_ETERNAL_SLASH',{restore:false,wait:6500}));
await live.equip(1201);rows.push(await live.cast('SHC_DANCING_KNIFE',{wait:6500}));
await game.screenshot({path:'artifacts/skill-live/shadow-cross.png'});return rows;
