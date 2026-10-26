live.partner=async(code)=>{const r=await fetch('http://127.0.0.1:9343',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});const j=await r.json();assert(j.ok,j.error);return j.value;};
await live.job(4009,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});await live.grant(717,5);
const self=await snapshot();
await live.partner(`await game.evaluate(pos=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=4900;p.mapName='${self.map}';p.x=pos.x;p.y=pos.y;t.network.sendPacket(p);},{x:${self.x+2},y:${self.y}});await game.waitForTimeout(4000);return {ready:true};`);
const target=await live.partner(`await live.grant(678);await game.evaluate(()=>{const i=window.__fourthTest.inventory;i.useItem(i.getItemById(678));});await game.waitForTimeout(1800);const s=await snapshot();return {id:await game.evaluate(()=>window.__fourthTest.session.Entity.GID),hp:s.hp,x:s.x,y:s.y};`);
assert.equal(target.hp,0,'Real target must be dead');assert(Math.max(Math.abs(target.x-self.x),Math.abs(target.y-self.y))<=9,'Target in resurrection range');
const cast=await live.cast('ALL_RESURRECTION',{target,wait:6000});
const after=await live.partner('const s=await snapshot();return {hp:s.hp,max_hp:s.max_hp};');assert(after.hp>0,'Resurrection must restore life');
await game.screenshot({path:'artifacts/skill-live/resurrection.png'});await fs.writeFile('artifacts/skill-live/resurrection.json',JSON.stringify({target,after,cast},null,2));return {target,after};
