import playwright from 'playwright-core';
import {pacedSnapshot} from './snapshot.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
process.chdir(projectRoot);
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
if (!process.argv.includes('--run')) {
 const p=(c,s)=>process.argv.includes('--no-color')?s:`\x1b[${c}m${s}\x1b[0m`;
 console.log(`\n${p('1;36','HappyRO job-change browser audit')}\n${p('1;33','Usage')}\n  node tools/job-change-audit/session.mjs ${p('1;32','--run')} [--female] [--pair=1|2|3|4] [--slot=N] [--character=NAME] [--port=9351] [--base-url=http://127.0.0.1:3338] [--browser-path=PATH] [--mobile] [--no-color]\n${p('1;33','Example')}\n${p('36','  node tools/job-change-audit/session.mjs --run')}\n`);
 process.exit(0);
}
const female=process.argv.includes('--female');
const pair=Number(process.argv.find(a=>a.startsWith('--pair='))?.split('=')[1] || 1);
assert([1,2,3,4].includes(pair),'Supported account pairs: 1, 2, 3, 4');
const pairSuffix=pair===1?'':String(pair);
const slot=Number(process.argv.find(a=>a.startsWith('--slot='))?.split('=')[1] || 0);
const expectedCharacter=process.argv.find(a=>a.startsWith('--character='))?.slice(12);
assert(!expectedCharacter || /^Job[A-Za-z0-9]+$/.test(expectedCharacter), 'Explicit character must be a dedicated Job audit fixture');
const controlPort=Number(process.argv.find(a=>a.startsWith('--port='))?.split('=')[1] || 9351);
const credentials=JSON.parse(await fs.readFile('work/runtime/job-change-audit'+(pair===1?'':'-'+pair)+'.json','utf8'))[female?1:0];
const baseUrl=new URL(process.argv.find(a=>a.startsWith('--base-url='))?.slice(11) || 'http://127.0.0.1:3338');
const browserPath=process.argv.find(a=>a.startsWith('--browser-path='))?.slice(15);
const browser = await playwright.chromium.launch({headless:true, ...(browserPath ? {executablePath:browserPath} : {channel:'chrome'}), args:[`--remote-debugging-port=${controlPort-1}`]});
const report = {startedAt: new Date().toISOString(), jobs: [], assertions: [], errors: []};
let game;
try {
	const context = await browser.newContext((process.argv.includes('--mobile') || process.argv.includes('--tablet')) ? {viewport: process.argv.includes('--tablet') ? {width:820,height:1180} : {width:390,height:844}, isMobile:true, hasTouch:true,userAgent:process.argv.includes('--tablet') ? 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'} : {viewport:{width:1280,height:900}});
	await context.route('**/Online.js*', async route => {
		const response = await route.fetch();
		const body = await response.text();
		// Test-only accessors; retain all actual client/server skill behavior.
		await route.fulfill({response, body: body + '\nwindow.__fourthTest={get altitude(){return Altitude;},get keys(){return KEYS;},get renderer(){return Renderer;},get packets(){return Packets.list;},get entities(){return EntityManager;},get targeting(){return SkillTargetSelection;},get manager(){return EffectManager;},get inventory(){return InventoryController.getUI();},get session(){return SessionStorage_default;},get skills(){return Controller$4.getUI();},get network(){return Network;},get packet(){return PACKET;},get effects(){return SkillEffect;},get renderEffects(){return EffectTable_default;},get explicitEffects(){return fourthJobSkillEffects;},get chat(){return ChatBox;}};'});
	});
	const page = await context.newPage();
	await page.goto(new URL('/applications/pwa/index.html',baseUrl).href);
	const popup = (process.argv.includes('--mobile') || process.argv.includes('--tablet')) ? Promise.resolve(page) : context.waitForEvent('page');
	await page.getByRole('button', {name: '进入游戏'}).click();
	game = await popup;
 if((process.argv.includes('--mobile') || process.argv.includes('--tablet'))) await game.setViewportSize(process.argv.includes('--tablet') ? {width:820,height:1180} : {width:390,height:844});
	game.on('websocket', socket => socket.on('framesent', event => {
		if (Buffer.isBuffer(event.payload) && event.payload.length === 7 && event.payload.readUInt16LE(0) === 0x90) {
			report.assertions.push(`NPC contact sent to ${event.payload.readUInt32LE(2)}`);
			console.log('NPC contact packet sent');
		}
	}));
	let sessionHeaders;
	game.on('request', request => {
		if (request.url().includes('/api/adventure-tools/')) {
			const candidate = Object.fromEntries(Object.entries(request.headers()).filter(([key]) => key.startsWith('x-happyro-')));
			if (candidate['x-happyro-character-id'] && candidate['x-happyro-auth-token']) sessionHeaders = candidate;
		}
	});
	game.on('pageerror', error => {report.errors.push(error.message);console.log('PAGE_ERROR',error.message);});
	game.on('console',msg=>{if(msg.type()==='error')console.log('BROWSER_ERROR',msg.text());});
	await game.waitForLoadState('domcontentloaded');
	await game.locator('.btn_play').click({timeout: 30000});
	await game.locator('input[type="password"]').waitFor();
	await game.evaluate(({user, password}) => {
		const roots = [document];
		const inputs = [];
		for (let i = 0; i < roots.length; i++) for (const node of roots[i].querySelectorAll('*')) {
			if (node.shadowRoot) roots.push(node.shadowRoot);
			if (node instanceof HTMLInputElement && node.getBoundingClientRect().width) inputs.push(node);
		}
		for (const [input, value] of [[inputs.find(i => i.type !== 'password'), user], [inputs.find(i => i.type === 'password'), password]]) {
			input.value = value; input.dispatchEvent(new Event('input', {bubbles: true}));
		}
		inputs.find(i => i.type === 'password').focus();
	}, {user: credentials.user, password: credentials.password});
	await game.keyboard.press('Enter');
	await game.locator(`#slot${slot}`).click({timeout: 30000});
	await game.locator((process.argv.includes('--mobile') || process.argv.includes('--tablet')) ? '.action-group .ok' : '.charinfo .ok').click();
	console.log('Selected automation character');
	await game.waitForFunction(()=>window.__fourthTest?.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:120000});
	await game.waitForTimeout(2000);

	sessionHeaders=await game.evaluate(()=>{const s=window.__fourthTest.session;return {'x-happyro-account-id':String(s.AID),'x-happyro-character-id':String(s.GID),'x-happyro-auth-token':s.WebToken};});
	const headers = sessionHeaders;
	const api = new URL('/api/adventure-tools/character',baseUrl).href;
	const refreshHeaders = async () => Object.assign(headers, await game.evaluate(()=>{const s=window.__fourthTest.session;return {'x-happyro-account-id':String(s.AID),'x-happyro-character-id':String(s.GID),'x-happyro-auth-token':s.WebToken};}));
	const snapshot = pacedSnapshot(async () => {
		await refreshHeaders();
		const r = await game.request.get(api, {headers});
		assert.equal(r.status(), 200);return (await r.json()).data;
	});
	const command = async (type, payload, valid = true) => {
		await new Promise(resolve => setTimeout(resolve, 2100));
		await refreshHeaders();
		const r = await game.request.post(`${api}/commands`, {headers, data: {idempotency_key: crypto.randomUUID(), type, payload}});
		const json = await r.json();
		if (valid) assert.equal(r.status(), 200, JSON.stringify(json));
		else assert(r.status() >= 400, JSON.stringify(json));
		return json.data;
	};
	let current = await snapshot();
	assert.equal(current.name, expectedCharacter || (slot===1 ? 'JobDirect'+pairSuffix+credentials.sex : credentials.character), 'Only the dedicated automation character may be modified');

 const http=await import('node:http');
 const server=http.createServer(async(req,res)=>{
  if(req.method!=='POST'){res.writeHead(405);res.end();return;}
  try {let body='';for await(const part of req)body+=part;
   const code=JSON.parse(body).code;
   const value=await eval('(async()=>{'+code+'})()');
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,value}));
  }catch(e){res.statusCode=500;res.end(JSON.stringify({ok:false,error:e.stack}));}
 });
 await new Promise(resolve=>server.listen(controlPort,'127.0.0.1',resolve));
 console.log(`LIVE_READY: local controller ${controlPort}, browser ${controlPort-1}`);
 await new Promise(()=>{});
} catch(error) { console.error('LIVE_START_FAILED',error.stack); process.exitCode=1; } finally {await browser.close();}
