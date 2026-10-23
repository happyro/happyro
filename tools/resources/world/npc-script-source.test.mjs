import assert from 'node:assert/strict';
import test from 'node:test';
import { topLevelSourceLines } from './npc-script-source.mjs';
import { parseNpcDefinition } from './generate-npc-catalog.mjs';

test('excludes block-commented NPCs while preserving the real source line', () => {
	const lines = topLevelSourceLines('/* old\nmap,1,2,3\tscript\tGhost\t100,{ end; }\n*/\nmap,1,2,3\tscript\tReal\t100,{ end; }');
	const entries = lines.map((line, i) => parseNpcDefinition(line, 'npc/test.txt', i + 1)).filter(Boolean);
	assert.deepEqual(entries.map(e => [e.source.line, e.source_name]), [[4, 'Real']]);
});

test('strings containing comment markers and braces do not hide following NPCs', () => {
	const lines = topLevelSourceLines('map,1,2,3\tscript\tFirst\t100,{\nmes "https://host/{/*}*/";\nmes "escaped \\" quote"; // }\n}\nmap,3,4,5\tscript\tSecond\t101,{ end; }');
	assert.equal(parseNpcDefinition(lines[4], 'npc/test.txt', 5).source_name, 'Second');
	assert.equal(lines[1], '');
});

test('does not interpret a declaration embedded in a multiline string as an NPC', () => {
	const lines = topLevelSourceLines('map,1,2,3\tscript\tFirst\t100,{\nmes "example:\nmap,1,2,3\tscript\tFake\t100,{}\n";\n}\nmap,3,4,5\tshop\tSecond\t101,501:10');
	assert.equal(lines.map((line,i) => parseNpcDefinition(line, 'npc/test.txt',i+1)).filter(Boolean).length,2);
});

test('ignores commented config imports without stripping string URLs', () => {
	const lines = topLevelSourceLines('/*\nimport: hidden.conf\n*/\nimport: live.conf // explanation');
	assert.deepEqual(lines.map(l=>l.trim()).filter(Boolean), ['import: live.conf']);
});
