import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from '../../repos/happyro-client/node_modules/js-yaml/index.js';
import prettier from '../../repos/happyro-client/node_modules/prettier/index.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const skillDatabase = path.join(projectRoot, 'repos/happyro-server/db/re/skill_db.yml');
const outputDirectory = path.join(projectRoot, 'localization/client/data');
const clientStaticTable = path.join(
	projectRoot,
	'repos/happyro-client/src/DB/Skills/SkillLocalizationTable.generated.js'
);
const legacySkillDatabase = path.join(projectRoot, 'repos/happyro-server/db/pre-re/skill_db.yml');
const clientSkillInfo = path.join(projectRoot, 'repos/happyro-client/src/DB/Skills/SkillInfo.js');
const detailedDescriptionPath = path.join(
	projectRoot,
	'localization/client/data/skill-description-prose.zh-CN.json'
);
const runtimeOnlySkillPath = path.join(
	projectRoot,
	'localization/client/data/skill-info-runtime-only.zh-CN.json'
);

const targetLabels = { Attack: '敌方目标', Support: '友方目标', Self: '自身', Ground: '指定地面' };
const typeLabels = { Weapon: '物理', Magic: '魔法', Misc: '特殊', None: '辅助' };
const elementLabels = { Weapon: '武器属性', Neutral: '无属性', Fire: '火属性', Water: '水属性', Wind: '风属性', Earth: '地属性', Holy: '圣属性', Dark: '暗属性', Ghost: '念属性', Undead: '不死属性', Poison: '毒属性' };
const curatedDescriptions = {
	SM_BASH: '对单个敌人发动强力近战攻击。\n伤害：基础 100% + 每级 30% 武器物理伤害。\n命中：每级提高最终命中率 5%。\n等级 6 以上且习得“致命攻击”后，有概率使目标昏迷。',
	SM_MAGNUM: '以自身为中心引发火属性爆炸并击退周围敌人。\n内圈 3×3：基础 100% + 每级 20% 武器物理伤害。\n外圈 5×5：基础 100% + 每级 10% 武器物理伤害。\n命中：每级提高最终命中率 10%。施放后短时间内，普通攻击会追加火属性伤害。'
};
const additionalNames = {
	TF_POISON: '施毒', TF_DETOXIFY: '解毒', NPC_LEASH: '束缚', NPC_WIDELEASH: '广域束缚', NPC_WIDECRITICALWOUND: '广域致命伤口', NPC_ALL_STAT_DOWN: '全属性下降', NPC_GRADUAL_GRAVITY: '重力增强', NPC_DAMAGE_HEAL: '伤害转化治疗', NPC_IMMUNE_PROPERTY: '属性免疫', NPC_MOVE_COORDINATE: '位置转移', NPC_BLEEDING2: '出血', NPC_ICEBREATH2: '寒冰吐息', NPC_RAINOFMETEOR: '陨石雨', NPC_RELIEVE_ON: '解除状态开启', NPC_RELIEVE_OFF: '解除状态关闭',
	WL_HELLINFERNO: '地狱炼狱', WL_CHAINLIGHTNING_ATK: '连锁闪电攻击', WL_EARTHSTRAIN: '地裂术', WL_TETRAVORTEX_FIRE: '元素漩涡·火', WL_TETRAVORTEX_WATER: '元素漩涡·水', WL_TETRAVORTEX_WIND: '元素漩涡·风', RA_WUGMASTERY: '狼群精通', RA_WUGBITE: '狼咬', RA_RESEARCHTRAP: '陷阱研究', SR_GENTLETOUCH_ENERGYGAIN: '点穴·球', WA_SWING_DANCE: '摇摆舞', SO_VACUUM_EXTREME: '极限真空', SO_VARETYR_SPEAR: '雷霆之枪', ALL_RAY_OF_PROTECTION: '守护之光',
	SU_SV_ROOTTWIST_ATK: '银藤根缠绕攻击', SU_PICKYPECK_DOUBLE_ATK: '啄击连击', SU_CN_METEOR2: '猫薄荷陨石二段', SU_LUNATICCARROTBEAT2: '疯兔胡萝卜重击二段', AG_ALL_BLOOM_ATK2: '万紫千红二段', AG_CRYSTAL_IMPACT_ATK: '水晶冲击攻击', AG_ASTRAL_STRIKE_ATK: '星界冲击攻击', AG_CRIMSON_ARROW_ATK: '绯红箭攻击',
	MT_AXE_STOMP: '战斧践踏', MT_RUSH_QUAKE: '冲锋震击', MT_M_MACHINE: '制造装置', MT_A_MACHINE: '攻击装置', MT_D_MACHINE: '防御装置', MT_TWOAXEDEF: '双手斧防御', MT_ABR_M: 'ABR 精通', MT_SUMMON_ABR_BATTLE_WARIOR: '召唤 ABR 战斗勇士', MT_POWERFUL_SWING: '强力挥击', MT_ENERGY_CANNONADE: '能量炮击', TR_ROSEBLOSSOM_ATK: '玫瑰绽放攻击',
	NW_P_F_I: '枪械精通', NW_GRENADE_MASTERY: '榴弹精通', NW_INTENSIVE_AIM: '集中瞄准', NW_GRENADE_FRAGMENT: '榴弹碎片', NW_THE_VIGILANTE_AT_NIGHT: '暗夜守望者', NW_ONLY_ONE_BULLET: '致命一弹', NW_SPIRAL_SHOOTING: '螺旋射击', NW_MAGAZINE_FOR_ONE: '单人弹匣', NW_WILD_FIRE: '野火', NW_BASIC_GRENADE: '基础榴弹', NW_HASTY_FIRE_IN_THE_HOLE: '急袭榴弹', NW_GRENADES_DROPPING: '榴弹倾泻', NW_AUTO_FIRING_LAUNCHER: '自动发射器', NW_HIDDEN_CARD: '隐藏王牌', NW_MISSION_BOMBARD: '任务轰炸',
	SOA_TALISMAN_MASTERY: '符咒精通', SOA_SOUL_MASTERY: '灵魂精通', SOA_TALISMAN_OF_PROTECTION: '守护符', SOA_TALISMAN_OF_WARRIOR: '武士符', SOA_TALISMAN_OF_MAGICIAN: '魔法师符', SOA_SOUL_GATHERING: '灵魂聚集', SOA_TOTEM_OF_TUTELARY: '守护图腾', SKE_RISING_MOON: '月升', SKE_MIDNIGHT_KICK: '午夜踢', SKE_DAWN_BREAK: '破晓', SKE_TWINKLING_GALAXY: '闪耀银河', SKE_STAR_BURST: '星辰爆发', SKE_STAR_CANNON: '星辰炮', SKE_ALL_IN_THE_SKY: '天穹万象', SKE_ENCHANTING_SKY: '苍穹附魔',
	SS_TOKEDASU: '消融', SS_SHIMIRU: '渗透', SS_AKUMUKESU: '噩梦消除', SS_SHINKIROU: '蜃景', SS_KAGEGARI: '猎影', SS_KAGENOMAI: '影舞', SS_KAGEGISSEN: '影闪', SS_FUUMASHOUAKU: '风魔手里剑·掌握', BO_MYSTERY_POWDER: '神秘粉末', BO_DUST_EXPLOSION: '粉尘爆炸', ABC_HIT_AND_SLIDING: '滑步打击', ABC_CHASING_BREAK: '追击破坏', ABC_CHASING_SHOT: '追击射击', ABC_ABYSS_FLAME: '深渊烈焰', AG_ENERGY_CONVERSION: '能量转换', SHC_CROSS_SLASH: '交叉斩', EM_PSYCHIC_STREAM: '念力洪流', CD_DIVINUS_FLOS: '神圣之花', IQ_BLAZING_FLAME_BLAST: '炽焰爆破', WH_WILD_WALK: '荒野疾行',
	HFLI_SBR44: '蜂鸟 S.B.R.44', MH_BLAST_FORGE: '爆裂熔炉', MH_TEMPERING: '淬炼', MH_CLASSY_FLUTTER: '优雅振翅', MH_TWISTER_CUTTER: '旋风切割', MH_ABSOLUTE_ZEPHYR: '绝对和风', MH_BRUSHUP_CLAW: '磨砺利爪', MH_BLAZING_AND_FURIOUS: '炽烈狂怒', MH_THE_ONE_FIGHTER_RISES: '唯一斗士崛起'
};
const detailedDescriptions = JSON.parse(fs.readFileSync(detailedDescriptionPath, 'utf8'));
const runtimeOnlySkills = JSON.parse(fs.readFileSync(runtimeOnlySkillPath, 'utf8'));
const detailedDescriptionEntries = Object.entries(detailedDescriptions);
if (detailedDescriptionEntries.length !== 1279) {
	throw new Error(`Expected 1279 official skill descriptions, found ${detailedDescriptionEntries.length}`);
}
const runtimeOnlyEntries = Object.entries(runtimeOnlySkills);
if (runtimeOnlyEntries.length !== 115) {
	throw new Error(`Expected 115 runtime-only skill entries, found ${runtimeOnlyEntries.length}`);
}
for (const [id, skill] of runtimeOnlyEntries) {
	const text = `${skill.name}\n${skill.description}`;
	if (!/[\u3400-\u9fff]/.test(text) || /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text)) {
		throw new Error(`Runtime-only skill ${id} is not fully localized`);
	}
}
for (const [id, description] of detailedDescriptionEntries) {
	if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(description)) {
		throw new Error(`Official skill description ${id} still contains Korean text`);
	}
	if (/(官方技能效果数据已收录|尚未收录|相关技能效果)/.test(description)) {
		throw new Error(`Official skill description ${id} still contains placeholder text`);
	}
}
const clientOnlySkills = {
	82: '火焰藤蔓',
	239: '生物工程研究',
	240: '创造生命',
	241: '栽培',
	242: '火焰控制',
	245: '训练大师',
	246: '治愈生命体',
	314: '诸神黄昏',
	2545: '物理物品攻击力上限',
	2546: '物理物品攻击力下限',
	2547: '魔法物品攻击力上限',
	2548: '魔法物品攻击力下限',
	2549: '活力治愈',
	3036: '布莱奇之诗',
	3037: '幸运之吻',
	3039: '力量转移',
	3040: '广域复活'
};

function values(value) {
	if (value == null) return [];
	if (!Array.isArray(value)) return [value];
	return value.map(entry => typeof entry === 'object' ? entry.Amount ?? entry.Area ?? entry.Value ?? entry.Level : entry);
}

function summarizeValues(value) {
	const list = values(value).filter(entry => entry != null);
	if (!list.length) return '';
	return [...new Set(list)].length === 1 ? String(list[0]) : list.join(' / ');
}

function describe(skill) {
	const lines = [skill.Description];
	const prose = curatedDescriptions[skill.Name] || detailedDescriptions[skill.Id];
	if (prose) lines.push(prose);
	lines.push(`最高等级：${skill.MaxLevel}`);
	lines.push(`类型：${typeLabels[skill.Type] || '辅助'}${skill.TargetType ? ` / ${targetLabels[skill.TargetType] || skill.TargetType}` : ''}`);
	if (skill.Element) lines.push(`属性：${elementLabels[skill.Element] || skill.Element}`);
	if (skill.Range != null) lines.push(`施放范围：${skill.Range === -1 ? '武器攻击距离' : skill.Range}`);
	if (skill.SplashArea != null) lines.push(`作用范围：${summarizeValues(skill.SplashArea)}`);
	const sp = summarizeValues(skill.Requires?.SpCost);
	if (sp) lines.push(`SP 消耗：${sp}`);
	return lines.join('\n');
}

const database = yaml.load(fs.readFileSync(skillDatabase, 'utf8'));
const legacyNames = new Map(yaml.load(fs.readFileSync(legacySkillDatabase, 'utf8')).Body.map(skill => [skill.Name, skill.Description]));
const staticNames = new Map();
for (const match of fs.readFileSync(clientSkillInfo, 'utf8').matchAll(/Name: '([^']+)',\s*\r?\n\s*SkillName: '([^']+)'/g)) {
	if (/[\u3400-\u9fff]/.test(match[2])) staticNames.set(match[1], match[2]);
}
const skills = database.Body
	.filter(skill => Number.isInteger(skill.Id) && skill.Name && skill.Description)
	.map(skill => ({
		...skill,
		Description: (/[\u3400-\u9fff]/.test(skill.Description)
			? skill.Description
			: /[\u3400-\u9fff]/.test(legacyNames.get(skill.Name) || '')
				? legacyNames.get(skill.Name)
				: staticNames.get(skill.Name) || additionalNames[skill.Name] || skill.Description).trim()
	}))
	.sort((left, right) => left.Id - right.Id);
const staticTable = Object.fromEntries(
	skills.map(skill => [
		skill.Id,
		{
			key: skill.Name,
			name: skill.Description,
			description: describe(skill)
		}
	])
);
for (const [id, name] of Object.entries(clientOnlySkills)) {
	staticTable[id] = {
		key: `CLIENT_SKILL_${id}`,
		name,
		description: `${name}\n${detailedDescriptions[id]}`
	};
}
for (const [id, skill] of runtimeOnlyEntries) {
	if (staticTable[id]) {
		throw new Error(`Runtime-only skill ${id} already exists in the canonical server skill database`);
	}
	staticTable[id] = {
		key: skill.key,
		name: skill.name,
		description: `${skill.name}\n${skill.description}\n最高等级：${skill.maxLevel}`
	};
}
const missingDetailedIds = Object.keys(detailedDescriptions).filter(id => !staticTable[id]);
if (missingDetailedIds.length) {
	throw new Error(`Detailed descriptions reference missing skills: ${missingDetailedIds.join(', ')}`);
}
const localizedEntries = Object.entries(staticTable).sort(
	([leftId], [rightId]) => Number(leftId) - Number(rightId)
);
const names = localizedEntries.map(([, skill]) => `${skill.key}#${skill.name}#`).join('\n') + '\n';
const descriptions = localizedEntries
	.map(([, skill]) => `${skill.key}#${skill.description}#`)
	.join('\n') + '\n';
const staticModule = await prettier.format(
	`// Generated by scripts/resources/generate-skill-localization.mjs. Do not edit manually.\n\nexport default ${JSON.stringify(staticTable)};\n`,
	{ ...(await prettier.resolveConfig(clientStaticTable)), filepath: clientStaticTable }
);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, 'skillnametable.txt'), names, 'utf8');
fs.writeFileSync(path.join(outputDirectory, 'skilldesctable.txt'), descriptions, 'utf8');
fs.writeFileSync(clientStaticTable, staticModule, 'utf8');
console.log(`Generated ${localizedEntries.length} localized skill names, descriptions, and static client entries.`);
