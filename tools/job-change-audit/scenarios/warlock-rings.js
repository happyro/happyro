assert.equal((await snapshot()).name,'JobDirectF');
await jobNpc.contact(77,107);const dialogue=await jobNpc.run();
const rings=await game.evaluate(()=>[2796,2797].map(id=>{const item=window.__fourthTest.inventory.getItemById(id);return item?{id,index:item.index,location:item.location}:null;}));assert(rings.every(Boolean));
await fs.writeFile('docs/development/job-change-review/evidence/warlock-rings.json',JSON.stringify({dialogue,rings},null,2));return rings;
