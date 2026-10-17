await game.keyboard.press('Alt+z');await game.keyboard.up('Alt');await game.waitForTimeout(500);
const text=await game.evaluate(()=>{const r=document.getElementById('PartyFriendsV1')?.shadowRoot;const copy=document.createElement('div');copy.innerHTML=r?.innerHTML||'';copy.querySelectorAll('style').forEach(e=>e.remove());return copy.textContent;});
await fs.writeFile('artifacts/skill-live/party-name-fixed.json',JSON.stringify({text},null,2));await game.screenshot({path:'artifacts/skill-live/party-name-fixed.png'});await game.keyboard.press('Alt+z');await game.keyboard.up('Alt');return {text};
