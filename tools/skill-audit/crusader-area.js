const rows=[];
for(const name of ['LG_OVERBRAND','LG_MOONSLASHER','LG_RAYOFGENESIS','LG_EARTHDRIVE']){const target=await live.spawn();await game.evaluate(target=>{const t=window.__fourthTest;const p=new t.packet.CZ.REQUEST_MOVE2();p.dest[0]=target.x;p.dest[1]=target.y;t.network.sendPacket(p);},target);await game.waitForTimeout(1800);rows.push(await live.cast(name,{wait:6500}));}
await fs.writeFile('artifacts/skill-live/crusader-area.json',JSON.stringify(rows,null,2));return rows;
