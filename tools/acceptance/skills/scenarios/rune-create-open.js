await live.job(4252,275,60);await command('character.stats.update',{str:1000,agi:80,vit:80,int:120,dex:120,luk:120});
for(const id of [12736,7210,7939])await live.grant(id,2);
const before=await game.evaluate(()=>window.__fourthTest.inventory.list.map(i=>({id:i.ITID,count:i.count||1})));globalThis.runeBefore=before;
await game.evaluate(()=>{const t=window.__fourthTest;t.inventory.useItem(t.inventory.getItemById(12736));});await game.waitForTimeout(1200);
return await game.evaluate(()=>[...document.querySelectorAll('[id]')].filter(e=>e.shadowRoot&&e.getBoundingClientRect().width&&/select|mix|skillitem/i.test(e.id)).map(e=>{const d=document.createElement('div');d.innerHTML=e.shadowRoot.innerHTML;d.querySelectorAll('style').forEach(x=>x.remove());return {id:e.id,text:d.textContent,html:d.innerHTML};}));
