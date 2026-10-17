const rows=[];await live.job(4262,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:30});await command('character.traits.update',{pow:100,sta:100,wis:100,spl:100,con:100,crt:100});
for(const name of ['IQ_POWERFUL_FAITH','IQ_FIRM_FAITH','IQ_SINCERE_FAITH','IQ_OLEUM_SANCTUM','IQ_MASSIVE_F_BLASTER','IQ_EXPOSION_BLASTER','IQ_FIRST_FAITH_POWER'])rows.push(await live.cast(name,{wait:7000}));
const phases=[['IQ_FIRST_BRAND','IQ_SECOND_FAITH','IQ_THIRD_PUNISH'],['IQ_JUDGE','IQ_FIRST_BRAND','IQ_SECOND_JUDGEMENT','IQ_THIRD_CONSECRATION'],['IQ_THIRD_EXOR_FLAME','IQ_FIRST_BRAND','IQ_SECOND_FLAME','IQ_THIRD_FLAME_BOMB']];
for(const phase of phases){const target=await live.durable();for(const name of phase)rows.push(await live.cast(name,{target:live.db.find(s=>s.Name===name).TargetType==='Attack'?target:undefined,wait:3500}));}
rows.push(await live.cast('CH_SOULCOLLECT',{wait:1800}));rows.push(await live.cast('MO_EXPLOSIONSPIRITS',{wait:1500}));rows.push(await live.cast('IQ_BLAZING_FLAME_BLAST',{wait:7000}));
await game.screenshot({path:'artifacts/skill-live/inquisitor.png'});return rows;
