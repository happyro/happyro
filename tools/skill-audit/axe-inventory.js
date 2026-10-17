return await game.evaluate(()=>{const i=window.__fourthTest.inventory;return {list:i.list.slice(-20).map(x=>({id:x.ITID,index:x.index,count:x.count})),equip:i.equippedItems};});
