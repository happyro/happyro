assert.equal((await snapshot()).name,'JobAuditM');
const proof=[];
for(const [x,y] of [[55,50],[80,60],[114,50]]){
 await jobNpc.travel('job3_rune01',x,y-1);await jobNpc.contact(x,y);proof.push({npc:[x,y],...await jobNpc.run(x===55?["我已经制作了20个符文石"]:[])});
}
await fs.writeFile('docs/development/job-change-review/evidence/rune-knight-final-intro.json',JSON.stringify(proof,null,2));return proof;
