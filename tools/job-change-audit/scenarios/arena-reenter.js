// Session fragment: read progress.md and verify current NPC stage before execution.
globalThis.jobNpc=(await import('./dialogue.mjs')).dialogueDriver(game, snapshot);
await command('character.stats.update',{str:99,agi:99,vit:99,int:30,dex:99,luk:1});
await command('character.vitals.restore',{});
await jobNpc.travel('prt_in',79,93);await jobNpc.contact(79,94);
const dialogue=await jobNpc.run(['我想再试一次']);
await game.waitForTimeout(1000);
await game.mouse.dblclick(512,75);
await game.waitForTimeout(1000);
return {dialogue,map:(await snapshot()).map,pos:await game.evaluate(()=>Array.from(window.__fourthTest.session.Entity.position)),room:await game.locator('[id]').evaluateAll(es=>es.filter(e=>e.id.includes('ChatRoom')).map(e=>[e.id,e.textContent]))};
