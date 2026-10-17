await game.evaluate(()=>{
 const t=window.__fourthTest;window.__audit={calls:[],effects:[],chat:[],packets:[],sent:[]};
 const send=t.network.sendPacket;t.network.sendPacket=function(pkt){if(pkt.SKID!==undefined||pkt.dest!==undefined)window.__audit.sent.push({...pkt});return send.apply(this,arguments);};
 for(const p of t.packets){if(!p?.callback||!/SKILL|DAMAGE|STATUS|PAR_CHANGE/.test(p.name))continue;const fn=p.callback;p.callback=function(pkt){window.__audit.packets.push({name:p.name,...pkt});return fn.apply(this,arguments);};}
 for(const name of ['spamSkill','spamSkillHit','spamSkillBeforeHit','spamSkillZone']){const fn=t.manager[name];t.manager[name]=function(...args){window.__audit.calls.push({name,args:args.map(a=>typeof a==='object'?null:a)});return fn.apply(this,args);};}
 const add=t.manager.add;t.manager.add=function(effect,...args){const entry={id:args[0]?.Inst?.effectID,file:effect.filename,draws:0};window.__audit.effects.push(entry);if(effect.renderAnimation){const render=effect.renderAnimation;effect.renderAnimation=function(...a){entry.draws++;entry.file=this.filename;return render.apply(this,a);};}return add.call(this,effect,...args);};
 const chat=t.chat.addText;t.chat.addText=function(...args){window.__audit.chat.push(String(args[0]));return chat.apply(this,args);};
});
return {ready:true};
