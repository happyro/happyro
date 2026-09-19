#!/usr/bin/env node
// Read-only source/runtime audit; only the report under artifacts/ is written.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import JobNames from '../../repos/happyro-client/src/DB/Jobs/JobNameTable.js';
import Skills from '../../repos/happyro-client/src/DB/Skills/SkillInfo.generated.js';
import Trees from '../../repos/happyro-client/src/DB/Skills/SkillTreeView.generated.js';
import { fourthJobEffectResources } from '../../repos/happyro-client/src/DB/Skills/FourthJobEffects.js';
import { fourthJobGroundResources } from '../../repos/happyro-client/src/DB/Skills/FourthJobGroundEffects.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
if (!args.includes('audit')) {
	const paint = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
	console.log(`\n${paint('1;36', 'HappyRO fourth-job audit')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', 'node tools/resources/audit-fourth-jobs.mjs audit')} [--no-color]\n\n${paint('1;33', 'Examples')}\n  ${paint('36', 'node tools/resources/audit-fourth-jobs.mjs audit --no-color')}\n`);
	process.exit(0);
}
if (args.some(arg => !['audit', '--no-color'].includes(arg))) throw new Error('Unknown argument');
const require = createRequire(path.join(root, 'repos/happyro-client/package.json'));
const yaml = require('js-yaml');
const load = async name => yaml.load(await fs.readFile(path.join(root, 'repos/happyro-server/db/re', name), 'utf8')).Body;
const [trees, db, exp] = await Promise.all(['skill_tree.yml', 'skill_db.yml', 'job_exp.yml'].map(load));
const skills = new Map(db.map(skill => [skill.Name, skill]));
const targets = [
	[4252, 'Dragon_Knight'], [4253, 'Meister'], [4254, 'Shadow_Cross'], [4255, 'Arch_Mage'],
	[4256, 'Cardinal'], [4257, 'Windhawk'], [4258, 'Imperial_Guard'], [4259, 'Biolo'],
	[4260, 'Abyss_Chaser'], [4261, 'Elemental_Master'], [4262, 'Inquisitor'], [4263, 'Troubadour'], [4264, 'Trouvere'],
	[4302, 'Sky_Emperor'], [4303, 'Soul_Ascetic'], [4304, 'Shinkiro'], [4305, 'Shiranui'],
	[4306, 'Night_Watch'], [4307, 'Hyper_Novice'], [4308, 'Spirit_Handler']
];
const report = { createdAt: new Date().toISOString(), gateway: 'http://127.0.0.1:3338',
	scope: 'Basic body signatures/hashes, own skill-tree metadata/icons, configured STR structure and texture retrieval. Not combat/rendering acceptance.', jobs: [] };
for (const [id, name] of targets) {
	const resource = JobNames[id];
	const response = await fetch(`${report.gateway}/search`, {method: 'POST', body: new URLSearchParams({filter: resource})});
	if (!response.ok) throw new Error(`Search failed: ${id} ${response.status}`);
	const files = (await response.text()).split('\n').map(p => p.replaceAll('\\', '/'));
	const bodies = files.filter(p => p.includes('/몸통/') && new RegExp(`/${resource}_(남|여)\\.(spr|act)$`).test(p));
	const hashes = [];
	for (const file of bodies) {
		const response = await fetch(`${report.gateway}/${file}`);
		if (!response.ok) throw new Error(`Read failed: ${file}`);
		const bytes = Buffer.from(await response.arrayBuffer());
		const expected = file.endsWith('.spr') ? 'SP' : 'AC';
		if (bytes.toString('ascii', 0, 2) !== expected) throw new Error(`Invalid signature: ${file}`);
		hashes.push({file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex')});
	}
	const tree = trees.find(t => t.Job === name);
	const checks = (tree?.Tree || []).map(entry => {
		const skill = skills.get(entry.Name);
		const client = Skills[skill?.Id];
		return {name: entry.Name, id: skill?.Id, maxLevel: entry.MaxLevel, target: skill?.TargetType,
			clientName: client?.SkillName, infoPresent: Boolean(client),
			maxLevelMatches: client?.MaxLv === entry.MaxLevel,
			layoutPresent: Trees[id]?.[skill?.Id] !== undefined,
			combat: 'not-tested', effects: 'not-tested'};
	});
	report.jobs.push({id, name, bodies: hashes,
		maxBase: exp.find(e => e.Jobs?.[name] && e.MaxBaseLevel)?.MaxBaseLevel,
		maxJob: exp.find(e => e.Jobs?.[name] && e.MaxJobLevel)?.MaxJobLevel,
		skills: checks, missingInfo: checks.filter(s => !s.infoPresent).map(s => s.name),
		missingLayout: checks.filter(s => !s.layoutPresent).map(s => s.name),
		levelMismatch: checks.filter(s => !s.maxLevelMatches).map(s => s.name)});
}
const out = path.join(root, 'artifacts/fourth-jobs/source-audit.json');
report.skillIcons = [];
for (const name of new Set(report.jobs.flatMap(job => job.skills.map(skill => skill.name)))) {
	const file = `data/texture/유저인터페이스/item/${name}.bmp`;
	const response = await fetch(`${report.gateway}/${file}`);
	const bytes = response.ok ? Buffer.from(await response.arrayBuffer()) : null;
	report.skillIcons.push({name, file, present: Boolean(bytes && bytes.toString('ascii', 0, 2) === 'BM'),
		sha256: bytes ? crypto.createHash('sha256').update(bytes).digest('hex') : null});
}
// Check the actual STR dependency graph, not merely a matching filename.
report.effectResources = [];
const checkedTextures = new Map();
const effectEntries = Object.entries(fourthJobEffectResources).flatMap(([skill, stages]) =>
	Object.entries(stages).flatMap(([stage, resources]) => [resources].flat()
		.map(resource => ({skill, stage, resource, source: 'client-explicit'}))));
effectEntries.push(...Object.entries(fourthJobGroundResources).flatMap(([unit, layers]) =>
	layers.map(([resource], index) => ({skill: null, stage: `${unit}:${index}`, resource, source: 'client-ground'}))));
const bsonResponse = await fetch(`${report.gateway}/data/contentdata/effectdata/ez2streffect.bson`);
if (!bsonResponse.ok) throw new Error('Missing canonical effect BSON');
const bson = require('bson').deserialize(Buffer.from(await bsonResponse.arrayBuffer())).EZ2STREffect;
for (const [name, entry] of Object.entries(bson)) {
	const resource = entry.FilePath.replaceAll('\\', '/').replace(/\.str$/i, '').toLowerCase();
	if (effectEntries.some(effect => effect.source === 'client-explicit' && effect.resource.toLowerCase() === resource)) throw new Error(`Duplicate explicit/canonical effect: ${resource}`);
	effectEntries.push({skill: null, stage: name, resource, source: 'canonical-bson'});
}
for (const {skill, stage, resource, source} of effectEntries) {
		const file = `data/texture/effect/${resource}.str`;
		const response = await fetch(`${report.gateway}/${file}`);
		if (!response.ok) {
			report.effectResources.push({skill, stage, source, file, present: false, status: response.status});
			continue;
		}
		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.toString('ascii', 0, 4) !== 'STRM' || bytes.readUInt32LE(4) !== 0x94) throw new Error(`Invalid STR: ${file}`);
		let offset = 36;
		const textures = [];
		for (let layer = 0; layer < bytes.readUInt32LE(16); layer++) {
			const count = bytes.readUInt32LE(offset); offset += 4;
			for (let index = 0; index < count; index++) {
				const name = bytes.subarray(offset, offset + 128).toString('latin1').split('\0')[0]; offset += 128;
				const texture = `${path.posix.dirname(file)}/${name}`.replaceAll('\\', '/');
				if (!checkedTextures.has(texture)) {
					const result = await fetch(`${report.gateway}/${texture}`);
					if (!result.ok) {
						checkedTextures.set(texture, {file: texture, present: false, status: result.status});
						textures.push(texture);
						continue;
					}
					const data = Buffer.from(await result.arrayBuffer());
					if (!data.length) throw new Error(`Empty STR texture: ${texture}`);
					checkedTextures.set(texture, {file: texture, present: true, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex')});
				}
				textures.push(texture);
			}
			const frames = bytes.readUInt32LE(offset); offset += 4 + frames * 124;
			if (offset > bytes.length) throw new Error(`Truncated STR animation: ${file}`);
		}
		if (offset !== bytes.length) throw new Error(`Unexpected STR trailing data: ${file}`);
		report.effectResources.push({skill, stage, source, file, present: true, textures, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), rendering: 'not-tested'});
}
report.effectTextures = [...checkedTextures.values()];
report.complete = report.jobs.every(job => job.bodies.length === ([4263, 4264, 4304, 4305].includes(job.id) ? 2 : 4)
	&& !job.missingInfo.length && !job.missingLayout.length && !job.levelMismatch.length)
	&& report.skillIcons.every(icon => icon.present)
	&& report.effectResources.every(effect => effect.present)
	&& report.effectTextures.every(texture => texture.present);
await fs.mkdir(path.dirname(out), {recursive: true});
await fs.writeFile(out, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.jobs.map(({id, name, bodies, skills, missingInfo, missingLayout, levelMismatch}) =>
	({id, name, bodies: bodies.length, skills: skills.length, missingInfo, missingLayout, levelMismatch})), null, 2));
console.log(path.relative(root, out));
console.log(JSON.stringify({effects: report.effectResources.length, textures: report.effectTextures.length,
	missingEffects: report.effectResources.filter(effect => !effect.present).map(effect => effect.file),
	missingTextures: report.effectTextures.filter(texture => !texture.present).map(texture => texture.file),
	missingIcons: report.skillIcons.filter(icon => !icon.present).map(icon => icon.name)}));
if (!report.complete) process.exitCode = 1;
