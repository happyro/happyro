import assert from 'node:assert/strict';
import test from 'node:test';
import {
	applyNavigationOverrides,
	assignUniqueInstanceIds,
	buildUniqueSpriteIds,
	parseNpcDefinition
} from './generate-npc-catalog.mjs';

test('parses script metadata and localized instance identity', () => {
	const entry = parseNpcDefinition(
		'prontera,100,101,3\tscript\tGuide Keeper#01\t419,{ end; }',
		'npc/test.txt',
		7,
		{ 'Guide Keeper': '向导' }
	);

	assert.deepEqual(entry, {
		id: 'prontera:100:101:Guide Keeper#01',
		map: 'prontera',
		x: 100,
		y: 101,
		direction: 3,
		type: 'script',
		name: 'Guide Keeper#01',
		source_name: 'Guide Keeper',
		display_name: '向导',
		sprite_id: 419,
		sprite_key: '419',
		enabled: true,
		dynamic: false,
		source: { path: 'npc/test.txt', line: 7 }
	});
});

test('parses duplicate NPCs and preserves symbolic sprite keys', () => {
	const spriteIds = buildUniqueSpriteIds({ 687: '4_TOWER_01', 700: 'DUPLICATE', 701: 'duplicate' });
	const entry = parseNpcDefinition(
		'1@bamn,96,318,5\tscript(DISABLED)\tEst#est01\t4_F_ESTLOVELOY,{',
		'npc/re/instances/test.txt',
		51,
		{},
		spriteIds
	);

	assert.equal(entry.type, 'script');
	assert.equal(entry.enabled, false);
	assert.equal(entry.dynamic, false);
	assert.equal(entry.sprite_id, null);
	assert.equal(entry.sprite_key, '4_F_ESTLOVELOY');
	assert.equal(spriteIds.get('4_TOWER_01'), 687);
	assert.equal(spriteIds.has('DUPLICATE'), false);
});

test('rejects hidden and non-interactive definitions', () => {
	assert.equal(parseNpcDefinition('prontera,1,2,3\tscript\tHidden\t-1,{', 'npc/test.txt', 1), null);
	assert.equal(parseNpcDefinition('prontera,1,2,3\twarp\tWarp\t1,1,other,1,1', 'npc/test.txt', 2), null);
});

test('disambiguates identical definitions with stable source occurrences', () => {
	const entries = [
		{ id: 'map:1:2:Name', source: { path: 'npc/a.txt', line: 10 } },
		{ id: 'map:1:2:Name', source: { path: 'npc/a.txt', line: 40 } },
		{ id: 'map:1:2:Name', source: { path: 'npc/b.txt', line: 20 } }
	];

	assignUniqueInstanceIds(entries);

	assert.deepEqual(
		entries.map(entry => entry.id),
		[
			'map:1:2:Name@npc/a.txt:1',
			'map:1:2:Name@npc/a.txt:2',
			'map:1:2:Name@npc/b.txt:1'
		]
	);
});

test('applies reviewed nearby navigation overrides', () => {
	const entries = [{ id: 'map:10:10:Guide', map: 'map', x: 10, y: 10, sprite_id: 100, navigation: null }];
	const navigation = { npcs: [['map', 42, 101, 100, 'Guide', 'guide', 11, 10]] };

	applyNavigationOverrides(entries, navigation, {
		schema: 'happyro-npc-navigation-overrides/v2',
		entries: [{ npc_id: 'map:10:10:Guide', navigation_id: 42 }]
	});

	assert.deepEqual(entries[0].navigation, {
		id: 42,
		category: 101,
		class: 100,
		name: 'Guide',
		map: 'map',
		x: 11,
		y: 10
	});
});

test('rejects unsafe nearby navigation overrides', () => {
	const entries = [{ id: 'map:10:10:Guide', map: 'map', x: 10, y: 10, sprite_id: 100, navigation: null }];
	const navigation = { npcs: [['map', 42, 101, 101, 'Other', 'other', 11, 10]] };

	assert.throws(
		() =>
			applyNavigationOverrides(entries, navigation, {
				schema: 'happyro-npc-navigation-overrides/v2',
				entries: [{ npc_id: 'map:10:10:Guide', navigation_id: 42 }]
			}),
		/Unsafe NPC navigation override/
	);
});

test('applies a reviewed server NPC class without an official navigation row', () => {
	const entries = [
		{
			id: 'int_land:78:103:Captain Carocc#intro_npc03',
			map: 'int_land',
			x: 78,
			y: 103,
			source_name: 'Captain Carocc',
			sprite_id: 873,
			navigation: null
		}
	];

	applyNavigationOverrides(entries, { npcs: [] }, {
		schema: 'happyro-npc-navigation-overrides/v2',
		entries: [{ npc_id: entries[0].id, npc_class: 873 }]
	});

	assert.deepEqual(entries[0].navigation, {
		id: null,
		category: null,
		class: 873,
		name: 'Captain Carocc',
		map: 'int_land',
		x: 78,
		y: 103
	});
});
