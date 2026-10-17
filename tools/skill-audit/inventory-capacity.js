return {state:await snapshot(),inventory:await game.evaluate(()=>window.__fourthTest.inventory.list.map(i=>({id:i.ITID,count:i.count||1})))};
