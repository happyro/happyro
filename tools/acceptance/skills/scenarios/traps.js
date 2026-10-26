await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();p.requestId=1001;p.mapName='prt_fild08';p.x=150;p.y=150;t.network.sendPacket(p);});
await game.waitForTimeout(5000);
const location=await snapshot();assert.equal(location.map,'prt_fild08');
const cells=await game.evaluate(()=>{const t=window.__fourthTest;const e=t.session.Entity;const cells=[];for(let x=(e.position[0]|0)-7;x<=(e.position[0]|0)+7;x+=3)for(let y=(e.position[1]|0)-7;y<=(e.position[1]|0)+7;y+=3)cells.push({x,y});return cells;});
await live.grant(1065,30);await live.grant(7940,40);
const names=['HT_SKIDTRAP','HT_LANDMINE','HT_ANKLESNARE','HT_SHOCKWAVE','HT_SANDMAN','HT_FLASHER','HT_FREEZINGTRAP','HT_BLASTMINE','HT_CLAYMORETRAP','HT_TALKIEBOX','RA_ELECTRICSHOCKER','RA_CLUSTERBOMB','RA_FIRINGTRAP','RA_ICEBOUNDTRAP','WH_DEEPBLINDTRAP','WH_SOLIDTRAP','WH_SWIFTTRAP','WH_FLAMETRAP'];
const rows=[];let i=0;for(const name of names){assert(cells[i],'need empty walkable cells');rows.push(await live.cast(name,{target:cells[i++],wait:1800}));}
await game.screenshot({path:'artifacts/skill-live/hunter-traps.png'});return rows;
