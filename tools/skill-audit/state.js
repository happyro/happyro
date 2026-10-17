return {state:await snapshot(),count:live.results.length,chat:await game.evaluate(()=>window.__audit.chat.slice(-10))};
