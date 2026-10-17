import { requireAuditCommand } from './cli.mjs';
requireAuditCommand(import.meta.url);
import playwright from '../../node_modules/playwright-core/index.js';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import SK from '../../repos/happyro-client/src/DB/Skills/SkillConst.js';
import SU from '../../repos/happyro-client/src/DB/Skills/SkillUnitConst.js';
import { fourthJobGroundResources } from '../../repos/happyro-client/src/DB/Skills/FourthJobGroundEffects.js';
const credentials = Object.fromEntries((await fs.readFile('work/runtime/test-account.env', 'utf8')).trim().split('\n').map(line => line.split('=')));
credentials.AUTOMATION_ACCOUNT_USER=credentials.TEST_ACCOUNT_USER;credentials.AUTOMATION_ACCOUNT_PASSWORD=credentials.TEST_ACCOUNT_PASSWORD;credentials.AUTOMATION_CHARACTER='happyro1';
const female = process.argv.includes('--female');
const persistence = process.argv.includes('--save') ? 'save' : process.argv.includes('--relogin') ? 'relogin' : null;
const npcAll = process.argv.includes('--npc-all');
const skillTest = true;
const experienceTest = process.argv.includes('--experience');
const bsonGroundTest = process.argv.includes('--bson-ground');
const groundTest = process.argv.includes('--ground') || bsonGroundTest;
const groundCastTest = process.argv.includes('--ground-cast');
const combatTest = process.argv.includes('--combat');
const r1Test = process.argv.includes('--r1');
const r2Test = process.argv.includes('--r2');
const r2DeathTest = process.argv.includes('--r2-death');
const r2ReloginTest = process.argv.includes('--r2-relogin');
const r3Test = process.argv.includes('--r3') && !process.argv.includes('--r3-mechanisms') && !process.argv.includes('--r3-relogin');
const r3MechanismsTest = process.argv.includes('--r3-mechanisms');
const r3ReloginTest = process.argv.includes('--r3-relogin');
const r4Test = process.argv.includes('--r4');
const r4SummonTest = process.argv.includes('--r4-summon');
const displayTest = process.argv.includes('--display');
const npc = process.argv.includes('--npc') || npcAll;
const reportPrefix = r4SummonTest || r4Test ? 'live-r4' : r3ReloginTest ? 'live-r3-relogin' : r3MechanismsTest ? 'live-r3-mechanisms' : r3Test ? 'live-r3' : r2ReloginTest ? 'live-r2-relogin' : r2DeathTest ? 'live-r2-death' : r2Test ? 'live-r2' : r1Test ? 'live-r1' : displayTest ? 'live-display' : combatTest ? 'live-combat' : bsonGroundTest ? 'live-bson-ground' : groundCastTest ? 'live-ground-cast' : groundTest ? 'live-ground' : experienceTest ? 'live-experience' : skillTest ? 'live-skills' : npc ? `live-npc${npcAll ? '-all' : ''}${female ? '-female' : ''}` : persistence ? `live-${persistence}` : female ? 'live-female' : 'live';
const browser = await playwright.chromium.launch({headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--remote-debugging-port=9342']});
const report = {startedAt: new Date().toISOString(), jobs: [], assertions: [], errors: []};
let game;
try {
	const context = await browser.newContext({viewport: {width: 1280, height: 900}});
	if (displayTest || skillTest || experienceTest || groundTest || groundCastTest || combatTest || r1Test || r2Test || r2DeathTest || r2ReloginTest || r3Test || r3MechanismsTest || r3ReloginTest || r4Test || r4SummonTest) await context.route('**/Online.js*', async route => {
		const response = await route.fetch();
		const body = await response.text();
		// Test-only accessors; retain all actual client/server skill behavior.
		await route.fulfill({response, body: body + '\nwindow.__fourthTest={get altitude(){return Altitude;},get keys(){return KEYS;},get renderer(){return Renderer;},get packets(){return Packets.list;},get entities(){return EntityManager;},get targeting(){return SkillTargetSelection;},get manager(){return EffectManager;},get inventory(){return InventoryController.getUI();},get session(){return SessionStorage_default;},get skills(){return Controller$4.getUI();},get network(){return Network;},get packet(){return PACKET;},get effects(){return SkillEffect;},get renderEffects(){return EffectTable_default;},get explicitEffects(){return fourthJobSkillEffects;},get chat(){return ChatBox;}};'});
	});
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:3338/applications/pwa/index.html');
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
	game.on('pageerror', error => report.errors.push(error.message));
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
	}, {user: credentials.AUTOMATION_ACCOUNT_USER, password: credentials.AUTOMATION_ACCOUNT_PASSWORD});
	await game.keyboard.press('Enter');
	await game.locator(female ? '#slot2' : '#slot0').click({timeout: 30000});
	await game.locator('.charinfo .ok').click();
	console.log('Selected automation character');
	await game.waitForTimeout(15000);

	await game.waitForFunction(()=>window.__fourthTest?.session.Playing,{timeout:30000});
 sessionHeaders=await game.evaluate(()=>{const s=window.__fourthTest.session;return {'x-happyro-account-id':String(s.AID),'x-happyro-character-id':String(s.GID),'x-happyro-auth-token':s.WebToken};});
	const headers = sessionHeaders;
	const api = 'http://127.0.0.1:3338/api/adventure-tools/character';
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
	assert.equal(current.name, female ? 'FourthTestF' : credentials.AUTOMATION_CHARACTER, 'Only the dedicated automation character may be modified');

 await fs.writeFile('artifacts/skill-live/partner-current.json',JSON.stringify(current,null,2));
 await game.screenshot({path:'artifacts/skill-live/partner-current.png'});
 const http=await import('node:http');
 const server=http.createServer(async(req,res)=>{
  if(req.method!=='POST'){res.writeHead(405);res.end();return;}
  try {let body='';for await(const part of req)body+=part;
   const code=JSON.parse(body).code;
   const value=await eval('(async()=>{'+code+'})()');
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,value}));
  }catch(e){res.statusCode=500;res.end(JSON.stringify({ok:false,error:e.stack}));}
 });
 await new Promise(resolve=>server.listen(9343,'127.0.0.1',resolve));
 console.log('LIVE_READY: local controller 9343, browser 9342');
 await new Promise(()=>{});
} finally {await browser.close();}
