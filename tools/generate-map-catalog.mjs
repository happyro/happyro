import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import sharp from '../repos/happyro-client/node_modules/sharp/lib/index.js';

const root = path.resolve(import.meta.dirname, '..');
const client = path.join(root, 'repos/happyro-client');
const admin = path.join(root, 'repos/happyro-admin/backend/resources/game-data/world');
const load = async file => (await import(pathToFileURL(path.join(client, file)))).default;
const command = process.argv[2];
if (command !== 'generate') {
 const color = (code, text) => process.argv.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
 console.log(`\n${color('1;36','HappyRO shared map catalog')}\n\n${color('1;33','Usage')}\n  node tools/generate-map-catalog.mjs ${color('1;32','generate')} [--no-color]\n\n${color('36','Example: node tools/generate-map-catalog.mjs generate')}\n`);
} else {
 const [supported, worlds, info, aliases] = await Promise.all([
  load('src/DB/Map/SupportedMapTable.js'), load('src/DB/Map/WorldMap.js'),
  load('src/DB/Map/MapTable.js'), load('src/DB/Map/MiniMapTable.js')
 ]);
 const {getMapChannel} = await import(pathToFileURL(path.join(client,'src/DB/Map/MapChannels.js')));
 const names = new Map();
 for (const world of worlds) for(const map of world.maps) if(!names.has(map.id)) names.set(map.id,map.name);
 for (const [file, data] of Object.entries(info)) if(!names.has(file.replace(/\.rsw$/i,''))) names.set(file.replace(/\.rsw$/i,''),data.displayName);
 const index = await fs.readFile(path.join(root,'repos/happyro-server/db/map_index.txt'),'utf8');
 const entries=[];let id=0;
 for(const line of index.split('\n')) {
  const m=line.trim().match(/^([a-z0-9_@-]+)(?:\s+(\d+))?\s*(?:\/\/.*)?$/i);if(!m)continue;
  id=m[2]===undefined?id+1:Number(m[2]);
  const map=m[1];const channel=getMapChannel(map);
  let imageMap=aliases[map]||map, imageKind=null;
  try {await fs.access(path.join(admin,'maps',imageMap+'.png'));imageKind='image';}catch{}
  if(!imageKind && supported.has(map)) {
   const gat=await fs.readFile(path.join(root,'work/grf-extract/kro-20211105/data/data',map+'.gat'));
   if(gat.toString('ascii',0,4)!=='GRAT')throw Error('Invalid GAT '+map);
   const w=gat.readUInt32LE(6),h=gat.readUInt32LE(10);if(gat.length<14+w*h*20)throw Error('Truncated GAT '+map);
   const pixels=Buffer.alloc(w*h*3);
   for(let y=0;y<h;y++)for(let x=0;x<w;x++) {
    const type=gat.readUInt32LE(14+(y*w+x)*20+16);
    const rgb=type===3?[65,125,153]:[0,2,4,6].includes(type)?[190,198,184]:type===5?[91,99,94]:[23,25,28];
    pixels.set(rgb,((h-y-1)*w+x)*3);
   }
   imageMap=map;imageKind='terrain';
   await fs.mkdir(path.join(admin,'terrain'),{recursive:true});
   await sharp(pixels,{raw:{width:w,height:h,channels:3}}).png().toFile(path.join(admin,'terrain',map+'.png'));
  }
  entries.push({id,map,name:names.get(map)||map,supported:supported.has(map),channel:channel?.channel||null,canonical_map:channel?.canonicalMapName||map,image_map:imageMap,image_kind:imageKind});
 }
 const content=JSON.stringify(entries);const catalog={schema:'happyro-map-catalog/v1',version:crypto.createHash('sha256').update(content).digest('hex').slice(0,16),sources:['happyro-server/db/map_index.txt','happyro-client/src/DB/Map/{SupportedMapTable,WorldMap,MapTable,MiniMapTable,MapChannels}.js'],entries};
 for(const dest of [path.join(admin,'map-catalog.json'),path.join(client,'src/DB/Navigation/MapCatalog.json')]) await fs.writeFile(dest,JSON.stringify(catalog)+'\n');
 console.log(`Generated ${entries.length} maps, ${entries.filter(e=>e.supported).length} supported, ${entries.filter(e=>e.image_kind==='terrain').length} terrain previews`);
}
