/**
 * DB/Skills/SkillInfo.js
 *
 * Manage skills
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import SK from './SkillConst.js';
import JobId from 'DB/Jobs/JobConst.js';

const SkillInfo = {};

SkillInfo[SK.SN_WINDWALK] = {
	Name: 'SN_WINDWALK',
	SkillName: '风行者',
	MaxLv: 10,
	SpAmount: [46, 52, 58, 64, 70, 76, 82, 88, 94, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_CONCENTRATION, 9]]
};
SkillInfo[SK.AB_VITUPERATUM] = {
	Name: 'AB_VITUPERATUM',
	SkillName: '斥责术',
	MaxLv: 5,
	SpAmount: [144, 120, 106, 92, 78],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 5, 5],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.AB_CONVENIO] = {
	Name: 'AB_CONVENIO',
	SkillName: '契约',
	MaxLv: 1,
	SpAmount: [70],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.AB_ANCILLA, 1],
		[SK.AB_ORATIO, 5]
	]
};
SkillInfo[SK.AL_RUWACH] = {
	Name: 'AL_RUWACH',
	SkillName: '光耀之堂',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [10]
};
SkillInfo[SK.WS_MELTDOWN] = {
	Name: 'WS_MELTDOWN',
	SkillName: '碎裂打击',
	MaxLv: 10,
	SpAmount: [50, 50, 60, 60, 70, 70, 80, 80, 90, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_SKINTEMPER, 3],
		[SK.BS_HILTBINDING, 1],
		[SK.BS_WEAPONRESEARCH, 5],
		[SK.BS_OVERTHRUST, 3]
	]
};
SkillInfo[SK.WS_CREATECOIN] = {
	Name: 'WS_CREATECOIN',
	SkillName: '硬币制造',
	MaxLv: 3,
	SpAmount: [10, 20, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.MER_MAGNIFICAT] = {
	Name: 'MER_MAGNIFICAT',
	SkillName: '圣母之颂歌',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.WS_CREATENUGGET] = {
	Name: 'WS_CREATENUGGET',
	SkillName: '金块制造',
	MaxLv: 3,
	SpAmount: [10, 20, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.WS_CARTBOOST] = {
	Name: 'WS_CARTBOOST',
	SkillName: '手推车加速',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.MC_PUSHCART, 5], [SK.BS_HILTBINDING, 1], [SK.MC_CARTREVOLUTION], [SK.MC_CHANGECART]]
};
SkillInfo[SK.WS_SYSTEMCREATE] = {
	Name: 'WS_SYSTEMCREATE',
	SkillName: '战斗机器制造',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ST_CHASEWALK] = {
	Name: 'ST_CHASEWALK',
	SkillName: '潜行',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TF_HIDING, 5],
		[SK.RG_TUNNELDRIVE, 3]
	]
};
SkillInfo[SK.ST_REJECTSWORD] = {
	Name: 'ST_REJECTSWORD',
	SkillName: '反击本能',
	MaxLv: 5,
	SpAmount: [10, 15, 20, 25, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.ST_STEALBACKPACK] = {
	Name: 'ST_STEALBACKPACK',
	SkillName: '偷窃零花钱',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_HEATER] = {
	Name: 'EL_HEATER',
	SkillName: '加热器',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CR_ALCHEMY] = {
	Name: 'CR_ALCHEMY',
	SkillName: '炼金术',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.CR_SYNTHESISPOTION] = {
	Name: 'CR_SYNTHESISPOTION',
	SkillName: '药水合成',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.CG_ARROWVULCAN] = {
	Name: 'CG_ARROWVULCAN',
	SkillName: '箭矢火神炮',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_DOUBLE, 5],
			[SK.AC_SHOWER, 5],
			[SK.BA_MUSICALSTRIKE, 1]
		],
		[JobId.DANCER_H]: [
			[SK.AC_DOUBLE, 5],
			[SK.AC_SHOWER, 5],
			[SK.DC_THROWARROW, 1]
		]
	}
};
SkillInfo[SK.CG_MOONLIT] = {
	Name: 'CG_MOONLIT',
	SkillName: '庇护之乐',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 5],
			[SK.BA_MUSICALLESSON, 7]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 5],
			[SK.DC_DANCINGLESSON, 7]
		]
	}
};
SkillInfo[SK.CG_MARIONETTE] = {
	Name: 'CG_MARIONETTE',
	SkillName: '傀儡控制',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [7],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_MUSICALLESSON, 5]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_DANCINGLESSON, 5]
		]
	}
};
SkillInfo[SK.LK_SPIRALPIERCE] = {
	Name: 'LK_SPIRALPIERCE',
	SkillName: '冲突螺旋',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_SPEARMASTERY, 5],
		[SK.KN_PIERCE, 5],
		[SK.KN_RIDING, 1],
		[SK.KN_SPEARSTAB, 5]
	]
};
SkillInfo[SK.LK_HEADCRUSH] = {
	Name: 'LK_HEADCRUSH',
	SkillName: '创伤打击',
	MaxLv: 5,
	SpAmount: [23, 23, 23, 23, 23],
	bSeperateLv: false,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_SPEARMASTERY, 9],
		[SK.KN_RIDING, 1]
	]
};
SkillInfo[SK.LK_JOINTBEAT] = {
	Name: 'LK_JOINTBEAT',
	SkillName: '生命打击',
	MaxLv: 10,
	SpAmount: [12, 12, 14, 14, 16, 16, 18, 18, 20, 20],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_CAVALIERMASTERY, 3],
		[SK.LK_HEADCRUSH, 3]
	]
};
SkillInfo[SK.AL_PNEUMA] = {
	Name: 'AL_PNEUMA',
	SkillName: '圣母之祈福',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AL_WARP, 4]]
};
SkillInfo[SK.HW_NAPALMVULCAN] = {
	Name: 'HW_NAPALMVULCAN',
	SkillName: '灵魂火焰',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_NAPALMBEAT, 5]]
};
SkillInfo[SK.CH_SOULCOLLECT] = {
	Name: 'CH_SOULCOLLECT',
	SkillName: '禅心',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.MO_EXPLOSIONSPIRITS, 5]]
};
SkillInfo[SK.PF_MINDBREAKER] = {
	Name: 'PF_MINDBREAKER',
	SkillName: '精神破坏',
	MaxLv: 5,
	SpAmount: [12, 15, 18, 21, 24],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 3],
		[SK.PF_SOULBURN, 2]
	]
};
SkillInfo[SK.PF_MEMORIZE] = {
	Name: 'PF_MEMORIZE',
	SkillName: '预知',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SA_ADVANCEDBOOK, 5],
		[SK.SA_FREECAST, 5],
		[SK.SA_AUTOSPELL, 1]
	]
};
SkillInfo[SK.PF_FOGWALL] = {
	Name: 'PF_FOGWALL',
	SkillName: '致盲之雾',
	MaxLv: 1,
	SpAmount: [25],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [
		[SK.SA_VIOLENTGALE, 2],
		[SK.SA_DELUGE, 2]
	]
};
SkillInfo[SK.PF_SPIDERWEB] = {
	Name: 'PF_SPIDERWEB',
	SkillName: '纤维锁',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.SA_DRAGONOLOGY, 4]]
};
SkillInfo[SK.ASC_METEORASSAULT] = {
	Name: 'ASC_METEORASSAULT',
	SkillName: '流星袭击',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AS_KATAR, 5],
		[SK.AS_RIGHT, 3],
		[SK.AS_SONICBLOW, 5],
		[SK.ASC_BREAKER, 1]
	]
};
SkillInfo[SK.ASC_CDP] = {
	Name: 'ASC_CDP',
	SkillName: '制作致命毒药',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TF_POISON, 10],
		[SK.TF_DETOXIFY, 1],
		[SK.AS_ENCHANTPOISON, 5]
	]
};
SkillInfo[SK.WE_BABY] = {
	Name: 'WE_BABY',
	SkillName: '爸爸妈妈，我爱你们！',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.WE_CALLPARENT] = {
	Name: 'WE_CALLPARENT',
	SkillName: '爸爸妈妈，我想你们！',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WE_CALLBABY] = {
	Name: 'WE_CALLBABY',
	SkillName: '亲爱的，来我身边吧～',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TK_RUN] = {
	Name: 'TK_RUN',
	SkillName: '疾跑',
	MaxLv: 10,
	SpAmount: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYSTORM] = {
	Name: 'TK_READYSTORM',
	SkillName: '龙卷姿态',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_STORMKICK, 1]]
};
SkillInfo[SK.TK_STORMKICK] = {
	Name: 'TK_STORMKICK',
	SkillName: '龙卷踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYDOWN] = {
	Name: 'TK_READYDOWN',
	SkillName: '脚跟落姿态',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_DOWNKICK, 1]]
};
SkillInfo[SK.TK_DOWNKICK] = {
	Name: 'TK_DOWNKICK',
	SkillName: '脚跟落',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AL_TELEPORT] = {
	Name: 'AL_TELEPORT',
	SkillName: '瞬间移动',
	MaxLv: 2,
	SpAmount: [10, 9],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.AL_RUWACH, 1]]
};
SkillInfo[SK.TK_READYTURN] = {
	Name: 'TK_READYTURN',
	SkillName: '回旋踢姿态',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_TURNKICK, 1]]
};
SkillInfo[SK.TK_TURNKICK] = {
	Name: 'TK_TURNKICK',
	SkillName: '回旋踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYCOUNTER] = {
	Name: 'TK_READYCOUNTER',
	SkillName: '反击踢姿态',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_COUNTER, 1]]
};
SkillInfo[SK.TK_COUNTER] = {
	Name: 'TK_COUNTER',
	SkillName: '反击踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_DODGE] = {
	Name: 'TK_DODGE',
	SkillName: '翻滚',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_JUMPKICK, 7]]
};
SkillInfo[SK.TK_JUMPKICK] = {
	Name: 'TK_JUMPKICK',
	SkillName: '飞踢',
	MaxLv: 7,
	SpAmount: [70, 60, 50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.TK_HPTIME] = {
	Name: 'TK_HPTIME',
	SkillName: '和平休息',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_SPTIME] = {
	Name: 'TK_SPTIME',
	SkillName: '快乐休息',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_POWER] = {
	Name: 'TK_POWER',
	SkillName: '气合',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_SEVENWIND] = {
	Name: 'TK_SEVENWIND',
	SkillName: '微风',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TK_HPTIME, 5],
		[SK.TK_SPTIME, 5],
		[SK.TK_POWER, 5]
	]
};
SkillInfo[SK.TK_HIGHJUMP] = {
	Name: 'TK_HIGHJUMP',
	SkillName: '跳跃',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [2, 4, 6, 8, 10]
};
SkillInfo[SK.SG_FEEL] = {
	Name: 'SG_FEEL',
	SkillName: '太阳、月亮与星星感知',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.SG_SUN_WARM] = {
	Name: 'SG_SUN_WARM',
	SkillName: '太阳炎',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 1]]
};
SkillInfo[SK.SG_MOON_WARM] = {
	Name: 'SG_MOON_WARM',
	SkillName: '月亮炎',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 2]]
};
SkillInfo[SK.SG_STAR_WARM] = {
	Name: 'SG_STAR_WARM',
	SkillName: '星星炎',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 3]]
};
SkillInfo[SK.SG_SUN_COMFORT] = {
	Name: 'SG_SUN_COMFORT',
	SkillName: '太阳保护',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 1]]
};
SkillInfo[SK.AL_WARP] = {
	Name: 'AL_WARP',
	SkillName: '传送门',
	MaxLv: 4,
	SpAmount: [35, 32, 29, 26],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_TELEPORT, 2]]
};
SkillInfo[SK.SG_MOON_COMFORT] = {
	Name: 'SG_MOON_COMFORT',
	SkillName: '月亮保护',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 2]]
};
SkillInfo[SK.SG_STAR_COMFORT] = {
	Name: 'SG_STAR_COMFORT',
	SkillName: '星星保护',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 3]]
};
SkillInfo[SK.SG_HATE] = {
	Name: 'SG_HATE',
	SkillName: '太阳、月亮与星星对抗',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.SG_SUN_ANGER] = {
	Name: 'SG_SUN_ANGER',
	SkillName: '太阳愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 1]]
};
SkillInfo[SK.SG_MOON_ANGER] = {
	Name: 'SG_MOON_ANGER',
	SkillName: '月亮愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 2]]
};
SkillInfo[SK.SG_STAR_ANGER] = {
	Name: 'SG_STAR_ANGER',
	SkillName: '星星愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 3]]
};
SkillInfo[SK.SG_SUN_BLESS] = {
	Name: 'SG_SUN_BLESS',
	SkillName: '太阳祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 1],
		[SK.SG_HATE, 1]
	]
};
SkillInfo[SK.SG_MOON_BLESS] = {
	Name: 'SG_MOON_BLESS',
	SkillName: '月亮祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 2],
		[SK.SG_HATE, 2]
	]
};
SkillInfo[SK.SG_STAR_BLESS] = {
	Name: 'SG_STAR_BLESS',
	SkillName: '星星祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 3],
		[SK.SG_HATE, 3]
	]
};
SkillInfo[SK.SG_DEVIL] = {
	Name: 'SG_DEVIL',
	SkillName: '太阳、月亮与星星之影',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_DEVELOPMENT] = {
	Name: 'GD_DEVELOPMENT',
	SkillName: '永久发展',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SG_FRIEND] = {
	Name: 'SG_FRIEND',
	SkillName: '太阳、月亮与星星组队',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.SG_KNOWLEDGE] = {
	Name: 'SG_KNOWLEDGE',
	SkillName: '太阳、月亮与星星信使',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SG_FUSION] = {
	Name: 'SG_FUSION',
	SkillName: '太阳、月亮与星星联合',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SG_KNOWLEDGE, 9]]
};
SkillInfo[SK.SL_ALCHEMIST] = {
	Name: 'SL_ALCHEMIST',
	SkillName: '炼金术士之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_BERSERKPITCHER] = {
	Name: 'AM_BERSERKPITCHER',
	SkillName: '狂暴药水支援',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SL_MONK] = {
	Name: 'SL_MONK',
	SkillName: '武僧之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.AL_HEAL] = {
	Name: 'AL_HEAL',
	SkillName: '治愈术',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.CRUSADER]: [
			[SK.CR_TRUST, 10],
			[SK.AL_DEMONBANE, 5]
		]
	}
};
SkillInfo[SK.SL_STAR] = {
	Name: 'SL_STAR',
	SkillName: '跆拳道宗师之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_SAGE] = {
	Name: 'SL_SAGE',
	SkillName: '贤者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_QUICKEN] = {
	Name: 'MER_QUICKEN',
	SkillName: '武器加速',
	MaxLv: 10,
	SpAmount: [14, 18, 22, 26, 30, 34, 38, 42, 46, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SL_CRUSADER] = {
	Name: 'SL_CRUSADER',
	SkillName: '十字军之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_SUPERNOVICE] = {
	Name: 'SL_SUPERNOVICE',
	SkillName: '超级初心者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_STAR, 1]]
};
SkillInfo[SK.SL_KNIGHT] = {
	Name: 'SL_KNIGHT',
	SkillName: '骑士之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_CRUSADER, 1]]
};
SkillInfo[SK.SL_WIZARD] = {
	Name: 'SL_WIZARD',
	SkillName: '巫师之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_SAGE, 1]]
};
SkillInfo[SK.SL_PRIEST] = {
	Name: 'SL_PRIEST',
	SkillName: '牧师之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_MONK, 1]]
};
SkillInfo[SK.SL_BARDDANCER] = {
	Name: 'SL_BARDDANCER',
	SkillName: '诗人和舞娘之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_TROPIC] = {
	Name: 'EL_TROPIC',
	SkillName: '热带气候',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SL_ROGUE] = {
	Name: 'SL_ROGUE',
	SkillName: '流氓之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_ASSASIN, 1]]
};
SkillInfo[SK.SL_ASSASIN] = {
	Name: 'SL_ASSASIN',
	SkillName: '刺客之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_BLACKSMITH] = {
	Name: 'SL_BLACKSMITH',
	SkillName: '铁匠之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_ALCHEMIST, 1]]
};
SkillInfo[SK.BS_ADRENALINE2] = {
	Name: 'BS_ADRENALINE2',
	SkillName: '高级速度激发',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [64],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BS_ADRENALINE, 5]]
};
SkillInfo[SK.SL_HUNTER] = {
	Name: 'SL_HUNTER',
	SkillName: '猎人之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_BARDDANCER, 1]]
};
SkillInfo[SK.SL_SOULLINKER] = {
	Name: 'SL_SOULLINKER',
	SkillName: '灵魂链接者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_STAR, 1]]
};
SkillInfo[SK.SL_KAIZEL] = {
	Name: 'SL_KAIZEL',
	SkillName: '凯西尔',
	MaxLv: 7,
	SpAmount: [120, 110, 100, 90, 80, 70, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_PRIEST, 1]]
};
SkillInfo[SK.SL_KAAHI] = {
	Name: 'SL_KAAHI',
	SkillName: '凯阿希',
	MaxLv: 7,
	SpAmount: [30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_CRUSADER, 1],
		[SK.SL_MONK, 1],
		[SK.SL_PRIEST, 1]
	]
};
SkillInfo[SK.AL_INCAGI] = {
	Name: 'AL_INCAGI',
	SkillName: '敏捷提升',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_HEAL, 3]]
};
SkillInfo[SK.SL_KAUPE] = {
	Name: 'SL_KAUPE',
	SkillName: '凯普',
	MaxLv: 3,
	SpAmount: [20, 30, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [
		[SK.SL_ASSASIN, 1],
		[SK.SL_ROGUE, 1]
	]
};
SkillInfo[SK.SL_KAITE] = {
	Name: 'SL_KAITE',
	SkillName: '凯特',
	MaxLv: 7,
	SpAmount: [70, 70, 70, 70, 70, 70, 70],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_SAGE, 1],
		[SK.SL_WIZARD, 1]
	]
};
SkillInfo[SK.SL_KAINA] = {
	Name: 'SL_KAINA',
	SkillName: '凯纳',
	MaxLv: 7,
	SpAmount: [0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TK_SPTIME, 1]]
};
SkillInfo[SK.SL_STIN] = {
	Name: 'SL_STIN',
	SkillName: '艾斯丁',
	MaxLv: 7,
	SpAmount: [18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_WIZARD, 1]]
};
SkillInfo[SK.SL_STUN] = {
	Name: 'SL_STUN',
	SkillName: '艾斯顿',
	MaxLv: 7,
	SpAmount: [18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_WIZARD, 1]]
};
SkillInfo[SK.SL_SMA] = {
	Name: 'SL_SMA',
	SkillName: '艾斯玛',
	MaxLv: 10,
	SpAmount: [8, 16, 24, 32, 40, 48, 56, 64, 72, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_STIN, 7],
		[SK.SL_STUN, 7]
	]
};
SkillInfo[SK.SL_SWOO] = {
	Name: 'SL_SWOO',
	SkillName: '艾斯伍',
	MaxLv: 7,
	SpAmount: [75, 65, 55, 45, 35, 25, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_PRIEST, 1]]
};
SkillInfo[SK.SL_SKE] = {
	Name: 'SL_SKE',
	SkillName: '艾斯克',
	MaxLv: 3,
	SpAmount: [45, 30, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SL_KNIGHT, 1]]
};
SkillInfo[SK.SL_SKA] = {
	Name: 'SL_SKA',
	SkillName: 'Eska',
	MaxLv: 3,
	SpAmount: [100, 80, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SL_MONK, 1]]
};
SkillInfo[SK.ST_PRESERVE] = {
	Name: 'ST_PRESERVE',
	SkillName: 'Preserve',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_PLAGIARISM, 10]]
};
SkillInfo[SK.ST_FULLSTRIP] = {
	Name: 'ST_FULLSTRIP',
	SkillName: 'Full Divestment',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPWEAPON, 5]]
};
SkillInfo[SK.WS_WEAPONREFINE] = {
	Name: 'WS_WEAPONREFINE',
	SkillName: 'Upgrade Weapon',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_WEAPONRESEARCH, 10]]
};
SkillInfo[SK.CR_SLIMPITCHER] = {
	Name: 'CR_SLIMPITCHER',
	SkillName: 'Aid Condensed Potion',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_POTIONPITCHER, 5]]
};
SkillInfo[SK.CR_FULLPROTECTION] = {
	Name: 'CR_FULLPROTECTION',
	SkillName: 'Full Chemical Protection',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AM_CP_WEAPON, 5],
		[SK.AM_CP_ARMOR, 5],
		[SK.AM_CP_SHIELD, 5],
		[SK.AM_CP_HELM, 5]
	]
};
SkillInfo[SK.AL_DECAGI] = {
	Name: 'AL_DECAGI',
	SkillName: 'Decrease Agility',
	MaxLv: 10,
	SpAmount: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_INCAGI, 1]]
};
SkillInfo[SK.PA_SHIELDCHAIN] = {
	Name: 'PA_SHIELDCHAIN',
	SkillName: 'Rapid Smiting',
	MaxLv: 5,
	SpAmount: [28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 9, 9, 11],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 5]]
};
SkillInfo[SK.HP_MANARECHARGE] = {
	Name: 'HP_MANARECHARGE',
	SkillName: 'Spiritual Thrift',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_MACEMASTERY, 10],
		[SK.AL_DEMONBANE, 10]
	]
};
SkillInfo[SK.PF_DOUBLECASTING] = {
	Name: 'PF_DOUBLECASTING',
	SkillName: 'Double Bolt',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_AUTOSPELL, 1]]
};
SkillInfo[SK.HW_GANBANTEIN] = {
	Name: 'HW_GANBANTEIN',
	SkillName: 'Ganbantein',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [18],
	_NeedSkillList: [
		[SK.WZ_ESTIMATION, 1],
		[SK.WZ_ICEWALL, 1]
	]
};
SkillInfo[SK.HW_GRAVITATION] = {
	Name: 'HW_GRAVITATION',
	SkillName: 'Gravitational Field',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [18, 18, 18, 18, 18],
	_NeedSkillList: [
		[SK.WZ_QUAGMIRE, 1],
		[SK.HW_MAGICCRASHER, 1],
		[SK.HW_MAGICPOWER, 10]
	]
};
SkillInfo[SK.WS_CARTTERMINATION] = {
	Name: 'WS_CARTTERMINATION',
	SkillName: 'High Speed Cart Ram',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MC_MAMMONITE, 10],
		[SK.BS_HAMMERFALL, 5],
		[SK.WS_CARTBOOST, 1]
	]
};
SkillInfo[SK.WS_OVERTHRUSTMAX] = {
	Name: 'WS_OVERTHRUSTMAX',
	SkillName: 'Maximum Power-Thrust',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_OVERTHRUST, 5]]
};
SkillInfo[SK.CG_LONGINGFREEDOM] = {
	Name: 'CG_LONGINGFREEDOM',
	SkillName: 'Longing for Freedom',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.BA_DISSONANCE, 3],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.DC_UGLYDANCE, 3],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.CG_HERMODE] = {
	Name: 'CG_HERMODE',
	SkillName: "Hermode's Rod",
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.CG_TAROTCARD] = {
	Name: 'CG_TAROTCARD',
	SkillName: 'Tarot Card of Fate',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_DISSONANCE, 3]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_UGLYDANCE, 3]
		]
	}
};
SkillInfo[SK.CR_ACIDDEMONSTRATION] = {
	Name: 'CR_ACIDDEMONSTRATION',
	SkillName: 'Acid Bomb',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AM_DEMONSTRATION, 5],
		[SK.AM_ACIDTERROR, 5]
	]
};
SkillInfo[SK.CR_CULTIVATION] = {
	Name: 'CR_CULTIVATION',
	SkillName: 'Cultivate Plant',
	MaxLv: 2,
	SpAmount: [10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1]
};
SkillInfo[SK.TK_MISSION] = {
	Name: 'TK_MISSION',
	SkillName: 'Taekwon Mission',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_POWER, 5]]
};
SkillInfo[SK.SL_HIGH] = {
	Name: 'SL_HIGH',
	SkillName: '1st Transcendent Spirit',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_SUPERNOVICE, 5]]
};
SkillInfo[SK.KN_ONEHAND] = {
	Name: 'KN_ONEHAND',
	SkillName: 'One Handed Quicken',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_TWOHANDQUICKEN, 10]]
};
SkillInfo[SK.AL_HOLYWATER] = {
	Name: 'AL_HOLYWATER',
	SkillName: 'Aqua Benedicta',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_TWILIGHT1] = {
	Name: 'AM_TWILIGHT1',
	SkillName: 'Spiritual Potion Creation 1',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.AM_TWILIGHT2] = {
	Name: 'AM_TWILIGHT2',
	SkillName: 'Spiritual Potion Creation 2',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.AM_TWILIGHT3] = {
	Name: 'AM_TWILIGHT3',
	SkillName: 'Spiritual Potion Creation 3',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.HT_POWER] = {
	Name: 'HT_POWER',
	SkillName: 'Beast Charge',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [12],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AC_DOUBLE, 10]]
};
SkillInfo[SK.GS_GLITTERING] = {
	Name: 'GS_GLITTERING',
	SkillName: 'Coin Flip',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_ENCHANTBLADE] = {
	Name: 'RK_ENCHANTBLADE',
	SkillName: 'Enchant Blade',
	MaxLv: 10,
	SpAmount: [34, 38, 42, 46, 50, 54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_RUNEMASTERY, 2]]
};
SkillInfo[SK.GS_FLING] = {
	Name: 'GS_FLING',
	SkillName: 'Coin Fling',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RK_WINDCUTTER] = {
	Name: 'RK_WINDCUTTER',
	SkillName: 'Wind Cutter',
	MaxLv: 5,
	SpAmount: [23, 26, 29, 32, 35],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_ENCHANTBLADE, 5]]
};
SkillInfo[SK.GS_TRIPLEACTION] = {
	Name: 'GS_TRIPLEACTION',
	SkillName: 'Triple Action',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RK_DRAGONHOWLING] = {
	Name: 'RK_DRAGONHOWLING',
	SkillName: 'Dragon Howling',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.GS_BULLSEYE] = {
	Name: 'GS_BULLSEYE',
	SkillName: "Bull's Eye",
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 5]]
};
SkillInfo[SK.RK_REFRESH] = {
	Name: 'RK_REFRESH',
	SkillName: 'Refresh',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GS_MADNESSCANCEL] = {
	Name: 'GS_MADNESSCANCEL',
	SkillName: 'Last Stand',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 4]]
};
SkillInfo[SK.RK_STORMBLAST] = {
	Name: 'RK_STORMBLAST',
	SkillName: 'Storm Blast',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GS_ADJUSTMENT] = {
	Name: 'GS_ADJUSTMENT',
	SkillName: "Gunslinger's Panic",
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 4]]
};
SkillInfo[SK.GC_VENOMIMPRESS] = {
	Name: 'GC_VENOMIMPRESS',
	SkillName: 'Venom Impression',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [10, 10, 10, 10, 10],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 3]]
};
SkillInfo[SK.GS_INCREASING] = {
	Name: 'GS_INCREASING',
	SkillName: 'Increase Accuracy',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 2]]
};
SkillInfo[SK.GC_CREATENEWPOISON] = {
	Name: 'GC_CREATENEWPOISON',
	SkillName: 'New Poison Creation',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GC_RESEARCHNEWPOISON, 1]]
};
SkillInfo[SK.GS_MAGICALBULLET] = {
	Name: 'GS_MAGICALBULLET',
	SkillName: 'Magical Bullet',
	MaxLv: 1,
	SpAmount: [7],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.GC_COUNTERSLASH] = {
	Name: 'GC_COUNTERSLASH',
	SkillName: 'Counter Slash',
	MaxLv: 10,
	SpAmount: [5, 8, 11, 14, 17, 19, 21, 23, 25, 27],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_WEAPONBLOCKING, 1]]
};
SkillInfo[SK.GS_CRACKER] = {
	Name: 'GS_CRACKER',
	SkillName: 'Cracker',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.GC_CLOAKINGEXCEED] = {
	Name: 'GC_CLOAKINGEXCEED',
	SkillName: 'Cloaking Exceed',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_CLOAKING, 3]]
};
SkillInfo[SK.GS_SINGLEACTION] = {
	Name: 'GS_SINGLEACTION',
	SkillName: 'Single Action',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GC_CROSSRIPPERSLASHER] = {
	Name: 'GC_CROSSRIPPERSLASHER',
	SkillName: 'Cross Ripper Slasher',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [9, 10, 11, 12, 13],
	_NeedSkillList: [[SK.GC_ROLLINGCUTTER, 1]]
};
SkillInfo[SK.GS_SNAKEEYE] = {
	Name: 'GS_SNAKEEYE',
	SkillName: 'Snake Eyes',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AB_CLEMENTIA] = {
	Name: 'AB_CLEMENTIA',
	SkillName: 'Clementia',
	MaxLv: 3,
	SpAmount: [280, 320, 360],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_BLESSING, 1]]
};
SkillInfo[SK.SM_SWORD] = {
	Name: 'SM_SWORD',
	SkillName: 'Sword Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AL_CRUCIS] = {
	Name: 'AL_CRUCIS',
	SkillName: '十字驱魔',
	MaxLv: 10,
	SpAmount: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DEMONBANE, 3]]
};
SkillInfo[SK.GS_TRACKING] = {
	Name: 'GS_TRACKING',
	SkillName: '追踪',
	MaxLv: 10,
	SpAmount: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_DISARM] = {
	Name: 'GS_DISARM',
	SkillName: '卸除武装',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_TRACKING, 7]]
};
SkillInfo[SK.GS_PIERCINGSHOT] = {
	Name: 'GS_PIERCINGSHOT',
	SkillName: '创伤射击',
	MaxLv: 5,
	SpAmount: [11, 12, 13, 14, 15],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_TRACKING, 5]]
};
SkillInfo[SK.GS_RAPIDSHOWER] = {
	Name: 'GS_RAPIDSHOWER',
	SkillName: '狂热射击',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_CHAINACTION, 3]]
};
SkillInfo[SK.GS_DESPERADO] = {
	Name: 'GS_DESPERADO',
	SkillName: '亡命之徒',
	MaxLv: 10,
	SpAmount: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GS_RAPIDSHOWER, 5]]
};
SkillInfo[SK.GS_GATLINGFEVER] = {
	Name: 'GS_GATLINGFEVER',
	SkillName: '加特林狂热',
	MaxLv: 10,
	SpAmount: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.GS_RAPIDSHOWER, 7],
		[SK.GS_DESPERADO, 5]
	]
};
SkillInfo[SK.GS_DUST] = {
	Name: 'GS_DUST',
	SkillName: '群体控制射击',
	MaxLv: 10,
	SpAmount: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_FULLBUSTER] = {
	Name: 'GS_FULLBUSTER',
	SkillName: '全弹发射',
	MaxLv: 10,
	SpAmount: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_DUST, 3]]
};
SkillInfo[SK.GS_SPREADATTACK] = {
	Name: 'GS_SPREADATTACK',
	SkillName: '散射攻击',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_GROUNDDRIFT] = {
	Name: 'GS_GROUNDDRIFT',
	SkillName: '枪手地雷',
	MaxLv: 10,
	SpAmount: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SPREADATTACK, 7]]
};
SkillInfo[SK.NJ_TOBIDOUGU] = {
	Name: 'NJ_TOBIDOUGU',
	SkillName: '飞刀练习',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NJ_SYURIKEN] = {
	Name: 'NJ_SYURIKEN',
	SkillName: '投掷手里剑',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_TOBIDOUGU, 1]]
};
SkillInfo[SK.NJ_KUNAI] = {
	Name: 'NJ_KUNAI',
	SkillName: '投掷苦无',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_SYURIKEN, 5]]
};
SkillInfo[SK.NJ_HUUMA] = {
	Name: 'NJ_HUUMA',
	SkillName: '投掷风魔手里剑',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 5],
		[SK.NJ_KUNAI, 5]
	]
};
SkillInfo[SK.NJ_ZENYNAGE] = {
	Name: 'NJ_ZENYNAGE',
	SkillName: '投掷金币',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 10],
		[SK.NJ_HUUMA, 5]
	]
};
SkillInfo[SK.AL_ANGELUS] = {
	Name: 'AL_ANGELUS',
	SkillName: '天使之赐福',
	MaxLv: 10,
	SpAmount: [23, 26, 29, 32, 35, 38, 41, 44, 47, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DP, 3]]
};
SkillInfo[SK.NJ_KASUMIKIRI] = {
	Name: 'NJ_KASUMIKIRI',
	SkillName: '雾斩',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_SHADOWJUMP, 1]]
};
SkillInfo[SK.NJ_SHADOWJUMP] = {
	Name: 'NJ_SHADOWJUMP',
	SkillName: '影跃',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [6, 8, 10, 12, 14],
	_NeedSkillList: [[SK.NJ_TATAMIGAESHI, 1]]
};
SkillInfo[SK.NJ_KIRIKAGE] = {
	Name: 'NJ_KIRIKAGE',
	SkillName: '暗影斩',
	MaxLv: 5,
	SpAmount: [10, 11, 12, 13, 14],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_KASUMIKIRI, 5]]
};
SkillInfo[SK.NJ_UTSUSEMI] = {
	Name: 'NJ_UTSUSEMI',
	SkillName: '蝉蜕',
	MaxLv: 5,
	SpAmount: [12, 15, 18, 21, 24],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_SHADOWJUMP, 5]]
};
SkillInfo[SK.NJ_BUNSINJYUTSU] = {
	Name: 'NJ_BUNSINJYUTSU',
	SkillName: '镜像',
	MaxLv: 10,
	SpAmount: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.NJ_NEN, 1],
		[SK.NJ_UTSUSEMI, 4],
		[SK.NJ_KIRIKAGE, 3]
	]
};
SkillInfo[SK.NJ_NINPOU] = {
	Name: 'NJ_NINPOU',
	SkillName: '忍术精通',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NJ_KOUENKA] = {
	Name: 'NJ_KOUENKA',
	SkillName: '火焰花瓣',
	MaxLv: 10,
	SpAmount: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_KAENSIN] = {
	Name: 'NJ_KAENSIN',
	SkillName: '烈焰盾',
	MaxLv: 10,
	SpAmount: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_KOUENKA, 5]]
};
SkillInfo[SK.NJ_BAKUENRYU] = {
	Name: 'NJ_BAKUENRYU',
	SkillName: '爆炎龙',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_KAENSIN, 7]
	]
};
SkillInfo[SK.NJ_HYOUSENSOU] = {
	Name: 'NJ_HYOUSENSOU',
	SkillName: '冰冻之枪',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_SUITON] = {
	Name: 'NJ_SUITON',
	SkillName: '水遁',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_HYOUSENSOU, 5]]
};
SkillInfo[SK.NJ_HYOUSYOURAKU] = {
	Name: 'NJ_HYOUSYOURAKU',
	SkillName: '雪花吹雪',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_SUITON, 7]
	]
};
SkillInfo[SK.NJ_HUUJIN] = {
	Name: 'NJ_HUUJIN',
	SkillName: '风刃',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_RAIGEKISAI] = {
	Name: 'NJ_RAIGEKISAI',
	SkillName: '雷击',
	MaxLv: 5,
	SpAmount: [16, 20, 24, 28, 32],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_HUUJIN, 5]]
};
SkillInfo[SK.NJ_KAMAITACHI] = {
	Name: 'NJ_KAMAITACHI',
	SkillName: '初风',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_RAIGEKISAI, 5]
	]
};
SkillInfo[SK.AL_BLESSING] = {
	Name: 'AL_BLESSING',
	SkillName: '祝福',
	MaxLv: 10,
	SpAmount: [28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_DP, 5]]
};
SkillInfo[SK.NJ_ISSEN] = {
	Name: 'NJ_ISSEN',
	SkillName: '杀戮一击',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 7],
		[SK.NJ_NEN, 1],
		[SK.NJ_KIRIKAGE, 5]
	]
};
SkillInfo[SK.MB_FIGHTING] = {
	Name: 'MB_FIGHTING',
	SkillName: '妖道格斗',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_NEUTRAL] = {
	Name: 'MB_NEUTRAL',
	SkillName: '僵尸中立',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_TAIMING_PUTI] = {
	Name: 'MB_TAIMING_PUTI',
	SkillName: '捕捉波提',
	MaxLv: 7,
	SpAmount: [0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_WHITEPOTION] = {
	Name: 'MB_WHITEPOTION',
	SkillName: '白色药水',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_MENTAL] = {
	Name: 'MB_MENTAL',
	SkillName: '精神差事',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_CARDPITCHER] = {
	Name: 'MB_CARDPITCHER',
	SkillName: '卡片投掷',
	MaxLv: 10,
	SpAmount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_PETPITCHER] = {
	Name: 'MB_PETPITCHER',
	SkillName: '踢飞幼体',
	MaxLv: 10,
	SpAmount: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_BODYSTUDY] = {
	Name: 'MB_BODYSTUDY',
	SkillName: '身体研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_BODYALTER] = {
	Name: 'MB_BODYALTER',
	SkillName: '改变身体',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_PETMEMORY] = {
	Name: 'MB_PETMEMORY',
	SkillName: '宠物记忆',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_M_TELEPORT] = {
	Name: 'MB_M_TELEPORT',
	SkillName: '宠物传送',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_B_GAIN] = {
	Name: 'MB_B_GAIN',
	SkillName: '获得僵尸',
	MaxLv: 7,
	SpAmount: [12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_M_GAIN] = {
	Name: 'MB_M_GAIN',
	SkillName: '获得妖道',
	MaxLv: 7,
	SpAmount: [1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_MISSION] = {
	Name: 'MB_MISSION',
	SkillName: '任务计时',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AL_CURE] = {
	Name: 'AL_CURE',
	SkillName: '治愈',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AL_HEAL, 2]],
	NeedSkillList: { [JobId.CRUSADER]: [[SK.CR_TRUST, 5]] }
};
SkillInfo[SK.MB_MUNAKBALL] = {
	Name: 'MB_MUNAKBALL',
	SkillName: '妖道球',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_SCROLL] = {
	Name: 'MB_SCROLL',
	SkillName: '宠物卷轴',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_GATHERING] = {
	Name: 'MB_B_GATHERING',
	SkillName: '僵尸聚集',
	MaxLv: 7,
	SpAmount: [17, 15, 13, 11, 9, 7, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_GATHERING] = {
	Name: 'MB_M_GATHERING',
	SkillName: '妖道聚集',
	MaxLv: 7,
	SpAmount: [32, 30, 28, 26, 24, 22, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_EXCLUDE] = {
	Name: 'MB_B_EXCLUDE',
	SkillName: '僵尸排除',
	MaxLv: 5,
	SpAmount: [180, 160, 140, 120, 100],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_B_DRIFT] = {
	Name: 'MB_B_DRIFT',
	SkillName: '僵尸漂移',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_WALLRUSH] = {
	Name: 'MB_B_WALLRUSH',
	SkillName: '邦古墙冲',
	MaxLv: 7,
	SpAmount: [9, 10, 11, 12, 13, 14, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_WALLRUSH] = {
	Name: 'MB_M_WALLRUSH',
	SkillName: '梦魇墙冲',
	MaxLv: 7,
	SpAmount: [9, 10, 11, 12, 13, 14, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_WALLSHIFT] = {
	Name: 'MB_B_WALLSHIFT',
	SkillName: '邦古墙移',
	MaxLv: 5,
	SpAmount: [13, 11, 9, 7, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_WALLCRASH] = {
	Name: 'MB_M_WALLCRASH',
	SkillName: '梦魇墙撞',
	MaxLv: 7,
	SpAmount: [27, 25, 23, 21, 19, 17, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_REINCARNATION] = {
	Name: 'MB_M_REINCARNATION',
	SkillName: '梦魇转生',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_EQUIP] = {
	Name: 'MB_B_EQUIP',
	SkillName: '邦古装备',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SL_DEATHKNIGHT] = {
	Name: 'SL_DEATHKNIGHT',
	SkillName: '死亡骑士之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_COLLECTOR] = {
	Name: 'SL_COLLECTOR',
	SkillName: '灵魂收集者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_NINJA] = {
	Name: 'SL_NINJA',
	SkillName: '忍者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MC_INCCARRY] = {
	Name: 'MC_INCCARRY',
	SkillName: '扩大负重上限',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_TWILIGHT4] = {
	Name: 'AM_TWILIGHT4',
	SkillName: '灵魂药水制作4',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_BERSERKAIZER] = {
	Name: 'DE_BERSERKAIZER',
	SkillName: '狂暴凯撒',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_DARKPOWER] = {
	Name: 'DA_DARKPOWER',
	SkillName: '黑暗力量',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DE_PASSIVE] = {
	Name: 'DE_PASSIVE',
	SkillName: '死亡被动',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_PATTACK] = {
	Name: 'DE_PATTACK',
	SkillName: '死亡攻击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PSPEED] = {
	Name: 'DE_PSPEED',
	SkillName: '死亡速度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PDEFENSE] = {
	Name: 'DE_PDEFENSE',
	SkillName: '死亡防御',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PCRITICAL] = {
	Name: 'DE_PCRITICAL',
	SkillName: '死亡暴击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PHP] = {
	Name: 'DE_PHP',
	SkillName: '死亡 HP',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PSP] = {
	Name: 'DE_PSP',
	SkillName: '死亡 SP',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_RESET] = {
	Name: 'DE_RESET',
	SkillName: '死亡重置',
	MaxLv: 1,
	SpAmount: [280],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_RANKING] = {
	Name: 'DE_RANKING',
	SkillName: '排名',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_PTRIPLE] = {
	Name: 'DE_PTRIPLE',
	SkillName: '死亡三连',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_ENERGY] = {
	Name: 'DE_ENERGY',
	SkillName: '能量',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MC_DISCOUNT] = {
	Name: 'MC_DISCOUNT',
	SkillName: '折扣',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_INCCARRY, 3]]
};
SkillInfo[SK.DE_SLASH] = {
	Name: 'DE_SLASH',
	SkillName: '斩击',
	MaxLv: 5,
	SpAmount: [10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_COIL] = {
	Name: 'DE_COIL',
	SkillName: '盘绕',
	MaxLv: 7,
	SpAmount: [8, 10, 12, 14, 16, 18, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_WAVE] = {
	Name: 'DE_WAVE',
	SkillName: '波动',
	MaxLv: 7,
	SpAmount: [55, 50, 45, 40, 35, 30, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_REBIRTH] = {
	Name: 'DE_REBIRTH',
	SkillName: '重生',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_AURA] = {
	Name: 'DE_AURA',
	SkillName: '光环',
	MaxLv: 7,
	SpAmount: [80, 75, 70, 65, 60, 55, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_FREEZER] = {
	Name: 'DE_FREEZER',
	SkillName: '冰冻人',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_CHANGEATTACK] = {
	Name: 'DE_CHANGEATTACK',
	SkillName: '改变攻击',
	MaxLv: 7,
	SpAmount: [80, 70, 60, 50, 40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PUNISH] = {
	Name: 'DE_PUNISH',
	SkillName: '死亡惩罚',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_POISON] = {
	Name: 'DE_POISON',
	SkillName: '死亡毒素',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_INSTANT] = {
	Name: 'DE_INSTANT',
	SkillName: '瞬发',
	MaxLv: 7,
	SpAmount: [50, 100, 150, 200, 250, 300, 350],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WARNING] = {
	Name: 'DE_WARNING',
	SkillName: '警告',
	MaxLv: 7,
	SpAmount: [50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_RANKEDKNIFE] = {
	Name: 'DE_RANKEDKNIFE',
	SkillName: '排名之刃',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_RANKEDGRADIUS] = {
	Name: 'DE_RANKEDGRADIUS',
	SkillName: '死亡格拉迪乌斯',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_GAUGE] = {
	Name: 'DE_GAUGE',
	SkillName: '量表',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_GTIME] = {
	Name: 'DE_GTIME',
	SkillName: '公会时间',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MC_OVERCHARGE] = {
	Name: 'MC_OVERCHARGE',
	SkillName: '过充',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_DISCOUNT, 3]]
};
SkillInfo[SK.DE_GSKILL] = {
	Name: 'DE_GSKILL',
	SkillName: '公会技能',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_GKILL] = {
	Name: 'DE_GKILL',
	SkillName: '公会击杀',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_ACCEL] = {
	Name: 'DE_ACCEL',
	SkillName: '加速',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_BLOCKDOUBLE] = {
	Name: 'DE_BLOCKDOUBLE',
	SkillName: '双重格挡',
	MaxLv: 3,
	SpAmount: [40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_BLOCKMELEE] = {
	Name: 'DE_BLOCKMELEE',
	SkillName: '近战格挡',
	MaxLv: 3,
	SpAmount: [40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_BLOCKFAR] = {
	Name: 'DE_BLOCKFAR',
	SkillName: '远程黑暗',
	MaxLv: 3,
	SpAmount: [100, 75, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_FRONTATTACK] = {
	Name: 'DE_FRONTATTACK',
	SkillName: '正面攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_DANGERATTACK] = {
	Name: 'DE_DANGERATTACK',
	SkillName: '危险攻击',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_TWINATTACK] = {
	Name: 'DE_TWINATTACK',
	SkillName: '双重攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WINDATTACK] = {
	Name: 'DE_WINDATTACK',
	SkillName: '风属性攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WATERATTACK] = {
	Name: 'DE_WATERATTACK',
	SkillName: '水属性攻击',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_ENERGY] = {
	Name: 'DA_ENERGY',
	SkillName: '能量',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_CLOUD] = {
	Name: 'DA_CLOUD',
	SkillName: '云雾',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_FIRSTSLOT] = {
	Name: 'DA_FIRSTSLOT',
	SkillName: '第一槽位',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_HEADDEF] = {
	Name: 'DA_HEADDEF',
	SkillName: '头部防御',
	MaxLv: 4,
	SpAmount: [60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9]
};
SkillInfo[SK.MC_PUSHCART] = {
	Name: 'MC_PUSHCART',
	SkillName: '手推车',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_INCCARRY, 5]]
};
SkillInfo[SK.DA_TRANSFORM] = {
	Name: 'DA_TRANSFORM',
	SkillName: '变身',
	MaxLv: 5,
	SpAmount: [180, 150, 120, 90, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_EXPLOSION] = {
	Name: 'DA_EXPLOSION',
	SkillName: '爆炸',
	MaxLv: 5,
	SpAmount: [140, 120, 100, 80, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_REWARD] = {
	Name: 'DA_REWARD',
	SkillName: '奖励',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CRUSH] = {
	Name: 'DA_CRUSH',
	SkillName: '粉碎',
	MaxLv: 5,
	SpAmount: [130, 110, 90, 70, 50],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_ITEMREBUILD] = {
	Name: 'DA_ITEMREBUILD',
	SkillName: '物品重建',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_ILLUSION] = {
	Name: 'DA_ILLUSION',
	SkillName: '幻影',
	MaxLv: 5,
	SpAmount: [120, 100, 80, 60, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_NUETRALIZE] = {
	Name: 'DA_NUETRALIZE',
	SkillName: '中和',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_RUNNER] = {
	Name: 'DA_RUNNER',
	SkillName: '奔跑者',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.DA_TRANSFER] = {
	Name: 'DA_TRANSFER',
	SkillName: '转移',
	MaxLv: 5,
	SpAmount: [70, 60, 50, 40, 30],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.DA_WALL] = {
	Name: 'DA_WALL',
	SkillName: '墙壁',
	MaxLv: 5,
	SpAmount: [10, 20, 30, 40, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.RETURN_TO_ELDICASTES] = {
	Name: 'RETURN_TO_ELDICASTES',
	SkillName: '前往迪卡斯特斯',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_REVENGE] = {
	Name: 'DA_REVENGE',
	SkillName: '复仇',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_EARPLUG] = {
	Name: 'DA_EARPLUG',
	SkillName: '耳塞',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_CONTRACT] = {
	Name: 'DA_CONTRACT',
	SkillName: '契约',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_BLACK] = {
	Name: 'DA_BLACK',
	SkillName: '黑色',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MC_IDENTIFY] = {
	Name: 'MC_IDENTIFY',
	SkillName: '鉴定物品',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_MAGICCART] = {
	Name: 'DA_MAGICCART',
	SkillName: '魔法手推车',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_COPY] = {
	Name: 'DA_COPY',
	SkillName: '复制',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CRYSTAL] = {
	Name: 'DA_CRYSTAL',
	SkillName: '水晶',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_EXP] = {
	Name: 'DA_EXP',
	SkillName: '经验',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CARTSWING] = {
	Name: 'DA_CARTSWING',
	SkillName: '手推车摆动',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_REBUILD] = {
	Name: 'DA_REBUILD',
	SkillName: '重建',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_JOBCHANGE] = {
	Name: 'DA_JOBCHANGE',
	SkillName: '转职',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_EDARKNESS] = {
	Name: 'DA_EDARKNESS',
	SkillName: '永恒黑暗',
	MaxLv: 5,
	SpAmount: [1100, 900, 700, 500, 300],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_EGUARDIAN] = {
	Name: 'DA_EGUARDIAN',
	SkillName: '守护者',
	MaxLv: 5,
	SpAmount: [1300, 1100, 900, 700, 500],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_TIMEOUT] = {
	Name: 'DA_TIMEOUT',
	SkillName: '暂停',
	MaxLv: 3,
	SpAmount: [500, 300, 100],
	bSeperateLv: false,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.ALL_TIMEIN] = {
	Name: 'ALL_TIMEIN',
	SkillName: '时间',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_ZENYRANK] = {
	Name: 'DA_ZENYRANK',
	SkillName: 'Zeny 排名',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_ACCESSORYMIX] = {
	Name: 'DA_ACCESSORYMIX',
	SkillName: '饰品合成',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NPC_EARTHQUAKE] = {
	Name: 'NPC_EARTHQUAKE',
	SkillName: '地震',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27],
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27]
	]
};
SkillInfo[SK.NPC_EARTHQUAKE_K] = {
	Name: 'NPC_EARTHQUAKE_K',
	SkillName: '地震',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27],
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27]
	]
};
SkillInfo[SK.EL_CIRCLE_OF_FIRE] = {
	Name: 'EL_CIRCLE_OF_FIRE',
	SkillName: '火焰之环',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MC_VENDING] = {
	Name: 'MC_VENDING',
	SkillName: '露天商店',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_PUSHCART, 3]]
};
SkillInfo[SK.EL_TIDAL_WEAPON] = {
	Name: 'EL_TIDAL_WEAPON',
	SkillName: '潮汐武器',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NPC_DRAGONFEAR] = {
	Name: 'NPC_DRAGONFEAR',
	SkillName: '龙之恐惧',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [6, 6, 6, 6, 6],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_PULSESTRIKE2] = {
	Name: 'NPC_PULSESTRIKE2',
	SkillName: '脉冲打击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[11, 11]]
};
SkillInfo[SK.NPC_PULSESTRIKE] = {
	Name: 'NPC_PULSESTRIKE',
	SkillName: '脉冲打击',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[15, 15],
		[15, 15],
		[15, 15],
		[15, 15],
		[15, 15]
	]
};
SkillInfo[SK.NPC_HELLJUDGEMENT] = {
	Name: 'NPC_HELLJUDGEMENT',
	SkillName: '地狱审判',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESILENCE] = {
	Name: 'NPC_WIDESILENCE',
	SkillName: '混乱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFREEZE] = {
	Name: 'NPC_WIDEFREEZE',
	SkillName: '冰封之心',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEBLEEDING] = {
	Name: 'NPC_WIDEBLEEDING',
	SkillName: '血腥盛宴',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTONE] = {
	Name: 'NPC_WIDESTONE',
	SkillName: '美杜莎凝视',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECONFUSE] = {
	Name: 'NPC_WIDECONFUSE',
	SkillName: '混乱法则',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESLEEP] = {
	Name: 'NPC_WIDESLEEP',
	SkillName: '墨菲斯沉睡',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_EVILLAND] = {
	Name: 'NPC_EVILLAND',
	SkillName: '邪恶之地',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[29, 29]
	]
};
SkillInfo[SK.MC_MAMMONITE] = {
	Name: 'MC_MAMMONITE',
	SkillName: '金钱攻击',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_SLOWCAST] = {
	Name: 'NPC_SLOWCAST',
	SkillName: '缓慢吟唱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_CRITICALWOUND] = {
	Name: 'NPC_CRITICALWOUND',
	SkillName: '致命伤口',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7]
};
SkillInfo[SK.NPC_STONESKIN] = {
	Name: 'NPC_STONESKIN',
	SkillName: '石肤',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_ANTIMAGIC] = {
	Name: 'NPC_ANTIMAGIC',
	SkillName: '死亡地带',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_WIDECURSE] = {
	Name: 'NPC_WIDECURSE',
	SkillName: '诅咒命运',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTUN] = {
	Name: 'NPC_WIDESTUN',
	SkillName: '眩晕凝视',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_VAMPIRE_GIFT] = {
	Name: 'NPC_VAMPIRE_GIFT',
	SkillName: '吸血鬼的礼物',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_WIDESOULDRAIN] = {
	Name: 'NPC_WIDESOULDRAIN',
	SkillName: 'Souless Defeat',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ALL_INCCARRY] = {
	Name: 'ALL_INCCARRY',
	SkillName: 'Increase Capacity',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_HELLPOWER] = {
	Name: 'NPC_HELLPOWER',
	SkillName: "Hell's Power",
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.AC_OWL] = {
	Name: 'AC_OWL',
	SkillName: "Owl's Eye",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GM_SANDMAN] = {
	Name: 'GM_SANDMAN',
	SkillName: 'Goodnight, Sweety',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.ALL_CATCRY] = {
	Name: 'ALL_CATCRY',
	SkillName: "Monster's Cry",
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_PARTYFLEE] = {
	Name: 'ALL_PARTYFLEE',
	SkillName: 'Blowing Wind !!',
	MaxLv: 10,
	SpAmount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ALL_ANGEL_PROTECT] = {
	Name: 'ALL_ANGEL_PROTECT',
	SkillName: 'Thank You So Much!!',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.ALL_DREAM_SUMMERNIGHT] = {
	Name: 'ALL_DREAM_SUMMERNIGHT',
	SkillName: 'Summer Dream',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_REVERSEORCISH] = {
	Name: 'ALL_REVERSEORCISH',
	SkillName: 'Reverse Orcish',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_WEWISH] = {
	Name: 'ALL_WEWISH',
	SkillName: "Sing along with the Singing Crystal's tune:",
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AC_VULTURE] = {
	Name: 'AC_VULTURE',
	SkillName: "Vulture's Eye",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_OWL, 3]],
	NeedSkillList: { [JobId.ROGUE]: [] }
};
SkillInfo[SK.AC_CONCENTRATION] = {
	Name: 'AC_CONCENTRATION',
	SkillName: 'Improve Concentration',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_VULTURE, 1]]
};
SkillInfo[SK.AC_DOUBLE] = {
	Name: 'AC_DOUBLE',
	SkillName: 'Double Strafe',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: { [JobId.ROGUE]: [[SK.AC_VULTURE, 10]] }
};
SkillInfo[SK.HLIF_HEAL] = {
	Name: 'HLIF_HEAL',
	SkillName: 'Healing Hands',
	MaxLv: 5,
	SpAmount: [13, 16, 19, 22, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_MOON] = {
	Name: 'HFLI_MOON',
	SkillName: 'Moonlight',
	MaxLv: 5,
	SpAmount: [4, 8, 12, 16, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_XENO_SLASHER] = {
	Name: 'MH_XENO_SLASHER',
	SkillName: 'Xeno Slasher',
	MaxLv: 10,
	SpAmount: [85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.MH_STEINWAND] = {
	Name: 'MH_STEINWAND',
	SkillName: 'Stein Wand',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_LAVA_SLIDE] = {
	Name: 'MH_LAVA_SLIDE',
	SkillName: 'Lava Slide',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.AC_SHOWER] = {
	Name: 'AC_SHOWER',
	SkillName: 'Arrow Shower',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AC_DOUBLE, 5]]
};
SkillInfo[SK.GD_KAFRACONTRACT] = {
	Name: 'GD_KAFRACONTRACT',
	SkillName: 'Contract With Kafra',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SM_TWOHAND] = {
	Name: 'SM_TWOHAND',
	SkillName: 'Two Handed Sword Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_SWORD, 1]]
};
SkillInfo[SK.TF_DOUBLE] = {
	Name: 'TF_DOUBLE',
	SkillName: 'Double Attack',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MA_LANDMINE] = {
	Name: 'MA_LANDMINE',
	SkillName: 'Land Mine',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MER_REGAIN] = {
	Name: 'MER_REGAIN',
	SkillName: 'Regain',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_FIRE_CLOAK] = {
	Name: 'EL_FIRE_CLOAK',
	SkillName: 'Fire Cloak',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_MISS] = {
	Name: 'TF_MISS',
	SkillName: 'Improve Dodge',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WIND_SLASH] = {
	Name: 'EL_WIND_SLASH',
	SkillName: 'Wind Slash',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.TF_STEAL] = {
	Name: 'TF_STEAL',
	SkillName: 'Steal',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TF_HIDING] = {
	Name: 'TF_HIDING',
	SkillName: 'Hiding',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_STEAL, 5]]
};
SkillInfo[SK.TF_POISON] = {
	Name: 'TF_POISON',
	SkillName: 'Envenom',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.TF_DETOXIFY] = {
	Name: 'TF_DETOXIFY',
	SkillName: 'Detoxify',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.TF_POISON, 3]]
};
SkillInfo[SK.ALL_RESURRECTION] = {
	Name: 'ALL_RESURRECTION',
	SkillName: 'Resurrection',
	MaxLv: 4,
	SpAmount: [60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 4],
		[SK.PR_STRECOVERY, 1]
	]
};
SkillInfo[SK.KN_SPEARMASTERY] = {
	Name: 'KN_SPEARMASTERY',
	SkillName: 'Spear Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GUARDRESEARCH] = {
	Name: 'GD_GUARDRESEARCH',
	SkillName: 'Guardian Research',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_PIERCE] = {
	Name: 'KN_PIERCE',
	SkillName: 'Pierce',
	MaxLv: 10,
	SpAmount: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.MA_SANDMAN] = {
	Name: 'MA_SANDMAN',
	SkillName: 'Sandman',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MER_TENDER] = {
	Name: 'MER_TENDER',
	SkillName: 'Tender',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_FIRE_MANTLE] = {
	Name: 'EL_FIRE_MANTLE',
	SkillName: 'Fire Mantle',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_BRANDISHSPEAR] = {
	Name: 'KN_BRANDISHSPEAR',
	SkillName: 'Brandish Spear',
	MaxLv: 10,
	SpAmount: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.KN_RIDING, 1],
		[SK.KN_SPEARSTAB, 3]
	]
};
SkillInfo[SK.EL_HURRICANE] = {
	Name: 'EL_HURRICANE',
	SkillName: 'Hurricane',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.KN_SPEARSTAB] = {
	Name: 'KN_SPEARSTAB',
	SkillName: 'Spear Stab',
	MaxLv: 10,
	SpAmount: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [[SK.KN_PIERCE, 5]]
};
SkillInfo[SK.KN_SPEARBOOMERANG] = {
	Name: 'KN_SPEARBOOMERANG',
	SkillName: 'Spear Boomerang',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9, 11],
	_NeedSkillList: [[SK.KN_PIERCE, 3]]
};
SkillInfo[SK.KN_TWOHANDQUICKEN] = {
	Name: 'KN_TWOHANDQUICKEN',
	SkillName: 'Two Hand Quicken',
	MaxLv: 10,
	SpAmount: [14, 18, 22, 26, 30, 34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_TWOHAND, 1]]
};
SkillInfo[SK.KN_AUTOCOUNTER] = {
	Name: 'KN_AUTOCOUNTER',
	SkillName: 'Counter Attack',
	MaxLv: 5,
	SpAmount: [3, 3, 3, 3, 3],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_TWOHAND, 1]]
};
SkillInfo[SK.KN_BOWLINGBASH] = {
	Name: 'KN_BOWLINGBASH',
	SkillName: 'Bowling Bash',
	MaxLv: 10,
	SpAmount: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SM_BASH, 10],
		[SK.SM_MAGNUM, 3],
		[SK.SM_TWOHAND, 5],
		[SK.KN_TWOHANDQUICKEN, 10],
		[SK.KN_AUTOCOUNTER, 5]
	],
	NeedSkillList: { [JobId.SUPERNOVICE2]: [[SK.KN_AUTOCOUNTER, 5]] }
};
SkillInfo[SK.KN_CHARGEATK] = {
	Name: 'KN_CHARGEATK',
	SkillName: 'Charge Attack',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [14]
};
SkillInfo[SK.CR_SHRINK] = {
	Name: 'CR_SHRINK',
	SkillName: 'Shrink',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_SONICACCEL] = {
	Name: 'AS_SONICACCEL',
	SkillName: 'Sonic Acceleration',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_VENOMKNIFE] = {
	Name: 'AS_VENOMKNIFE',
	SkillName: 'Venom Knife',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [35],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.RG_CLOSECONFINE] = {
	Name: 'RG_CLOSECONFINE',
	SkillName: 'Close Confine',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.WZ_SIGHTBLASTER] = {
	Name: 'WZ_SIGHTBLASTER',
	SkillName: 'Sight Blaster',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_RIDING] = {
	Name: 'KN_RIDING',
	SkillName: 'Peco Peco Ride',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SM_ENDURE, 1]]
};
SkillInfo[SK.SA_ELEMENTWATER] = {
	Name: 'SA_ELEMENTWATER',
	SkillName: 'Elemental Change - Water',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.HT_PHANTASMIC] = {
	Name: 'HT_PHANTASMIC',
	SkillName: 'Phantasmic Arrow',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BA_PANGVOICE] = {
	Name: 'BA_PANGVOICE',
	SkillName: 'Pang Voice',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DC_WINKCHARM] = {
	Name: 'DC_WINKCHARM',
	SkillName: 'Charming Wink',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_UNFAIRLYTRICK] = {
	Name: 'BS_UNFAIRLYTRICK',
	SkillName: '可疑的销售术',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_GREED] = {
	Name: 'BS_GREED',
	SkillName: '贪婪',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PR_REDEMPTIO] = {
	Name: 'PR_REDEMPTIO',
	SkillName: '救赎',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [800],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MO_KITRANSLATION] = {
	Name: 'MO_KITRANSLATION',
	SkillName: '灵魂赋予',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MO_BALKYOUNG] = {
	Name: 'MO_BALKYOUNG',
	SkillName: '极刑掌',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SA_ELEMENTGROUND] = {
	Name: 'SA_ELEMENTGROUND',
	SkillName: '元素转换 - 地',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SA_ELEMENTFIRE] = {
	Name: 'SA_ELEMENTFIRE',
	SkillName: '元素转换 - 火',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SA_ELEMENTWIND] = {
	Name: 'SA_ELEMENTWIND',
	SkillName: '元素转换 - 风',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SM_RECOVERY] = {
	Name: 'SM_RECOVERY',
	SkillName: '增加 HP 恢复',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.KN_CAVALIERMASTERY] = {
	Name: 'KN_CAVALIERMASTERY',
	SkillName: '骑士精通',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_RIDING, 1]]
};
SkillInfo[SK.AB_HIGHNESSHEAL] = {
	Name: 'AB_HIGHNESSHEAL',
	SkillName: '高级治愈术',
	MaxLv: 5,
	SpAmount: [70, 100, 130, 160, 190],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_RENOVATIO, 1]]
};
SkillInfo[SK.AB_DUPLELIGHT_MELEE] = {
	Name: 'AB_DUPLELIGHT_MELEE',
	SkillName: '双重打击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11]
};
SkillInfo[SK.MER_BENEDICTION] = {
	Name: 'MER_BENEDICTION',
	SkillName: '祝祷',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.PR_MACEMASTERY] = {
	Name: 'PR_MACEMASTERY',
	SkillName: '钝器精通',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WATER_SCREEN] = {
	Name: 'EL_WATER_SCREEN',
	SkillName: '水幕',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PR_IMPOSITIO] = {
	Name: 'PR_IMPOSITIO',
	SkillName: '武器祝福',
	MaxLv: 5,
	SpAmount: [59, 62, 65, 68, 71],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_HURRICANE_ATK] = {
	Name: 'EL_HURRICANE_ATK',
	SkillName: '飓风攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.PR_SUFFRAGIUM] = {
	Name: 'PR_SUFFRAGIUM',
	SkillName: '牺牲祈福',
	MaxLv: 3,
	SpAmount: [8, 8, 8],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.PR_IMPOSITIO, 2]]
};
SkillInfo[SK.PR_ASPERSIO] = {
	Name: 'PR_ASPERSIO',
	SkillName: '神圣之水',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_HOLYWATER, 1],
		[SK.PR_IMPOSITIO, 3]
	]
};
SkillInfo[SK.PR_BENEDICTIO] = {
	Name: 'PR_BENEDICTIO',
	SkillName: '圣体奉献',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.PR_ASPERSIO, 5],
		[SK.PR_GLORIA, 3]
	]
};
SkillInfo[SK.WL_SIENNAEXECRATE] = {
	Name: 'WL_SIENNAEXECRATE',
	SkillName: '赤土诅咒',
	MaxLv: 5,
	SpAmount: [32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.WL_SUMMONSTONE, 1]]
};
SkillInfo[SK.WL_CRIMSONROCK] = {
	Name: 'WL_CRIMSONROCK',
	SkillName: '绯红陨石',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONFB, 1]]
};
SkillInfo[SK.WL_SUMMONBL] = {
	Name: 'WL_SUMMONBL',
	SkillName: '召唤闪电球',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_VERMILION, 1]]
};
SkillInfo[SK.WL_READING_SB] = {
	Name: 'WL_READING_SB',
	SkillName: '阅读魔法书',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WL_READING_SB_READING] = {
	Name: 'WL_READING_SB_READING',
	SkillName: '阅读魔法书',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.PR_SANCTUARY] = {
	Name: 'PR_SANCTUARY',
	SkillName: '圣域',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_HEAL, 1]]
};
SkillInfo[SK.RA_CLUSTERBOMB] = {
	Name: 'RA_CLUSTERBOMB',
	SkillName: '炸弹集束',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 3]]
};
SkillInfo[SK.RA_WUGSTRIKE] = {
	Name: 'RA_WUGSTRIKE',
	SkillName: '狼突击',
	MaxLv: 5,
	SpAmount: [20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_TOOTHOFWUG, 1]]
};
SkillInfo[SK.RA_CAMOUFLAGE] = {
	Name: 'RA_CAMOUFLAGE',
	SkillName: '伪装',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_RANGERMAIN, 1]]
};
SkillInfo[SK.RA_MAIZETRAP] = {
	Name: 'RA_MAIZETRAP',
	SkillName: '迷宫陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.NC_MADOLICENCE] = {
	Name: 'NC_MADOLICENCE',
	SkillName: '机甲许可',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NC_FLAMELAUNCHER] = {
	Name: 'NC_FLAMELAUNCHER',
	SkillName: '火焰发射器',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: true,
	AttackRange: [5, 5, 5],
	_NeedSkillList: [[SK.NC_VULCANARM, 1]]
};
SkillInfo[SK.NC_HOVERING] = {
	Name: 'NC_HOVERING',
	SkillName: '悬浮',
	MaxLv: 1,
	SpAmount: [25],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_ACCELERATION, 1]]
};
SkillInfo[SK.PR_SLOWPOISON] = {
	Name: 'PR_SLOWPOISON',
	SkillName: '缓毒',
	MaxLv: 4,
	SpAmount: [6, 8, 10, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9]
};
SkillInfo[SK.NC_ANALYZE] = {
	Name: 'NC_ANALYZE',
	SkillName: '分析',
	MaxLv: 3,
	SpAmount: [30, 30, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.NC_INFRAREDSCAN, 1]]
};
SkillInfo[SK.NC_REPAIR] = {
	Name: 'NC_REPAIR',
	SkillName: '修理',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 2]]
};
SkillInfo[SK.NC_POWERSWING] = {
	Name: 'NC_POWERSWING',
	SkillName: '强力挥击',
	MaxLv: 10,
	SpAmount: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_AXEBOOMERANG, 3]]
};
SkillInfo[SK.NC_DISJOINT] = {
	Name: 'NC_DISJOINT',
	SkillName: '卸除 FAW',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.NC_SILVERSNIPER, 1]]
};
SkillInfo[SK.SC_SHADOWFORM] = {
	Name: 'SC_SHADOWFORM',
	SkillName: '暗影阵型',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.RG_TUNNELDRIVE, 3]]
};
SkillInfo[SK.SC_DEADLYINFECT] = {
	Name: 'SC_DEADLYINFECT',
	SkillName: '致命感染',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_SHADOWFORM, 3],
		[SK.SC_AUTOSHADOWSPELL, 5]
	]
};
SkillInfo[SK.SC_LAZINESS] = {
	Name: 'SC_LAZINESS',
	SkillName: '假面舞会-懒惰',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_ENERVATION, 1],
		[SK.SC_GROOMY, 1],
		[SK.SC_IGNORANCE, 1]
	]
};
SkillInfo[SK.PR_STRECOVERY] = {
	Name: 'PR_STRECOVERY',
	SkillName: '状态恢复',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SC_BLOODYLUST] = {
	Name: 'SC_BLOODYLUST',
	SkillName: '血腥欲望',
	MaxLv: 3,
	SpAmount: [60, 70, 80],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_DIMENSIONDOOR, 3]]
};
SkillInfo[SK.LG_CANNONSPEAR] = {
	Name: 'LG_CANNONSPEAR',
	SkillName: '加农矛',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.LG_PINPOINTATTACK, 1]]
};
SkillInfo[SK.LG_REFLECTDAMAGE] = {
	Name: 'LG_REFLECTDAMAGE',
	SkillName: '伤害反射',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_REFLECTSHIELD, 5]]
};
SkillInfo[SK.LG_SHIELDSPELL] = {
	Name: 'LG_SHIELDSPELL',
	SkillName: '盾牌法术',
	MaxLv: 3,
	SpAmount: [50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.LG_SHIELDPRESS, 3],
		[SK.LG_EARTHDRIVE, 2]
	]
};
SkillInfo[SK.LG_BANDING] = {
	Name: 'LG_BANDING',
	SkillName: '联结',
	MaxLv: 5,
	SpAmount: [30, 36, 42, 48, 54],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_PINPOINTATTACK, 3],
		[SK.LG_RAGEBURST, 1]
	]
};
SkillInfo[SK.LG_EARTHDRIVE] = {
	Name: 'LG_EARTHDRIVE',
	SkillName: '大地驱动',
	MaxLv: 5,
	SpAmount: [52, 60, 68, 76, 84],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_REFLECTDAMAGE, 3]]
};
SkillInfo[SK.SR_SKYNETBLOW] = {
	Name: 'SR_SKYNETBLOW',
	SkillName: '天空之击',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.PR_KYRIE] = {
	Name: 'PR_KYRIE',
	SkillName: '基里艾利斯',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 25, 25, 25, 30, 30, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_ANGELUS, 2]]
};
SkillInfo[SK.SR_LIGHTNINGWALK] = {
	Name: 'SR_LIGHTNINGWALK',
	SkillName: '雷光步',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_WINDMILL, 1]]
};
SkillInfo[SK.SR_GATEOFHELL] = {
	Name: 'SR_GATEOFHELL',
	SkillName: '地狱之门',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SR_TIGERCANNON, 5],
		[SK.SR_RAMPAGEBLASTER, 1]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_CHANGE] = {
	Name: 'SR_GENTLETOUCH_CHANGE',
	SkillName: '温柔触碰-转换',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SR_GENTLETOUCH_QUIET, 1],
		[SK.SR_GENTLETOUCH_CURE, 1],
		[SK.SR_GENTLETOUCH_ENERGYGAIN, 3]
	]
};
SkillInfo[SK.WA_SYMPHONY_OF_LOVER] = {
	Name: 'WA_SYMPHONY_OF_LOVER',
	SkillName: '恋人交响曲',
	MaxLv: 5,
	SpAmount: [60, 69, 78, 87, 96],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.PR_MAGNIFICAT] = {
	Name: 'PR_MAGNIFICAT',
	SkillName: '圣母之颂歌',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MI_HARMONIZE] = {
	Name: 'MI_HARMONIZE',
	SkillName: '和谐',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.PR_GLORIA] = {
	Name: 'PR_GLORIA',
	SkillName: '荣耀之歌',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_KYRIE, 4],
		[SK.PR_MAGNIFICAT, 3]
	],
	NeedSkillList: { [JobId.SUPERNOVICE2]: [[SK.PR_SANCTUARY, 7]] }
};
SkillInfo[SK.WM_POEMOFNETHERWORLD] = {
	Name: 'WM_POEMOFNETHERWORLD',
	SkillName: '绝望之歌',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.WM_SIRCLEOFNATURE] = {
	Name: 'WM_SIRCLEOFNATURE',
	SkillName: '自然之环',
	MaxLv: 5,
	SpAmount: [42, 46, 50, 54, 58],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.PR_LEXDIVINA] = {
	Name: 'PR_LEXDIVINA',
	SkillName: '沉默术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.AL_RUWACH, 1]]
};
SkillInfo[SK.WM_LERADS_DEW] = {
	Name: 'WM_LERADS_DEW',
	SkillName: '莱拉的露水',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SO_FIREWALK] = {
	Name: 'SO_FIREWALK',
	SkillName: '火焰行走',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_VOLCANO, 1]]
};
SkillInfo[SK.SO_DIAMONDDUST] = {
	Name: 'SO_DIAMONDDUST',
	SkillName: '钻石星尘',
	MaxLv: 5,
	SpAmount: [50, 56, 62, 68, 74],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_DELUGE, 3]]
};
SkillInfo[SK.SO_STRIKING] = {
	Name: 'SO_STRIKING',
	SkillName: '打击',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_FLAMELAUNCHER, 1],
		[SK.SA_FROSTWEAPON, 1],
		[SK.SA_LIGHTNINGLOADER, 1],
		[SK.SA_SEISMICWEAPON, 1]
	]
};
SkillInfo[SK.SO_ARRULLO] = {
	Name: 'SO_ARRULLO',
	SkillName: '安抚',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 9],
	_NeedSkillList: [[SK.SO_WARMER, 2]]
};
SkillInfo[SK.PR_TURNUNDEAD] = {
	Name: 'PR_TURNUNDEAD',
	SkillName: '转生术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.ALL_RESURRECTION, 1],
		[SK.PR_LEXDIVINA, 3]
	]
};
SkillInfo[SK.SO_EL_SYMPATHY] = {
	Name: 'SO_EL_SYMPATHY',
	SkillName: '灵魂共鸣',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.SO_WIND_INSIGNIA] = {
	Name: 'SO_WIND_INSIGNIA',
	SkillName: '风之徽章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_VENTUS, 3]]
};
SkillInfo[SK.GN_REMODELING_CART] = {
	Name: 'GN_REMODELING_CART',
	SkillName: '手推车改造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GN_THORNS_TRAP] = {
	Name: 'GN_THORNS_TRAP',
	SkillName: '荆棘陷阱',
	MaxLv: 5,
	SpAmount: [22, 26, 30, 34, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 2]]
};
SkillInfo[SK.GN_CRAZYWEED] = {
	Name: 'GN_CRAZYWEED',
	SkillName: '疯狂藤蔓',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_WALLOFTHORN, 3]]
};
SkillInfo[SK.PR_LEXAETERNA] = {
	Name: 'PR_LEXAETERNA',
	SkillName: '永恒沉默',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.PR_LEXDIVINA, 5]]
};
SkillInfo[SK.GN_MIX_COOKING] = {
	Name: 'GN_MIX_COOKING',
	SkillName: '混合料理',
	MaxLv: 2,
	SpAmount: [5, 40],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 1]]
};
SkillInfo[SK.GD_EXTENSION] = {
	Name: 'GD_EXTENSION',
	SkillName: '公会扩展',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AB_SECRAMENT] = {
	Name: 'AB_SECRAMENT',
	SkillName: '圣礼',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.PR_MAGNUS] = {
	Name: 'PR_MAGNUS',
	SkillName: '弥撒驱魔',
	MaxLv: 10,
	SpAmount: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SAFETYWALL, 1],
		[SK.PR_LEXAETERNA, 1],
		[SK.PR_TURNUNDEAD, 3]
	]
};
SkillInfo[SK.ALL_BUYING_STORE] = {
	Name: 'ALL_BUYING_STORE',
	SkillName: '开设收购商店',
	MaxLv: 2,
	SpAmount: [30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1]
};
SkillInfo[SK.SM_BASH] = {
	Name: 'SM_BASH',
	SkillName: '狂击',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WZ_FIREPILLAR] = {
	Name: 'WZ_FIREPILLAR',
	SkillName: '火柱',
	MaxLv: 10,
	SpAmount: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_FIREWALL, 1]]
};
SkillInfo[SK.MA_REMOVETRAP] = {
	Name: 'MA_REMOVETRAP',
	SkillName: '解除陷阱',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.MER_RECUPERATE] = {
	Name: 'MER_RECUPERATE',
	SkillName: '恢复',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.WZ_SIGHTRASHER] = {
	Name: 'WZ_SIGHTRASHER',
	SkillName: '火狩冲击',
	MaxLv: 10,
	SpAmount: [35, 37, 39, 41, 43, 45, 47, 49, 51, 53],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SIGHT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.EL_WATER_DROP] = {
	Name: 'EL_WATER_DROP',
	SkillName: '水滴',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WZ_FIREIVY] = {
	Name: 'WZ_FIREIVY',
	SkillName: '火焰常春藤',
	MaxLv: 0,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: []
};
SkillInfo[SK.EL_TYPOON_MIS] = {
	Name: 'EL_TYPOON_MIS',
	SkillName: '台风迷雾',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.WZ_METEOR] = {
	Name: 'WZ_METEOR',
	SkillName: '陨石术',
	MaxLv: 10,
	SpAmount: [20, 24, 30, 34, 40, 44, 50, 54, 60, 64],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_THUNDERSTORM, 1],
		[SK.WZ_SIGHTRASHER, 2]
	]
};
SkillInfo[SK.WZ_JUPITEL] = {
	Name: 'WZ_JUPITEL',
	SkillName: '雷鸣术',
	MaxLv: 10,
	SpAmount: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_NAPALMBEAT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.WZ_VERMILION] = {
	Name: 'WZ_VERMILION',
	SkillName: '怒雷强击',
	MaxLv: 10,
	SpAmount: [60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_THUNDERSTORM, 1],
		[SK.WZ_JUPITEL, 5]
	]
};
SkillInfo[SK.WZ_WATERBALL] = {
	Name: 'WZ_WATERBALL',
	SkillName: '水球术',
	MaxLv: 5,
	SpAmount: [15, 20, 20, 25, 25],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_COLDBOLT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.WZ_ICEWALL] = {
	Name: 'WZ_ICEWALL',
	SkillName: '冰墙术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_STONECURSE, 1],
		[SK.MG_FROSTDIVER, 1]
	]
};
SkillInfo[SK.WZ_FROSTNOVA] = {
	Name: 'WZ_FROSTNOVA',
	SkillName: '霜冻新星',
	MaxLv: 10,
	SpAmount: [45, 43, 41, 39, 37, 35, 33, 31, 29, 27],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_ICEWALL, 1]]
};
SkillInfo[SK.WZ_STORMGUST] = {
	Name: 'WZ_STORMGUST',
	SkillName: '暴风雪',
	MaxLv: 10,
	SpAmount: [78, 78, 78, 78, 78, 78, 78, 78, 78, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_FROSTDIVER, 1],
		[SK.WZ_JUPITEL, 3]
	]
};
SkillInfo[SK.WZ_EARTHSPIKE] = {
	Name: 'WZ_EARTHSPIKE',
	SkillName: '地震术',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_STONECURSE, 1]],
	NeedSkillList: { [JobId.SAGE]: [[SK.SA_SEISMICWEAPON, 1]] }
};
SkillInfo[SK.WZ_HEAVENDRIVE] = {
	Name: 'WZ_HEAVENDRIVE',
	SkillName: '崩裂术',
	MaxLv: 5,
	SpAmount: [28, 32, 36, 40, 44],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_EARTHSPIKE, 3]],
	NeedSkillList: { [JobId.SAGE]: [[SK.WZ_EARTHSPIKE, 1]] }
};
SkillInfo[SK.WZ_QUAGMIRE] = {
	Name: 'WZ_QUAGMIRE',
	SkillName: '泥沼术',
	MaxLv: 5,
	SpAmount: [5, 10, 15, 20, 25],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 1]]
};
SkillInfo[SK.WZ_ESTIMATION] = {
	Name: 'WZ_ESTIMATION',
	SkillName: '洞察',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.HLIF_BRAIN] = {
	Name: 'HLIF_BRAIN',
	SkillName: '脑部手术',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_SPEED] = {
	Name: 'HFLI_SPEED',
	SkillName: '加速飞行',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_NEEDLE_OF_PARALYZE] = {
	Name: 'MH_NEEDLE_OF_PARALYZE',
	SkillName: '麻痹之针',
	MaxLv: 10,
	SpAmount: [42, 48, 54, 60, 66, 72, 78, 84, 90, 96],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_STYLE_CHANGE] = {
	Name: 'MH_STYLE_CHANGE',
	SkillName: '风格变换',
	MaxLv: 1,
	SpAmount: [35],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_ANGRIFFS_MODUS] = {
	Name: 'MH_ANGRIFFS_MODUS',
	SkillName: '攻击模式',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_VOLCANIC_ASH] = {
	Name: 'MH_VOLCANIC_ASH',
	SkillName: '火山灰',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7]
};
SkillInfo[SK.BS_IRON] = {
	Name: 'BS_IRON',
	SkillName: '铁之锻造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GLORYGUILD] = {
	Name: 'GD_GLORYGUILD',
	SkillName: '公会荣耀',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.BS_STEEL] = {
	Name: 'BS_STEEL',
	SkillName: '钢之锻造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_IRON, 1]]
};
SkillInfo[SK.SM_PROVOKE] = {
	Name: 'SM_PROVOKE',
	SkillName: '挑衅',
	MaxLv: 10,
	SpAmount: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BS_ENCHANTEDSTONE] = {
	Name: 'BS_ENCHANTEDSTONE',
	SkillName: '魔力石制作',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_IRON, 1]]
};
SkillInfo[SK.MA_CHARGEARROW] = {
	Name: 'MA_CHARGEARROW',
	SkillName: '箭矢击退',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MER_MENTALCURE] = {
	Name: 'MER_MENTALCURE',
	SkillName: '精神治愈',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_ORIDEOCON] = {
	Name: 'BS_ORIDEOCON',
	SkillName: '奥利德原矿研究',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_ENCHANTEDSTONE, 1]]
};
SkillInfo[SK.EL_WATER_BARRIER] = {
	Name: 'EL_WATER_BARRIER',
	SkillName: '水之屏障',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_DAGGER] = {
	Name: 'BS_DAGGER',
	SkillName: '短剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.EL_TYPOON_MIS_ATK] = {
	Name: 'EL_TYPOON_MIS_ATK',
	SkillName: '台风迷雾攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.BS_SWORD] = {
	Name: 'BS_SWORD',
	SkillName: '长剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 1]]
};
SkillInfo[SK.BS_TWOHANDSWORD] = {
	Name: 'BS_TWOHANDSWORD',
	SkillName: '双手剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_SWORD, 1]]
};
SkillInfo[SK.BS_AXE] = {
	Name: 'BS_AXE',
	SkillName: '斧头制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_SWORD, 2]]
};
SkillInfo[SK.BS_MACE] = {
	Name: 'BS_MACE',
	SkillName: '钝器制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_KNUCKLE, 1]]
};
SkillInfo[SK.BS_KNUCKLE] = {
	Name: 'BS_KNUCKLE',
	SkillName: '拳套制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 1]]
};
SkillInfo[SK.BS_SPEAR] = {
	Name: 'BS_SPEAR',
	SkillName: '长矛制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 2]]
};
SkillInfo[SK.BS_HILTBINDING] = {
	Name: 'BS_HILTBINDING',
	SkillName: '剑柄束缚',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_FINDINGORE] = {
	Name: 'BS_FINDINGORE',
	SkillName: '矿石发现',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.BS_HILTBINDING, 1],
		[SK.BS_STEEL, 1]
	]
};
SkillInfo[SK.BS_WEAPONRESEARCH] = {
	Name: 'BS_WEAPONRESEARCH',
	SkillName: '武器研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_HILTBINDING, 1]]
};
SkillInfo[SK.BS_REPAIRWEAPON] = {
	Name: 'BS_REPAIRWEAPON',
	SkillName: '修理武器',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.BS_WEAPONRESEARCH, 1]]
};
SkillInfo[SK.BS_SKINTEMPER] = {
	Name: 'BS_SKINTEMPER',
	SkillName: '皮肤淬炼',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.BS_HAMMERFALL] = {
	Name: 'BS_HAMMERFALL',
	SkillName: '锤击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_LEADERSHIP] = {
	Name: 'GD_LEADERSHIP',
	SkillName: '公会领导力',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.BS_ADRENALINE] = {
	Name: 'BS_ADRENALINE',
	SkillName: '速度激发',
	MaxLv: 5,
	SpAmount: [20, 23, 26, 29, 32],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_HAMMERFALL, 2]]
};
SkillInfo[SK.SM_MAGNUM] = {
	Name: 'SM_MAGNUM',
	SkillName: '怒爆',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_BASH, 5]]
};
SkillInfo[SK.BS_WEAPONPERFECT] = {
	Name: 'BS_WEAPONPERFECT',
	SkillName: '武器修炼',
	MaxLv: 5,
	SpAmount: [18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_WEAPONRESEARCH, 2],
		[SK.BS_ADRENALINE, 2]
	]
};
SkillInfo[SK.MA_SHARPSHOOTING] = {
	Name: 'MA_SHARPSHOOTING',
	SkillName: '集中箭矢攻击',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_COMPRESS] = {
	Name: 'MER_COMPRESS',
	SkillName: '压缩',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_OVERTHRUST] = {
	Name: 'BS_OVERTHRUST',
	SkillName: '强力击',
	MaxLv: 5,
	SpAmount: [18, 16, 14, 12, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_ADRENALINE, 3]]
};
SkillInfo[SK.EL_WIND_STEP] = {
	Name: 'EL_WIND_STEP',
	SkillName: '风之步',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_MAXIMIZE] = {
	Name: 'BS_MAXIMIZE',
	SkillName: '最大强度',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_WEAPONPERFECT, 3],
		[SK.BS_OVERTHRUST, 2]
	]
};
SkillInfo[SK.EL_STONE_HAMMER] = {
	Name: 'EL_STONE_HAMMER',
	SkillName: '石锤',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [5]
};
SkillInfo[SK.HT_SKIDTRAP] = {
	Name: 'HT_SKIDTRAP',
	SkillName: '滑动陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.HT_LANDMINE] = {
	Name: 'HT_LANDMINE',
	SkillName: '地雷',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.HT_ANKLESNARE] = {
	Name: 'HT_ANKLESNARE',
	SkillName: '夹腿陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SKIDTRAP, 1]]
};
SkillInfo[SK.HT_SHOCKWAVE] = {
	Name: 'HT_SHOCKWAVE',
	SkillName: '冲击波陷阱',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_ANKLESNARE, 1]]
};
SkillInfo[SK.HT_SANDMAN] = {
	Name: 'HT_SANDMAN',
	SkillName: '睡魔',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_FLASHER, 1]]
};
SkillInfo[SK.HT_FLASHER] = {
	Name: 'HT_FLASHER',
	SkillName: '闪光陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SKIDTRAP, 1]]
};
SkillInfo[SK.HT_FREEZINGTRAP] = {
	Name: 'HT_FREEZINGTRAP',
	SkillName: '冰冻陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_FLASHER, 1]]
};
SkillInfo[SK.HT_BLASTMINE] = {
	Name: 'HT_BLASTMINE',
	SkillName: '爆炸陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.HT_LANDMINE, 1],
		[SK.HT_SANDMAN, 1],
		[SK.HT_FREEZINGTRAP, 1]
	]
};
SkillInfo[SK.HT_CLAYMORETRAP] = {
	Name: 'HT_CLAYMORETRAP',
	SkillName: '阔剑地雷',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.HT_SHOCKWAVE, 1],
		[SK.HT_BLASTMINE, 1]
	]
};
SkillInfo[SK.HT_REMOVETRAP] = {
	Name: 'HT_REMOVETRAP',
	SkillName: '移除陷阱',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.HT_LANDMINE, 1]],
	NeedSkillList: { [JobId.ROGUE]: [[SK.AC_DOUBLE, 5]] }
};
SkillInfo[SK.HT_TALKIEBOX] = {
	Name: 'HT_TALKIEBOX',
	SkillName: '会说话的箱子',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [
		[SK.HT_REMOVETRAP, 1],
		[SK.HT_SHOCKWAVE, 1]
	]
};
SkillInfo[SK.RK_SONICWAVE] = {
	Name: 'RK_SONICWAVE',
	SkillName: '音速冲击波',
	MaxLv: 10,
	SpAmount: [33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
	_NeedSkillList: [[SK.RK_ENCHANTBLADE, 3]]
};
SkillInfo[SK.RK_HUNDREDSPEAR] = {
	Name: 'RK_HUNDREDSPEAR',
	SkillName: '百矛刺击',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.RK_PHANTOMTHRUST, 3]]
};
SkillInfo[SK.RK_IGNITIONBREAK] = {
	Name: 'RK_IGNITIONBREAK',
	SkillName: '爆燃斩',
	MaxLv: 5,
	SpAmount: [35, 40, 45, 50, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RK_DEATHBOUND, 5],
		[SK.RK_SONICWAVE, 2],
		[SK.RK_WINDCUTTER, 3]
	]
};
SkillInfo[SK.RK_DRAGONBREATH] = {
	Name: 'RK_DRAGONBREATH',
	SkillName: '龙之吐息',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.RK_RUNEMASTERY] = {
	Name: 'RK_RUNEMASTERY',
	SkillName: '卢恩精通',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_CRUSHSTRIKE] = {
	Name: 'RK_CRUSHSTRIKE',
	SkillName: '粉碎打击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HT_BEASTBANE] = {
	Name: 'HT_BEASTBANE',
	SkillName: '野兽克星',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_VITALITYACTIVATION] = {
	Name: 'RK_VITALITYACTIVATION',
	SkillName: '活力激活',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RK_FIGHTINGSPIRIT] = {
	Name: 'RK_FIGHTINGSPIRIT',
	SkillName: '决心',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RK_PHANTOMTHRUST] = {
	Name: 'RK_PHANTOMTHRUST',
	SkillName: '幻影突刺',
	MaxLv: 5,
	SpAmount: [15, 18, 21, 24, 27],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.KN_BRANDISHSPEAR, 2]]
};
SkillInfo[SK.GC_CROSSIMPACT] = {
	Name: 'GC_CROSSIMPACT',
	SkillName: '十字冲击',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.AS_SONICBLOW, 10]]
};
SkillInfo[SK.GC_RESEARCHNEWPOISON] = {
	Name: 'GC_RESEARCHNEWPOISON',
	SkillName: '新毒药研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GC_ANTIDOTE] = {
	Name: 'GC_ANTIDOTE',
	SkillName: '解毒剂',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.GC_RESEARCHNEWPOISON, 5]]
};
SkillInfo[SK.GC_WEAPONBLOCKING] = {
	Name: 'GC_WEAPONBLOCKING',
	SkillName: '武器格挡',
	MaxLv: 5,
	SpAmount: [40, 36, 32, 28, 24],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_LEFT, 5]]
};
SkillInfo[SK.HT_FALCON] = {
	Name: 'HT_FALCON',
	SkillName: '猎鹰精通',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.HT_BEASTBANE, 1]]
};
SkillInfo[SK.GC_POISONSMOKE] = {
	Name: 'GC_POISONSMOKE',
	SkillName: '毒烟',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.GC_POISONINGWEAPON, 5],
		[SK.GC_VENOMPRESSURE, 5]
	]
};
SkillInfo[SK.GC_PHANTOMMENACE] = {
	Name: 'GC_PHANTOMMENACE',
	SkillName: 'Phantom Menace',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.GC_CLOAKINGEXCEED, 5],
		[SK.GC_DARKILLUSION, 5]
	]
};
SkillInfo[SK.GC_ROLLINGCUTTER] = {
	Name: 'GC_ROLLINGCUTTER',
	SkillName: 'Rolling Cutter',
	MaxLv: 5,
	SpAmount: [5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_SONICBLOW, 10]]
};
SkillInfo[SK.AB_JUDEX] = {
	Name: 'AB_JUDEX',
	SkillName: 'Judex',
	MaxLv: 10,
	SpAmount: [20, 23, 26, 29, 32, 34, 36, 38, 40, 42],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_TURNUNDEAD, 1]]
};
SkillInfo[SK.AB_ADORAMUS] = {
	Name: 'AB_ADORAMUS',
	SkillName: 'Adoramus',
	MaxLv: 10,
	SpAmount: [32, 40, 48, 56, 64, 72, 80, 88, 96, 104],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_JUDEX, 5],
		[SK.AB_ANCILLA, 1],
		[SK.PR_MAGNUS, 1]
	]
};
SkillInfo[SK.AB_CANTO] = {
	Name: 'AB_CANTO',
	SkillName: 'Cantocandidus',
	MaxLv: 3,
	SpAmount: [200, 220, 240],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_INCAGI, 1]]
};
SkillInfo[SK.SM_ENDURE] = {
	Name: 'SM_ENDURE',
	SkillName: 'Endure',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_PROVOKE, 5]]
};
SkillInfo[SK.HT_STEELCROW] = {
	Name: 'HT_STEELCROW',
	SkillName: 'Steel Crow',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.HT_BLITZBEAT, 5]]
};
SkillInfo[SK.AB_LAUDARAMUS] = {
	Name: 'AB_LAUDARAMUS',
	SkillName: 'Lauda Ramus',
	MaxLv: 4,
	SpAmount: [50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_LAUDAAGNUS, 2]]
};
SkillInfo[SK.AB_CLEARANCE] = {
	Name: 'AB_CLEARANCE',
	SkillName: 'Clearance',
	MaxLv: 5,
	SpAmount: [54, 60, 66, 72, 78],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_LAUDARAMUS, 2]]
};
SkillInfo[SK.AB_DUPLELIGHT] = {
	Name: 'AB_DUPLELIGHT',
	SkillName: 'Duple Light',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_ASPERSIO, 1]]
};
SkillInfo[SK.AB_DUPLELIGHT_MAGIC] = {
	Name: 'AB_DUPLELIGHT_MAGIC',
	SkillName: 'Duple Magic',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11]
};
SkillInfo[SK.HT_BLITZBEAT] = {
	Name: 'HT_BLITZBEAT',
	SkillName: 'Blitz Beat',
	MaxLv: 5,
	SpAmount: [10, 13, 16, 19, 22],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.HT_FALCON, 1]]
};
SkillInfo[SK.HT_DETECTING] = {
	Name: 'HT_DETECTING',
	SkillName: 'Detect',
	MaxLv: 4,
	SpAmount: [8, 8, 8, 8],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9],
	_NeedSkillList: [
		[SK.AC_CONCENTRATION, 1],
		[SK.HT_FALCON, 1]
	]
};
SkillInfo[SK.HT_SPRINGTRAP] = {
	Name: 'HT_SPRINGTRAP',
	SkillName: 'Spring Trap',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [4, 5, 6, 7, 8],
	_NeedSkillList: [[SK.HT_FALCON], [SK.HT_REMOVETRAP, 1]]
};
SkillInfo[SK.EL_WIND_CURTAIN] = {
	Name: 'EL_WIND_CURTAIN',
	SkillName: 'Wind Curtain',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_RIGHT] = {
	Name: 'AS_RIGHT',
	SkillName: 'Righthand Mastery',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_ROCK_CRUSHER] = {
	Name: 'EL_ROCK_CRUSHER',
	SkillName: 'Rock Crusher',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [3]
};
SkillInfo[SK.AS_LEFT] = {
	Name: 'AS_LEFT',
	SkillName: 'Lefthand Mastery',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_RIGHT, 2]]
};
SkillInfo[SK.AS_KATAR] = {
	Name: 'AS_KATAR',
	SkillName: 'Katar Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AS_CLOAKING] = {
	Name: 'AS_CLOAKING',
	SkillName: 'Cloaking',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_HIDING, 2]]
};
SkillInfo[SK.AS_SONICBLOW] = {
	Name: 'AS_SONICBLOW',
	SkillName: 'Sonic Blow',
	MaxLv: 10,
	SpAmount: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_KATAR, 4]]
};
SkillInfo[SK.AS_GRIMTOOTH] = {
	Name: 'AS_GRIMTOOTH',
	SkillName: 'Grimtooth',
	MaxLv: 5,
	SpAmount: [3, 3, 3, 3, 3],
	bSeperateLv: false,
	AttackRange: [2, 3, 4, 5, 6],
	_NeedSkillList: [
		[SK.AS_CLOAKING, 2],
		[SK.AS_SONICBLOW, 5]
	]
};
SkillInfo[SK.AS_ENCHANTPOISON] = {
	Name: 'AS_ENCHANTPOISON',
	SkillName: 'Enchant Poison',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_POISON, 1]]
};
SkillInfo[SK.WL_RADIUS] = {
	Name: 'WL_RADIUS',
	SkillName: 'Radius',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.WL_HELLINFERNO] = {
	Name: 'WL_HELLINFERNO',
	SkillName: 'Hell Inferno',
	MaxLv: 5,
	SpAmount: [64, 70, 76, 82, 88],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_CRIMSONROCK, 2]]
};
SkillInfo[SK.WL_EARTHSTRAIN] = {
	Name: 'WL_EARTHSTRAIN',
	SkillName: 'Earth Strain',
	MaxLv: 5,
	SpAmount: [70, 78, 86, 94, 102],
	bSeperateLv: true,
	AttackRange: [6, 6, 6, 6, 6],
	_NeedSkillList: [[SK.WL_SIENNAEXECRATE, 2]]
};
SkillInfo[SK.AS_POISONREACT] = {
	Name: 'AS_POISONREACT',
	SkillName: 'Poison React',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 45, 45],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 3]]
};
SkillInfo[SK.WL_SUMMONWB] = {
	Name: 'WL_SUMMONWB',
	SkillName: 'Summon Water Ball',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_STORMGUST, 1]]
};
SkillInfo[SK.WL_FREEZE_SP] = {
	Name: 'WL_FREEZE_SP',
	SkillName: 'Freezing Spell',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AS_VENOMDUST] = {
	Name: 'AS_VENOMDUST',
	SkillName: 'Venom Dust',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 5]]
};
SkillInfo[SK.RA_WUGMASTERY] = {
	Name: 'RA_WUGMASTERY',
	SkillName: 'Warg Mastery',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RA_WUGBITE] = {
	Name: 'RA_WUGBITE',
	SkillName: 'Warg Bite',
	MaxLv: 5,
	SpAmount: [40, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_WUGSTRIKE, 1]]
};
SkillInfo[SK.RA_RESEARCHTRAP] = {
	Name: 'RA_RESEARCHTRAP',
	SkillName: 'Trap Research',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.HT_CLAYMORETRAP, 1],
		[SK.HT_REMOVETRAP, 1]
	]
};
SkillInfo[SK.AS_SPLASHER] = {
	Name: 'AS_SPLASHER',
	SkillName: 'Venom Splasher',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AS_VENOMDUST, 5],
		[SK.AS_POISONREACT, 5]
	]
};
SkillInfo[SK.NC_BOOSTKNUCKLE] = {
	Name: 'NC_BOOSTKNUCKLE',
	SkillName: 'Knuckle Boost',
	MaxLv: 5,
	SpAmount: [5, 10, 15, 20, 25],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 1]]
};
SkillInfo[SK.NC_COLDSLOWER] = {
	Name: 'NC_COLDSLOWER',
	SkillName: 'Ice Launcher',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.NC_VULCANARM, 3]]
};
SkillInfo[SK.NC_F_SIDESLIDE] = {
	Name: 'NC_F_SIDESLIDE',
	SkillName: 'Front Slide',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_HOVERING, 1]]
};
SkillInfo[SK.NV_FIRSTAID] = {
	Name: 'NV_FIRSTAID',
	SkillName: 'First Aid',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [3],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NC_MAGNETICFIELD] = {
	Name: 'NC_MAGNETICFIELD',
	SkillName: 'Magnetic Field',
	MaxLv: 3,
	SpAmount: [60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_EMERGENCYCOOL, 1]]
};
SkillInfo[SK.NC_TRAININGAXE] = {
	Name: 'NC_TRAININGAXE',
	SkillName: 'Axe Mastery ',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NC_AXETORNADO] = {
	Name: 'NC_AXETORNADO',
	SkillName: 'Axe Tornado ',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_TRAININGAXE, 1]]
};
SkillInfo[SK.NV_TRICKDEAD] = {
	Name: 'NV_TRICKDEAD',
	SkillName: 'Play Dead',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SC_TRIANGLESHOT] = {
	Name: 'SC_TRIANGLESHOT',
	SkillName: 'Triangle Shot',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 9, 9, 9, 9, 11, 11, 11],
	_NeedSkillList: [[SK.AC_DOUBLE, 7]]
};
SkillInfo[SK.SC_ENERVATION] = {
	Name: 'SC_ENERVATION',
	SkillName: 'Masquerade-Enervation',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.MG_SRECOVERY] = {
	Name: 'MG_SRECOVERY',
	SkillName: 'Increase SP Recovery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SM_MOVINGRECOVERY] = {
	Name: 'SM_MOVINGRECOVERY',
	SkillName: 'HP Recovery While Moving',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SC_FEINTBOMB] = {
	Name: 'SC_FEINTBOMB',
	SkillName: 'Feint Bomb',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_DIMENSIONDOOR, 3]]
};
SkillInfo[SK.LG_BANISHINGPOINT] = {
	Name: 'LG_BANISHINGPOINT',
	SkillName: 'Vanishing Point',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 25, 25, 25, 25, 25],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.LG_PINPOINTATTACK] = {
	Name: 'LG_PINPOINTATTACK',
	SkillName: 'Pinpoint Attack',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.LG_BANISHINGPOINT, 5]]
};
SkillInfo[SK.SM_FATALBLOW] = {
	Name: 'SM_FATALBLOW',
	SkillName: 'Fatal Blow',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.LG_MOONSLASHER] = {
	Name: 'LG_MOONSLASHER',
	SkillName: 'Moonslasher',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.LG_HESPERUSLIT] = {
	Name: 'LG_HESPERUSLIT',
	SkillName: 'Hesperus Lit',
	MaxLv: 5,
	SpAmount: [37, 44, 51, 58, 65],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.LG_PRESTIGE, 3],
		[SK.LG_BANDING, 3]
	]
};
SkillInfo[SK.SR_EARTHSHAKER] = {
	Name: 'SR_EARTHSHAKER',
	SkillName: 'Earth Shaker',
	MaxLv: 5,
	SpAmount: [36, 40, 44, 48, 52],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.SM_AUTOBERSERK] = {
	Name: 'SM_AUTOBERSERK',
	SkillName: '狂暴',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SR_KNUCKLEARROW] = {
	Name: 'SR_KNUCKLEARROW',
	SkillName: '拳箭',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: false,
	AttackRange: [7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
	_NeedSkillList: [[SK.SR_LIGHTNINGWALK, 1]]
};
SkillInfo[SK.SR_ASSIMILATEPOWER] = {
	Name: 'SR_ASSIMILATEPOWER',
	SkillName: '力量吸收',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.MO_ABSORBSPIRITS, 1],
		[SK.SR_POWERVELOCITY, 1]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_QUIET] = {
	Name: 'SR_GENTLETOUCH_QUIET',
	SkillName: '温柔触碰-沉默',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: []
};
SkillInfo[SK.AC_MAKINGARROW] = {
	Name: 'AC_MAKINGARROW',
	SkillName: '制作箭矢',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WA_MOONLIT_SERENADE] = {
	Name: 'WA_MOONLIT_SERENADE',
	SkillName: '月光小夜曲',
	MaxLv: 5,
	SpAmount: [84, 96, 108, 120, 134],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.AC_CHARGEARROW] = {
	Name: 'AC_CHARGEARROW',
	SkillName: '箭矢击退',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.TF_SPRINKLESAND] = {
	Name: 'TF_SPRINKLESAND',
	SkillName: '沙尘攻击',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [9],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_BACKSLIDING] = {
	Name: 'TF_BACKSLIDING',
	SkillName: '后滑步',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [7],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_PICKSTONE] = {
	Name: 'TF_PICKSTONE',
	SkillName: '寻找石头',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WM_VOICEOFSIREN] = {
	Name: 'WM_VOICEOFSIREN',
	SkillName: '海妖之声',
	MaxLv: 5,
	SpAmount: [48, 56, 64, 72, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_POEMOFNETHERWORLD, 3]]
};
SkillInfo[SK.WM_RANDOMIZESPELL] = {
	Name: 'WM_RANDOMIZESPELL',
	SkillName: '即兴曲',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_POEMOFNETHERWORLD, 1]]
};
SkillInfo[SK.TF_THROWSTONE] = {
	Name: 'TF_THROWSTONE',
	SkillName: '投石',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.WM_MELODYOFSINK] = {
	Name: 'WM_MELODYOFSINK',
	SkillName: '沉降旋律',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_SONG_OF_MANA, 1]]
};
SkillInfo[SK.MC_CARTREVOLUTION] = {
	Name: 'MC_CARTREVOLUTION',
	SkillName: '手推车革命',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [12],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_POISON_BUSTER] = {
	Name: 'SO_POISON_BUSTER',
	SkillName: '毒爆',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SO_CLOUD_KILL, 2]]
};
SkillInfo[SK.SO_WARMER] = {
	Name: 'SO_WARMER',
	SkillName: '暖身',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_VOLCANO, 1],
		[SK.SA_VIOLENTGALE, 1]
	]
};
SkillInfo[SK.SO_EL_CONTROL] = {
	Name: 'SO_EL_CONTROL',
	SkillName: '灵魂控制',
	MaxLv: 4,
	SpAmount: [10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_ANALYSIS, 1]]
};
SkillInfo[SK.MC_CHANGECART] = {
	Name: 'MC_CHANGECART',
	SkillName: '更换手推车',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_EL_CURE] = {
	Name: 'SO_EL_CURE',
	SkillName: '灵魂治愈',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SO_EL_SYMPATHY, 1]]
};
SkillInfo[SK.SO_EARTH_INSIGNIA] = {
	Name: 'SO_EARTH_INSIGNIA',
	SkillName: '大地纹章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_TERA, 3]]
};
SkillInfo[SK.MC_LOUD] = {
	Name: 'MC_LOUD',
	SkillName: '疯狂喧嚣',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [8],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GN_BLOOD_SUCKER] = {
	Name: 'GN_BLOOD_SUCKER',
	SkillName: '吸血',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 3]]
};
SkillInfo[SK.AL_HOLYLIGHT] = {
	Name: 'AL_HOLYLIGHT',
	SkillName: '圣光',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.GN_MAKEBOMB] = {
	Name: 'GN_MAKEBOMB',
	SkillName: '制作炸弹',
	MaxLv: 2,
	SpAmount: [5, 40],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.GN_MIX_COOKING, 1]]
};
SkillInfo[SK.GD_SOULCOLD] = {
	Name: 'GD_SOULCOLD',
	SkillName: '冷酷之心',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_ENERGYCOAT] = {
	Name: 'MG_ENERGYCOAT',
	SkillName: '能量外套',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_GUARDIAN_RECALL] = {
	Name: 'ALL_GUARDIAN_RECALL',
	SkillName: '守护者召唤',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MG_SIGHT] = {
	Name: 'MG_SIGHT',
	SkillName: '火狩',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MS_BASH] = {
	Name: 'MS_BASH',
	SkillName: '狂击',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_BRANDISH] = {
	Name: 'ML_BRANDISH',
	SkillName: '枪身攻击',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.MER_AUTOBERSERK] = {
	Name: 'MER_AUTOBERSERK',
	SkillName: '狂暴',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_ZEPHYR] = {
	Name: 'EL_ZEPHYR',
	SkillName: '西风',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_FIRE_ARROW] = {
	Name: 'EL_FIRE_ARROW',
	SkillName: '火箭',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_ROCK_CRUSHER_ATK] = {
	Name: 'EL_ROCK_CRUSHER_ATK',
	SkillName: '碎岩攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [5]
};
SkillInfo[SK.MG_NAPALMBEAT] = {
	Name: 'MG_NAPALMBEAT',
	SkillName: '念力连击',
	MaxLv: 10,
	SpAmount: [9, 9, 9, 12, 12, 12, 15, 15, 15, 18],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.HAMI_CASTLE] = {
	Name: 'HAMI_CASTLE',
	SkillName: '王车易位',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HVAN_CAPRICE] = {
	Name: 'HVAN_CAPRICE',
	SkillName: '随兴打击',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MH_PAIN_KILLER] = {
	Name: 'MH_PAIN_KILLER',
	SkillName: '痛苦杀手',
	MaxLv: 10,
	SpAmount: [48, 52, 56, 60, 64, 68, 72, 76, 80, 84],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_SILVERVEIN_RUSH] = {
	Name: 'MH_SILVERVEIN_RUSH',
	SkillName: '银脉突袭',
	MaxLv: 10,
	SpAmount: [17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
};
SkillInfo[SK.MH_CBC] = {
	Name: 'MH_CBC',
	SkillName: 'C.B.C：连续破坏连击',
	MaxLv: 5,
	SpAmount: [10, 20, 30, 40, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_HAWKEYES] = {
	Name: 'GD_HAWKEYES',
	SkillName: '锐利凝视',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_SAFETYWALL] = {
	Name: 'MG_SAFETYWALL',
	SkillName: '暗之障壁',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 35, 35, 35, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_NAPALMBEAT, 7],
		[SK.MG_SOULSTRIKE, 5]
	],
	NeedSkillList: {
		[JobId.PRIEST]: [
			[SK.PR_SANCTUARY, 3],
			[SK.PR_ASPERSIO, 4]
		]
	}
};
SkillInfo[SK.MS_MAGNUM] = {
	Name: 'MS_MAGNUM',
	SkillName: '怒爆',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_SPIRALPIERCE] = {
	Name: 'ML_SPIRALPIERCE',
	SkillName: '螺旋击刺',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [4, 4, 4, 4, 4]
};
SkillInfo[SK.MER_DECAGI] = {
	Name: 'MER_DECAGI',
	SkillName: '敏捷下降',
	MaxLv: 10,
	SpAmount: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_SOLID_SKIN] = {
	Name: 'EL_SOLID_SKIN',
	SkillName: '坚固皮肤',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_FIRE_BOMB] = {
	Name: 'EL_FIRE_BOMB',
	SkillName: '火焰炸弹',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_STONE_RAIN] = {
	Name: 'EL_STONE_RAIN',
	SkillName: '落石',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MG_SOULSTRIKE] = {
	Name: 'MG_SOULSTRIKE',
	SkillName: '灵魂攻击',
	MaxLv: 10,
	SpAmount: [18, 14, 24, 20, 30, 26, 36, 32, 42, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_NAPALMBEAT, 4]]
};
SkillInfo[SK.RG_SNATCHER] = {
	Name: 'RG_SNATCHER',
	SkillName: '偷窃攻击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_STEAL, 1]]
};
SkillInfo[SK.RG_STEALCOIN] = {
	Name: 'RG_STEALCOIN',
	SkillName: '抢夺',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_SNATCHER, 4]]
};
SkillInfo[SK.RG_BACKSTAP] = {
	Name: 'RG_BACKSTAP',
	SkillName: '背刺',
	MaxLv: 10,
	SpAmount: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STEALCOIN, 4]]
};
SkillInfo[SK.RG_TUNNELDRIVE] = {
	Name: 'RG_TUNNELDRIVE',
	SkillName: '尾行',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_HIDING, 1]]
};
SkillInfo[SK.RG_RAID] = {
	Name: 'RG_RAID',
	SkillName: '无视之心',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RG_TUNNELDRIVE, 2],
		[SK.RG_BACKSTAP, 2]
	]
};
SkillInfo[SK.RG_STRIPWEAPON] = {
	Name: 'RG_STRIPWEAPON',
	SkillName: '卸除武器',
	MaxLv: 5,
	SpAmount: [17, 19, 21, 23, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPARMOR, 5]]
};
SkillInfo[SK.RG_STRIPSHIELD] = {
	Name: 'RG_STRIPSHIELD',
	SkillName: '卸除盾牌',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPHELM, 5]]
};
SkillInfo[SK.RG_STRIPARMOR] = {
	Name: 'RG_STRIPARMOR',
	SkillName: '卸除铠甲',
	MaxLv: 5,
	SpAmount: [17, 19, 21, 23, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPSHIELD, 5]]
};
SkillInfo[SK.RG_STRIPHELM] = {
	Name: 'RG_STRIPHELM',
	SkillName: '卸除头盔',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STEALCOIN, 2]]
};
SkillInfo[SK.RG_INTIMIDATE] = {
	Name: 'RG_INTIMIDATE',
	SkillName: '强夺',
	MaxLv: 5,
	SpAmount: [13, 16, 19, 22, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RG_BACKSTAP, 4],
		[SK.RG_RAID, 5]
	]
};
SkillInfo[SK.RG_GRAFFITI] = {
	Name: 'RG_GRAFFITI',
	SkillName: '涂鸦',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_FLAGGRAFFITI, 5]]
};
SkillInfo[SK.GD_BATTLEORDER] = {
	Name: 'GD_BATTLEORDER',
	SkillName: '战斗命令',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RG_FLAGGRAFFITI] = {
	Name: 'RG_FLAGGRAFFITI',
	SkillName: '棋子',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_CLEANER, 1]]
};
SkillInfo[SK.RG_CLEANER] = {
	Name: 'RG_CLEANER',
	SkillName: '清除者',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_GANGSTER, 1]]
};
SkillInfo[SK.RG_GANGSTER] = {
	Name: 'RG_GANGSTER',
	SkillName: '狡猾',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_STRIPSHIELD, 3]]
};
SkillInfo[SK.GD_ITEMEMERGENCYCALL] = {
	Name: 'GD_ITEMEMERGENCYCALL',
	SkillName: '伪紧急召集',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.MG_COLDBOLT] = {
	Name: 'MG_COLDBOLT',
	SkillName: '冰箭术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.RG_COMPULSION] = {
	Name: 'RG_COMPULSION',
	SkillName: '砍价',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_GANGSTER, 1]]
};
SkillInfo[SK.DE_GPAIN] = {
	Name: 'DE_GPAIN',
	SkillName: '公会痛击',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MS_BOWLINGBASH] = {
	Name: 'MS_BOWLINGBASH',
	SkillName: '怪物互击',
	MaxLv: 10,
	SpAmount: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.ML_DEFENDER] = {
	Name: 'ML_DEFENDER',
	SkillName: '防御光环',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RG_PLAGIARISM] = {
	Name: 'RG_PLAGIARISM',
	SkillName: '威吓',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_INTIMIDATE, 5]]
};
SkillInfo[SK.SR_DRAGONCOMBO] = {
	Name: 'SR_DRAGONCOMBO',
	SkillName: '龙连击',
	MaxLv: 10,
	SpAmount: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_TRIPLEATTACK, 5]]
};
SkillInfo[SK.SC_STRIPACCESSARY] = {
	Name: 'SC_STRIPACCESSARY',
	SkillName: '卸除饰品 ',
	MaxLv: 5,
	SpAmount: [15, 18, 21, 24, 27],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RG_STRIPWEAPON, 1]]
};
SkillInfo[SK.GD_GLORYWOUNDS] = {
	Name: 'GD_GLORYWOUNDS',
	SkillName: '荣耀伤口',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_AXEMASTERY] = {
	Name: 'AM_AXEMASTERY',
	SkillName: '斧术修炼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GUARDUP] = {
	Name: 'GD_GUARDUP',
	SkillName: '强化守护者',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.GD_APPROVAL] = {
	Name: 'GD_APPROVAL',
	SkillName: '公会正式认可',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MER_INCAGI] = {
	Name: 'MER_INCAGI',
	SkillName: '提高敏捷',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_LEARNINGPOTION] = {
	Name: 'AM_LEARNINGPOTION',
	SkillName: '药水研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MER_BLESSING] = {
	Name: 'MER_BLESSING',
	SkillName: '天使之赐福',
	MaxLv: 10,
	SpAmount: [28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_KYRIE] = {
	Name: 'MER_KYRIE',
	SkillName: '圣母之祈福',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 25, 25, 25, 30, 30, 30, 35],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_STONE_SHIELD] = {
	Name: 'EL_STONE_SHIELD',
	SkillName: '石盾术',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_PHARMACY] = {
	Name: 'AM_PHARMACY',
	SkillName: '准备药水',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_LEARNINGPOTION, 5]]
};
SkillInfo[SK.MER_ESTIMATION] = {
	Name: 'MER_ESTIMATION',
	SkillName: '洞察',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MER_LEXDIVINA] = {
	Name: 'MER_LEXDIVINA',
	SkillName: '沉默术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MER_SCAPEGOAT] = {
	Name: 'MER_SCAPEGOAT',
	SkillName: '替罪羊',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_DEMONSTRATION] = {
	Name: 'AM_DEMONSTRATION',
	SkillName: '炸弹',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 4]]
};
SkillInfo[SK.MER_PROVOKE] = {
	Name: 'MER_PROVOKE',
	SkillName: '挑衅',
	MaxLv: 10,
	SpAmount: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_CRASH] = {
	Name: 'MER_CRASH',
	SkillName: '冲撞',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MER_SIGHT] = {
	Name: 'MER_SIGHT',
	SkillName: '火狩',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_ACIDTERROR] = {
	Name: 'AM_ACIDTERROR',
	SkillName: '酸性恐惧',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 5]]
};
SkillInfo[SK.LG_SHIELDPRESS] = {
	Name: 'LG_SHIELDPRESS',
	SkillName: '盾牌压制',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDCHARGE, 3]]
};
SkillInfo[SK.ML_AUTOGUARD] = {
	Name: 'ML_AUTOGUARD',
	SkillName: '防御',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_PIERCE] = {
	Name: 'ML_PIERCE',
	SkillName: '长矛刺击',
	MaxLv: 10,
	SpAmount: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.AM_POTIONPITCHER] = {
	Name: 'AM_POTIONPITCHER',
	SkillName: '辅助药水',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 3]]
};
SkillInfo[SK.MA_FREEZINGTRAP] = {
	Name: 'MA_FREEZINGTRAP',
	SkillName: '冰冻陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MA_SKIDTRAP] = {
	Name: 'MA_SKIDTRAP',
	SkillName: '滑动陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MA_SHOWER] = {
	Name: 'MA_SHOWER',
	SkillName: '箭雨',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_CANNIBALIZE] = {
	Name: 'AM_CANNIBALIZE',
	SkillName: '召唤食人花',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [[SK.AM_PHARMACY, 6]]
};
SkillInfo[SK.MA_DOUBLE] = {
	Name: 'MA_DOUBLE',
	SkillName: '二连矢',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MS_BERSERK] = {
	Name: 'MS_BERSERK',
	SkillName: '狂暴',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MS_REFLECTSHIELD] = {
	Name: 'MS_REFLECTSHIELD',
	SkillName: '盾牌反射',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_SPHEREMINE] = {
	Name: 'AM_SPHEREMINE',
	SkillName: '召唤海葵',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_PHARMACY, 2]]
};
SkillInfo[SK.MS_PARRYING] = {
	Name: 'MS_PARRYING',
	SkillName: '剑术格挡',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_PYROCLASTIC] = {
	Name: 'MH_PYROCLASTIC',
	SkillName: '火成岩',
	MaxLv: 10,
	SpAmount: [20, 28, 36, 44, 52, 56, 60, 64, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_GRANITIC_ARMOR] = {
	Name: 'MH_GRANITIC_ARMOR',
	SkillName: '花岗岩铠甲',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_CP_WEAPON] = {
	Name: 'AM_CP_WEAPON',
	SkillName: '炼金武器',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_ARMOR, 3]]
};
SkillInfo[SK.MH_MAGMA_FLOW] = {
	Name: 'MH_MAGMA_FLOW',
	SkillName: '岩浆流',
	MaxLv: 5,
	SpAmount: [34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_BLAST] = {
	Name: 'EL_BLAST',
	SkillName: '爆破地雷',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_TINDER_BREAKER] = {
	Name: 'MH_TINDER_BREAKER',
	SkillName: '火花破坏者',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [3, 4, 5, 6, 7]
};
SkillInfo[SK.AM_CP_SHIELD] = {
	Name: 'AM_CP_SHIELD',
	SkillName: '合成盾牌',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_HELM, 3]]
};
SkillInfo[SK.MH_HEILIGE_STANGE] = {
	Name: 'MH_HEILIGE_STANGE',
	SkillName: '治愈之杖',
	MaxLv: 10,
	SpAmount: [48, 54, 60, 66, 72, 78, 84, 90, 96, 102],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MH_GOLDENE_FERSE] = {
	Name: 'MH_GOLDENE_FERSE',
	SkillName: '黄金之踵',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_ALLHEAL] = {
	Name: 'NPC_ALLHEAL',
	SkillName: '完全治愈',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.AM_CP_ARMOR] = {
	Name: 'AM_CP_ARMOR',
	SkillName: '合成铠甲',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_SHIELD, 3]]
};
SkillInfo[SK.MH_SONIC_CRAW] = {
	Name: 'MH_SONIC_CRAW',
	SkillName: '音速爪',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_SILENT_BREEZE] = {
	Name: 'MH_SILENT_BREEZE',
	SkillName: '寂静微风',
	MaxLv: 5,
	SpAmount: [45, 54, 63, 72, 81],
	bSeperateLv: true,
	AttackRange: [5, 5, 7, 7, 9]
};
SkillInfo[SK.AM_CP_HELM] = {
	Name: 'AM_CP_HELM',
	SkillName: '生化头盔',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_PHARMACY, 2]]
};
SkillInfo[SK.MH_ERASER_CUTTER] = {
	Name: 'MH_ERASER_CUTTER',
	SkillName: '抹除切割',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.MH_OVERED_BOOST] = {
	Name: 'MH_OVERED_BOOST',
	SkillName: '过度强化',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_LIGHT_OF_REGENE] = {
	Name: 'MH_LIGHT_OF_REGENE',
	SkillName: '再生之光',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_BIOETHICS] = {
	Name: 'AM_BIOETHICS',
	SkillName: '生物伦理',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_POISON_MIST] = {
	Name: 'MH_POISON_MIST',
	SkillName: '毒雾',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_SUMMON_LEGION] = {
	Name: 'MH_SUMMON_LEGION',
	SkillName: '召唤军团',
	MaxLv: 5,
	SpAmount: [60, 80, 100, 120, 140],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.HVAN_EXPLOSION] = {
	Name: 'HVAN_EXPLOSION',
	SkillName: '自爆',
	MaxLv: 3,
	SpAmount: [1, 1, 1],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_BIOTECHNOLOGY] = {
	Name: 'AM_BIOTECHNOLOGY',
	SkillName: '生物技术',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_CREATECON] = {
	Name: 'SA_CREATECON',
	SkillName: '制作属性转换器',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_WILD_STORM] = {
	Name: 'EL_WILD_STORM',
	SkillName: '狂野风暴',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MG_FROSTDIVER] = {
	Name: 'MG_FROSTDIVER',
	SkillName: '寒霜驱动',
	MaxLv: 10,
	SpAmount: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_COLDBOLT, 5]]
};
SkillInfo[SK.AM_CREATECREATURE] = {
	Name: 'AM_CREATECREATURE',
	SkillName: '创造生物',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_SBR44] = {
	Name: 'HFLI_SBR44',
	SkillName: 'S.B.R.44',
	MaxLv: 3,
	SpAmount: [1, 1, 1],
	bSeperateLv: true,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.HFLI_FLEET] = {
	Name: 'HFLI_FLEET',
	SkillName: '闪身',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HAMI_BLOODLUST] = {
	Name: 'HAMI_BLOODLUST',
	SkillName: '嗜血',
	MaxLv: 3,
	SpAmount: [120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_CULTIVATION] = {
	Name: 'AM_CULTIVATION',
	SkillName: '培育',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HAMI_SKIN] = {
	Name: 'HAMI_SKIN',
	SkillName: '金刚之肤',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_CURSED_SOIL] = {
	Name: 'EL_CURSED_SOIL',
	SkillName: '诅咒土壤',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HLIF_CHANGE] = {
	Name: 'HLIF_CHANGE',
	SkillName: '精神充能',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_FLAMECONTROL] = {
	Name: 'AM_FLAMECONTROL',
	SkillName: '火焰控制',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HLIF_AVOID] = {
	Name: 'HLIF_AVOID',
	SkillName: '紧急逃脱',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.LG_OVERBRAND] = {
	Name: 'LG_OVERBRAND',
	SkillName: '过度烙印',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_MOONSLASHER, 3],
		[SK.LG_PINPOINTATTACK, 1]
	]
};
SkillInfo[SK.ALL_ODINS_RECALL] = {
	Name: 'ALL_ODINS_RECALL',
	SkillName: '奥丁的召唤',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_CALLHOMUN] = {
	Name: 'AM_CALLHOMUN',
	SkillName: '召唤生命体',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_REST, 1]]
};
SkillInfo[SK.SR_RIDEINLIGHTNING] = {
	Name: 'SR_RIDEINLIGHTNING',
	SkillName: '雷电骑乘',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.MO_FINGEROFFENSIVE, 3]]
};
SkillInfo[SK.SR_HOWLINGOFLION] = {
	Name: 'SR_HOWLINGOFLION',
	SkillName: '狮子咆哮',
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SR_RIDEINLIGHTNING, 3],
		[SK.SR_ASSIMILATEPOWER, 1]
	]
};
SkillInfo[SK.SR_TIGERCANNON] = {
	Name: 'SR_TIGERCANNON',
	SkillName: '虎炮',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_FALLENEMPIRE, 3]]
};
SkillInfo[SK.AM_REST] = {
	Name: 'AM_REST',
	SkillName: '蒸发',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_BIOETHICS, 1]]
};
SkillInfo[SK.GN_CHANGEMATERIAL] = {
	Name: 'GN_CHANGEMATERIAL',
	SkillName: '材料变换',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GN_SLINGITEM] = {
	Name: 'GN_SLINGITEM',
	SkillName: '投掷物品',
	MaxLv: 1,
	SpAmount: [4],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.GN_CHANGEMATERIAL, 1]]
};
SkillInfo[SK.GN_MANDRAGORA] = {
	Name: 'GN_MANDRAGORA',
	SkillName: '曼陀罗嚎叫',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_HELLS_PLANT, 3]]
};
SkillInfo[SK.AM_DRILLMASTER] = {
	Name: 'AM_DRILLMASTER',
	SkillName: '钻头大师',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GN_HELLS_PLANT] = {
	Name: 'GN_HELLS_PLANT',
	SkillName: '地狱植物',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_BLOOD_SUCKER, 3]]
};
SkillInfo[SK.GN_FIRE_EXPANSION] = {
	Name: 'GN_FIRE_EXPANSION',
	SkillName: '火焰扩散',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_DEMONIC_FIRE, 3]]
};
SkillInfo[SK.GN_DEMONIC_FIRE] = {
	Name: 'GN_DEMONIC_FIRE',
	SkillName: '魔火',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_SPORE_EXPLOSION, 3]]
};
SkillInfo[SK.AM_HEALHOMUN] = {
	Name: 'AM_HEALHOMUN',
	SkillName: '治疗生命体',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.GN_WALLOFTHORN] = {
	Name: 'GN_WALLOFTHORN',
	SkillName: '荆棘之墙',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_THORNS_TRAP, 3]]
};
SkillInfo[SK.SR_CRESCENTELBOW] = {
	Name: 'SR_CRESCENTELBOW',
	SkillName: '新月肘击',
	MaxLv: 5,
	SpAmount: [80, 80, 80, 80, 80],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_WINDMILL, 1]]
};
SkillInfo[SK.GN_CARTBOOST] = {
	Name: 'GN_CARTBOOST',
	SkillName: '基因学者手推车强化',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 3]]
};
SkillInfo[SK.AM_RESURRECTHOMUN] = {
	Name: 'AM_RESURRECTHOMUN',
	SkillName: '生命体复活',
	MaxLv: 5,
	SpAmount: [74, 68, 62, 56, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CALLHOMUN, 1]]
};
SkillInfo[SK.GN_CARTCANNON] = {
	Name: 'GN_CARTCANNON',
	SkillName: '手推车加农炮',
	MaxLv: 5,
	SpAmount: [40, 42, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 2]]
};
SkillInfo[SK.GN_CART_TORNADO] = {
	Name: 'GN_CART_TORNADO',
	SkillName: '手推车龙卷风',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 1]]
};
SkillInfo[SK.GN_TRAINING_SWORD] = {
	Name: 'GN_TRAINING_SWORD',
	SkillName: '剑术精通',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CR_TRUST] = {
	Name: 'CR_TRUST',
	SkillName: '信仰',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WATER_SCREW_ATK] = {
	Name: 'EL_WATER_SCREW_ATK',
	SkillName: '水螺旋攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_WATER_SCREW] = {
	Name: 'EL_WATER_SCREW',
	SkillName: '水螺旋',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_ICE_NEEDLE] = {
	Name: 'EL_ICE_NEEDLE',
	SkillName: '冰针',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.CR_AUTOGUARD] = {
	Name: 'CR_AUTOGUARD',
	SkillName: '防御',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_FIRE_WAVE_ATK] = {
	Name: 'EL_FIRE_WAVE_ATK',
	SkillName: '火焰波攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_FIRE_WAVE] = {
	Name: 'EL_FIRE_WAVE',
	SkillName: '火焰波',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_FIRE_BOMB_ATK] = {
	Name: 'EL_FIRE_BOMB_ATK',
	SkillName: '火焰炸弹攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.CR_SHIELDCHARGE] = {
	Name: 'CR_SHIELDCHARGE',
	SkillName: '重击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.CR_AUTOGUARD, 5]]
};
SkillInfo[SK.EL_UPHEAVAL] = {
	Name: 'EL_UPHEAVAL',
	SkillName: '剧变',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HAMI_DEFENCE] = {
	Name: 'HAMI_DEFENCE',
	SkillName: '阿米斯特堡垒',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HVAN_CHAOTIC] = {
	Name: 'HVAN_CHAOTIC',
	SkillName: '混沌祝福',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CR_SHIELDBOOMERANG] = {
	Name: 'CR_SHIELDBOOMERANG',
	SkillName: '盾牌回旋镖',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9, 11],
	_NeedSkillList: [[SK.CR_SHIELDCHARGE, 3]]
};
SkillInfo[SK.MH_MIDNIGHT_FRENZY] = {
	Name: 'MH_MIDNIGHT_FRENZY',
	SkillName: 'Midnight Frenzy',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
};
SkillInfo[SK.MH_EQC] = {
	Name: 'MH_EQC',
	SkillName: 'E.Q.C : Eternal Quick Combo',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_GUST] = {
	Name: 'EL_GUST',
	SkillName: 'Gust',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CR_REFLECTSHIELD] = {
	Name: 'CR_REFLECTSHIELD',
	SkillName: 'Shield Reflect',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 3]]
};
SkillInfo[SK.EL_CHILLY_AIR] = {
	Name: 'EL_CHILLY_AIR',
	SkillName: 'Chilly Air',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_COOLER] = {
	Name: 'EL_COOLER',
	SkillName: 'Cooler',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.GD_REGENERATION] = {
	Name: 'GD_REGENERATION',
	SkillName: 'Regeneration',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.CR_HOLYCROSS] = {
	Name: 'CR_HOLYCROSS',
	SkillName: 'Holy Cross',
	MaxLv: 10,
	SpAmount: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.CR_TRUST, 7]]
};
SkillInfo[SK.SO_CLOUD_KILL] = {
	Name: 'SO_CLOUD_KILL',
	SkillName: 'Killing Cloud',
	MaxLv: 5,
	SpAmount: [48, 56, 64, 70, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 5]]
};
SkillInfo[SK.EL_AQUAPLAY] = {
	Name: 'EL_AQUAPLAY',
	SkillName: 'Aquaplay',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_EL_ACTION] = {
	Name: 'SO_EL_ACTION',
	SkillName: 'Elemental Action',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.CR_GRANDCROSS] = {
	Name: 'CR_GRANDCROSS',
	SkillName: 'Grand Cross',
	MaxLv: 10,
	SpAmount: [37, 44, 51, 58, 65, 72, 78, 86, 93, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CR_TRUST, 10],
		[SK.CR_HOLYCROSS, 6]
	]
};
SkillInfo[SK.SO_WATER_INSIGNIA] = {
	Name: 'SO_WATER_INSIGNIA',
	SkillName: 'Water Insignia',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_AQUA, 3]]
};
SkillInfo[SK.SR_RAISINGDRAGON] = {
	Name: 'SR_RAISINGDRAGON',
	SkillName: 'Rising Dragon',
	MaxLv: 10,
	SpAmount: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MO_CALLSPIRITS, 5],
		[SK.SR_POWERVELOCITY, 1]
	]
};
SkillInfo[SK.SR_POWERVELOCITY] = {
	Name: 'SR_POWERVELOCITY',
	SkillName: 'Power Implantation',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.CR_DEVOTION] = {
	Name: 'CR_DEVOTION',
	SkillName: 'Sacrifice',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [
		[SK.CR_GRANDCROSS, 4],
		[SK.CR_REFLECTSHIELD, 5]
	]
};
SkillInfo[SK.SO_SUMMON_AQUA] = {
	Name: 'SO_SUMMON_AQUA',
	SkillName: 'Call Aqua',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_DIAMONDDUST, 3]
	]
};
SkillInfo[SK.NV_BASIC] = {
	Name: 'NV_BASIC',
	SkillName: 'Basic Skill',
	MaxLv: 9,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_STONECURSE] = {
	Name: 'MG_STONECURSE',
	SkillName: 'Stone Curse',
	MaxLv: 10,
	SpAmount: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.CR_PROVIDENCE] = {
	Name: 'CR_PROVIDENCE',
	SkillName: 'Resistant Souls',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_DP, 5],
		[SK.AL_HEAL, 5]
	]
};
SkillInfo[SK.AB_EUCHARISTICA] = {
	Name: 'AB_EUCHARISTICA',
	SkillName: 'Eucharistica',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.CR_DEFENDER] = {
	Name: 'CR_DEFENDER',
	SkillName: 'Defending Aura',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 1]]
};
SkillInfo[SK.AB_SILENTIUM] = {
	Name: 'AB_SILENTIUM',
	SkillName: 'Silentium',
	MaxLv: 5,
	SpAmount: [64, 68, 72, 76, 80],
	bSeperateLv: true,
	AttackRange: [4, 5, 6, 7, 8],
	_NeedSkillList: [[SK.AB_CLEARANCE, 1]]
};
SkillInfo[SK.CR_SPEARQUICKEN] = {
	Name: 'CR_SPEARQUICKEN',
	SkillName: 'Spear Quicken',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 10]]
};
SkillInfo[SK.SO_SUMMON_TERA] = {
	Name: 'SO_SUMMON_TERA',
	SkillName: 'Call Tera',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_EARTHGRAVE, 3]
	]
};
SkillInfo[SK.MO_IRONHAND] = {
	Name: 'MO_IRONHAND',
	SkillName: 'Iron Fists',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AL_DEMONBANE, 10],
		[SK.AL_DP, 10]
	]
};
SkillInfo[SK.SO_SUMMON_VENTUS] = {
	Name: 'SO_SUMMON_VENTUS',
	SkillName: 'Call Ventus',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_VARETYR_SPEAR, 3]
	]
};
SkillInfo[SK.MO_SPIRITSRECOVERY] = {
	Name: 'MO_SPIRITSRECOVERY',
	SkillName: 'Spiritual Cadence',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_BLADESTOP, 2]]
};
SkillInfo[SK.SO_EL_ANALYSIS] = {
	Name: 'SO_EL_ANALYSIS',
	SkillName: 'Analyze Element',
	MaxLv: 2,
	SpAmount: [10, 20],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [
		[SK.SA_FLAMELAUNCHER, 1],
		[SK.SA_FROSTWEAPON, 1],
		[SK.SA_LIGHTNINGLOADER, 1],
		[SK.SA_SEISMICWEAPON, 1]
	]
};
SkillInfo[SK.MO_CALLSPIRITS] = {
	Name: 'MO_CALLSPIRITS',
	SkillName: 'Summon Spirit Sphere',
	MaxLv: 5,
	SpAmount: [8, 8, 8, 8, 8],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_IRONHAND, 2]]
};
SkillInfo[SK.SO_VARETYR_SPEAR] = {
	Name: 'SO_VARETYR_SPEAR',
	SkillName: 'Varetyr Spear',
	MaxLv: 10,
	SpAmount: [65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_SEISMICWEAPON, 1],
		[SK.SA_VIOLENTGALE, 4]
	]
};
SkillInfo[SK.MO_ABSORBSPIRITS] = {
	Name: 'MO_ABSORBSPIRITS',
	SkillName: 'Spiritual Sphere Absorption',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.SO_VACUUM_EXTREME] = {
	Name: 'SO_VACUUM_EXTREME',
	SkillName: 'Extreme Vacuum',
	MaxLv: 5,
	SpAmount: [34, 42, 50, 58, 66],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_LANDPROTECTOR, 2]]
};
SkillInfo[SK.MO_TRIPLEATTACK] = {
	Name: 'MO_TRIPLEATTACK',
	SkillName: 'Raging Trifecta Blow',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_DODGE, 5]]
};
SkillInfo[SK.EL_POWER_OF_GAIA] = {
	Name: 'EL_POWER_OF_GAIA',
	SkillName: 'Power of Gaia',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MO_BODYRELOCATION] = {
	Name: 'MO_BODYRELOCATION',
	SkillName: 'Snap',
	MaxLv: 1,
	SpAmount: [14],
	bSeperateLv: false,
	AttackRange: [18],
	_NeedSkillList: [
		[SK.MO_SPIRITSRECOVERY, 2],
		[SK.MO_EXTREMITYFIST, 3],
		[SK.MO_STEELBODY, 3]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_ENERGYGAIN] = {
	Name: 'SR_GENTLETOUCH_ENERGYGAIN',
	SkillName: 'Gentle Touch-Energy Gain',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_GENTLETOUCH_CURE, 1]]
};
SkillInfo[SK.MO_DODGE] = {
	Name: 'MO_DODGE',
	SkillName: 'Flee',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_CALLSPIRITS, 5]
	]
};
SkillInfo[SK.SO_EARTHGRAVE] = {
	Name: 'SO_EARTHGRAVE',
	SkillName: 'Earth Grave',
	MaxLv: 5,
	SpAmount: [62, 70, 78, 86, 94],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_EARTHSPIKE, 5]]
};
SkillInfo[SK.MO_INVESTIGATE] = {
	Name: 'MO_INVESTIGATE',
	SkillName: 'Occult Impaction',
	MaxLv: 5,
	SpAmount: [10, 14, 17, 19, 20],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.SO_SPELLFIST] = {
	Name: 'SO_SPELLFIST',
	SkillName: 'Spell Fist',
	MaxLv: 10,
	SpAmount: [40, 44, 48, 52, 56, 60, 64, 68, 72, 76],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_AUTOSPELL, 4]]
};
SkillInfo[SK.MO_FINGEROFFENSIVE] = {
	Name: 'MO_FINGEROFFENSIVE',
	SkillName: 'Throw Spirit Sphere',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MO_INVESTIGATE, 3]]
};
SkillInfo[SK.SO_ELECTRICWALK] = {
	Name: 'SO_ELECTRICWALK',
	SkillName: 'Electric Walk',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_VIOLENTGALE, 1]]
};
SkillInfo[SK.MO_STEELBODY] = {
	Name: 'MO_STEELBODY',
	SkillName: 'Mental Strength',
	MaxLv: 5,
	SpAmount: [200, 200, 200, 200, 200],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_COMBOFINISH, 3]]
};
SkillInfo[SK.WM_UNLIMITED_HUMMING_VOICE] = {
	Name: 'WM_UNLIMITED_HUMMING_VOICE',
	SkillName: 'Infinite Humming',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.WM_BEYOND_OF_WARCRY, 1],
		[SK.WM_SOUND_OF_DESTRUCTION, 1]
	]
};
SkillInfo[SK.MO_BLADESTOP] = {
	Name: 'MO_BLADESTOP',
	SkillName: 'Root',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_DODGE, 5]]
};
SkillInfo[SK.WA_SWING_DANCE] = {
	Name: 'WA_SWING_DANCE',
	SkillName: 'Swing Dance',
	MaxLv: 5,
	SpAmount: [96, 112, 128, 144, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.MO_EXPLOSIONSPIRITS] = {
	Name: 'MO_EXPLOSIONSPIRITS',
	SkillName: 'Fury',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_ABSORBSPIRITS, 1]]
};
SkillInfo[SK.WM_SATURDAY_NIGHT_FEVER] = {
	Name: 'WM_SATURDAY_NIGHT_FEVER',
	SkillName: 'Saturday Night Fever',
	MaxLv: 5,
	SpAmount: [150, 160, 170, 180, 190],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_DANCE_WITH_WUG, 1]]
};
SkillInfo[SK.MO_EXTREMITYFIST] = {
	Name: 'MO_EXTREMITYFIST',
	SkillName: 'Guillotine Fist',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_EXPLOSIONSPIRITS, 3],
		[SK.MO_FINGEROFFENSIVE, 3]
	]
};
SkillInfo[SK.MG_FIREBALL] = {
	Name: 'MG_FIREBALL',
	SkillName: 'Fire Ball',
	MaxLv: 10,
	SpAmount: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_FIREBOLT, 4]]
};
SkillInfo[SK.MO_CHAINCOMBO] = {
	Name: 'MO_CHAINCOMBO',
	SkillName: '狂怒四连击',
	MaxLv: 5,
	SpAmount: [5, 6, 7, 8, 9],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_TRIPLEATTACK, 5]]
};
SkillInfo[SK.WM_SOUND_OF_DESTRUCTION] = {
	Name: 'WM_SOUND_OF_DESTRUCTION',
	SkillName: '毁灭之歌',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WM_SATURDAY_NIGHT_FEVER, 3],
		[SK.WM_MELODYOFSINK, 3]
	]
};
SkillInfo[SK.MO_COMBOFINISH] = {
	Name: 'MO_COMBOFINISH',
	SkillName: '狂怒突刺',
	MaxLv: 5,
	SpAmount: [3, 4, 5, 6, 7],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_CHAINCOMBO, 3]]
};
SkillInfo[SK.WM_DANCE_WITH_WUG] = {
	Name: 'WM_DANCE_WITH_WUG',
	SkillName: '与狼共舞',
	MaxLv: 5,
	SpAmount: [120, 140, 160, 180, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SA_ADVANCEDBOOK] = {
	Name: 'SA_ADVANCEDBOOK',
	SkillName: '研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_SONG_OF_MANA] = {
	Name: 'WM_SONG_OF_MANA',
	SkillName: '魔力之歌',
	MaxLv: 5,
	SpAmount: [120, 140, 160, 180, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SA_CASTCANCEL] = {
	Name: 'SA_CASTCANCEL',
	SkillName: '取消施法',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 2]]
};
SkillInfo[SK.WL_WHITEIMPRISON] = {
	Name: 'WL_WHITEIMPRISON',
	SkillName: '白色监狱',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SOULEXPANSION, 3]]
};
SkillInfo[SK.SA_MAGICROD] = {
	Name: 'SA_MAGICROD',
	SkillName: '魔法棒',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 4]]
};
SkillInfo[SK.WL_STASIS] = {
	Name: 'WL_STASIS',
	SkillName: '停滞',
	MaxLv: 5,
	SpAmount: [50, 60, 70, 80, 90],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_DRAINLIFE, 1]]
};
SkillInfo[SK.SA_SPELLBREAKER] = {
	Name: 'SA_SPELLBREAKER',
	SkillName: '魔法破坏',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_MAGICROD, 1]]
};
SkillInfo[SK.WL_TETRAVORTEX] = {
	Name: 'WL_TETRAVORTEX',
	SkillName: '四元漩涡',
	MaxLv: 10,
	SpAmount: [120, 150, 180, 210, 240, 200, 240, 280, 320, 360],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.WL_CHAINLIGHTNING, 5],
		[SK.WL_HELLINFERNO, 5],
		[SK.WL_JACKFROST, 5],
		[SK.WL_EARTHSTRAIN, 5]
	]
};
SkillInfo[SK.SA_FREECAST] = {
	Name: 'SA_FREECAST',
	SkillName: '自由施法',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_CASTCANCEL, 1]]
};
SkillInfo[SK.WM_GREAT_ECHO] = {
	Name: 'WM_GREAT_ECHO',
	SkillName: '大回声',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_METALICSOUND, 1]]
};
SkillInfo[SK.SA_AUTOSPELL] = {
	Name: 'SA_AUTOSPELL',
	SkillName: '后见之明',
	MaxLv: 10,
	SpAmount: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_FREECAST, 4]]
};
SkillInfo[SK.RA_ARROWSTORM] = {
	Name: 'RA_ARROWSTORM',
	SkillName: '箭雨',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_AIMEDBOLT, 5]]
};
SkillInfo[SK.SA_FLAMELAUNCHER] = {
	Name: 'SA_FLAMELAUNCHER',
	SkillName: '火焰附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_FIREBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.RA_WUGRIDER] = {
	Name: 'RA_WUGRIDER',
	SkillName: '骑乘狼',
	MaxLv: 3,
	SpAmount: [2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.RA_WUGMASTERY, 1]]
};
SkillInfo[SK.SA_FROSTWEAPON] = {
	Name: 'SA_FROSTWEAPON',
	SkillName: '海啸附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_COLDBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.RA_MAGENTATRAP] = {
	Name: 'RA_MAGENTATRAP',
	SkillName: '洋红陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.SA_LIGHTNINGLOADER] = {
	Name: 'SA_LIGHTNINGLOADER',
	SkillName: '龙卷附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_LIGHTNINGBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.NC_PILEBUNKER] = {
	Name: 'NC_PILEBUNKER',
	SkillName: '桩柱碉堡',
	MaxLv: 3,
	SpAmount: [50, 50, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.NC_BOOSTKNUCKLE, 2]]
};
SkillInfo[SK.SA_SEISMICWEAPON] = {
	Name: 'SA_SEISMICWEAPON',
	SkillName: '地震附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_STONECURSE, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.NC_B_SIDESLIDE] = {
	Name: 'NC_B_SIDESLIDE',
	SkillName: '后滑步',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_HOVERING, 1]]
};
SkillInfo[SK.SA_DRAGONOLOGY] = {
	Name: 'SA_DRAGONOLOGY',
	SkillName: '龙族学',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 9]]
};
SkillInfo[SK.NC_NEUTRALBARRIER] = {
	Name: 'NC_NEUTRALBARRIER',
	SkillName: '中立屏障',
	MaxLv: 3,
	SpAmount: [80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MAGNETICFIELD, 2]]
};
SkillInfo[SK.SA_VOLCANO] = {
	Name: 'SA_VOLCANO',
	SkillName: '火山',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_FLAMELAUNCHER, 2]]
};
SkillInfo[SK.NC_SILVERSNIPER] = {
	Name: 'NC_SILVERSNIPER',
	SkillName: 'FAW 银色狙击手',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_RESEARCHFE, 2]]
};
SkillInfo[SK.SA_DELUGE] = {
	Name: 'SA_DELUGE',
	SkillName: '洪水',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_FROSTWEAPON, 2]]
};
SkillInfo[SK.SC_BODYPAINT] = {
	Name: 'SC_BODYPAINT',
	SkillName: '身体彩绘',
	MaxLv: 5,
	SpAmount: [10, 15, 20, 25, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_VIOLENTGALE] = {
	Name: 'SA_VIOLENTGALE',
	SkillName: '旋风',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_LIGHTNINGLOADER, 2]]
};
SkillInfo[SK.MG_FIREWALL] = {
	Name: 'MG_FIREWALL',
	SkillName: '火墙',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SIGHT, 1],
		[SK.MG_FIREBALL, 5]
	]
};
SkillInfo[SK.SA_LANDPROTECTOR] = {
	Name: 'SA_LANDPROTECTOR',
	SkillName: '大地保护',
	MaxLv: 5,
	SpAmount: [66, 62, 58, 54, 50],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SA_DELUGE, 3],
		[SK.SA_VIOLENTGALE, 3],
		[SK.SA_VOLCANO, 3]
	]
};
SkillInfo[SK.WM_GLOOMYDAY] = {
	Name: 'WM_GLOOMYDAY',
	SkillName: '阴郁羞怯',
	MaxLv: 5,
	SpAmount: [42, 46, 50, 54, 58],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_RANDOMIZESPELL, 1]]
};
SkillInfo[SK.SA_DISPELL] = {
	Name: 'SA_DISPELL',
	SkillName: '驱散',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_SPELLBREAKER, 3]]
};
SkillInfo[SK.LG_FORCEOFVANGUARD] = {
	Name: 'LG_FORCEOFVANGUARD',
	SkillName: '先锋之力',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_ABRACADABRA] = {
	Name: 'SA_ABRACADABRA',
	SkillName: '胡思乱想',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SA_AUTOSPELL, 5],
		[SK.SA_DISPELL, 1],
		[SK.SA_LANDPROTECTOR, 1]
	]
};
SkillInfo[SK.LG_RAYOFGENESIS] = {
	Name: 'LG_RAYOFGENESIS',
	SkillName: '创世之光',
	MaxLv: 10,
	SpAmount: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_GRANDCROSS, 5]]
};
SkillInfo[SK.SA_MONOCELL] = {
	Name: 'SA_MONOCELL',
	SkillName: '单细胞',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.SR_FALLENEMPIRE] = {
	Name: 'SR_FALLENEMPIRE',
	SkillName: '帝国陨落',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.SA_CLASSCHANGE] = {
	Name: 'SA_CLASSCHANGE',
	SkillName: '职业变更',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.SR_WINDMILL] = {
	Name: 'SR_WINDMILL',
	SkillName: '风车',
	MaxLv: 1,
	SpAmount: [45],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SR_CURSEDCIRCLE, 1]]
};
SkillInfo[SK.SA_SUMMONMONSTER] = {
	Name: 'SA_SUMMONMONSTER',
	SkillName: '怪物咏唱',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SR_GENTLETOUCH_CURE] = {
	Name: 'SR_GENTLETOUCH_CURE',
	SkillName: '温柔触碰-治愈',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SR_GENTLETOUCH_QUIET, 1]]
};
SkillInfo[SK.SA_REVERSEORCISH] = {
	Name: 'SA_REVERSEORCISH',
	SkillName: '变形成海豚',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_LULLABY_DEEPSLEEP] = {
	Name: 'WM_LULLABY_DEEPSLEEP',
	SkillName: '深眠摇篮曲',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.SA_DEATH] = {
	Name: 'SA_DEATH',
	SkillName: '死神',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.WM_DEADHILLHERE] = {
	Name: 'WM_DEADHILLHERE',
	SkillName: '死亡谷',
	MaxLv: 5,
	SpAmount: [50, 53, 56, 59, 62],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.WM_SIRCLEOFNATURE, 3]]
};
SkillInfo[SK.SA_FORTUNE] = {
	Name: 'SA_FORTUNE',
	SkillName: '淘金者',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.WM_SEVERE_RAINSTORM] = {
	Name: 'WM_SEVERE_RAINSTORM',
	SkillName: '暴雨',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.MINSTREL]: [[SK.BA_MUSICALSTRIKE, 5]],
		[JobId.WANDERER]: [[SK.DC_THROWARROW, 5]]
	}
};
SkillInfo[SK.SA_TAMINGMONSTER] = {
	Name: 'SA_TAMINGMONSTER',
	SkillName: '野兽催眠',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MI_RUSH_WINDMILL] = {
	Name: 'MI_RUSH_WINDMILL',
	SkillName: '风车冲刺',
	MaxLv: 5,
	SpAmount: [82, 88, 94, 100, 106],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.SA_QUESTION] = {
	Name: 'SA_QUESTION',
	SkillName: '质问',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_REVERBERATION] = {
	Name: 'WM_REVERBERATION',
	SkillName: '回响',
	MaxLv: 5,
	SpAmount: [56, 62, 68, 74, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.MINSTREL]: [[SK.BA_DISSONANCE, 5]],
		[JobId.WANDERER]: [[SK.DC_UGLYDANCE, 5]]
	}
};
SkillInfo[SK.SA_GRAVITY] = {
	Name: 'SA_GRAVITY',
	SkillName: '重力',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_METALICSOUND] = {
	Name: 'WM_METALICSOUND',
	SkillName: '金属之声',
	MaxLv: 10,
	SpAmount: [62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_REVERBERATION, 5]]
};
SkillInfo[SK.SA_LEVELUP] = {
	Name: 'SA_LEVELUP',
	SkillName: '等级提升',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_LESSON] = {
	Name: 'WM_LESSON',
	SkillName: '声音课程',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_INSTANTDEATH] = {
	Name: 'SA_INSTANTDEATH',
	SkillName: '自杀',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MI_ECHOSONG] = {
	Name: 'MI_ECHOSONG',
	SkillName: '回声之歌',
	MaxLv: 5,
	SpAmount: [86, 92, 98, 104, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.SA_FULLRECOVERY] = {
	Name: 'SA_FULLRECOVERY',
	SkillName: '复苏',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_DOMINION_IMPULSE] = {
	Name: 'WM_DOMINION_IMPULSE',
	SkillName: '支配冲动',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.WM_REVERBERATION, 1]]
};
SkillInfo[SK.SA_COMA] = {
	Name: 'SA_COMA',
	SkillName: '昏迷',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_FIREBOLT] = {
	Name: 'MG_FIREBOLT',
	SkillName: '火箭术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BD_ADAPTATION] = {
	Name: 'BD_ADAPTATION',
	SkillName: '增幅',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WM_BEYOND_OF_WARCRY] = {
	Name: 'WM_BEYOND_OF_WARCRY',
	SkillName: '来自超越的战吼',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LERADS_DEW, 1]]
};
SkillInfo[SK.BD_ENCORE] = {
	Name: 'BD_ENCORE',
	SkillName: '再演',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_ADAPTATION, 1]]
};
SkillInfo[SK.SR_GENTLETOUCH_REVITALIZE] = {
	Name: 'SR_GENTLETOUCH_REVITALIZE',
	SkillName: '温柔之触-活力',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SR_GENTLETOUCH_QUIET, 1],
		[SK.SR_GENTLETOUCH_CURE, 1],
		[SK.SR_GENTLETOUCH_ENERGYGAIN, 3]
	]
};
SkillInfo[SK.BD_LULLABY] = {
	Name: 'BD_LULLABY',
	SkillName: '摇篮曲',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: { [JobId.BARD]: [[SK.BA_WHISTLE, 10]], [JobId.DANCER]: [[SK.DC_HUMMING, 10]] }
};
SkillInfo[SK.SO_PSYCHIC_WAVE] = {
	Name: 'SO_PSYCHIC_WAVE',
	SkillName: '精神波动',
	MaxLv: 5,
	SpAmount: [48, 56, 64, 70, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_DISPELL, 1]]
};
SkillInfo[SK.BD_RICHMANKIM] = {
	Name: 'BD_RICHMANKIM',
	SkillName: '精神感知',
	MaxLv: 5,
	SpAmount: [62, 68, 74, 80, 86],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_SIEGFRIED, 3]]
};
SkillInfo[SK.SO_SUMMON_AGNI] = {
	Name: 'SO_SUMMON_AGNI',
	SkillName: '召唤阿格尼',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_WARMER, 3]
	]
};
SkillInfo[SK.BD_ETERNALCHAOS] = {
	Name: 'BD_ETERNALCHAOS',
	SkillName: '降调',
	MaxLv: 1,
	SpAmount: [120],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_ROKISWEIL, 1]]
};
SkillInfo[SK.SO_FIRE_INSIGNIA] = {
	Name: 'SO_FIRE_INSIGNIA',
	SkillName: '火之徽章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_AGNI, 3]]
};
SkillInfo[SK.BD_DRUMBATTLEFIELD] = {
	Name: 'BD_DRUMBATTLEFIELD',
	SkillName: '战斗主题',
	MaxLv: 5,
	SpAmount: [50, 54, 58, 62, 66],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD]: [[SK.BA_APPLEIDUN, 10]],
		[JobId.DANCER]: [[SK.DC_SERVICEFORYOU, 10]]
	}
};
SkillInfo[SK.SR_CURSEDCIRCLE] = {
	Name: 'SR_CURSEDCIRCLE',
	SkillName: '诅咒之环',
	MaxLv: 5,
	SpAmount: [40, 60, 80, 100, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_BLADESTOP, 2]]
};
SkillInfo[SK.BD_RINGNIBELUNGEN] = {
	Name: 'BD_RINGNIBELUNGEN',
	SkillName: '和声舔舐',
	MaxLv: 5,
	SpAmount: [64, 60, 56, 52, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_DRUMBATTLEFIELD, 3]]
};
SkillInfo[SK.GN_SPORE_EXPLOSION] = {
	Name: 'GN_SPORE_EXPLOSION',
	SkillName: '孢子爆炸',
	MaxLv: 10,
	SpAmount: [48, 52, 56, 60, 64, 68, 72, 76, 80, 84],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 4]]
};
SkillInfo[SK.BD_ROKISWEIL] = {
	Name: 'BD_ROKISWEIL',
	SkillName: '古典拨弦',
	MaxLv: 1,
	SpAmount: [180],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: {
		[JobId.BARD]: [[SK.BA_ASSASSINCROSS, 10]],
		[JobId.DANCER]: [[SK.DC_DONTFORGETME, 10]]
	}
};
SkillInfo[SK.SR_RAMPAGEBLASTER] = {
	Name: 'SR_RAMPAGEBLASTER',
	SkillName: '狂暴冲击',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_EARTHSHAKER, 2]]
};
SkillInfo[SK.BD_INTOABYSS] = {
	Name: 'BD_INTOABYSS',
	SkillName: '力量和弦',
	MaxLv: 1,
	SpAmount: [70],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_LULLABY, 1]]
};
SkillInfo[SK.GN_S_PHARMACY] = {
	Name: 'GN_S_PHARMACY',
	SkillName: '特殊药剂学',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.BD_SIEGFRIED] = {
	Name: 'BD_SIEGFRIED',
	SkillName: '声学节奏',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: { [JobId.BARD]: [[SK.BA_POEMBRAGI, 10]], [JobId.DANCER]: [[SK.DC_FORTUNEKISS, 10]] }
};
SkillInfo[SK.GD_RESTORE] = {
	Name: 'GD_RESTORE',
	SkillName: '恢复术',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BD_RAGNAROK] = {
	Name: 'BD_RAGNAROK',
	SkillName: '诸神黄昏',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.LG_INSPIRATION] = {
	Name: 'LG_INSPIRATION',
	SkillName: '灵感',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_PIETY, 5],
		[SK.LG_RAYOFGENESIS, 4],
		[SK.LG_SHIELDSPELL, 3]
	]
};
SkillInfo[SK.BA_MUSICALLESSON] = {
	Name: 'BA_MUSICALLESSON',
	SkillName: '音乐课程',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.LG_PIETY] = {
	Name: 'LG_PIETY',
	SkillName: '虔诚',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_TRUST, 3]]
};
SkillInfo[SK.BA_MUSICALSTRIKE] = {
	Name: 'BA_MUSICALSTRIKE',
	SkillName: '旋律打击',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.BA_MUSICALLESSON, 3]]
};
SkillInfo[SK.LG_PRESTIGE] = {
	Name: 'LG_PRESTIGE',
	SkillName: '威望',
	MaxLv: 5,
	SpAmount: [75, 80, 85, 90, 95],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_TRAMPLE, 3]]
};
SkillInfo[SK.BA_DISSONANCE] = {
	Name: 'BA_DISSONANCE',
	SkillName: '无拘小夜曲',
	MaxLv: 5,
	SpAmount: [35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BD_ADAPTATION, 1],
		[SK.BA_MUSICALLESSON, 1]
	]
};
SkillInfo[SK.ALL_ODINS_POWER] = {
	Name: 'ALL_ODINS_POWER',
	SkillName: '奥丁之力',
	MaxLv: 2,
	SpAmount: [70, 100],
	bSeperateLv: false,
	AttackRange: [9, 9]
};
SkillInfo[SK.BA_FROSTJOKE] = {
	Name: 'BA_FROSTJOKE',
	SkillName: '解放八度音',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.BD_ENCORE, 1]]
};
SkillInfo[SK.LG_EXEEDBREAK] = {
	Name: 'LG_EXEEDBREAK',
	SkillName: '超越突破',
	MaxLv: 5,
	SpAmount: [20, 32, 44, 56, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_BANISHINGPOINT, 3]]
};
SkillInfo[SK.BA_WHISTLE] = {
	Name: 'BA_WHISTLE',
	SkillName: '完美谱表',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.MG_LIGHTNINGBOLT] = {
	Name: 'MG_LIGHTNINGBOLT',
	SkillName: '雷击术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BA_ASSASSINCROSS] = {
	Name: 'BA_ASSASSINCROSS',
	SkillName: '震撼即兴段',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.LG_RAGEBURST] = {
	Name: 'LG_RAGEBURST',
	SkillName: '爆发攻击',
	MaxLv: 1,
	SpAmount: [150],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.LG_FORCEOFVANGUARD, 1]]
};
SkillInfo[SK.BA_POEMBRAGI] = {
	Name: 'BA_POEMBRAGI',
	SkillName: '魔法琴弦',
	MaxLv: 10,
	SpAmount: [65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.ML_DEVOTION] = {
	Name: 'ML_DEVOTION',
	SkillName: '牺牲',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [7, 8, 9, 10, 11]
};
SkillInfo[SK.BA_APPLEIDUN] = {
	Name: 'BA_APPLEIDUN',
	SkillName: '鲁蒂之歌',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.LG_TRAMPLE] = {
	Name: 'LG_TRAMPLE',
	SkillName: '践踏',
	MaxLv: 3,
	SpAmount: [30, 45, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DC_DANCINGLESSON] = {
	Name: 'DC_DANCINGLESSON',
	SkillName: '舞蹈课程',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SC_MAELSTROM] = {
	Name: 'SC_MAELSTROM',
	SkillName: '大漩涡',
	MaxLv: 3,
	SpAmount: [50, 55, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [
		[SK.SC_CHAOSPANIC, 3],
		[SK.SC_UNLUCKY, 3]
	]
};
SkillInfo[SK.DC_THROWARROW] = {
	Name: 'DC_THROWARROW',
	SkillName: '投掷箭',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.DC_DANCINGLESSON, 3]]
};
SkillInfo[SK.SC_CHAOSPANIC] = {
	Name: 'SC_CHAOSPANIC',
	SkillName: '混沌恐慌',
	MaxLv: 3,
	SpAmount: [30, 36, 42],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_MANHOLE, 1]]
};
SkillInfo[SK.DC_UGLYDANCE] = {
	Name: 'DC_UGLYDANCE',
	SkillName: '臀部摇摆',
	MaxLv: 5,
	SpAmount: [35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BD_ADAPTATION, 1],
		[SK.DC_DANCINGLESSON, 1]
	]
};
SkillInfo[SK.SC_DIMENSIONDOOR] = {
	Name: 'SC_DIMENSIONDOOR',
	SkillName: '次元门',
	MaxLv: 3,
	SpAmount: [30, 36, 42],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_MANHOLE, 1]]
};
SkillInfo[SK.DC_SCREAM] = {
	Name: 'DC_SCREAM',
	SkillName: '眩目',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_ENCORE, 1]]
};
SkillInfo[SK.SC_MANHOLE] = {
	Name: 'SC_MANHOLE',
	SkillName: '下水道井盖',
	MaxLv: 3,
	SpAmount: [20, 25, 30],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.RG_FLAGGRAFFITI, 1]]
};
SkillInfo[SK.DC_HUMMING] = {
	Name: 'DC_HUMMING',
	SkillName: '专注芭蕾',
	MaxLv: 10,
	SpAmount: [33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.EL_PYROTECHNIC] = {
	Name: 'EL_PYROTECHNIC',
	SkillName: '烟火术',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DC_DONTFORGETME] = {
	Name: 'DC_DONTFORGETME',
	SkillName: '迟缓优雅',
	MaxLv: 10,
	SpAmount: [38, 41, 44, 47, 50, 53, 56, 59, 62, 65],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_WEAKNESS] = {
	Name: 'SC_WEAKNESS',
	SkillName: '假面舞会-虚弱',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_ENERVATION, 1],
		[SK.SC_GROOMY, 1],
		[SK.SC_IGNORANCE, 1]
	]
};
SkillInfo[SK.DC_FORTUNEKISS] = {
	Name: 'DC_FORTUNEKISS',
	SkillName: '幸运女神',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_UNLUCKY] = {
	Name: 'SC_UNLUCKY',
	SkillName: '假面舞会-不幸',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_LAZINESS, 1],
		[SK.SC_WEAKNESS, 1]
	]
};
SkillInfo[SK.DC_SERVICEFORYOU] = {
	Name: 'DC_SERVICEFORYOU',
	SkillName: '吉普赛之吻',
	MaxLv: 10,
	SpAmount: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_IGNORANCE] = {
	Name: 'SC_IGNORANCE',
	SkillName: '假面舞会-无知',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.SC_GROOMY] = {
	Name: 'SC_GROOMY',
	SkillName: '假面舞会-阴郁',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.SC_INVISIBILITY] = {
	Name: 'SC_INVISIBILITY',
	SkillName: '隐身',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_UNLUCKY, 3],
		[SK.SC_AUTOSHADOWSPELL, 7],
		[SK.SC_DEADLYINFECT, 5]
	]
};
SkillInfo[SK.SC_AUTOSHADOWSPELL] = {
	Name: 'SC_AUTOSHADOWSPELL',
	SkillName: '影子法术',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_REPRODUCE, 5]]
};
SkillInfo[SK.SC_REPRODUCE] = {
	Name: 'SC_REPRODUCE',
	SkillName: '再现',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_PLAGIARISM, 5]]
};
SkillInfo[SK.SC_FATALMENACE] = {
	Name: 'SC_FATALMENACE',
	SkillName: '致命威胁',
	MaxLv: 10,
	SpAmount: [10, 14, 18, 22, 26, 30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_INTIMIDATE, 5]]
};
SkillInfo[SK.NC_MAGICDECOY] = {
	Name: 'NC_MAGICDECOY',
	SkillName: 'FAW 魔法诱饵',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_SILVERSNIPER, 2]]
};
SkillInfo[SK.WE_MALE] = {
	Name: 'WE_MALE',
	SkillName: '爱的触碰',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NC_AXEBOOMERANG] = {
	Name: 'NC_AXEBOOMERANG',
	SkillName: '斧头回旋镖',
	MaxLv: 5,
	SpAmount: [20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NC_TRAININGAXE, 1]]
};
SkillInfo[SK.WE_FEMALE] = {
	Name: 'WE_FEMALE',
	SkillName: '不灭之爱',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MG_THUNDERSTORM] = {
	Name: 'MG_THUNDERSTORM',
	SkillName: '雷暴',
	MaxLv: 10,
	SpAmount: [29, 34, 39, 44, 49, 54, 59, 64, 69, 74],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_LIGHTNINGBOLT, 4]]
};
SkillInfo[SK.WE_CALLPARTNER] = {
	Name: 'WE_CALLPARTNER',
	SkillName: '浪漫约会！！',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NC_RESEARCHFE] = {
	Name: 'NC_RESEARCHFE',
	SkillName: '火地属性研究',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.ITM_TOMAHAWK] = {
	Name: 'ITM_TOMAHAWK',
	SkillName: '投掷战斧',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NC_STEALTHFIELD] = {
	Name: 'NC_STEALTHFIELD',
	SkillName: '隐形力场',
	MaxLv: 3,
	SpAmount: [80, 100, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.NC_ANALYZE, 3],
		[SK.NC_NEUTRALBARRIER, 2]
	]
};
SkillInfo[SK.NC_INFRAREDSCAN] = {
	Name: 'NC_INFRAREDSCAN',
	SkillName: '红外扫描',
	MaxLv: 1,
	SpAmount: [45],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_SHAPESHIFT, 2]]
};
SkillInfo[SK.NC_EMERGENCYCOOL] = {
	Name: 'NC_EMERGENCYCOOL',
	SkillName: '冷却',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_SELFDESTRUCTION, 2]]
};
SkillInfo[SK.NC_SHAPESHIFT] = {
	Name: 'NC_SHAPESHIFT',
	SkillName: '元素转换',
	MaxLv: 4,
	SpAmount: [100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_MAINFRAME, 2]]
};
SkillInfo[SK.NC_SELFDESTRUCTION] = {
	Name: 'NC_SELFDESTRUCTION',
	SkillName: '自杀性破坏',
	MaxLv: 3,
	SpAmount: [200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MAINFRAME, 2]]
};
SkillInfo[SK.NC_MAINFRAME] = {
	Name: 'NC_MAINFRAME',
	SkillName: '重塑主机',
	MaxLv: 4,
	SpAmount: [0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 4]]
};
SkillInfo[SK.NC_ACCELERATION] = {
	Name: 'NC_ACCELERATION',
	SkillName: '加速',
	MaxLv: 3,
	SpAmount: [20, 40, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 1]]
};
SkillInfo[SK.NC_ARMSCANNON] = {
	Name: 'NC_ARMSCANNON',
	SkillName: '手臂加农炮',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NC_FLAMELAUNCHER, 2],
		[SK.NC_COLDSLOWER, 2]
	]
};
SkillInfo[SK.NC_VULCANARM] = {
	Name: 'NC_VULCANARM',
	SkillName: '火神炮臂',
	MaxLv: 3,
	SpAmount: [9, 12, 15],
	bSeperateLv: true,
	AttackRange: [13, 13, 13],
	_NeedSkillList: [[SK.NC_BOOSTKNUCKLE, 2]]
};
SkillInfo[SK.RA_ICEBOUNDTRAP] = {
	Name: 'RA_ICEBOUNDTRAP',
	SkillName: '冰冻陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_DETONATOR, 1]]
};
SkillInfo[SK.RA_FIRINGTRAP] = {
	Name: 'RA_FIRINGTRAP',
	SkillName: '火焰陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_DETONATOR, 1]]
};
SkillInfo[SK.RA_VERDURETRAP] = {
	Name: 'RA_VERDURETRAP',
	SkillName: '翠绿陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.RA_COBALTTRAP] = {
	Name: 'RA_COBALTTRAP',
	SkillName: '钴蓝陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.RA_SENSITIVEKEEN] = {
	Name: 'RA_SENSITIVEKEEN',
	SkillName: '敏锐嗅觉',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_TOOTHOFWUG, 3]]
};
SkillInfo[SK.RA_TOOTHOFWUG] = {
	Name: 'RA_TOOTHOFWUG',
	SkillName: '座狼之牙',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_WUGMASTERY, 1]]
};
SkillInfo[SK.RA_WUGDASH] = {
	Name: 'RA_WUGDASH',
	SkillName: '座狼冲刺',
	MaxLv: 1,
	SpAmount: [4],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RA_WUGRIDER, 1]]
};
SkillInfo[SK.RA_ELECTRICSHOCKER] = {
	Name: 'RA_ELECTRICSHOCKER',
	SkillName: '电击',
	MaxLv: 5,
	SpAmount: [35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SHOCKWAVE, 5]]
};
SkillInfo[SK.RA_DETONATOR] = {
	Name: 'RA_DETONATOR',
	SkillName: '引爆器',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.RA_CLUSTERBOMB, 3]]
};
SkillInfo[SK.RA_AIMEDBOLT] = {
	Name: 'RA_AIMEDBOLT',
	SkillName: '瞄准射击',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.HT_ANKLESNARE, 5]]
};
SkillInfo[SK.RA_RANGERMAIN] = {
	Name: 'RA_RANGERMAIN',
	SkillName: '主力游侠',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RA_FEARBREEZE] = {
	Name: 'RA_FEARBREEZE',
	SkillName: '恐惧微风',
	MaxLv: 5,
	SpAmount: [55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RA_ARROWSTORM, 5],
		[SK.RA_CAMOUFLAGE, 1]
	]
};
SkillInfo[SK.WL_RELEASE] = {
	Name: 'WL_RELEASE',
	SkillName: '释放',
	MaxLv: 2,
	SpAmount: [10, 10],
	bSeperateLv: true,
	AttackRange: [11, 11]
};
SkillInfo[SK.WL_SUMMONSTONE] = {
	Name: 'WL_SUMMONSTONE',
	SkillName: '召唤岩石',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 1]]
};
SkillInfo[SK.WL_SUMMONFB] = {
	Name: 'WL_SUMMONFB',
	SkillName: '召唤火球',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_METEOR, 1]]
};
SkillInfo[SK.WL_CHAINLIGHTNING] = {
	Name: 'WL_CHAINLIGHTNING',
	SkillName: '连锁闪电',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONBL, 1]]
};
SkillInfo[SK.WL_COMET] = {
	Name: 'WL_COMET',
	SkillName: '彗星',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_HELLINFERNO, 3]]
};
SkillInfo[SK.WL_DRAINLIFE] = {
	Name: 'WL_DRAINLIFE',
	SkillName: '生命吸取',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_RADIUS, 1]]
};
SkillInfo[SK.WL_RECOGNIZEDSPELL] = {
	Name: 'WL_RECOGNIZEDSPELL',
	SkillName: '识破法术',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.WL_RELEASE, 2],
		[SK.WL_STASIS, 1],
		[SK.WL_WHITEIMPRISON, 1]
	]
};
SkillInfo[SK.AL_DP] = {
	Name: 'AL_DP',
	SkillName: 'Divine Protection',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	NeedSkillList: { [JobId.CRUSADER]: [[SK.AL_CURE, 1]] }
};
SkillInfo[SK.WL_MARSHOFABYSS] = {
	Name: 'WL_MARSHOFABYSS',
	SkillName: 'Marsh Of Abyss',
	MaxLv: 5,
	SpAmount: [40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WZ_QUAGMIRE, 1]]
};
SkillInfo[SK.WL_JACKFROST] = {
	Name: 'WL_JACKFROST',
	SkillName: 'Jack Frost',
	MaxLv: 5,
	SpAmount: [50, 60, 70, 80, 90],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_FROSTMISTY, 2]]
};
SkillInfo[SK.WL_FROSTMISTY] = {
	Name: 'WL_FROSTMISTY',
	SkillName: 'Frost Misty',
	MaxLv: 5,
	SpAmount: [40, 48, 56, 64, 72],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONWB, 1]]
};
SkillInfo[SK.WL_SOULEXPANSION] = {
	Name: 'WL_SOULEXPANSION',
	SkillName: 'Soul Expansion',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_DRAINLIFE, 1]]
};
SkillInfo[SK.AB_EXPIATIO] = {
	Name: 'AB_EXPIATIO',
	SkillName: 'Expiatio',
	MaxLv: 5,
	SpAmount: [35, 40, 45, 50, 55],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_DUPLELIGHT, 5],
		[SK.AB_ORATIO, 5]
	]
};
SkillInfo[SK.LK_AURABLADE] = {
	Name: 'LK_AURABLADE',
	SkillName: 'Aura Blade',
	MaxLv: 5,
	SpAmount: [18, 26, 34, 42, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_MAGNUM, 5],
		[SK.SM_TWOHAND, 5]
	]
};
SkillInfo[SK.AB_RENOVATIO] = {
	Name: 'AB_RENOVATIO',
	SkillName: 'Renovatio',
	MaxLv: 4,
	SpAmount: [240, 280, 320, 360],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_CHEAL, 3]]
};
SkillInfo[SK.LK_PARRYING] = {
	Name: 'LK_PARRYING',
	SkillName: 'Parry',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_PROVOKE, 5],
		[SK.SM_TWOHAND, 10],
		[SK.KN_TWOHANDQUICKEN, 3]
	]
};
SkillInfo[SK.AB_LAUDAAGNUS] = {
	Name: 'AB_LAUDAAGNUS',
	SkillName: 'Lauda Agnus',
	MaxLv: 4,
	SpAmount: [50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_STRECOVERY, 1]]
};
SkillInfo[SK.LK_CONCENTRATION] = {
	Name: 'LK_CONCENTRATION',
	SkillName: 'Spear Dynamo',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_RECOVERY, 5],
		[SK.KN_SPEARMASTERY, 5],
		[SK.KN_RIDING, 1]
	]
};
SkillInfo[SK.AB_ORATIO] = {
	Name: 'AB_ORATIO',
	SkillName: 'Oratio',
	MaxLv: 10,
	SpAmount: [35, 38, 41, 44, 47, 50, 53, 56, 59, 62],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_PRAEFATIO, 5]]
};
SkillInfo[SK.LK_TENSIONRELAX] = {
	Name: 'LK_TENSIONRELAX',
	SkillName: 'Relax',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SM_PROVOKE, 5],
		[SK.SM_RECOVERY, 10],
		[SK.SM_ENDURE, 3]
	]
};
SkillInfo[SK.AB_PRAEFATIO] = {
	Name: 'AB_PRAEFATIO',
	SkillName: 'Praefatio',
	MaxLv: 10,
	SpAmount: [90, 100, 110, 120, 130, 140, 150, 160, 170, 180],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_KYRIE, 1]]
};
SkillInfo[SK.LK_BERSERK] = {
	Name: 'LK_BERSERK',
	SkillName: 'Frenzy',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AB_EPICLESIS] = {
	Name: 'AB_EPICLESIS',
	SkillName: 'Epiclesis',
	MaxLv: 5,
	SpAmount: [300, 300, 300, 300, 300],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_ANCILLA, 1],
		[SK.AB_HIGHNESSHEAL, 1]
	]
};
SkillInfo[SK.AB_CHEAL] = {
	Name: 'AB_CHEAL',
	SkillName: 'Coluseo Heal',
	MaxLv: 3,
	SpAmount: [200, 220, 240],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_HEAL, 1]]
};
SkillInfo[SK.AB_ANCILLA] = {
	Name: 'AB_ANCILLA',
	SkillName: 'Ancilla',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AB_CLEMENTIA, 3]]
};
SkillInfo[SK.HP_ASSUMPTIO] = {
	Name: 'HP_ASSUMPTIO',
	SkillName: 'Assumptio',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_ANGELUS, 1],
		[SK.MG_SRECOVERY, 3],
		[SK.PR_IMPOSITIO, 3]
	]
};
SkillInfo[SK.GC_HALLUCINATIONWALK] = {
	Name: 'GC_HALLUCINATIONWALK',
	SkillName: 'Hallucination Walk',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_PHANTOMMENACE, 1]]
};
SkillInfo[SK.HP_BASILICA] = {
	Name: 'HP_BASILICA',
	SkillName: 'Basilica',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_GLORIA, 2],
		[SK.MG_SRECOVERY, 1],
		[SK.PR_KYRIE, 3]
	]
};
SkillInfo[SK.GC_VENOMPRESSURE] = {
	Name: 'GC_VENOMPRESSURE',
	SkillName: 'Venom Pressure',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.GC_WEAPONBLOCKING, 1],
		[SK.GC_POISONINGWEAPON, 3]
	]
};
SkillInfo[SK.HP_MEDITATIO] = {
	Name: 'HP_MEDITATIO',
	SkillName: 'Meditation',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 5],
		[SK.PR_LEXDIVINA, 5],
		[SK.PR_ASPERSIO, 3]
	]
};
SkillInfo[SK.GC_WEAPONCRUSH] = {
	Name: 'GC_WEAPONCRUSH',
	SkillName: 'Weapon Crush',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_WEAPONBLOCKING, 1]]
};
SkillInfo[SK.HW_SOULDRAIN] = {
	Name: 'HW_SOULDRAIN',
	SkillName: 'Soul Drain',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 5],
		[SK.MG_SOULSTRIKE, 7]
	]
};
SkillInfo[SK.GC_POISONINGWEAPON] = {
	Name: 'GC_POISONINGWEAPON',
	SkillName: 'Poisonous Weapon',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_CREATENEWPOISON, 1]]
};
SkillInfo[SK.HW_MAGICCRASHER] = {
	Name: 'HW_MAGICCRASHER',
	SkillName: 'Stave Crasher',
	MaxLv: 1,
	SpAmount: [8],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.MG_SRECOVERY, 1]]
};
SkillInfo[SK.GC_DARKILLUSION] = {
	Name: 'GC_DARKILLUSION',
	SkillName: 'Dark Illusion',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.GC_CROSSIMPACT, 3]]
};
SkillInfo[SK.HW_MAGICPOWER] = {
	Name: 'HW_MAGICPOWER',
	SkillName: 'Mystical Amplification',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_ABUNDANCE] = {
	Name: 'RK_ABUNDANCE',
	SkillName: 'Abundance',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PA_PRESSURE] = {
	Name: 'PA_PRESSURE',
	SkillName: 'Gloria Domini',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SM_ENDURE, 5],
		[SK.CR_TRUST, 5],
		[SK.CR_SHIELDCHARGE, 2]
	]
};
SkillInfo[SK.AL_DEMONBANE] = {
	Name: 'AL_DEMONBANE',
	SkillName: 'Demon Bane',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DP, 3]]
};
SkillInfo[SK.PA_SACRIFICE] = {
	Name: 'PA_SACRIFICE',
	SkillName: "Martyr's Reckoning",
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SM_ENDURE, 1],
		[SK.CR_DEVOTION, 3]
	]
};
SkillInfo[SK.RK_STONEHARDSKIN] = {
	Name: 'RK_STONEHARDSKIN',
	SkillName: 'Skin of Stone',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PA_GOSPEL] = {
	Name: 'PA_GOSPEL',
	SkillName: 'Battle Chant',
	MaxLv: 10,
	SpAmount: [80, 80, 80, 80, 80, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.CR_TRUST, 8],
		[SK.AL_DP, 3],
		[SK.AL_DEMONBANE, 5]
	]
};
SkillInfo[SK.RK_GIANTGROWTH] = {
	Name: 'RK_GIANTGROWTH',
	SkillName: 'Giant Growth',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CH_PALMSTRIKE] = {
	Name: 'CH_PALMSTRIKE',
	SkillName: 'Raging Palm Strike',
	MaxLv: 5,
	SpAmount: [2, 4, 6, 8, 10],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 7],
		[SK.MO_CALLSPIRITS, 5]
	]
};
SkillInfo[SK.RK_MILLENNIUMSHIELD] = {
	Name: 'RK_MILLENNIUMSHIELD',
	SkillName: 'Millenium Shield',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CH_TIGERFIST] = {
	Name: 'CH_TIGERFIST',
	SkillName: 'Glacier Fist',
	MaxLv: 5,
	SpAmount: [4, 6, 8, 10, 12],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_TRIPLEATTACK, 5],
		[SK.MO_COMBOFINISH, 3]
	]
};
SkillInfo[SK.RK_DRAGONTRAINING] = {
	Name: 'RK_DRAGONTRAINING',
	SkillName: 'Dragon Training',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_CAVALIERMASTERY, 1]]
};
SkillInfo[SK.CH_CHAINCRUSH] = {
	Name: 'CH_CHAINCRUSH',
	SkillName: 'Chain Crush Combo',
	MaxLv: 10,
	SpAmount: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_CALLSPIRITS, 5],
		[SK.CH_TIGERFIST, 2]
	]
};
SkillInfo[SK.RK_DEATHBOUND] = {
	Name: 'RK_DEATHBOUND',
	SkillName: 'Death Bound',
	MaxLv: 10,
	SpAmount: [50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.KN_AUTOCOUNTER, 1],
		[SK.RK_ENCHANTBLADE, 2]
	]
};
SkillInfo[SK.PF_HPCONVERSION] = {
	Name: 'PF_HPCONVERSION',
	SkillName: 'Indulge',
	MaxLv: 5,
	SpAmount: [1, 2, 3, 4, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 1],
		[SK.SA_MAGICROD, 1]
	]
};
SkillInfo[SK.HVAN_INSTRUCT] = {
	Name: 'HVAN_INSTRUCT',
	SkillName: 'Instruction Change',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.PF_SOULCHANGE] = {
	Name: 'PF_SOULCHANGE',
	SkillName: 'Soul Exhale',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [
		[SK.SA_MAGICROD, 3],
		[SK.SA_SPELLBREAKER, 2]
	]
};
SkillInfo[SK.MH_STAHL_HORN] = {
	Name: 'MH_STAHL_HORN',
	SkillName: 'Stahl Horn',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9]
};
SkillInfo[SK.PF_SOULBURN] = {
	Name: 'PF_SOULBURN',
	SkillName: 'Soul Siphon',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_CASTCANCEL, 5],
		[SK.SA_MAGICROD, 3],
		[SK.SA_DISPELL, 3]
	]
};
SkillInfo[SK.NPC_MAGICMIRROR] = {
	Name: 'NPC_MAGICMIRROR',
	SkillName: 'Magic Mirror',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ASC_KATAR] = {
	Name: 'ASC_KATAR',
	SkillName: '高级拳刃精通',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TF_DOUBLE, 5],
		[SK.AS_KATAR, 7]
	]
};
SkillInfo[SK.DA_DREAM] = {
	Name: 'DA_DREAM',
	SkillName: '梦境',
	MaxLv: 5,
	SpAmount: [600, 500, 400, 300, 200],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_SPACE] = {
	Name: 'DA_SPACE',
	SkillName: '空间',
	MaxLv: 5,
	SpAmount: [120, 100, 80, 60, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.GD_EMERGENCYCALL] = {
	Name: 'GD_EMERGENCYCALL',
	SkillName: '紧急召回',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ASC_EDP] = {
	Name: 'ASC_EDP',
	SkillName: '致命毒附加',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.ASC_CDP, 1]]
};
SkillInfo[SK.DE_NIGHTMARE] = {
	Name: 'DE_NIGHTMARE',
	SkillName: '梦魇',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [4]
};
SkillInfo[SK.ASC_BREAKER] = {
	Name: 'ASC_BREAKER',
	SkillName: '灵魂破坏',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.TF_DOUBLE, 5],
		[SK.TF_POISON, 5],
		[SK.AS_CLOAKING, 3],
		[SK.AS_ENCHANTPOISON, 6]
	]
};
SkillInfo[SK.SL_GUNNER] = {
	Name: 'SL_GUNNER',
	SkillName: '枪手之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SN_SIGHT] = {
	Name: 'SN_SIGHT',
	SkillName: '猎鹰之眼',
	MaxLv: 10,
	SpAmount: [20, 20, 25, 25, 30, 30, 35, 35, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AC_OWL, 10],
		[SK.AC_VULTURE, 10],
		[SK.AC_CONCENTRATION, 10],
		[SK.HT_FALCON, 1]
	]
};
SkillInfo[SK.MB_MUNAKKNOWLEDGE] = {
	Name: 'MB_MUNAKKNOWLEDGE',
	SkillName:
		'ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã…â€™Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã¢â‚¬â€œÃƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [4]
};
SkillInfo[SK.SN_FALCONASSAULT] = {
	Name: 'SN_FALCONASSAULT',
	SkillName: '猎鹰突击',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AC_VULTURE, 5],
		[SK.HT_FALCON, 1],
		[SK.HT_BLITZBEAT, 5],
		[SK.HT_STEELCROW, 3]
	]
};
SkillInfo[SK.NJ_NEN] = {
	Name: 'NJ_NEN',
	SkillName: '忍者气息',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 5]]
};
SkillInfo[SK.SN_SHARPSHOOTING] = {
	Name: 'SN_SHARPSHOOTING',
	SkillName: '集中箭击',
	MaxLv: 5,
	SpAmount: [16, 18, 20, 22, 24],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AC_DOUBLE, 5],
		[SK.AC_CONCENTRATION, 10]
	]
};
SkillInfo[SK.NJ_TATAMIGAESHI] = {
	Name: 'NJ_TATAMIGAESHI',
	SkillName: '翻转榻榻米',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GS_CHAINACTION] = {
	Name: 'GS_CHAINACTION',
	SkillName: '连锁行动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 1]]
};
SkillInfo[SK.KO_YAMIKUMO] = {
	Name: 'KO_YAMIKUMO',
	SkillName: '暗影隐藏',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NJ_KIRIKAGE, 5]]
};
SkillInfo[SK.KO_RIGHT] = {
	Name: 'KO_RIGHT',
	SkillName: '右手精通',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.KO_LEFT] = {
	Name: 'KO_LEFT',
	SkillName: '左手精通',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.KO_JYUMONJIKIRI] = {
	Name: 'KO_JYUMONJIKIRI',
	SkillName: '十字斩',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7],
	_NeedSkillList: [[SK.KO_YAMIKUMO, 1]]
};
SkillInfo[SK.KO_SETSUDAN] = {
	Name: 'KO_SETSUDAN',
	SkillName: '灵魂切割',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.KO_JYUMONJIKIRI, 2]]
};
SkillInfo[SK.KO_BAKURETSU] = {
	Name: 'KO_BAKURETSU',
	SkillName: '苦无爆炸',
	MaxLv: 5,
	SpAmount: [5, 6, 7, 8, 9],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.NJ_KUNAI, 5]]
};
SkillInfo[SK.KO_HAPPOKUNAI] = {
	Name: 'KO_HAPPOKUNAI',
	SkillName: '苦无溅射',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KO_BAKURETSU, 1]]
};
SkillInfo[SK.KO_MUCHANAGE] = {
	Name: 'KO_MUCHANAGE',
	SkillName: '快速投掷',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.KO_MAKIBISHI, 3]]
};
SkillInfo[SK.KO_HUUMARANKA] = {
	Name: 'KO_HUUMARANKA',
	SkillName: '旋转花瓣',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.NJ_HUUMA, 5]]
};
SkillInfo[SK.KO_MAKIBISHI] = {
	Name: 'KO_MAKIBISHI',
	SkillName: '撒菱',
	MaxLv: 5,
	SpAmount: [9, 12, 15, 18, 21],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.NJ_ZENYNAGE, 1]]
};
SkillInfo[SK.KO_MEIKYOUSISUI] = {
	Name: 'KO_MEIKYOUSISUI',
	SkillName: '纯净灵魂',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 10]]
};
SkillInfo[SK.KO_ZANZOU] = {
	Name: 'KO_ZANZOU',
	SkillName: '幻影 - 暗影',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_UTSUSEMI, 1]]
};
SkillInfo[SK.KO_KYOUGAKU] = {
	Name: 'KO_KYOUGAKU',
	SkillName: '幻影 - 冲击',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.KO_GENWAKU, 2]]
};
SkillInfo[SK.KO_JYUSATSU] = {
	Name: 'KO_JYUSATSU',
	SkillName: '幻影 - 死亡',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.KO_KYOUGAKU, 3]]
};
SkillInfo[SK.KO_KAHU_ENTEN] = {
	Name: 'KO_KAHU_ENTEN',
	SkillName: '火符',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_HYOUHU_HUBUKI] = {
	Name: 'KO_HYOUHU_HUBUKI',
	SkillName: '冰符',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_KAZEHU_SEIRAN] = {
	Name: 'KO_KAZEHU_SEIRAN',
	SkillName: '风符',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_DOHU_KOUKAI] = {
	Name: 'KO_DOHU_KOUKAI',
	SkillName: '地符',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_KAIHOU] = {
	Name: 'KO_KAIHOU',
	SkillName: '释放忍术',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.KO_KAHU_ENTEN, 1],
		[SK.KO_HYOUHU_HUBUKI, 1],
		[SK.KO_KAZEHU_SEIRAN, 1],
		[SK.KO_DOHU_KOUKAI, 1]
	]
};
SkillInfo[SK.KO_ZENKAI] = {
	Name: 'KO_ZENKAI',
	SkillName: '施放忍术',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.KO_KAIHOU, 1],
		[SK.KO_IZAYOI, 1]
	]
};
SkillInfo[SK.KO_GENWAKU] = {
	Name: 'KO_GENWAKU',
	SkillName: '幻影 - 魅惑',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NJ_UTSUSEMI, 1]]
};
SkillInfo[SK.KO_IZAYOI] = {
	Name: 'KO_IZAYOI',
	SkillName: '十六夜',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 5]]
};
SkillInfo[SK.KG_KAGEHUMI] = {
	Name: 'KG_KAGEHUMI',
	SkillName: '暗影践踏',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [5, 7, 9, 11, 13],
	_NeedSkillList: [[SK.KO_ZANZOU, 1]]
};
SkillInfo[SK.KG_KYOMU] = {
	Name: 'KG_KYOMU',
	SkillName: '空影',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KG_KAGEHUMI, 2]]
};
SkillInfo[SK.KG_KAGEMUSYA] = {
	Name: 'KG_KAGEMUSYA',
	SkillName: '暗影战士',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KG_KYOMU, 3]]
};
SkillInfo[SK.OB_ZANGETSU] = {
	Name: 'OB_ZANGETSU',
	SkillName: '扭曲新月',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.KO_GENWAKU, 1]]
};
SkillInfo[SK.OB_OBOROGENSOU] = {
	Name: 'OB_OBOROGENSOU',
	SkillName: '月光幻想',
	MaxLv: 5,
	SpAmount: [55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.OB_AKAITSUKI, 3]]
};
SkillInfo[SK.OB_AKAITSUKI] = {
	Name: 'OB_AKAITSUKI',
	SkillName: '不祥月光',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.OB_ZANGETSU, 2]]
};
SkillInfo[SK.ECLAGE_RECALL] = {
	Name: 'ECLAGE_RECALL',
	SkillName: '返回艾可拉斯',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ECL_SNOWFLIP] = {
	Name: 'ECL_SNOWFLIP',
	SkillName: '雪花翻转',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_PEONYMAMY] = {
	Name: 'ECL_PEONYMAMY',
	SkillName: '牡丹妈妈',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_SADAGUI] = {
	Name: 'ECL_SADAGUI',
	SkillName: '拍打草药',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_SEQUOIADUST] = {
	Name: 'ECL_SEQUOIADUST',
	SkillName: '世界树尘埃',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ALL_RAY_OF_PROTECTION] = {
	Name: 'ALL_RAY_OF_PROTECTION',
	SkillName:
		'ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¶ÃƒÆ’Ã‹â€ Ãƒâ€šÃ‚Â£ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã¢â‚¬Â¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â» ',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MER_INVINCIBLEOFF2] = {
	Name: 'MER_INVINCIBLEOFF2',
	SkillName: '精神爆破',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.GC_DARKCROW] = {
	Name: 'GC_DARKCROW',
	SkillName: '暗黑爪',
	MaxLv: 5,
	SpAmount: [22, 34, 46, 58, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_DARKILLUSION, 5]]
};
SkillInfo[SK.RA_UNLIMIT] = {
	Name: 'RA_UNLIMIT',
	SkillName: '无极限',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_FEARBREEZE, 5]]
};
SkillInfo[SK.LG_KINGS_GRACE] = {
	Name: 'LG_KINGS_GRACE',
	SkillName: '王者恩典',
	MaxLv: 5,
	SpAmount: [200, 180, 160, 140, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_REFLECTDAMAGE, 5]]
};
SkillInfo[SK.RK_DRAGONBREATH_WATER] = {
	Name: 'RK_DRAGONBREATH_WATER',
	SkillName: '龙之水息',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.NC_MAGMA_ERUPTION] = {
	Name: 'NC_MAGMA_ERUPTION',
	SkillName: '岩浆流',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_RESEARCHFE, 1]]
};
SkillInfo[SK.WM_FRIGG_SONG] = {
	Name: 'WM_FRIGG_SONG',
	SkillName: '弗丽嘉之歌',
	MaxLv: 5,
	SpAmount: [200, 230, 260, 290, 320],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 2]]
};
SkillInfo[SK.SO_ELEMENTAL_SHIELD] = {
	Name: 'SO_ELEMENTAL_SHIELD',
	SkillName: '元素护盾',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.SR_FLASHCOMBO] = {
	Name: 'SR_FLASHCOMBO',
	SkillName: '闪光连击',
	MaxLv: 5,
	SpAmount: [65, 65, 65, 65, 65],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SR_DRAGONCOMBO, 3],
		[SK.SR_FALLENEMPIRE, 3],
		[SK.SR_SKYNETBLOW, 1],
		[SK.SR_TIGERCANNON, 5]
	]
};
SkillInfo[SK.SC_ESCAPE] = {
	Name: 'SC_ESCAPE',
	SkillName: '紧急逃脱',
	MaxLv: 5,
	SpAmount: [30, 26, 22, 18, 14],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_TRIANGLESHOT, 2]]
};
SkillInfo[SK.AB_OFFERTORIUM] = {
	Name: 'AB_OFFERTORIUM',
	SkillName: '奉献祷告',
	MaxLv: 5,
	SpAmount: [30, 60, 90, 120, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AB_HIGHNESSHEAL, 2]]
};
SkillInfo[SK.WL_TELEKINESIS_INTENSE] = {
	Name: 'WL_TELEKINESIS_INTENSE',
	SkillName: '强化',
	MaxLv: 5,
	SpAmount: [100, 150, 200, 250, 300],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_SOULEXPANSION, 5]]
};
SkillInfo[SK.ALL_FULL_THROTTLE] = {
	Name: 'ALL_FULL_THROTTLE',
	SkillName: '全油门',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.GN_ILLUSIONDOPING] = {
	Name: 'GN_ILLUSIONDOPING',
	SkillName: '幻觉药剂',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 1]]
};
SkillInfo[SK.GM_ITEM_ATKMAX] = {
	Name: 'GM_ITEM_ATKMAX',
	SkillName: '未知名称',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_ATKMIN] = {
	Name: 'GM_ITEM_ATKMIN',
	SkillName: '物理物品攻击倍率上限',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_MATKMAX] = {
	Name: 'GM_ITEM_MATKMAX',
	SkillName: '物理物品攻击倍率下限',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_MATKMIN] = {
	Name: 'GM_ITEM_MATKMIN',
	SkillName: '魔法物品攻击倍率下限',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RL_D_TAIL] = {
	Name: 'RL_D_TAIL',
	SkillName: '龙尾',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.RL_H_MINE, 3],
		[SK.RL_C_MARKER, 1]
	]
};
SkillInfo[SK.RL_R_TRIP] = {
	Name: 'RL_R_TRIP',
	SkillName: '回旋射击',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_FIRE_RAIN, 1]]
};
SkillInfo[SK.RL_RICHS_COIN] = {
	Name: 'RL_RICHS_COIN',
	SkillName: '里奇的硬币',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_GLITTERING, 5]]
};
SkillInfo[SK.RL_MASS_SPIRAL] = {
	Name: 'RL_MASS_SPIRAL',
	SkillName: '质量螺旋',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [15, 15, 15, 15, 15],
	_NeedSkillList: [[SK.GS_PIERCINGSHOT, 1]]
};
SkillInfo[SK.RL_B_TRAP] = {
	Name: 'RL_B_TRAP',
	SkillName: '束缚陷阱',
	MaxLv: 5,
	SpAmount: [30, 32, 34, 36, 38],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_FLICKER, 1]]
};
SkillInfo[SK.RL_BANISHING_BUSTER] = {
	Name: 'RL_BANISHING_BUSTER',
	SkillName: '消失爆破',
	MaxLv: 10,
	SpAmount: [55, 57, 59, 61, 63, 65, 67, 69, 71, 73],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RL_S_STORM, 1]]
};
SkillInfo[SK.RL_S_STORM] = {
	Name: 'RL_S_STORM',
	SkillName: '碎裂风暴',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.GS_DISARM, 1],
		[SK.GS_DUST, 1]
	]
};
SkillInfo[SK.RL_SLUGSHOT] = {
	Name: 'RL_SLUGSHOT',
	SkillName: '独头弹射击',
	MaxLv: 5,
	SpAmount: [80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RL_BANISHING_BUSTER, 3]]
};
SkillInfo[SK.RL_AM_BLAST] = {
	Name: 'RL_AM_BLAST',
	SkillName: '反物质爆破',
	MaxLv: 5,
	SpAmount: [80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [15, 15, 15, 15, 15],
	_NeedSkillList: [[SK.RL_MASS_SPIRAL, 1]]
};
SkillInfo[SK.RL_E_CHAIN] = {
	Name: 'RL_E_CHAIN',
	SkillName: '永恒锁链',
	MaxLv: 10,
	SpAmount: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [
		[SK.GS_GLITTERING, 1],
		[SK.GS_CHAINACTION, 10]
	]
};
SkillInfo[SK.RL_QD_SHOT] = {
	Name: 'RL_QD_SHOT',
	SkillName: '快速拔枪射击',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_CHAINACTION, 1]]
};
SkillInfo[SK.RL_C_MARKER] = {
	Name: 'RL_C_MARKER',
	SkillName: '猩红标记',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RL_FIREDANCE] = {
	Name: 'RL_FIREDANCE',
	SkillName: '火焰之舞',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.GS_DESPERADO, 1]]
};
SkillInfo[SK.RL_FIRE_RAIN] = {
	Name: 'RL_FIRE_RAIN',
	SkillName: '火焰之雨',
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.GS_GATLINGFEVER, 1]]
};
SkillInfo[SK.RL_FALLEN_ANGEL] = {
	Name: 'RL_FALLEN_ANGEL',
	SkillName: '堕落天使',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_DESPERADO, 10]]
};
SkillInfo[SK.RL_P_ALTER] = {
	Name: 'RL_P_ALTER',
	SkillName: '白金祭坛',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_RICHS_COIN, 1]]
};
SkillInfo[SK.RL_FLICKER] = {
	Name: 'RL_FLICKER',
	SkillName: '闪烁',
	MaxLv: 1,
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RL_H_MINE] = {
	Name: 'RL_H_MINE',
	SkillName: '咆哮地雷',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.GS_GROUNDDRIFT, 1]]
};
SkillInfo[SK.RL_HAMMER_OF_GOD] = {
	Name: 'RL_HAMMER_OF_GOD',
	SkillName: '神之锤',
	MaxLv: 10,
	SpAmount: [37, 39, 41, 43, 45, 47, 49, 51, 53, 55],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.RL_RICHS_COIN, 1],
		[SK.RL_AM_BLAST, 3]
	]
};
SkillInfo[SK.RL_HEAT_BARREL] = {
	Name: 'RL_HEAT_BARREL',
	SkillName: '击打木桶',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_RICHS_COIN, 1]]
};
SkillInfo[SK.MC_CARTDECORATE] = {
	Name: 'MC_CARTDECORATE',
	SkillName: '手推车装饰',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SU_BASIC_SKILL] = {
	Name: 'SU_BASIC_SKILL',
	SkillName: '新基础技能',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SU_BITE] = {
	Name: 'SU_BITE',
	SkillName: '撕咬',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.SU_BASIC_SKILL, 1]]
};
SkillInfo[SK.SU_HIDE] = {
	Name: 'SU_HIDE',
	SkillName: '隐藏',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_BITE, 1]]
};
SkillInfo[SK.SU_SCRATCH] = {
	Name: 'SU_SCRATCH',
	SkillName: '抓挠',
	MaxLv: 3,
	SpAmount: [20, 25, 30],
	bSeperateLv: true,
	AttackRange: [2, 2, 2],
	_NeedSkillList: [[SK.SU_HIDE, 1]]
};
SkillInfo[SK.SU_STOOP] = {
	Name: 'SU_STOOP',
	SkillName: '俯身',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_SCRATCH, 3]]
};
SkillInfo[SK.SU_LOPE] = {
	Name: 'SU_LOPE',
	SkillName: '小跑',
	MaxLv: 3,
	SpAmount: [30, 30, 30],
	bSeperateLv: false,
	AttackRange: [6, 10, 14],
	_NeedSkillList: [[SK.SU_STOOP, 1]]
};
SkillInfo[SK.SU_SPRITEMABLE] = {
	Name: 'SU_SPRITEMABLE',
	SkillName: '精灵梅布尔',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_LOPE, 3]]
};
SkillInfo[SK.SU_FRESHSHRIMP] = {
	Name: 'SU_FRESHSHRIMP',
	SkillName: '新鲜虾',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_BUNCHOFSHRIMP] = {
	Name: 'SU_BUNCHOFSHRIMP',
	SkillName: '一串虾',
	MaxLv: 5,
	SpAmount: [44, 48, 52, 56, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SU_FRESHSHRIMP, 3]]
};
SkillInfo[SK.SU_TUNABELLY] = {
	Name: 'SU_TUNABELLY',
	SkillName: '金枪鱼肚',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_BUNCHOFSHRIMP, 3]]
};
SkillInfo[SK.SU_TUNAPARTY] = {
	Name: 'SU_TUNAPARTY',
	SkillName: '金枪鱼派对',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_TUNABELLY, 3]]
};
SkillInfo[SK.SU_SV_STEMSPEAR] = {
	Name: 'SU_SV_STEMSPEAR',
	SkillName: 'SV 茎之矛',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_SV_ROOTTWIST] = {
	Name: 'SU_SV_ROOTTWIST',
	SkillName: 'SV 根之扭曲',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SV_STEMSPEAR, 3]]
};
SkillInfo[SK.SU_CN_METEOR] = {
	Name: 'SU_CN_METEOR',
	SkillName: 'CN 流星',
	MaxLv: 5,
	SpAmount: [20, 35, 50, 65, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SV_ROOTTWIST, 3]]
};
SkillInfo[SK.SU_CN_POWDERING] = {
	Name: 'SU_CN_POWDERING',
	SkillName: 'CN 撒粉',
	MaxLv: 5,
	SpAmount: [40, 36, 32, 28, 24],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_CN_METEOR, 3]]
};
SkillInfo[SK.SU_PICKYPECK] = {
	Name: 'SU_PICKYPECK',
	SkillName: '挑剔啄击',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_ARCLOUSEDASH] = {
	Name: 'SU_ARCLOUSEDASH',
	SkillName: '阿克鲁兹冲刺',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_PICKYPECK, 3]]
};
SkillInfo[SK.SU_SCAROFTAROU] = {
	Name: 'SU_SCAROFTAROU',
	SkillName: '塔罗之伤',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_ARCLOUSEDASH, 3]]
};
SkillInfo[SK.SU_LUNATICCARROTBEAT] = {
	Name: 'SU_LUNATICCARROTBEAT',
	SkillName: '疯兔胡萝卜打击',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SCAROFTAROU, 3]]
};
SkillInfo[SK.SU_POWEROFSEA] = {
	Name: 'SU_POWEROFSEA',
	SkillName: '海洋之力',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_TUNAPARTY, 3]]
};
SkillInfo[SK.SU_POWEROFLAND] = {
	Name: 'SU_POWEROFLAND',
	SkillName: '大地之力',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_CN_POWDERING, 3]]
};
SkillInfo[SK.SU_POWEROFLIFE] = {
	Name: 'SU_POWEROFLIFE',
	SkillName: '生命之力',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_LUNATICCARROTBEAT, 3]]
};
SkillInfo[SK.SU_SOULATTACK] = {
	Name: 'SU_SOULATTACK',
	SkillName: '灵魂攻击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_POWEROFFLOCK] = {
	Name: 'SU_POWEROFFLOCK',
	SkillName: '锁链之力',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_HISS, 5]]
};
SkillInfo[SK.SU_SVG_SPIRIT] = {
	Name: 'SU_SVG_SPIRIT',
	SkillName: '野性之魂',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_POWEROFFLOCK, 5]]
};
SkillInfo[SK.SU_HISS] = {
	Name: 'SU_HISS',
	SkillName: '嘶鸣',
	MaxLv: 5,
	SpAmount: [50, 46, 42, 38, 34],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFLIFE, 1]]
};
SkillInfo[SK.SU_NYANGGRASS] = {
	Name: 'SU_NYANGGRASS',
	SkillName: '喵杨草',
	MaxLv: 5,
	SpAmount: [50, 48, 46, 44, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_MEOWMEOW, 5]]
};
SkillInfo[SK.SU_GROOMING] = {
	Name: 'SU_GROOMING',
	SkillName: '梳理',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFSEA, 1]]
};
SkillInfo[SK.SU_PURRING] = {
	Name: 'SU_PURRING',
	SkillName: '呼噜',
	MaxLv: 5,
	SpAmount: [70, 65, 60, 55, 50],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_GROOMING, 5]]
};
SkillInfo[SK.SU_SHRIMPARTY] = {
	Name: 'SU_SHRIMPARTY',
	SkillName: '美味虾宴',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_PURRING, 5]]
};
SkillInfo[SK.SU_SPIRITOFLIFE] = {
	Name: 'SU_SPIRITOFLIFE',
	SkillName: '生命之魂',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_SVG_SPIRIT, 5]]
};
SkillInfo[SK.SU_MEOWMEOW] = {
	Name: 'SU_MEOWMEOW',
	SkillName: '喵喵',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_CHATTERING, 5]]
};
SkillInfo[SK.SU_SPIRITOFLAND] = {
	Name: 'SU_SPIRITOFLAND',
	SkillName: '大地之魂',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_NYANGGRASS, 5]]
};
SkillInfo[SK.SU_CHATTERING] = {
	Name: 'SU_CHATTERING',
	SkillName: '喋喋不休',
	MaxLv: 5,
	SpAmount: [50, 45, 40, 35, 30],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFLAND, 1]]
};
SkillInfo[SK.SU_SPIRITOFSEA] = {
	Name: 'SU_SPIRITOFSEA',
	SkillName: '海洋之魂',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_SHRIMPARTY, 5]]
};
SkillInfo[SK.ALL_PRONTERA_RECALL] = {
	Name: 'ALL_PRONTERA_RECALL',
	SkillName: '普隆德拉召回',
	MaxLv: 2,
	SpAmount: [0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1]
};
SkillInfo[SK.NPC_IGNITIONBREAK] = {
	Name: 'NPC_IGNITIONBREAK',
	SkillName: '爆燃斩',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_MANDRAGORA] = {
	Name: 'NPC_MANDRAGORA',
	SkillName: '曼陀罗嚎叫',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[13, 13],
		[15, 15],
		[17, 17],
		[19, 19]
	]
};
SkillInfo[SK.NPC_FATALMENACE] = {
	Name: 'NPC_FATALMENACE',
	SkillName: '致命威胁',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11]
	]
};
SkillInfo[SK.NPC_SR_CURSEDCIRCLE] = {
	Name: 'NPC_SR_CURSEDCIRCLE',
	SkillName: '诅咒之环',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11]
	]
};
SkillInfo[SK.NPC_JACKFROST] = {
	Name: 'NPC_JACKFROST',
	SkillName: '杰克冰霜',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[13, 13],
		[15, 15],
		[17, 17],
		[19, 19]
	]
};
SkillInfo[SK.NPC_VENOMFOG] = {
	Name: 'NPC_VENOMFOG',
	SkillName: '毒雾',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[27, 27]
	]
};
SkillInfo[SK.NPC_ASSASSINCROSS] = {
	Name: 'NPC_ASSASSINCROSS',
	SkillName: '华丽即兴曲',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_FLAMECROSS] = {
	Name: 'NPC_FLAMECROSS',
	SkillName: '火焰十字',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_ICEMINE] = {
	Name: 'NPC_ICEMINE',
	SkillName: '冰雷',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_DISSONANCE] = {
	Name: 'NPC_DISSONANCE',
	SkillName: '无拘小夜曲',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_UGLYDANCE] = {
	Name: 'NPC_UGLYDANCE',
	SkillName: '臀部摇摆',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_WIDEHEALTHFEAR] = {
	Name: 'NPC_WIDEHEALTHFEAR',
	SkillName: '广域恐惧',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDE_DEEP_SLEEP] = {
	Name: 'NPC_WIDE_DEEP_SLEEP',
	SkillName: '广域深度睡眠',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESIREN] = {
	Name: 'NPC_WIDESIREN',
	SkillName: '广域魅惑',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEBODYBURNNING] = {
	Name: 'NPC_WIDEBODYBURNNING',
	SkillName: '广域燃烧',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFROSTMISTY] = {
	Name: 'NPC_WIDEFROSTMISTY',
	SkillName: '广域霜雾',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECOLD] = {
	Name: 'NPC_WIDECOLD',
	SkillName: '广域冻结',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_CLOUD_KILL] = {
	Name: 'NPC_CLOUD_KILL',
	SkillName: '杀戮之云',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_RAYOFGENESIS] = {
	Name: 'NPC_RAYOFGENESIS',
	SkillName: '创世之光',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[17, 17],
		[17, 17],
		[23, 23],
		[23, 23],
		[27, 27],
		[27, 27],
		[27, 27],
		[27, 27]
	]
};
SkillInfo[SK.NPC_PSYCHIC_WAVE] = {
	Name: 'NPC_PSYCHIC_WAVE',
	SkillName: '念力波',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[9, 9],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_MAGMA_ERUPTION] = {
	Name: 'NPC_MAGMA_ERUPTION',
	SkillName: '熔岩流',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_COMET] = {
	Name: 'NPC_COMET',
	SkillName: '彗星',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[19, 19],
		[19, 19],
		[19, 19],
		[19, 19],
		[19, 19]
	]
};
SkillInfo[SK.NPC_WIDEWEB] = {
	Name: 'NPC_WIDEWEB',
	SkillName: '广域蛛网',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[15, 15]]
};
SkillInfo[SK.NPC_WIDESIGHT] = {
	Name: 'NPC_WIDESIGHT',
	SkillName: 'Wide sight',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[11, 11]]
};
SkillInfo[SK.NPC_WIDESUCK] = {
	Name: 'NPC_WIDESUCK',
	SkillName: 'Wide bloodsucking',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[27, 27]]
};
SkillInfo[SK.NPC_STORMGUST2] = {
	Name: 'NPC_STORMGUST2',
	SkillName: 'Storm Gust',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_FIRESTORM] = {
	Name: 'NPC_FIRESTORM',
	SkillName: 'Fire storm',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_DRAGONBREATH] = {
	Name: 'NPC_DRAGONBREATH',
	SkillName: "Dragon's Breath",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	SkillScale: [
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9]
	]
};
SkillInfo[SK.NPC_REVERBERATION] = {
	Name: 'NPC_REVERBERATION',
	SkillName: 'Reverberation',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[5, 5],
		[5, 5],
		[5, 5],
		[5, 5]
	]
};
SkillInfo[SK.NPC_LEX_AETERNA] = {
	Name: 'NPC_LEX_AETERNA',
	SkillName: 'Wide area Lex Aeterna',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.WE_CALLALLFAMILY] = {
	Name: 'WE_CALLALLFAMILY',
	SkillName: "Let's Go Family!",
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WE_ONEFOREVER] = {
	Name: 'WE_ONEFOREVER',
	SkillName: 'Love Conquers Death',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [3]
};
SkillInfo[SK.WE_CHEERUP] = {
	Name: 'WE_CHEERUP',
	SkillName: 'Go! Parents Go!',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GD_GUILD_STORAGE] = {
	Name: 'GD_GUILD_STORAGE',
	SkillName: 'Guild Storage Extension',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CG_SPECIALSINGER] = {
	Name: 'SK_CG_SPECIALSINGER',
	SkillName: 'Skilled Special Singer',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.BA_DISSONANCE, 3],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.DC_UGLYDANCE, 3],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.BA_POEMBRAGI2] = {
	Name: 'BA_POEMBRAGI2',
	SkillName: 'Magic Strings',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.DC_FORTUNEKISS2] = {
	Name: 'DC_FORTUNEKISS2',
	SkillName: 'Lady Luck',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SJ_LIGHTOFMOON] = {
	Name: 'SJ_LIGHTOFMOON',
	SkillName: 'Lunar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FULLMOONKICK, 3]]
};
SkillInfo[SK.SJ_LUNARSTANCE] = {
	Name: 'SJ_LUNARSTANCE',
	SkillName: 'Lunar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_FULLMOONKICK] = {
	Name: 'SJ_FULLMOONKICK',
	SkillName: 'Full Moon Kick',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_NEWMOONKICK, 7]]
};
SkillInfo[SK.SJ_NEWMOONKICK] = {
	Name: 'SJ_NEWMOONKICK',
	SkillName: 'New Moon Kick',
	MaxLv: 7,
	SpAmount: [20, 25, 30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_LUNARSTANCE, 1]]
};
SkillInfo[SK.SJ_LIGHTOFSTAR] = {
	Name: 'SJ_LIGHTOFSTAR',
	SkillName: 'Stellar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FALLINGSTAR, 3]]
};
SkillInfo[SK.SJ_STARSTANCE] = {
	Name: 'SJ_STARSTANCE',
	SkillName: 'Stellar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_FLASHKICK] = {
	Name: 'SJ_FLASHKICK',
	SkillName: 'Flash Kick',
	MaxLv: 7,
	SpAmount: [45, 40, 35, 30, 25, 20, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_STARSTANCE, 1]]
};
SkillInfo[SK.SJ_STAREMPEROR] = {
	Name: 'SJ_STAREMPEROR',
	SkillName: "Star Emperor's Descent",
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_NOVAEXPLOSING, 5],
		[SK.SJ_UNIVERSESTANCE, 3]
	]
};
SkillInfo[SK.SJ_NOVAEXPLOSING] = {
	Name: 'SJ_NOVAEXPLOSING',
	SkillName: 'Nova Explosion',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.SJ_UNIVERSESTANCE, 1]]
};
SkillInfo[SK.SJ_UNIVERSESTANCE] = {
	Name: 'SJ_UNIVERSESTANCE',
	SkillName: 'Universal Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_SUNSTANCE, 3],
		[SK.SJ_LUNARSTANCE, 3],
		[SK.SJ_STARSTANCE, 3]
	]
};
SkillInfo[SK.SJ_FALLINGSTAR] = {
	Name: 'SJ_FALLINGSTAR',
	SkillName: 'Falling Stars',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FLASHKICK, 7]]
};
SkillInfo[SK.SJ_GRAVITYCONTROL] = {
	Name: 'SJ_GRAVITYCONTROL',
	SkillName: 'Gravity Control',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: true,
	AttackRange: [9],
	_NeedSkillList: [[SK.SJ_UNIVERSESTANCE, 1]]
};
SkillInfo[SK.SJ_BOOKOFDIMENSION] = {
	Name: 'SJ_BOOKOFDIMENSION',
	SkillName: 'Book of Dimensions',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_STAREMPEROR, 3],
		[SK.SJ_DOCUMENT, 3]
	]
};
SkillInfo[SK.SJ_BOOKOFCREATINGSTAR] = {
	Name: 'SJ_BOOKOFCREATINGSTAR',
	SkillName: "Star Creator's Book",
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SJ_STAREMPEROR, 3],
		[SK.SJ_DOCUMENT, 3]
	]
};
SkillInfo[SK.SJ_DOCUMENT] = {
	Name: 'SJ_DOCUMENT',
	SkillName: 'Solar, Lunar, and Stellar Record',
	MaxLv: 3,
	SpAmount: [60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 3],
		[SK.SG_HATE, 3]
	]
};
SkillInfo[SK.SJ_PURIFY] = {
	Name: 'SJ_PURIFY',
	SkillName: 'Solar, Lunar, and Stellar Purification',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SG_DEVIL, 10]]
};
SkillInfo[SK.SJ_LIGHTOFSUN] = {
	Name: 'SJ_LIGHTOFSUN',
	SkillName: 'Solar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_SOLARBURST, 3]]
};
SkillInfo[SK.SJ_SUNSTANCE] = {
	Name: 'SJ_SUNSTANCE',
	SkillName: 'Solar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_SOLARBURST] = {
	Name: 'SJ_SOLARBURST',
	SkillName: 'Solar Explosion',
	MaxLv: 10,
	SpAmount: [34, 37, 40, 43, 46, 49, 52, 55, 58, 61],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_PROMINENCEKICK, 7]]
};
SkillInfo[SK.SJ_PROMINENCEKICK] = {
	Name: 'SJ_PROMINENCEKICK',
	SkillName: 'Blaze Kick',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_SUNSTANCE, 1]]
};
SkillInfo[SK.SP_SOULGOLEM] = {
	Name: 'SP_SOULGOLEM',
	SkillName: 'Golem Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREVOLVE, 2]]
};
SkillInfo[SK.SP_SOULSHADOW] = {
	Name: 'SP_SOULSHADOW',
	SkillName: 'Shadow Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULUNITY, 5]]
};
SkillInfo[SK.SP_SOULFALCON] = {
	Name: 'SP_SOULFALCON',
	SkillName: 'Falcon Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREVOLVE, 2]]
};
SkillInfo[SK.SP_SOULFAIRY] = {
	Name: 'SP_SOULFAIRY',
	SkillName: 'Fairy Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULUNITY, 5]]
};
SkillInfo[SK.SP_CURSEEXPLOSION] = {
	Name: 'SP_CURSEEXPLOSION',
	SkillName: 'Curse Explosion',
	MaxLv: 10,
	SpAmount: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULCURSE, 3]]
};
SkillInfo[SK.SP_SOULCURSE] = {
	Name: 'SP_SOULCURSE',
	SkillName: 'Evil Soul Curse',
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREAPER, 3]]
};
SkillInfo[SK.SP_SPA] = {
	Name: 'SP_SPA',
	SkillName: 'Espa',
	MaxLv: 10,
	SpAmount: [52, 56, 60, 64, 68, 72, 76, 80, 84, 88],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SHA, 1]]
};
SkillInfo[SK.SP_SHA] = {
	Name: 'SP_SHA',
	SkillName: 'Esha',
	MaxLv: 5,
	SpAmount: [18, 20, 22, 24, 26],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREAPER, 3]]
};
SkillInfo[SK.SP_SWHOO] = {
	Name: 'SP_SWHOO',
	SkillName: 'Eswoo',
	MaxLv: 10,
	SpAmount: [66, 70, 74, 78, 82, 86, 90, 94, 98, 102],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SPA, 3]]
};
SkillInfo[SK.SP_SOULUNITY] = {
	Name: 'SP_SOULUNITY',
	SkillName: 'Soul Bind',
	MaxLv: 7,
	SpAmount: [44, 46, 48, 50, 52, 54, 56],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.SP_SOULENERGY, 3]]
};
SkillInfo[SK.SP_SOULDIVISION] = {
	Name: 'SP_SOULDIVISION',
	SkillName: 'Soul Division',
	MaxLv: 5,
	SpAmount: [36, 40, 44, 48, 52],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SP_SPA, 5],
		[SK.SP_SHA, 5]
	]
};
SkillInfo[SK.SP_SOULREAPER] = {
	Name: 'SP_SOULREAPER',
	SkillName: 'Soul Harvest',
	MaxLv: 5,
	SpAmount: [42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SP_SOULCOLLECT, 1]]
};
SkillInfo[SK.SP_SOULCOLLECT] = {
	Name: 'SP_SOULCOLLECT',
	SkillName: 'Soul Collection',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SP_SOULREVOLVE] = {
	Name: 'SP_SOULREVOLVE',
	SkillName: 'Soul Circulation',
	MaxLv: 3,
	SpAmount: [50, 100, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [
		[SK.SP_SOULENERGY, 3],
		[SK.SP_KAUTE, 3]
	]
};
SkillInfo[SK.SP_SOULEXPLOSION] = {
	Name: 'SP_SOULEXPLOSION',
	SkillName: 'Soul Explosion',
	MaxLv: 5,
	SpAmount: [30, 60, 90, 120, 150],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SP_SOULSHADOW, 1],
		[SK.SP_SOULFALCON, 1],
		[SK.SP_SOULFAIRY, 1],
		[SK.SP_SOULGOLEM, 1],
		[SK.SP_CURSEEXPLOSION, 2]
	]
};
SkillInfo[SK.SP_KAUTE] = {
	Name: 'SP_KAUTE',
	SkillName: '考特',
	MaxLv: 5,
	SpAmount: [24, 30, 36, 42, 48],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.SP_SOULENERGY, 1]]
};
SkillInfo[SK.SP_SOULENERGY] = {
	Name: 'SP_SOULENERGY',
	SkillName: '灵魂能量研究',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SP_SOULCOLLECT, 1]]
};
SkillInfo[SK.SJ_FALLINGSTAR_ATK2] = {
	Name: 'SJ_FALLINGSTAR_ATK2',
	SkillName: '流星',
	MaxLv: 1,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SJ_FALLINGSTAR_ATK] = {
	Name: 'SJ_FALLINGSTAR_ATK',
	SkillName: '流星',
	MaxLv: 1,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_LUXANIMA] = {
	Name: 'RK_LUXANIMA',
	SkillName: '灵魂之光',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.NPC_WIDEBLEEDING2] = {
	Name: 'NPC_WIDEBLEEDING2',
	SkillName: '恶魔群体出血',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESILENCE2] = {
	Name: 'NPC_WIDESILENCE2',
	SkillName: '恶魔群体沉默',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTUN2] = {
	Name: 'NPC_WIDESTUN2',
	SkillName: '恶魔群体眩晕',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTONE2] = {
	Name: 'NPC_WIDESTONE2',
	SkillName: '恶魔群体石化',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESLEEP2] = {
	Name: 'NPC_WIDESLEEP2',
	SkillName: '恶魔群体睡眠',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECURSE2] = {
	Name: 'NPC_WIDECURSE2',
	SkillName: '恶魔群体诅咒',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECONFUSE2] = {
	Name: 'NPC_WIDECONFUSE2',
	SkillName: '恶魔群体混乱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFREEZE2] = {
	Name: 'NPC_WIDEFREEZE2',
	SkillName: '恶魔群体冻结',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_EVILLAND2] = {
	Name: 'NPC_EVILLAND2',
	SkillName: '恶魔邪地',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[13, 13],
		[15, 15],
		[19, 19],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_HELLJUDGEMENT2] = {
	Name: 'NPC_HELLJUDGEMENT2',
	SkillName: '恶魔地狱审判',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29]
	]
};
SkillInfo[SK.NV_BREAKTHROUGH] = {
	Name: 'NV_BREAKTHROUGH',
	SkillName: '突破',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: []
};
SkillInfo[SK.NV_HELPANGEL] = {
	Name: 'NV_HELPANGEL',
	SkillName: '天使，救命！',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.NV_TRANSCENDENCE] = {
	Name: 'NV_TRANSCENDENCE',
	SkillName: '超越',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: []
};
SkillInfo[SK.ALL_NIFLHEIM_RECALL] = {
	Name: 'ALL_NIFLHEIM_RECALL',
	SkillName: '亡者世界！',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DK_SERVANTWEAPON] = {
	Name: 'DK_SERVANTWEAPON',
	SkillName: '侍从武器',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DK_SERVANT_W_SIGN] = {
	Name: 'DK_SERVANT_W_SIGN',
	SkillName: '侍从武器 - 印记',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.DK_SERVANTWEAPON, 3]]
};
SkillInfo[SK.DK_SERVANT_W_PHANTOM] = {
	Name: 'DK_SERVANT_W_PHANTOM',
	SkillName: '侍从武器 - 幻影',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.DK_SERVANTWEAPON, 5],
		[SK.DK_SERVANT_W_SIGN, 5]
	]
};
SkillInfo[SK.DK_SERVANT_W_DEMOL] = {
	Name: 'DK_SERVANT_W_DEMOL',
	SkillName: '侍从武器 - 爆破',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DK_SERVANT_W_PHANTOM, 5]]
};
SkillInfo[SK.DK_CHARGINGPIERCE] = {
	Name: 'DK_CHARGINGPIERCE',
	SkillName: '蓄力穿刺',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_HUNDREDSPEAR, 5]]
};
SkillInfo[SK.DK_TWOHANDDEF] = {
	Name: 'DK_TWOHANDDEF',
	SkillName: '双手防御',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DK_HACKANDSLASHER] = {
	Name: 'DK_HACKANDSLASHER',
	SkillName: '砍杀',
	MaxLv: 10,
	SpAmount: [34, 38, 42, 46, 50, 54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.DK_TWOHANDDEF, 5]]
};
SkillInfo[SK.DK_DRAGONIC_AURA] = {
	Name: 'DK_DRAGONIC_AURA',
	SkillName: '龙之气息',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.DK_CHARGINGPIERCE, 10],
		[SK.RK_DRAGONBREATH, 10],
		[SK.RK_DRAGONBREATH_WATER, 10]
	]
};
SkillInfo[SK.DK_MADNESS_CRUSHER] = {
	Name: 'DK_MADNESS_CRUSHER',
	SkillName: '疯狂粉碎',
	MaxLv: 5,
	SpAmount: [34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.DK_CHARGINGPIERCE, 5],
		[SK.DK_HACKANDSLASHER, 10]
	]
};
SkillInfo[SK.DK_VIGOR] = {
	Name: 'DK_VIGOR',
	SkillName: '活力',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.DK_SERVANT_W_DEMOL, 3],
		[SK.DK_STORMSLASH, 5]
	]
};
SkillInfo[SK.DK_STORMSLASH] = {
	Name: 'DK_STORMSLASH',
	SkillName: '风暴斩',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.DK_TWOHANDDEF, 10],
		[SK.DK_HACKANDSLASHER, 5]
	]
};
SkillInfo[SK.AG_DEADLY_PROJECTION] = {
	Name: 'AG_DEADLY_PROJECTION',
	SkillName: '致命投影',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_MYSTERY_ILLUSION, 3]]
};
SkillInfo[SK.AG_DESTRUCTIVE_HURRICANE] = {
	Name: 'AG_DESTRUCTIVE_HURRICANE',
	SkillName: '破坏飓风',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_TORNADO_STORM, 3]]
};
SkillInfo[SK.AG_RAIN_OF_CRYSTAL] = {
	Name: 'AG_RAIN_OF_CRYSTAL',
	SkillName: '水晶之雨',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_FROSTMISTY, 3]]
};
SkillInfo[SK.AG_MYSTERY_ILLUSION] = {
	Name: 'AG_MYSTERY_ILLUSION',
	SkillName: '神秘幻影',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AG_SOUL_VC_STRIKE, 3],
		[SK.WL_HELLINFERNO, 3]
	]
};
SkillInfo[SK.AG_VIOLENT_QUAKE] = {
	Name: 'AG_VIOLENT_QUAKE',
	SkillName: '剧烈地震',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_STRANTUM_TREMOR, 3]]
};
SkillInfo[SK.AG_SOUL_VC_STRIKE] = {
	Name: 'AG_SOUL_VC_STRIKE',
	SkillName: '灵魂火神炮',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WL_SOULEXPANSION, 5],
		[SK.AG_TWOHANDSTAFF, 3]
	]
};
SkillInfo[SK.AG_STRANTUM_TREMOR] = {
	Name: 'AG_STRANTUM_TREMOR',
	SkillName: '地层震颤',
	MaxLv: 5,
	SpAmount: [35, 45, 55, 65, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WL_SIENNAEXECRATE, 3]]
};
SkillInfo[SK.AG_ALL_BLOOM] = {
	Name: 'AG_ALL_BLOOM',
	SkillName: '万花齐放',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_FLORAL_FLARE_ROAD, 3]]
};
SkillInfo[SK.AG_CRYSTAL_IMPACT] = {
	Name: 'AG_CRYSTAL_IMPACT',
	SkillName: '水晶冲击',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_RAIN_OF_CRYSTAL, 3]]
};
SkillInfo[SK.AG_TORNADO_STORM] = {
	Name: 'AG_TORNADO_STORM',
	SkillName: '龙卷风暴',
	MaxLv: 5,
	SpAmount: [45, 55, 65, 75, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WL_CHAINLIGHTNING, 3]]
};
SkillInfo[SK.AG_FLORAL_FLARE_ROAD] = {
	Name: 'AG_FLORAL_FLARE_ROAD',
	SkillName: '花焰之路',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_CRIMSONROCK, 3]]
};
SkillInfo[SK.AG_CLIMAX] = {
	Name: 'AG_CLIMAX',
	SkillName: '高潮',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [200, 200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.WL_TETRAVORTEX, 5],
		[SK.AG_TWOHANDSTAFF, 3]
	]
};
SkillInfo[SK.AG_ASTRAL_STRIKE] = {
	Name: 'AG_ASTRAL_STRIKE',
	SkillName: '星界打击',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WL_COMET, 5],
		[SK.AG_MYSTERY_ILLUSION, 3],
		[SK.AG_DEADLY_PROJECTION, 3]
	]
};
SkillInfo[SK.AG_ROCK_DOWN] = {
	Name: 'AG_ROCK_DOWN',
	SkillName: '岩石坠落',
	MaxLv: 5,
	SpAmount: [65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_STRANTUM_TREMOR, 1]]
};
SkillInfo[SK.AG_STORM_CANNON] = {
	Name: 'AG_STORM_CANNON',
	SkillName: '风暴加农炮',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_TORNADO_STORM, 1]]
};
SkillInfo[SK.AG_CRIMSON_ARROW] = {
	Name: 'AG_CRIMSON_ARROW',
	SkillName: '猩红之箭',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_FLORAL_FLARE_ROAD, 1]]
};
SkillInfo[SK.AG_FROZEN_SLASH] = {
	Name: 'AG_FROZEN_SLASH',
	SkillName: '冰冻斩',
	MaxLv: 5,
	SpAmount: [45, 55, 65, 75, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_RAIN_OF_CRYSTAL, 1]]
};
SkillInfo[SK.AG_TWOHANDSTAFF] = {
	Name: 'AG_TWOHANDSTAFF',
	SkillName: '双手杖修炼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IQ_POWERFUL_FAITH] = {
	Name: 'IQ_POWERFUL_FAITH',
	SkillName: '强力信仰',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_FIRM_FAITH] = {
	Name: 'IQ_FIRM_FAITH',
	SkillName: '坚定信仰',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_WILL_OF_FAITH] = {
	Name: 'IQ_WILL_OF_FAITH',
	SkillName: '信仰意志',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IQ_OLEUM_SANCTUM] = {
	Name: 'IQ_OLEUM_SANCTUM',
	SkillName: '神圣圣油',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AL_HOLYWATER, 1],
		[SK.IQ_WILL_OF_FAITH, 3]
	]
};
SkillInfo[SK.IQ_SINCERE_FAITH] = {
	Name: 'IQ_SINCERE_FAITH',
	SkillName: '真诚信仰',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_FIRST_BRAND] = {
	Name: 'IQ_FIRST_BRAND',
	SkillName: '第一烙印',
	MaxLv: 5,
	SpAmount: [22, 29, 36, 43, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 2]]
};
SkillInfo[SK.IQ_FIRST_FAITH_POWER] = {
	Name: 'IQ_FIRST_FAITH_POWER',
	SkillName: '第一信仰之力',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IQ_WILL_OF_FAITH, 3],
		[SK.IQ_FIRST_BRAND, 1]
	]
};
SkillInfo[SK.IQ_THIRD_PUNISH] = {
	Name: 'IQ_THIRD_PUNISH',
	SkillName: '第三惩罚',
	MaxLv: 5,
	SpAmount: [56, 62, 68, 74, 80],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_FAITH, 2]]
};
SkillInfo[SK.IQ_THIRD_FLAME_BOMB] = {
	Name: 'IQ_THIRD_FLAME_BOMB',
	SkillName: '第三火焰炸弹',
	MaxLv: 5,
	SpAmount: [74, 78, 82, 86, 90],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_FLAME, 2]]
};
SkillInfo[SK.IQ_THIRD_CONSECRATION] = {
	Name: 'IQ_THIRD_CONSECRATION',
	SkillName: '第三奉献',
	MaxLv: 5,
	SpAmount: [65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_JUDGEMENT, 2]]
};
SkillInfo[SK.IQ_SECOND_FLAME] = {
	Name: 'IQ_SECOND_FLAME',
	SkillName: '第二火焰',
	MaxLv: 5,
	SpAmount: [46, 52, 58, 64, 70],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_THIRD_EXOR_FLAME, 1]]
};
SkillInfo[SK.IQ_SECOND_FAITH] = {
	Name: 'IQ_SECOND_FAITH',
	SkillName: '第二信仰',
	MaxLv: 5,
	SpAmount: [36, 42, 48, 54, 60],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_FIRST_FAITH_POWER, 1]]
};
SkillInfo[SK.IQ_SECOND_JUDGEMENT] = {
	Name: 'IQ_SECOND_JUDGEMENT',
	SkillName: '第二审判',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_JUDGE, 1]]
};
SkillInfo[SK.IQ_EXPOSION_BLASTER] = {
	Name: 'IQ_EXPOSION_BLASTER',
	SkillName: '爆炸冲击炮',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_OLEUM_SANCTUM, 1]]
};
SkillInfo[SK.IQ_MASSIVE_F_BLASTER] = {
	Name: 'IQ_MASSIVE_F_BLASTER',
	SkillName: '巨型火焰冲击炮',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IQ_OLEUM_SANCTUM, 3],
		[SK.IQ_EXPOSION_BLASTER, 3],
		[SK.IQ_WILL_OF_FAITH, 5]
	]
};
SkillInfo[SK.IQ_JUDGE] = {
	Name: 'IQ_JUDGE',
	SkillName: '审判',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_FIRST_FAITH_POWER, 1]]
};
SkillInfo[SK.IQ_THIRD_EXOR_FLAME] = {
	Name: 'IQ_THIRD_EXOR_FLAME',
	SkillName: '第三驱魔火焰',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_JUDGE, 1]]
};
SkillInfo[SK.IG_GUARD_STANCE] = {
	Name: 'IG_GUARD_STANCE',
	SkillName: '防御姿态',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_SHIELD_MASTERY, 3]]
};
SkillInfo[SK.IG_GUARDIAN_SHIELD] = {
	Name: 'IG_GUARDIAN_SHIELD',
	SkillName: '守护者之盾',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_GUARD_STANCE, 2]]
};
SkillInfo[SK.IG_REBOUND_SHIELD] = {
	Name: 'IG_REBOUND_SHIELD',
	SkillName: '反弹盾牌',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_GUARD_STANCE, 4]]
};
SkillInfo[SK.IG_SHIELD_MASTERY] = {
	Name: 'IG_SHIELD_MASTERY',
	SkillName: '盾牌修炼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IG_SPEAR_SWORD_M] = {
	Name: 'IG_SPEAR_SWORD_M',
	SkillName: '矛剑修炼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IG_ATTACK_STANCE] = {
	Name: 'IG_ATTACK_STANCE',
	SkillName: '攻击姿态',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_SPEAR_SWORD_M, 3]]
};
SkillInfo[SK.IG_ULTIMATE_SACRIFICE] = {
	Name: 'IG_ULTIMATE_SACRIFICE',
	SkillName: '终极牺牲',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_REBOUND_SHIELD, 3],
		[SK.IG_GUARDIAN_SHIELD, 3]
	]
};
SkillInfo[SK.IG_HOLY_SHIELD] = {
	Name: 'IG_HOLY_SHIELD',
	SkillName: '神圣之盾',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_SHIELD_MASTERY, 5],
		[SK.IG_CROSS_RAIN, 3]
	]
};
SkillInfo[SK.IG_GRAND_JUDGEMENT] = {
	Name: 'IG_GRAND_JUDGEMENT',
	SkillName: '大审判',
	MaxLv: 10,
	SpAmount: [41, 44, 47, 50, 53, 56, 59, 62, 65, 68],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.IG_OVERSLASH, 5],
		[SK.IG_SPEAR_SWORD_M, 5]
	]
};
SkillInfo[SK.IG_JUDGEMENT_CROSS] = {
	Name: 'IG_JUDGEMENT_CROSS',
	SkillName: '审判十字',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.IG_CROSS_RAIN, 5],
		[SK.IG_HOLY_SHIELD, 3]
	]
};
SkillInfo[SK.IG_SHIELD_SHOOTING] = {
	Name: 'IG_SHIELD_SHOOTING',
	SkillName: '盾牌射击',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_SHIELD_MASTERY, 5],
		[SK.IG_ATTACK_STANCE, 2]
	]
};
SkillInfo[SK.IG_OVERSLASH] = {
	Name: 'IG_OVERSLASH',
	SkillName: '过度斩击',
	MaxLv: 10,
	SpAmount: [41, 44, 47, 50, 53, 56, 59, 62, 65, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_ATTACK_STANCE, 3]]
};
SkillInfo[SK.IG_CROSS_RAIN] = {
	Name: 'IG_CROSS_RAIN',
	SkillName: '十字雨',
	MaxLv: 10,
	SpAmount: [50, 54, 58, 62, 66, 70, 74, 78, 82, 86],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.IG_SHIELD_MASTERY, 1]]
};
SkillInfo[SK.SHC_DANCING_KNIFE] = {
	Name: 'SHC_DANCING_KNIFE',
	SkillName: '舞动之刃',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SHC_SHADOW_SENSE, 3]]
};
SkillInfo[SK.SHC_SAVAGE_IMPACT] = {
	Name: 'SHC_SAVAGE_IMPACT',
	SkillName: '野蛮冲击',
	MaxLv: 10,
	SpAmount: [28, 31, 34, 37, 40, 43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 3],
		[SK.GC_CROSSIMPACT, 5]
	]
};
SkillInfo[SK.SHC_SHADOW_SENSE] = {
	Name: 'SHC_SHADOW_SENSE',
	SkillName: '影之感知',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SHC_ETERNAL_SLASH] = {
	Name: 'SHC_ETERNAL_SLASH',
	SkillName: '永恒斩击',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_DANCING_KNIFE, 3],
		[SK.GC_WEAPONBLOCKING, 3]
	]
};
SkillInfo[SK.SHC_ENCHANTING_SHADOW] = {
	Name: 'SHC_ENCHANTING_SHADOW',
	SkillName: '附魔之影',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 3],
		[SK.GC_POISONINGWEAPON, 5]
	]
};
SkillInfo[SK.SHC_POTENT_VENOM] = {
	Name: 'SHC_POTENT_VENOM',
	SkillName: '强力毒液',
	MaxLv: 10,
	SpAmount: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_ENCHANTING_SHADOW, 3]
	]
};
SkillInfo[SK.SHC_SHADOW_EXCEED] = {
	Name: 'SHC_SHADOW_EXCEED',
	SkillName: '影之超越',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 7],
		[SK.SHC_ENCHANTING_SHADOW, 5],
		[SK.SHC_POTENT_VENOM, 3]
	]
};
SkillInfo[SK.SHC_FATAL_SHADOW_CROW] = {
	Name: 'SHC_FATAL_SHADOW_CROW',
	SkillName: '致命暗影爪',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SHC_SHADOW_STAB, 5],
		[SK.SHC_IMPACT_CRATER, 5]
	]
};
SkillInfo[SK.SHC_SHADOW_STAB] = {
	Name: 'SHC_SHADOW_STAB',
	SkillName: '暗影刺击',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_DANCING_KNIFE, 5],
		[SK.SHC_ETERNAL_SLASH, 3],
		[SK.GC_CLOAKINGEXCEED, 5]
	]
};
SkillInfo[SK.SHC_IMPACT_CRATER] = {
	Name: 'SHC_IMPACT_CRATER',
	SkillName: '冲击陨坑',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_SAVAGE_IMPACT, 5],
		[SK.GC_ROLLINGCUTTER, 5],
		[SK.GC_WEAPONBLOCKING, 3]
	]
};
SkillInfo[SK.CD_REPARATIO] = {
	Name: 'CD_REPARATIO',
	SkillName: '修复术',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.CD_MEDIALE_VOTUM, 3]]
};
SkillInfo[SK.CD_MEDIALE_VOTUM] = {
	Name: 'CD_MEDIALE_VOTUM',
	SkillName: '中位祷告',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.CD_DILECTIO_HEAL, 3]]
};
SkillInfo[SK.CD_MACE_BOOK_M] = {
	Name: 'CD_MACE_BOOK_M',
	SkillName: '钝器书籍修炼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.CD_ARGUTUS_VITA] = {
	Name: 'CD_ARGUTUS_VITA',
	SkillName: '睿智生命',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_ARGUTUS_TELUM] = {
	Name: 'CD_ARGUTUS_TELUM',
	SkillName: '睿智武器',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_ARBITRIUM] = {
	Name: 'CD_ARBITRIUM',
	SkillName: '裁决',
	MaxLv: 10,
	SpAmount: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_ADORAMUS, 5],
		[SK.CD_FRAMEN, 3]
	]
};
SkillInfo[SK.CD_PRESENS_ACIES] = {
	Name: 'CD_PRESENS_ACIES',
	SkillName: '锋芒在前',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_FIDUS_ANIMUS] = {
	Name: 'CD_FIDUS_ANIMUS',
	SkillName: '忠诚之心',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.CD_EFFLIGO] = {
	Name: 'CD_EFFLIGO',
	SkillName: '惩戒',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	ApAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.AB_ORATIO, 5],
		[SK.CD_PETITIO, 10]
	]
};
SkillInfo[SK.CD_COMPETENTIA] = {
	Name: 'CD_COMPETENTIA',
	SkillName: '能力',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [200, 200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.CD_PRESENS_ACIES, 2],
		[SK.CD_ARGUTUS_TELUM, 2],
		[SK.CD_ARGUTUS_VITA, 2]
	]
};
SkillInfo[SK.CD_PNEUMATICUS_PROCELLA] = {
	Name: 'CD_PNEUMATICUS_PROCELLA',
	SkillName: '气旋风暴',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_FRAMEN, 5],
		[SK.CD_ARBITRIUM, 10]
	]
};
SkillInfo[SK.CD_DILECTIO_HEAL] = {
	Name: 'CD_DILECTIO_HEAL',
	SkillName: '慈爱治愈',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CHEAL, 3],
		[SK.AB_HIGHNESSHEAL, 3]
	]
};
SkillInfo[SK.CD_RELIGIO] = {
	Name: 'CD_RELIGIO',
	SkillName: '信仰',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CLEMENTIA, 3],
		[SK.CD_DILECTIO_HEAL, 2]
	]
};
SkillInfo[SK.CD_BENEDICTUM] = {
	Name: 'CD_BENEDICTUM',
	SkillName: '祝福',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CANTO, 3],
		[SK.CD_DILECTIO_HEAL, 2]
	]
};
SkillInfo[SK.CD_PETITIO] = {
	Name: 'CD_PETITIO',
	SkillName: '祈愿',
	MaxLv: 10,
	SpAmount: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.AB_DUPLELIGHT, 10],
		[SK.CD_MACE_BOOK_M, 5]
	]
};
SkillInfo[SK.CD_FRAMEN] = {
	Name: 'CD_FRAMEN',
	SkillName: '火焰',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_JUDEX, 10],
		[SK.CD_FIDUS_ANIMUS, 5]
	]
};
SkillInfo[SK.BO_BIONIC_PHARMACY] = {
	Name: 'BO_BIONIC_PHARMACY',
	SkillName: '仿生药剂学',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 5]]
};
SkillInfo[SK.BO_BIONICS_M] = {
	Name: 'BO_BIONICS_M',
	SkillName: '仿生精通',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.BO_THE_WHOLE_PROTECTION] = {
	Name: 'BO_THE_WHOLE_PROTECTION',
	SkillName: '团队保护',
	MaxLv: 5,
	SpAmount: [220, 260, 300, 340, 380],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONIC_PHARMACY, 5]]
};
SkillInfo[SK.BO_ADVANCE_PROTECTION] = {
	Name: 'BO_ADVANCE_PROTECTION',
	SkillName: '完全暗影保护',
	MaxLv: 4,
	SpAmount: [120, 130, 140, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONIC_PHARMACY, 5]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_WATER] = {
	Name: 'BO_ACIDIFIED_ZONE_WATER',
	SkillName: '酸化区域（水）',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.BO_ACIDIFIED_ZONE_WIND, 1]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_GROUND] = {
	Name: 'BO_ACIDIFIED_ZONE_GROUND',
	SkillName: '酸化区域（地）',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.BO_BIONICS_M, 3],
		[SK.BO_BIONIC_PHARMACY, 5]
	]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_FIRE] = {
	Name: 'BO_ACIDIFIED_ZONE_FIRE',
	SkillName: '酸化区域（火）',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.BO_ACIDIFIED_ZONE_GROUND, 1]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_WIND] = {
	Name: 'BO_ACIDIFIED_ZONE_WIND',
	SkillName: '酸化区域（风）',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.BO_BIONICS_M, 3],
		[SK.BO_BIONIC_PHARMACY, 5]
	]
};
SkillInfo[SK.BO_WOODENWARRIOR] = {
	Name: 'BO_WOODENWARRIOR',
	SkillName: '制造木头战士',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_CREEPER, 3]]
};
SkillInfo[SK.BO_WOODEN_FAIRY] = {
	Name: 'BO_WOODEN_FAIRY',
	SkillName: '制造木头妖精',
	MaxLv: 5,
	SpAmount: [120, 155, 180, 205, 230],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_CREEPER, 3]]
};
SkillInfo[SK.BO_CREEPER] = {
	Name: 'BO_CREEPER',
	SkillName: '制造爬藤',
	MaxLv: 5,
	SpAmount: [80, 96, 112, 128, 144],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONICS_M, 5]]
};
SkillInfo[SK.BO_RESEARCHREPORT] = {
	Name: 'BO_RESEARCHREPORT',
	SkillName: '研究报告',
	MaxLv: 1,
	SpAmount: [60],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.BO_ACIDIFIED_ZONE_FIRE, 3],
		[SK.BO_ACIDIFIED_ZONE_WATER, 3]
	]
};
SkillInfo[SK.BO_HELLTREE] = {
	Name: 'BO_HELLTREE',
	SkillName: '制造地狱树',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	ApAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BO_WOODENWARRIOR, 3],
		[SK.BO_WOODEN_FAIRY, 3]
	]
};
SkillInfo[SK.WH_ADVANCED_TRAP] = {
	Name: 'WH_ADVANCED_TRAP',
	SkillName: '高级陷阱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 3]]
};
SkillInfo[SK.WH_WIND_SIGN] = {
	Name: 'WH_WIND_SIGN',
	SkillName: '风之印记',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_NATUREFRIENDLY, 5]]
};
SkillInfo[SK.WH_NATUREFRIENDLY] = {
	Name: 'WH_NATUREFRIENDLY',
	SkillName: '自然之友',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.WH_HAWKRUSH] = {
	Name: 'WH_HAWKRUSH',
	SkillName: '猎鹰冲锋',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_HAWK_M, 1]]
};
SkillInfo[SK.WH_HAWK_M] = {
	Name: 'WH_HAWK_M',
	SkillName: '猎鹰精通',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.HT_STEELCROW, 1]]
};
SkillInfo[SK.WH_CALAMITYGALE] = {
	Name: 'WH_CALAMITYGALE',
	SkillName: '灾厄狂风',
	MaxLv: 1,
	SpAmount: [300],
	ApAmount: [200],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.WH_GALESTORM, 5],
		[SK.WH_WIND_SIGN, 5]
	]
};
SkillInfo[SK.WH_HAWKBOOMERANG] = {
	Name: 'WH_HAWKBOOMERANG',
	SkillName: '猎鹰回旋镖',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	ApAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_HAWKRUSH, 5]]
};
SkillInfo[SK.WH_GALESTORM] = {
	Name: 'WH_GALESTORM',
	SkillName: '狂风暴雨',
	MaxLv: 10,
	SpAmount: [80, 91, 102, 113, 124, 135, 146, 157, 168, 179],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_CRESCIVE_BOLT, 3]]
};
SkillInfo[SK.WH_DEEPBLINDTRAP] = {
	Name: 'WH_DEEPBLINDTRAP',
	SkillName: '深度失明陷阱',
	MaxLv: 5,
	SpAmount: [50, 53, 56, 59, 62],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_ADVANCED_TRAP, 3]]
};
SkillInfo[SK.WH_SOLIDTRAP] = {
	Name: 'WH_SOLIDTRAP',
	SkillName: '坚固陷阱',
	MaxLv: 5,
	SpAmount: [70, 80, 90, 100, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_ADVANCED_TRAP, 3]]
};
SkillInfo[SK.WH_SWIFTTRAP] = {
	Name: 'WH_SWIFTTRAP',
	SkillName: '迅捷陷阱',
	MaxLv: 5,
	SpAmount: [60, 62, 64, 66, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_DEEPBLINDTRAP, 1]]
};
SkillInfo[SK.WH_CRESCIVE_BOLT] = {
	Name: 'WH_CRESCIVE_BOLT',
	SkillName: '新月箭',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_AIMEDBOLT, 5]]
};
SkillInfo[SK.WH_FLAMETRAP] = {
	Name: 'WH_FLAMETRAP',
	SkillName: '火焰陷阱',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_SOLIDTRAP, 1]]
};
SkillInfo[SK.TR_STAGE_MANNER] = {
	Name: 'TR_STAGE_MANNER',
	SkillName: '舞台礼仪',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.TR_RETROSPECTION] = {
	Name: 'TR_RETROSPECTION',
	SkillName: '回忆',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 1]]
};
SkillInfo[SK.TR_MYSTIC_SYMPHONY] = {
	Name: 'TR_MYSTIC_SYMPHONY',
	SkillName: '神秘交响曲',
	MaxLv: 1,
	SpAmount: [250],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TR_METALIC_FURY, 1],
		[SK.TR_ROSEBLOSSOM, 5]
	]
};
SkillInfo[SK.TR_KVASIR_SONATA] = {
	Name: 'TR_KVASIR_SONATA',
	SkillName: '夸西尔奏鸣曲',
	MaxLv: 1,
	SpAmount: [300],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TR_ROKI_CAPRICCIO, 1],
		[SK.TR_NIPELHEIM_REQUIEM, 1]
	]
};
SkillInfo[SK.TR_ROSEBLOSSOM] = {
	Name: 'TR_ROSEBLOSSOM',
	SkillName: '玫瑰绽放',
	MaxLv: 5,
	SpAmount: [215, 230, 245, 260, 275],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.TR_RHYTHMSHOOTING, 3]]
};
SkillInfo[SK.TR_RHYTHMSHOOTING] = {
	Name: 'TR_RHYTHMSHOOTING',
	SkillName: '节奏射击',
	MaxLv: 5,
	SpAmount: [80, 92, 104, 116, 128],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.TR_METALIC_FURY] = {
	Name: 'TR_METALIC_FURY',
	SkillName: '金属狂怒',
	MaxLv: 5,
	SpAmount: [120, 132, 144, 156, 168],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.TR_SOUNDBLEND, 1]]
};
SkillInfo[SK.TR_SOUNDBLEND] = {
	Name: 'TR_SOUNDBLEND',
	SkillName: '声音融合',
	MaxLv: 5,
	SpAmount: [80, 92, 104, 116, 128],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_METALICSOUND, 5]]
};
SkillInfo[SK.TR_GEF_NOCTURN] = {
	Name: 'TR_GEF_NOCTURN',
	SkillName: '吉芬尼亚夜曲',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 3]]
};
SkillInfo[SK.TR_ROKI_CAPRICCIO] = {
	Name: 'TR_ROKI_CAPRICCIO',
	SkillName: '洛基随想曲',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_JAWAII_SERENADE, 1]]
};
SkillInfo[SK.TR_AIN_RHAPSODY] = {
	Name: 'TR_AIN_RHAPSODY',
	SkillName: '矿工狂想曲',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 3]]
};
SkillInfo[SK.TR_MUSICAL_INTERLUDE] = {
	Name: 'TR_MUSICAL_INTERLUDE',
	SkillName: '音乐间奏',
	MaxLv: 5,
	SpAmount: [171, 182, 193, 204, 215],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_AIN_RHAPSODY, 1]]
};
SkillInfo[SK.TR_JAWAII_SERENADE] = {
	Name: 'TR_JAWAII_SERENADE',
	SkillName: 'Jawaii Serenade',
	MaxLv: 5,
	SpAmount: [140, 150, 160, 170, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_GEF_NOCTURN, 1]]
};
SkillInfo[SK.TR_NIPELHEIM_REQUIEM] = {
	Name: 'TR_NIPELHEIM_REQUIEM',
	SkillName: 'Nifflheim Requiem',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TR_MUSICAL_INTERLUDE, 1],
		[SK.TR_PRON_MARCH, 1]
	]
};
SkillInfo[SK.TR_PRON_MARCH] = {
	Name: 'TR_PRON_MARCH',
	SkillName: 'Prontera March',
	MaxLv: 5,
	SpAmount: [140, 150, 160, 170, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_AIN_RHAPSODY, 1]]
};
SkillInfo[SK.ABC_DAGGER_AND_BOW_M] = {
	Name: 'ABC_DAGGER_AND_BOW_M',
	SkillName: 'Dagger Bow Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ABC_MAGIC_SWORD_M] = {
	Name: 'ABC_MAGIC_SWORD_M',
	SkillName: 'Magic Sword Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_REPRODUCE, 5],
		[SK.SC_AUTOSHADOWSPELL, 5]
	]
};
SkillInfo[SK.ABC_STRIP_SHADOW] = {
	Name: 'ABC_STRIP_SHADOW',
	SkillName: 'Divest Shadow',
	MaxLv: 5,
	SpAmount: [29, 33, 37, 41, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.SC_STRIPACCESSARY, 1],
		[SK.ABC_DAGGER_AND_BOW_M, 7]
	]
};
SkillInfo[SK.ABC_ABYSS_DAGGER] = {
	Name: 'ABC_ABYSS_DAGGER',
	SkillName: 'Abyss Dagger',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_FATALMENACE, 5],
		[SK.ABC_DAGGER_AND_BOW_M, 3]
	]
};
SkillInfo[SK.ABC_UNLUCKY_RUSH] = {
	Name: 'ABC_UNLUCKY_RUSH',
	SkillName: 'Misfortune Rush',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 4]
	]
};
SkillInfo[SK.ABC_CHAIN_REACTION_SHOT] = {
	Name: 'ABC_CHAIN_REACTION_SHOT',
	SkillName: 'Chain Reaction Shot',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SC_TRIANGLESHOT, 5],
		[SK.ABC_DAGGER_AND_BOW_M, 3]
	]
};
SkillInfo[SK.ABC_FROM_THE_ABYSS] = {
	Name: 'ABC_FROM_THE_ABYSS',
	SkillName: 'From the Abyss',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.ABC_MAGIC_SWORD_M, 3]]
};
SkillInfo[SK.ABC_ABYSS_SLAYER] = {
	Name: 'ABC_ABYSS_SLAYER',
	SkillName: 'Abyss Slayer',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 5],
		[SK.ABC_DEFT_STAB, 5]
	]
};
SkillInfo[SK.ABC_ABYSS_STRIKE] = {
	Name: 'ABC_ABYSS_STRIKE',
	SkillName: 'Omega Abyss Strike',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_FROM_THE_ABYSS, 3],
		[SK.ABC_ABYSS_SQUARE, 3]
	]
};
SkillInfo[SK.ABC_DEFT_STAB] = {
	Name: 'ABC_DEFT_STAB',
	SkillName: 'Deft Stab',
	MaxLv: 10,
	SpAmount: [28, 31, 34, 37, 40, 43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 5]
	]
};
SkillInfo[SK.ABC_ABYSS_SQUARE] = {
	Name: 'ABC_ABYSS_SQUARE',
	SkillName: 'Abyss Square',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_MAGIC_SWORD_M, 5],
		[SK.ABC_FROM_THE_ABYSS, 1]
	]
};
SkillInfo[SK.ABC_FRENZY_SHOT] = {
	Name: 'ABC_FRENZY_SHOT',
	SkillName: 'Frenzy Shot',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_CHAIN_REACTION_SHOT, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 5]
	]
};
SkillInfo[SK.MT_AXE_STOMP] = {
	Name: 'MT_AXE_STOMP',
	SkillName: 'Axe Stomp',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_TWOAXEDEF, 5]]
};
SkillInfo[SK.MT_RUSH_QUAKE] = {
	Name: 'MT_RUSH_QUAKE',
	SkillName: 'Rush Quake',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MT_AXE_STOMP, 5]]
};
SkillInfo[SK.MT_M_MACHINE] = {
	Name: 'MT_M_MACHINE',
	SkillName: 'Manufacture Machine',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MT_A_MACHINE] = {
	Name: 'MT_A_MACHINE',
	SkillName: 'Activate Attack Device',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_AXE_STOMP, 3],
		[SK.MT_M_MACHINE, 3]
	]
};
SkillInfo[SK.MT_D_MACHINE] = {
	Name: 'MT_D_MACHINE',
	SkillName: 'Activate Defense Device',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_M_MACHINE, 1]]
};
SkillInfo[SK.MT_TWOAXEDEF] = {
	Name: 'MT_TWOAXEDEF',
	SkillName: 'Two-handed Axe Defense',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MT_ABR_M] = {
	Name: 'MT_ABR_M',
	SkillName: 'ABR Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_M_MACHINE, 1]]
};
SkillInfo[SK.MT_SUMMON_ABR_BATTLE_WARIOR] = {
	Name: 'MT_SUMMON_ABR_BATTLE_WARIOR',
	SkillName: 'ABR: Battle Warrior',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_ABR_M, 1]]
};
SkillInfo[SK.MT_SUMMON_ABR_DUAL_CANNON] = {
	Name: 'MT_SUMMON_ABR_DUAL_CANNON',
	SkillName: 'ABR: Dual Cannon',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 3],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 2]
	]
};
SkillInfo[SK.MT_SUMMON_ABR_MOTHER_NET] = {
	Name: 'MT_SUMMON_ABR_MOTHER_NET',
	SkillName: 'ABR: Mother Net',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 5],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 3],
		[SK.MT_SUMMON_ABR_DUAL_CANNON, 3]
	]
};
SkillInfo[SK.MT_SUMMON_ABR_INFINITY] = {
	Name: 'MT_SUMMON_ABR_INFINITY',
	SkillName: 'ABR: Infinity',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	ApAmount: [200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 10],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 4],
		[SK.MT_SUMMON_ABR_DUAL_CANNON, 4],
		[SK.MT_SUMMON_ABR_MOTHER_NET, 4]
	]
};
SkillInfo[SK.ABR_DUAL_CANNON_FIRE] = {
	Name: 'ABR_DUAL_CANNON_FIRE',
	SkillName: 'Dual Cannon Fire',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_BATTLE_BUSTER] = {
	Name: 'ABR_BATTLE_BUSTER',
	SkillName: 'Battle Buster',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_NET_REPAIR] = {
	Name: 'ABR_NET_REPAIR',
	SkillName: 'Net Repair',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_NET_SUPPORT] = {
	Name: 'ABR_NET_SUPPORT',
	SkillName: 'Net Support',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_INFINITY_BUSTER] = {
	Name: 'ABR_INFINITY_BUSTER',
	SkillName: 'Infinity Buster',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_MAGIC_BOOK_M] = {
	Name: 'EM_MAGIC_BOOK_M',
	SkillName: 'Magic Book Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EM_SPELL_ENCHANTING] = {
	Name: 'EM_SPELL_ENCHANTING',
	SkillName: 'Spell Enchanting',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 5]]
};
SkillInfo[SK.EM_ACTIVITY_BURN] = {
	Name: 'EM_ACTIVITY_BURN',
	SkillName: 'AP Burn',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_SPELL_ENCHANTING, 3]]
};
SkillInfo[SK.EM_INCREASING_ACTIVITY] = {
	Name: 'EM_INCREASING_ACTIVITY',
	SkillName: 'Increase AP',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	ApAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_ACTIVITY_BURN, 5]]
};
SkillInfo[SK.EM_DIAMOND_STORM] = {
	Name: 'EM_DIAMOND_STORM',
	SkillName: 'Diamond Storm',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_LIGHTNING_LAND] = {
	Name: 'EM_LIGHTNING_LAND',
	SkillName: 'Lightning Land',
	MaxLv: 5,
	SpAmount: [65, 70, 80, 85, 95],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_VENOM_SWAMP] = {
	Name: 'EM_VENOM_SWAMP',
	SkillName: 'Venom Swamp',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_CONFLAGRATION] = {
	Name: 'EM_CONFLAGRATION',
	SkillName: 'Conflagration',
	MaxLv: 5,
	SpAmount: [70, 80, 90, 100, 110],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_TERRA_DRIVE] = {
	Name: 'EM_TERRA_DRIVE',
	SkillName: 'Terra Drive',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_ELEMENTAL_SPIRIT_M] = {
	Name: 'EM_ELEMENTAL_SPIRIT_M',
	SkillName: 'Elemental Spirit Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_SYMPATHY, 1]]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_ARDOR] = {
	Name: 'EM_SUMMON_ELEMENTAL_ARDOR',
	SkillName: 'Summon Elemental: Ador',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AGNI, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_CONFLAGRATION, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_DILUVIO] = {
	Name: 'EM_SUMMON_ELEMENTAL_DILUVIO',
	SkillName: 'Summon Elemental: Diluvio',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AQUA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_DIAMOND_STORM, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_PROCELLA] = {
	Name: 'EM_SUMMON_ELEMENTAL_PROCELLA',
	SkillName: 'Summon Elemental: Procella',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_VENTUS, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_LIGHTNING_LAND, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_TERREMOTUS] = {
	Name: 'EM_SUMMON_ELEMENTAL_TERREMOTUS',
	SkillName: 'Summon Elemental: Terremotus',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_TERA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_TERRA_DRIVE, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_SERPENS] = {
	Name: 'EM_SUMMON_ELEMENTAL_SERPENS',
	SkillName: 'Summon Elemental: Serpens',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AGNI, 3],
		[SK.SO_SUMMON_AQUA, 3],
		[SK.SO_SUMMON_VENTUS, 3],
		[SK.SO_SUMMON_TERA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_VENOM_SWAMP, 1]
	]
};
SkillInfo[SK.EM_ELEMENTAL_BUSTER] = {
	Name: 'EM_ELEMENTAL_BUSTER',
	SkillName: 'Elemental Buster',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.EM_SUMMON_ELEMENTAL_SERPENS, 1],
		[SK.EM_SUMMON_ELEMENTAL_TERREMOTUS, 1],
		[SK.EM_SUMMON_ELEMENTAL_PROCELLA, 1],
		[SK.EM_SUMMON_ELEMENTAL_DILUVIO, 1],
		[SK.EM_ELEMENTAL_SPIRIT_M, 5],
		[SK.EM_SUMMON_ELEMENTAL_ARDOR, 1]
	]
};
SkillInfo[SK.EM_ELEMENTAL_VEIL] = {
	Name: 'EM_ELEMENTAL_VEIL',
	SkillName: 'Elemental Veil',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.EM_ELEMENTAL_SPIRIT_M, 3]]
};
SkillInfo[SK.EM_EL_FLAMETECHNIC] = {
	Name: 'EM_EL_FLAMETECHNIC',
	SkillName: '火焰技法',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_FLAMEARMOR] = {
	Name: 'EM_EL_FLAMEARMOR',
	SkillName: '火焰铠甲',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_FLAMEROCK] = {
	Name: 'EM_EL_FLAMEROCK',
	SkillName: '火焰岩石',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_COLD_FORCE] = {
	Name: 'EM_EL_COLD_FORCE',
	SkillName: '寒冷之力',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_CRYSTAL_ARMOR] = {
	Name: 'EM_EL_CRYSTAL_ARMOR',
	SkillName: '水晶铠甲',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_AGE_OF_ICE] = {
	Name: 'EM_EL_AGE_OF_ICE',
	SkillName: '冰河时代',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_GRACE_BREEZE] = {
	Name: 'EM_EL_GRACE_BREEZE',
	SkillName: '恩典微风',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_EYES_OF_STORM] = {
	Name: 'EM_EL_EYES_OF_STORM',
	SkillName: '风暴之眼',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_STORM_WIND] = {
	Name: 'EM_EL_STORM_WIND',
	SkillName: '风暴之风',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_EARTH_CARE] = {
	Name: 'EM_EL_EARTH_CARE',
	SkillName: '大地守护',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_STRONG_PROTECTION] = {
	Name: 'EM_EL_STRONG_PROTECTION',
	SkillName: '强力保护',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_AVALANCHE] = {
	Name: 'EM_EL_AVALANCHE',
	SkillName: '雪崩',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_DEEP_POISONING] = {
	Name: 'EM_EL_DEEP_POISONING',
	SkillName: '深度中毒',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_POISON_SHIELD] = {
	Name: 'EM_EL_POISON_SHIELD',
	SkillName: '毒之盾',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_DEADLY_POISON] = {
	Name: 'EM_EL_DEADLY_POISON',
	SkillName: '致命毒药',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.NPC_DEADLYCURSE2] = {
	Name: 'NPC_DEADLYCURSE2',
	SkillName: '广域致命诅咒',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11],
		[13, 13]
	]
};

export default SkillInfo;
