await support.command('character.vitals.restore',{});
const target=await live.spawn();
await game.evaluate(target=>{const t=window.__fourthTest;window.__support.layers=[];window.__support.packets=[];t.targeting.onUseSkillToId(2052,5,target.id);},target);
await game.waitForTimeout(6500);
const row={id:2052,target,...await game.evaluate(()=>window.__support)};support.rows.push(row);
await fs.writeFile('artifacts/skill-live/support-effects-live.json',JSON.stringify({rows:support.rows,errors:support.errors},null,2));
return row;
