import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import playwright from '../../../../../node_modules/playwright-core/index.js';

const toolDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(toolDirectory, '../../../../..');
const sourceDirectory = path.join(projectRoot, 'repos/happyro-gateway/data/luafiles514/lua files');
const defaultOutputDirectory = path.join(projectRoot, 'localization/client/data');
const defaultUrl = 'http://127.0.0.1:3000/applications/tools/index.html';
const skillFiles = [
	'skillinfoz/skillid.lub',
	'skillinfoz/skillinfolist.lub',
	'skillinfoz/jobinheritlist.lub',
	'skillinfoz/skilltreeview.lub'
];
const skillClientSources = [
	'repos/happyro-client/src/DB/Jobs/JobConst.js',
	'repos/happyro-client/src/DB/Skills/SkillInfo.js',
	'repos/happyro-client/src/DB/Skills/SkillTreeView.js'
];
const navigationVariables = {
	'navigation/navi_map_krpri.lub': 'Navi_Map',
	'navigation/navi_mob_krpri.lub': 'Navi_Mob',
	'navigation/navi_npc_krpri.lub': 'Navi_Npc',
	'navigation/navi_link_krpri.lub': 'Navi_Link',
	'navigation/navi_linkdistance_krpri.lub': 'Navi_Distance',
	'navigation/navi_npcdistance_krpri.lub': 'Navi_NpcDistance'
};

function usage(color = true) {
	const paint = (code, value) => (color ? `\u001b[${code}m${value}\u001b[0m` : value);
	console.log(`
${paint('1;36', 'HappyRO runtime LUB extractor')}

${paint('1;33', 'Usage')}
  ${paint('1;32', 'node runtime-data.mjs --write')} [--output <directory>] [--url <vite-url>] [--no-color]

${paint('1;33', 'Examples')}
  ${paint('36', 'node runtime-data.mjs --write')}
  ${paint('36', 'node runtime-data.mjs --write --output work/runtime-data-extract')}
`);
}

function parseArguments(argv) {
	const options = {
		write: false,
		color: true,
		output: defaultOutputDirectory,
		url: defaultUrl
	};
	for (let index = 0; index < argv.length; index++) {
		const argument = argv[index];
		if (argument === '--write') options.write = true;
		else if (argument === '--no-color') options.color = false;
		else if (argument === '--output') {
			const value = argv[++index];
			if (!value || value.startsWith('--')) throw new Error('--output requires a directory');
			options.output = path.resolve(projectRoot, value);
		} else if (argument === '--url') {
			const value = argv[++index];
			if (!value || value.startsWith('--')) throw new Error('--url requires a URL');
			options.url = value;
		} else throw new Error(`Unknown argument: ${argument}`);
	}
	return options;
}

async function readMetadata(files, baseDirectory) {
	const sources = {};
	for (const file of files) {
		const content = await fs.readFile(path.join(baseDirectory, file));
		sources[file] = {
			bytes: content.length,
			sha256: crypto.createHash('sha256').update(content).digest('hex')
		};
	}
	return sources;
}

async function readSources(files) {
	const sources = {};
	const bytes = {};
	for (const file of files) {
		const content = await fs.readFile(path.join(sourceDirectory, file));
		bytes[file] = [...content];
		sources[file] = {
			bytes: content.length,
			sha256: crypto.createHash('sha256').update(content).digest('hex')
		};
	}
	return { bytes, sources };
}

async function extractSkills(page, files) {
	return page.evaluate(async input => {
		const [{ default: CLua }, { default: JobId }, { default: baseInfo }, { default: baseTree }] = await Promise.all(
			[
				import('/src/Vendors/wasmoon-lua5.1.js'),
				import('/src/DB/Jobs/JobConst.js'),
				import('/src/DB/Skills/SkillInfo.js'),
				import('/src/DB/Skills/SkillTreeView.js')
			]
		);
		const lua = await CLua.Lua.create({
			customWasmUri: '/src/Vendors/liblua5.1.wasm'
		});
		const plain = value => {
			if (value == null || typeof value !== 'object') return value;
			if (Array.isArray(value)) return value.map(plain);
			const keys = Object.keys(value);
			return Object.fromEntries(keys.map(key => [key, plain(value[key])]));
		};
		const skills = Object.fromEntries(
			Object.entries(baseInfo).map(([id, skill]) => [
				id,
				{
					resourceName: skill.Name,
					maxLevel: skill.MaxLv,
					spAmount: plain(skill.SpAmount || []),
					separateLevel: Boolean(skill.bSeperateLv),
					attackRange: plain(skill.AttackRange || []),
					skillScale: plain(skill.SkillScale || []),
					needSkills: plain(skill._NeedSkillList || []),
					jobNeedSkills: plain(skill.NeedSkillList || {})
				}
			])
		);
		const trees = structuredClone(baseTree);
		const jobIds = { ...JobId };
		for (const [key, value] of Object.entries(JobId)) jobIds[`JT_${key}`] = value;
		lua.ctx.JOBID = jobIds;
		for (const [file, content] of Object.entries(input)) {
			lua.mountFile(file.split('/').pop(), new Uint8Array(content));
		}
		await lua.doFile('skillid.lub');
		await lua.doString(`
			local skillIds = SKID or {}
			SKID = setmetatable({}, { __index = function(_, key) return skillIds[key] or 0 end })
			local jobs = JOBID or {}
			JOBID = setmetatable({}, { __index = function(_, key) return jobs[key] or 0 end })
		`);
		let extracted;
		lua.ctx.ExtractJson = value => {
			extracted = JSON.parse(new TextDecoder('euc-kr').decode(value));
		};
		await lua.doString(String.raw`
			function __happyro_quote(value)
				value = string.gsub(value, '\\', '\\\\')
				value = string.gsub(value, '"', '\\"')
				value = string.gsub(value, '[%z\1-\31]', function(character)
					return string.format('\\u%04x', string.byte(character))
				end)
				return '"' .. value .. '"'
			end
			function __happyro_json(value)
				local kind = type(value)
				if kind == 'string' then return __happyro_quote(value) end
				if kind == 'number' or kind == 'boolean' then return tostring(value) end
				if kind ~= 'table' then return 'null' end
				local count, maximum, array = 0, 0, true
				for key, _ in pairs(value) do
					count = count + 1
					if type(key) ~= 'number' or key < 1 or key ~= math.floor(key) then array = false
					else maximum = math.max(maximum, key) end
				end
				array = array and count == maximum
				local output = {}
				if array then
					for index = 1, maximum do table.insert(output, __happyro_json(value[index])) end
				else
					for key, item in pairs(value) do
						table.insert(output, __happyro_quote(tostring(key)) .. ':' .. __happyro_json(item))
					end
					table.sort(output)
				end
				return (array and '[' or '{') .. table.concat(output, ',') .. (array and ']' or '}')
			end
		`);
		const extractGlobal = async variable => {
			extracted = null;
			await lua.doString(`ExtractJson(__happyro_json(${variable}))`);
			return extracted;
		};
		await lua.doFile('skillinfolist.lub');
		const runtimeSkills = await extractGlobal('SKILL_INFO_LIST');
		for (const [id, skill] of Object.entries(runtimeSkills)) {
			skills[id] = {
				resourceName: skill['1'] || '',
				maxLevel: skill.MaxLv || 1,
				spAmount: skill.SpAmount || [],
				separateLevel: Boolean(skill.bSeperateLv),
				attackRange: skill.AttackRange || [],
				skillScale: skill.SkillScale || [],
				needSkills: skill._NeedSkillList || [],
				jobNeedSkills: skill.NeedSkillList || {}
			};
		}
		await lua.doFile('jobinheritlist.lub');
		await lua.doString(`
			JobSkillTab = {}
			function JobSkillTab.ChangeSkillTabName() return true end
		`);
		await lua.doFile('skilltreeview.lub');
		const jobInheritance = await extractGlobal('JOB_INHERIT_LIST');
		const runtimeTrees = await extractGlobal('SKILL_TREEVIEW_FOR_JOB');
		const skillList = jobId => {
			if (jobId === JobId.NOVICE) return 1;
			if (
				jobId < JobId.KNIGHT ||
				jobId === JobId.TAEKWON ||
				(jobId >= JobId.SUPERNOVICE && jobId <= JobId.NINJA) ||
				jobId === JobId.DO_SUMMONER ||
				jobId === JobId.DRUID
			)
				return 1;
			if (
				jobId < JobId.NOVICE_H ||
				jobId === JobId.STAR ||
				jobId === JobId.LINKER ||
				(jobId >= JobId.KAGEROU && jobId <= JobId.REBELLION) ||
				jobId === JobId.SUPERNOVICE2 ||
				jobId === JobId.SPIRIT_HANDLER ||
				jobId === JobId.KARNOS
			)
				return 2;
			if (
				(jobId >= JobId.NOVICE_H && jobId <= JobId.THIEF_H) ||
				(jobId >= JobId.NOVICE_B && jobId <= JobId.THIEF_B) ||
				jobId === JobId.DO_SUMMONER_B ||
				jobId === JobId.NINJA_B ||
				jobId === JobId.TAEKWON_B ||
				jobId === JobId.GUNSLINGER_B
			)
				return 1;
			if (
				jobId < JobId.RUNE_KNIGHT ||
				(jobId >= JobId.KNIGHT_B && jobId <= JobId.DANCER_B) ||
				(jobId >= JobId.KAGEROU_B && jobId <= JobId.REBELLION_B)
			)
				return 2;
			if (
				jobId < JobId.DRAGON_KNIGHT ||
				jobId === JobId.STAR_EMPEROR ||
				jobId === JobId.SOUL_REAPER ||
				(jobId >= JobId.RUNE_KNIGHT_B && jobId <= JobId.SHADOW_CHASER_B) ||
				jobId === JobId.EMPEROR_B ||
				jobId === JobId.REAPER_B ||
				jobId === JobId.ALITEA
			)
				return 3;
			return jobId <= JobId.TROUVERE || (jobId >= JobId.SKY_EMPEROR && jobId <= JobId.HYPER_NOVICE) ? 4 : 1;
		};
		for (const [jobId, skillData] of Object.entries(runtimeTrees)) {
			trees[jobId] = {
				list: skillList(Number(jobId)),
				beforeJob: jobInheritance[jobId] ?? null,
				...Object.fromEntries(
					Object.entries(skillData).map(([position, skillId]) => [skillId, Number(position)])
				)
			};
		}
		lua.global.close();
		return { skills, trees };
	}, files);
}

async function extractNavigationTable(page, file, variable, bytes) {
	return page.evaluate(
		async input => {
			const { default: CLua } = await import('/src/Vendors/wasmoon-lua5.1.js');
			const lua = await CLua.Lua.create({
				customWasmUri: '/src/Vendors/liblua5.1.wasm'
			});
			let result;
			lua.ctx.ExtractJson = value => {
				result = JSON.parse(new TextDecoder('euc-kr').decode(value));
			};
			lua.mountFile(input.name, new Uint8Array(input.bytes));
			await lua.doFile(input.name);
			await lua.doString(String.raw`
			local function quote(value)
				value = string.gsub(value, '\\', '\\\\')
				value = string.gsub(value, '"', '\\"')
				value = string.gsub(value, '[%z\1-\31]', function(character)
					return string.format('\\u%04x', string.byte(character))
				end)
				return '"' .. value .. '"'
			end
			local function json(value)
				local kind = type(value)
				if kind == 'string' then return quote(value) end
				if kind == 'number' or kind == 'boolean' then return tostring(value) end
				if kind ~= 'table' then return 'null' end
				local count, maximum, array = 0, 0, true
				for key, _ in pairs(value) do
					count = count + 1
					if type(key) ~= 'number' or key < 1 or key ~= math.floor(key) then array = false
					else maximum = math.max(maximum, key) end
				end
				array = array and count == maximum
				local output = {}
				if array then
					for index = 1, maximum do table.insert(output, json(value[index])) end
				else
					for key, item in pairs(value) do table.insert(output, quote(tostring(key)) .. ':' .. json(item)) end
					table.sort(output)
				end
				return (array and '[' or '{') .. table.concat(output, ',') .. (array and ']' or '}')
			end
			ExtractJson(json(${input.variable}))
		`);
			lua.global.close();
			return result;
		},
		{ name: path.basename(file), variable, bytes }
	);
}

async function writeJson(directory, name, sources, data) {
	const output = path.join(directory, name);
	await fs.writeFile(output, `${JSON.stringify({ schemaVersion: 1, sources, data })}\n`, {
		encoding: 'utf8',
		mode: 0o644
	});
	await fs.chmod(output, 0o644);
}

const options = parseArguments(process.argv.slice(2));
if (!options.write) {
	usage(options.color);
	process.exit(0);
}
if (!options.url || !options.output) throw new Error('Both --url and --output require values');

const allFiles = [...skillFiles, ...Object.keys(navigationVariables)];
const { bytes, sources } = await readSources(allFiles);
const skillSourceMetadata = {
	...Object.fromEntries(skillFiles.map(file => [file, sources[file]])),
	...(await readMetadata(skillClientSources, projectRoot))
};
const browser = await playwright.chromium.launch({
	headless: true,
	executablePath: '/usr/bin/chromium'
});
try {
	const page = await browser.newPage();
	await page.goto(options.url, { waitUntil: 'domcontentloaded' });
	const skillData = await extractSkills(page, Object.fromEntries(skillFiles.map(file => [file, bytes[file]])));
	const navigation = {};
	for (const [file, variable] of Object.entries(navigationVariables)) {
		navigation[variable] = await extractNavigationTable(page, file, variable, bytes[file]);
	}
	await fs.mkdir(options.output, { recursive: true });
	await writeJson(options.output, 'skill-runtime-source.json', skillSourceMetadata, skillData);
	await writeJson(
		options.output,
		'navigation-catalog-source.json',
		Object.fromEntries(
			Object.keys(navigationVariables)
				.slice(0, 3)
				.map(file => [file, sources[file]])
		),
		{
			maps: navigation.Navi_Map,
			monsters: navigation.Navi_Mob,
			npcs: navigation.Navi_Npc
		}
	);
	await writeJson(
		options.output,
		'navigation-graph-source.json',
		Object.fromEntries(
			Object.keys(navigationVariables)
				.slice(3)
				.map(file => [file, sources[file]])
		),
		{
			links: navigation.Navi_Link,
			linkDistances: navigation.Navi_Distance,
			npcDistances: navigation.Navi_NpcDistance
		}
	);
	console.log(`Extracted runtime data to ${options.output}`);
} finally {
	await browser.close();
}
