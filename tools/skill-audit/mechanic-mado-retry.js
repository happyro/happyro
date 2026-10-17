const s=await snapshot();const m=s.riding.find(r=>r.kind==='mado');assert(m);if(!m.active)await command('character.riding.update',{kind:m.kind,enabled:true,fee:m.fee,ticket:m.ticket});
await game.evaluate(()=>{const i=window.__fourthTest.inventory;const ammo=i.getItemById(18000);if(!ammo)throw Error('Missing cannonball');i.useItem(ammo);});await game.waitForTimeout(800);
const rows=[];for(const name of ['NC_ARMSCANNON','MT_SPARK_BLASTER','MT_TRIPLE_LASER','MT_ENERGY_CANNONADE'])rows.push(await live.cast(name,{wait:8000}));
await game.screenshot({path:'artifacts/skill-live/meister-mado.png'});await fs.writeFile('artifacts/skill-live/meister-mado.json',JSON.stringify(rows,null,2));return rows;
