import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import maps from '../../../repos/happyro-client/src/DB/Map/MapTable.js';
import world from '../../../repos/happyro-client/src/DB/Map/WorldMap.js';

const root = path.resolve(import.meta.dirname, '../../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const auditDir = 'docs/localization/map-name-scans/merged/data';
const decisions = fs.readdirSync(path.join(root, auditDir)).filter(f => f.endsWith('.json')).flatMap(f => read(`${auditDir}/${f}`));
const serverMaps = new Set(fs.readFileSync(path.join(root, 'repos/happyro-server/db/map_index.txt'), 'utf8').split(/\r?\n/).filter(line => line && !line.startsWith('//')).map(line => line.trim().split(/\s+/)[0]));
const selected = Object.fromEntries(decisions.filter(row => row.recommendedName && (row.project || (row.externalNameConfirmed && serverMaps.has(row.map)))).map(row => [row.map, row.recommendedName]));

test('audited map decisions reach client, native resources and shared API names', () => {
 const native = read('localization/sources/kro-20211105/merged/files/lub/mapInfo_true.json');
 const api = read('repos/happyro-api/resources/game-data/world/map-names.zh-CN.json');
 assert.equal(Object.keys(selected).length, 1205);
 for (const [id, name] of Object.entries(selected)) {
  assert.equal(maps[id + '.rsw']?.displayName, name, `client ${id}`);
  assert.equal(native[id + '.rsw']?.displayName, name, `native ${id}`);
  assert.equal(api[id], name, `API ${id}`);
 }
});

test('world map, navigation and NPC location labels agree by exact map identity', () => {
 for (const region of world) for (const entry of region.maps || []) {
  if (selected[entry.id]) assert.equal(entry.name, selected[entry.id], `world ${entry.id}`);
 }
 const nav = read('repos/happyro-client/applications/pwa/data/navigation/catalog.json');
 for (const [id, name] of nav.maps) if (selected[id]) assert.equal(name, selected[id], `navigation ${id}`);
 const npcs = read('repos/happyro-api/resources/game-data/world/npc-catalog.json');
 for (const npc of npcs.entries) if (selected[npc.map]) assert.equal(npc.map_name_zh_cn, selected[npc.map], `NPC ${npc.id}`);
});

test('admin character and monster-spawn map translations follow the canonical map table', () => {
 const admin = 'repos/happyro-admin/src/';
 const spawn = read(admin + 'locales/zh-CN/monster-spawn-maps.json');
 for (const [key, name] of Object.entries(spawn)) {
  const id = key.replace('gameData.monster.spawnMap.', '');
  if (maps[id + '.rsw']) assert.equal(name, maps[id + '.rsw'].displayName, `admin spawn ${id}`);
 }
 const mapping = fs.readFileSync(path.join(root, admin, 'data/game/maps.ts'), 'utf8');
 const locale = fs.readFileSync(path.join(root, admin, 'locales/zh-CN.ts'), 'utf8');
 const labels = Object.fromEntries([...locale.matchAll(/'(players\.map\.[^']+)': '([^']*)'/g)].map(m => [m[1], m[2]]));
 for (const [, id, key] of mapping.matchAll(/\s+(\w+): '(players\.map\.[^']+)'/g)) {
  if (maps[id + '.rsw']) assert.equal(labels[key], maps[id + '.rsw'].displayName, `admin player ${id}`);
 }
});

test('legacy town teleporter labels match their actual destination map IDs', () => {
 const script = fs.readFileSync(path.join(root, 'repos/happyro-server/npc/custom/warper.txt'), 'utf8');
 const targets = {};
 for (const [, label, body] of script.matchAll(/^T(\d+):([\s\S]*?)(?=^T\d+:|\/\/ -)/gm)) {
  const destination = body.match(/\bGo\("([^"\n]+)"/);
  if (destination) targets[label] = destination[1];
 }
 const start = script.indexOf('menu\t', script.indexOf('\tTowns:'));
 const menu = script.slice(start, script.indexOf(';', start));
 let checked = 0;
 for (const [, name, label] of menu.matchAll(/"([^"]*)",T(\d+)/g)) {
  const expected = maps[targets[label] + '.rsw']?.displayName;
  if (expected) { assert.equal(name, expected, `T${label} -> ${targets[label]}`); checked++; }
 }
 assert.equal(checked, 44);
});

test('explicit teleporter choices use map names without losing destination distinctions', () => {
 const script = fs.readFileSync(path.join(root, 'repos/happyro-server/npc/custom/warper.txt'), 'utf8');
 let checked = 0;
 for (const [, text, rawArgs] of script.matchAll(/Disp\("([^"\n]*)"\);\s*Pick\(([^;\n]*)\);/g)) {
  const labels = text.split(':');
  const args = [...rawArgs.matchAll(/"([^"\n]*)"|(-?\d+)/g)].map(m => m[1] !== undefined ? m[1] : Number(m[2]));
  const ids = args[0] === '' ? args.slice(1) : labels.map((_, i) => args[0] + String(i + 1 - (args[1] || 0)).padStart(2, '0'));
  if (new Set(ids).size !== ids.length) continue; // Castle entrances on one map name different castles.
  assert.equal(labels.length, ids.length);
  assert.equal(new Set(labels).size, labels.length, 'Distinct destinations need distinct choices');
  for (let i = 0; i < ids.length; i++) {
   const expected = maps[ids[i] + '.rsw']?.displayName.replaceAll(':', '：');
   if (!expected) continue;
   assert.ok(labels[i] === expected || labels[i].startsWith(expected + '（'), ids[i]);
   checked++;
  }
 }
 assert.ok(checked > 100);
});

test('Renewal castle database names match the corresponding map identities', () => {
 const source = fs.readFileSync(path.join(root, 'repos/happyro-server/db/re/castle_db.yml'), 'utf8');
 let checked = 0;
 for (const [, id, raw] of source.matchAll(/    Map: (\S+)\n    Name: ([^\n]+)/g)) {
  const expected = maps[id + '.rsw']?.displayName;
  if (!expected) continue;
  const actual = raw.startsWith('"') ? JSON.parse(raw) : raw;
  assert.equal(actual, expected, id);
  assert.ok(Buffer.byteLength(actual, 'utf8') < 24, `Castle name must fit NAME_LENGTH: ${id}`);
  checked++;
 }
 assert.equal(checked, 44);
});

test('castle entrance menus distinguish actual castles on the same outdoor map', () => {
 const entries = read('docs/localization/map-name-scans/castle-entrances.json');
 const script = fs.readFileSync(path.join(root, 'repos/happyro-server/npc/custom/warper.txt'), 'utf8');
 const groups = Object.fromEntries([...script.matchAll(/^(C[1-8]):([\s\S]*?)(?=^C\d+:|\/\/ -)/gm)].map(m => [m[1], m[2]]));
 for (const entry of entries) {
  const labels = groups[entry.group].match(/Disp\("([^"]+)"\)/)[1].split(':');
  assert.equal(labels[entry.index], maps[entry.castleMap + '.rsw'].displayName, `${entry.group}/${entry.index}`);
  assert.equal(new Set(labels).size, labels.length);
 }
 assert.equal(entries.length, 40);
});
