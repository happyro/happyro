import fs from 'node:fs';
import crypto from 'node:crypto';
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
const clientSkillInfoTable = path.join(projectRoot, 'repos/happyro-client/src/DB/Skills/SkillInfo.generated.js');
const clientSkillTreeTable = path.join(projectRoot, 'repos/happyro-client/src/DB/Skills/SkillTreeView.generated.js');
const runtimeSourceDirectory = path.join(projectRoot, 'repos/happyro-gateway/data/luafiles514/lua files');
const runtimeSourcePath = path.join(outputDirectory, 'skill-runtime-source.json');
const expectedRuntimeSources = [
	'skillinfoz/skillid.lub',
	'skillinfoz/skillinfolist.lub',
	'skillinfoz/jobinheritlist.lub',
	'skillinfoz/skilltreeview.lub',
	'repos/happyro-client/src/DB/Jobs/JobConst.js',
	'repos/happyro-client/src/DB/Skills/SkillInfo.js',
	'repos/happyro-client/src/DB/Skills/SkillTreeView.js'
];
const legacySkillDatabase = path.join(projectRoot, 'repos/happyro-server/db/pre-re/skill_db.yml');
const clientSkillInfo = path.join(projectRoot, 'repos/happyro-client/src/DB/Skills/SkillInfo.js');
const detailedDescriptionPath = path.join(projectRoot, 'localization/client/data/skill-description-prose.zh-CN.json');
const visibleLabelsPath = path.join(projectRoot, 'localization/client/data/skill-description-labels.zh-CN.json');
const runtimeOnlySkillPath = path.join(projectRoot, 'localization/client/data/skill-info-runtime-only.zh-CN.json');

function usage(color = true) {
	const paint = (code, value) => (color ? `\u001b[${code}m${value}\u001b[0m` : value);
	console.log(`
${paint('1;36', 'HappyRO skill localization generator')}

${paint('1;33', 'Usage')}
  ${paint('1;32', 'node generate-skill-localization.mjs --write')} [--no-color]
  ${paint('1;32', 'node generate-skill-localization.mjs --check')} [--no-color]

${paint('1;33', 'Examples')}
  ${paint('36', 'node generate-skill-localization.mjs --write')}
  ${paint('36', 'node generate-skill-localization.mjs --check --no-color')}
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

const options = parseArguments(process.argv.slice(2));
if (!options.action) {
	usage(options.color);
	process.exit(0);
}

const targetLabels = {
	Attack: '敌方目标',
	Support: '友方目标',
	Self: '自身',
	Ground: '指定地面'
};
const typeLabels = {
	Weapon: '物理',
	Magic: '魔法',
	Misc: '特殊',
	None: '辅助'
};
const elementLabels = {
	Weapon: '武器属性',
	Endowed: '赋予属性',
	Random: '随机属性',
	Neutral: '无属性',
	Fire: '火属性',
	Water: '水属性',
	Wind: '风属性',
	Earth: '地属性',
	Holy: '圣属性',
	Dark: '暗属性',
	Ghost: '念属性',
	Undead: '不死属性',
	Poison: '毒属性'
};
const visibleNameOverrides = {
	AL_ANGELUS: '天使之障壁',
	ALL_ANGEL_PROTECT: '谢谢你！',
	AM_SPHEREMINE: '召唤气泡虫',
	AM_CP_WEAPON: '化学武器保护',
	AM_CP_SHIELD: '化学盾牌保护',
	AM_CP_ARMOR: '化学铠甲保护',
	AM_CP_HELM: '化学头盔保护',
	AS_CLOAKING: '伪装',
	AS_GRIMTOOTH: '无影之牙',
	ASC_BREAKER: '气功炮',
	BA_FROSTJOKER: '冷笑话',
	BA_WHISTLE: '口哨',
	BA_ASSASSINCROSS: '夕阳下的刺客十字',
	BA_POEMBRAGI: '布莱奇之诗',
	BA_APPLEIDUN: '伊登的苹果',
	BD_ADAPTATION: '临机应变',
	BD_RICHMANKIM: '金先生发财了',
	BD_ETERNALCHAOS: '永恒的混沌',
	BD_DRUMBATTLEFIELD: '战鼓震天',
	BD_RINGNIBELUNGEN: '尼贝隆根之戒',
	BD_ROKISWEIL: '洛奇的悲鸣',
	BD_INTOABYSS: '深渊中',
	BD_SIEGFRIED: '不死神齐格弗里德',
	BS_HILTBINDING: '武器保有',
	BS_ADRENALINE: '速度激发',
	BS_WEAPONPERFECT: '无视体型攻击',
	BS_OVERTHRUST: '凶砍',
	BS_MAXIMIZE: '武器值最大化',
	CH_PALMSTRIKE: '猛虎硬爬山',
	CH_TIGERFIST: '伏虎拳',
	CH_CHAINCRUSH: '连柱崩击',
	CR_AUTOGUARD: '自动防御',
	CR_DEVOTION: '牺牲',
	CR_PROVIDENCE: '神祐之光',
	CR_DEFENDER: '光之盾',
	CR_SLIMPITCHER: '投掷纤细药水',
	CR_ACIDDEMONSTRATION: '强酸火烟瓶投掷',
	DC_UGLYDANCE: '丑陋之舞',
	DC_SCREAM: '惊声尖叫',
	DC_HUMMING: '哼唱',
	DC_DONTFORGETME: '勿忘我',
	DC_FORTUNEKISS: '幸运之吻',
	DC_SERVICEFORYOU: '为您服务',
	GS_GLITTERING: '抛硬币',
	GS_TRIPLEACTION: '三连行动',
	GS_SINGLEACTION: '单枪射击',
	GS_RAPIDSHOWER: '五连击',
	GS_DESPERADO: '亡命之徒',
	GS_DUST: '霰弹',
	GS_GROUNDDRIFT: '四面埋伏',
	HFLI_FLEET: '疾速移动',
	HFLI_SPEED: '超速',
	HW_NAPALMVULCAN: '念力连击',
	KN_BRANDISHSPEAR: '长矛挥击',
	LK_JOINTBEAT: '关节攻击',
	ML_AUTOGUARD: '自动防御',
	ML_DEFENDER: '光之盾',
	ML_DEVOTION: '牺牲',
	MO_SPIRITSRECOVERY: '运气调息',
	MO_BLADESTOP: '真剑百破道',
	MO_CHAINCOMBO: '连环全身掌',
	MO_COMBOFINISH: '猛龙夸强',
	NJ_TOBIDOUGU: '飞刀修炼',
	NJ_TATAMIGAESHI: '榻榻米翻转',
	NJ_KASUMIKIRI: '霞斩',
	NJ_UTSUSEMI: '金蝉脱壳',
	NJ_BUNSINJYUTSU: '幻影分身',
	NJ_NINPOU: '忍术修炼',
	NJ_SUITON: '水遁',
	NJ_HYOUSYOURAKU: '冰晶落',
	NJ_RAIGEKISAI: '雷击碎',
	NJ_KAMAITACHI: '朔风',
	NJ_NEN: '念',
	NJ_ISSEN: '一闪',
	PA_PRESSURE: '圣十字压力',
	PA_GOSPEL: '福音',
	PF_HPCONVERSION: '生命力转换',
	PF_SOULCHANGE: '灵魂交换',
	PF_SOULBURN: '精神冲击',
	PF_MEMORIZE: '速读术',
	PF_SPIDERWEB: '易燃之网',
	PR_IMPOSITIO: '神威祈福',
	PR_BENEDICTIO: '圣体降福',
	PR_REDEMPTIO: '赎罪祈福',
	RG_SNATCHER: '自动偷窃',
	RG_STEALCOIN: '偷钱',
	RG_TUNNELDRIVE: '潜遁',
	RG_RAID: '潜击',
	RG_INTIMIDATE: '胁持',
	RG_FLAGGRAFFITI: '旗帜涂鸦',
	RG_CLEANER: '清洗',
	RG_GANGSTER: '流氓天国',
	RG_COMPULSION: '强制减价',
	RG_PLAGIARISM: '抄袭',
	SA_ADVANCEDBOOK: '进阶书籍',
	SA_FROSTWEAPON: '寒冰附加',
	SA_LIGHTNINGLOADER: '雷电附加',
	SA_LANDPROTECTOR: '地面保护',
	SA_ABRACADABRA: '随机魔法',
	SA_MONOCELL: '单细胞',
	SA_SUMMONMONSTER: '召唤魔物',
	SA_REVERSEORCISH: '兽人脸',
	SA_FORTUNE: '幸运',
	SA_TAMINGMONSTER: '驯服魔物',
	SA_FULLRECOVERY: '完全恢复',
	SA_COMA: '濒死',
	SL_STAR: '拳圣之魂',
	SL_ROGUE: '流氓之魂',
	SL_SOULLINKER: '悟灵士之魂',
	SM_FATALBLOW: '致命攻击',
	SN_SIGHT: '狙杀瞄准',
	ST_REJECTSWORD: '卸除剑',
	ST_PRESERVE: '保护',
	WS_WEAPONREFINE: '武器精炼',
	WZ_SIGHTRASHER: '火狩芽',
	WZ_FROSTNOVA: '霜冻之术',
	WZ_HEAVENDRIVE: '崩裂术',
	CG_ARROWVULCAN: '奥义箭乱舞',
	WE_FEMALE: '我愿为你牺牲',
	RA_ELECTRICSHOCKER: '电击陷阱',
	RA_CLUSTERBOMB: '集束炸弹',
	RA_MAIZETRAP: '淡黄陷阱',
	NC_MAINFRAME: '主框架改造',
	NC_RESEARCHFE: '火与大地研究',
	WM_LESSON: '乐理课程',
	WM_RANDOMIZESPELL: '不确定要素的语言',
	SO_EL_CONTROL: '精灵控制',
	SO_EL_ANALYSIS: '四元素分析',
	GN_S_PHARMACY: '特殊制药',
	SP_SOULREAPER: '灵魂收割',
	SP_SOULREVOLVE: '灵魂循环',
	KO_YAMIKUMO: '暗云',
	KO_HAPPOKUNAI: '八方苦无',
	KO_MUCHANAGE: '暴投',
	KO_HUUMARANKA: '风魔手里剑·乱华',
	KO_MEIKYOUSISUI: '明镜止水',
	KO_ZANZOU: '幻术·残像',
	KO_KYOUGAKU: '幻术·惊愕',
	KO_JYUSATSU: '幻术·咒杀',
	KO_KAHU_ENTEN: '火符·炎天',
	KO_HYOUHU_HUBUKI: '冰符·吹雪',
	KO_KAZEHU_SEIRAN: '风符·青岚',
	KO_DOHU_KOUKAI: '土符·刚块',
	KO_KAIHOU: '术式解放',
	KO_ZENKAI: '术式展开',
	OB_AKAITSUKI: '不祥红月',
	SU_STOOP: '蜷缩',
	SU_LOPE: '跳跃',
	SU_SPRITEMABLE: '灵魂珠',
	SU_POWEROFFLOCK: '群体之力',
	SU_BUNCHOFSHRIMP: '虾群',
	WE_CALLALLFAMILY: '我们在一起',
	WE_ONEFOREVER: '死亡也无法将我们分开',
	WE_CHEERUP: '爸爸妈妈加油',
	AB_CONVENIO: '集结',
	IQ_THIRD_EXOR_FLAME: '最终章·驱魔之火',
	CD_EFFLIGO: '神罚',
	CD_FRAMEN: '弗拉门',
	TR_AIN_RHAPSODY: '矿工狂想曲',
	TR_JAWAII_SERENADE: '晚霞小夜曲',
	EM_ACTIVITY_BURN: '活力燃烧',
	EM_INCREASING_ACTIVITY: '活力提升',
	SOA_EXORCISM_OF_MALICIOUS_SOUL: '死灵净化',
	SOA_CIRCLE_OF_DIRECTIONS_AND_ELEMENTALS: '四方五行阵',
	SOA_SOUL_OF_HEAVEN_AND_EARTH: '天地神灵',
	SH_MYSTICAL_CREATURE_MASTERY: '灵物理解',
	SH_COMMUNE_WITH_CHUL_HO: '与铁虎共鸣',
	SH_CHUL_HO_SONIC_CLAW: '铁虎音速爪',
	SH_HOWLING_OF_CHUL_HO: '铁虎咆哮',
	SH_HOGOGONG_STRIKE: '虎高功乱打',
	SH_COMMUNE_WITH_KI_SUL: '与龟雪共鸣',
	SH_KI_SUL_WATER_SPRAYING: '龟雪洒水',
	SH_MARINE_FESTIVAL_OF_KI_SUL: '龟雪海洋祭典',
	SH_SANDY_FESTIVAL_OF_KI_SUL: '龟雪沙滩祭典',
	SH_KI_SUL_RAMPAGE: '龟雪翻腾',
	SH_COMMUNE_WITH_HYUN_ROK: '与玄鹿共鸣',
	SH_COLORS_OF_HYUN_ROK: '玄鹿五色角',
	SH_HYUN_ROKS_BREEZE: '玄鹿叶风',
	SH_HYUN_ROK_CANNON: '玄鹿炮',
	SH_CHUL_HO_BATTERING: '铁虎重击',
	SH_TEMPORARY_COMMUNION: '快速共鸣',
	SH_BLESSING_OF_MYSTICAL_CREATURES: '灵物祝福',
	HN_SELFSTUDY_SOCERY: '魔法自学',
	HN_NAPALM_VULCAN_STRIKE: '念力连击·冲击',
	SS_SEKIENHOU: '红炎炮',
	SS_REIKETSUHOU: '冷血炮',
	SS_RAIDENPOU: '雷电炮',
	SS_KINRYUUHOU: '金龙炮',
	SS_ANTENPOU: '暗转炮',
	MH_ERASER_CUTTER: '抹杀切割',
	MH_SILVERVEIN_RUSH: '银脉冲锋',
	MER_ESTIMATION: '怪物情报',
	NPC_DANCINGBLADE_ATK: '舞刃攻击',
	NPC_MAXPAIN_ATK: '最大痛苦攻击',
	GN_CRAZYWEED_ATK: '狂野杂草攻击',
	GN_FIRE_EXPANSION_SMOKE_POWDER: '火焰扩散·烟雾粉',
	GN_FIRE_EXPANSION_TEAR_GAS: '火焰扩散·催泪瓦斯',
	SU_SV_STEMSPEAR: '银藤茎之矛',
	SU_CN_POWDERING: '猫薄荷撒粉',
	SU_CN_METEOR: '猫薄荷陨石',
	SU_SV_ROOTTWIST: '银藤根缠绕',
	DK_SERVANTWEAPON_ATK: '侍从武器攻击',
	DK_SERVANT_W_SIGN: '侍从武器·标记',
	DK_SERVANT_W_PHANTOM: '侍从武器·幻影',
	DK_SERVANT_W_DEMOL: '侍从武器·爆破',
	DK_HACKANDSLASHER_ATK: '砍杀者攻击',
	CD_ARBITRIUM_ATK: '裁决攻击',
	EM_ELEMENTAL_BUSTER_FIRE: '元素破坏·火',
	EM_ELEMENTAL_BUSTER_WATER: '元素破坏·水',
	EM_ELEMENTAL_BUSTER_WIND: '元素破坏·风',
	EM_ELEMENTAL_BUSTER_GROUND: '元素破坏·地',
	EM_ELEMENTAL_BUSTER_POISON: '元素破坏·毒'
};
const additionalNames = {
	TF_POISON: '施毒',
	TF_DETOXIFY: '解毒',
	NPC_LEASH: '束缚',
	NPC_WIDELEASH: '广域束缚',
	NPC_WIDECRITICALWOUND: '广域致命伤口',
	NPC_ALL_STAT_DOWN: '全属性下降',
	NPC_GRADUAL_GRAVITY: '重力增强',
	NPC_DAMAGE_HEAL: '伤害转化治疗',
	NPC_IMMUNE_PROPERTY: '属性免疫',
	NPC_MOVE_COORDINATE: '位置转移',
	NPC_BLEEDING2: '出血',
	NPC_ICEBREATH2: '寒冰吐息',
	NPC_RAINOFMETEOR: '陨石雨',
	NPC_RELIEVE_ON: '解除状态开启',
	NPC_RELIEVE_OFF: '解除状态关闭',
	WL_HELLINFERNO: '地狱炼狱',
	WL_CHAINLIGHTNING_ATK: '连锁闪电攻击',
	WL_EARTHSTRAIN: '地裂术',
	WL_TETRAVORTEX_FIRE: '元素漩涡·火',
	WL_TETRAVORTEX_WATER: '元素漩涡·水',
	WL_TETRAVORTEX_WIND: '元素漩涡·风',
	RA_WUGMASTERY: '狼群精通',
	RA_WUGBITE: '狼咬',
	RA_RESEARCHTRAP: '陷阱研究',
	SR_GENTLETOUCH_ENERGYGAIN: '点穴·球',
	WA_SWING_DANCE: '摇摆舞',
	SO_VACUUM_EXTREME: '极限真空',
	SO_VARETYR_SPEAR: '雷霆之枪',
	ALL_RAY_OF_PROTECTION: '守护之光',
	SU_SV_ROOTTWIST_ATK: '银藤根缠绕攻击',
	SU_PICKYPECK_DOUBLE_ATK: '啄击连击',
	SU_CN_METEOR2: '猫薄荷陨石二段',
	SU_LUNATICCARROTBEAT2: '疯兔胡萝卜重击二段',
	AG_ALL_BLOOM_ATK2: '万紫千红二段',
	AG_CRYSTAL_IMPACT_ATK: '水晶冲击攻击',
	AG_ASTRAL_STRIKE_ATK: '星界冲击攻击',
	AG_CRIMSON_ARROW_ATK: '绯红箭攻击',
	MT_AXE_STOMP: '战斧践踏',
	MT_RUSH_QUAKE: '冲锋震击',
	MT_M_MACHINE: '制造装置',
	MT_A_MACHINE: '攻击装置',
	MT_D_MACHINE: '防御装置',
	MT_TWOAXEDEF: '双手斧防御',
	MT_ABR_M: 'ABR 精通',
	MT_SUMMON_ABR_BATTLE_WARIOR: '召唤 ABR 战斗勇士',
	MT_POWERFUL_SWING: '强力挥击',
	MT_ENERGY_CANNONADE: '能量炮击',
	TR_ROSEBLOSSOM_ATK: '玫瑰绽放攻击',
	NW_P_F_I: '枪械精通',
	NW_GRENADE_MASTERY: '榴弹精通',
	NW_INTENSIVE_AIM: '集中瞄准',
	NW_GRENADE_FRAGMENT: '榴弹碎片',
	NW_THE_VIGILANTE_AT_NIGHT: '暗夜守望者',
	NW_ONLY_ONE_BULLET: '致命一弹',
	NW_SPIRAL_SHOOTING: '螺旋射击',
	NW_MAGAZINE_FOR_ONE: '单人弹匣',
	NW_WILD_FIRE: '野火',
	NW_BASIC_GRENADE: '基础榴弹',
	NW_HASTY_FIRE_IN_THE_HOLE: '急袭榴弹',
	NW_GRENADES_DROPPING: '榴弹倾泻',
	NW_AUTO_FIRING_LAUNCHER: '自动发射器',
	NW_HIDDEN_CARD: '隐藏王牌',
	NW_MISSION_BOMBARD: '任务轰炸',
	SOA_TALISMAN_MASTERY: '符咒精通',
	SOA_SOUL_MASTERY: '灵魂精通',
	SOA_TALISMAN_OF_PROTECTION: '守护符',
	SOA_TALISMAN_OF_WARRIOR: '武士符',
	SOA_TALISMAN_OF_MAGICIAN: '魔法师符',
	SOA_SOUL_GATHERING: '灵魂聚集',
	SOA_TOTEM_OF_TUTELARY: '守护图腾',
	SKE_RISING_MOON: '月升',
	SKE_MIDNIGHT_KICK: '午夜踢',
	SKE_DAWN_BREAK: '破晓',
	SKE_TWINKLING_GALAXY: '闪耀银河',
	SKE_STAR_BURST: '星辰爆发',
	SKE_STAR_CANNON: '星辰炮',
	SKE_ALL_IN_THE_SKY: '天穹万象',
	SKE_ENCHANTING_SKY: '苍穹附魔',
	SS_TOKEDASU: '消融',
	SS_SHIMIRU: '渗透',
	SS_AKUMUKESU: '噩梦消除',
	SS_SHINKIROU: '蜃景',
	SS_KAGEGARI: '猎影',
	SS_KAGENOMAI: '影舞',
	SS_KAGEGISSEN: '影闪',
	SS_FUUMASHOUAKU: '风魔手里剑·掌握',
	BO_MYSTERY_POWDER: '神秘粉末',
	BO_DUST_EXPLOSION: '粉尘爆炸',
	ABC_HIT_AND_SLIDING: '滑步打击',
	ABC_CHASING_BREAK: '追击破坏',
	ABC_CHASING_SHOT: '追击射击',
	ABC_ABYSS_FLAME: '深渊烈焰',
	AG_ENERGY_CONVERSION: '能量转换',
	SHC_CROSS_SLASH: '交叉斩',
	EM_PSYCHIC_STREAM: '念力洪流',
	CD_DIVINUS_FLOS: '神圣之花',
	IQ_BLAZING_FLAME_BLAST: '炽焰爆破',
	WH_WILD_WALK: '荒野疾行',
	HFLI_SBR44: '蜂鸟 S.B.R.44',
	MH_BLAST_FORGE: '爆裂熔炉',
	MH_TEMPERING: '淬炼',
	MH_CLASSY_FLUTTER: '优雅振翅',
	MH_TWISTER_CUTTER: '旋风切割',
	MH_ABSOLUTE_ZEPHYR: '绝对和风',
	MH_BRUSHUP_CLAW: '磨砺利爪',
	MH_BLAZING_AND_FURIOUS: '炽烈狂怒',
	MH_THE_ONE_FIGHTER_RISES: '唯一斗士崛起'
};
function formatProse(value) {
	return value
		.split(/\n+/)
		.flatMap(line => line.split(/(?<=[。；！？])(?![”’])/u))
		.map(line => line.trim())
		.filter(Boolean)
		.join('\n');
}

const detailedDescriptions = Object.fromEntries(
	Object.entries(JSON.parse(fs.readFileSync(detailedDescriptionPath, 'utf8'))).map(([id, value]) => [
		id,
		formatProse(value)
	])
);
const visibleLabels = JSON.parse(fs.readFileSync(visibleLabelsPath, 'utf8'));
const runtimeOnlySkills = JSON.parse(fs.readFileSync(runtimeOnlySkillPath, 'utf8'));
const runtimeSource = JSON.parse(fs.readFileSync(runtimeSourcePath, 'utf8'));

function validateRuntimeSource(snapshot) {
	if (snapshot.schemaVersion !== 1 || !snapshot.data?.skills || !snapshot.data?.trees) {
		throw new Error('Unsupported or incomplete skill runtime source');
	}
	const sourceNames = Object.keys(snapshot.sources || {}).sort();
	if (JSON.stringify(sourceNames) !== JSON.stringify([...expectedRuntimeSources].sort())) {
		throw new Error('Skill runtime source metadata is incomplete');
	}
	for (const [file, expected] of Object.entries(snapshot.sources)) {
		const sourcePath = file.startsWith('repos/')
			? path.join(projectRoot, file)
			: path.join(runtimeSourceDirectory, file);
		const content = fs.readFileSync(sourcePath);
		const actual = crypto.createHash('sha256').update(content).digest('hex');
		if (actual !== expected.sha256 || content.length !== expected.bytes) {
			throw new Error(`Skill runtime source changed: ${file}; extract a reviewed snapshot first`);
		}
	}
	if (Object.keys(snapshot.data.skills).length !== 1572 || Object.keys(snapshot.data.trees).length !== 251) {
		throw new Error('Skill runtime source has unexpected record counts');
	}
}

validateRuntimeSource(runtimeSource);
const detailedDescriptionEntries = Object.entries(detailedDescriptions);
if (detailedDescriptionEntries.length !== 1279) {
	throw new Error(`Expected 1279 official skill descriptions, found ${detailedDescriptionEntries.length}`);
}
const bossTermCount = detailedDescriptionEntries.reduce(
	(total, [, description]) => total + (description.match(/\bBoss\b/g) || []).length,
	0
);
if (bossTermCount !== 61 || detailedDescriptionEntries.some(([, description]) => description.includes('首领'))) {
	throw new Error(`Expected 61 untranslated Boss terms, found ${bossTermCount}`);
}
const requiredDescriptionFragments = {
	241: ['自动归自己饲养'],
	387: ['无视敏捷下降等减速效果'],
	495: ['使用后服用的攻速药水仍会生效'],
	26: ['地面保护效果范围内不能使用'],
	136: ['昏迷概率受目标异常状态抗性影响'],
	225: ['不能超过被复制技能的最高等级'],
	233: ['召唤气泡虫', '气泡虫 HP'],
	364: ['取决于击败魔物前使用的技能'],
	513: ['卸除武器的成功率越高'],
	539: ['目标等级、MDEF 与 LUK'],
	2027: ['麻痹：', '吸血末端：', '毒液出血：'],
	2040: ['圣属性魔法伤害'],
	2213: ['施加魔力中毒'],
	2231: ['不能保存尚未学会的魔法'],
	2249: ['周围 3×3 格时触发', '周围 5×5 格内所有魔物', '可设置在目标脚下'],
	2250: ['周围 3×3 格时触发', '周围 5×5 格内所有魔物', '可设置在目标脚下'],
	2251: ['周围 3×3 格时触发', '周围 5×5 格内所有魔物', '可设置在目标脚下'],
	2252: ['周围 3×3 格时触发', '周围 5×5 格内所有魔物', '可设置在目标脚下'],
	2253: ['周围 3×3 格时触发', '周围 5×5 格所有敌人', '可设置在目标脚下'],
	2254: ['周围 3×3 格时触发', '周围 5×5 格所有敌人', '可设置在目标脚下'],
	2287: ['可能被侦测技能解除'],
	2333: ['随施法者职业等级提高'],
	2419: ['随目标等级提高而缩短'],
	2414: ['箭矢不足 5 支时不会发动'],
	2418: ['箭矢不足 10 支时不会发动'],
	2422: ['无法移动、攻击、使用物品或技能', '无法对话'],
	2494: ['准确的物品名称和数量', '不会制作成功'],
	2495: ['制作时必须持有对应食谱'],
	2574: ['提高满月踢的威力', '不能与太阳之光或星之光效果叠加'],
	2590: ['提高太阳爆发的威力', '不能与月之光或星之光效果叠加'],
	2430: ['装备乐器或鞭子', '狂乱成功率随施法者乐理课程等级提高'],
	2581: ['并施加沉默'],
	3031: ['解除着火、出血、深度睡眠和睡眠'],
	3032: ['解除冰冻、冷冻和冻结'],
	455: ['口哨与哼唱', '伊登的苹果与为您服务'],
	2465: ['按技能等级消耗 1 / 2 / 3 个火灵原石', '每 5 秒恢复 1% HP', '每 5 秒损失 1% HP'],
	2466: ['按技能等级消耗 1 / 2 / 3 个水灵原石', '每 5 秒恢复 1% HP', '每 5 秒损失 1% HP'],
	2467: ['按技能等级消耗 1 / 2 / 3 个风灵原石', '每 5 秒恢复 1% HP', '每 5 秒损失 1% HP'],
	2468: ['按技能等级消耗 1 / 2 / 3 个地灵原石', '每 5 秒恢复 1% HP', '每 5 秒损失 1% HP'],
	5064: ['倒地成员为不死属性时不会生效'],
	5068: ['立即解除'],
	5253: ['伤害随施法者基础等级和 POW 提高'],
	5463: ['朝阳、正午爆破、日落爆破、月升、午夜踢、破晓、闪耀银河、星辰爆发和星辰炮'],
	5479: ['本体使用红炎炮、冷血炮、雷电炮、金龙炮或暗转炮时，分身均施放暗转炮'],
	8025: ['伤害随生命体基础等级和 INT 提高']
};
for (const [id, fragments] of Object.entries(requiredDescriptionFragments)) {
	for (const fragment of fragments) {
		if (!detailedDescriptions[id]?.includes(fragment)) {
			throw new Error(`Official skill description ${id} is missing audited detail: ${fragment}`);
		}
	}
}
if (
	Object.keys(visibleLabels).length !== 1279 ||
	Object.keys(visibleLabels).some(id => !Object.hasOwn(detailedDescriptions, id))
) {
	throw new Error('Official skill description labels do not match the 1279 translated descriptions');
}
const visibleLabelCounts = Object.fromEntries(
	['maxLevel', 'category', 'type', 'target', 'range'].map(key => [
		key,
		Object.values(visibleLabels).reduce(
			(total, entry) => total + (Array.isArray(entry[key]) ? entry[key].length : Number(entry[key] != null)),
			0
		)
	])
);
if (
	JSON.stringify(visibleLabelCounts) !==
	JSON.stringify({ maxLevel: 1141, category: 1169, type: 547, target: 622, range: 2 })
) {
	throw new Error(`Official skill description labels are incomplete: ${JSON.stringify(visibleLabelCounts)}`);
}
for (const [id, labels] of Object.entries(visibleLabels)) {
	const text = Object.values(labels).flat().join('\n');
	if (/[^\s]/u.test(text) && /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(text)) {
		throw new Error(`Official skill description labels ${id} still contain Korean text`);
	}
}
const detailedLevelRows = detailedDescriptionEntries.reduce(
	(total, [, description]) => total + (description.match(/^\[等级 \d+\]：/gmu) || []).length,
	0
);
// The official S.B.R.44 entry contains three empty level markers; only meaningful rows are retained.
if (detailedLevelRows !== 6260) {
	throw new Error(`Expected 6260 translated skill level rows, found ${detailedLevelRows}`);
}
const apCostEntries = detailedDescriptionEntries.filter(([, description]) =>
	/^\u6d88\u8017 .+ AP[\uff1b\u3002]/mu.test(description)
);
if (apCostEntries.length !== 39) {
	throw new Error(`Expected 39 translated AP costs, found ${apCostEntries.length}`);
}
const apRecoveryEntries = detailedDescriptionEntries.filter(
	([id, description]) =>
		id === '2549' || /^(?:\u6bcf\u7ea7|\u547d\u4e2d|Lv\.|\u6062\u590d).+AP\uff1b/mu.test(description)
);
if (apRecoveryEntries.length !== 110) {
	throw new Error(`Expected 110 translated AP recoveries, found ${apRecoveryEntries.length}`);
}
for (const [id, description] of detailedDescriptionEntries) {
	if (!description || /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(description)) {
		throw new Error(`Skill description ${id} is empty or still contains Korean text`);
	}
	if (/^\[等级 \d+\]：\s*$/mu.test(description)) {
		throw new Error(`Skill description ${id} contains an empty level row`);
	}
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
	if (
		/(专用的[^。\n]+技能。|召唤或运用[^。\n]+之魂|发动[^。\n]+灵魂攻击|解除或抵抗特定状态异常的[^。\n]+消耗品技能)/.test(
			description
		)
	) {
		throw new Error(`Official skill description ${id} still contains a generic summary`);
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
	return value.map(entry => {
		if (typeof entry !== 'object') return entry;
		return entry.Amount ?? entry.Area ?? entry.Value ?? entry.Size ?? entry.Range ?? entry.Level;
	});
}

function summarizeValues(value) {
	const list = values(value).filter(entry => entry != null);
	if (!list.length) return '';
	return [...new Set(list)].length === 1 ? String(list[0]) : list.join(' / ');
}

function summarizeRanges(value) {
	return summarizeValues(values(value).map(entry => (typeof entry === 'number' ? Math.abs(entry) : entry)));
}

function summarizeElements(value) {
	if (!Array.isArray(value)) return elementLabels[value] || value;
	return value.map(entry => elementLabels[entry.Element] || entry.Element).join(' / ');
}

function formatDurationMs(ms) {
	if (ms == null || Number.isNaN(Number(ms))) return '';
	const total = Number(ms);
	if (total < 0) return '';
	if (total === 0) return '0 秒';
	if (total % 60000 === 0) {
		const minutes = total / 60000;
		return `${minutes} 分钟`;
	}
	if (total % 1000 === 0) {
		return `${total / 1000} 秒`;
	}
	return `${total} 毫秒`;
}

function durationTimes(value) {
	if (value == null) return [];
	const list = Array.isArray(value) ? value : [value];
	return list.map(entry => (typeof entry === 'object' && entry != null ? entry.Time : entry));
}

function summarizeDurations(value) {
	if (Array.isArray(value)) {
		const entries = value.filter(entry => entry.Time != null && Number(entry.Time) >= 0);
		if (!entries.length) return '';
		if (new Set(entries.map(entry => Number(entry.Time))).size === 1) return formatDurationMs(entries[0].Time);
		return entries.map(entry => `Lv.${entry.Level}：${formatDurationMs(entry.Time)}`).join(' / ');
	}
	const unique = [
		...new Set(
			durationTimes(value)
				.filter(entry => entry != null && Number(entry) >= 0)
				.map(formatDurationMs)
				.filter(Boolean)
		)
	];
	if (!unique.length) return '';
	return unique.length === 1 ? unique[0] : unique.join(' / ');
}

function describe(skill) {
	const lines = [skill.Description];
	const prose = detailedDescriptions[skill.Id];
	if (prose) lines.push(prose);
	lines.push(`最高等级：${visibleLabels[skill.Id]?.maxLevel ?? skill.MaxLevel}`);
	const requirement = describeSkillRequirement(skill.Id);
	if (requirement) lines.push(`习得条件：${requirement}`);
	const officialLabels = visibleLabels[skill.Id] || {};
	if (officialLabels.category) lines.push(`类别：${officialLabels.category.join('；或')}`);
	lines.push(`类型：${officialLabels.type?.join('；或') || typeLabels[skill.Type] || '辅助'}`);
	if (officialLabels.target || skill.TargetType) {
		lines.push(
			`目标：${officialLabels.target?.join('；或') || targetLabels[skill.TargetType] || skill.TargetType}`
		);
	}
	if (officialLabels.range) lines.push(`范围：${officialLabels.range.join('；或')}`);
	if (skill.Element) lines.push(`属性：${summarizeElements(skill.Element)}`);
	if (skill.Range != null) {
		lines.push(`施放范围：${summarizeRanges(skill.Range)}`);
	}
	if (skill.SplashArea != null) lines.push(`作用范围：${summarizeValues(skill.SplashArea)}`);
	const duration = summarizeDurations(skill.Duration1);
	if (duration) lines.push(`持续时间：${duration}`);
	if (skill.TargetType) {
		const timing = value => {
			if (value == null || durationTimes(value).every(time => Number(time) === 0)) return '无';
			return summarizeDurations(value) || '资料未提供';
		};
		lines.push(`独立冷却（基础）：${timing(skill.Cooldown)}`);
		lines.push(`施放后延迟（基础）：${timing(skill.AfterCastActDelay)}`);
		if (durationTimes(skill.FixedCastTime).some(time => Number(time) < 0)) {
			lines.push(`吟唱时间（基础）：${timing(skill.CastTime)}（固定部分按服务器规则分配）`);
		} else {
			lines.push(`可变吟唱（基础）：${timing(skill.CastTime)}`);
			lines.push(`固定吟唱（基础）：${timing(skill.FixedCastTime)}`);
		}
		if (skill.AfterCastWalkDelay != null) lines.push(`施放后移动延迟（基础）：${timing(skill.AfterCastWalkDelay)}`);
		lines.push('实际时间受角色属性、装备和状态影响，以服务器为准；无独立冷却不代表不受动作间隔限制。');
	}
	const sp = summarizeValues(skill.Requires?.SpCost);
	if (sp) lines.push(`SP 消耗：${sp}`);
	return lines.join('\n');
}

function describeClientOnlySkill(id, name) {
	const lines = [name, detailedDescriptions[id]];
	const runtimeSkill = runtimeSource.data.skills[id];
	if (runtimeSkill || visibleLabels[id]?.maxLevel != null) {
		lines.push(`最高等级：${visibleLabels[id]?.maxLevel ?? runtimeSkill.maxLevel}`);
	}
	const requirement = describeSkillRequirement(id);
	if (requirement) lines.push(`习得条件：${requirement}`);
	const officialLabels = visibleLabels[id] || {};
	if (officialLabels.category) lines.push(`类别：${officialLabels.category.join('；或')}`);
	if (officialLabels.type) lines.push(`类型：${officialLabels.type.join('；或')}`);
	if (officialLabels.target) lines.push(`目标：${officialLabels.target.join('；或')}`);
	if (officialLabels.range) lines.push(`范围：${officialLabels.range.join('；或')}`);
	if (!officialLabels.category?.some(label => label.includes('被动'))) {
		lines.push('施放时间资料：未提供，不能据此判断无冷却。');
	}
	return lines.join('\n');
}

const database = yaml.load(fs.readFileSync(skillDatabase, 'utf8'));
const databaseSkillsById = new Map(database.Body.map(skill => [String(skill.Id), skill]));
for (const [id, description] of detailedDescriptionEntries) {
	const skill = databaseSkillsById.get(id);
	if (!skill || id === '8012') continue;
	const actualLevels = [...description.matchAll(/^\[等级 (\d+)\]：/gmu)].map(match => Number(match[1]));
	if (!actualLevels.length) continue;
	const expectedLevels = Array.from({ length: skill.MaxLevel }, (_, index) => index + 1);
	// Basic Skill has no official level 8 effect; its source proceeds directly from level 7 to 9.
	if (id === '1') expectedLevels.splice(7, 1);
	if (JSON.stringify(actualLevels) !== JSON.stringify(expectedLevels)) {
		throw new Error(
			`Skill description ${id} has level rows ${actualLevels.join(', ')}, expected ${expectedLevels.join(', ')}`
		);
	}
}
const legacyNames = new Map(
	yaml.load(fs.readFileSync(legacySkillDatabase, 'utf8')).Body.map(skill => [skill.Name, skill.Description])
);
const staticNames = new Map();
for (const match of fs
	.readFileSync(clientSkillInfo, 'utf8')
	.matchAll(/Name: '([^']+)',\s*\r?\n\s*SkillName: '([^']+)'/g)) {
	if (/[\u3400-\u9fff]/.test(match[2])) staticNames.set(match[1], match[2]);
}
const skills = database.Body.filter(skill => Number.isInteger(skill.Id) && skill.Name && skill.Description)
	.map(skill => ({
		...skill,
		Description: (
			visibleNameOverrides[skill.Name] ||
			(/[\u3400-\u9fff]/.test(skill.Description)
				? skill.Description
				: /[\u3400-\u9fff]/.test(legacyNames.get(skill.Name) || '')
					? legacyNames.get(skill.Name)
					: staticNames.get(skill.Name) || additionalNames[skill.Name] || skill.Description)
		).trim()
	}))
	.sort((left, right) => left.Id - right.Id);

const localizedSkillNames = new Map(skills.map(skill => [String(skill.Id), skill.Description]));
for (const [id, name] of Object.entries(clientOnlySkills)) localizedSkillNames.set(id, name);
for (const [id, skill] of runtimeOnlyEntries) localizedSkillNames.set(id, skill.name);

const additionalSkillRequirements = {};
function registerRequirement(ids, requirement) {
	for (const id of ids) additionalSkillRequirements[id] = requirement;
}
registerRequirement(
	[
		142, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 238, 1001, 1002, 1003, 1004, 1005,
		1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 2544
	],
	'完成任务'
);
registerRequirement([143], '完成任务，且仅限初心者');
registerRequirement([334, 335, 336], '已婚并装备结婚戒指');
registerRequirement([359], '领主骑士职业等级达到 50');
registerRequirement([441], '职业等级达到 50');
registerRequirement([446], '处于灵魂状态');
registerRequirement([2024], '十字切割者基础技能');
registerRequirement([2208, 2230, 2231, 2232], '术士基础技能');
registerRequirement([2235, 2240], '游侠基础技能');
registerRequirement([2255, 2276, 2277], '机匠基础技能');
registerRequirement([2289], '魅影追踪者基础技能');
registerRequirement([2309, 2313], '皇家卫士基础技能');
registerRequirement(
	[2344, 2609, 5401, 5402, 5416, 5417, 5449, 5450, 5463, 5464, 5478, 5479, 5488, 5489, 5490, 5491, 5492],
	'默认习得'
);
registerRequirement([2412], '宫廷乐师或漫游舞者基础技能');
registerRequirement([2474, 2475, 2494, 2497], '基因学者基础技能');
registerRequirement([5014], '三转职业');

// These official descriptions intentionally differ from the runtime skill tree or add a visible state requirement.
const officialRequirementOverrides = {
	88: '冰冻术 Lv.1、冰墙术 Lv.1',
	259: '恶魔克星、天使之护 Lv.10',
	355: '狂击 Lv.5、怒爆 Lv.5、双手剑修炼 Lv.5',
	369: '信仰 Lv.8、天使之障壁 Lv.3、恶魔克星 Lv.5',
	399: '矛术修炼 Lv.9、骑乘大嘴鸟 Lv.1、骑兵修炼 Lv.3、创伤重击 Lv.3',
	444: '太阳、月亮与星星之知识 Lv.9，且处于灵魂状态',
	459: '速度激发 Lv.5，且处于灵魂状态',
	495: '双手剑加速 Lv.10，且处于灵魂状态',
	496: '制作药水 Lv.10，且处于灵魂状态',
	497: '制作药水 Lv.10，且处于灵魂状态',
	498: '制作药水 Lv.10，且处于灵魂状态',
	499: '二连矢 Lv.10，且处于灵魂状态',
	2338: '电气注入 Lv.1',
	2347: '点穴·球 Lv.3',
	2348: '点穴·球 Lv.3',
	5493: '影闪 Lv.7',
	5494: '苦无 - 扭曲 Lv.5、苦无 - 旋转 Lv.5、苦无 - 折射 Lv.5'
};

function describeSkillRequirement(id) {
	if (officialRequirementOverrides[id]) return officialRequirementOverrides[id];
	const runtimeSkill = runtimeSource.data.skills[id];
	const alternatives = [];
	if (runtimeSkill?.needSkills?.length) alternatives.push(runtimeSkill.needSkills);
	for (const requirements of Object.values(runtimeSkill?.jobNeedSkills || {})) {
		if (requirements.length) alternatives.push(requirements);
	}
	const uniqueAlternatives = [
		...new Map(alternatives.map(requirements => [JSON.stringify(requirements), requirements])).values()
	];
	if (uniqueAlternatives.length) {
		return uniqueAlternatives
			.map(requirements =>
				requirements
					.map(([skillId, level]) => {
						const name = localizedSkillNames.get(String(skillId));
						if (!name) throw new Error(`Skill ${id} requirement ${skillId} has no localized name`);
						return level == null ? name : `${name} Lv.${level}`;
					})
					.join('、')
			)
			.join('；或');
	}
	return additionalSkillRequirements[id] || '';
}

const describedRequirementCount = Object.keys(detailedDescriptions).filter(id => describeSkillRequirement(id)).length;
if (describedRequirementCount !== 1004) {
	throw new Error(`Expected 1004 translated skill requirements, found ${describedRequirementCount}`);
}
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
		description: describeClientOnlySkill(id, name)
	};
}
for (const [id, skill] of runtimeOnlyEntries) {
	if (staticTable[id]) {
		throw new Error(`Runtime-only skill ${id} already exists in the canonical server skill database`);
	}
	staticTable[id] = {
		key: skill.key,
		name: skill.name,
		description: `${skill.name}\n${skill.description}\n最高等级：${skill.maxLevel}\n施放时间资料：未提供，不能据此判断无冷却。`
	};
}
const missingDetailedIds = Object.keys(detailedDescriptions).filter(id => !staticTable[id]);
if (missingDetailedIds.length) {
	throw new Error(`Detailed descriptions reference missing skills: ${missingDetailedIds.join(', ')}`);
}
for (const [id, skill] of Object.entries(staticTable)) {
	if (/^施放范围：-/mu.test(skill.description)) {
		throw new Error(`Generated skill ${id} exposes an internal signed cast range`);
	}
}
for (const id of Object.keys(detailedDescriptions)) {
	const description = staticTable[id].description;
	if (visibleLabels[id].maxLevel != null && !description.includes(`最高等级：${visibleLabels[id].maxLevel}`)) {
		throw new Error(`Generated skill ${id} is missing its official max level`);
	}
	const requirement = describeSkillRequirement(id);
	if (requirement && !description.includes(`习得条件：${requirement}`)) {
		throw new Error(`Generated skill ${id} is missing its translated requirement`);
	}
	for (const [key, prefix] of Object.entries({
		category: '类别',
		type: '类型',
		target: '目标',
		range: '范围'
	})) {
		for (const label of visibleLabels[id][key] || []) {
			if (!description.includes(`${prefix}：`) || !description.includes(label)) {
				throw new Error(`Generated skill ${id} is missing its translated ${key} label: ${label}`);
			}
		}
	}
	if (/\bundefined\b/.test(description)) {
		throw new Error(`Generated skill ${id} contains an undefined visible value`);
	}
}
const localizedEntries = Object.entries(staticTable).sort(([leftId], [rightId]) => Number(leftId) - Number(rightId));
const untranslatedVisibleText =
	/\b(?:Attack|Demolition|Endowed|Fire|Ground|MAX|Phantom|Poison|Random|Sign|Smoke Powder|Tear Gas|Water|Wind)\b/i;
const inconsistentVisibleText =
	/首领|[\u3400-\u9fff]Boss|Boss[\u3400-\u9fff]|\bFlee\b|\bzeny\b|\d+z\b|\s[Xx](?=\s?\d)|受课程|按课程|施法者课程|课程和职业|教训|符咒修炼|灵道术修炼|神秘生物精通|战斗自学|独学·魔导学|自学巫术|天机修炼|影子猎杀|冰闪炮|风魔手里剑－|苦无－|\(掌握等级/;
for (const [id, skill] of localizedEntries) {
	if (
		untranslatedVisibleText.test(`${skill.name}\n${skill.description}`) ||
		inconsistentVisibleText.test(`${skill.name}\n${skill.description}`)
	) {
		throw new Error(`Generated skill ${id} still contains noncanonical visible text`);
	}
}
const names = localizedEntries.map(([, skill]) => `${skill.key}#${skill.name}#`).join('\n') + '\n';
const descriptions = localizedEntries.map(([, skill]) => `${skill.key}#${skill.description}#`).join('\n') + '\n';
const staticModule = await prettier.format(
	`// Generated by scripts/resources/generate-skill-localization.mjs. Do not edit manually.\n\nexport default ${JSON.stringify(staticTable)};\n`,
	{
		...(await prettier.resolveConfig(clientStaticTable)),
		filepath: clientStaticTable
	}
);
const runtimeSkillInfo = Object.fromEntries(
	Object.entries(runtimeSource.data.skills)
		.sort(([leftId], [rightId]) => Number(leftId) - Number(rightId))
		.map(([id, skill]) => {
			const localized = staticTable[id];
			if (!localized) throw new Error(`Runtime skill ${id} has no localized catalog entry`);
			return [
				id,
				{
					Name: skill.resourceName,
					SkillName: localized.name,
					MaxLv: skill.maxLevel,
					SpAmount: skill.spAmount,
					bSeperateLv: skill.separateLevel,
					AttackRange: skill.attackRange,
					SkillScale: skill.skillScale,
					NeedSkillList: skill.jobNeedSkills,
					_NeedSkillList: skill.needSkills
				}
			];
		})
);
const skillInfoModule = await prettier.format(
	`// Generated by scripts/resources/generate-skill-localization.mjs. Do not edit manually.\n\nexport default ${JSON.stringify(runtimeSkillInfo)};\n`,
	{
		...(await prettier.resolveConfig(clientSkillInfoTable)),
		filepath: clientSkillInfoTable
	}
);
const skillTreeModule = await prettier.format(
	`// Generated by scripts/resources/generate-skill-localization.mjs. Do not edit manually.\n\nexport default ${JSON.stringify(runtimeSource.data.trees)};\n`,
	{
		...(await prettier.resolveConfig(clientSkillTreeTable)),
		filepath: clientSkillTreeTable
	}
);

fs.mkdirSync(outputDirectory, { recursive: true });
function writeGeneratedFile(filename, content) {
	fs.writeFileSync(filename, content, { encoding: 'utf8', mode: 0o644 });
	fs.chmodSync(filename, 0o644);
}

const outputs = new Map([
	[path.join(outputDirectory, 'skillnametable.txt'), names],
	[path.join(outputDirectory, 'skilldesctable.txt'), descriptions],
	[clientStaticTable, staticModule],
	[clientSkillInfoTable, skillInfoModule],
	[clientSkillTreeTable, skillTreeModule]
]);

if (options.action === 'write') {
	fs.mkdirSync(outputDirectory, { recursive: true });
	for (const [filename, content] of outputs) writeGeneratedFile(filename, content);
	console.log(
		`Generated ${localizedEntries.length} localized skills, ${Object.keys(runtimeSkillInfo).length} runtime definitions, and ${Object.keys(runtimeSource.data.trees).length} job trees.`
	);
} else {
	for (const [filename, content] of outputs) {
		if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf8') !== content) {
			throw new Error(`Generated skill data is stale: ${filename}`);
		}
	}
	console.log('Skill localization and runtime data are current.');
}
