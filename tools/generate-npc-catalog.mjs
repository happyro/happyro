#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverRoot = path.join(workspaceRoot, 'repos/happyro-server');
const clientRoot = path.join(workspaceRoot, 'repos/happyro-client');
const adminRoot = path.join(workspaceRoot, 'repos/happyro-admin/backend');
const entrypoints = ['npc/re/scripts_main.conf', 'conf/script_athena.conf'];

const paths = {
	translations: path.join(clientRoot, 'src/DB/NpcNameTranslations.zh-CN.json'),
	mapNames: path.join(adminRoot, 'resources/game-data/world/map-names.zh-CN.json'),
	navigation: path.join(clientRoot, 'applications/pwa/data/navigation/catalog.json'),
	navigationOverrides: path.join(workspaceRoot, 'configs/npc-navigation-overrides.json'),
	images: path.join(adminRoot, 'resources/game-data/world/npcs'),
	canonical: path.join(workspaceRoot, 'artifacts/game-data/world/npc-catalog.json'),
	client: path.join(clientRoot, 'src/DB/Navigation/NpcCatalog.json'),
	admin: path.join(adminRoot, 'resources/game-data/world/npc-catalog.json')
};

function sha256(contents) {
	return crypto.createHash('sha256').update(contents).digest('hex');
}

function normalizeName(name) {
	return String(name || '')
		.replace(/#.*$/, '')
		.replace(/::.*/, '')
		.trim();
}

export function parseNpcDefinition(line, sourcePath, lineNumber, translations = {}) {
	const columns = line.trim().split(/\t+/);
	if (columns.length < 4 || line.trim().startsWith('//')) return null;
	const location = columns[0].match(/^([a-z0-9_@-]+),(-?\d+),(-?\d+),(\d+)$/i);
	const typeMatch = columns[1].match(/^(script|shop|cashshop|itemshop|pointshop|duplicate)(?:\(([^)]*)\))?$/i);
	if (!location || !typeMatch) return null;

	const rawName = columns[2].trim();
	const sourceName = normalizeName(rawName);
	const spriteKey = columns[3].split(',', 1)[0].trim();
	if (!sourceName || sourceName.startsWith('#') || spriteKey === '-1') return null;

	const numericSpriteId = /^\d+$/.test(spriteKey) ? Number(spriteKey) : null;
	const type = typeMatch[1].toLocaleLowerCase();
	const map = location[1].toLocaleLowerCase();
	const x = Number(location[2]);
	const y = Number(location[3]);
	const direction = Number(location[4]);

	return {
		id: `${map}:${x}:${y}:${rawName}`,
		map,
		x,
		y,
		direction,
		type,
		name: rawName,
		source_name: sourceName,
		display_name: translations[sourceName] || sourceName,
		sprite_id: numericSpriteId,
		sprite_key: spriteKey,
		enabled: true,
		dynamic: type === 'script' && String(typeMatch[2] || '').toLocaleUpperCase() === 'DISABLED',
		source: { path: sourcePath, line: lineNumber }
	};
}

async function collectEnabledNpcFiles() {
	const visitedConfigs = new Set();
	const npcFiles = new Set();
	const configContents = new Map();

	async function visit(relativePath) {
		const normalized = relativePath.replaceAll('\\', '/');
		if (visitedConfigs.has(normalized)) return;
		visitedConfigs.add(normalized);
		const absolutePath = path.join(serverRoot, normalized);
		const contents = await fs.readFile(absolutePath, 'utf8');
		configContents.set(normalized, contents);
		for (const sourceLine of contents.split(/\r?\n/)) {
			const line = sourceLine.replace(/\/\/.*$/, '').trim();
			const directive = line.match(/^(import|npc):\s*(\S+)$/i);
			if (!directive) continue;
			const target = directive[2].replaceAll('\\', '/');
			if (directive[1].toLocaleLowerCase() === 'import') await visit(target);
			else npcFiles.add(target);
		}
	}

	for (const entrypoint of entrypoints) await visit(entrypoint);
	return { configContents, npcFiles: [...npcFiles].sort() };
}

function navigationByPosition(catalog) {
	const positions = new Map();
	for (const row of catalog.npcs || []) {
		if (!Array.isArray(row) || row.length < 8) continue;
		const key = `${String(row[0]).toLocaleLowerCase()}:${Number(row[6])}:${Number(row[7])}`;
		if (!positions.has(key)) positions.set(key, []);
		positions.get(key).push({ id: Number(row[1]), category: Number(row[2]), class: Number(row[3]), name: row[4] });
	}
	return positions;
}

function navigationById(catalog) {
	return new Map(
		(catalog.npcs || [])
			.filter(row => Array.isArray(row) && row.length >= 8)
			.map(row => [
				Number(row[1]),
				{
					id: Number(row[1]),
					category: Number(row[2]),
					class: Number(row[3]),
					name: row[4],
					map: String(row[0]).toLocaleLowerCase(),
					x: Number(row[6]),
					y: Number(row[7])
				}
			])
	);
}

function matchNavigation(entry, candidates) {
	if (!candidates?.length) return null;
	const exactClass = candidates.find(candidate => candidate.class === entry.sprite_id);
	const candidate = exactClass || (candidates.length === 1 ? candidates[0] : null);
	return candidate && candidate.class !== 99999 ? candidate : null;
}

export function applyNavigationOverrides(entries, navigationCatalog, overrides) {
	if (overrides.schema !== 'happyro-npc-navigation-overrides/v1' || !Array.isArray(overrides.entries)) {
		throw new Error('NPC navigation overrides have an unsupported schema');
	}
	const entriesById = new Map(entries.map(entry => [entry.id, entry]));
	const navigation = navigationById(navigationCatalog);
	const claimedNavigationIds = new Set(entries.map(entry => entry.navigation?.id).filter(Number.isFinite));
	for (const override of overrides.entries) {
		const entry = entriesById.get(override.npc_id);
		const candidate = navigation.get(override.navigation_id);
		if (!entry || entry.navigation || !candidate || claimedNavigationIds.has(candidate.id)) {
			throw new Error(`Invalid or conflicting NPC navigation override: ${override.npc_id}`);
		}
		const distance = Math.hypot(entry.x - candidate.x, entry.y - candidate.y);
		if (entry.map !== candidate.map || entry.sprite_id !== candidate.class || candidate.class === 99999 || distance > 2) {
			throw new Error(`Unsafe NPC navigation override: ${override.npc_id}`);
		}
		entry.navigation = candidate;
		claimedNavigationIds.add(candidate.id);
	}
}

export function assignUniqueInstanceIds(entries) {
	const groups = new Map();
	for (const entry of entries) {
		if (!groups.has(entry.id)) groups.set(entry.id, []);
		groups.get(entry.id).push(entry);
	}
	for (const duplicates of groups.values()) {
		if (duplicates.length < 2) continue;
		const occurrences = new Map();
		for (const entry of duplicates) {
			const occurrence = (occurrences.get(entry.source.path) || 0) + 1;
			occurrences.set(entry.source.path, occurrence);
			entry.id = `${entry.id}@${entry.source.path}:${occurrence}`;
		}
	}
	const ids = new Set(entries.map(entry => entry.id));
	if (ids.size !== entries.length) throw new Error('NPC catalog contains duplicate instance IDs');
}

function compactEntry(entry) {
	return {
		id: entry.id,
		map: entry.map,
		x: entry.x,
		y: entry.y,
		type: entry.type,
		name: entry.display_name,
		source_name: entry.source_name,
		sprite_id: entry.sprite_id,
		display_sprite_id: entry.display_sprite_id,
		navigation_id: entry.navigation?.id ?? null,
		navigation_class: entry.navigation?.class ?? null,
		game_visible: entry.game_visible,
		catalog_order: entry.catalog_order
	};
}

async function buildCatalog() {
	const [translationContents, mapNameContents, navigationContents, overrideContents, enabled] = await Promise.all([
		fs.readFile(paths.translations, 'utf8'),
		fs.readFile(paths.mapNames, 'utf8'),
		fs.readFile(paths.navigation, 'utf8'),
		fs.readFile(paths.navigationOverrides, 'utf8'),
		collectEnabledNpcFiles()
	]);
	const translations = JSON.parse(translationContents);
	const mapNames = JSON.parse(mapNameContents);
	const navigationCatalog = JSON.parse(navigationContents);
	const navigationOverrides = JSON.parse(overrideContents);
	const navigation = navigationByPosition(navigationCatalog);
	const imageNames = new Set((await fs.readdir(paths.images)).filter(name => /^\d+\.png$/.test(name)));
	const definitionHash = crypto.createHash('sha256');
	const entries = [];

	for (const relativePath of enabled.npcFiles) {
		const contents = await fs.readFile(path.join(serverRoot, relativePath), 'utf8');
		definitionHash.update(relativePath).update('\0').update(contents);
		contents.split(/\r?\n/).forEach((line, index) => {
			const entry = parseNpcDefinition(line, relativePath, index + 1, translations);
			if (!entry) return;
			const position = `${entry.map}:${entry.x}:${entry.y}`;
			entry.navigation = matchNavigation(entry, navigation.get(position));
			if (entry.sprite_id === null && entry.navigation) entry.sprite_id = entry.navigation.class;
			entry.map_name_zh_cn = mapNames[entry.map] || null;
			entry.image_available = entry.sprite_id !== null && imageNames.has(`${entry.sprite_id}.png`);
			entries.push(entry);
		});
	}

	applyNavigationOverrides(entries, navigationCatalog, navigationOverrides);
	for (const entry of entries) {
		const navigationImageAvailable =
			entry.navigation !== null && imageNames.has(`${entry.navigation.class}.png`);
		entry.display_sprite_id = entry.image_available
			? entry.sprite_id
			: navigationImageAvailable
				? entry.navigation.class
				: null;
		entry.capabilities = {
			can_route: true,
			can_teleport_to_npc: entry.navigation !== null
		};
	}
	assignUniqueInstanceIds(entries);
	entries.sort((left, right) =>
		left.map.localeCompare(right.map) || left.x - right.x || left.y - right.y || left.id.localeCompare(right.id)
	);
	entries.forEach((entry, catalogOrder) => {
		entry.game_visible = entry.capabilities.can_teleport_to_npc && entry.display_sprite_id !== null;
		entry.catalog_order = catalogOrder;
	});
	const configHash = crypto.createHash('sha256');
	for (const [relativePath, contents] of [...enabled.configContents].sort(([left], [right]) => left.localeCompare(right))) {
		configHash.update(relativePath).update('\0').update(contents);
	}
	const sources = {
		packetver: 20211103,
		mode: 'renewal',
		entrypoints,
		config_sha256: configHash.digest('hex'),
		npc_definitions_sha256: definitionHash.digest('hex'),
		translations_sha256: sha256(translationContents),
		navigation_sha256: sha256(navigationContents),
		navigation_overrides_sha256: sha256(overrideContents)
	};
	const contentHash = sha256(JSON.stringify({ sources, entries }));
	return {
		schema: 'happyro-npc-catalog/v1',
		version: `kro-20211105-${contentHash.slice(0, 12)}`,
		content_sha256: contentHash,
		sources,
		stats: {
			entries: entries.length,
			enabled_files: enabled.npcFiles.length,
			localized: entries.filter(entry => entry.display_name !== entry.source_name).length,
			with_navigation: entries.filter(entry => entry.navigation).length,
			with_image: entries.filter(entry => entry.image_available).length,
			with_display_image: entries.filter(entry => entry.display_sprite_id !== null).length,
			game_visible: entries.filter(entry => entry.game_visible).length
		},
		entries
	};
}

async function writeJson(target, value) {
	await fs.mkdir(path.dirname(target), { recursive: true });
	await fs.writeFile(target, `${JSON.stringify(value)}\n`);
}

async function generate() {
	const catalog = await buildCatalog();
	const compact = {
		schema: catalog.schema,
		version: catalog.version,
		content_sha256: catalog.content_sha256,
		entries: catalog.entries.map(compactEntry)
	};
	await Promise.all([writeJson(paths.canonical, catalog), writeJson(paths.admin, catalog), writeJson(paths.client, compact)]);
	process.stdout.write(
		`Generated ${catalog.stats.entries} enabled NPC instances (${catalog.stats.with_navigation} navigable, ${catalog.stats.with_image} with images) as ${catalog.version}.\n`
	);
}

async function check() {
	const catalog = await buildCatalog();
	const [admin, client] = await Promise.all([fs.readFile(paths.admin, 'utf8'), fs.readFile(paths.client, 'utf8')]);
	const adminCatalog = JSON.parse(admin);
	const clientCatalog = JSON.parse(client);
	if (adminCatalog.content_sha256 !== catalog.content_sha256 || clientCatalog.content_sha256 !== catalog.content_sha256) {
		throw new Error('Generated NPC catalog copies are stale; run generate.');
	}
	process.stdout.write(`NPC catalog ${catalog.version} is current in both consumers.\n`);
}

function help(noColor) {
	const color = code => (noColor ? '' : `\u001b[${code}m`);
	const reset = color('0');
	process.stdout.write(`\n${color('1;36')}HappyRO NPC catalog${reset}\n\n${color('1;33')}Usage${reset}\n  ${color('1;32')}node tools/generate-npc-catalog.mjs generate${reset} [--no-color]\n  ${color('1;32')}node tools/generate-npc-catalog.mjs check${reset} [--no-color]\n\n${color('1;33')}Examples${reset}\n  ${color('36')}node tools/generate-npc-catalog.mjs generate${reset}\n  ${color('36')}node tools/generate-npc-catalog.mjs check --no-color${reset}\n\n`);
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
	const args = process.argv.slice(2);
	const noColor = args.includes('--no-color');
	const command = args.find(argument => !argument.startsWith('--'));
	if (!command || command === 'help' || args.includes('--help')) help(noColor);
	else if (command === 'generate') await generate();
	else if (command === 'check') await check();
	else {
		help(noColor);
		process.exitCode = 1;
	}
}
