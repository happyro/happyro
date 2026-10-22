#!/usr/bin/env node
import fs from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { resolveMapResources } from './map-resource-aliases.mjs';

const root = path.resolve(import.meta.dirname, '../../..');
const args = process.argv.slice(2);
const paint = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
if (!args.length || args.includes('--help') || args.every(x => x === '--no-color')) {
 console.log(`\n${paint('1;36', 'HappyRO runtime map resource inventory')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', 'generate')} [--no-color]\n\n${paint('1;33', 'Example')}\n  ${paint('36', 'node tools/resources/world/generate-map-resources.mjs generate --no-color')}\n`);
 process.exit(0);
}
if (args[0] !== 'generate' || args.slice(1).some(x => x !== '--no-color')) throw new Error('Expected generate [--no-color]');
const require = createRequire(path.join(root, 'repos/happyro-gateway/package.json'));
const { GrfNode } = require('@chicowall/grf-loader');
const runtime = path.join(root, 'inputs/runtime/kro-20211105/client');
const fd = openSync(path.join(runtime, 'data.grf'), 'r');
try {
 const grf = new GrfNode(fd, { filenameEncoding: 'cp949' });
 await grf.load();
 const files = new Map();
 const normalize = name => name.replaceAll('\\', '/').toLowerCase();
 for (const name of grf.listFiles()) {
  const normalized = normalize(name);
  if (/^data\/[^/]+\.(rsw|gnd|gat)$/.test(normalized)) files.set(normalized, {path:normalized, source:'data.grf', entry:name});
 }
 for (const name of await fs.readdir(path.join(runtime, 'data'))) {
  if (/\.(rsw|gnd|gat)$/i.test(name)) files.set(normalize('data/'+name), {path:normalize('data/'+name), source:'loose', entry:'data/'+name});
 }
 const maps=[];
 for (const [name, file] of [...files].sort(([a],[b])=>a.localeCompare(b))) {
  if (!name.endsWith('.rsw')) continue;
  const result = file.source === 'loose' ? {data:await fs.readFile(path.join(runtime,file.entry))} : await grf.getFile(file.entry);
  if (!result.data) throw new Error(`Cannot read ${name}: ${result.error}`);
  const bytes=Buffer.from(result.data);
  if (bytes.toString('ascii',0,4)!=='GRSW') throw new Error(`Invalid RSW: ${name}`);
  const version=bytes[4]*10+bytes[5];
  const offset=6+(version>=25?4:0)+(version>=22?1:0)+40;
  const readName=offset=>normalize('data/'+bytes.toString('latin1',offset,offset+40).split('\0')[0]);
  maps.push({name:name.slice(5,-4),world:name,ground:readName(offset),altitude:readName(offset+40)});
 }
 let resourceTable;
 try { resourceTable = await fs.readFile(path.join(runtime, 'data/resnametable.txt')); }
 catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const result = await grf.getFile('data/resnametable.txt');
  if (!result.data) throw new Error('Missing official resnametable.txt');
  resourceTable = Buffer.from(result.data);
 }
 const resolvedMaps = resolveMapResources(maps, resourceTable.toString('latin1'));
 const manifest={schema:'happyro-runtime-map-resources/v1',resourceTableSHA256:createHash('sha256').update(resourceTable).digest('hex'),files:[...files.values()].map(({path})=>({path})).sort((a,b)=>a.path.localeCompare(b.path)),maps:resolvedMaps};
 const output=path.join(root,'work/resources/maps/manifest.json');
 await fs.mkdir(path.dirname(output),{recursive:true});
 await fs.writeFile(output,JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({files:files.size,physicalMaps:maps.length,maps:resolvedMaps.length,output:path.relative(root,output)}));
} finally { closeSync(fd); }
