import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourceDirectory = path.join(projectRoot, 'localization/client/data');
const lubDirectory = path.join(projectRoot, 'repos/happyro-gateway/data/luafiles514/lua files');
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

function loadSnapshot(name, expectedKeys) {
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
		const content = fs.readFileSync(path.join(lubDirectory, file));
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

const catalog = loadSnapshot('navigation-catalog-source.json', ['maps', 'monsters', 'npcs']);
const graph = loadSnapshot('navigation-graph-source.json', ['links', 'linkDistances', 'npcDistances']);
validateRows('maps', catalog.data.maps, 5);
validateRows('monsters', catalog.data.monsters, 8);
validateRows('npcs', catalog.data.npcs, 8);
validateRows('links', graph.data.links, 11);

const outputs = {
	'catalog.json': `${JSON.stringify({ schemaVersion: 1, ...catalog.data })}\n`,
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
