return await game.evaluate(()=>{const i=window.__fourthTest.inventory;return i.equippedItems.map(n=>i.getItemByIndex(n));});
