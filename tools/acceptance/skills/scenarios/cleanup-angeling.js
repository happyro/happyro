const targets=await game.evaluate(()=>{const r=[];window.__fourthTest.entities.forEach(e=>{if(e.job===1096)r.push(e.GID);});return r;});
await command('character.stats.update',{str:1000,agi:80,vit:80,int:1000,dex:120,luk:30});
for(const id of targets)await live.cast('WZ_JUPITEL',{target:{id},wait:5000});
await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});return {cleaned:targets.length};
