await command('character.vitals.restore',{});
await live.partner("return await live.cast('IG_ATTACK_STANCE',{wait:1500});");
const target=await game.evaluate(()=>{let a;window.__fourthTest.entities.forEach(e=>{if(e.job===2559)a={id:e.GID};});return a;});
for(let i=0;i<6&&target;i++){await live.partner(`return await live.cast('IG_GRAND_JUDGEMENT',{target:{id:${target.id}},wait:3500,restore:false});`);const exists=await game.evaluate(id=>{let yes=false;window.__fourthTest.entities.forEach(e=>{if(e.GID===id)yes=true;});return yes;},target.id);if(!exists)return {clean:true,casts:i+1};await command('character.vitals.restore',{});}
return {clean:false};
