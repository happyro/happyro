await game.getByRole('button',{name:'确定',exact:true}).click();return await game.evaluate(()=>({party:window.__fourthTest.session.hasParty,leader:window.__fourthTest.session.isPartyLeader}));
