const sign=game.getByText('技能验收勿买',{exact:true});return {count:await sign.count(),buttons:await game.locator('button').allTextContents()};
