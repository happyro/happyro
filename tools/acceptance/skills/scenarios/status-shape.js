return await game.evaluate(()=>{const t=window.__fourthTest;return {sessionKeys:Object.keys(t.session),entityKeys:Object.keys(t.session.Entity),stats:t.session.stats,status:t.session.status};});
