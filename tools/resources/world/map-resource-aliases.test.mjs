import assert from 'node:assert/strict';
import test from 'node:test';
import {resolveMapResources} from './map-resource-aliases.mjs';

const zone = {name:'new_zone01',world:'data/new_zone01.rsw',ground:'data/new_zone01.gnd',altitude:'data/new_zone01.gat'};
test('includes logical maps whose official RSW names share one physical scene', () => {
 const maps = resolveMapResources([zone], '// ignored.rsw#missing.rsw#\nnew_1-1.rsw#new_zone01.rsw#\r\nnew_2-1.rsw#new_zone01.rsw#');
 assert.deepEqual(maps.map(map=>map.name), ['new_1-1','new_2-1','new_zone01']);
 assert.deepEqual(maps[0], {...zone,name:'new_1-1'});
});
test('resolves terrain names from the selected world header', () => {
 const map = {name:'scene',world:'data/scene.rsw',ground:'data/logical.gnd',altitude:'data/logical.gat'};
 assert.deepEqual(resolveMapResources([map], 'logical.gnd#actual.gnd#\nlogical.gat#actual.gat#')[0],
  {...map,ground:'data/actual.gnd',altitude:'data/actual.gat'});
});
test('does not advertise missing scenes or recursively follow mappings the client cannot load', () => {
 const maps = resolveMapResources([zone], 'missing.rsw#absent.rsw#\na.rsw#b.rsw#\nb.rsw#new_zone01.rsw#');
 assert.deepEqual(maps.map(map=>map.name), ['b','new_zone01']);
});
test('official mapping takes precedence over a same-name physical scene', () => {
 const other = {name:'other',world:'data/other.rsw',ground:'data/other.gnd',altitude:'data/other.gat'};
 assert.deepEqual(resolveMapResources([zone,other], 'new_zone01.rsw#other.rsw#')[0], {...other,name:'new_zone01'});
});
