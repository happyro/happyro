const before=await game.evaluate(()=>({range:window.__fourthTest.session.Entity.attack_range,packets:window.__audit.packets.filter(p=>p.name.includes('COUPLESTATUS')).slice(-6)}));
await game.evaluate(()=>window.__audit.packets=[]);
for(const id of [43,44])for(let i=0;i<10;i++){await game.evaluate(id=>{const t=window.__fourthTest;const p=new t.packet.CZ.UPGRADE_SKILLLEVEL();p.SKID=id;t.network.sendPacket(p);},id);await game.waitForTimeout(100);}
await game.waitForTimeout(500);
const after=await game.evaluate(()=>({range:window.__fourthTest.session.Entity.attack_range,packets:window.__audit.packets}));
await fs.writeFile('artifacts/skill-live/archer-passives.json',JSON.stringify({before,after},null,2));return {before,after};
