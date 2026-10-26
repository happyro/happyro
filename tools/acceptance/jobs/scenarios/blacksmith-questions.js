assert.equal((await snapshot()).name,'JobAudit2M');globalThis.jobNpc=(await import('./dialogue.mjs?quiz=1')).dialogueDriver(game,snapshot);
await jobNpc.travel('ein_in01',201,26);await jobNpc.contact(201,27);let answers,question=0;
const proof=await jobNpc.run(({options})=>{if(options[0]==='是的。')return 0;if(!answers){if(options[0].startsWith('梦罗克 -'))answers=[3,0,3,2,0,3,1,2,0,0];else if(options[0].startsWith('艾尔帕兰 -'))answers=[3,2,0,0,3,1,1,2,3,1];else throw Error('Unknown smith quiz '+options.join('|'));}assert(question<10);return answers[question++];},140);
await fs.writeFile('docs/development/job-change-review/evidence/blacksmith-questions.json',JSON.stringify({question,proof},null,2));assert.equal(question,10);return proof;
