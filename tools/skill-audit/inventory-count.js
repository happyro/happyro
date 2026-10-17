return await game.evaluate(()=>({count:window.__fourthTest.inventory.list.length,items:window.__fourthTest.inventory.list.map(i=>({id:i.ITID,count:i.count||1}))}));
