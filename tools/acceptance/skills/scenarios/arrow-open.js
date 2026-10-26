await live.grant(713,2);await live.cast('AC_MAKINGARROW',{wait:1200});await game.screenshot({path:'artifacts/skill-live/arrow-selection.png'});return {text:await game.locator('body').innerText()};
