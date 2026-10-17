return {snapshot:{name:(await snapshot()).name,x:(await snapshot()).x,y:(await snapshot()).y},observed:await game.evaluate(()=>window.__audit),talkie:await game.evaluate(()=>window.__talkie)};
