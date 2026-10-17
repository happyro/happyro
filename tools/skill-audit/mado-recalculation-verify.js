await command('character.skills.learn_all',{});await command('character.vitals.restore',{});
const rows=[];
for(const enabled of [true,false,true,false]){
 const m=(await snapshot()).riding.find(r=>r.kind==='mado');assert(m);assert.notEqual(m.active,enabled);
 await command('character.riding.update',{kind:m.kind,enabled,fee:m.fee,ticket:m.ticket});
 await game.waitForFunction(enabled=>window.__learnStats[46]===(enabled?102:2),enabled,{timeout:5000});
 const state=await snapshot();const stats=await game.evaluate(()=>({...window.__learnStats}));assert.equal(state.riding.find(r=>r.kind==='mado').active,enabled);
 rows.push({enabled,def:stats[46],maxWeight:stats[25],speed:stats[0]});
}
await fs.writeFile('artifacts/skill-live/mado-recalculation-verify.json',JSON.stringify(rows,null,2));
assert.equal(rows[0].maxWeight-rows[1].maxWeight,15000);assert.deepEqual(rows[2],rows[0]);assert.deepEqual(rows[3],rows[1]);
return {rows,restored:true};
