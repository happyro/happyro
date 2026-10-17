assert.equal((await snapshot()).name,'JobAuditM');assert.equal((await snapshot()).map,'mid_camp');
await game.evaluate(()=>{window.__jobHunts=[];for(const p of window.__fourthTest.packets){if(p&&p.name?.includes('UPDATE_MISSION_HUNT')){const original=p.callback;p.callback=function(pkt){window.__jobHunts.push(JSON.parse(JSON.stringify(pkt)));return original.apply(this,arguments);};}}});
const goals={1504:3209,1506:3210,1508:3211,1510:3212};const counts={3209:0,3210:0,3211:0,3212:0};
const proof={preparation:'Already strengthened Lord Knight; naturally spawned monsters on nif_fild01, ordinary attacks; no quest writes or monster spawning',attacks:[],navigation:[],counts};
const file='docs/development/job-change-review/evidence/rune-knight-hunt.json';const deadline=Date.now()+900000;
let waypoint=0;const points=[];for(let y=80;y<=320;y+=40)for(let x=80;x<=320;x+=40)points.push([x,y]);
await jobNpc.travel('nif_fild01',160,160);
while(Date.now()<deadline){
 const hunts=await game.evaluate(()=>window.__jobHunts.splice(0));
 for(const pkt of hunts)for(const hunt of pkt.hunt||[])if(Object.hasOwn(counts,hunt.questID))counts[hunt.questID]=Math.max(counts[hunt.questID],hunt.huntCount||0);
 if(Object.values(counts).every(n=>n>=10)){proof.complete=true;break;}
 const target=await game.evaluate(({goals,counts})=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0&&Math.abs(e.position[0]-t.session.Entity.position[0])<=15&&Math.abs(e.position[1]-t.session.Entity.position[1])<=15&&goals[e.job]&&counts[goals[e.job]]<10)a.push({id:e.GID,job:e.job,pos:Array.from(e.position)});});return a[0];},{goals,counts});
 if(target){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.attacks.push(target);await game.waitForTimeout(1000);}
 else {const [x,y]=points[waypoint++%points.length];try{await jobNpc.travel('nif_fild01',x,y);proof.navigation.push({x,y});}catch(e){proof.navigation.push({x,y,error:e.message});}}
 await fs.writeFile(file,JSON.stringify(proof,null,2));
}
await fs.writeFile(file,JSON.stringify(proof,null,2));assert(proof.complete,'Hunt not completed before deadline');return counts;
