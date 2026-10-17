await command('character.vitals.restore',{});
const target=await game.evaluate(()=>{let a;window.__fourthTest.entities.forEach(e=>{if(e.job===2559)a={id:e.GID,x:e.position[0]|0,y:e.position[1]|0};});return a;});
if(target)await live.cast('EM_DIAMOND_STORM',{target,wait:5000});
return {enemyRemaining:await game.evaluate(()=>{let found=false;window.__fourthTest.entities.forEach(e=>{if(e.job===2559)found=true;});return found;})};
