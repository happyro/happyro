return await game.evaluate(()=>({audit:window.__audit,items:window.__fourthTest.inventory.list.filter(i=>[990,991,994,995].includes(i.ITID)).map(i=>({id:i.ITID,index:i.index,count:i.count}))}));
