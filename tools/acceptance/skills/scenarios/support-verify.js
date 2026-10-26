await game.locator('#game-tools').click();await game.locator('.tab-button[data-tab="character"]').click();await game.waitForTimeout(600);
globalThis.support={rows:[],errors:[]};
game.on('pageerror',e=>support.errors.push(e.message));
support.command=async(type,payload)=>{await game.waitForTimeout(2150);const r=await game.request.post(api+'/commands',{headers:sessionHeaders,data:{idempotency_key:crypto.randomUUID(),type,payload}});assert.equal(r.status(),200,await r.text());return (await r.json()).data;};
support.before=await (await game.request.get(api,{headers:sessionHeaders})).json();
await game.keyboard.press('Escape');
await game.evaluate(()=>{const t=window.__fourthTest;window.__support={layers:[],packets:[]};
 const add=t.manager.add;t.manager.add=function(effect,p){const row={effect:p.Inst.effectID,type:p.effect.type,ready:false,draws:0};window.__support.layers.push(row);if(effect.render){const render=effect.render;effect.render=function(...args){row.ready=!!this.ready; if(this.ready)row.draws++;return render.apply(this,args);};}return add.call(this,effect,p);};
 for(const p of t.packets){if(!p?.callback||!/SKILL|NOTIFY_SKILL/.test(p.name))continue;const fn=p.callback;p.callback=function(pkt){window.__support.packets.push({name:p.name,...pkt});return fn.apply(this,arguments);};}
});
support.cast=async(id,level,ground=false)=>{await support.command('character.vitals.restore',{});await game.evaluate(({id,level,ground})=>{const t=window.__fourthTest;window.__support.layers=[];window.__support.packets=[];const e=t.session.Entity;if(ground)t.targeting.onUseSkillToPos(id,level,(e.position[0]|0)+1,e.position[1]|0);else t.targeting.onUseSkillToId(id,level,t.session.AID);},{id,level,ground});await game.waitForTimeout(6500);const row={id,...await game.evaluate(()=>window.__support)};support.rows.push(row);await fs.writeFile('artifacts/skill-live/support-effects-live.json',JSON.stringify({rows:support.rows,errors:support.errors},null,2));return {id,layers:row.layers,packets:row.packets.filter(p=>p.SKID===id)};};
await support.command('character.progression.update',{job_id:4012,base_level:99,job_level:70});await support.command('character.skills.learn_all',{});
return {ready:true,before:support.before.data.jobId};
