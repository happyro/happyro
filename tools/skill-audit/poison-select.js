const before=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12717)?.count);
await game.locator('#MakeArrowSelection .item').filter({hasText:'麻痹'}).dblclick();await game.waitForTimeout(1000);
const after=await game.evaluate(()=>window.__fourthTest.inventory.getItemById(12717)?.count);
assert.equal(after,before-1);const rows=[];rows.push(await live.cast('GC_VENOMPRESSURE',{wait:6500}));rows.push(await live.cast('GC_POISONSMOKE',{wait:6500}));await fs.writeFile('artifacts/skill-live/poison-selection.json',JSON.stringify({before,after,rows},null,2));return {before,after,rows};
