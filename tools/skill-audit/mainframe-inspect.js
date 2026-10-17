return {snapshot:await snapshot(),view:await game.evaluate(()=>({stats:window.__learnStats,packets:window.__audit.packets.filter(p=>[45,46,25].includes(p.varID)).slice(-20)}))};
