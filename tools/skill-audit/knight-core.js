const rows=[];await live.job(4008,99,70);await command('character.stats.update',{str:1000,agi:80,vit:80,int:100,dex:120,luk:30});await live.grant(1151);await live.equip(1151);
for(const name of ['KN_TWOHANDQUICKEN','KN_AUTOCOUNTER','KN_BOWLINGBASH','LK_AURABLADE','LK_PARRYING','LK_CONCENTRATION','KN_CHARGEATK'])rows.push(await live.cast(name,{wait:6500}));
await live.grant(1401);await live.equip(1401);const s=await snapshot();const mount=s.riding.find(r=>r.kind==='peco');if(mount&&!mount.active)await command('character.riding.update',{kind:mount.kind,enabled:true,fee:mount.fee,ticket:mount.ticket});
for(const name of ['KN_PIERCE','KN_BRANDISHSPEAR','KN_SPEARSTAB','KN_SPEARBOOMERANG','LK_SPIRALPIERCE','LK_HEADCRUSH','LK_JOINTBEAT'])rows.push(await live.cast(name,{wait:6500}));
await game.screenshot({path:'artifacts/skill-live/lord-knight.png'});return rows;
