const previous=await game.evaluate(()=>window.__fourthTest.inventory.list.filter(i=>i.ITID===1504));assert.equal(previous.length,0);await live.grant(1504,1);return {granted:true};
