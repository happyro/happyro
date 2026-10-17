const rows=[];if(!await game.evaluate(()=>!!window.__fourthTest.inventory.getItemById(1451)))await live.grant(1451);await live.equip(1451);
rows.push(await live.cast('DK_DRAGONIC_PIERCE',{target:await live.durable(),wait:4500}));
rows.push(await live.cast('LK_TENSIONRELAX',{wait:2500}));
await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.REQUEST_ACT2();p.targetGID=0;p.action=3;t.network.sendPacket(p);});
await game.waitForTimeout(500);rows.push(await live.cast('DK_SERVANTWEAPON',{wait:8000}));const target=await live.durable();rows.push(await live.cast('DK_SERVANT_W_SIGN',{target,wait:500}));rows.push(await live.cast('DK_SERVANT_W_DEMOL',{target,wait:5000,restore:false}));
await fs.writeFile('artifacts/skill-live/knight-extra.json',JSON.stringify(rows,null,2));return rows;
