const row=live.results.at(-1);
await game.getByText('选择物品',{exact:true}).waitFor({state:'visible'});assert.equal(await game.getByText('选择物品',{exact:true}).count(),1);assert.equal(await game.getByText('制作箭矢',{exact:true}).count(),0);
assert(await game.locator('#MakeArrowSelection .item').filter({hasText:'麻痹'}).count());
await game.screenshot({path:'artifacts/skill-live/selection-title-fixed.png'});
await game.locator('#MakeArrowSelection ui-button.cancel').click();
await fs.writeFile('artifacts/skill-live/selection-title-fixed.json',JSON.stringify({title:'选择物品',context:'GC_POISONINGWEAPON',row},null,2));return {verified:true};
