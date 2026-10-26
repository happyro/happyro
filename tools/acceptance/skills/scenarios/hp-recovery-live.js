const rows=[];
for(const level of [0,10]){
 if(level)for(let n=1;n<=10;n++){await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=4;t.network.sendPacket(p);});await game.waitForFunction(n=>window.__learnState[4]?.level>=n,n,{timeout:5000,polling:50});}
 await command('character.vitals.restore',{});
 await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest[0]=100;p.dest[1]=101;t.network.sendPacket(p);});await game.waitForTimeout(700);
 await live.partner("await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=2000001;p.action=7;t.network.sendPacket(p);});await game.waitForTimeout(4000);await game.evaluate(()=>{const t=window.__fourthTest,p=new t.packet.CZ.REQUEST_MOVE2();p.dest[0]=t.session.Entity.position[0]|0;p.dest[1]=t.session.Entity.position[1]|0;t.network.sendPacket(p);});return true;");
 const before=await snapshot();assert(before.hp>0&&before.max_hp-before.hp>800,'Need real HP deficit');
 await game.evaluate(()=>{window.__hpRecovery=[];});await game.waitForTimeout(12500);
 const after=await snapshot(),packets=await game.evaluate(()=>window.__hpRecovery);rows.push({level,before:{hp:before.hp,maxHp:before.max_hp},after:{hp:after.hp,maxHp:after.max_hp},packets});
 await fs.writeFile('artifacts/skill-live/hp-recovery-live.json',JSON.stringify(rows,null,2));
}
assert(!rows[0].packets.some(p=>p.varID===5));const expected=50+Math.floor(10*rows[1].before.maxHp/500);assert(rows[1].packets.some(p=>p.varID===5&&p.amount===expected));
await command('character.skills.learn_all',{});return {rows,expected};
