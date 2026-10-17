const rows=[];
await live.job(5);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});await live.grant(1351);await live.equip(1351);
const z=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/currency/zeny/grants',{headers,data:{idempotency_key:crypto.randomUUID(),amount:100000}});assert.equal(z.status(),200,await z.text());
let s=await snapshot();let cart=s.riding.find(r=>r.kind==='cart');assert(cart);if(!cart.active)await command('character.riding.update',{kind:'cart',enabled:true,fee:cart.fee,ticket:cart.ticket});
for(const name of ['MC_MAMMONITE','MC_LOUD','MC_CARTREVOLUTION'])rows.push(await live.cast(name,{wait:6000}));
await live.job(4011,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:120,luk:30});
for(const name of ['BS_HAMMERFALL','BS_ADRENALINE','BS_WEAPONPERFECT','BS_OVERTHRUST','BS_MAXIMIZE','WS_MELTDOWN','WS_CARTBOOST','WS_CARTTERMINATION','WS_OVERTHRUSTMAX','BS_GREED'])rows.push(await live.cast(name,{wait:6500}));
await game.screenshot({path:'artifacts/skill-live/whitesmith.png'});return rows;
