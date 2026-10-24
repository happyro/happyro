import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import MapInfo from '../../repos/happyro-client/src/DB/Map/MapTable.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourceDirectory = path.join(projectRoot, 'localization/client/data');
const runtimeArchive = path.join(projectRoot, 'inputs/runtime/kro-20211105/client/data.grf');
let archive;
let archiveDescriptor;
async function navigationSource(file) {
	if (!archive) {
		const { GrfNode } = createRequire(path.join(projectRoot, 'repos/happyro-gateway/package.json'))('@chicowall/grf-loader');
		archiveDescriptor = fs.openSync(runtimeArchive, 'r');
		archive = new GrfNode(archiveDescriptor, { filenameEncoding: 'cp949' });
		await archive.load();
	}
	const result = await archive.getFile(`data/luafiles514/lua files/${file}`);
	if (!result.data) throw new Error(`Missing navigation source: ${file}`);
	return Buffer.from(result.data);
}
const outputDirectory = path.join(projectRoot, 'repos/happyro-client/applications/pwa/data/navigation');
const expectedSources = {
	'navigation-catalog-source.json': [
		'navigation/navi_map_krpri.lub',
		'navigation/navi_mob_krpri.lub',
		'navigation/navi_npc_krpri.lub'
	],
	'navigation-graph-source.json': [
		'navigation/navi_link_krpri.lub',
		'navigation/navi_linkdistance_krpri.lub',
		'navigation/navi_npcdistance_krpri.lub'
	]
};
const expectedCounts = {
	'navigation-catalog-source.json': { maps: 572, monsters: 2370, npcs: 5355 },
	'navigation-graph-source.json': {
		links: 3708,
		linkDistances: 1626,
		npcDistances: 1122
	}
};

function usage(color = true) {
	const paint = (code, value) => (color ? `\u001b[${code}m${value}\u001b[0m` : value);
	console.log(`
${paint('1;36', 'HappyRO navigation data generator')}

${paint('1;33', 'Usage')}
  ${paint('1;32', 'node generate-navigation-data.mjs --write')} [--no-color]
  ${paint('1;32', 'node generate-navigation-data.mjs --check')} [--no-color]

${paint('1;33', 'Examples')}
  ${paint('36', 'node generate-navigation-data.mjs --write')}
  ${paint('36', 'node generate-navigation-data.mjs --check --no-color')}
`);
}

function parseArguments(argv) {
	const options = { action: null, color: true };
	for (const argument of argv) {
		if (argument === '--write' || argument === '--check') {
			if (options.action) throw new Error('Choose exactly one of --write or --check');
			options.action = argument.slice(2);
		} else if (argument === '--no-color') options.color = false;
		else throw new Error(`Unknown argument: ${argument}`);
	}
	return options;
}

async function loadSnapshot(name, expectedKeys) {
	const snapshot = JSON.parse(fs.readFileSync(path.join(sourceDirectory, name), 'utf8'));
	if (snapshot.schemaVersion !== 1 || !snapshot.data) throw new Error(`Unsupported snapshot: ${name}`);
	const sourceNames = Object.keys(snapshot.sources || {}).sort();
	if (JSON.stringify(sourceNames) !== JSON.stringify([...expectedSources[name]].sort())) {
		throw new Error(`${name} source metadata is incomplete`);
	}
	for (const key of expectedKeys) {
		if (!Array.isArray(snapshot.data[key])) throw new Error(`${name} is missing ${key}`);
		if (snapshot.data[key].length !== expectedCounts[name][key]) {
			throw new Error(`${name} has an unexpected ${key} record count`);
		}
	}
	for (const [file, expected] of Object.entries(snapshot.sources)) {
		const content = await navigationSource(file);
		const sha256 = crypto.createHash('sha256').update(content).digest('hex');
		if (content.length !== expected.bytes || sha256 !== expected.sha256) {
			throw new Error(`Navigation source changed: ${file}; extract a reviewed snapshot first`);
		}
	}
	return snapshot;
}

function validateRows(name, rows, minimumLength) {
	for (const [index, row] of rows.entries()) {
		if (!Array.isArray(row) || row.length < minimumLength) {
			throw new Error(`${name}[${index}] is not a valid navigation row`);
		}
	}
}

const options = parseArguments(process.argv.slice(2));
if (!options.action) {
	usage(options.color);
	process.exit(0);
}

const catalog = await loadSnapshot('navigation-catalog-source.json', ['maps', 'monsters', 'npcs']);
const graph = await loadSnapshot('navigation-graph-source.json', ['links', 'linkDistances', 'npcDistances']);
if (archiveDescriptor !== undefined) fs.closeSync(archiveDescriptor);
validateRows('maps', catalog.data.maps, 5);
validateRows('monsters', catalog.data.monsters, 8);
validateRows('npcs', catalog.data.npcs, 8);
validateRows('links', graph.data.links, 11);

const localizedMaps = catalog.data.maps.map(([map, name, ...fields]) => [
	map, MapInfo[`${map}.rsw`]?.displayName || name, ...fields
]);
const outputs = {
	'catalog.json': `${JSON.stringify({ schemaVersion: 1, ...catalog.data, maps: localizedMaps })}\n`,
	'graph.json': `${JSON.stringify({ schemaVersion: 1, ...graph.data })}\n`
};

if (options.action === 'write') {
	fs.mkdirSync(outputDirectory, { recursive: true });
	for (const [name, content] of Object.entries(outputs)) {
		const output = path.join(outputDirectory, name);
		fs.writeFileSync(output, content, { encoding: 'utf8', mode: 0o644 });
		fs.chmodSync(output, 0o644);
	}
	console.log(`Generated navigation catalog and graph in ${outputDirectory}`);
} else {
	for (const [name, content] of Object.entries(outputs)) {
		const output = path.join(outputDirectory, name);
		if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== content) {
			throw new Error(`Generated navigation data is stale: ${output}`);
		}
	}
	console.log('Navigation data is current.');
}
