// Resolve the current official resource table using MapLoader's single lookup.
export function resolveMapResources(physicalMaps, resourceTable) {
 const aliases = new Map();
 const normalize = value => value.trim().replaceAll('\\', '/').toLowerCase();
 for (const line of resourceTable.split(/\r?\n/)) {
  const [key, value] = line.replace(/\/\/.*$/, '').split('#');
  if (!value) continue;
  const from = normalize(key), to = normalize(value);
  if (/^[a-z0-9_@-]+\.(rsw|gnd|gat)$/.test(from) && /^[a-z0-9_@-]+\.(rsw|gnd|gat)$/.test(to))
   aliases.set('data/' + from, 'data/' + to);
 }
 const worlds = new Map(physicalMaps.map(map => [map.world, map]));
 const names = new Set([...worlds.keys(), ...[...aliases.keys()].filter(name => name.endsWith('.rsw'))]);
 const maps = [];
 for (const name of [...names].sort()) {
  const world = aliases.get(name) || name;
  const physical = worlds.get(world);
  if (!physical) continue;
  maps.push({
   name: name.slice(5, -4), world,
   ground: aliases.get(physical.ground) || physical.ground,
   altitude: aliases.get(physical.altitude) || physical.altitude
  });
 }
 return maps;
}
