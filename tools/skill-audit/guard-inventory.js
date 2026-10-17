return await game.evaluate(()=>window.__fourthTest.inventory.list.filter(i=>[2101,1401,1101,1201].includes(i.ITID)).map(i=>({id:i.ITID,index:i.index})));
