await command('character.vitals.restore',{});
const enemy=await game.evaluate(()=>{let a;window.__fourthTest.entities.forEach(e=>{if(e.job===2559)a={id:e.GID,x:e.position[0]|0,y:e.position[1]|0};});return a;});
if(enemy){await live.partner(`return await live.cast('IG_JUDGEMENT_CROSS',{target:{id:${enemy.id}},wait:7000});`);}
const remaining=await game.evaluate(()=>{let n=0;window.__fourthTest.entities.forEach(e=>{if(e.job===2559)n++;});return n;});assert.equal(remaining,0,'Clean up hostile fixture before transfer test');
const before={source:await snapshot(),target:await live.partner('return await snapshot();')};
await live.cast('EM_INCREASING_ACTIVITY',{target:{id:2000000},wait:5000,restore:false});
const after={source:await snapshot(),target:await live.partner('return await snapshot();')};
const observed=await game.evaluate(()=>window.__audit);
await fs.writeFile('artifacts/skill-live/ap-transfer.json',JSON.stringify({before,after,observed},null,2));
assert.equal(after.source.ap,before.source.ap-50);assert.equal(after.target.ap,Math.min(before.target.max_ap,before.target.ap+50));assert(before.target.ap<before.target.max_ap);
return {source:[before.source.ap,after.source.ap],target:[before.target.ap,after.target.ap]};
