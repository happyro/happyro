assert.equal((await snapshot()).name,'JobDirectM');
const {route}=await import('./hunter-path.mjs');
const grid=JSON.parse(await fs.readFile('work/job-change-audit/hunter-grid.json','utf8'));const source=await fs.readFile('repos/happyro-server/npc/jobs/2-1/hunter.txt','utf8');const blocked=new Set();
for(const m of source.matchAll(/job_hunte,(\d+),(\d+),\d+\s+(?:duplicate\(HntTrap2?\)|script\s+[^\s]+::HntTrap2?)[^\n]*?-1,(\d+),(\d+)/g)){const [,x,y,rx,ry]=m.map(Number);for(let a=x-rx;a<=x+rx;a++)for(let b=y-ry;b<=y+ry;b++)blocked.add(`${a},${b}`);}
const proof={preparation:'Actual collision grid and ordinary walking/attacks, strengthened dedicated role; no quest variables, timers or monster spawning changed',events:[]};const file='docs/development/job-change-review/evidence/hunter-arena-walk.json';
// Enter via waiting room, after the preceding failed round has expired.
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[176,30];t.network.sendPacket(p);});await game.waitForTimeout(1500);await jobNpc.run(['继续尝试']);
await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=[176,36];t.network.sendPacket(p);});await game.waitForTimeout(1200);await game.locator('#EntityRoom button').filter({hasText:'等候室'}).dblclick();await game.waitForTimeout(600);
const chatBaseline=(await game.locator('#chatbox .content').first().innerText()).length;
const goals=[[90,92],[67,80],[53,73],[114,78],[125,70],[89,127],[93,100]];let g=0;const until=Date.now()+180000;const requested=new Set();
while(Date.now()<until){
 const s=await snapshot();assert(s.map==='job_hunte'&&s.x<150,'Trial ended before escape');
 const mobs=await game.evaluate(()=>{const t=window.__fourthTest,a=[];t.entities.forEach(e=>{if(e.objecttype===5&&e.life.hp!==0)a.push({id:e.GID,name:e.display.name,pos:Array.from(e.position)});});return a;});
 const unknown=mobs.filter(e=>!requested.has(e.id));for(const e of unknown)requested.add(e.id);if(unknown.length){await game.evaluate(ids=>{const t=window.__fourthTest;for(const id of ids){const p=new t.packet.CZ.REQNAME2();p.AID=id;t.network.sendPacket(p);}},unknown.map(e=>e.id));await game.waitForTimeout(150);continue;}
 const switchPresent=await game.evaluate(()=>{let found=false;window.__fourthTest.entities.forEach(e=>{if(e.position[0]===93&&e.position[1]===101)found=true;});return found;});if(switchPresent||(await game.locator('#chatbox .content').first().innerText()).slice(chatBaseline).includes('好，干得不错'))g=6;
 const target=mobs.filter(e=>e.name==='转职怪物').sort((a,b)=>Math.hypot(a.pos[0]-s.x,a.pos[1]-s.y)-Math.hypot(b.pos[0]-s.x,b.pos[1]-s.y))[0];
 if(target&&Math.max(Math.abs(target.pos[0]-s.x),Math.abs(target.pos[1]-s.y))<=9){await game.evaluate(id=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=id;p.action=7;t.network.sendPacket(p);},target.id);proof.events.push({attack:target});await game.waitForTimeout(600);}
 else {
  const goal=target?target.pos:goals[g];if(!goal)break;const path=route(grid,[s.x,s.y],goal,blocked,target?6:0);
  if(path.length<=1){g++;continue;}let end=1;while(end+1<path.length&&end<8&&((path[end+1][0]===s.x&&path[1][0]===s.x)||(path[end+1][1]===s.y&&path[1][1]===s.y)))end++;const dest=path[end];
  await game.evaluate(dest=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest=dest;t.network.sendPacket(p);},dest);proof.events.push({move:dest});await game.waitForTimeout(end*160+200);
 }
 if(await game.locator('#NpcBox .content').isVisible()){proof.switch=await jobNpc.run(['逃脱']);break;}
 await fs.writeFile(file,JSON.stringify(proof,null,2));
}
await fs.writeFile(file,JSON.stringify(proof,null,2));if(proof.switch){const exitCode=await fs.readFile('tools/acceptance/jobs/scenarios/hunter-exit.js','utf8');proof.exit=await eval('(async()=>{'+exitCode+'})()');await fs.writeFile(file,JSON.stringify(proof,null,2));}return {events:proof.events.length,switch:proof.switch,exit:proof.exit};
