#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { updateTeleporterLabels } from './teleporter_labels.mjs';
import { parse } from 'acorn';

const root = path.resolve(import.meta.dirname, '../../..');
const args = process.argv.slice(2);
const color = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
if (!args.length || args.includes('--help') || args.every(arg => arg === '--no-color')) {
 console.log(`\n${color('1;36', 'HappyRO map display names')}\n\n${color('1;33', 'Usage')}\n  ${color('1;32', 'generate')} | ${color('1;32', 'check')} [--no-color]\n\n${color('1;33', 'Examples')}\n  ${color('36', 'node tools/localization/maps/apply_display_names.mjs generate --no-color')}\n  ${color('36', 'node tools/localization/maps/apply_display_names.mjs check --no-color')}\n`);
 process.exit(0);
}
if (!['generate', 'check'].includes(args[0]) || args.slice(1).some(arg => arg !== '--no-color')) throw Error('Expected generate or check [--no-color]');
const check = args[0] === 'check';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const decisions = JSON.parse(read('localization/maps/display-names.json'));
const maps = decisions.maps;
const changed = [];
function write(file, content) {
 const before = fs.existsSync(path.join(root, file)) ? read(file) : null;
 if (before === content) return;
 changed.push(file);
 if (!check) fs.writeFileSync(path.join(root, file), content);
}
const json = (file, data) => write(file, JSON.stringify(data, null, 2) + '\n');
const key = p => p.key?.name ?? p.key?.value;
const prop = (n, k) => n.properties?.find(p => key(p) === k);
function walk(node, fn) {
 if (!node || typeof node !== 'object') return;
 fn(node);
 for (const [k, v] of Object.entries(node)) if (!['start', 'end'].includes(k)) {
  if (Array.isArray(v)) v.forEach(n => walk(n, fn));
  else if (v && typeof v === 'object') walk(v, fn);
 }
}
function edit(file, visit) {
 const source = read(file), edits = [];
 const put = (node, value) => {
  if (node && node.value !== value) edits.push([node.start, node.end, JSON.stringify(value)]);
 };
 visit(parse(source, { ecmaVersion: 'latest', sourceType: 'module' }), put, edits, source);
 let output = source;
 for (const [a, b, value] of edits.sort((a, b) => b[0] - a[0])) output = output.slice(0, a) + value + output.slice(b);
 write(file, output);
}
edit('repos/happyro-client/src/DB/Map/MapTable.js', (ast, put, edits, source) => {
 const object = ast.body.find(n => n.type === 'VariableDeclaration' && n.declarations[0].id.name === 'MapInfo').declarations[0].init;
 const seen = new Set();
 for (const p of object.properties) {
  const id = key(p).replace(/\.rsw$/, ''), row = maps[id];
  if (!row) continue;
  seen.add(id);
  put(prop(p.value, 'displayName')?.value, row.displayName);
  const sign = prop(p.value, 'signName');
  if (sign) {
   put(prop(sign.value, 'mainTitle')?.value, row.displayName);
   if (row.category === 'town') put(prop(sign.value, 'subTitle')?.value, row.subtitle);
  }
 }
 const extras = Object.keys(maps).filter(id => !seen.has(id));
 if (extras.length) {
  const nl = source.includes('\r\n') ? '\r\n' : '\n';
  edits.push([object.end - 1, object.end - 1, ',' + nl + extras.map(id => '\t' + JSON.stringify(id + '.rsw') + ': { displayName: ' + JSON.stringify(maps[id].displayName) + ' }').join(',' + nl) + nl]);
 }
});
edit('repos/happyro-client/src/DB/Map/WorldMap.js', (ast, put) => walk(ast, n => {
 if (n.type !== 'ObjectExpression') return;
 const id = prop(n, 'id')?.value?.value;
 if (maps[id]) put(prop(n, 'name')?.value, maps[id].displayName);
}));
const nativeFile = 'localization/sources/kro-20211105/merged/files/lub/mapInfo_true.json';
const native = JSON.parse(read(nativeFile));
for (const [id, row] of Object.entries(maps)) {
 const target = native[id + '.rsw'] ||= {};
 target.displayName = row.displayName;
 if (target.signName?.mainTitle !== undefined) target.signName.mainTitle = row.displayName;
 if (target.signName?.subTitle !== undefined && row.category === 'town') target.signName.subTitle = row.subtitle;
}
json(nativeFile, native);
json('repos/happyro-api/resources/game-data/world/map-search-aliases.zh-CN.json', Object.fromEntries(Object.entries(maps).filter(([, row]) => row.aliases.length).map(([id, row]) => [id, row.aliases])));
// Admin preserves its independent map keys; only localized values are generated.
const spawnFile = 'repos/happyro-admin/src/locales/zh-CN/monster-spawn-maps.json';
const spawns = JSON.parse(read(spawnFile));
for (const key of Object.keys(spawns)) {
 const id = key.replace('gameData.monster.spawnMap.', '');
 if (maps[id]) spawns[key] = maps[id].displayName;
}
json(spawnFile, spawns);
const mapping = read('repos/happyro-admin/src/data/game/maps.ts');
const labels = Object.fromEntries([...mapping.matchAll(/\s+(\w+): '(players\.map\.[^']+)'/g)].map(m => [m[2], maps[m[1]]?.displayName]).filter(([, name]) => name));
const localeFile = 'repos/happyro-admin/src/locales/zh-CN.ts';
write(localeFile, read(localeFile).replace(/'(players\.map\.[^']+)': '([^']*)'/g, (all, key) => labels[key] ? `'${key}': '${labels[key]}'` : all));
const teleporter = 'repos/happyro-server/npc/custom/warper.txt';
write(teleporter, updateTeleporterLabels(read(teleporter), maps));
if (check && changed.length) throw Error(`Map display outputs require generation:\n${changed.join('\n')}`);
console.log(`${check ? 'Checked' : 'Generated'} ${Object.keys(maps).length} map decisions; ${changed.length} changed files`);
