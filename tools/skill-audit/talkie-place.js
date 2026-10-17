await live.job(4012,99,70);await live.grant(1065,10);
const pos=await game.evaluate(()=>{const t=window.__fourthTest;const e=t.session.Entity;return t.altitude.getCellsInSquareRange(e.position[0]|0,e.position[1]|0,3).find(p=>p.x===(e.position[0]|0)+2&&p.y===(e.position[1]|0)+2);});assert(pos,'clear cell');
await game.evaluate(()=>{const t=window.__fourthTest;window.__talkie=[];for(const p of t.packets){if(!p?.callback||!p.name.includes('TALKBOX'))continue;const fn=p.callback;p.callback=function(pkt){window.__talkie.push({...pkt});return fn.apply(this,arguments);};}window.__audit.packets=[];});
await game.evaluate(pos=>window.__fourthTest.targeting.onUseSkillToPos(125,1,pos.x,pos.y),pos);
await game.getByLabel('话匣子留言',{exact:true}).fill('技能验收：中文留言');await game.getByRole('button',{name:'确认',exact:true}).last().click();await game.waitForTimeout(1500);
const packets=await game.evaluate(()=>window.__audit.packets);assert(packets.some(p=>p.name.includes('SKILL_ENTRY')),'Trap entry received');
await fs.writeFile('artifacts/skill-live/talkie-place.json',JSON.stringify({pos,packets},null,2));await game.screenshot({path:'artifacts/skill-live/talkie-placed.png'});return {pos};
