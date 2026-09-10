/**
 * DB/Jobs/JobNameTable.js
 *
 * Look up: job id -> ressource name
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault, Antares
 */

import JobId from './JobConst.js';

const JobNameTable = {};

JobNameTable[JobId.NOVICE] = '新手'; // Source bytes: '\xC3\xCA\xBA\xB8\xC0\xDA'

JobNameTable[JobId.SWORDMAN] = '剑士'; // Source bytes: '\xB0\xCB\xBB\xE7'
JobNameTable[JobId.MAGICIAN] = '魔法师'; // Source bytes: '\xB8\xB6\xB9\xFD\xBB\xE7'
JobNameTable[JobId.ARCHER] = '弓箭手'; // Source bytes: '\xB1\xC3\xBC\xF6'
JobNameTable[JobId.ACOLYTE] = '服事'; // Source bytes: '\xBC\xBA\xC1\xF7\xC0\xDA'
JobNameTable[JobId.MERCHANT] = '商人'; // Source bytes: '\xBB\xF3\xC0\xCE'
JobNameTable[JobId.THIEF] = '盗贼'; // Source bytes: '\xB5\xB5\xB5\xCF'

JobNameTable[JobId.KNIGHT] = '骑士'; // Source bytes: '\xB1\xE2\xBB\xE7'
JobNameTable[JobId.PRIEST] = '牧师'; // Source bytes: '\xC7\xC1\xB8\xAE\xBD\xBA\xC6\xAE'
JobNameTable[JobId.WIZARD] = '巫师'; // Source bytes: '\xC0\xA7\xC0\xFA\xB5\xE5'
JobNameTable[JobId.BLACKSMITH] = '铁匠'; // Source bytes: '\xC1\xA6\xC3\xB6\xB0\xF8'
JobNameTable[JobId.HUNTER] = '猎人'; // Source bytes: '\xC7\xE5\xC5\xCD'
JobNameTable[JobId.ASSASSIN] = '刺客'; // Source bytes: '\xBE\xEE\xBC\xBC\xBD\xC5'
JobNameTable[JobId.KNIGHT2] = '骑士（另一性别）'; // Source bytes: '\xC6\xE4\xC4\xDA\xC6\xE4\xC4\xDA_\xB1\xE2\xBB\xE7'

JobNameTable[JobId.CRUSADER] = '十字军'; // Source bytes: '\xC5\xA9\xB7\xE7\xBC\xBC\xC0\xCC\xB4\xF5'
JobNameTable[JobId.MONK] = '武僧'; // Source bytes: '\xB8\xF9\xC5\xA9'
JobNameTable[JobId.SAGE] = '贤者'; // Source bytes: '\xBC\xBC\xC0\xCC\xC1\xF6'
JobNameTable[JobId.ROGUE] = '流氓'; // Source bytes: '\xB7\xCE\xB1\xD7'
JobNameTable[JobId.ALCHEMIST] = '炼金术士'; // Source bytes: '\xBF\xAC\xB1\xDD\xBC\xFA\xBB\xE7'
JobNameTable[JobId.BARD] = '诗人'; // Source bytes: '\xB9\xD9\xB5\xE5'
JobNameTable[JobId.DANCER] = '舞娘'; // Source bytes: '\xB9\xAB\xC8\xF1'
JobNameTable[JobId.CRUSADER2] = '十字军（另一性别）'; // Source bytes: '\xBD\xC5\xC6\xE4\xC4\xDA\xC5\xA9\xB7\xE7\xBC\xBC\xC0\xCC\xB4\xF5'

JobNameTable[JobId.SUPERNOVICE] = '超初学者'; // Source bytes: '\xBD\xB4\xC6\xDB\xB3\xEB\xBA\xF1\xBD\xBA'
JobNameTable[JobId.GUNSLINGER] = '枪手'; // Source bytes: '\xB0\xC7\xB3\xCA'
JobNameTable[JobId.NINJA] = '忍者'; // Source bytes: '\xB4\xD1\xC0\xDA'
JobNameTable[JobId.TAEKWON] = '跆拳少年'; // Source bytes: '\xc5\xc2\xb1\xc7\xbc\xd2\xb3\xe2'
JobNameTable[JobId.STAR] = '星帝'; // Source bytes: '\xb1\xc7\xbc\xba'
JobNameTable[JobId.STAR2] = '星帝融合'; // Source bytes: '\xb1\xc7\xbc\xba\xc0\xb6\xc7\xd5'
JobNameTable[JobId.LINKER] = '灵媒师'; // Source bytes: '\xbc\xd2\xbf\xef\xb8\xb5\xc4\xbf'

JobNameTable[JobId.MARRIED] = '已婚'; // Source bytes: '\xB0\xE1\xC8\xA5'
JobNameTable[JobId.XMAS] = '圣诞老人'; // Source bytes: '\xBB\xEA\xC5\xB8'
JobNameTable[JobId.SUMMER] = '夏日'; // Source bytes: '\xBF\xA9\xB8\xA7'

JobNameTable[JobId.KNIGHT_H] = '大骑士'; // Source bytes: '\xB7\xCE\xB5\xE5\xB3\xAA\xC0\xCC\xC6\xAE'
JobNameTable[JobId.PRIEST_H] = '高阶牧师'; // Source bytes: '\xC7\xCF\xC0\xCC\xC7\xC1\xB8\xAE'
JobNameTable[JobId.WIZARD_H] = '高阶巫师'; // Source bytes: '\xC7\xCF\xC0\xCC\xC0\xA7\xC0\xFA\xB5\xE5'
JobNameTable[JobId.BLACKSMITH_H] = '神工匠'; // Source bytes: '\xC8\xAD\xC0\xCC\xC6\xAE\xBD\xBA\xB9\xCC\xBD\xBA'
JobNameTable[JobId.HUNTER_H] = '神射手'; // Source bytes: '\xBD\xBA\xB3\xAA\xC0\xCC\xC6\xDB'
JobNameTable[JobId.ASSASSIN_H] = '十字刺客'; // Source bytes: '\xBE\xEE\xBD\xD8\xBD\xC5\xC5\xA9\xB7\xCE\xBD\xBA'
JobNameTable[JobId.KNIGHT2_H] = '大骑士（大嘴鸟）'; // Source bytes: '\xB7\xCE\xB5\xE5\xC6\xE4\xC4\xDA'
JobNameTable[JobId.CRUSADER_H] = '圣殿十字军'; // Source bytes: '\xC6\xC8\xB6\xF3\xB5\xF2'
JobNameTable[JobId.MONK_H] = '武术宗师'; // Source bytes: '\xC3\xA8\xC7\xC7\xBF\xC2'
JobNameTable[JobId.SAGE_H] = '教授'; // Source bytes: '\xC7\xC1\xB7\xCE\xC6\xE4\xBC\xAD'
JobNameTable[JobId.ROGUE_H] = '神行太保'; // Source bytes: '\xBD\xBA\xC5\xE4\xC4\xBF'
JobNameTable[JobId.ALCHEMIST_H] = '创造者'; // Source bytes: '\xC5\xA9\xB8\xAE\xBF\xA1\xC0\xCC\xC5\xCD'
JobNameTable[JobId.BARD_H] = '搞笑艺人'; // Source bytes: '\xC5\xAC\xB6\xF3\xBF\xEE'
JobNameTable[JobId.DANCER_H] = '冷艳舞姬'; // Source bytes: '\xC1\xFD\xBD\xC3'
JobNameTable[JobId.CRUSADER2_H] = '圣殿十字军（大嘴鸟）'; // Source bytes: '\xC6\xE4\xC4\xDA\xC6\xC8\xB6\xF3\xB5\xF2'

JobNameTable[JobId.RUNE_KNIGHT] = '卢恩骑士'; // Source bytes: '\xB7\xE9\xB3\xAA\xC0\xCC\xC6\xAE'
JobNameTable[JobId.WARLOCK] = '咒术师'; // Source bytes: '\xBF\xF6\xB7\xCF'
JobNameTable[JobId.RANGER] = '游侠'; // Source bytes: '\xB7\xB9\xC0\xCE\xC1\xAE'
JobNameTable[JobId.ARCHBISHOP] = '大主教'; // Source bytes: '\xBE\xC6\xC5\xA9\xBA\xF1\xBC\xF3'
JobNameTable[JobId.MECHANIC] = '机匠'; // Source bytes: '\xB9\xCC\xC4\xC9\xB4\xD0'
JobNameTable[JobId.GUILLOTINE_CROSS] = '十字斩首者'; // Source bytes: '\xB1\xE6\xB7\xCE\xC6\xBE\xC5\xA9\xB7\xCE\xBD\xBA'

JobNameTable[JobId.ROYAL_GUARD] = '皇家卫士'; // Source bytes: '\xB0\xA1\xB5\xE5'
JobNameTable[JobId.SORCERER] = '妖术师'; // Source bytes: '\xBC\xD2\xBC\xAD\xB7\xAF'
JobNameTable[JobId.MINSTREL] = '宫廷乐师'; // Source bytes: '\xB9\xCE\xBD\xBA\xC6\xAE\xB7\xB2'
JobNameTable[JobId.WANDERER] = '浪姬舞者'; // Source bytes: '\xBF\xF8\xB4\xF5\xB7\xAF'
JobNameTable[JobId.SURA] = '修罗'; // Source bytes: '\xBD\xB4\xB6\xF3'
JobNameTable[JobId.GENETIC] = '基因工程师'; // Source bytes: '\xC1\xA6\xB3\xD7\xB8\xAF'
JobNameTable[JobId.SHADOW_CHASER] = '影狼'; // Source bytes: '\xBD\xA6\xB5\xB5\xBF\xEC\xC3\xBC\xC0\xCC\xBC\xAD'

JobNameTable[JobId.RUNE_KNIGHT2] = '卢恩骑士（幼龙）'; // Source bytes: '\xB7\xE9\xB3\xAA\xC0\xCC\xC6\xAE\xBB\xDA\xB6\xEC'
JobNameTable[JobId.ROYAL_GUARD2] = '狮鹫皇家卫士'; // Source bytes: '\xB1\xD7\xB8\xAE\xC6\xF9\xB0\xA1\xB5\xE5'
JobNameTable[JobId.RANGER2] = '游侠（狼）'; // Source bytes: '\xB7\xB9\xC0\xCE\xC1\xAE\xB4\xC1\xB4\xEB'
JobNameTable[JobId.MECHANIC2] = '机匠（魔导机甲）'; // Source bytes: '\xB8\xB6\xB5\xB5\xB1\xE2\xBE\xEE'

JobNameTable[JobId.SUPERNOVICE2] = '超初学者'; // Source bytes: '\xBD\xB4\xC6\xDB\xB3\xEB\xBA\xF1\xBD\xBA'
JobNameTable[JobId.KAGEROU] = 'kagerou';
JobNameTable[JobId.OBORO] = 'oboro';
JobNameTable[JobId.REBELLION] = 'rebellion';
JobNameTable[JobId.STAR_EMPEROR] = '星帝'; // Source bytes: '\xbc\xba\xc1\xa6'
JobNameTable[JobId.SOUL_REAPER] = '灵魂收割者'; // Source bytes: '\xbc\xd2\xbf\xef\xb8\xae\xc6\xdb'

// 4th
JobNameTable[JobId.DRAGON_KNIGHT] = '龙骑士';
JobNameTable[JobId.MEISTER] = '机匠大师';
JobNameTable[JobId.SHADOW_CROSS] = '影十字';
JobNameTable[JobId.ARCH_MAGE] = '大法师';
JobNameTable[JobId.CARDINAL] = '红衣主教';
JobNameTable[JobId.WINDHAWK] = '风鹰';
JobNameTable[JobId.IMPERIAL_GUARD] = '帝国卫士';
JobNameTable[JobId.BIOLO] = '生化学者';
JobNameTable[JobId.ABYSS_CHASER] = '深渊追迹者';
JobNameTable[JobId.ELEMENTAL_MASTER] = '元素大师';
JobNameTable[JobId.INQUISITOR] = '审判者';
JobNameTable[JobId.TROUBADOUR] = '吟游诗人';
JobNameTable[JobId.TROUVERE] = '游吟诗人';

JobNameTable[JobId.WINDHAWK2] = '风鹰（狼）';
JobNameTable[JobId.MEISTER2] = '机匠大师（魔导机甲）';
JobNameTable[JobId.DRAGON_KNIGHT2] = '龙骑士（大嘴鸟）';
JobNameTable[JobId.IMPERIAL_GUARD2] = '帝国卫士（大嘴鸟）';

JobNameTable[JobId.SKY_EMPEROR] = '天帝';
JobNameTable[JobId.SOUL_ASCETIC] = '灵魂使徒';
JobNameTable[JobId.SHINKIRO] = '神鬼';
JobNameTable[JobId.SHIRANUI] = '不知火';
JobNameTable[JobId.NIGHT_WATCH] = '夜巡者';
JobNameTable[JobId.HYPER_NOVICE] = '超新星';
JobNameTable[JobId.SPIRIT_HANDLER] = '灵魂驭者';

JobNameTable[JobId.SKY_EMPEROR2] = '天帝（强化）';

//MOUNTS
JobNameTable[JobId.PORING_NOVICE] = '新手波利'; // Source bytes: '\xb3\xeb\xba\xf1\xbd\xba\xc6\xf7\xb8\xb5'

JobNameTable[JobId.SHEEP_ACO] = '服事羊驼'; // Source bytes: '\xba\xb9\xbb\xe7\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_ARCHER] = '弓箭手鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xb1\xc3\xbc\xf6'
JobNameTable[JobId.FOX_MAGICIAN] = '魔法师狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xb8\xb6\xb9\xfd\xbb\xe7'
JobNameTable[JobId.PIG_MERCHANT] = '商人野猪'; // Source bytes: '\xbb\xf3\xc0\xce\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.PECO_SWORD] = '剑士大嘴鸟'; // Source bytes: '\xc6\xe4\xc4\xda\xb0\xcb\xbb\xe7'
JobNameTable[JobId.DOG_THIEF] = '盗贼地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xb5\xb5\xb5\xcf'

JobNameTable[JobId.SHEEP_PRIEST] = '牧师羊驼'; // Source bytes: '\xc7\xc1\xb8\xae\xbd\xba\xc6\xae\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_HUNTER] = '猎人鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xc7\xe5\xc5\xcd'
JobNameTable[JobId.FOX_WIZ] = '巫师狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xc0\xa7\xc0\xfa\xb5\xe5'
JobNameTable[JobId.PIG_BLACKSMITH] = '铁匠野猪'; // Source bytes: '\xc1\xa6\xc3\xb6\xb0\xf8\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_KNIGHT] = '骑士狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xb1\xe2\xbb\xe7'
JobNameTable[JobId.DOG_ASSASSIN] = '刺客地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xbe\xee\xbd\xea\xbd\xc5'

JobNameTable[JobId.SHEEP_MONK] = '武僧羊驼'; // Source bytes: '\xb8\xf9\xc5\xa9\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_BARD] = '诗人鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xb9\xd9\xb5\xe5'
JobNameTable[JobId.OSTRICH_DANCER] = '舞娘鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xb9\xab\xc8\xf1'
JobNameTable[JobId.FOX_SAGE] = '贤者狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xbc\xbc\xc0\xcc\xc1\xf6'
JobNameTable[JobId.PIG_ALCHE] = '炼金术士野猪'; // Source bytes: '\xbf\xac\xb1\xdd\xbc\xfa\xbb\xe7\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_CRUSADER] = '十字军狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xc5\xa9\xb7\xe7\xbc\xbc\xc0\xcc\xb4\xf5'
JobNameTable[JobId.DOG_ROGUE] = '流氓地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xb7\xce\xb1\xd7'

JobNameTable[JobId.SHEEP_ARCB] = '大主教羊驼'; // Source bytes: '\xbe\xc6\xc5\xa9\xba\xf1\xbc\xf3\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_RANGER] = '游侠鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xb7\xb9\xc0\xce\xc1\xae'
JobNameTable[JobId.FOX_WARLOCK] = '咒术师狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xbf\xf6\xb7\xcf'
JobNameTable[JobId.PIG_MECHANIC] = '机匠野猪'; // Source bytes: '\xb9\xcc\xc4\xc9\xb4\xd0\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_RUNE_KNIGHT] = '卢恩骑士狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xb7\xe9\xb3\xaa\xc0\xcc\xc6\xae'
JobNameTable[JobId.DOG_G_CROSS] = '十字斩首者地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xb1\xe6\xb7\xce\xc6\xbe\xc5\xa9\xb7\xce\xbd\xba'

JobNameTable[JobId.SHEEP_SURA] = '修罗羊驼'; // Source bytes: '\xbd\xb4\xb6\xf3\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_MINSTREL] = '宫廷乐师鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xb9\xce\xbd\xba\xc6\xae\xb7\xb2'
JobNameTable[JobId.OSTRICH_WANDER] = '浪姬舞者鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xbf\xf8\xb4\xf5\xb7\xaf'
JobNameTable[JobId.FOX_SORCERER] = '妖术师狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xbc\xd2\xbc\xad\xb7\xaf'
JobNameTable[JobId.PIG_GENETIC] = '基因工程师野猪'; // Source bytes: '\xc1\xa6\xb3\xd7\xb8\xaf\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_ROYAL_GUARD] = '皇家卫士狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xb7\xce\xbe\xe2\xb0\xa1\xb5\xe5'
JobNameTable[JobId.DOG_CHASER] = '影狼地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xbd\xa6\xb5\xb5\xbf\xec\xc3\xbc\xc0\xcc\xbc\xad'

JobNameTable[JobId.PORING_SNOVICE] = '超初学者波利'; // Source bytes: '\xbd\xb4\xc6\xdb\xb3\xeb\xba\xf1\xbd\xba\xc6\xf7\xb8\xb5'

JobNameTable[JobId.FROG_NINJA] = '忍者波利'; // Source bytes: '\xb3\xeb\xba\xf1\xbd\xba\xc6\xf7\xb8\xb5'
JobNameTable[JobId.PECO_GUNNER] = '枪手大嘴鸟'; // Source bytes: '\xc6\xe4\xc4\xda\xb0\xc7\xb3\xca'
JobNameTable[JobId.PORING_TAEKWON] = '跆拳少年波利'; // Source bytes: '\xc5\xc2\xb1\xc7\xbc\xd2\xb3\xe2\xc6\xf7\xb8\xb5'

JobNameTable[JobId.PORING_STAR] = '星帝波利'; // Source bytes: '\xb1\xc7\xbc\xba\xc6\xf7\xb8\xb5'
JobNameTable[JobId.FROG_LINKER] = '灵媒师青蛙'; // Source bytes: '\xb5\xce\xb2\xa8\xba\xf1\xbc\xd2\xbf\xef\xb8\xb5\xc4\xbf'

JobNameTable[JobId.FROG_KAGEROU] = 'frog_kagerou';
JobNameTable[JobId.FROG_OBORO] = 'frog_oboro';
JobNameTable[JobId.PECO_REBELLION] = 'peco_rebellion';

JobNameTable[JobId.SOUL_REAPER2] = '海泰灵魂收割者'; // 해태소울리퍼 // Source bytes: '\xc7\xd8\xc5\xc2\xbc\xd2\xbf\xef\xb8\xae\xc6\xdb'
JobNameTable[JobId.STAR_EMPEROR2] = '海泰星帝'; // 해태소울리 // Source bytes: '\xc7\xd8\xc5\xc2\xbc\xba\xc1\xa6'

JobNameTable[JobId.DO_SUMMONER] = 'summoner';

JobNameTable[JobId.SHEEP_HPRIEST] = '高阶牧师羊驼'; // Source bytes: '\xc7\xcf\xc0\xcc\xc7\xc1\xb8\xae\xbd\xba\xc6\xae\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_SNIPER] = '神射手鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xbd\xba\xb3\xaa\xc0\xcc\xc6\xdb'
JobNameTable[JobId.FOX_HWIZ] = '高阶巫师狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xc7\xcf\xc0\xcc\xc0\xa7\xc0\xfa\xb5\xe5'
JobNameTable[JobId.PIG_WHITESMITH] = '神工匠野猪'; // Source bytes: '\xc8\xad\xc0\xcc\xc6\xae\xbd\xba\xb9\xcc\xbd\xba\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_KNIGHT_H] = '大骑士狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xb7\xce\xb5\xe5\xb3\xaa\xc0\xcc\xc6\xae'
JobNameTable[JobId.DOG_ASSA_X] = '十字刺客地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xbe\xee\xbd\xea\xbd\xc5\xc5\xa9\xb7\xce\xbd\xba'

JobNameTable[JobId.SHEEP_CHAMP] = '武术宗师羊驼'; // Source bytes: '\xc3\xa8\xc7\xc7\xbf\xc2\xbe\xcb\xc6\xc4\xc4\xab'
JobNameTable[JobId.OSTRICH_CROWN] = '搞笑艺人鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xc5\xa9\xb6\xf3\xbf\xee'
JobNameTable[JobId.OSTRICH_ZIPSI] = '冷艳舞姬鸵鸟'; // Source bytes: '\xc5\xb8\xc1\xb6\xc2\xa4\xbd\xc3'
JobNameTable[JobId.FOX_PROF] = '教授狐狸'; // Source bytes: '\xbf\xa9\xbf\xec\xc7\xc1\xb7\xce\xc6\xe4\xbc\xad'
JobNameTable[JobId.PIG_CREATOR] = '创造者野猪'; // Source bytes: '\xc5\xa9\xb8\xae\xbf\xa1\xc0\xcc\xc5\xcd\xb8\xe4\xb5\xc5\xc1\xf6'
JobNameTable[JobId.LION_CRUSADER_H] = '圣殿十字军狮子'; // Source bytes: '\xbb\xe7\xc0\xda\xc6\xc8\xb6\xf3\xb5\xf2'
JobNameTable[JobId.DOG_STALKER] = '神行太保地狱犬'; // Source bytes: '\xc4\xcc\xba\xa3\xb7\xce\xbd\xba\xbd\xba\xc5\xe4\xc4\xbf'

JobNameTable[JobId.DRAGON_KNIGHT_RIDING] = 'dragon_knight_riding';
JobNameTable[JobId.MEISTER_RIDING] = 'meister_riding';
JobNameTable[JobId.SHADOW_CROSS_RIDING] = 'shadow_cross_riding';
JobNameTable[JobId.ARCH_MAGE_RIDING] = 'arch_mage_riding';
JobNameTable[JobId.CARDINAL_RIDING] = 'cardinal_riding';
JobNameTable[JobId.WINDHAWK_RIDING] = 'windhawk_riding';
JobNameTable[JobId.IMPERIAL_GUARD_RIDING] = 'imperial_guard_riding';
JobNameTable[JobId.BIOLO_RIDING] = 'biolo_riding';
JobNameTable[JobId.ABYSS_CHASER_RIDING] = 'abyss_chaser_riding';
JobNameTable[JobId.ELEMENTAL_MASTER_RIDING] = 'elemental_master_riding';
JobNameTable[JobId.INQUISITOR_RIDING] = 'inquisitor_riding';
JobNameTable[JobId.TROUBADOUR_RIDING] = 'troubadour_riding';
JobNameTable[JobId.TROUVERE_RIDING] = 'trouvere_riding';

JobNameTable[JobId.DRUID] = 'druid';
JobNameTable[JobId.ALITEA] = 'alitea';
JobNameTable[JobId.KARNOS] = 'karnos';
JobNameTable[JobId.DRUID_RIDING] = 'druid_riding';
JobNameTable[JobId.ALITEA_RIDING] = 'alitea_riding';
JobNameTable[JobId.KARNOS_RIDING] = 'karnos_riding';
JobNameTable[JobId.WEREWOLF] = 'werewolf';
JobNameTable[JobId.WERERAPTOR] = 'wereraptor';

function duplicateEntry(origin) {
	const value = JobNameTable[origin];
	for (let i = 1, count = arguments.length; i < count; ++i) {
		JobNameTable[arguments[i]] = value;
	}
}

// Inherit
duplicateEntry(JobId.NOVICE, JobId.NOVICE_H, JobId.NOVICE_B);
duplicateEntry(JobId.SWORDMAN, JobId.SWORDMAN_H, JobId.SWORDMAN_B);
duplicateEntry(JobId.MAGICIAN, JobId.MAGICIAN_H, JobId.MAGICIAN_B);
duplicateEntry(JobId.ARCHER, JobId.ARCHER_H, JobId.ARCHER_B);
duplicateEntry(JobId.ACOLYTE, JobId.ACOLYTE_H, JobId.ACOLYTE_B);
duplicateEntry(JobId.MERCHANT, JobId.MERCHANT_H, JobId.MERCHANT_B);
duplicateEntry(JobId.THIEF, JobId.THIEF_H, JobId.THIEF_B);

duplicateEntry(JobId.KNIGHT, JobId.KNIGHT_B);
duplicateEntry(JobId.KNIGHT2, JobId.KNIGHT2_B);
duplicateEntry(JobId.PRIEST, JobId.PRIEST_B);
duplicateEntry(JobId.WIZARD, JobId.WIZARD_B);
duplicateEntry(JobId.BLACKSMITH, JobId.BLACKSMITH_B);
duplicateEntry(JobId.HUNTER, JobId.HUNTER_B);
duplicateEntry(JobId.ASSASSIN, JobId.ASSASSIN_B);
duplicateEntry(JobId.CRUSADER, JobId.CRUSADER_B);
duplicateEntry(JobId.CRUSADER2, JobId.CRUSADER2_B);
duplicateEntry(JobId.MONK, JobId.MONK_B);
duplicateEntry(JobId.SAGE, JobId.SAGE_B);
duplicateEntry(JobId.ROGUE, JobId.ROGUE_B);
duplicateEntry(JobId.ALCHEMIST, JobId.ALCHEMIST_B);
duplicateEntry(JobId.BARD, JobId.BARD_B);
duplicateEntry(JobId.DANCER, JobId.DANCER_B);

duplicateEntry(JobId.RUNE_KNIGHT, JobId.RUNE_KNIGHT_H, JobId.RUNE_KNIGHT_2ND, JobId.RUNE_KNIGHT_B);
duplicateEntry(JobId.RUNE_KNIGHT2, JobId.RUNE_KNIGHT2_H, JobId.RUNE_KNIGHT2_2ND, JobId.RUNE_KNIGHT2_B);
duplicateEntry(JobId.WARLOCK, JobId.WARLOCK_H, JobId.WARLOCK_2ND, JobId.WARLOCK_B);
duplicateEntry(JobId.RANGER, JobId.RANGER_H, JobId.RANGER_2ND, JobId.RANGER_B);
duplicateEntry(JobId.RANGER2, JobId.RANGER2_H, JobId.RANGER2_2ND, JobId.RANGER2_B);
duplicateEntry(JobId.ARCHBISHOP, JobId.ARCHBISHOP_H, JobId.ARCHBISHOP_2ND, JobId.ARCHBISHOP_B);
duplicateEntry(JobId.MECHANIC, JobId.MECHANIC_H, JobId.MECHANIC_2ND, JobId.MECHANIC_B);
duplicateEntry(JobId.MECHANIC2, JobId.MECHANIC2_H, JobId.MECHANIC2_2ND, JobId.MECHANIC2_B);
duplicateEntry(JobId.GUILLOTINE_CROSS, JobId.GUILLOTINE_CROSS_H, JobId.GUILLOTINE_CROSS_2ND, JobId.GUILLOTINE_CROSS_B);
duplicateEntry(JobId.ROYAL_GUARD, JobId.ROYAL_GUARD_H, JobId.ROYAL_GUARD_2ND, JobId.ROYAL_GUARD_B);
duplicateEntry(JobId.ROYAL_GUARD2, JobId.ROYAL_GUARD2_H, JobId.ROYAL_GUARD2_2ND, JobId.ROYAL_GUARD2_B);
duplicateEntry(JobId.SORCERER, JobId.SORCERER_H, JobId.SORCERER_2ND, JobId.SORCERER_B);
duplicateEntry(JobId.MINSTREL, JobId.MINSTREL_H, JobId.MINSTREL_2ND, JobId.MINSTREL_B);
duplicateEntry(JobId.WANDERER, JobId.WANDERER_H, JobId.WANDERER_2ND, JobId.WANDERER_B);
duplicateEntry(JobId.SURA, JobId.SURA_H, JobId.SURA_2ND, JobId.SURA_B);
duplicateEntry(JobId.GENETIC, JobId.GENETIC_H, JobId.GENETIC_2ND, JobId.GENETIC_B);
duplicateEntry(JobId.SHADOW_CHASER, JobId.SHADOW_CHASER_H, JobId.SHADOW_CHASER_2ND, JobId.SHADOW_CHASER_B);
duplicateEntry(JobId.SOUL_REAPER, JobId.SOUL_REAPER_B);
duplicateEntry(JobId.STAR_EMPEROR, JobId.STAR_EMPEROR_B);
duplicateEntry(JobId.DO_SUMMONER, JobId.DO_SUMMONER_B);

//MOUNTS
duplicateEntry(JobId.PORING_NOVICE, JobId.PORING_NOVICE_H, JobId.PORING_NOVICE_B);

duplicateEntry(JobId.SHEEP_ACO, JobId.SHEEP_ACO_H, JobId.SHEEP_ACO_B);
duplicateEntry(JobId.OSTRICH_ARCHER, JobId.OSTRICH_ARCHER_H, JobId.OSTRICH_ARCHER_B);
duplicateEntry(JobId.FOX_MAGICIAN, JobId.FOX_MAGICIAN_H, JobId.FOX_MAGICIAN_B);
duplicateEntry(JobId.PIG_MERCHANT, JobId.PIG_MERCHANT_H, JobId.PIG_MERCHANT_B);
duplicateEntry(JobId.PECO_SWORD, JobId.PECO_SWORD_H, JobId.PECO_SWORD_B);
duplicateEntry(JobId.DOG_THIEF, JobId.DOG_THIEF_H, JobId.DOG_THIEF_B);

duplicateEntry(JobId.SHEEP_PRIEST, JobId.SHEEP_PRIEST_B);
duplicateEntry(JobId.OSTRICH_HUNTER, JobId.OSTRICH_HUNTER_B);
duplicateEntry(JobId.FOX_WIZ, JobId.FOX_WIZ_B);
duplicateEntry(JobId.PIG_BLACKSMITH, JobId.PIG_BLACKSMITH_B);
duplicateEntry(JobId.LION_KNIGHT, JobId.LION_KNIGHT_B);
duplicateEntry(JobId.DOG_ASSASSIN, JobId.DOG_ASSASSIN_B);

duplicateEntry(JobId.SHEEP_MONK, JobId.SHEEP_MONK_B);
duplicateEntry(JobId.OSTRICH_BARD, JobId.OSTRICH_BARD_B);
duplicateEntry(JobId.OSTRICH_DANCER, JobId.OSTRICH_DANCER_B);
duplicateEntry(JobId.FOX_SAGE, JobId.FOX_SAGE_B);
duplicateEntry(JobId.PIG_ALCHE, JobId.PIG_ALCHE_B);
duplicateEntry(JobId.LION_CRUSADER, JobId.LION_CRUSADER_B);
duplicateEntry(JobId.DOG_ROGUE, JobId.DOG_ROGUE_B);

duplicateEntry(JobId.SHEEP_ARCB, JobId.SHEEP_ARCB_B);
duplicateEntry(JobId.OSTRICH_RANGER, JobId.OSTRICH_RANGER_B);
duplicateEntry(JobId.FOX_WARLOCK, JobId.FOX_WARLOCK_B);
duplicateEntry(JobId.PIG_MECHANIC, JobId.PIG_MECHANIC_B);
duplicateEntry(JobId.LION_RUNE_KNIGHT, JobId.LION_RUNE_KNIGHT_B);
duplicateEntry(JobId.DOG_G_CROSS, JobId.DOG_G_CROSS_B);

duplicateEntry(JobId.SHEEP_SURA, JobId.SHEEP_SURA_B);
duplicateEntry(JobId.OSTRICH_MINSTREL, JobId.OSTRICH_MINSTREL_B);
duplicateEntry(JobId.OSTRICH_WANDER, JobId.OSTRICH_WANDER_B);
duplicateEntry(JobId.FOX_SORCERER, JobId.FOX_SORCERER_B);
duplicateEntry(JobId.PIG_GENETIC, JobId.PIG_GENETIC_B);
duplicateEntry(JobId.LION_ROYAL_GUARD, JobId.LION_ROYAL_GUARD_B);
duplicateEntry(JobId.DOG_CHASER, JobId.DOG_CHASER_B);

duplicateEntry(JobId.PORING_SNOVICE, JobId.PORING_SNOVICE_B, JobId.PORING_SNOVICE2, JobId.PORING_SNOVICE2_B);

duplicateEntry(JobId.FROG_NINJA, JobId.FROG_NINJA_B);
duplicateEntry(JobId.PECO_GUNNER, JobId.PECO_GUNNER_B);
duplicateEntry(JobId.PORING_TAEKWON, JobId.PORING_TAEKWON_B);
duplicateEntry(JobId.SOUL_REAPER2, JobId.SOUL_REAPER2_B);
duplicateEntry(JobId.STAR_EMPEROR2, JobId.STAR_EMPEROR2_B);

duplicateEntry(JobId.PORING_STAR, JobId.PORING_STAR_B);
duplicateEntry(JobId.FROG_LINKER, JobId.FROG_LINKER_B);

duplicateEntry(JobId.FROG_KAGEROU, JobId.FROG_KAGEROU_B);
duplicateEntry(JobId.FROG_OBORO, JobId.FROG_OBORO_B);
duplicateEntry(JobId.PECO_REBELLION, JobId.PECO_REBELLION_B);

export default JobNameTable;
