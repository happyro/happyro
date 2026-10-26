await live.job(4074,200,70);
return {id:await game.evaluate(()=>window.__fourthTest.session.Entity.GID),hp:(await snapshot()).hp};
