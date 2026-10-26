/** Browser smoke check of an owned offline installation, using real UI and read-only character API. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
if (!args.includes('--run')) {
 const color=(code,text)=>args.includes('--no-color')?text:`\x1b[${code}m${text}\x1b[0m`;
 console.log(`\n${color('1;36','HappyRO offline browser smoke check')}\n\n${color('1;33','Usage')}\n  ${color('1;32','--run')} --batch PATH --output PATH [--browser-path PATH]\n\n${color('1;33','Example')}\n${color('36','  python3 tools/acceptance/offline/manage.py check --version "$(cat deploy/docker/VERSION)" --batch smoke-1')}\n\nUse the managed check command; logs contain no session tokens.\n`);
 process.exit(0);
}
function option(name) { const index=args.indexOf(name); return index<0?undefined:args[index+1]; }
const batch=await fs.realpath(option('--batch'));
const state=JSON.parse(await fs.readFile(path.join(batch,'state.json'),'utf8'));
assert.equal(batch,path.join(await fs.realpath(state.workspace),'work/releases',state.version,'acceptance',state.batch));
assert.match(state.project,/^[a-z0-9][a-z0-9_-]{0,127}$/);
const output=await fs.realpath(option('--output'));
assert(output.startsWith(path.join(batch,'evidence')+path.sep));
const base=new URL(state.gateway_url);
assert.equal(base.hostname,'127.0.0.1'); assert.equal(base.protocol,'http:');
const report={status:'running',character:'罗安',moved:false,errors:[]};
let browser, game;
try {
 browser=await chromium.launch({headless:true,...(option('--browser-path')?{executablePath:option('--browser-path')}:{channel:'chrome'})});
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 context.on('page',page=>{
  page.on('pageerror',error=>report.errors.push(error.message.slice(0,300)));
  page.on('response',response=>{
   if(response.status()>=400 && ['document','script','stylesheet'].includes(response.request().resourceType()))
    report.errors.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });
 });
 const launcher=await context.newPage();
 await launcher.goto(new URL('/applications/pwa/index.html',base).href);
 const popup=context.waitForEvent('page',{timeout:30000});
 await launcher.getByRole('button',{name:'进入游戏',exact:true}).click();
 game=await popup;
 await game.waitForLoadState('domcontentloaded');
 await game.locator('.btn_play').click({timeout:60000});
 await game.locator('input[type="password"]').waitFor({timeout:30000});
 await game.evaluate(()=>{
  const roots=[document], inputs=[];
  for(let i=0;i<roots.length;i++)for(const node of roots[i].querySelectorAll('*')){
   if(node.shadowRoot)roots.push(node.shadowRoot);
   if(node instanceof HTMLInputElement && node.getBoundingClientRect().width)inputs.push(node);
  }
  const user=inputs.find(input=>input.type==='text'), password=inputs.find(input=>input.type==='password');
  if(!user||!password)throw new Error('Login inputs unavailable');
  for(const input of [user,password]){input.value='happyro';input.dispatchEvent(new Event('input',{bubbles:true}));}
  password.focus();
 });
 await game.keyboard.press('Enter');
 await game.locator('#slot0').click({timeout:60000});
 await game.locator('.charinfo .ok').click();
 await game.locator('#game-tools').waitFor({timeout:120000});
 const characterResponse=game.waitForResponse(response=>
  new URL(response.url()).pathname==='/api/adventure-tools/character' && response.request().method()==='GET',
  {timeout:30000});
 await game.locator('#game-tools').click();
 await game.locator('.tab-button[data-tab="character"]').click({timeout:30000});
 const response=await characterResponse;
 assert.equal(response.status(),200,'Character API did not succeed');
 const headers=Object.fromEntries(Object.entries(await response.request().allHeaders())
  .filter(([key])=>key.startsWith('x-happyro-')));
 assert(headers['x-happyro-character-id'] && headers['x-happyro-auth-token'],'Character API session was not established');
 async function snapshot(){
  const response=await game.request.get(base.origin+'/api/adventure-tools/character',{headers});
  assert.equal(response.status(),200);
  const data=(await response.json()).data;
  assert.equal(data.name,'罗安','Refuse to move any other character');
  assert(data.map && Number.isFinite(data.x) && Number.isFinite(data.y) && data.hp>0);
  return {name:data.name,map:data.map,x:data.x,y:data.y};
 }
 const before=await snapshot();
 report.before=before;
 await game.locator('.game-tools-window .close').click();
 const canvases=await game.locator('body > canvas').evaluateAll(elements=>elements.map(element=>{
  const {x,y,width,height}=element.getBoundingClientRect();return {x,y,width,height};
 }).filter(box=>box.width>200 && box.height>200));
 assert.equal(canvases.length,1,'Expected one visible game-size canvas, excluding text rendering canvases');
 const box=canvases[0];
 await game.screenshot({path:path.join(output,'luoan-entered.png')});
 // Native clicks only, no injected client code, teleport or game commands.
 // Try a few nearby screen positions; confirm movement from the server's read API.
 for(const [dx,dy] of [[65,15],[-65,15],[0,60],[0,-65]]){
  await game.mouse.click(box.x+box.width/2+dx,box.y+box.height/2+dy);
  for(let poll=0;poll<4;poll++){
   await new Promise(resolve=>setTimeout(resolve,800));
   const after=await snapshot();
   if(after.map===before.map && (after.x!==before.x||after.y!==before.y)){
    report.after=after;report.moved=true;break;
   }
  }
  if(report.moved)break;
 }
 assert(report.moved,'Luo An entered the map but native movement was not confirmed');
 await game.screenshot({path:path.join(output,'luoan-moved.png')});
 assert.equal(report.errors.length,0,'Browser runtime or essential resource errors occurred');
 report.status='passed';
} catch(error) {
 report.status='failed';
 report.error=error.message.slice(0,500);
 console.error(report.error);
 if(game)await game.screenshot({path:path.join(output,'browser-failed.png')}).catch(()=>{});
 process.exitCode=1;
} finally {
 if(browser)await browser.close();
 await fs.writeFile(path.join(output,'browser.json'),JSON.stringify(report,null,2)+'\n');
 console.log(`Luo An browser smoke check: ${report.status}`);
}
