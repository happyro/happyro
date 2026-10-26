assert.equal((await snapshot()).name,'JobAuditM');
globalThis.jobNpc=(await import('./dialogue.mjs?v=4')).dialogueDriver(game,snapshot);
const file='docs/development/job-change-review/evidence/rune-knight-books.json';const proof={books:[]};
for(const [name,x,y,choices] of [['Runes and Rune Knights',40,54,[0,1,2]],['Principles',43,44,[0,1,2]],['Make and Use',50,36,[0,1,0,1,1,1,2,1,3,2]]]){
 await jobNpc.travel('job3_rune01',x,y-1);await jobNpc.contact(x,y);const dialogue=await jobNpc.run(choices,120);assert.equal(dialogue.waiting,'closed');proof.books.push({name,dialogue});await fs.writeFile(file,JSON.stringify(proof,null,2));
}
await jobNpc.travel('job3_rune01',55,49);await jobNpc.contact(55,50);proof.renoa=await jobNpc.run();assert(proof.renoa.pages.some(p=>p.text?.includes('读完图书馆')));
await fs.writeFile(file,JSON.stringify(proof,null,2));return {books:proof.books.length,last:proof.renoa.pages.at(-1)};
