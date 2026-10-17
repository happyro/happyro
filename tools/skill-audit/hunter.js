const rows=[];
await live.job(4012,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:80,dex:99,luk:30});
const z=await game.request.post('http://127.0.0.1:3338/api/adventure-tools/currency/zeny/grants',{headers,data:{idempotency_key:crypto.randomUUID(),amount:100000}});assert.equal(z.status(),200,await z.text());
let state=await snapshot();let falcon=state.riding.find(r=>r.kind==='falcon');if(!falcon.active)await command('character.riding.update',{kind:'falcon',enabled:true,fee:falcon.fee,ticket:falcon.ticket});
await live.equip(1701);await live.equip(1750);await live.grant(1065,40);
for(const name of ['HT_BLITZBEAT','HT_DETECTING','SN_SIGHT','SN_FALCONASSAULT','SN_SHARPSHOOTING','SN_WINDWALK','HT_PHANTASMIC'])rows.push(await live.cast(name));
await game.screenshot({path:'artifacts/skill-live/sniper.png'});
return rows;
