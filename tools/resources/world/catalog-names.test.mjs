import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import mapNames from '../../../repos/happyro-client/src/DB/Map/MapTable.js';
import monsterNames from '../../../repos/happyro-client/src/DB/Monsters/MonsterNameTable.js';

const root = path.resolve(import.meta.dirname, '../../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const api = 'repos/happyro-api/resources/game-data/';
const web = 'repos/happyro-client/applications/pwa/data/';

test('map catalogs use the same current names as the in-game map display', () => {
 const server = read(api + 'world/map-catalog.json');
 assert.deepEqual(read(web + 'navigation/map-catalog.json'), server);
 const translations = read(api + 'world/map-names.zh-CN.json');
 for (const entry of server.entries) {
  const canonical = mapNames[entry.map + '.rsw']?.displayName;
  if (canonical) {
   assert.equal(entry.name, canonical, entry.map);
   assert.equal(translations[entry.map], canonical, entry.map);
  }
 }
 assert.equal(translations['new_1-1'], '初心者修炼场');
});

test('monster and drop catalogs agree with runtime names and item catalogs', () => {
 const monsters = read(api + 'monsters/renewal.json').monsters;
 const items = read(api + 'items/client-kro-20211105.json').items;
 const serverItems = read(api + 'items/renewal.json').items;
 for (const [id, monster] of Object.entries(monsters)) {
  if (monsterNames[id]) assert.equal(monster.names['zh-CN'], monsterNames[id], id);
 }
 for (const monster of read(web + 'monsters/catalog.json').monsters) {
  assert.equal(monster.name, monsters[monster.id].names['zh-CN'], String(monster.id));
 }
 for (const groups of Object.values(read(web + 'monsters/drops.json').drops)) {
  for (const drops of Object.values(groups)) if (Array.isArray(drops)) {
   for (const drop of drops) {
    const item = items[drop.itemId] || serverItems[drop.itemId];
    assert.ok(item, `Unknown drop item ${drop.itemId}`);
    assert.equal(drop.name, item.names['zh-CN'], String(drop.itemId));
   }
  }
 }
});

test('NPC navigation instances agree with the shared catalog at each position', () => {
 const entries = read(api + 'world/npc-catalog.json').entries;
 const groups = new Map();
 for (const entry of entries) {
  if (!/[\u3400-\u9fff]/.test(entry.display_name)) continue;
  const key = `${entry.map}:${entry.x}:${entry.y}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
 }
 const actual = read(web + 'navigation/npc-instances.json').instances;
 assert.deepEqual(Object.keys(actual).sort(), [...groups.keys()].sort());
 for (const [key, candidates] of groups) {
  const visible = candidates.filter(entry => entry.game_visible);
  const illustrated = candidates.filter(entry => entry.display_sprite_id != null);
  const eligible = visible.length ? visible : illustrated.length ? illustrated : candidates;
  assert.ok(eligible.some(entry => actual[key].name === entry.display_name && actual[key].sourceName === entry.source_name), key);
 }
});
