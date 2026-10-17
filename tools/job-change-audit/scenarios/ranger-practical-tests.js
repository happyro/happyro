assert.equal((await snapshot()).name,'JobDirectM');assert.equal((await snapshot()).job_id,4012);
const {walk}=await import('./walk.mjs?arch=9');
const proof={preparation:'Dedicated character STR99 AGI5000 VIT1000 INT99 DEX500 LUK99 for survival, normal native bow/arrows/bombs/wolf; no quest writes or timer changes',firstAttacks:[],bombs:[],wolfAttacks:[]};const file='docs/development/job-change-review/evidence/ranger-practical-tests.json';const save=()=>fs.writeFile(file,JSON.stringify(proof,null,2));
await command('character.stats.update',{str:99,agi:5000,vit:1000,int:99,dex:500,luk:99});await command('character.vitals.restore',{});
// Equipped weapons are represented by Equipment UI after relog, not Inventory.list.
if(!await game.evaluate(()=>window.__fourthTest.inventory.getItemById(1703))){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQ_TAKEOFF_EQUIP();p.index=2;t.network.sendPacket(p);});await game.waitForFunction(()=>!!window.__fourthTest.inventory.getItemById(1703),null,{timeout:10000});}
for(const [id,loc] of [[1703,2],[1750,32768]]){await game.evaluate(({id,loc})=>{const t=window.__fourthTest,i=t.inventory.getItemById(id);if(!i)throw Error('Missing native equipment '+id);const p=new t.packet.CZ.REQ_WEAR_EQUIP();p.index=i.index;p.wearLocation=loc;t.network.sendPacket(p);},{id,loc});await game.waitForTimeout(400);}
await jobNpc.travel('job3_rang01',30,40);await jobNpc.contact(30,44);proof.waitingRoom=await jobNpc.run(['取消'],80);await save();
await game.locator('#EntityRoom button').dblclick();await game.waitForTimeout(1500);assert.equal((await snapshot()).map,'job3_rang02');
const firstDeadline=Date.now()+200000;
while(Date.now()<firstDeadline){
 const s=await snapshot();assert.equal(s.map,'job3_rang02');if(s.x>90){proof.firstPassed={x:s.x,y:s.y};break;}
 const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.display?.name==='波利'&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick)a.push({id:e.GID,job:e.job,name:e.display.name});});return a[0];});
 if(target){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.firstAttacks.push(target);await save();}await game.waitForTimeout(350);
}
assert(proof.firstPassed,'First ranger exam not passed');await save();
await game.waitForTimeout(27000);await jobNpc.contact(111,56);proof.bombTask=await jobNpc.run([],80);assert(await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12258)?.count===10));await save();
// Keep each escape endpoint beyond the native radius-five blast plus spawn offset.
const points=[[113,47],[113,37],[115,27],[125,23],[133,22],[142,29],[150,39],[160,49],[168,54],[173,64],[179,74]];
const {route}=await import('./hunter-path.mjs?bounds=whole-map-v2');
const grid=await game.evaluate(()=>{const a=window.__fourthTest.altitude;return {width:a.width,height:a.height,cells:Array.from({length:a.height},(_,y)=>Array.from({length:a.width},(_,x)=>(a.getCellType(x,y)&a.TYPE.WALKABLE)?1:0))};});
await walk(game,snapshot,points[0],0);
for(let i=0;i<10;i++){
 const s=await snapshot();assert.equal(s.map,'job3_rang02');
 const before=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12258)?.count||0);assert(before>0);
 const escape=route(grid,[s.x,s.y],points[i+1],new Set(),0,[0,0,grid.width-1,grid.height-1],true);assert(escape.length<=17,'Precomputed escape too long');
 await game.evaluate(dest=>{const t=window.__fourthTest;t.inventory.useItem(t.inventory.getItemById(12258));const p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},points[i+1]);
 await game.waitForTimeout((escape.length-1)*170+150);
 proof.bombs.push({x:s.x,y:s.y,before,escape,moves:await walk(game,snapshot,points[i+1],0)});await save();
}
assert(await game.evaluate(()=>!window.__fourthTest.inventory.getItemById(12258)));
proof.deliveryWalk=await walk(game,snapshot,[180,78],1);proof.secondPassed=await jobNpc.run(['拉斯特'],100);await save();
assert((await snapshot()).x>230,'Not moved to wolf exam');
await command('character.stats.update',{str:99,agi:99,vit:1,int:1,dex:99,luk:1});await command('character.vitals.restore',{});proof.thirdPreparation='Restore ordinary low VIT/INT/LUK before required petrification, so test stats do not block the status';
await jobNpc.contact(251,49);proof.wolfIntro=await jobNpc.run([],100);await game.waitForFunction(()=>!!window.__fourthTest.inventory.getItemById(12380),null,{timeout:15000});
await game.evaluate(()=>{const t=window.__fourthTest;t.inventory.useItem(t.inventory.getItemById(12380));});await game.waitForTimeout(1000);await jobNpc.contact(251,49);proof.wolfStart=await jobNpc.run([],100);await save();
const thirdDeadline=Date.now()+150000;
while(Date.now()<thirdDeadline){
 const s=await snapshot();if(s.map==='job3_rang01'){proof.thirdPassed={map:s.map,x:s.x,y:s.y};break;}assert.equal(s.map,'job3_rang02');
 const pair=await game.evaluate(()=>{const t=window.__fourthTest,a=[];let wolf;t.entities.forEach(e=>{if(e.job===2034&&!e.remove_tick)wolf=e.GID;if(e.objecttype===5&&e.job===1047&&e.life.hp!==0&&e.action!==e.ACTION.DIE&&!e.remove_tick)a.push(e.GID);});return {wolf,target:a[0]};});
 if(pair.wolf&&pair.target){await game.evaluate(({wolf,target})=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACTNPC();p.GID=wolf;p.targetGID=target;p.action=0;t.network.sendPacket(p);},pair);proof.wolfAttacks.push(pair);await save();}await game.waitForTimeout(400);
}
proof.messages=await game.evaluate(()=>window.__fourthTest.chat._shadow.querySelector('.content')?.innerText);await save();assert(proof.thirdPassed,'Wolf exam not passed');return {first:true,second:true,third:true};
