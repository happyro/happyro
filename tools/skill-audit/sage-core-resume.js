const rows=[];
await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});
const names=['SA_MAGICROD','SA_FLAMELAUNCHER','SA_FROSTWEAPON','SA_LIGHTNINGLOADER','SA_SEISMICWEAPON','SA_VOLCANO','SA_DELUGE','SA_VIOLENTGALE','SA_LANDPROTECTOR','SA_DISPELL','PF_MEMORIZE','PF_DOUBLECASTING','PF_FOGWALL','PF_SPIDERWEB'];
await live.resources(names);for(const name of names)rows.push(await live.cast(name,{wait:7500}));
await game.screenshot({path:'artifacts/skill-live/professor.png'});return rows;
