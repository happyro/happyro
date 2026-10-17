return await game.evaluate(()=>({learned:Object.values(window.__learnState||{}).filter(s=>s.level>0).map(s=>({id:s.SKID,level:s.level})),target:window.__learnState?.[5288]}));
