const require=createRequire(process.cwd()+'/repos/happyro-client/package.json');
const yaml=require('js-yaml');
const db=yaml.load(await fs.readFile('repos/happyro-server/db/re/skill_db.yml','utf8')).Body;
globalThis.live={db,results:[],command,snapshot,game,fs};
live.grant=async(id,amount=1)=>{const r=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/items/grants',{headers,data:{idempotency_key:crypto.randomUUID(),target:{type:'self'},item_id:id,amount}});assert.equal(r.status(),200,await r.text());await game.waitForTimeout(250);};
live.equip=async(id)=>{await game.evaluate(id=>{const t=window.__fourthTest;const item=t.inventory.getItemById(id);if(!item)throw Error('Missing item '+id);t.inventory.onEquipItem(item.index,item.location??item.WearState);},id);await game.waitForTimeout(500);};
await game.evaluate(()=>{
 const t=window.__fourthTest;window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};
 const send=t.network.sendPacket;t.network.sendPacket=function(pkt){if(pkt.SKID!==undefined||pkt.dest!==undefined)window.__audit.sent.push({...pkt});return send.apply(this,arguments);};
 for(const p of t.packets){if(!p?.callback||!/SKILL|DAMAGE|STATUS|PAR_CHANGE/.test(p.name))continue;const fn=p.callback;p.callback=function(pkt){window.__audit.packets.push({name:p.name,...pkt});return fn.apply(this,arguments);};}
 for(const name of ['spamSkill','spamSkillHit','spamSkillBeforeHit','spamSkillZone']){const fn=t.manager[name];t.manager[name]=function(...args){window.__audit.calls.push({name,args:args.map(a=>typeof a==='object'?null:a)});return fn.apply(this,args);};}
 const add=t.manager.add;t.manager.add=function(effect,...args){const entry={id:args[0]?.Inst?.effectID,file:effect.filename,draws:0};window.__audit.effects.push(entry);if(effect.renderAnimation){const render=effect.renderAnimation;effect.renderAnimation=function(...a){entry.draws++;entry.file=this.filename;return render.apply(this,a);};}return add.call(this,effect,...args);};
 const chat=t.chat.addText;t.chat.addText=function(...args){window.__audit.chat.push(String(args[0]));return chat.apply(this,args);};
});
live.spawn=async()=>{
 await game.evaluate(()=>{const t=window.__fourthTest;window.__previous=[];t.entities.forEach(e=>{if(e.job===1002)window.__previous.push(e.GID);});const p=new t.packet.CZ.HAPPYRO_MONSTER_SPAWN();p.monsterId=1002;t.network.sendPacket(p);});
 await game.waitForFunction(()=>{let found=false;window.__fourthTest.entities.forEach(e=>{if(e.job===1002&&!window.__previous.includes(e.GID))found=true;});return found;},null,{timeout:5000});
 return game.evaluate(()=>{let found;window.__fourthTest.entities.forEach(e=>{if(e.job===1002&&!window.__previous.includes(e.GID))found={id:e.GID,x:e.position[0]|0,y:e.position[1]|0};});return found;});
};
live.cast=async(name,{level,target,wait=4500,restore=true}={})=>{
 const d=db.find(s=>s.Name===name);assert(d,name);level??=d.MaxLevel;
 if(restore)await command('character.vitals.restore',{});
 if(!target&&(d.TargetType==='Attack'||d.TargetType==='Ground'))target=await live.spawn();
 const before=await snapshot();
 await game.evaluate(({d,level,target})=>{const t=window.__fourthTest;window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};if(d.TargetType==='Ground')t.targeting.onUseSkillToPos(d.Id,level,target.x,target.y);else if(d.TargetType==='Attack'||target?.id)t.targeting.onUseSkillToId(d.Id,level,target.id);else t.skills.onUseSkill(d.Id,level);},{d,level,target});
 await game.waitForTimeout(wait);
 const row={name,id:d.Id,level,before,after:await snapshot(),target,observed:await game.evaluate(()=>window.__audit)};
 live.results.push(row);await fs.writeFile('artifacts/skill-live/results.json',JSON.stringify(live.results,null,2));
 return {name,sp:row.after.sp-row.before.sp,chat:row.observed.chat,packets:row.observed.packets.filter(p=>!/PAR_CHANGE/.test(p.name)),drawn:row.observed.effects.filter(e=>e.draws>0).length};
};
live.job=async(id,base=99,job=50)=>{await command('character.progression.update',{job_id:id,base_level:base,job_level:job});await command('character.stats.update',{str:80,agi:80,vit:80,int:80,dex:99,luk:30});await command('character.skills.learn_all',{});await command('character.vitals.restore',{});};
await game.keyboard.press('Alt+f');await game.keyboard.up('Alt');
return {ready:true,snapshot:await snapshot()};
