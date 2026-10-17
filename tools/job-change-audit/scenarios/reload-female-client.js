assert.equal((await snapshot()).name,'JobAuditF');await game.context().unroute('**/Online.js*');
	await game.context().route('**/Online.js*', async route => {
		const response = await route.fetch();
		const body = await response.text();
		// Test-only accessors; retain all actual client/server skill behavior.
		await route.fulfill({response, body: body + '\nwindow.__fourthTest={get altitude(){return Altitude;},get keys(){return KEYS;},get renderer(){return Renderer;},get packets(){return Packets.list;},get entities(){return EntityManager;},get targeting(){return SkillTargetSelection;},get manager(){return EffectManager;},get inventory(){return InventoryController.getUI();},get session(){return SessionStorage_default;},get skills(){return Controller$4.getUI();},get network(){return Network;},get packet(){return PACKET;},get effects(){return SkillEffect;},get renderEffects(){return EffectTable_default;},get explicitEffects(){return fourthJobSkillEffects;},get chat(){return ChatBox;}};'});
	});
await game.reload();
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
	await game.locator('#slot0').click({timeout: 30000});
	await game.locator('.charinfo .ok').click();

await game.waitForFunction(()=>window.__fourthTest?.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:120000});await game.waitForTimeout(1500);return {name:(await snapshot()).name};
