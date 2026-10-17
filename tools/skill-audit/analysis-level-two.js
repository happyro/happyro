await live.cast('SO_EL_ANALYSIS',{level:2,wait:3500});
const before=await game.evaluate(()=>{const i=window.__fourthTest.inventory;return {index:i.getItemById(991).index,stone:i.getItemById(991)?.count||0,ore:i.getItemById(995)?.count||0};});assert(before.stone>=10);
await game.locator('#ItemListWindowSelection .item[data-index="'+before.index+'"]').dragTo(game.locator('#ConvertItems .content'));await game.locator('#InputBox input').fill('10');await game.locator('#InputBox ui-button').click();await game.locator('#ConvertItems ui-button.trade').click();await game.locator('#MakeModelMessage ui-button.ok').click();await game.waitForTimeout(1800);
const after=await game.evaluate(()=>{const i=window.__fourthTest.inventory;return {stone:i.getItemById(991)?.count||0,ore:i.getItemById(995)?.count||0};});const observed=await game.evaluate(()=>window.__audit);
assert.equal(after.stone,before.stone-10);assert([0,1].includes(after.ore-before.ore));
await fs.writeFile('artifacts/skill-live/analysis-level-two.json',JSON.stringify({before,after,observed},null,2));return {before,after,chat:observed.chat};
