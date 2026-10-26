assert.equal((await snapshot()).name,'JobDirectF');assert.equal((await snapshot()).map,'job_wiz');
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[50,164];t.network.sendPacket(p);});
await game.waitForFunction(()=>{const p=window.__fourthTest.session.Entity.position;return Math.abs(p[0]-50)<2&&Math.abs(p[1]-164)<2;},null,{timeout:15000});
await game.locator('#EntityRoom button').dblclick();await game.waitForTimeout(1500);
let s=await snapshot();assert(s.x>90&&s.y>140,'Did not enter water room');
const proof={preparation:'See wizard-combat-entry.json',attacks:[],rooms:[],started:new Date().toISOString()};
const file='docs/development/job-change-review/evidence/wizard-combat.json';const deadline=Date.now()+540000;
while(Date.now()<deadline){
 s=await snapshot();if(s.map!=='job_wiz'){proof.returned={map:s.map,x:s.x,y:s.y,job:s.job_id};break;}
 const room=s.y>140?'water':s.x>80?'earth':'fire';if(proof.rooms.at(-1)!==room)proof.rooms.push(room);
 const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0)a.push({id:e.GID,job:e.job,pos:Array.from(e.position),hp:e.life.hp});});return a[0];});
 if(target){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.attacks.push({room,...target});}
 else{const dest=room==='water'?[114,169]:room==='earth'?[116,97]:[44,99];await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},dest);}
 await fs.writeFile(file,JSON.stringify(proof,null,2));await game.waitForTimeout(700);
}
assert(proof.returned,'Combat did not exit');await fs.writeFile(file,JSON.stringify(proof,null,2));return {rooms:proof.rooms,attacks:proof.attacks.length,returned:proof.returned};
