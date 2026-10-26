import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import MapInfo from '../../../repos/happyro-client/src/DB/Map/MapTable.js';
import {getMapChannel} from '../../../repos/happyro-client/src/DB/Map/MapChannels.js';
const root=path.resolve(import.meta.dirname,'../../..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const data=JSON.parse(read('localization/maps/display-names.json'));
const maps=data.maps;
const aliases=JSON.parse(read('repos/happyro-api/resources/game-data/world/map-search-aliases.zh-CN.json'));

test('every declared town and town teleporter destination has an explicit city review',()=>{
 const towns=new Set(data.townMaps);
 for(const file of ['repos/happyro-server/npc/mapflag/town.txt','repos/happyro-server/npc/re/mapflag/town.txt']) {
  for(const [,map] of read(file).matchAll(/^(\S+)\s+mapflag\s+town\s*$/gm)) assert.ok(towns.has(map),map);
 }
 const script=read('repos/happyro-server/npc/custom/warper.txt');
 for(const [,body] of script.matchAll(/^T\d+:([\s\S]*?)(?=^T\d+:|\/\/ -)/gm)) {
  const map=body.match(/Go\("([^"]+)"/)?.[1];if(map)assert.ok(towns.has(map),map);
 }
 for(const map of towns) {
  const row=maps[map];assert.equal(row.category,'town',map);
  assert.ok(!/首都|之都|都市|天水之国|草精族|雨檀族/.test(row.displayName),map);
  const sign=MapInfo[map+'.rsw']?.signName;
  if(sign?.subTitle)assert.ok(!sign.subTitle.includes(row.displayName),map+' duplicate subtitle');
 }
});

test('city shortcuts, distinct landmarks, floors and modes survive name generation',()=>{
 for(const [map,name] of Object.entries({prontera:'普隆德拉',prt_fild08:'普隆德拉南门',prt_fild05:'普隆德拉西门',prt_fild06:'普隆德拉东门',geffen:'吉芬',payon:'斐扬',morocc:'梦罗克',yuno:'朱诺'}))assert.equal(MapInfo[map+'.rsw'].displayName,name);
 for(const map of ['prt_fild08','prt_fild08a','prt_fild08b','prt_fild08c','prt_fild08d']) {
  assert.equal(MapInfo[map+'.rsw'].displayName,'普隆德拉南门');assert.ok(aliases[map].includes('南门'));
 }
 for(let n=1;n<=12;n++)assert.ok(MapInfo[`tha_t${String(n).padStart(2,'0')}.rsw`].displayName.includes(`${n}层`));
 assert.notEqual(maps.dic_dun02.displayName,maps.dic_dun03.displayName);assert.match(maps.dic_dun03.displayName,/梦魇/);
 for(const id of ['gl_cas02_','gl_chyard_','1@advs'])assert.match(maps[id].displayName,/梦魇/);
 const fieldNames=new Map();
 for(const [id,row] of Object.entries(maps)) {
  if(row.category!=='numbered-field'&&row.category!=='landmark')continue;
  const canonical=getMapChannel(id)?.canonicalMapName||id;
  if(fieldNames.has(row.displayName))assert.equal(fieldNames.get(row.displayName),canonical,id);
  fieldNames.set(row.displayName,canonical);
 }
});

test('all reviewed names retain source provenance and search aliases without altering raw scans',()=>{
 const previous=JSON.parse(read('docs/localization/map-name-scans/project.json')).records;
 const sources=fs.readdirSync(path.join(root,'docs/localization/map-name-scans/merged/data')).filter(x=>x.endsWith('.json')).flatMap(file=>JSON.parse(read('docs/localization/map-name-scans/merged/data/'+file)));
 const sourceById=new Map(sources.map(x=>[x.map,x]));
 assert.equal(Object.keys(maps).length,1229);
 for(const [id,row] of Object.entries(maps)) {
  assert.ok(row.reason&&row.category,id);
  assert.equal(row.sourceName,sourceById.get(id)?.recommendedName ?? null,id);
  assert.equal(new Set(row.aliases).size,row.aliases.length,id);
  assert.ok(!row.aliases.includes(row.displayName),id);
  if(row.sourceName && row.sourceName!==row.displayName)assert.ok(aliases[id]?.includes(row.sourceName),id);
 }
 for(const row of previous.filter(row=>row.name==='初心者修炼场'))assert.equal(maps[row.map].displayName,'初心者修炼场');
});


test('name review covers the entire server catalog including untranslated resources', () => {
 const catalog=JSON.parse(read('repos/happyro-api/resources/game-data/world/map-catalog.json'));
 const review=JSON.parse(read('localization/maps/supplement-review.json'));
 const universe=new Set([...catalog.entries.map(row=>row.map),...Object.keys(maps)]);
 assert.equal(universe.size,review.scope.mapUniverse);
 assert.equal(Object.keys(review.maps).length,104);
 for(const row of catalog.entries) {
  assert.ok(maps[row.map]||review.maps[row.map],row.map);
  if(!maps[row.map])assert.ok(['unresolved','rejected-source'].includes(review.maps[row.map].status),row.map);
 }
 assert.equal(maps.alde_tt02.displayName,maps.turbo_n_1.displayName);
 assert.equal(maps.new_zone01.displayName,'初心者修炼场');
 assert.equal(maps.tur_d04ia.displayName,'凄凉旧良宫');
 assert.equal(review.maps.job3_sha01.status,'rejected-source');
 assert.ok(!maps.job3_sha01);
});


test('player visibility is explicit and independent of resource support', () => {
 const policy=JSON.parse(read('localization/maps/player-visibility.json'));
 const catalog=JSON.parse(read('repos/happyro-api/resources/game-data/world/map-catalog.json'));
 for(const row of catalog.entries) assert.equal(row.player_hidden,Object.hasOwn(policy.hidden,row.map),row.map);
 for(const id of ['new_event','pprontera'])assert.equal(catalog.entries.find(row=>row.map===id).supported,true,id);
 assert.equal(maps.alde_gld.displayName,'艾尔帕兰 露依纳');
 assert.ok(aliases.alde_gld.includes('艾尔帕兰卫星都市 露依纳'));
});
