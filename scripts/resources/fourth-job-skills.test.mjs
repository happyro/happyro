import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyFourthJobSkills} from './fourth-job-skills.mjs';

test('adds server-only skills without replacing occupied layout cells and resolves prerequisites', () => {
	const runtime = {skills: {5: {resourceName: 'SM_BASH'}}, trees: {4252: {list: 4, beforeJob: 4060, 5201: 1}}};
	applyFourthJobSkills(runtime, [
		{Id: 5, Name: 'SM_BASH', MaxLevel: 10},
		{Id: 5201, Name: 'DK_SERVANTWEAPON', MaxLevel: 5, Requires: {SpCost: 10}},
		{Id: 6004, Name: 'DK_DRAGONIC_PIERCE', MaxLevel: 2, Range: -1,
			Requires: {SpCost: [{Level: 1, Amount: 30}, {Level: 2, Amount: 40}]}}
	], [{Job: 'Dragon_Knight', Tree: [{Name: 'DK_SERVANTWEAPON'},
		{Name: 'DK_DRAGONIC_PIERCE', Requires: [{Name: 'SM_BASH', Level: 5}]}]}], {DRAGON_KNIGHT: 4252});
	assert.deepEqual(runtime.skills[6004].spAmount, [30, 40]);
	assert.deepEqual(runtime.skills[6004].attackRange, [-1, -1]);
	assert.deepEqual(runtime.skills[6004].jobNeedSkills, {4252: [[5, 5]]});
	assert.equal(runtime.trees[4252][6004], 2);
	assert.equal(runtime.trees[4252][5201], 1);
	assert.deepEqual(runtime.skills[5], {resourceName: 'SM_BASH'});
});

test('fails explicitly on unknown prerequisite data', () => {
	assert.throws(() => applyFourthJobSkills({skills: {}, trees: {4252: {}}},
		[{Id: 5201, Name: 'DK_SERVANTWEAPON', MaxLevel: 5}],
		[{Job: 'Dragon_Knight', Tree: [{Name: 'DK_SERVANTWEAPON', Requires: [{Name: 'MISSING', Level: 1}]}]}],
		{DRAGON_KNIGHT: 4252}), /Unknown prerequisite/);
});
