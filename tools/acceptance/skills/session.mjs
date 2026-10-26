import { requireAuditCommand } from './cli.mjs';
requireAuditCommand(import.meta.url, '--run --role main|partner|assist --character NAME --browser-path PATH [--port N] [--slot N] [--base-url URL] [--credentials FILE]');
import playwright from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {sessionOptions} from './session-options.mjs';
import SK from '../../../repos/happyro-client/src/DB/Skills/SkillConst.js';
import SU from '../../../repos/happyro-client/src/DB/Skills/SkillUnitConst.js';
import { fourthJobGroundResources } from '../../../repos/happyro-client/src/DB/Skills/FourthJobGroundEffects.js';
const options = sessionOptions(process.argv.slice(2));
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
const credentials = Object.fromEntries((await fs.readFile(options.credentials, 'utf8')).split('\n')
  .filter(line => line && !line.startsWith('#')).map(line => {
    const equals = line.indexOf('=');
    if (equals < 1) throw new Error('Malformed credentials file');
    return [line.slice(0, equals), line.slice(equals + 1).trim()];
  }));
if (!credentials[options.user] || !credentials[options.password]) throw new Error('Missing account credentials');
await fs.mkdir('artifacts/skill-live', {recursive: true});
const browser = await playwright.chromium.launch({headless: true, executablePath: options.browserPath,
  args: ['--remote-debugging-address=127.0.0.1', `--remote-debugging-port=${options.port - 1}`]});
const report = {startedAt: new Date().toISOString(), jobs: [], assertions: [], errors: []};
let game;
try {
	const context = await browser.newContext({viewport: {width: 1280, height: 900}});
	await context.route('**/Online.js*', async route => {
		const response = await route.fetch();
		const body = await response.text();
		// Test-only accessors; retain all actual client/server skill behavior.
		await route.fulfill({response, body: body + '\nwindow.__fourthTest={get altitude(){return Altitude;},get keys(){return KEYS;},get renderer(){return Renderer;},get packets(){return Packets.list;},get entities(){return EntityManager;},get targeting(){return SkillTargetSelection;},get manager(){return EffectManager;},get inventory(){return InventoryController.getUI();},get session(){return SessionStorage_default;},get skills(){return Controller$4.getUI();},get network(){return Network;},get packet(){return PACKET;},get effects(){return SkillEffect;},get renderEffects(){return EffectTable_default;},get explicitEffects(){return fourthJobSkillEffects;},get chat(){return ChatBox;}};'});
	});
	const page = await context.newPage();
	await page.goto(`${options.baseUrl}/applications/pwa/index.html`);
	const popup = context.waitForEvent('page');
	await page.getByRole('button', {name: '进入游戏'}).click();
	game = await popup;
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
	}, {user: credentials[options.user], password: credentials[options.password]});
	await game.keyboard.press('Enter');
	await game.locator(`#slot${options.slot}`).click({timeout: 30000});
	await game.locator('.charinfo .ok').click();
	console.log('Selected automation character');
	await game.waitForFunction(()=>window.__fourthTest?.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:120000});
	await game.waitForTimeout(2000);

	await game.locator('#game-tools').click({timeout:120000});
	await game.locator('.tab-button[data-tab="character"]').click({timeout: 30000});
	await game.getByText('骑乘与随行', {exact:true}).waitFor({timeout:30000});
	assert(sessionHeaders, 'Game API session headers captured');
	const headers = sessionHeaders;
	const api = `${options.baseUrl}/api/adventure-tools/character`;
	const snapshot = async () => {
		const r = await game.request.get(api, {headers});
		assert.equal(r.status(), 200);return (await r.json()).data;
	};
	const command = async (type, payload, valid = true) => {
		await new Promise(resolve => setTimeout(resolve, 2100));
		const r = await game.request.post(`${api}/commands`, {headers, data: {idempotency_key: crypto.randomUUID(), type, payload}});
		const json = await r.json();
		if (valid) assert.equal(r.status(), 200, JSON.stringify(json));
		else assert(r.status() >= 400, JSON.stringify(json));
		return json.data;
	};
	let current = await snapshot();
	assert.equal(current.name, options.character, 'Only the dedicated automation character may be modified');

 await fs.writeFile(`artifacts/skill-live/${options.role}-current.json`,JSON.stringify(current,null,2));
 await game.screenshot({path:`artifacts/skill-live/${options.role}-current.png`});
 const http=await import('node:http');
 const server=http.createServer(async(req,res)=>{
  if(req.method!=='POST'){res.writeHead(405);res.end();return;}
  try {let body='';for await(const part of req)body+=part;
   const code=JSON.parse(body).code;
   const value=await eval('(async()=>{'+code+'})()');
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,value}));
  }catch(e){res.statusCode=500;res.end(JSON.stringify({ok:false,error:e.stack}));}
 });
 await new Promise(resolve=>server.listen(options.port,'127.0.0.1',resolve));
 console.log(`LIVE_READY: local controller ${options.port}, browser ${options.port - 1}`);
 await new Promise(()=>{});
} finally {await browser.close();}
