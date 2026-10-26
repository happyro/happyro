const before=await game.evaluate(()=>window.__fourthTest.inventory.list.map(i=>({id:i.ITID,count:i.count})));
await game.locator('#MakeArrowSelection .item').filter({hasText:'空瓶'}).dblclick();await game.waitForTimeout(1500);
const after=await game.evaluate(()=>window.__fourthTest.inventory.list.map(i=>({id:i.ITID,count:i.count})));
await fs.writeFile('artifacts/skill-live/arrow-crafting.json',JSON.stringify({before,after},null,2));return {before,after};
