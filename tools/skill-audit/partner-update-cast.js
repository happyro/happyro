live.cast=async(name,{level,target,wait=4500,restore=true}={})=>{
 const d=live.db.find(s=>s.Name===name);assert(d,name);level??=d.MaxLevel;
 if(restore)await command('character.vitals.restore',{});
 if(!target&&d.TargetType==='Self'&&d.Type&&d.DamageFlags?.Splash&&!d.DamageFlags?.NoDamage)await live.spawn();
 if(!target&&(d.TargetType==='Attack'||d.TargetType==='Ground'))target=await live.spawn();
 const before=await snapshot();
 await game.evaluate(({d,level,target})=>{const t=window.__fourthTest;window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};if(d.TargetType==='Ground')t.targeting.onUseSkillToPos(d.Id,level,target.x,target.y);else if(d.TargetType==='Support')t.targeting.onUseSkillToId(d.Id,level,target?.id??t.session.Entity.GID);else if(d.TargetType==='Attack'||target?.id)t.targeting.onUseSkillToId(d.Id,level,target.id);else t.skills.onUseSkill(d.Id,level);},{d,level,target});
 await game.waitForTimeout(wait);
 const row={name,id:d.Id,level,before,after:await snapshot(),target,observed:await game.evaluate(()=>window.__audit)};
 live.results.push(row);await fs.writeFile('artifacts/skill-live/partner-results.json',JSON.stringify(live.results,null,2));
 console.log(new Date().toISOString(),name,JSON.stringify(row.observed.chat));
 return {name,sp:row.after.sp-row.before.sp,chat:row.observed.chat,packets:row.observed.packets.filter(p=>!/PAR_CHANGE/.test(p.name)),drawn:row.observed.effects.filter(e=>e.draws>0).length};
};

return {updated:true};
