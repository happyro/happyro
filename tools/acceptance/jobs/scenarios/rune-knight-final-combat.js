assert.equal((await snapshot()).name,'JobAuditM');
const waitUntil=Date.now()+180000;
while((await snapshot()).map!=='job3_rune02'){
 if(Date.now()>waitUntil)throw Error('No entry into first test');
 await game.waitForTimeout(1000);
}
// Strengthened dedicated test character; validate quest events, not combat difficulty/balance.
await command('character.stats.update',{str:5000,agi:99,vit:1000,int:30,dex:500,luk:1});await command('character.vitals.restore',{});
const proof={preparation:'STR5000 AGI99 VIT1000 INT30 DEX500 LUK1; dedicated character only. Combat difficulty not evaluated; no quest edits, kill commands or timer changes.',started:new Date().toISOString(),attacks:[]};
const file='docs/development/job-change-review/evidence/rune-knight-final-combat.json';const deadline=Date.now()+440000;
while(Date.now()<deadline){
 const s=await snapshot();if(s.map!=='job3_rune02'){proof.returned={map:s.map,job:s.job_id};break;}
 const target=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0)a.push({id:e.GID,job:e.job,hp:e.life.hp,pos:Array.from(e.position)});});return a[0];});
 if(target){await game.evaluate(()=>{const t=window.__fourthTest;for(const id of [12390,12389]){const item=t.inventory.getItemById(id);if(item)t.inventory.useItem(item);}});await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.attacks.push(target);}
 else await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[38,40];t.network.sendPacket(p);});
 await fs.writeFile(file,JSON.stringify(proof,null,2));await game.waitForTimeout(900);
}
assert(proof.returned,'Test did not return before deadline');proof.finished=new Date().toISOString();await fs.writeFile(file,JSON.stringify(proof,null,2));return {returned:proof.returned,attacks:proof.attacks.length};
