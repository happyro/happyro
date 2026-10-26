await live.job(16,99,50);await command('character.stats.update',{str:1000,agi:80,vit:80,int:1,dex:1,luk:120});await game.evaluate(()=>{window.__learnState={};});await command('character.skills.reset',{});await game.waitForFunction(()=>window.__learnState[1]&&window.__learnState[274]?.level===0);await live.learnPrior('Sage',274);
for(const [id,max]of[[274,2],[275,1]])for(let n=1;n<=max;n++){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=id;t.network.sendPacket(p);},id);await game.waitForFunction(({id,n})=>window.__learnState[id]?.level>=n,{id,n},{timeout:5000});}
await game.evaluate(()=>{window.__freecastPackets=[];for(const p of window.__fourthTest.packets){if(!p?.callback||!/SKILL|PAR_CHANGE/.test(p.name)||p.__freecastAudit)continue;const f=p.callback;p.__freecastAudit=true;p.callback=function(pkt){window.__freecastPackets.push({name:p.name,...structuredClone(pkt)});return f.apply(this,arguments);};}});
const target=await live.neutral(),rows=[];
for(const level of [0,10]){
 if(level)for(let n=1;n<=10;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=278;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[278]?.level>=n,n,{timeout:5000});}
 await command('character.vitals.restore',{});const before=await snapshot();
 await game.evaluate(target=>{window.__freecastPackets=[];window.__fourthTest.targeting.onUseSkillToId(19,10,target.id);},target);
 await game.waitForFunction(()=>window.__freecastPackets.some(p=>p.name==='PACKET_ZC_USESKILL_ACK3'&&p.SKID===19),null,{timeout:5000});
 const ack=await game.evaluate(()=>window.__freecastPackets.find(p=>p.name==='PACKET_ZC_USESKILL_ACK3'&&p.SKID===19));assert(ack.delayTime>2000);
 const destination={x:before.x+2,y:before.y};await game.evaluate(d=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest[0]=d.x;p.dest[1]=d.y;t.network.sendPacket(p);},destination);
 await game.waitForTimeout(1500);const during=await snapshot();await game.waitForTimeout(ack.delayTime+500);const after=await snapshot(),packets=await game.evaluate(()=>window.__freecastPackets);rows.push({level,target,before:{x:before.x,y:before.y},destination,during:{x:during.x,y:during.y},after:{x:after.x,y:after.y},ack,packets});await fs.writeFile('artifacts/skill-live/freecast-live.json',JSON.stringify(rows,null,2));
}
assert.deepEqual(rows[0].during,rows[0].before);assert.deepEqual(rows[1].during,rows[1].destination);for(const r of rows)assert(r.packets.some(p=>p.SKID===19&&p.damage>0));
await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});await command('character.skills.learn_all',{});await command('character.vitals.restore',{});return rows.map(r=>({level:r.level,before:r.before,during:r.during,castMs:r.ack.delayTime}));
