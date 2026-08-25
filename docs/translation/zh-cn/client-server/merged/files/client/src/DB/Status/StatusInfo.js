/**
 * DB/Status/StatusInfo.js
 *
 * Icons of status
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import SC from './StatusConst.js';

// Hardcoded color
const COLOR_TITLE_BUFF = 'rgb(155, 202, 155)';
const COLOR_TITLE_DEBUFF = 'rgb(250, 100, 100)';
const COLOR_TITLE_TOGGLE = 'rgb(190, 190, 250)';
const COLOR_SYSTEM = 'rgb(255, 255,   0)';
const COLOR_TIME = 'rgb(255, 176,  98)';

// TODO: find icon status: 40-49 | 60 | 63-64 | 66-67 | 70-86 | 88-89 | 64-621 | ???

const StatusInfo = {};

StatusInfo[SC.OVERTHRUSTMAX] = {
	icon: '\x69\x5f\xbf\xc0\xb9\xf6\xb8\xc6\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['最大过度加速', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高武器伤害。'],
		['提高武器损坏的可能性。']
	]
};

StatusInfo[SC.SUFFRAGIUM] = {
	icon: '\xbc\xf6\xc1\xdd\xc0\xba\xc7\xcf\xb7\xe7\xc0\xc7\xbf\xec\xbf\xef.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['牺牲祈福', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['减少吟唱时间。']]
};

StatusInfo[SC.OVERTHRUST] = {
	icon: '\xbf\xc0\xb9\xf6\xc6\xae\xb7\xaf\xbd\xba\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['过度加速', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高武器伤害。'],
		['提高武器损坏的可能性。']
	]
};

StatusInfo[SC.AUTOBERSERK] = {
	icon: '\xb1\xdd\xb0\xad\xba\xd2\xb1\xab.tga',
	descript: [['自动狂暴', COLOR_TITLE_BUFF], ['濒死时进入狂暴状态']]
};

StatusInfo[SC.BEYOND_OF_WARCRY] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['超越战吼', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高物理攻击力'],
		['降低魔法攻击力']
	]
};

StatusInfo[SC.SWORDREJECT] = {
	icon: 'icon04.tga',
	descript: [
		['剑术反击', COLOR_TITLE_BUFF],
		['将伤害反弹给攻击中的怪物'],
		['（对所有怪物攻击）'],
		['受到的伤害减少一半'],
		['你会承受另一半伤害']
	]
};

StatusInfo[SC.MANU_DEF] = {
	icon: 'efst_def.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['马努克的意志', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['减少物理/魔法伤害'],
		['来自马努克原野的怪物']
	]
};

StatusInfo[SC.CONCENTRATION] = {
	icon: '\xc1\xfd\xc1\xdf\xb7\xc2\xc7\xe2\xbb\xf3.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['集中注意力', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 DEX、AGI'],
		['显现附近的隐形敌人']
	]
};

StatusInfo[SC.GRIFFON] = {
	icon: '\xb6\xf3\xc0\xcc\xb5\xf9.tga',
	descript: [['骑乘狮鹫', COLOR_TITLE_TOGGLE]]
};

StatusInfo[SC.GS_MADNESSCANCEL] = {
	icon: 'i_madness.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['疯狂取消者（最后一搏）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 ATK'],
		['提高攻击速度'],
		['无法移动']
	]
};

StatusInfo[SC.GS_ACCURACY] = {
	icon: 'i_accuracy',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['精准提升（提高命中率）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高命中率'],
		['提高 DEX'],
		['提高 AGI']
	]
};

StatusInfo[SC.FOOD_STR] = {
	icon: 'str_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 STR']]
};

StatusInfo[SC.HALLUCINATIONWALK] = {
	icon: '\xc7\xd2\xb7\xe7\xbd\xc3\xb3\xd7\xc0\xcc\xbc\xc7\xbf\xf6\xc5\xa9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['幻影步', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高回避率'],
		['有机会回避魔法伤害。']
	]
};

StatusInfo[SC.STORMKICK_ON] = {
	icon: 'i_stormkick.tga',
	descript: [
		['旋风踢（龙卷踢）', COLOR_TITLE_BUFF],
		['攻击敌人时'],
		['有机会准备旋风踢']
	]
};

StatusInfo[SC.KAUPE] = {
	icon: 'i_kaupe.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['金蝉脱壳', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['有机会回避敌人攻击。']]
};

StatusInfo[SC.SHIELDSPELL_DEF] = {
	icon: 'lg_shieldspell_¹æ.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['盾牌咒文（DEF）', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['根据 DEF 发动魔法。']]
};

StatusInfo[SC.WARMER] = {
	icon: '\xbf\xf6\xb8\xd3.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['温暖', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['解除冰冻/冻结状态'],
		['免疫冰冻/冻结状态'],
		['每3秒恢复 HP']
	]
};

StatusInfo[SC.PROTECT_MDEF] = {
	icon: '\xb8\xb6\xb9\xfd\xb9\xe6\xbe\xee\xc6\xf7\xbc\xc7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['魔法铠甲药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高魔法攻击抗性']
	]
};

StatusInfo[SC.STAR_COMFORT] = {
	icon: 'i_starcomfort.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['星辰的安慰', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 ASPD']]
};

StatusInfo[SC.FOOD_CRITICALSUCCESSVALUE] = {
	icon: 'gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 CRIT']]
};

StatusInfo[SC.PROPERTYTELEKINESIS] = {
	icon: 'i_p_tele.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['暖风', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加幽灵属性']]
};

StatusInfo[SC.GLOOMYDAY] = {
	icon: '\xbc\xf6\xc1\xdd\xc0\xba\xc7\xcf\xb7\xe7\xc0\xc7\xbf\xec\xbf\xef.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['阴郁之日', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高特定技能伤害'],
		['降低 FLEE、ASPD']
	]
};

StatusInfo[SC.SIRCLEOFNATURE] = {
	icon: '\xbc\xf8\xc8\xaf\xc7\xcf\xb4\xc2\xc0\xda\xbf\xac\xc0\xc7\xbc\xd2\xb8\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['自然之声', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['消耗 SP 并恢复 HP']]
};

StatusInfo[SC.DEADLYINFECT] = {
	icon: '\xb5\xa5\xb5\xe9\xb8\xae\xc0\xce\xc6\xe5\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['致命感染', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['攻击时'],
		['或受到攻击时'],
		['将你的状态效果施加给对方']
	]
};

StatusInfo[SC.SYMPHONY_LOVE] = {
	icon: '\xbf\xac\xc0\xce\xb5\xe9\xc0\xbb\xc0\xa7\xc7\xd1\xbd\xc9\xc6\xf7\xb4\xcf.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['爱的交响曲', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 MDEF']]
};

StatusInfo[SC.BANDING] = {
	icon: 'lg_banding.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['编队', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['编队状态']]
};

StatusInfo[SC.NJ_BUNSINJYUTSU] = {
	icon: 'i_bunsin.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['幻影分身', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['回避一定次数的物理攻击'],
		['无法回避魔法攻击']
	]
};

StatusInfo[SC.WUGRIDER] = {
	icon: 'wolfmount.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['狼骑乘', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['无法使用弓'],
		['仅可使用狼技能']
	]
};

StatusInfo[SC.ATKER_BLOOD] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['SP 消耗减少药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['技能 SP 消耗减少15%']
	]
};

StatusInfo[SC.BODYPAINT] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['身体彩绘', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['显现隐形敌人'],
		['有机会使敌人陷入黑暗'],
		['降低敌人 ASPD']
	]
};

StatusInfo[SC.NJ_UTSUSEMI] = {
	icon: 'i_maemi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['蝉蜕', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['回避一定次数的物理攻击'],
		['回避时向攻击者相反方向移动']
	]
};

StatusInfo[SC.POISONINGWEAPON] = {
	icon: '\xc6\xf7\xc0\xcc\xc1\xee\xb4\xd7\xbf\xfe\xc6\xf9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['武器涂毒', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['将武器上的毒药施加给目标']
	]
};

StatusInfo[SC.CASH_DEATHPENALTY] = {
	icon: 'death.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['生命保险', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['死亡时不会损失 EXP']]
};

StatusInfo[SC.GS_ADJUSTMENT] = {
	icon: 'i_adjustment.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['调整', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['降低 HIT'],
		['提高 FLEE'],
		['降低受到的远程物理攻击伤害']
	]
};

StatusInfo[SC.AUTOSPELL] = {
	icon: '\xbf\xc0\xc5\xe4\xbd\xba\xc6\xe7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['自动念咒', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['进行物理攻击时'],
		['所选技能会自动施放且无吟唱时间。'],
		['消耗的 SP 为通常值的 2/3'],
		['SP 不足时不会施放技能']
	]
};

StatusInfo[SC.DEC_AGI] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xb0\xa8\xbc\xd2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['敏捷下降', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低移动速度'],
		['降低 ASPD']
	]
};

StatusInfo[SC.NOEQUIPWEAPON] = {
	icon: '\xbd\xba\xc6\xae\xb8\xb3\xbf\xfe\xc6\xf9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['武器卸除状态', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['无法装备武器']]
};

StatusInfo[SC.SHIELDSPELL_MDEF] = {
	icon: 'lg_shieldspell_¸¶.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['盾牌咒文（MDEF）', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['根据 MDEF 发动魔法']]
};

StatusInfo[SC.AUTOGUARD] = {
	icon: '\xbf\xc0\xc5\xe4\xb0\xa1\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['自动防御', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['有机会格挡物理攻击']]
};

StatusInfo[SC.TAROTCARD] = {
	icon: '\x69\x5f\xc5\xb8\xb7\xce\xc4\xab\xb5\xe5.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['命运塔罗牌', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['施加14张牌及其效果之一']
	]
};

StatusInfo[SC.FEARBREEZE] = {
	icon: 'ra_fearbreeze.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['恐惧微风', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使用弓攻击时'],
		['有机会造成额外攻击']
	]
};

StatusInfo[SC.GN_CARTBOOST] = {
	icon: 'icon07.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['手推车加速', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高移动速度']]
};

StatusInfo[SC.SHIELDSPELL_REF] = {
	icon: 'lg_shieldspell_¿¬.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['盾牌咒文（精炼）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['根据精炼等级发动魔法效果']
	]
};

StatusInfo[SC.FOOD_INT_CASH] = {
	icon: 'int_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 INT']]
};

StatusInfo[SC.NOEQUIPSHIELD] = {
	icon: '\xbd\xba\xc6\xae\xb8\xb3\xbd\xaf\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['盾牌卸除状态', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['无法装备盾牌']]
};

StatusInfo[SC.MELTDOWN] = {
	icon: 'icon03.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['熔毁', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['攻击玩家时'],
		['有机会破坏其武器/防具'],
		['攻击怪物时'],
		['怪物的攻击和防御会降低']
	]
};

StatusInfo[SC.QUAGMIRE] = {
	icon: '\xc4\xe2\xb1\xd7\xb8\xb6\xc0\xcc\xbe\xee.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['泥沼术', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['降低移动速度'], ['降低 AGI/DEX']]
};

StatusInfo[SC.KAIZEL] = {
	icon: 'i_kaizel.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['凯易哲', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['吟唱时间不受 DEX 影响'],
		['死亡时会以圣母之祈福状态复活2秒']
	]
};

StatusInfo[SC.CR_SHRINK] = {
	icon: 'i_shrink.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['缩小术', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['自动防御时受到攻击'],
		['有几率将攻击反弹回去']
	]
};

StatusInfo[SC.FOOD_VIT] = {
	icon: 'vit_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高VIT']]
};

StatusInfo[SC.PARRYING] = {
	icon: 'icon10.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['招架', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['有几率抵挡物理攻击']]
};

StatusInfo[SC.PROTECTWEAPON] = {
	icon: '\xc4\xc9\xb9\xcc\xc4\xc3\xc7\xc1\xb7\xce\xc5\xd8\xbc\xc7\x5b\xbf\xfe\xc6\xf9\x5d.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['化学保护（武器）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['防止武器被卸除或破坏']
	]
};

StatusInfo[SC.FOOD_AGI] = {
	icon: 'agi_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高AGI']]
};

StatusInfo[SC.INC_AGI] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xc1\xf5\xb0\xa1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['敏捷提升', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高移动速度'],
		['提高攻击速度']
	]
};

StatusInfo[SC.SHOUT] = {
	icon: '\xb0\xed\xbc\xba\xc1\xf6\xb8\xa3\xb1\xe2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['大声吼叫（疯狂喧嚣）', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高STR']]
};

StatusInfo[SC.CASH_RECEIVEITEM] = {
	icon: 'item.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['击杀魔物时'], ['掉落概率翻倍']]
};

StatusInfo[SC.SPL_DEF] = {
	icon: 'efst_def.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['蜂蜜果酱', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['降低受到的物理和魔法伤害'],
		['来自斯普兰迪德原野魔物的伤害']
	]
};

StatusInfo[SC.ILLUSION] = {
	icon: '\xc8\xaf\xb0\xa2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['幻影', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['画面扭曲'],
		['显示更多伤害'],
		['随机打断吟唱']
	]
};

StatusInfo[SC.HOVERING] = {
	icon: '\xc8\xa3\xb9\xf6\xb8\xb5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['悬浮', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['陷阱和部分地面技能不会产生效果']
	]
};

StatusInfo[SC.BENEDICTIO] = {
	icon: '\xbc\xba\xc3\xbc\xb0\xad\xba\xb9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['为铠甲附加圣属性']]
};

StatusInfo[SC.WEAPONBLOCKING] = {
	icon: '\xbf\xfe\xc6\xf9\xba\xed\xb7\xce\xc5\xb7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['武器格挡', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到近距离物理攻击时'],
		['有几率使伤害无效']
	]
};

StatusInfo[SC.ANGELUS] = {
	icon: '\xbe\xc8\xc1\xa9\xb7\xe7\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['天使之护', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高VIT DEF']]
};

StatusInfo[SC.MARSHOFABYSS] = {
	icon: 'marshofabyss.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['深渊沼泽', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['降低移动速度'], ['降低DEF和FLEE']]
};

StatusInfo[SC.STEALTHFIELD] = {
	icon: '\xbd\xba\xc5\xda\xbd\xba\xc7\xca\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['隐形力场', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使施法者周围一定范围内的所有人隐形'],
		['持续期间消耗SP'],
		['降低移动速度']
	]
};

StatusInfo[SC.ADRENALINE2] = {
	icon: '\xbe\xc6\xb5\xe5\xb7\xb9\xb3\xaf\xb8\xb0\xb7\xaf\xbd\xac.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['完全速度激发', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高武器ASPD，弓除外']]
};

StatusInfo[SC.MANU_MATK] = {
	icon: 'efst_matk.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['马努克的信仰', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高魔法攻击，针对'],
		['马努克原野的所有魔物']
	]
};

StatusInfo[SC.NOEQUIPARMOR] = {
	icon: '\xbd\xba\xc6\xae\xb8\xb3\xbe\xc6\xb8\xd3.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['卸除铠甲状态', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['无法穿戴铠甲']]
};

StatusInfo[SC.RENOVATIO] = {
	icon: '\xb7\xb9\xb3\xeb\xb9\xd9\xc6\xbc\xbf\xc0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['再生术', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每 5 秒恢复 HP'],
		['对不死魔物使用时'],
		['根据技能等级造成高额伤害']
	]
};

StatusInfo[SC.HIDING] = {
	icon: '\xc7\xcf\xc0\xcc\xb5\xf9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['隐匿', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['潜入地下躲避敌人攻击'],
		['可被侦测技能发现']
	]
};

StatusInfo[SC.WEIGHTOVER50] = {
	icon: '\xb9\xab\xb0\xd4\x35\x30\xc0\xcc\xbb\xf3.tga',
	descript: [['负重超过 50%', COLOR_TITLE_DEBUFF], ['HP/SP 不会恢复']]
};

StatusInfo[SC.STRUP] = {
	icon: 'i_run.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['冲刺', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高STR'],
		['如果使用者未装备武器'],
		['且技能等级足够高']
	]
};

StatusInfo[SC.NOEQUIPHELM] = {
	icon: '\xbd\xba\xc6\xae\xb8\xb3\xc7\xef\xb8\xa7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['卸除头饰状态', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['无法穿戴头饰']]
};

StatusInfo[SC.ATTHASTE_POTION3] = {
	icon: '\xb0\xf8\xbc\xd3\xb9\xb0\xbe\xe0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['狂暴药水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高ASPD']]
};

StatusInfo[SC.ENDURE] = {
	icon: '\xc0\xce\xb5\xe0\xbe\xee.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['霸体', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到伤害时仍可攻击'],
		['并可移动']
	]
};

StatusInfo[SC.TURNKICK_ON] = {
	icon: 'i_turnkick.tga',
	descript: [['回旋踢准备', COLOR_TITLE_BUFF], ['攻击时'], ['有几率准备回旋踢']]
};

StatusInfo[SC.ENCHANTPOISON] = {
	icon: '\xc0\xce\xc2\xf9\xc6\xae\xc6\xf7\xc0\xcc\xc1\xf0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['毒属性附加', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加毒属性']]
};

StatusInfo[SC.SPL_ATK] = {
	icon: 'efst_atk.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['食人花腌制果实', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高对'],
		['斯普兰迪德原野所有魔物的物理攻击']
	]
};

StatusInfo[SC.BLESSING] = {
	icon: '\xba\xed\xb7\xb9\xbd\xcc.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['天使之赐福', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高DEX、INT和STR'],
		['解除部分状态异常']
	]
};

StatusInfo[SC.ONEHANDQUICKEN] = {
	icon: 'i_onehand.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['单手剑加速', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使用单手武器时'],
		['提高ASPD']
	]
};

StatusInfo[SC.SPEARQUICKEN] = {
	icon: '\xbd\xba\xc7\xc7\xbe\xee\xc4\xfb\xc5\xab.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['长矛加速', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],

		['使用长矛时提高ASPD'],
		['提高暴击率'],

		['提高FLEE']
	]
};

StatusInfo[SC.BROKENWEAPON] = {
	icon: '\xb9\xab\xb1\xe2\xc6\xc4\xb1\xab.tga',
	descript: [['武器已损坏。', COLOR_TITLE_DEBUFF]]
};

StatusInfo[SC.ASSUMPTIO] = {
	icon: 'icon05.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['霸邪之阵', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['降低受到的伤害']]
};

StatusInfo[SC.MAXIMIZE] = {
	icon: '\xb8\xc6\xbd\xc3\xb8\xb6\xc0\xcc\xc1\xee\xc6\xc4\xbf\xf6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Maximize Power', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Increases damage to the maximum'],
		['Drains SP over time']
	]
};

StatusInfo[SC.PROTECTSHIELD] = {
	icon: '\xc4\xc9\xb9\xcc\xc4\xc3\xc7\xc1\xb7\xce\xc5\xd8\xbc\xc7\x5b\xbd\xaf\xb5\xe5\x5d.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Chemical Protection (Shield)', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Prevents shield from being stripped/broken']
	]
};

StatusInfo[SC.MAGNIFICAT] = {
	icon: '\xb8\xb6\xb4\xcf\xc7\xc7\xc4\xb1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['圣母之颂歌', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高自然SP恢复速度']]
};

StatusInfo[SC.ATTHASTE_POTION1] = {
	icon: '\xb0\xf8\xbc\xd3\xb9\xb0\xbe\xe0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['集中药水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高ASPD']]
};

StatusInfo[SC.POISONREACT] = {
	icon: '\xc6\xf7\xc0\xcc\xc1\xf0\xb8\xae\xbe\xd7\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['毒性反弹', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['以一次性攻击反击毒属性攻击'],
		['受到非毒属性物理攻击时'],
		['有几率对目标施放施毒']
	]
};

StatusInfo[SC.MOVHASTE_HORSE] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xc1\xf5\xb0\xa1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高移动速度']]
};

StatusInfo[SC.CRESCENTELBOW] = {
	icon: '\xb1\xe2\xb8\xae\xbf\xa1\xbf\xa4\xb7\xb9\xc0\xcc\xbc\xd5.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['新月肘击', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		["Attempts to counter opponent's attack"],
		['击退对手并造成伤害'],
		['你仍会受到部分伤害'],
		['对首领魔物无效', COLOR_SYSTEM]
	]
};

StatusInfo[SC.SONG_OF_MANA] = {
	icon: '\xb8\xb6\xb3\xaa\xc0\xc7\xb3\xeb\xb7\xa1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['魔力之歌', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['每 5 秒恢复SP']]
};

StatusInfo[SC.KAAHI] = {
	icon: 'i_kaahi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['凯阿希', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每当受到非技能攻击时'],
		['消耗SP并恢复HP']
	]
};

StatusInfo[SC.ECHOSONG] = {
	icon: '\xb8\xb6\xbd\xba\xc4\xbf\xb7\xb9\xc0\xcc\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['回声之歌', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高DEF']]
};

StatusInfo[SC.PRESERVE] = {
	icon: 'i_\xc7\xc1\xb8\xae\xc0\xfa\xba\xea.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['保留', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['允许保留复制的技能']]
};

StatusInfo[SC.WEAPONPERFECT] = {
	icon: '\xbf\xfe\xc6\xf9\xc6\xdb\xc6\xe5\xbc\xc7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['武器修炼', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['对'],
		['小型、中型和大型魔物均造成100%伤害']
	]
};

StatusInfo[SC.PROVOKE] = {
	icon: '\xc7\xc1\xb7\xce\xba\xb8\xc5\xa9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['挑衅', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['降低VIT DEF'], ['提高ATK']]
};

StatusInfo[SC.MOVHASTE_POTION] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xc1\xf5\xb0\xa1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高移动速度']]
};

StatusInfo[SC.EDP] = {
	icon: 'i_\xc4\xa1\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['致命毒药附加', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['为武器附加致命毒药'],
		['对首领魔物不增加伤害', COLOR_SYSTEM]
	]
};

StatusInfo[SC.JOINTBEAT] = {
	icon: '\xb0\xfc\xc0\xfd\xb0\xf8\xb0\xdd.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['关节打击', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['施加各种状态效果'],
		['由关节伤害触发。']
	]
};

StatusInfo[SC.PROVIDENCE] = {
	icon: '\xbd\xc5\xc0\xc7\xb6\xe6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['神佑之光', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高对'],
		['不死和恶魔魔物的抗性']
	]
};

StatusInfo[SC.FIGHTINGSPIRIT] = {
	icon: 'rk_eisir.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['卢恩石：战斗意志', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高ATK'],
		['提高施法者ASPD']
	]
};

StatusInfo[SC.FOOD_VIT_CASH] = {
	icon: 'vit_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高VIT']]
};

StatusInfo[SC.SATURDAY_NIGHT_FEVER] = {
	icon: '\xbb\xf5\xc5\xcd\xb5\xa5\xc0\xcc\xb3\xaa\xc0\xcc\xc6\xae\xc7\xc7\xb9\xf6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [
		['狂野', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['每 3 秒减少 HP/SP'],
		['伤害增加，防御和闪避下降'],
		['无法使用技能和物品。']
	]
};

StatusInfo[SC.TRUESIGHT] = {
	icon: 'icon09.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['真视', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['所有属性增加'],
		['攻击力、命中率、暴击率增加']
	]
};

StatusInfo[SC.CASH_PLUSONLYJOBEXP] = {
	icon: 'job.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['获得的职业经验增加。']]
};

StatusInfo[SC.ARMOR_PROPERTY] = {
	icon: '\xc4\xb3\xbd\xc3\xb0\xa9\xbf\xca\xbc\xd3\xbc\xba\xba\xce\xbf\xa9.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['护甲属性', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['改变你的属性']]
};

StatusInfo[SC.TENSIONRELAX] = {
	icon: 'icon08.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['紧张放松', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高自然 HP 恢复']]
};

StatusInfo[SC.DEATHHURT] = {
	icon: '\xbb\xf3\xc3\xb3\xbf\xc0\xbf\xb0\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['死亡伤害（污染伤口毒素）', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低治疗技能效果']
	]
};

StatusInfo[SC.IMPOSITIO] = {
	icon: '\xc0\xd3\xc6\xf7\xbd\xc3\xc6\xbc\xbf\xc0\xb8\xb6\xb4\xa9\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['武器祝福', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高武器伤害']]
};

StatusInfo[SC.LEECHESEND] = {
	icon: '\xb0\xc5\xb8\xd3\xb8\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['吸血终结', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['每秒吸取 HP']]
};

StatusInfo[SC.REPRODUCE] = {
	icon: '\xb8\xae\xc7\xc1\xb7\xce\xb5\xe0\xbd\xba.tga',
	descript: [
		['复制', COLOR_TITLE_BUFF],
		['被技能选中时激活'],
		['只能学习一个技能']
	]
};

StatusInfo[SC.ACCELERATION] = {
	icon: '\xbf\xa2\xbc\xbf\xb7\xb9\xc0\xcc\xbc\xc7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['加速', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高魔导机甲移动速度']]
};

StatusInfo[SC.NJ_NEN] = {
	icon: 'i_nen.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['灵魂', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 INT、STR']]
};

StatusInfo[SC.FORCEOFVANGUARD] = {
	icon: '\xc6\xf7\xbd\xba\xbf\xc0\xba\xea\xb9\xf0\xb0\xa1\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['先锋之力', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['最大 HP、防御增加'],
		['受到物理攻击时有机会获得怒气计数'],
		['激活期间消耗 SP']
	]
};

StatusInfo[SC.RG_CCONFINE_M] = {
	icon: 'i_closeconfine.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['紧闭束缚', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['双方玩家无法移动'],
		['提高闪避'],
		['不影响 Boss 怪物', COLOR_SYSTEM]
	]
};

StatusInfo[SC.TRICKDEAD] = {
	icon: '\xc1\xd7\xc0\xba\xc3\xb4\xc7\xcf\xb1\xe2.tga',
	descript: [['装死（假死）', COLOR_TITLE_TOGGLE], ['伪装死亡状态']]
};

StatusInfo[SC.PROPERTYWATER] = {
	icon: '\xc7\xc1\xb7\xce\xbd\xba\xc6\xae\xbf\xfe\xc6\xf9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['冰霜武器（赋予海啸）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['为武器赋予水属性']
	]
};

StatusInfo[SC.ADORAMUS] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xb0\xa8\xbc\xd2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['阿杜拉穆斯', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['致盲并降低移动速度']]
};

StatusInfo[SC.GENTLETOUCH_ENERGYGAIN] = {
	icon: '\xc1\xa1\xc7\xf7\xb1\xb8.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['温柔触摸－能量获得', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到攻击或进行攻击时，有机会'],
		['获得一个灵气球']
	]
};

StatusInfo[SC.NEUTRALBARRIER] = {
	icon: '\xb4\xba\xc6\xae\xb7\xb2\xb9\xe8\xb8\xae\xbe\xee.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['中立屏障', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['DEF/MDEF 提高'],
		['抵消远程攻击']
	]
};

StatusInfo[SC.EARTHSCROLL] = {
	icon: '\xb1\xdb\xb7\xce\xb8\xae\xbe\xc6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['快乐休息（愉悦休息）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['与另一名跆拳少年一起坐下时'],
		['恢复一定量的 SP'],
		['使用地震术卷轴时有机会不被消耗']
	]
};

StatusInfo[SC.FALCON] = {
	icon: '\xc6\xc8\xc4\xdc.tga',
	descript: [['猎鹰精通', COLOR_TITLE_TOGGLE], ['租借猎鹰']]
};

StatusInfo[SC.TWOHANDQUICKEN] = {
	icon: '\xc5\xf5\xc7\xda\xb5\xe5\xc4\xfb\xc5\xab.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['双手剑加速', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使用双手武器时，'],
		['提高攻击速度']
	]
};

StatusInfo[SC.SUN_COMFORT] = {
	icon: 'i_suncomfort.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['太阳的舒适', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 VIT 防御']]
};

StatusInfo[SC.KYRIE] = {
	icon: '\xb1\xe2\xb8\xae\xbf\xa1\xbf\xa4\xb7\xb9\xc0\xcc\xbc\xd5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['凯利艾勒森', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['阻挡一定次数攻击的防御屏障']
	]
};

StatusInfo[SC.PROTECTARMOR] = {
	icon: '\xc4\xc9\xb9\xcc\xc4\xc3\xc7\xc1\xb7\xce\xc5\xd8\xbc\xc7\x5b\xbe\xc6\xb8\xd3\x5d.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['化学保护（护甲）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['防止身体护甲被剥除或破坏']
	]
};

StatusInfo[SC.GIANTGROWTH] = {
	icon: 'rk_turisuss.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['符文石：巨大成长', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 STR'],
		['有机会大幅提高'],
		['近距离物理攻击伤害'],
		['每次攻击都有机会破坏武器']
	]
};

StatusInfo[SC.STR_SCROLL] = {
	icon: 'str_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 STR']]
};

StatusInfo[SC.AB_SECRAMENT] = {
	icon: '\xbc\xbc\xc5\xa9\xb6\xf3\xb8\xe0\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['圣礼', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['减少固定吟唱时间']]
};

StatusInfo[SC.PARALYSE] = {
	icon: '\xb0\xa8\xb0\xa2\xb8\xb6\xba\xf1\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['麻痹', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['降低攻击速度'],
		['降低闪避'],
		['降低移动速度']
	]
};

StatusInfo[SC.PROPERTYGROUND] = {
	icon: '\xbb\xe7\xc0\xcc\xc1\xee\xb9\xcd\xbf\xfe\xc6\xf9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['地震武器', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器赋予地属性']]
};

StatusInfo[SC.DOUBLECASTING] = {
	icon: 'i_\xb4\xf5\xba\xed\xc4\xb3\xbd\xba\xc6\xc3.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['双重吟唱', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['施放魔法箭技能时，'],
		['有机会自动再次施放']
	]
};

StatusInfo[SC.RG_CCONFINE_S] = {
	icon: 'i_closeconfine.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['紧闭束缚', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['双方玩家无法移动'],
		['提高闪避'],
		['不影响 Boss']
	]
};

StatusInfo[SC.OVERHEAT] = {
	icon: '\xbf\xc0\xb9\xf6\xc8\xf7\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['过热', COLOR_TITLE_BUFF], ['使用技能导致发热'], ['每秒吸取 HP']]
};

StatusInfo[SC.SPL_MATK] = {
	icon: 'efst_matk.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['康努斯之泪', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],

		['提高对斯普兰迪德原野所有怪物的'],
		['魔法攻击力']
	]
};

StatusInfo[SC.DEEP_SLEEP] = {
	icon: '\xbe\xc8\xbd\xc4\xc0\xc7\xc0\xda\xc0\xe5\xb0\xa1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['深度睡眠状态', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到的伤害增加 1.5 倍'],
		['每 2 秒恢复 HP/SP']
	]
};

StatusInfo[SC.RECOGNIZEDSPELL] = {
	icon: 'recognizespell.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['认知魔法', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['魔法技能造成最大伤害'],
		['所有技能消耗更多 SP']
	]
};

StatusInfo[SC.TARGET_ASPD] = {
	icon: 'plusmagicpower.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['最大 SP 增加，SP 消耗减少']]
};

StatusInfo[SC.FOOD_BASICAVOIDANCE] = {
	icon: 'gogi.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高闪避']]
};

StatusInfo[SC.DEFENDER] = {
	icon: '\xb5\xf0\xc6\xe6\xb4\xf5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['防御者（防御光环）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['减少远程物理攻击伤害'],
		['降低移动速度和攻击速度']
	]
};

StatusInfo[SC.WEAPONPROPERTY] = {
	icon: '\xbf\xac\xb8\xb6\xc1\xa6.tga', //CUSTOM
	haveTimeLimit: 0,
	descript: [['已赋予武器属性']]
};

StatusInfo[SC.S_LIFEPOTION] = {
	icon: '\xbc\xd2\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['小型生命药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每 5 秒恢复 HP'],
		['狂暴状态激活时无效']
	]
};

StatusInfo[SC.FOOD_LUK] = {
	icon: 'luk_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 LUK']]
};

StatusInfo[SC.BLOODING] = {
	icon: '\xc3\xe2\xc7\xf7\xbb\xf3\xc5\xc2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['流血', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['禁用 HP、SP 恢复'],
		['每 10 秒损失 HP']
	]
};

StatusInfo[SC.REFRESH] = {
	icon: 'rk_nauthiz.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['符文石：刷新', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['施放时移除所有减益效果'],
		['获得减益免疫'],
		['恢复一定量的 HP']
	]
};

StatusInfo[SC.FOOD_LUK_CASH] = {
	icon: 'luk_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 LUK']]
};

StatusInfo[SC.BROKENARMOR] = {
	icon: '\xb0\xa9\xbf\xca\xc6\xc4\xb1\xab.tga',
	descript: [['护甲已损坏', COLOR_TITLE_DEBUFF]]
};

StatusInfo[SC.DODGE_ON] = {
	icon: 'i_dodge.tga',
	descript: [
		['闪避', COLOR_TITLE_BUFF],
		['允许将飞踢作为反击使用'],
		['受到敌方魔法攻击时'],
		['有机会完全闪避'],
		['如果疾走也处于激活状态，'],
		['也有机会闪避物理攻击']
	]
};

StatusInfo[SC.TARGET_BLOOD] = {
	icon: '\xbc\xd2\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['抵抗药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高对以下状态的抵抗力：'],
		['眩晕、冰冻、石化、睡眠、沉默'],
		['黑暗、诅咒、中毒、流血、混乱']
	]
};

StatusInfo[SC.MELODYOFSINK] = {
	icon: '\xb8\xe1\xb7\xce\xb5\xf0\xbf\xc0\xba\xea\xbd\xcc\xc5\xa9.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['沉没旋律', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高魔法伤害'],
		['降低物理伤害']
	]
};

StatusInfo[SC.CRUCIS] = {
	icon: '\xbd\xc3\xb1\xd7\xb3\xd1\xc5\xa9\xb7\xe7\xbd\xc3\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['十字军徽章', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['降低不死和恶魔怪物的防御']]
};

StatusInfo[SC.SLOWCAST] = {
	icon: 'slowcast.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['缓慢吟唱', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['增加吟唱时间']]
};

StatusInfo[SC.PROPERTYWIND] = {
	icon: '\xb6\xf3\xc0\xcc\xc6\xae\xb4\xd7\xb7\xce\xb4\xf5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['闪电装填', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器赋予风属性']]
};

StatusInfo[SC.ENCHANTBLADE] = {
	icon: 'rk_enchant.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['附魔之刃', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为物理攻击增加魔法伤害']]
};

StatusInfo[SC.ADRENALINE] = {
	icon: '\xbe\xc6\xb5\xe5\xb7\xb9\xb3\xaf\xb8\xb0\xb7\xaf\xbd\xac.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['速度激发', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高以下武器的攻击速度：'],
		['斧和钝器']
	]
};

StatusInfo[SC.MAGICMUSHROOM] = {
	icon: '\xbf\xf4\xc0\xbd\xb9\xf6\xbc\xb8.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['魔法蘑菇（笑毒蘑菇）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使用微笑表情'],
		['每 4 秒施放随机法术'],
		['每 4 秒消耗 HP']
	]
};

StatusInfo[SC.CASH_PLUSEXP] = {
	icon: 'exp.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高获得的经验值']]
};

StatusInfo[SC.ATTHASTE_POTION2] = {
	icon: '\xb0\xf8\xbc\xd3\xb9\xb0\xbe\xe0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['觉醒药水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高攻击速度']]
};

StatusInfo[SC.TOXIN] = {
	icon: '\xbd\xc5\xb0\xe6\xb8\xb6\xba\xf1\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['毒素', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每 10 秒干扰技能'],
		['忽略菲恩卡效果'],
		['每 10 秒消耗 SP']
	]
};

StatusInfo[SC.RAISINGDRAGON] = {
	icon: '\xc0\xe1\xb7\xe6\xbd\xc2\xc3\xb5.tga',
	descript: [
		['升龙', COLOR_TITLE_BUFF],
		['增加最大气弹数'],
		['提高最大 HP/SP'],
		['提高攻击速度'],
		['维持狂怒状态'],
		['每秒缓慢消耗 HP']
	]
};

StatusInfo[SC.HARMONIZE] = {
	icon: '\xc7\xcf\xb8\xf0\xb3\xaa\xc0\xcc\xc1\xee.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['和谐', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高所有属性']]
};

StatusInfo[SC.CHASEWALK2] = {
	icon: 'i_\xc3\xbc\xc0\xcc\xbd\xba\xc8\xfb.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 STR']]
};

StatusInfo[SC.FOOD_STR_CASH] = {
	icon: 'str_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 STR']]
};

StatusInfo[SC.CLOAKINGEXCEED] = {
	icon: '\xc6\xf7\xc0\xcc\xc1\xee\xb4\xd7\xbf\xfe\xc6\xf9.tga',
	descript: [
		['超越隐匿', COLOR_TITLE_BUFF],
		['也能躲避昆虫和恶魔类魔物。'],
		['受到一定次数攻击前保持隐藏。'],
		['提高移动速度']
	]
};

StatusInfo[SC.ASSUMPTIO2] = {
	icon: 'icon05.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['霸邪之阵', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高防御力']]
};

StatusInfo[SC.THORNS_TRAP] = {
	icon: '\xb0\xa1\xbd\xc3\xb3\xaa\xb9\xab\xb5\xa3.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['荆棘陷阱', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['周期性造成伤害']]
};

StatusInfo[SC.SLOWPOISON] = {
	icon: '\xbd\xbd\xb7\xce\xbf\xec\xc6\xf7\xc0\xcc\xc1\xf0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['缓毒', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['暂时停止中毒伤害']]
};

StatusInfo[SC.CLOAKING] = {
	icon: '\xc5\xac\xb7\xce\xc5\xb7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['隐匿', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['隐身']]
};

StatusInfo[SC.PARTYFLEE] = {
	icon: 'icon06.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高回避率']]
};

StatusInfo[SC.CRITICALPERCENT] = {
	icon: '\xbd\xba\xc6\xae\xb6\xf3\xc0\xcc\xc5\xb7.tga', //CUSTOM?
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['光泽剂', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高暴击率']]
};

StatusInfo[SC.INSPIRATION] = {
	icon: 'lg_inspiration.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['灵感', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高命中率、属性、伤害和最大 HP'],
		['移除所有增益和状态效果'],
		['持续消耗 HP、SP'],
		['无法获得状态效果'],
		['损失一定比例的经验值']
	]
};

StatusInfo[SC.UNLIMITED_HUMMING_VOICE] = {
	icon: '\xbe\xf0\xb8\xae\xb9\xcc\xc6\xbc\xb5\xe5\xc7\xe3\xb9\xd6\xba\xb8\xc0\xcc\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['无限哼唱之声', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受影响目标的技能'],
		['SP 消耗增加']
	]
};

StatusInfo[SC.FOOD_DEX] = {
	icon: 'dex_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 DEX']]
};

StatusInfo[SC.ANALYZE] = {
	icon: '\xbe\xd6\xb3\xce\xb6\xf3\xc0\xcc\xc1\xee.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['分析', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['降低物理和魔法防御']]
};

StatusInfo[SC.GENTLETOUCH_REVITALIZE] = {
	icon: '\xc1\xa1\xc7\xf7\xc8\xb0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['温柔触碰 - 活力', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 VIT、最大 HP'],
		['提高 DEF'],
		['提高自然 HP 恢复'],
		['提高移动速度']
	]
};

StatusInfo[SC.COUNTER_ON] = {
	icon: 'i_counter.tga',
	descript: [['准备反击踢', COLOR_TITLE_BUFF], ['命中敌人'], ['准备反击踢']]
};

StatusInfo[SC.GLORIA] = {
	icon: '\xb1\xdb\xb7\xce\xb8\xae\xbe\xc6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['荣耀', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 LUK']]
};

StatusInfo[SC.RUSH_WINDMILL] = {
	icon: '\xc7\xb3\xc2\xf7\xb8\xa6\xc7\xe2\xc7\xd8\xb5\xb9\xb0\xdd.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['疾风车攻击', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高伤害']]
};

StatusInfo[SC.PYREXIA] = {
	icon: '\xbf\xad\xba\xb4\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['热病', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['黑暗与幻觉状态']]
};

StatusInfo[SC.DANCE_WITH_WUG] = {
	icon: '\xbf\xf6\xb1\xd7\xbf\xcd\xc7\xd4\xb2\xb2\xc3\xe3\xc0\xbb.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['与狼共舞', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高攻击速度'],
		['缩短固定咏唱时间']
	]
};

StatusInfo[SC.SWING] = {
	icon: '\xbd\xba\xc0\xae\xb4\xed\xbd\xba.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['摇摆舞', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高移动速度'], ['提高攻击速度']]
};

StatusInfo[SC.MOON_COMFORT] = {
	icon: 'i_mooncomfort.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['月之安慰', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高回避']]
};

StatusInfo[SC.MOONLIT_SERENADE] = {
	icon: '\xb4\xde\xba\xfb\xc0\xc7\xbc\xbc\xb7\xb9\xb3\xaa\xb5\xa5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['月光小夜曲', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高魔法技能伤害']]
};

StatusInfo[SC.GENTLETOUCH_CHANGE] = {
	icon: '\xc1\xa1\xc7\xf7\xb9\xdd.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['温柔触碰 - 变换', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['降低 DEF 和 MDEF'],
		['提高伤害和攻击速度']
	]
};

StatusInfo[SC.STRIPACCESSARY] = {
	icon: '\xbd\xba\xc6\xae\xb8\xb3\xbe\xd7\xbc\xbc\xbc\xad\xb8\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['饰品卸除状态', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['无法装备饰品']]
};

StatusInfo[SC.PROPERTYUNDEAD] = {
	icon: 'bd_undead.tga', //CUSTOM TGA
	haveTimeLimit: 1,
	descript: [['为铠甲附加不死属性']]
};

StatusInfo[SC.INVISIBILITY] = {
	icon: '\xc0\xce\xba\xf1\xc1\xf6\xba\xf4\xb8\xae\xc6\xbc.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['完全隐身', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['隐藏自身身影'],
		['所有攻击变为 1 级念属性'],
		['消耗 SP'],
		['无法使用技能和物品']
	]
};

StatusInfo[SC.ABUNDANCE] = {
	icon: 'rk_uruz.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['符文石：丰收', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['每 10 秒恢复 SP']]
};

StatusInfo[SC.FOOD_BASICHIT] = {
	icon: 'gogi.tga', //CUSTOM?
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高命中率']]
};

StatusInfo[SC.FOOD_AGI_CASH] = {
	icon: 'agi_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 AGI']]
};

StatusInfo[SC.SHADOWFORM] = {
	icon: '\xbd\xa6\xb5\xb5\xbf\xec\xc6\xfb.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['暗影形态', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['在一定次数攻击内'],
		['由目标代替承受伤害']
	]
};

StatusInfo[SC.AUTOSHADOWSPELL] = {
	icon: '\xbf\xc0\xc5\xe4\xbd\xa6\xb5\xb5\xbf\xec\xbd\xba\xc6\xe7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['自动暗影法术', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['自动施放'],
		['可用的魔法']
	]
};

StatusInfo[SC.SHAPESHIFT] = {
	icon: '\xbc\xce\xc0\xcc\xc7\xc1\xbd\xac\xc7\xc1\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['形态转换', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['改变机甲的元素属性']]
};

StatusInfo[SC.MANU_ATK] = {
	icon: 'efst_atk.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['马努克的黄金机会', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高对以下目标的物理攻击：'],
		['马努克原野的所有怪物']
	]
};

StatusInfo[SC.MARIONETTE_MASTER] = {
	icon: 'icon01.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['傀儡控制（施法者）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['传递属性'],
		['给玩家']
	]
};

StatusInfo[SC.MARIONETTE] = {
	icon: 'icon01.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['傀儡控制（目标）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['目标玩家'],
		['接收属性']
	]
};

StatusInfo[SC.WZ_SIGHTBLASTER] = {
	icon: 'i_sightblaster.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['视爆', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['以单次攻击袭击敌人'],
		['靠近的目标']
	]
};

StatusInfo[SC.LEXAETERNA] = {
	icon: '\xb7\xba\xbd\xba\xbf\xa1\xc5\xd7\xb8\xa3\xb3\xaa.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['永恒之光', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['使下一次攻击伤害翻倍']]
};

StatusInfo[SC.INFRAREDSCAN] = {
	icon: '\xc0\xce\xc7\xc1\xb6\xf3\xb7\xb9\xb5\xe5\xbd\xba\xc4\xb5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['红外线扫描', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['发现隐藏中的目标'],
		['有几率降低附近敌人的回避']
	]
};

StatusInfo[SC.INT_SCROLL] = {
	icon: 'int_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 INT']]
};

StatusInfo[SC.ASPERSIO] = {
	icon: '\xbe\xc6\xbd\xba\xc6\xe4\xb8\xa3\xbd\xc3\xbf\xc0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['神圣之水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加圣属性']]
};

StatusInfo[SC.MOVHASTE_INFINITY] = {
	icon: '\xb9\xce\xc3\xb8\xbc\xba\xc1\xf5\xb0\xa1.tga',
	descript: [['提高移动速度']]
};

StatusInfo[SC.LERADS_DEW] = {
	icon: '\xb7\xb9\xb6\xf3\xb5\xe5\xc0\xc7\xc0\xcc\xbd\xbd.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['莱拉的露水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高最大 HP']]
};

StatusInfo[SC.FOOD_INT] = {
	icon: 'int_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 INT']]
};

StatusInfo[SC.VENOMBLEED] = {
	icon: '\xbc\xe8\xbe\xe0\xb5\xb6.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['毒血', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['降低最大 HP']]
};

StatusInfo[SC.GS_GATLINGFEVER] = {
	icon: 'i_fever.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['加特林狂热', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高伤害和攻击速度'],
		['降低移动速度']
	]
};

StatusInfo[SC.VITALITYACTIVATION] = {
	icon: 'rk_isha.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['符文石：活力激活', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['对施法者：'],
		['提高治愈技能和物品效果'],
		['停止 SP 恢复'],
		['降低 SP 恢复物品效果']
	]
};

StatusInfo[SC.STONEHARDSKIN] = {
	icon: 'rk_hagalaz.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['符文石：坚硬皮肤', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['抵抗相当于施法消耗 HP 的伤害'],
		['使用武器攻击你的玩家'],
		['有几率使武器损坏。'],
		['对怪物则使其 ATK 降低 10 秒']
	]
};

StatusInfo[SC.WEIGHTOVER90] = {
	icon: '\xb9\xab\xb0\xd4\x39\x30\xc0\xcc\xbb\xf3.tga',
	descript: [['负重 90%', COLOR_TITLE_DEBUFF], ['HP/SP 不会恢复'], ['攻击/技能无法使用']]
};

StatusInfo[SC.PROTECTHELM] = {
	icon: '\xc4\xc9\xb9\xcc\xc4\xc3\xc7\xc1\xb7\xce\xc5\xd8\xbc\xc7\x5b\xc7\xef\xb8\xa7\x5d.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['化学保护头盔（生化头盔）', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['防止头盔损坏']
	]
};

StatusInfo[SC.PLUSAVOIDVALUE] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['欢迎之杯', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高完全回避20']]
};

StatusInfo[SC.OBLIVIONCURSE] = {
	icon: '\xb8\xc1\xb0\xa2\xc0\xc7\xc0\xe7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['遗忘诅咒', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['遗忘状态']]
};

StatusInfo[SC.HEALPLUS] = {
	icon: '\xc1\xdf\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['强化治疗药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使用恢复道具治疗时'],
		['治疗效果提高']
	]
};

StatusInfo[SC.PROTECT_DEF] = {
	icon: 'gogi.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['防御保护', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高物理 DEF']]
};

StatusInfo[SC.CRITICALWOUND] = {
	icon: 'criticalwound.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['严重创伤', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['降低治疗技能效果']]
};

StatusInfo[SC.PRESTIGE] = {
	icon: 'lg_prestige.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['威望', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['有机会回避魔法攻击'], ['防御提高']]
};

StatusInfo[SC.FOOD_DEX_CASH] = {
	icon: 'dex_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 DEX']]
};

StatusInfo[SC.CARTBOOST] = {
	icon: 'icon07.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['手推车加速', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高移动速度']]
};

StatusInfo[SC.L_LIFEPOTION] = {
	icon: '\xc1\xdf\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['中型生命药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每4秒恢复 HP'],
		['狂暴状态激活时无效']
	]
};

StatusInfo[SC.WINDWALK] = {
	icon: 'icon06.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['风行术', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高移动速度/回避率']]
};

StatusInfo[SC.PROPERTYFIRE] = {
	icon: '\xc7\xc1\xb7\xb9\xc0\xd3\xb7\xb1\xc3\xc4.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['火焰发射器', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加火属性']]
};

StatusInfo[SC.STRIKING] = {
	icon: '\xbd\xba\xc6\xae\xb6\xf3\xc0\xcc\xc5\xb7.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['打击', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高武器伤害和暴击率']]
};

StatusInfo[SC.DOWNKICK_ON] = {
	icon: 'i_downkick.tga',
	descript: [['准备下段踢', COLOR_TITLE_BUFF], ['击中敌人'], ['有机会施展踢击']]
};

StatusInfo[SC.PROPERTYDARK] = {
	icon: '\xc4\xb3\xbd\xc3\xb0\xa9\xbf\xca\xbc\xd3\xbc\xba\xba\xce\xbf\xa9.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['为铠甲附加暗影属性']]
};

StatusInfo[SC.REFLECTSHIELD] = {
	icon: '\xb8\xae\xc7\xc3\xb7\xba\xc6\xae\xbd\xaf\xb5\xe5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['反射盾', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到近距离物理攻击时'],
		['反射部分伤害']
	]
};

StatusInfo[SC.DEVOTION] = {
	icon: '\xc7\xe5\xbd\xc5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['奉献', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['十字军代替你承受伤害']]
};

StatusInfo[SC.RIDING] = {
	icon: '\xb6\xf3\xc0\xcc\xb5\xf9.tga',
	descript: [['骑乘载具', COLOR_TITLE_TOGGLE]]
};

StatusInfo[SC.LIGHTNINGWALK] = {
	icon: 'icon02.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['闪电步', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['被魔法攻击指定时'],
		['有机会回避后'],
		['直线移动到施法者身边']
	]
};

StatusInfo[SC.FROSTMISTY] = {
	icon: 'frostmisty.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['冻结状态', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低防御、ASPD 和移动速度'],
		['增加固定吟唱时间。']
	]
};

StatusInfo[SC.COLD] = {
	icon: '\xb4\xd9\xc0\xcc\xbe\xc6\xb8\xf3\xb5\xe5\xb4\xf5\xbd\xba\xc6\xae.tga', //CUSTOM?
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['冰冻', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['无法移动、攻击、使用技能和物品'],
		['持续吸收 SP 和 HP'],
		['增加钝器、斧和双手斧造成的伤害'],
		['增加风属性法术造成的伤害'],
		['降低短剑、剑、双手剑和箭造成的伤害']
	]
};

StatusInfo[SC.GROUNDMAGIC] = {
	icon: 'i_\xc0\xe5\xc6\xc7.tga', //CUSTOM?
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['地面技能效果']]
};

StatusInfo[SC.HELLPOWER] = {
	icon: 'npc_hellpower.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['地狱之力', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['无法复活'],
		['牺牲技能禁用'],
		['齐格弗里德的证明禁用']
	]
};

StatusInfo[SC.SAVAGE_STEAK] = {
	icon: 'str_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['野蛮烤肉', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 STR']]
};

StatusInfo[SC.COCKTAIL_WARG_BLOOD] = {
	icon: 'int_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['狼血鸡尾酒', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 INT']]
};

StatusInfo[SC.MINOR_BBQ] = {
	icon: 'vit_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['米诺斯牛肉锅', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 VIT']]
};

StatusInfo[SC.SIROMA_ICE_TEA] = {
	icon: 'dex_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['希罗玛冰茶', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 DEX']]
};

StatusInfo[SC.DROCERA_HERB_STEAMED] = {
	icon: 'agi_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['捕虫草药草沙拉', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 AGI']]
};

StatusInfo[SC.PUTTI_TAILS_NOODLES] = {
	icon: 'luk_gogi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['小龙尾面', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 LUK']]
};

StatusInfo[SC.STOMACHACHE] = {
	icon: '\xbe\xc8\xc6\xbc\xb8\xc5\xc5\xcd\xb8\xae\xbe\xf3.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['胃痛', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['降低所有属性'],
		['降低移动速度'],
		['每10秒被迫坐下'],
		['10秒内消耗一定量 SP']
	]
};

StatusInfo[SC.PROTECTEXP] = {
	icon: '\xbe\xf6\xb8\xb6\xbe\xc6\xba\xfc\xbb\xe7\xb6\xfb\xc7\xd8\xbf\xe4.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['爸爸妈妈我爱你们', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['死亡时不损失 EXP']]
};

StatusInfo[SC.ANGEL_PROTECT] = {
	icon: 'death.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['守护天使', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['死亡时不损失 EXP']]
};

StatusInfo[SC.MORA_BUFF] = {
	icon: 'gogi.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['莫拉浆果', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高对所有怪物的抗性'],
		['莫拉镇附近原野中的怪物。']
	]
};

StatusInfo[SC.POPECOOKIE] = {
	icon: 'gogi.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['教皇曲奇', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 ATK 和 MATK'],
		['提高对所有属性的抗性。']
	]
};

StatusInfo[SC.VITALIZE_POTION] = {
	icon: '\xbf\xa1\xc0\xcc\xb6\xf3\x31.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['活力药水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 ATK 和 MATK'],
		['提高治疗技能和治疗道具效果']
	]
};

StatusInfo[SC.G_LIFEPOTION] = {
	icon: '\xc1\xdf\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['快速生命之水', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['每3秒恢复 HP'],
		['狂暴状态激活时无效']
	]
};

StatusInfo[SC.ODINS_POWER] = {
	icon: 'all_odins_power.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['奥丁之力', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 ATK 和 MATK'],
		['降低 DEF 和 MDEF']
	]
};

StatusInfo[SC.MAGIC_CANDY] = {
	icon: 'plusmagicpower.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['魔法糖果', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 MATK'],
		['减少固定吟唱时间。'],
		['吟唱不会被打断。'],
		['每10秒吸收 SP']
	]
};

StatusInfo[SC.ENERGYCOAT] = {
	icon: '\xbf\xa1\xb3\xca\xc1\xf6\xc4\xda\xc6\xae.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['能量外套', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['按比例减少伤害'],
		['取决于剩余 SP 数量']
	]
};

StatusInfo[SC.PAIN_KILLER] = {
	icon: '\xbc\xbc\xb6\xf34.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['止痛药', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到伤害时无移动延迟'],
		['减少受到的伤害']
	]
};

StatusInfo[SC.LIGHT_OF_REGENE] = {
	icon: '\xbf\xa1\xc0\xcc\xb6\xf31.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['再生之光', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['召唤者死亡时'],
		['傀儡会牺牲自己复活召唤者']
	]
};

StatusInfo[SC.OVERED_BOOST] = {
	icon: '\xbf\xa1\xc0\xcc\xb6\xf32.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['过度强化', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高 ASPD 和回避率'],
		['至固定数值']
	]
};

StatusInfo[SC.STYLE_CHANGE] = {
	icon: 'efst_atk.tga', //CUSTOM
	haveTimeLimit: 0,
	descript: [['风格变换', COLOR_TITLE_TOGGLE], ['傀儡处于战士风格']]
};

StatusInfo[SC.MAGMA_FLOW] = {
	icon: '\xb5\xf0\xc0\xcc\xc5\xcd1.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['岩浆流', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['受到伤害时'],
		['有机会向周围喷出岩浆']
	]
};

StatusInfo[SC.GRANITIC_ARMOR] = {
	icon: '\xb5\xf0\xc0\xcc\xc5\xcd2.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['花岗岩铠甲', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['减少受到的伤害'],
		['状态结束时损失部分 HP。']
	]
};

StatusInfo[SC.PYROCLASTIC] = {
	icon: '\xb5\xf0\xc0\xcc\xc5\xcd4.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['火成岩', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['迪特尔和主人的武器'],
		['变为火属性'],
		['提高武器伤害']
	]
};

StatusInfo[SC.VOLCANIC_ASH] = {
	icon: '\xb5\xf0\xc0\xcc\xc5\xcd5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['火山灰', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低命中率'],
		['技能有机会失败'],
		['增加受到的火属性伤害']
	]
};

StatusInfo[SC.ATKER_ASPD] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['伟大幻影', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 Max HP'], ['提高 HP 恢复']]
};

StatusInfo[SC.ATKER_MOVESPEED] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['暗影祝福', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高 Max SP'], ['提高 SP 恢复']]
};

StatusInfo[SC.OVERLAPEXPUP] = {
	icon: 'item.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['马当果罐头猫', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['在马当果击杀怪物时'],
		['提高基础和职业 EXP'],
		['提高物品掉落率']
	]
};

StatusInfo[SC.PLUSATTACKPOWER] = {
	icon: 'plusattackpower.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 ATK']]
};

StatusInfo[SC.PLUSMAGICPOWER] = {
	icon: 'plusmagicpower.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高 MATK']]
};

StatusInfo[SC.MACRO_PERMIT] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['使用宏', COLOR_SYSTEM], ['%s', COLOR_TIME], ['宏已激活']]
};

StatusInfo[SC.MACRO_POSTDELAY] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['宏已禁用', COLOR_SYSTEM], ['%s', COLOR_TIME], ['宏已停用。']]
};

StatusInfo[SC.MONSTER_TRANSFORM] = {
	icon: '\xba\xaf\xbd\xc5.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['怪物变身', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['已变身为怪物。']]
};

StatusInfo[SC.SIT] = {
	icon: '\xbe\xc9\xb1\xe2.tga',
	descript: [['坐下', COLOR_TITLE_TOGGLE]]
};

StatusInfo[SC.ALL_RIDING] = {
	icon: '\xb6\xf3\xc0\xcc\xb5\xf9.tga',
	descript: [['骑乘', COLOR_TITLE_TOGGLE]]
};

StatusInfo[SC.SKF_MATK] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高MATK']]
};

StatusInfo[SC.SKF_ATK] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高ATK']]
};

StatusInfo[SC.SKF_ASPD] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高ASPD']]
};

StatusInfo[SC.SKF_CAST] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['缩短吟唱时间']]
};

StatusInfo[SC.REWARD_PLUSONLYJOBEXP] = {
	icon: 'job.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['提高获得的职业经验']]
};

StatusInfo[SC.ENERVATION] = {
	icon: 'masquerade_enervation.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：衰弱', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低ATK'],
		['移除气弹']
	]
};

StatusInfo[SC.GROOMY] = {
	icon: 'masquerade_groomy.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：阴郁', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低ASPD和HIT'],
		['强制解除坐骑及相关动物。'],
		['坐骑及相关动物无法使用。']
	]
};

StatusInfo[SC.IGNORANCE] = {
	icon: 'masquerade_ignorance.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：无知', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['失去一定量的SP'],
		['技能和魔法无法使用']
	]
};

StatusInfo[SC.LAZINESS] = {
	icon: 'masquerade_laziness.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：懒惰', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低移动速度和FLEE'],
		['增加吟唱时间'],
		['使用技能时增加一定SP消耗']
	]
};

StatusInfo[SC.UNLUCKY] = {
	icon: 'masquerade_unlucky.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：不幸', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低暴击率'],
		['降低完全回避'],
		['使用技能消耗 Zeny'],
		['持续伤害会造成某些状态异常。']
	]
};

StatusInfo[SC.WEAKNESS] = {
	icon: 'masquerade_weakness.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['假面舞会：虚弱', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['降低最大HP'],
		['闪避时卸下武器和盾牌。'],
		['无法装备武器和盾牌']
	]
};

StatusInfo[SC.STEELBODY] = {
	icon: '\x73\x74\x65\x65\x6c\x62\x6f\x64\x79.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['钢铁之躯', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['将DEF和MDEF设为固定值。'],
		['降低移动速度和ASPD'],
		['技能无法使用']
	]
};

StatusInfo[SC.LG_REFLECTDAMAGE] = {
	icon: 'lg_reflectdamage.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['伤害反射', COLOR_TITLE_TOGGLE],
		['%s', COLOR_TIME],
		['将受到的部分伤害反射给范围内所有敌人'],
		['每秒消耗SP']
	]
};

StatusInfo[SC.MVPCARD_TAOGUNKA] = {
	icon: 'mvpcard_taogunka.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['塔奥群卡卷轴', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高最大HP'], ['降低DEF/MDEF']]
};

StatusInfo[SC.MVPCARD_MISTRESS] = {
	icon: 'mvpcard_mistress.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['蜂后卷轴', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['使部分法术不再需要宝石'],
		['提高SP消耗']
	]
};

StatusInfo[SC.MVPCARD_ORCHERO] = {
	icon: 'mvpcard_orchero.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['兽人英雄卷轴', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['免疫眩晕状态']]
};

StatusInfo[SC.MVPCARD_ORCLORD] = {
	icon: 'mvpcard_orclord.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['兽人王卷轴', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['反射所受部分物理伤害']]
};

StatusInfo[SC.HANDICAPSTATE_NORECOVER] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['恢复禁用状态', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['HP和SP无法恢复']
	]
};

StatusInfo[SC.SET_NUM_DEF] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['DEF数值已设定。']]
};

StatusInfo[SC.SET_NUM_MDEF] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 1,
	descript: [['%s', COLOR_TIME], ['MDEF数值已设定。']]
};

StatusInfo[SC.SET_PER_DEF] = {
	descript: [['DEF数值固定为特定百分比。']]
};

StatusInfo[SC.SET_PER_MDEF] = {
	descript: [['MDEF数值固定为特定百分比。']]
};

StatusInfo[SC.EXTREMITYFIST] = {
	icon: 'extremityfist.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['阿修罗霸凰拳（修罗霸凰拳）', COLOR_TITLE_DEBUFF], ['%s', COLOR_TIME], ['SP无法恢复']]
};

StatusInfo[SC.ATTHASTE_CASH] = {
	icon: 'aspdcash.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['ASPD强化药水', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高攻击速度']]
};

StatusInfo[SC.RWC2011] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['爆竹', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['提高所有属性'], ['提高ATK、MATK']]
};

StatusInfo[SC.PHI_DEMON] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['教父的远古之魂', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['赋予恶魔型魔物'],
		['提高物理和魔法伤害']
	]
};

StatusInfo[SC.GM_BATTLE] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['ÀüÅõ¾à', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Increases ATK and MATK'], ['Reduced MHP and MSP']]
};

StatusInfo[SC.GM_BATTLE2] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['°í±ÞÀüÅõ¾à', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Increases ATK and MATK'],
		['Reduces MHP and MSP']
	]
};

StatusInfo[SC.RWC_SCROLL2011] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['红色强化剂', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高ATK和MATK'],
		['提高ASPD'],
		['缩短可变吟唱时间'],
		['受到物理和魔法伤害时'],
		['有几率施放集中力提升']
	]
};

StatusInfo[SC.MEIKYOUSISUI] = {
	icon: 'meikyousisui.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['纯洁之魂', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['恢复一定量HP'],
		['恢复一定量SP'],
		['无法移动'],
		['受到攻击时有几率忽略伤害'],
		['受到攻击时效果有几率消失。']
	]
};

StatusInfo[SC.IZAYOI] = {
	icon: 'izayoi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['十六夜', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['移除固定吟唱时间'],
		['缩短可变吟唱时间'],
		['提高MATK'],
		['每秒吸收SP']
	]
};

StatusInfo[SC.KG_KAGEHUMI] = {
	icon: 'kg_kagehumi.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Shadow Step', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['Unable to move'],
		['Cannot use certain skills or item'],
		['Stealth or teleport skills and items are disabled.'],
		['Unable to use Emergency Call skill']
	]
};

StatusInfo[SC.KYOMU] = {
	icon: 'kyomu.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Kyomu', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['Reflects wont take effect when hit by Physical or Magical Attacks'],
		['Chance the skill will fail when casting']
	]
};

StatusInfo[SC.KAGEMUSYA] = {
	icon: 'kagemusya.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Shadow Warrior', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Enchanted with Double Attack effect'],
		['Drains SP per second'],
		['Status ends when received a certain number of hits.']
	]
};

StatusInfo[SC.ZANGETSU] = {
	icon: 'zangetsu.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Distorted Crescent Moon', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['ATK and MATK changed, depending on HP and SP']
	]
};

StatusInfo[SC.GENSOU] = {
	icon: 'gensou.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Oboro Gensou', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Randomly increase/decrease HP and SP'],
		['When hit by Magical Attacks half of the damage'],
		['will be distributed around the area']
	]
};

StatusInfo[SC.AKAITSUKI] = {
	icon: 'akaitsuki.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Ominous Crimson Moonlight', COLOR_TITLE_DEBUFF],
		['%s', COLOR_TIME],
		['When receiving recovery skills'],
		['healed amount will be converted to damage.']
	]
};

StatusInfo[SC.MYSTICPOWDER] = {
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Mystic Powder', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Increases FLEE and LUK']]
};

StatusInfo[SC.ACARAJE] = {
	icon: '\xb0\xf8\xbc\xd3\xb9\xb0\xbe\xe0.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Acaraje', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Increases HIT and ASPD']]
};

StatusInfo[SC.M_LIFEPOTION] = {
	icon: '\xc1\xdf\xc7\xfc\xbb\xfd\xb8\xed\xbc\xf6.tga', //CUSTOM
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Mysterious Life Potion', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['Recovers a certain amount of HP every 3 seconds'],
		['No effect on Berserk status.']
	]
};

StatusInfo[SC.FLOWER_LEAF] = {
	icon: 'flower_leaf.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Ç³¼ºÇÑ ²É°¡Áö', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Increases FLEE'], ['Increases perfect dodge']]
};

StatusInfo[SC.BDPLAYING] = {
	icon: '\xb9\xd9\xb5\xe5\xb3\xeb\xb7\xa1.tga'
};

StatusInfo[SC.RUN] = {
	icon: 'i_run.tga'
};

StatusInfo[SC.CLIENT_ONLY_EQUIP_ARROW] = {
	icon: 'ArrowN.tga'
};

StatusInfo[SC.RAY_OF_PROTECTION] = {
	icon: 'all_ray_of_protection.tga'
};

StatusInfo[SC.DARKCROW] = {
	icon: 'darkcrow.tga'
};

StatusInfo[SC.FRIGG_SONG] = {
	icon: 'frigg_song.tga'
};

StatusInfo[SC.FULL_THROTTLE] = {
	icon: 'full_throttle.tga'
};

StatusInfo[SC.GLASTHEIM_ATK] = {
	icon: 'glastheim_atk.tga'
};

StatusInfo[SC.GLASTHEIM_DEF] = {
	icon: 'glastheim_def.tga'
};

StatusInfo[SC.GLASTHEIM_HEAL] = {
	icon: 'glastheim_heal.tga'
};

StatusInfo[SC.ATTACK_PROPERTY_NOTHING] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Neutral Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_WATER] = {
	icon: 'weapon_property_water.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Water Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_GROUND] = {
	icon: 'weapon_property_ground.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Earth Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_FIRE] = {
	icon: 'weapon_property_fire.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Fire Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_WIND] = {
	icon: 'weapon_property_wind.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Wind Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_POISON] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Poison Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_SAINT] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Holy Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_DARKNESS] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['Weapon Property', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['Enchants Weapon with Dark Property']]
};

StatusInfo[SC.ATTACK_PROPERTY_TELEKINESIS] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['武器属性', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加念属性']]
};

StatusInfo[SC.ATTACK_PROPERTY_UNDEAD] = {
	icon: 'weapon_property.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [['武器属性', COLOR_TITLE_BUFF], ['%s', COLOR_TIME], ['为武器附加不死属性']]
};

StatusInfo[SC.RESIST_PROPERTY_NOTHING] = {
	icon: 'resist_elemental_nothing.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['属性抗性', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高无属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_WATER] = {
	icon: 'resist_elemental_water.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高水属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_GROUND] = {
	icon: 'resist_elemental_ground.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高地属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_FIRE] = {
	icon: 'resist_elemental_fire.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高火属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_WIND] = {
	icon: 'resist_elemental_wind.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高风属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_POISON] = {
	icon: 'resist_elemental_poison.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高毒属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_SAINT] = {
	icon: 'resist_elemental_saint.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高圣属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_DARKNESS] = {
	icon: 'resist_elemental_darkness.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高暗属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_TELEKINESIS] = {
	icon: 'resist_elemental_telekinesis.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高念属性抗性']
	]
};

StatusInfo[SC.RESIST_PROPERTY_UNDEAD] = {
	icon: 'resist_elemental_undead.tga',
	haveTimeLimit: 1,
	posTimeLimitStr: 2,
	descript: [
		['Resist Property', COLOR_TITLE_BUFF],
		['%s', COLOR_TIME],
		['提高不死属性抗性']
	]
};

export default StatusInfo;
