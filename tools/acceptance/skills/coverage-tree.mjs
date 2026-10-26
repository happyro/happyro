import { requireAuditCommand } from './cli.mjs';
requireAuditCommand(import.meta.url);
import fs from 'node:fs';
import { createRequire } from 'node:module';
const yaml=createRequire(process.cwd()+'/tools/package.json')('js-yaml');
const trees=yaml.load(fs.readFileSync('repos/happyro-server/db/re/skill_tree.yml','utf8')).Body;
const db=yaml.load(fs.readFileSync('repos/happyro-server/db/re/skill_db.yml','utf8')).Body;
const lines={1:['Archer','Hunter','Sniper','Ranger','Windhawk'],2:['Mage','Wizard','High_Wizard','Warlock','Arch_Mage'],3:['Acolyte','Priest','High_Priest','Arch_Bishop','Cardinal'],4:['Swordman','Crusader','Paladin','Royal_Guard','Imperial_Guard'],5:['Thief','Assassin','Assassin_Cross','Guillotine_Cross','Shadow_Cross'],6:['Merchant','Blacksmith','Whitesmith','Mechanic','Meister'],7:['Mage','Sage','Professor','Sorcerer','Elemental_Master'],9:['Acolyte','Monk','Champion','Sura','Inquisitor'],12:['Swordman','Knight','Lord_Knight','Rune_Knight','Dragon_Knight']};
const observations=['results.json','partner-results.json'].flatMap(f=>JSON.parse(fs.readFileSync('artifacts/skill-live/'+f,'utf8')));
// Evidence references are observations, not acceptance verdicts.
const evidence=new Map();
for(const file of fs.readdirSync('artifacts/skill-live').filter(f=>f.endsWith('.json')&&!/coverage|summary|remaining/.test(f))){
 let value;try{value=JSON.parse(fs.readFileSync('artifacts/skill-live/'+file,'utf8'));}catch{continue;}
 const ids=new Set();
 const visit=node=>{if(!node||typeof node!=='object')return;if(Array.isArray(node)){for(const item of node)visit(item);return;}if(Array.isArray(node.packets))for(const p of node.packets)if(Number.isInteger(p?.SKID))ids.add(p.SKID);for(const [key,child]of Object.entries(node))if(key!=='packets')visit(child);};visit(value);
 for(const id of ids){if(!evidence.has(id))evidence.set(id,[]);evidence.get(id).push(file);}
}
const out={};for(const[line,jobs]of Object.entries(lines)){const names=new Set();for(const job of jobs){const t=trees.find(t=>t.Job===job);if(!t)throw Error(job);for(const s of t.Tree||[])if(s.MaxLevel>0)names.add(s.Name);}out[line]=[...names].map(name=>{const d=db.find(d=>d.Name===name);const samples=observations.filter(r=>r.name===name);return {name,id:d?.Id,description:d?.Description,target:d?.TargetType||'Passive',observations:samples.length,evidenceFiles:evidence.get(d?.Id)||[],completionPackets:samples.filter(r=>r.observed.packets.some(p=>p.SKID===d?.Id&&p.result===1)).length};});}
fs.writeFileSync('artifacts/skill-live/skill-tree-coverage.json',JSON.stringify(out,null,2));console.log(JSON.stringify(Object.fromEntries(Object.entries(out).map(([n,list])=>[n,{total:list.length,unobservedActive:list.filter(s=>s.target!=='Passive'&&!s.observations&&!s.evidenceFiles.length)}])),null,2));
