assert.equal((await snapshot()).name,'JobDirectM');await game.reload();
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
	await game.locator('#slot1').click({timeout: 30000});
	await game.locator('.charinfo .ok').click();

await game.waitForFunction(()=>window.__fourthTest?.session.Playing&&window.__fourthTest.session.Entity,null,{timeout:120000});await game.waitForTimeout(1500);return {name:(await snapshot()).name};
