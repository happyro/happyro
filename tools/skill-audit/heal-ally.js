const before=await live.partner("const s=await snapshot();return {hp:s.hp,max_hp:s.max_hp,id:await game.evaluate(()=>window.__fourthTest.session.Entity.GID)};");
const cast=await live.cast('AL_HEAL',{target:{id:before.id},wait:2500});
const after=await live.partner("const s=await snapshot();return {hp:s.hp,max_hp:s.max_hp};");assert(after.hp>before.hp,'ally HP must rise');
await game.screenshot({path:'artifacts/skill-live/heal-ally.png'});await fs.writeFile('artifacts/skill-live/heal-ally.json',JSON.stringify({before,after,cast},null,2));return {before,after};
