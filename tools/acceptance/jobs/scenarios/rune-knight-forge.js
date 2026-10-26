assert.equal((await snapshot()).name,'JobAuditM');
const source=await fs.readFile('repos/happyro-server/npc/re/jobs/3-1/rune_knight.txt','utf8');
const hints=[...source.matchAll(/case \d+: setarray \.@str\$\[0\],"([^"]+)","([^"]+)"; break;/g)].map(m=>({answer:m[1],hint:m[2]}));assert.equal(hints.length,24);
const file='docs/development/job-change-review/evidence/rune-knight-forge.json';const proof={attempts:[],successes:0,method:'Actual furnace interaction, original5s progress bar, typed answers inferred from visible clue and book/script reference. No quest state writes.'};
await jobNpc.travel('job3_rune01',58,50);
for(let attempt=0;attempt<40&&proof.successes<20;attempt++){
 await jobNpc.contact(58,51);const start=await jobNpc.run(['使用符文加热炉']);await game.waitForTimeout(5500);const prompt=await jobNpc.run();
 await game.locator('#inputbox input').waitFor({state:'visible',timeout:15000});
 const text=await game.locator('#NpcBox .content').innerText();const matches=hints.filter(h=>text.includes(h.hint));assert(matches.length>0,'Unrecognized visible clue '+text);
 await game.locator('#inputbox input').fill(matches[0].answer);await game.locator('#inputbox ui-button').click();await game.waitForTimeout(300);
 const result=await jobNpc.run();const success=result.pages.some(p=>p.text?.includes('成功制作了 1 个'));if(success)proof.successes++;
 proof.attempts.push({start,prompt,text,possibleAnswers:matches.map(h=>h.answer),submitted:matches[0].answer,result,success});await fs.writeFile(file,JSON.stringify(proof,null,2));
}
assert.equal(proof.successes,20);return {successes:proof.successes,attempts:proof.attempts.length,ambiguous:proof.attempts.filter(a=>a.possibleAnswers.length>1).map(a=>({text:a.text,submitted:a.submitted,success:a.success}))};
