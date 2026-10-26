const build=JSON.parse(await fs.readFile('repos/happyro-client/dist/Web/build-info.json','utf8')).buildId;
await game.goto('http://127.0.0.1:3338/applications/pwa/api.html?v='+build+'&app=ONLINE');
await game.locator('.btn_play').click({timeout:30000});
await game.locator('input[type="password"]').waitFor({timeout:30000});
await game.evaluate(({user,password})=>{
 const roots=[document],inputs=[];for(let i=0;i<roots.length;i++)for(const n of roots[i].querySelectorAll('*')){if(n.shadowRoot)roots.push(n.shadowRoot);if(n instanceof HTMLInputElement&&n.getBoundingClientRect().width)inputs.push(n);}
 for(const [input,value] of [[inputs.find(i=>i.type!=='password'),user],[inputs.find(i=>i.type==='password'),password]]){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));}inputs.find(i=>i.type==='password').focus();
},{user:credentials[options.user],password:credentials[options.password]});
await game.keyboard.press('Enter');await game.locator('#slot0').click({timeout:30000});await game.locator('.charinfo .ok').click();
await game.waitForFunction(()=>window.__fourthTest?.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:60000});
await game.waitForTimeout(1500);return {build,loaded:await game.evaluate(()=>({mapping:window.__fourthTest.effects[2050],name:window.__fourthTest.session.Entity.name}))};
