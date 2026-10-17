assert.equal((await snapshot()).name,'JobDirectF');
const file='docs/development/job-change-review/evidence/warlock-materials.json';const proof=JSON.parse(await fs.readFile(file));const record=async(name,dialogue)=>{proof.stages.push({name,...dialogue});await fs.writeFile(file,JSON.stringify(proof,null,2));};
const rings=JSON.parse(await fs.readFile('docs/development/job-change-review/evidence/warlock-rings.json')).rings;
for(const {index} of rings){await game.evaluate(index=>{const t=window.__fourthTest,p=new t.packet.CZ.REQ_TAKEOFF_EQUIP();p.index=index;t.network.sendPacket(p);},index);await game.waitForTimeout(500);}
await jobNpc.contact(60,231);const success=await jobNpc.run(['我带来了材料']);assert(success.pages.some(p=>p.text?.includes('所有材料都准备好了')));await record('Materials accepted',success);
proof.remaining=await game.evaluate(()=>[2796,2797,6151,6152].map(id=>({id,present:!!window.__fourthTest.inventory.getItemById(id)})));assert(proof.remaining.every(i=>!i.present));await fs.writeFile(file,JSON.stringify(proof,null,2));return proof.remaining;
