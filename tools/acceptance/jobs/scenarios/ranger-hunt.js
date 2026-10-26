assert.equal((await snapshot()).name,'JobDirectM');
await game.evaluate(()=>{window.__rangerHunts=[];window.__rangerDrops=[];for(const p of window.__fourthTest.packets){if(!p)continue;if(p.name?.includes('UPDATE_MISSION_HUNT')){const orig=p.callback;p.callback=function(pkt){window.__rangerHunts.push(JSON.parse(JSON.stringify(pkt)));return orig.apply(this,arguments);};}if(p.name?.includes('ITEM_FALL_ENTRY')){const orig=p.callback;p.callback=function(pkt){window.__rangerDrops.push(JSON.parse(JSON.stringify(pkt)));return orig.apply(this,arguments);};}}});
for(const [id,loc] of [[1703,2],[1750,32768]]){await game.evaluate(({id,loc})=>{const t=window.__fourthTest,i=t.inventory.getItemById(id);if(i){const p=new t.packet.CZ.REQ_WEAR_EQUIP();p.index=i.index;p.wearLocation=loc;t.network.sendPacket(p);}},{id,loc});await game.waitForTimeout(400);}
const {walk}=await import('./walk.mjs?ranger=2');
const proof={attacks:[],drops:[],hunts:[],preparation:'Existing strengthened stats; native bow and arrows; naturally spawned Dragon Tail; ordinary attacks and pickup'};
const file='docs/development/job-change-review/evidence/ranger-hunt.json';
const points=[[100,150],[120,150],[120,120],[150,120],[170,150],[140,180]];let point=0;
for(let n=0;n<100;n++){
 const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.job===1321&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick)a.push({id:e.GID,pos:Array.from(e.position)});});return a[0];});
 if(target){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.attacks.push(target);await game.waitForTimeout(1300);}
 else {try{await walk(game,snapshot,points[point++%points.length],2);}catch(e){proof.navigationError=e.message;}}
 proof.hunts.push(...await game.evaluate(()=>window.__rangerHunts.splice(0)));
 const drops=await game.evaluate(()=>window.__rangerDrops.splice(0));
 for(const d of drops)if(d.ITID===7064){proof.drops.push(d);await walk(game,snapshot,[d.xPos,d.yPos],1);await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.ITEM_PICKUP2();p.ITAID=id;t.network.sendPacket(p);},d.ITAID);await game.waitForTimeout(600);}
 await fs.writeFile(file,JSON.stringify(proof,null,2));
 if(await game.evaluate(()=>!!window.__fourthTest.inventory.getItemById(7064))){proof.collected=true;break;}
}
assert(proof.collected,'No natural wing collected');await walk(game,snapshot,[91,169],2);await jobNpc.contact(91,169);proof.delivery=await jobNpc.run([],80);await fs.writeFile(file,JSON.stringify(proof,null,2));return proof;
