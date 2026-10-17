// Browser-driven NPC dialogue helpers. No quest variables or job state are changed.
export function dialogueDriver(game, snapshot) {
 return {
  async travel(mapName, x, y) {
   await game.evaluate(({mapName,x,y})=>{
    const t=window.__fourthTest,p=new t.packet.CZ.HAPPYRO_MAP_TELEPORT();
    Object.assign(p,{requestId:Math.floor(Math.random()*60000),mapName,x,y});
    t.network.sendPacket(p);
   },{mapName,x,y});
   const deadline=Date.now()+45000;
   while(true) {
    const state=await snapshot();
    if(state.map===mapName && Math.abs(state.x-x)<=12 && Math.abs(state.y-y)<=12)break;
    if(Date.now()>deadline)throw Error(`Navigation did not arrive at ${mapName} near ${x},${y}`);
    await game.waitForTimeout(300);
   }
   const arrived=await snapshot();
   await game.waitForFunction(({x,y})=>{const t=window.__fourthTest,e=t.session.Entity;return t.session.Playing&&e&&Math.abs(e.position[0]-x)<=2&&Math.abs(e.position[1]-y)<=2;},{x:arrived.x,y:arrived.y},{timeout:60000});
   await game.waitForTimeout(500);
  },
  async contact(x,y) {
   await game.waitForFunction(({x,y})=>{
    let found=false;window.__fourthTest.entities.forEach(e=>{if(e.position[0]===x&&e.position[1]===y&&e.GID!==window.__fourthTest.session.AID)found=true;});return found;
   },{x,y},{timeout:60000});
   const npc=await game.evaluate(({x,y})=>{
    const t=window.__fourthTest;let found;
    t.entities.forEach(e=>{if(e.position[0]===x&&e.position[1]===y&&e.GID!==t.session.AID)found={id:e.GID,name:e.display?.name};});
    if(!found)throw Error(`NPC not visible at ${x},${y}`);
    const p=new t.packet.CZ.CONTACTNPC();p.NAID=found.id;t.network.sendPacket(p);return found;
   },{x,y});
   await Promise.race([game.locator('#NpcBox .content').waitFor({state:'visible',timeout:15000}),game.locator('#NpcMenu .content').waitFor({state:'visible',timeout:15000})]);
   return npc;
  },
  async run(choices=[],maxPages=50,inputs=[]) {
   const pages=[];let selected=0,entered=0;
   for(let i=0;i<maxPages;i++) {
    await game.waitForTimeout(180);
    const menu=game.locator('#NpcMenu .content');
    const next=game.locator('#NpcBox .next');
    const close=game.locator('#NpcBox .close');
    const content=game.locator('#NpcBox .content');
    const input=game.locator('#inputbox input');
    if(await content.isVisible())pages.push({text:await content.innerText()});
    if(await input.isVisible()) {
     const value=typeof inputs==='function' ? await inputs({pages,index:entered++}) : inputs[entered++];
     if(value===undefined)return {pages,waiting:'input'};
     pages.push({input:String(value)});
     await input.fill(String(value));
     await input.press('Enter');
     // Allow the input response to replace the previous page's close button.
     await game.waitForTimeout(500);
    } else if(await menu.isVisible()) {
     const options=await menu.locator('[data-index]').allTextContents();
     const choice=typeof choices==='function' ? await choices({options,pages,index:selected++}) : choices[selected++];
     pages.push({options,choice});
     if(choice===undefined)return {pages,waiting:'choice'};
     const index=typeof choice==='number'?choice:options.findIndex(v=>v.includes(choice));
     if(index<0||index>=options.length)throw Error('Missing choice '+choice+' in '+JSON.stringify(options));
     await menu.locator(`[data-index="${index}"]`).click();
     await game.locator('#NpcMenu .ok').click();
    } else if(await next.isVisible())await next.click();
    else if(await close.isVisible()){await close.click();return {pages,waiting:'closed'};}
    else return {pages,waiting:'server'};
   }
   throw Error('NPC dialogue exceeded page limit');
  }
 };
}
