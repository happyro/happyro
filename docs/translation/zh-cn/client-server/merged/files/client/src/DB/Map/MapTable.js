/**
 * DB/Map/MapTable.js
 *
 * Look up table mapname
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

const MapInfo = {
	'1@gol1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '生物实验中心',
			subTitle: '远征'
		},
		notifyEnter: true,
		displayName: '生物实验中心'
	},
	'1@tnm1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '恶魔之塔 - 上层'
		},
		notifyEnter: true,
		displayName: '恶魔之塔 - 上层'
	},
	'gld_dun01_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城 F2',
			subTitle: '绿林湖'
		},
		notifyEnter: true,
		displayName: '绿林湖地下城 2F'
	},
	'ra_temin.rsw': {
		displayName: '拉赫圣域内部'
	},
	'1@lhz.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '沃尔夫切夫的实验室'
		},
		notifyEnter: true,
		displayName: '沃尔夫切夫的实验室'
	},
	'pvp_n_4-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间 Copass'
		},
		notifyEnter: true,
		displayName: 'PvP：Copass 房间'
	},
	'verus01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'OPTATIO 实验室',
			subTitle: '维鲁斯城'
		},
		notifyEnter: true,
		displayName: 'OPTATIO 实验室'
	},
	'payon_in03.rsw': {
		displayName: '斐扬内部'
	},
	'job3_rune02.rsw': {
		displayName: '符文骑士转职测试房间'
	},
	'hero_lb.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '起源庭院',
			subTitle: '英雄之地'
		},
		notifyEnter: true,
		displayName: '英雄之地起源庭院'
	},
	'rag_fes_a.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'RAG-FES 展览馆',
			subTitle: '仙境传说节'
		},
		notifyEnter: true,
		displayName: 'RAG-FES 展览馆'
	},
	'1@gl_he2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '未完成的次元',
			subTitle: '活动模式'
		},
		notifyEnter: true,
		displayName: '活动模式：未完成的次元'
	},
	'lhz_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '死神之谷',
			subTitle: '莱特森原野'
		},
		notifyEnter: true,
		displayName: '莱特森原野（死神之谷）'
	},
	've_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维因斯原野'
		},
		notifyEnter: true,
		displayName: '维因斯原野'
	},
	'ra_san02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '圣域西区 1F',
			subTitle: '拉赫神殿'
		},
		notifyEnter: true,
		displayName: '拉赫神殿圣域西区 1F'
	},
	'hero_tra.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '训练场',
			subTitle: '英雄之地圣域'
		},
		notifyEnter: true,
		displayName: '英雄之地圣域训练场'
	},
	'1@xm_d2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '恐怖玩具工厂'
		},
		notifyEnter: true,
		displayName: '恐怖玩具工厂'
	},
	'te_prtcas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '维格纳城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '维格纳城堡'
	},
	'lou_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '岁龙宫'
		},
		notifyEnter: true,
		displayName: '岁龙宫'
	},
	'pvp_n_2-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间 Copass'
		},
		notifyEnter: true,
		displayName: 'PvP：Copass 房间'
	},
	'dew_in01.rsw': {
		displayName: '达纳托斯岛内部'
	},
	'ayo_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '古代神殿内部'
		},
		notifyEnter: true,
		displayName: '古代神殿内部'
	},
	'star_frst.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '流星林'
		},
		notifyEnter: true,
		displayName: '流星林'
	},
	'1@bamq.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '不公码头'
		},
		notifyEnter: true,
		displayName: '不公码头'
	},
	'1@def03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '熔岩',
			subTitle: '波利地下城'
		},
		notifyEnter: true,
		displayName: '波利地下城 - 熔岩'
	},
	'wolfvill.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '灰狼村',
			subTitle: '原住民藏身处'
		},
		notifyEnter: true,
		displayName: '灰狼村'
	},
	'tur_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '荒芜村庄',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '荒芜村庄'
	},
	'mosk_ship.rsw': {
		displayName: '查拉贝尔'
	},
	'1@vrev.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '艾米基提亚的秘密实验室',
			subTitle: '幻想系列-003'
		},
		notifyEnter: true,
		displayName: '幻想系列-艾米基提亚的秘密实验室'
	},
	'te_prtcas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '尼利乌斯城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '尼利乌斯城堡'
	},
	'mjolnir_04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼尔山北部'
		},
		notifyEnter: true,
		displayName: '妙勒尼尔山北部'
	},
	'gon_test.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '昆仑斗技场'
		},
		notifyEnter: true,
		displayName: '昆仑斗技场'
	},
	'bra_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '瀑布彼端',
			subTitle: '巴西利斯'
		},
		notifyEnter: true,
		displayName: '瀑布彼端'
	},
	'xmas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '鲁蒂耶',
			subTitle: '雪之村'
		},
		notifyEnter: true,
		displayName: '鲁蒂耶，雪之村'
	},
	'iz_ac02_a.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 F2'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 F2'
	},
	'jor_back4.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '冰鳞海滩'
		},
		notifyEnter: true,
		displayName: '冰鳞海滩'
	},
	'vis_h02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '调查走廊 F2'
		},
		notifyEnter: true,
		displayName: '调查走廊 F2'
	},
	'ma_zif09.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'rockmi1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '岩脊矿山 F1'
		},
		notifyEnter: true,
		displayName: '岩脊矿山'
	},
	'jor_back6.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '远古冰峡谷西部'
		},
		notifyEnter: true,
		displayName: '远古冰峡谷西部'
	},
	'aru_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '瓦尔弗雷亚',
			subTitle: '拉赫'
		},
		notifyEnter: true,
		displayName: '瓦尔弗雷亚'
	},
	'ordeal_2-2.rsw': {
		displayName: '战斗试炼模式'
	},
	'arug_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '马德尔城堡',
			subTitle: '瓦尔弗雷亚'
		},
		notifyEnter: true,
		displayName: '马德尔城堡'
	},
	'tha_t11.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '绝望之室',
			subTitle: '塔纳托斯塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层 - 绝望之室'
	},
	'1@4sac.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '暗影宅邸'
		},
		notifyEnter: true,
		displayName: '暗影宅邸'
	},
	'lou_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '王家陵墓内部'
		},
		notifyEnter: true,
		displayName: '王家陵墓内部'
	},
	'priest_1-1.rsw': {
		displayName: '圣所'
	},
	'1@md_pay.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '周末纪念馆'
		},
		notifyEnter: true,
		displayName: '周末纪念馆'
	},
	'ra_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥德峡谷'
		},
		notifyEnter: true,
		displayName: '奥德峡谷'
	},
	'iz_d05_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '深海洞窟'
		},
		notifyEnter: true,
		displayName: '深海洞窟'
	},
	'1@4inq.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '修道院地下室'
		},
		notifyEnter: true,
		displayName: '修道院地下室'
	},
	'pvp_y_4-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 伊斯鲁得房间'
		},
		notifyEnter: true,
		displayName: 'PvP：伊斯鲁得房间'
	},
	'1@vrhha.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '心灵猎人训练中心',
			subTitle: '幻想系列-008'
		},
		notifyEnter: true,
		displayName: '幻想系列 - 心灵猎人训练中心'
	},
	'1@tnm3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '梦罗克城堡 - 地下室'
		},
		notifyEnter: true,
		displayName: '梦罗克城堡 - 地下室'
	},
	'aldebaran.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '艾尔帕兰',
			subTitle: '卢恩-米德加尔特王国边境城市'
		},
		notifyEnter: true,
		displayName: '边境城市艾尔帕兰'
	},
	'3@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '星座塔'
		},
		notifyEnter: true,
		displayName: '星座塔'
	},
	'2@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '星座塔'
		},
		notifyEnter: true,
		displayName: '星座塔'
	},
	'1@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '星座塔'
		},
		notifyEnter: true,
		displayName: '星座塔'
	},
	'pvp_y_2-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 斐扬房间'
		},
		notifyEnter: true,
		displayName: 'PvP：斐扬房间'
	},
	'yuno_in05.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '伊米尔之心发电厂'
		},
		notifyEnter: true,
		displayName: '伊米尔之心发电厂'
	},
	'1@bamn.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '黄昏花园'
		},
		notifyEnter: true,
		displayName: '黄昏花园'
	},
	'pvp_n_8-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间 Copass'
		},
		notifyEnter: true,
		displayName: 'PvP：Copass 房间'
	},
	'pvp_n_1-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Rock On 房间'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'jor_root3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '深根洞窟'
		},
		notifyEnter: true,
		displayName: '深根洞窟'
	},
	'mag_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '诺格道路 3层'
		},
		notifyEnter: true,
		displayName: '诺格道路 3层'
	},
	'ayo_in02.rsw': {
		displayName: '阿育他亚内部'
	},
	'pvp_n_6-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（三明治）'
		},
		notifyEnter: true,
		displayName: 'PvP：三明治房间'
	},
	'yuno_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '施瓦茨瓦尔德卫兵营地'
		},
		notifyEnter: true,
		displayName: '施瓦茨瓦尔德卫兵营地'
	},
	'prt_fild08a.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉南部原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'bat_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '战场等候室'
		},
		notifyEnter: true,
		displayName: '战场等候室'
	},
	'jor_twig.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '树枝巢穴',
			subTitle: '伊斯加尔德圣域'
		},
		notifyEnter: true,
		displayName: '伊斯加尔德圣域树枝巢穴'
	},
	'job_soul.rsw': {
		displayName: '你的心'
	},
	'pvp_y_6-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（伊兹鲁德）'
		},
		notifyEnter: true,
		displayName: 'PvP：伊兹鲁德房间'
	},
	'1@swat.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '心脏猎人军事基地'
		},
		notifyEnter: true,
		displayName: '心脏猎人军事基地'
	},
	'lasa_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '龙巢 1层'
		},
		notifyEnter: true,
		displayName: '龙巢'
	},
	'dic_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斯卡拉巴洞穴',
			subTitle: '卡米达尔隧道'
		},
		notifyEnter: true,
		displayName: '斯卡拉巴洞穴－梦魇模式'
	},
	'pvp_y_5-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（伊兹鲁德）'
		},
		notifyEnter: true,
		displayName: 'PvP：伊兹鲁德房间'
	},
	'pvp_c_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 等候室'
		},
		notifyEnter: true,
		displayName: 'PvP：等候室'
	},
	'hero_in3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '秋日花园',
			subTitle: '赫罗斯利亚'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚秋日花园'
	},
	'1@def01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '森林',
			subTitle: '波浪迷宫'
		},
		notifyEnter: true,
		displayName: '波浪迷宫－森林'
	},
	'1@mjo1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '飞机坠毁地点',
			subTitle: '妙勒尼山'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉－飞机坠毁地点'
	},
	'1@cata.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '地下墓穴'
		},
		notifyEnter: true,
		displayName: '地下墓穴'
	},
	'2@cata.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '封印神殿'
		},
		notifyEnter: true,
		displayName: '封印神殿'
	},
	'ba_2whs02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '塔尔塔罗斯仓库下层'
		},
		notifyEnter: true,
		displayName: '塔尔塔罗斯仓库下层'
	},
	'pvp_n_6-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（Rock On）'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'bra_in01.rsw': {
		displayName: '巴西利斯内部'
	},
	'gef_fild00.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'prtg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '斯科格尔城堡',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '斯科格尔城堡'
	},
	'1@ghg.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '奥索斯水域',
			subTitle: '浮空花园'
		},
		notifyEnter: true,
		displayName: '奥索斯水域'
	},
	'gld_dun04_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会迷宫地下 2层',
			subTitle: '布里特尼亚'
		},
		notifyEnter: true,
		displayName: '布里特尼亚迷宫 2层'
	},
	'payg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '光辉树堡',
			subTitle: '绿林湖'
		},
		notifyEnter: true,
		displayName: '光辉树堡'
	},
	'prtg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '贡杜尔城堡',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '贡杜尔城堡'
	},
	'sec_in01.rsw': {
		displayName: '英灵殿内部'
	},
	'mosk_in.rsw': {
		displayName: '莫斯科比亚内部'
	},
	'bl_venom.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '样本环境－毒液',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: '生物圈样本环境－毒液'
	},
	'cmd_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '可可莫海滩',
			subTitle: '科摩多'
		},
		notifyEnter: true,
		displayName: '可可莫海滩'
	},
	'1@cor.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '科尔'
		},
		notifyEnter: true,
		displayName: '科尔纪念馆'
	},
	'pay_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'1@exnw.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '克拉纳·奈米里'
		},
		notifyEnter: true,
		displayName: '克拉纳·奈米里'
	},
	'moc_fild18.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'job_sage.rsw': {
		displayName: '贤者领域'
	},
	'job_gun.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '反叛者避难所'
		},
		notifyEnter: true,
		displayName: '反叛者避难所'
	},
	'1@ffp.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '残存者藏身处'
		},
		notifyEnter: true,
		displayName: '残存者藏身处'
	},
	'te_prtcas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '理查德城堡',
			subTitle: '卢恩·米德加尔兹'
		},
		notifyEnter: true,
		displayName: '理查德城堡'
	},
	'gef_d01_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '250页',
			subTitle: '幻境'
		},
		notifyEnter: true,
		displayName: '250页'
	},
	've_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维恩斯原野'
		},
		notifyEnter: true,
		displayName: '维恩斯原野'
	},
	'c_tower4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 4层',
			subTitle: '艾尔贝兰'
		},
		notifyEnter: true,
		displayName: '钟楼 4层'
	},
	'ra_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥杜姆拉草原'
		},
		notifyEnter: true,
		displayName: '奥杜姆拉草原'
	},
	'ra_san05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '圣域中央区域 2层',
			subTitle: '拉赫神殿'
		},
		notifyEnter: true,
		displayName: '拉赫神殿圣域中央区域 2层'
	},
	'hero_ent3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '第三英雄之门',
			subTitle: '赫罗斯利亚'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚第三英雄之门'
	},
	'harboro2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下水道',
			subTitle: '洛克里奇'
		},
		notifyEnter: true,
		displayName: '地下水道'
	},
	'prt_elib.rsw': {
		backgroundBmp: 'village_s1',
		signName: {
			subTitle: '普隆德拉东部图书馆'
		},
		notifyEnter: true,
		displayName: '普隆德拉东部图书馆'
	},
	'iz_ac01.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 1层'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 1层'
	},
	'gef_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'1@eom.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '魔神之殿'
		},
		notifyEnter: true,
		displayName: '魔神之殿'
	},
	'1@exsh.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '深邃森林'
		},
		notifyEnter: true,
		displayName: '深邃森林'
	},
	'z_agit.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Z帮藏身处'
		},
		notifyEnter: true,
		displayName: 'Z帮藏身处'
	},
	'kh_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '机器人制造厂 2层'
		},
		notifyEnter: true,
		displayName: '机器人制造厂 2层'
	},
	'ma_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '梦魇医院 1层'
		},
		notifyEnter: true,
		displayName: '梦魇医院 1层'
	},
	'thor_camp.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '托尔火山营地'
		},
		notifyEnter: true,
		displayName: '托尔火山营地'
	},
	'1@exds.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '无名山脚下'
		},
		notifyEnter: true,
		displayName: '无名山脚下'
	},
	'2@exds.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '无名山脚下'
		},
		notifyEnter: true,
		displayName: '无名山脚下'
	},
	'lhz_in03.rsw': {
		displayName: '拉赫内部'
	},
	'turbo_e_16.rsw': {
		displayName: '极速赛道竞技场'
	},
	'job3_arch01.rsw': {
		displayName: '大主教转职等候室'
	},
	'prt_monk.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '圣卡皮托利纳修道院'
		},
		notifyEnter: true,
		displayName: '圣卡皮托利纳修道院'
	},
	'odin_tem02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥丁神殿南部区域'
		},
		notifyEnter: true,
		displayName: '奥丁神殿南部区域'
	},
	'new_1-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'mjolnir_06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山南部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山南部地区'
	},
	'schg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '赫略德城堡',
			subTitle: '尼德霍格'
		},
		notifyEnter: true,
		displayName: '赫略德城堡'
	},
	'prt_sewb4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '下水道 F4',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉下水道 F4'
	},
	'jor_back5.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '古代冰峡谷东部'
		},
		notifyEnter: true,
		displayName: '古代冰峡谷东部'
	},
	'ra_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '伊达平原'
		},
		notifyEnter: true,
		displayName: '伊达平原'
	},
	'tha_t08.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '天使之间',
			subTitle: '塔纳托斯塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层 - 天使之间'
	},
	'gefg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '贝格尔城堡',
			subTitle: '布里托尼亚'
		},
		notifyEnter: true,
		displayName: '贝格尔城堡'
	},
	'ra_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥德峡谷'
		},
		notifyEnter: true,
		displayName: '奥德峡谷'
	},
	'que_temsky.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '天空花园',
			subTitle: '教皇之间'
		},
		notifyEnter: true,
		displayName: '教皇之间（天空花园'
	},
	'pvp_y_2-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'1@dth1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '生物岛'
		},
		notifyEnter: true,
		displayName: '生物岛'
	},
	'gefg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '雷斐里昂城堡',
			subTitle: '布里托尼亚'
		},
		notifyEnter: true,
		displayName: '雷斐里昂城堡'
	},
	'1@halo.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '万圣节庆典'
		},
		notifyEnter: true,
		displayName: '万圣节庆典'
	},
	'com_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '卢安达北洞窟',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '卢安达北洞窟'
	},
	'job_monk.rsw': {
		displayName: '圣卡皮托利纳修道院'
	},
	'lasagna.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '拉萨格',
			subTitle: '远星大陆港口城镇'
		},
		notifyEnter: true,
		displayName: '拉萨格港口城镇'
	},
	'iz_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '海底隧道 B5',
			subTitle: '拜安岛'
		},
		notifyEnter: true,
		displayName: '海底隧道 B5'
	},
	'2@gl_k2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F1',
			subTitle: '旧克雷斯特汉姆'
		},
		notifyEnter: true,
		displayName: '旧克雷斯特汉姆骑士团 F1'
	},
	'prtg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '斯旺希尔德城堡',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '斯旺希尔德城堡'
	},
	'1@soul.rsw': {
		displayName: '灵魂通道'
	},
	'1@sthd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '空中要塞 - 顶层'
		},
		notifyEnter: true,
		displayName: '空中要塞 - 顶层'
	},
	'pvp_n_5-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Rock On 房间'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'bl_death.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '标本环境 - 死亡',
			subTitle: '瓦尔蒙特生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈标本环境 - 死亡'
	},
	'nameless_i.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '无名岛入口'
		},
		notifyEnter: true,
		displayName: '无名岛入口'
	},
	'pay_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '绿林湖',
			subTitle: '斐扬'
		},
		notifyEnter: true,
		displayName: '绿林湖'
	},
	'kh_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '机器人工厂 F1'
		},
		notifyEnter: true,
		displayName: '机器人工厂 F1'
	},
	'xmas_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '玩具工厂仓库',
			subTitle: '玩具工厂'
		},
		notifyEnter: true,
		displayName: '玩具工厂仓库'
	},
	'alberta_in.rsw': {
		displayName: '艾尔贝塔内部'
	},
	'prt_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'pvp_n_1-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Undercross 房间'
		},
		notifyEnter: true,
		displayName: 'PvP：Undercross 房间'
	},
	'dic_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '卡米达尔山底部',
			subTitle: '尤通海姆'
		},
		notifyEnter: true,
		displayName: '卡米达尔山底部'
	},
	'ra_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '伊达平原'
		},
		notifyEnter: true,
		displayName: '伊达平原'
	},
	'1@mist.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '朦胧迷宫森林'
		},
		notifyEnter: true,
		displayName: '朦胧迷宫森林'
	},
	'moc_pryd04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '金字塔内部 F4',
			subTitle: '梦罗克'
		},
		notifyEnter: true,
		displayName: '金字塔内部 F4'
	},
	'gld_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城',
			subTitle: '布里托尼亚'
		},
		notifyEnter: true,
		displayName: '布里托尼亚公会地下城'
	},
	'verus03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '中央广场',
			subTitle: '维鲁斯城'
		},
		notifyEnter: true,
		displayName: '维鲁斯 - 中央广场'
	},
	'niflheim.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '尼芙菲姆',
			subTitle: '亡者国度'
		},
		notifyEnter: true,
		displayName: '尼芙菲姆，亡者国度'
	},
	'guild_vs3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场'
		},
		notifyEnter: true,
		displayName: '公会竞技场'
	},
	'pvp_y_8-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'6@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '绝望的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '绝望的记忆'
	},
	'5@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '悲伤的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '悲伤的记忆'
	},
	'8@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '魔术师塔纳托斯的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔'
	},
	'7@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '愤怒的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '愤怒的记忆'
	},
	'2@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '天使的警告',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '天使的警告'
	},
	'1@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '塔纳托斯塔',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔'
	},
	'4@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '痛苦的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '痛苦的记忆'
	},
	'3@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '憎恨的记忆',
			subTitle: '塔纳托斯的记忆'
		},
		notifyEnter: true,
		displayName: '憎恨的记忆'
	},
	'jor_maze.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '蛇之迷宫'
		},
		notifyEnter: true,
		displayName: '蛇之迷宫'
	},
	'schg_que01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '莫尔斯通草原'
		},
		notifyEnter: true,
		displayName: '莫尔斯通草原'
	},
	'job_thief1.rsw': {
		displayName: '蘑菇农场'
	},
	'rockrdg1.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '基瓦瓦沙漠',
			subTitle: '洛克里奇'
		},
		notifyEnter: true,
		displayName: '基瓦瓦沙漠'
	},
	'gl_cas01_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '城堡 F1',
			subTitle: '深渊克雷斯特汉姆'
		},
		notifyEnter: true,
		displayName: '深渊克雷斯特汉姆城堡 F1'
	},
	'moc_fild19.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'lasa_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '馄饨平原边境哨所',
			subTitle: '拉萨格'
		},
		notifyEnter: true,
		displayName: '馄饨平原边境哨所'
	},
	'air_if.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '伊弗号飞机内部'
		},
		notifyEnter: true,
		displayName: '伊弗号飞机内部'
	},
	'1@tre.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '可疑沉船'
		},
		notifyEnter: true,
		displayName: '可疑沉船'
	},
	'abyss_02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下洞窟 2F',
			subTitle: '深渊湖'
		},
		notifyEnter: true,
		displayName: '深渊湖地下洞窟 2F'
	},
	'ma_zif02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'jor_twice.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '浮冰区域'
		},
		notifyEnter: true,
		displayName: '浮冰区域'
	},
	'1@vrcas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '百合宫殿',
			subTitle: '幻想系列-001'
		},
		notifyEnter: true,
		displayName: '幻想系列-百合宫殿'
	},
	'auction_02.rsw': {
		displayName: '拍卖大厅'
	},
	'hero_in2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '夏日花园',
			subTitle: '赫罗斯利亚'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚夏日花园'
	},
	'pvp_n_3-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 三明治房间'
		},
		notifyEnter: true,
		displayName: 'PvP：三明治房间'
	},
	'1@lvcb.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '潮湿下水道',
			subTitle: '幻想系列-xxx'
		},
		notifyEnter: true,
		displayName: '潮湿下水道'
	},
	'ordeal_1-2.rsw': {
		displayName: '战斗试炼模式'
	},
	'poring_w02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '波利战争市场'
		},
		notifyEnter: true,
		displayName: '波利战争市场'
	},
	'ma_zif06.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'ein_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '艾音布罗克矿山 F2'
		},
		notifyEnter: true,
		displayName: '艾音布罗克矿山 F2'
	},
	'ama_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '地下森林战场'
		},
		notifyEnter: true,
		displayName: '地下森林战场'
	},
	'job_knt.rsw': {
		displayName: '骑士领域'
	},
	'pvp_n_4-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 四号房间'
		},
		notifyEnter: true,
		displayName: 'PvP：四号房间'
	},
	'mjolnir_01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山北部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山北部区域'
	},
	'gonryun.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '昆仑',
			subTitle: '隐士之地'
		},
		notifyEnter: true,
		displayName: '昆仑，隐士之地'
	},
	'bat_c02.rsw': {
		notifyEnter: true,
		displayName: '米德加尔特战士'
	},
	'1@twsd.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '浮冰区域'
		},
		notifyEnter: true,
		displayName: '浮冰区域'
	},
	'icas_in2.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '冰城堡内部'
		},
		notifyEnter: true,
		displayName: '冰城堡内部'
	},
	'dic_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '甲虫大厅',
			subTitle: '卡米达尔隧道'
		},
		notifyEnter: true,
		displayName: '甲虫大厅'
	},
	'pay_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'cmd_fild03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '真海沼泽',
			subTitle: '科摩多'
		},
		notifyEnter: true,
		displayName: '真海沼泽'
	},
	'mjolnir_10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山南部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山南部区域'
	},
	'job4_mag.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '魔法喷泉'
		},
		notifyEnter: true,
		displayName: '魔法喷泉'
	},
	'moc_fild20.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '次元裂缝',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠－次元裂缝'
	},
	'teg_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城',
			subTitle: '卢恩-米德加尔兹'
		},
		notifyEnter: true,
		displayName: '公会地下城'
	},
	'dali02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '次元裂缝'
		},
		notifyEnter: true,
		displayName: '次元裂缝'
	},
	'hu_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '胡格尔原野'
		},
		notifyEnter: true,
		displayName: '胡格尔原野'
	},
	'ma_in01.rsw': {
		displayName: '马来岛内部'
	},
	'gef_fild10.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '兽人村落',
			subTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '兽人村落'
	},
	'prt_maze03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '迷宫森林 F3',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '迷宫森林 F3'
	},
	'dew_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '伊斯塔纳洞窟',
			subTitle: '爪哇岛'
		},
		notifyEnter: true,
		displayName: '伊斯塔纳洞窟'
	},
	'ba_in01.rsw': {
		displayName: '瓦尔蒙特宅邸内部'
	},
	'pvp_y_2-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 伊兹鲁德房间'
		},
		notifyEnter: true,
		displayName: 'PvP：伊兹鲁德房间'
	},
	'wizard_2-1.rsw': {
		displayName: '巫师学院'
	},
	'amicitia2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '二楼－强化培养室',
			subTitle: '废弃实验室阿米希提亚'
		},
		notifyEnter: true,
		displayName: '废弃实验室阿米希提亚'
	},
	'1@vrgen.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '基因实验室',
			subTitle: '幻想系列-004'
		},
		notifyEnter: true,
		displayName: '幻想系列-基因实验室'
	},
	'guild_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场等候室'
		},
		notifyEnter: true,
		displayName: '公会竞技场等候室'
	},
	'bl_lava.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '样本环境－火焰',
			subTitle: '瓦尔蒙特生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈样本环境－火焰'
	},
	'kh_school.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '基尔·海勒学院'
		},
		notifyEnter: true,
		displayName: '基尔·海勒学院'
	},
	'malaya.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '马来港'
		},
		notifyEnter: true,
		displayName: '马来港'
	},
	'alberta.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '艾尔贝塔',
			subTitle: '卢恩-米德加尔兹王国港口城市'
		},
		notifyEnter: true,
		displayName: '港口城市艾尔贝塔'
	},
	'ra_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '月港'
		},
		notifyEnter: true,
		displayName: '月港'
	},
	'tur_dun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '海龟宫殿'
		},
		notifyEnter: true,
		displayName: '海龟宫殿'
	},
	'jupe_gate.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '朱佩洛斯，限制区域'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯，限制区域'
	},
	'mal_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '星光珊瑚区域'
		},
		notifyEnter: true,
		displayName: '星光珊瑚区域'
	},
	'pvp_y_7-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'gl_knt01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团内部 F1',
			subTitle: '古城'
		},
		notifyEnter: true,
		displayName: '古城骑士团内部 F1'
	},
	'gl_sew02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下水道 B2',
			subTitle: '古城'
		},
		notifyEnter: true,
		displayName: '古城地下水道 B2'
	},
	'prt_maze02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '迷宫森林 F2',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '迷宫森林 F2'
	},
	'moc_fild13.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'thana_boss.rsw': {
		displayName: '塔纳托斯之塔－未知区域'
	},
	'ra_temsky.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '天空花园',
			subTitle: '教皇房间'
		},
		notifyEnter: true,
		displayName: '教皇房间（天空花园）'
	},
	'knight_3-1.rsw': {
		displayName: '骑士团'
	},
	'job_cru.rsw': {
		displayName: '十字军领域'
	},
	'gw_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '灰狼森林'
		},
		notifyEnter: true,
		displayName: '灰狼森林'
	},
	'eclage.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '艾可拉珠',
			subTitle: '阿尔夫海姆－拉比内首都'
		},
		notifyEnter: true,
		displayName: '拉比内首都艾可拉珠'
	},
	'einbech.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '艾音贝赫',
			subTitle: '施瓦茨瓦尔德共和国矿业村'
		},
		notifyEnter: true,
		displayName: '矿业村艾音贝赫'
	},
	'verus02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'WISH 研究大楼',
			subTitle: '维鲁斯城'
		},
		notifyEnter: true,
		displayName: 'WISH 研究大楼'
	},
	'tur_dun05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '地下沼泽区域'
		},
		notifyEnter: true,
		displayName: '地下沼泽区域'
	},
	'1@ma_b.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '巴库纳瓦藏身处'
		},
		notifyEnter: true,
		displayName: '巴库纳瓦藏身处'
	},
	'c_tower3_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 F3',
			subTitle: '扭曲的时间'
		},
		notifyEnter: true,
		displayName: '扭曲钟楼 F3'
	},
	'1@infi.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限空间'
		},
		notifyEnter: true,
		displayName: '无限空间'
	},
	'1@dime.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '次元墙之外'
		},
		notifyEnter: true,
		displayName: '次元墙之外'
	},
	'tha_t09.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '苦痛房间',
			subTitle: '塔纳托斯之塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯之塔上层－苦痛房间'
	},
	'1@exhn.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '新手的记忆'
		},
		notifyEnter: true,
		displayName: '新手的记忆'
	},
	'moc_fild21.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '次元裂缝',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠－次元裂缝'
	},
	'amicitia1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '一楼－综合实验室',
			subTitle: '废弃实验室阿米希提亚'
		},
		notifyEnter: true,
		displayName: '废弃实验室阿米希提亚'
	},
	'man_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '马努克原野'
		},
		notifyEnter: true,
		displayName: '马努克原野'
	},
	'clock_01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '未知地下室',
			subTitle: '钟楼'
		},
		notifyEnter: true,
		displayName: '钟楼未知地下室'
	},
	'jor_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '蛇神之暖 1 楼'
		},
		notifyEnter: true,
		displayName: '蛇神之暖 1 楼'
	},
	'bossnia_04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '博斯尼亚'
		},
		notifyEnter: true,
		displayName: '博斯尼亚'
	},
	'icecastle.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '冰之城堡',
			subTitle: '伊斯加德'
		},
		notifyEnter: true,
		displayName: '伊斯加德冰之城堡'
	},
	'1@os_a.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '占领战'
		},
		notifyEnter: true,
		displayName: '占领战'
	},
	'guild_vs2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场'
		},
		notifyEnter: true,
		displayName: '公会竞技场'
	},
	'izlude_in.rsw': {
		displayName: '伊斯鲁得内部'
	},
	'new_5-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'nif_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '死者宴会厅',
			subTitle: '尼福尔海姆地下城 - 1 楼'
		},
		notifyEnter: true,
		displayName: '尼福尔海姆地下城 - 死者宴会厅'
	},
	'moc_pryd03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '金字塔内部 F3',
			subTitle: '梦罗克'
		},
		notifyEnter: true,
		displayName: '金字塔内部 F3'
	},
	'jor_tail.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '冰冻尾巴'
		},
		notifyEnter: true,
		displayName: '冰冻尾巴'
	},
	'yuno_in03.rsw': {
		displayName: '朱诺内部'
	},
	'pvp_y_1-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 普隆德拉房间'
		},
		notifyEnter: true,
		displayName: 'PvP：普隆德拉房间'
	},
	'geffen.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '吉芬',
			subTitle: '卢恩-米德加尔特王国的魔法之都'
		},
		notifyEnter: true,
		displayName: '吉芬，魔法之都'
	},
	'bat_a01.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '提拉峡谷',
			subTitle: '战场'
		},
		notifyEnter: true,
		displayName: '提拉峡谷'
	},
	've_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维因斯原野'
		},
		notifyEnter: true,
		displayName: '维因斯原野'
	},
	've_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维因斯原野'
		},
		notifyEnter: true,
		displayName: '维因斯原野'
	},
	'aldeg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '罗滕堡城堡',
			subTitle: '卢因'
		},
		notifyEnter: true,
		displayName: '罗滕堡城堡'
	},
	'cmd_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '圣达尔迈因要塞（南部'
		},
		notifyEnter: true,
		displayName: '圣达尔迈因要塞（南部'
	},
	'ra_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '伊达平原'
		},
		notifyEnter: true,
		displayName: '伊达平原'
	},
	'man_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '马努克原野'
		},
		notifyEnter: true,
		displayName: '马努克原野'
	},
	'dew_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '部落村庄',
			subTitle: '达纳托斯岛'
		},
		notifyEnter: true,
		displayName: '达纳托斯岛原野（部落村庄）'
	},
	'1@os_b.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '封印的 OS'
		},
		notifyEnter: true,
		displayName: '封印的 OS'
	},
	'priest_2-1.rsw': {
		displayName: '圣所'
	},
	'ant_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '觉醒花园',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '觉醒花园'
	},
	'alde_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 B4',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 B4'
	},
	'job3_arch02.rsw': {
		displayName: '奥丁神殿'
	},
	'man_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '马努克矿区'
		},
		notifyEnter: true,
		displayName: '马努克矿区'
	},
	'new_4-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'ecl_fild01.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '繁花之地'
		},
		notifyEnter: true,
		displayName: '繁花之地'
	},
	'job3_rune03.rsw': {
		displayName: '符文骑士转职测试房间'
	},
	'treasure_n1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '伊斯鲁得沉船 B1'
		},
		notifyEnter: true,
		displayName: '伊斯鲁得沉船 B1'
	},
	'1@lost.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '遗忘时光农场',
			subTitle: '失落山谷'
		},
		notifyEnter: true,
		displayName: '遗忘时光农场'
	},
	'pvp_n_3-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 地下十字房间'
		},
		notifyEnter: true,
		displayName: 'PvP：地下十字房间'
	},
	'1@exsr.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '内在世界'
		},
		notifyEnter: true,
		displayName: '内在世界'
	},
	'iz_ac02_d.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 F2'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 F2'
	},
	'1@vrac1.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '克里图拉学院 1 楼',
			subTitle: '幻想系列'
		},
		notifyEnter: true,
		displayName: '幻想系列 - 学院 1 楼'
	},
	'treasure01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '沉船 B1',
			subTitle: '艾尔贝塔'
		},
		notifyEnter: true,
		displayName: '沉船 B1'
	},
	'que_qaru04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尼尔'
	},
	'gl_prison.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下监狱 B1',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆地下监狱 B1'
	},
	'1@rev.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '摩尔斯洞窟'
		},
		notifyEnter: true,
		displayName: '摩尔斯洞窟'
	},
	'anthell01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '蚂蚁地狱地下城 F1',
			subTitle: '苏克拉特沙漠'
		},
		notifyEnter: true,
		displayName: '蚂蚁地狱地下城 F1'
	},
	'ayo_in01.rsw': {
		displayName: '阿尤塔亚内部'
	},
	'gl_sew01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下水道 B1',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆地下水道 B1'
	},
	'1@sthc.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '空中要塞 - 秘密房间'
		},
		notifyEnter: true,
		displayName: '空中要塞 - 秘密房间'
	},
	'ecl_tdun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '彩虹桥塔 3F'
		},
		notifyEnter: true,
		displayName: '彩虹桥塔 3F'
	},
	'gef_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬地下城 B2'
		},
		notifyEnter: true,
		displayName: '吉芬地下城 B2'
	},
	'1@gol2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '尸体储藏室',
			subTitle: '远征'
		},
		notifyEnter: true,
		displayName: '尸体储藏室'
	},
	'que_thr.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '托尔火山内部'
		},
		notifyEnter: true,
		displayName: '托尔火山内部'
	},
	'prt_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'pay_dun00.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斐扬洞窟 F1',
			subTitle: '斐扬弓箭手村'
		},
		notifyEnter: true,
		displayName: '斐扬洞窟 F1'
	},
	'que_qaru02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尼尔'
	},
	'lhz_in02.rsw': {
		displayName: '莱特森内部'
	},
	'hero_in1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '春之花园',
			subTitle: '英雄之地'
		},
		notifyEnter: true,
		displayName: '英雄之地春之花园'
	},
	'slabw01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '沃纳研究所'
		},
		notifyEnter: true,
		displayName: '沃纳研究所'
	},
	'harboro1.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '岩脊'
		},
		notifyEnter: true,
		displayName: '岩脊'
	},
	'orcsdun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '兽人地下城 F2',
			subTitle: '兽人村'
		},
		notifyEnter: true,
		displayName: '兽人地下城 F2'
	},
	'himinn.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '女武神大厅'
		},
		notifyEnter: true,
		displayName: '女武神大厅（Himinn）'
	},
	'pvp_2vs2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 活动竞技场'
		},
		notifyEnter: true,
		displayName: 'PvP：活动竞技场'
	},
	'new_1-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'prt_prison.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下城',
			subTitle: '普隆德拉城堡'
		},
		notifyEnter: true,
		displayName: '普隆德拉监狱牢房'
	},
	'1@rgsr.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '雷根希尔',
			subTitle: '研究所'
		},
		notifyEnter: true,
		displayName: '雷根希尔'
	},
	'moscovia.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '莫斯科比亚'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚'
	},
	'nyd_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '世界树树根 F2'
		},
		notifyEnter: true,
		displayName: '世界树树根 F2'
	},
	'1@orcs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '兽人地下洞窟'
		},
		notifyEnter: true,
		displayName: '兽人地下洞窟'
	},
	'2@orcs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '兽人地下洞窟'
		},
		notifyEnter: true,
		displayName: '兽人地下洞窟'
	},
	'que_rachel.rsw': {
		displayName: '芙蕾雅神殿内部'
	},
	'new_5-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'iz_ac01_b.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 1层'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 1层'
	},
	'iz_int03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '搁浅客船'
		},
		notifyEnter: true,
		displayName: '搁浅客船'
	},
	'1@jorchs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '混乱蛇巢穴'
		},
		notifyEnter: true,
		displayName: '混乱蛇巢穴'
	},
	'ama_in01.rsw': {
		displayName: '天津町内部'
	},
	'lasa_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '龙巢 3层'
		},
		notifyEnter: true,
		displayName: '龙巢'
	},
	'prontera.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '普隆德拉',
			subTitle: '卢恩·米德加尔兹王国首都'
		},
		notifyEnter: true,
		displayName: '普隆德拉，卢恩·米德加尔兹首都'
	},
	'ra_pol01.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '力量扭曲平原'
		},
		notifyEnter: true,
		displayName: '力量扭曲平原'
	},
	'bl_ice.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '样本环境－严寒',
			subTitle: '瓦尔蒙德生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈样本环境－严寒'
	},
	'hero_dun1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'PvP 迷宫',
			subTitle: '赫罗斯利亚圣域'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚圣域 PvP 迷宫'
	},
	'jor_nest.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '蛇巢穴',
			subTitle: 'Rgan 藏身处'
		},
		notifyEnter: true,
		displayName: '蛇巢穴'
	},
	'in_moc_16.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '苏格拉特沙漠',
			subTitle: '刺客公会'
		},
		notifyEnter: true,
		displayName: '刺客公会'
	},
	've_in02.rsw': {
		displayName: '维恩斯内部'
	},
	'gef_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '吉芬尼亚',
			subTitle: '吉芬'
		},
		notifyEnter: true,
		displayName: '吉芬尼亚迷宫'
	},
	'job3_rang02.rsw': {
		displayName: '游侠转职测试房间'
	},
	'1@jorlab.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '巴戈特实验室'
		},
		notifyEnter: true,
		displayName: '巴戈特实验室'
	},
	'bossnia_02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: '博斯尼亚'
	},
	'verus04.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '希望住宅楼',
			subTitle: '维鲁斯－挖掘现场'
		},
		notifyEnter: true,
		displayName: '维鲁斯－挖掘现场'
	},
	'job3_arch03.rsw': {
		displayName: '大主教转职等候室'
	},
	'ra_fild13.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '泪之海岸'
		},
		notifyEnter: true,
		displayName: '泪之海岸'
	},
	'gefg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '埃约尔布里加城堡',
			subTitle: '布里特尼亚'
		},
		notifyEnter: true,
		displayName: '埃约尔布里加城堡'
	},
	'job3_gen01.rsw': {
		displayName: '基因学者实验室'
	},
	'izlude_b.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '伊兹鲁德',
			subTitle: '卢恩·米德加尔兹王国'
		},
		notifyEnter: true,
		displayName: '伊兹鲁德，卫星城'
	},
	'herosria.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '宝石房间',
			subTitle: '赫罗斯利亚圣域'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚圣域宝石房间'
	},
	'man_in01.rsw': {
		displayName: '马努克内部'
	},
	'mosk_dun02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '特姆尼森林',
			subTitle: '莫斯科比亚'
		},
		notifyEnter: true,
		displayName: '特姆尼森林'
	},
	'xmas_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '玩具监控室',
			subTitle: '鲁蒂'
		},
		notifyEnter: true,
		displayName: '玩具监控室'
	},
	'vis_h01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '调查走廊 1层'
		},
		notifyEnter: true,
		displayName: '调查走廊 1层'
	},
	'prt_fild08c.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉南部原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'te_prtcas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '乔伯格城堡',
			subTitle: '卢恩·米德加尔兹'
		},
		notifyEnter: true,
		displayName: '乔伯格城堡'
	},
	'1@cash.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '章鱼洞窟'
		},
		notifyEnter: true,
		displayName: '章鱼洞窟'
	},
	'cave.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '洞窟村落'
		},
		notifyEnter: true,
		displayName: '洞窟村落'
	},
	'1@vrac2.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '克里图拉学院 2层',
			subTitle: '幻想系列'
		},
		notifyEnter: true,
		displayName: '幻想系列－学院 2层'
	},
	'gef_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'silk_lair.rsw': {
		notifyEnter: true,
		displayName: '巨蟒巢穴'
	},
	'xmas_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '鲁蒂原野'
		},
		notifyEnter: true,
		displayName: '鲁蒂原野'
	},
	'1@ma_h.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '梦魇医院 2层'
		},
		notifyEnter: true,
		displayName: '梦魇医院 2层'
	},
	'c_tower2_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 2层',
			subTitle: '扭曲的时间'
		},
		notifyEnter: true,
		displayName: '扭曲钟楼 2层'
	},
	'que_qaru01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥科尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥科尼尔'
	},
	'1@drdo.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '多拉多传说'
		},
		notifyEnter: true,
		displayName: '多拉多传说'
	},
	'alde_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 B1层',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 B1层'
	},
	'new_2-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'1@slw.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '中央房间',
			subTitle: '维尔纳研究所'
		},
		notifyEnter: true,
		displayName: '维尔纳研究所'
	},
	'hero_out3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '巴斯蒂塔里乌姆',
			subTitle: '赫罗斯利亚'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚巴斯蒂塔里乌姆'
	},
	'dic_in01.rsw': {
		displayName: '迪卡斯特斯内部'
	},
	'gl_knt02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团内部 1层',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆骑士团内部 2层'
	},
	'alb_ship.rsw': {
		displayName: '艾尔贝塔船'
	},
	'gefg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '梅尔塞德茨城堡',
			subTitle: '布里特尼亚'
		},
		notifyEnter: true,
		displayName: '梅尔塞德茨城堡'
	},
	'mag_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '诺格道路 2层'
		},
		notifyEnter: true,
		displayName: '诺格道路 2层'
	},
	'arug_que01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '莫尔斯通草原'
		},
		notifyEnter: true,
		displayName: '莫尔斯通草原'
	},
	'turbo_n_1.rsw': {
		displayName: '极速赛道竞技场'
	},
	'schg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '安德朗格城堡',
			subTitle: '尼德霍格尔 '
		},
		notifyEnter: true,
		displayName: '安德朗格城堡'
	},
	'pvp_y_5-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（梦罗克）'
		},
		notifyEnter: true,
		displayName: 'PvP：梦罗克房间'
	},
	'schg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '斯基德布拉德尼尔城堡',
			subTitle: '尼德霍格尔'
		},
		notifyEnter: true,
		displayName: '斯基德布拉德尼尔城堡'
	},
	'treasure02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '沉船 B2层',
			subTitle: '艾尔贝塔'
		},
		notifyEnter: true,
		displayName: '沉船 B2层'
	},
	'bl_depth1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '深处 1层',
			subTitle: '瓦尔蒙德生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈深处 1层'
	},
	'1@gef.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬魔法大赛'
		},
		notifyEnter: true,
		displayName: '吉芬魔法大赛'
	},
	'airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '机场'
		},
		notifyEnter: true,
		displayName: '机场'
	},
	'lasa_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '龙巢 2层'
		},
		notifyEnter: true,
		displayName: '龙巢'
	},
	'gld_dun03_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会迷宫地下 2层',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '女武神领域迷宫 2层'
	},
	'schg_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会迷宫',
			subTitle: '施瓦茨瓦尔德'
		},
		notifyEnter: true,
		displayName: '施瓦茨瓦尔德公会迷宫'
	},
	'ordeal_1-3.rsw': {
		displayName: '战斗试炼模式'
	},
	'hu_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '胡格尔原野'
		},
		notifyEnter: true,
		displayName: '胡格尔原野'
	},
	'thor_v03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '托尔火山迷宫 3层'
		},
		notifyEnter: true,
		displayName: '托尔火山迷宫 3层'
	},
	'1@4win.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '鲁鲁卡深林'
		},
		notifyEnter: true,
		displayName: '鲁鲁卡深林'
	},
	'mjo_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '死坑 F3',
			subTitle: '妙勒尼山北部'
		},
		notifyEnter: true,
		displayName: '妙勒尼山死坑 F3'
	},
	'pvp_n_2-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 四人房间'
		},
		notifyEnter: true,
		displayName: 'PvP：四人房间'
	},
	'pvp_y_2-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 普隆德拉房间'
		},
		notifyEnter: true,
		displayName: 'PvP：普隆德拉房间'
	},
	'1@ge_st.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬魔法大赛'
		},
		notifyEnter: true,
		displayName: '吉芬魔法大赛'
	},
	'1@nyd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '尼德霍格的巢穴'
		},
		notifyEnter: true,
		displayName: '尼德霍格的巢穴'
	},
	'2@nyd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '尼德霍格的巢穴'
		},
		notifyEnter: true,
		displayName: '尼德霍格的巢穴'
	},
	'pay_arche.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '弓箭手村',
			subTitle: '斐扬'
		},
		notifyEnter: true,
		displayName: '斐扬弓箭手村'
	},
	'ra_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥杜姆拉草原'
		},
		notifyEnter: true,
		displayName: '奥杜姆拉草原'
	},
	'new_3-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'tha_t03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '废弃之地',
			subTitle: '塔纳托斯塔'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔废弃之地'
	},
	'1@mcd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '查尔斯顿工厂'
		},
		notifyEnter: true,
		displayName: '查尔斯顿工厂'
	},
	'star_in.rsw': {
		displayName: '刘成林内部'
	},
	'pvp_y_4-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'arug_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '霍恩城堡',
			subTitle: '瓦尔弗雷亚'
		},
		notifyEnter: true,
		displayName: '霍恩城堡'
	},
	'manuk.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '马努克',
			subTitle: '尤通海姆萨法矿业村'
		},
		notifyEnter: true,
		displayName: '马努克矿业营地'
	},
	'que_hugel.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '奥丁神殿地下'
		},
		notifyEnter: true,
		displayName: '奥丁神殿地下'
	},
	'treasure_n2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '依斯鲁得沉船 B2'
		},
		notifyEnter: true,
		displayName: '依斯鲁得沉船 B2'
	},
	'ma_zif05.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'jor_root2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '蛇神之根 2F'
		},
		notifyEnter: true,
		displayName: '蛇神之根 2F'
	},
	'ice_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '拉赫冰洞 2F'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞 2F'
	},
	'mosk_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '莫斯科比亚原野'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚原野'
	},
	'itemmall.rsw': {
		displayName: '卡普拉商店'
	},
	'new_2-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'pay_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斐扬洞窟 F4',
			subTitle: '斐扬弓箭手村'
		},
		notifyEnter: true,
		displayName: '斐扬洞窟 F4'
	},
	'lhz_cube.rsw': {
		displayName: '立方体房间'
	},
	'prt_q.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '被入侵的普隆德拉'
		},
		notifyEnter: true,
		displayName: '被入侵的普隆德拉'
	},
	've_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维因斯原野'
		},
		notifyEnter: true,
		displayName: '维因斯原野'
	},
	'un_bk_q.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '地下掩体'
		},
		notifyEnter: true,
		displayName: '地下掩体'
	},
	'1@jtb.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '梦与影'
		},
		notifyEnter: true,
		displayName: '梦与影'
	},
	'prt_arena01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '竞技场'
		},
		notifyEnter: true,
		displayName: '竞技场'
	},
	'gefg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '耶斯内尔夫城堡',
			subTitle: '布里托尼亚'
		},
		notifyEnter: true,
		displayName: '耶斯内尔夫城堡'
	},
	'gef_fild13.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '布里托尼亚',
			subTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '布里托尼亚'
	},
	'iz_ac01_d.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里阿图拉学院 F1'
		},
		notifyEnter: true,
		displayName: '克里阿图拉学院 F1'
	},
	'oz_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '奥兹迷宫 2F'
		},
		notifyEnter: true,
		displayName: '奥兹迷宫 2F'
	},
	'iz_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '海底隧道 B3',
			subTitle: '拜安岛'
		},
		notifyEnter: true,
		displayName: '海底隧道 B3'
	},
	'ecl_in01.rsw': {
		displayName: '艾可拉珠内部'
	},
	'que_qaru05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尔尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尔尼尔'
	},
	'sp_rudus2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '鲁杜斯 F2',
			subTitle: '实验废弃物处理场'
		},
		notifyEnter: true,
		displayName: '鲁杜斯，实验废弃物处理场 F2'
	},
	'new_1-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'vis_h04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '调查走廊 F4'
		},
		notifyEnter: true,
		displayName: '调查走廊 F4'
	},
	'pay_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'hu_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '皇家狩猎场'
		},
		notifyEnter: true,
		displayName: '皇家狩猎场'
	},
	'pvp_n_7-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Rock On 房间'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'nameless_n.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '无名岛入口'
		},
		notifyEnter: true,
		displayName: '无名岛入口'
	},
	'1@4mst.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '欧佩罗斯中央 VT'
		},
		notifyEnter: true,
		displayName: '欧佩罗斯中央 VT'
	},
	'prt_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'mid_camp.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '米德加尔特远征队营地',
			subTitle: '尤通海姆'
		},
		notifyEnter: true,
		displayName: '米德加尔特远征队营地'
	},
	'te_alde_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '卡普拉的巢穴',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '卡普拉的巢穴'
	},
	'conch_in.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '海螺内部',
			subTitle: '拉萨格港口城镇'
		},
		notifyEnter: true,
		displayName: '海螺内部'
	},
	'new_5-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'turbo_e_4.rsw': {
		displayName: '极速赛道体育场'
	},
	'job3_guil01.rsw': {
		displayName: '秘密酒馆'
	},
	'paramk.rsw': {
		displayName: '帕拉市场'
	},
	'gef_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'moc_pryd05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '金字塔内部 B1',
			subTitle: '梦罗克'
		},
		notifyEnter: true,
		displayName: '金字塔内部 B1'
	},
	'un_bunker.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '地下掩体'
		},
		notifyEnter: true,
		displayName: '地下掩体'
	},
	'1@air1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '飞艇'
		},
		notifyEnter: true,
		displayName: '飞艇'
	},
	'sp_rudus3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '鲁杜斯 F3',
			subTitle: '实验废弃物处理场'
		},
		notifyEnter: true,
		displayName: '鲁杜斯，实验废弃物处理场 F3'
	},
	'mal_in01.rsw': {
		displayName: '马兰岛内部'
	},
	'2@mir.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '仪式之间'
		},
		notifyEnter: true,
		displayName: '仪式之间'
	},
	'1@mir.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '仪式之间'
		},
		notifyEnter: true,
		displayName: '仪式之间'
	},
	'ma_zif03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'dicastes02.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '布鲁姆维尔德森林',
			subTitle: '迪卡斯特斯'
		},
		notifyEnter: true,
		displayName: '布鲁姆维尔德森林'
	},
	'rag_fes.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'RAG-FES 展览厅',
			subTitle: '仙境传说节'
		},
		notifyEnter: true,
		displayName: 'RAG-FES 展览厅'
	},
	'prtg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '法德格里德城堡',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '法德格里德城堡'
	},
	'izlude_d.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: 'Izlude, the Satellite City'
	},
	'in_sphinx1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B1',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: 'Morocc Sphinx B1'
	},
	'lhz_in01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Rekenber Corporation Headquarters'
		},
		notifyEnter: true,
		displayName: 'Rekenber Corporation Headquarters'
	},
	'lasa_fild02.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Ravioli Forest'
		},
		notifyEnter: true,
		displayName: 'Ravioli Forest'
	},
	'1@spa.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Ghost Palace'
		},
		notifyEnter: true,
		displayName: 'Ghost Palace'
	},
	'yuno_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'El Mes Plateau'
		},
		notifyEnter: true,
		displayName: 'El Mes Plateau'
	},
	'ordeal_2-3.rsw': {
		displayName: 'Battle Ordeal Mode'
	},
	'jawaii.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Jawaii',
			subTitle: 'Honeymoon Island'
		},
		notifyEnter: true,
		displayName: 'Jawaii, the Honeymoon Island'
	},
	'iz_ac01_a.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: 'Criatura Academy F1'
	},
	'new_4-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: 'Training Ground'
	},
	'pvp_y_5-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Prontera'
	},
	'gl_cas02_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Castle F2',
			subTitle: 'Glastheim Castle'
		},
		notifyEnter: true,
		displayName: 'Glastheim Castle F2'
	},
	'dewata.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Dewata'
		},
		notifyEnter: true,
		displayName: 'Dewata'
	},
	'1@4igd.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'The Battlefield of Justice'
		},
		notifyEnter: true,
		displayName: 'The Battlefield of Justice'
	},
	'iz_int01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: 'Stranded Passenger Ship'
	},
	'force_2-3.rsw': {
		displayName: 'Time Limit Fight'
	},
	'ein_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Einbech Mine 3F'
		},
		notifyEnter: true,
		displayName: 'Einbech Mine 3F'
	},
	'prt_evt_in.rsw': {
		displayName: 'Hunting Lodge'
	},
	'tha_t06.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: 'Thanatos Tower Upper Level'
	},
	'1@dth3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bios Island'
		},
		notifyEnter: true,
		displayName: 'Bios Island'
	},
	'monk_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Inside St. Abbey'
		},
		notifyEnter: true,
		displayName: 'Inside St. Abbey'
	},
	'turbo_e_8.rsw': {
		displayName: 'Turbo Track Stadium'
	},
	'cmd_in01.rsw': {
		displayName: 'Inside Comodo'
	},
	'ein_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: 'Einbroch Field'
	},
	'arug_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Banadis Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: 'Banadis Castle'
	},
	'gl_chyard.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Churchyard',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: 'Glastheim Underground Churchyard'
	},
	'pvp_y_7-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Izlude'
	},
	'pvp_n_7-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Copass'
	},
	'ba_pw01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '1st Power Plant'
		},
		notifyEnter: true,
		displayName: '1st Power Plant'
	},
	'lhz_airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Lighthalzen Airport'
		},
		notifyEnter: true,
		displayName: 'Lighthalzen Airport'
	},
	'ein_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Nasarin Empire',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: 'Nasarin Empire'
	},
	'arena_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Waiting room'
		},
		notifyEnter: true,
		displayName: 'Waiting room'
	},
	'job4_bio.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Secret Garden'
		},
		notifyEnter: true,
		displayName: 'Secret Garden'
	},
	'pvp_y_3-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'yggdrasil01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Hvergelmir's Fountain"
		},
		notifyEnter: true,
		displayName: "Hvergelmir's Fountain (Trunk of Yggdrasil)"
	},
	'ama_in02.rsw': {
		displayName: 'Inside Himezi Castle'
	},
	'jor_ab01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Abandoned Pit 1st Floor'
		},
		notifyEnter: true,
		displayName: 'Abandoned Pit 1st Floor'
	},
	'mjolnir_05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: 'Mt.Mjolnir North Area'
	},
	'que_bingo.rsw': {
		displayName: 'Bingo Game Room'
	},
	'1@4drk.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: "Dragon's Trail"
		},
		notifyEnter: true,
		displayName: "Dragon's Trail"
	},
	'gld_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: 'Luina Guild Dungeon'
	},
	'vr_bob.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: "Today's Table",
			subTitle: 'Fantasy Series-006'
		},
		notifyEnter: true,
		displayName: "Fantasy Series - Today's Table"
	},
	'jor_back3.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Glacier'
		},
		notifyEnter: true,
		displayName: 'Frozen Scale Glacier'
	},
	'louyang.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Louyang',
			subTitle: 'Highland'
		},
		notifyEnter: true,
		displayName: 'Louyang, the Highland'
	},
	'iz_ac02_c.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: 'Criatura Academy F2'
	},
	'ra_san04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary South Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: 'Rachel Temple Sanctuary South Area 1F'
	},
	'beach_dun3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Mao, the East Cave',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: 'Mao, the East Cave'
	},
	'pub_cat.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Cat on a Bullet',
			subTitle: 'Einbroch Rebellion Pub'
		},
		notifyEnter: true,
		displayName: 'Cat on a Bullet'
	},
	'1@herbs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Hidden Flower Garden'
		},
		notifyEnter: true,
		displayName: 'Hidden Flower Garden'
	},
	'prt_lib_q.rsw': {
		displayName: 'Memorial of Past Royal Family'
	},
	'ma_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Forest',
			subTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: 'Forest'
	},
	'pvp_y_3-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Prontera'
	},
	'1@exse.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Galactic Celestial Branch'
		},
		notifyEnter: true,
		displayName: 'Galactic Celestial Branch'
	},
	'bat_b01.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Flavian',
			subTitle: 'Battleground'
		},
		notifyEnter: true,
		displayName: 'Flavian'
	},
	'ein_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: 'Einbroch Field'
	},
	'sp_os.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'OS',
			subTitle: 'Special Border Area'
		},
		notifyEnter: true,
		displayName: 'Special Border Area OS'
	},
	'prt_in.rsw': {
		displayName: 'Inside Prontera'
	},
	'moc_ruins.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Morocc Ruins'
		},
		notifyEnter: true,
		displayName: 'Morocc Ruins'
	},
	'arug_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Gefn Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: 'Gefn Castle'
	},
	'ama_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Amatsu Underground Shrine'
		},
		notifyEnter: true,
		displayName: 'Amatsu Underground Shrine'
	},
	'yuno_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'El Mes Plateau'
		},
		notifyEnter: true,
		displayName: 'El Mes Plateau'
	},
	'moc_fild22b.rsw': {
		backgroundBmp: 'field2',
		signName: {
			mainTitle: 'Dimension Crack',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: 'Dimension Crack in Sograt Desert'
	},
	'hu_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Hugel Abyss Lake'
		},
		notifyEnter: true,
		displayName: 'Hugel Abyss Lake'
	},
	'gl_sew03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway B3',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: 'Glastheim Underground Waterway B3'
	},
	'hero_ent1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "1st Hero's Gateway",
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: "Herosria 1st Hero's Gateway"
	},
	'payg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bamboo Grove Hill',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '竹林山城堡'
	},
	'prt_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'1@adv.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '大主教别墅'
		},
		notifyEnter: true,
		displayName: '大主教别墅'
	},
	'ein_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '艾因布洛克原野'
		},
		notifyEnter: true,
		displayName: '艾因布洛克原野'
	},
	'jor_safty1.rsw': {
		backgroundBmp: 'field2_s1',
		signName: {
			subTitle: '安全地点'
		},
		notifyEnter: true,
		displayName: '安全地点'
	},
	'prt_sewb3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '下水道 F3',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉下水道 F3'
	},
	'tha_t07.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '天使之室',
			subTitle: '塔纳托斯塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层 - 天使之室'
	},
	'tha_t05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '塔纳托斯塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层'
	},
	'turbo_n_16.rsw': {
		displayName: '极速赛道竞技场'
	},
	'alde_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 B2',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 B2'
	},
	'1@pop3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '天空花园',
			subTitle: '白昼半月'
		},
		notifyEnter: true,
		displayName: '天空花园'
	},
	'har_in01.rsw': {
		displayName: '岩脊'
	},
	'new_2-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'prt_castle.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '普隆德拉城堡'
		},
		notifyEnter: true,
		displayName: '普隆德拉城堡'
	},
	'gl_cas02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '格拉斯特海姆城堡 F2',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆城堡 F2'
	},
	'que_swat.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '心灵猎人军事基地'
		},
		notifyEnter: true,
		displayName: '心灵猎人军事基地'
	},
	'1@4cdn.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '最后试炼幻境洞窟'
		},
		notifyEnter: true,
		displayName: '最后试炼幻境洞窟'
	},
	'tra_fild.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉外围训练场'
		},
		notifyEnter: true,
		displayName: '普隆德拉外围训练场'
	},
	'tha_t04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '废弃之地',
			subTitle: '塔纳托斯塔'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔废弃之地'
	},
	'iz_ac02_b.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 F2'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 F2'
	},
	'abbey02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '诅咒修道院地下城 B2',
			subTitle: '无名岛'
		},
		notifyEnter: true,
		displayName: '诅咒修道院地下城 B2'
	},
	'turbo_n_8.rsw': {
		displayName: '极速赛道竞技场'
	},
	'vis_h03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '调查走廊 F3'
		},
		notifyEnter: true,
		displayName: '调查走廊 F3'
	},
	'1@md_gef.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '星期五纪念馆'
		},
		notifyEnter: true,
		displayName: '星期五纪念馆'
	},
	'lasa_sea.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '拉萨格纳洞窟'
		},
		notifyEnter: true,
		displayName: '拉萨格纳洞窟'
	},
	'odin_tem03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥丁神殿北区'
		},
		notifyEnter: true,
		displayName: '奥丁神殿北区'
	},
	'quiz_test.rsw': {
		displayName: '问答大厅'
	},
	'c_tower2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 F2',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 F2'
	},
	'2@gl_k.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F2',
			subTitle: '旧格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '旧格拉斯特海姆骑士团 F2'
	},
	'ecl_hub01.rsw': {
		displayName: '艾可拉斯外围'
	},
	'1@gl_k.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F1',
			subTitle: '旧格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '旧格拉斯特海姆骑士团 F1'
	},
	'1@gef_in.rsw': {
		displayName: '吉芬魔法大赛'
	},
	'lasa_dun_q.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '龙巢'
		},
		notifyEnter: true,
		displayName: '龙巢'
	},
	'schg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '维德布莱恩城堡',
			subTitle: '尼德霍格'
		},
		notifyEnter: true,
		displayName: '维德布莱恩城堡'
	},
	'hero_out4.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '拉比纳里乌姆',
			subTitle: '英雄之地'
		},
		notifyEnter: true,
		displayName: '英雄之地拉比纳里乌姆'
	},
	'alde_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '卢因',
			subTitle: '艾尔帕兰卫星城'
		},
		notifyEnter: true,
		displayName: '卢因，艾尔帕兰卫星城'
	},
	'prt_fild08b.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉南部原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'yuno_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '边境检查站'
		},
		notifyEnter: true,
		displayName: '边境检查站'
	},
	'lhz_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '莱特森原野'
		},
		notifyEnter: true,
		displayName: '莱特森原野'
	},
	'pvp_n_7-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 三明治房间'
		},
		notifyEnter: true,
		displayName: 'PvP：三明治房间'
	},
	'yuno_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '埃尔梅斯高原'
		},
		notifyEnter: true,
		displayName: '埃尔梅斯高原'
	},
	'pvp_n_5-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 地下十字房间'
		},
		notifyEnter: true,
		displayName: 'PvP：地下十字房间'
	},
	'job_wiz.rsw': {
		displayName: '巫师领域'
	},
	'gon_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '隐士棋盘',
			subTitle: '昆仑'
		},
		notifyEnter: true,
		displayName: '隐士棋盘'
	},
	'int_land.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '遥远岛屿'
		},
		notifyEnter: true,
		displayName: '遥远岛屿'
	},
	'aldeba_in.rsw': {
		displayName: '艾尔帕兰内部'
	},
	've_in.rsw': {
		displayName: '维因斯内部'
	},
	'que_qsch05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尼尔'
	},
	'ma_zif07.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'1@tcamp.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '托尔火山军事基地'
		},
		notifyEnter: true,
		displayName: '托尔火山军事基地'
	},
	'prt_fild08d.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉南部原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'job_prist.rsw': {
		displayName: '牧师领域'
	},
	'nyd_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '世界树树根 F1'
		},
		notifyEnter: true,
		displayName: '世界树树根 F1'
	},
	'kh_kiehl02.rsw': {
		displayName: '基尔的房间'
	},
	'in_sphinx2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '梦罗克斯芬克斯 B2',
			subTitle: '苏克拉特沙漠'
		},
		notifyEnter: true,
		displayName: '梦罗克斯芬克斯 B2'
	},
	'icas_in.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '冰之城堡内部'
		},
		notifyEnter: true,
		displayName: '冰之城堡内部'
	},
	'iz_ac02.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里图拉学院 F2'
		},
		notifyEnter: true,
		displayName: '克里图拉学院 F2'
	},
	'bl_soul.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '样本环境 - 灵魂',
			subTitle: '瓦尔蒙特的生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈样本环境 - 灵魂'
	},
	'mjolnir_12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼尔山北麓'
		},
		notifyEnter: true,
		displayName: '妙勒尼尔山北麓'
	},
	'alde_alche.rsw': {
		displayName: '炼金术士领域'
	},
	'payg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '绯红宫殿城堡',
			subTitle: '绿林湖'
		},
		notifyEnter: true,
		displayName: '绯红宫殿城堡'
	},
	'gefenia02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬尼亚'
		},
		notifyEnter: true,
		displayName: '吉芬尼亚'
	},
	'force_3-2.rsw': {
		displayName: '限时战斗'
	},
	'izlude_c.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '伊斯鲁得',
			subTitle: '卢恩-米德加尔特王国'
		},
		notifyEnter: true,
		displayName: '伊斯鲁得，卫星城'
	},
	's_atelier.rsw': {
		displayName: '暗影工坊'
	},
	'1@20cn2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '峡谷探索'
		},
		notifyEnter: true,
		displayName: '峡谷探索'
	},
	'pvp_y_1-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 伊斯鲁得房间'
		},
		notifyEnter: true,
		displayName: 'PvP：伊斯鲁得房间'
	},
	'spl_in02.rsw': {
		displayName: '斯普兰迪德内部'
	},
	'1@4mag.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '魔法喷泉'
		},
		notifyEnter: true,
		displayName: '魔法喷泉'
	},
	'quiz_00.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '问答革命'
		},
		notifyEnter: true,
		displayName: '问答革命'
	},
	'1@vrclo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '镜之修道院',
			subTitle: '幻想系列-005'
		},
		notifyEnter: true,
		displayName: '幻想系列－镜之修道院'
	},
	'rockrdg2.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '基瓦瓦沙漠',
			subTitle: '洛克里奇'
		},
		notifyEnter: true,
		displayName: '基瓦瓦沙漠'
	},
	'2@vrclo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '那些时光',
			subTitle: '幻想系列-005'
		},
		notifyEnter: true,
		displayName: '幻想系列－那些时光'
	},
	'iz_int02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '搁浅客船'
		},
		notifyEnter: true,
		displayName: '搁浅客船'
	},
	'yuno_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '边境哨站'
		},
		notifyEnter: true,
		displayName: '边境哨站'
	},
	'1@spa2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '悔恨之墓'
		},
		notifyEnter: true,
		displayName: '悔恨之墓'
	},
	'ma_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '神奇村庄',
			subTitle: '马来港'
		},
		notifyEnter: true,
		displayName: '神奇村庄'
	},
	'poring_w01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '波利战争等候室'
		},
		notifyEnter: true,
		displayName: '波利战争等候室'
	},
	'ecl_tdun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '彩虹桥塔 1层'
		},
		notifyEnter: true,
		displayName: '彩虹桥塔 1层'
	},
	'jupe_area2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '朱佩洛斯禁区'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯禁区'
	},
	'gef_fild05.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '吉普赛村落',
			subTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉普赛村落'
	},
	'ra_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '奥杜姆拉草原'
		},
		notifyEnter: true,
		displayName: '奥杜姆拉草原'
	},
	'izlude_a.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '伊兹鲁德',
			subTitle: '卢恩·米德加尔兹王国'
		},
		notifyEnter: true,
		displayName: '伊兹鲁德，卫星城'
	},
	'jupe_core2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '朱佩洛斯中心'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯中心'
	},
	'force_1-2.rsw': {
		displayName: '限时战斗'
	},
	'lasa_in01.rsw': {
		displayName: '拉萨格内部'
	},
	'jor_que.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '被遗弃的蛇神温暖之地'
		},
		notifyEnter: true,
		displayName: '被遗弃的蛇神温暖之地'
	},
	'ordeal_3-4.rsw': {
		displayName: '战斗试炼模式'
	},
	'sch_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '尼德霍格尔',
			subTitle: '朱诺'
		},
		notifyEnter: true,
		displayName: '尼德霍格尔'
	},
	'oz_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '奥兹迷宫 1层'
		},
		notifyEnter: true,
		displayName: '奥兹迷宫 1层'
	},
	'iz_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '海底隧道 B2层',
			subTitle: '拜蓝岛'
		},
		notifyEnter: true,
		displayName: '海底隧道 B2层'
	},
	'prt_cas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '中央宫殿',
			subTitle: '普隆德拉城堡'
		},
		notifyEnter: true,
		displayName: '普隆德拉中央宫殿'
	},
	'jupe_core.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '朱佩洛斯中心'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯中心'
	},
	'rockmi2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '洛克里奇矿山 2层'
		},
		notifyEnter: true,
		displayName: '洛克里奇矿山'
	},
	'prt_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '女武神领域',
			subTitle: '普隆德拉'
		},
		notifyEnter: true,
		displayName: '女武神领域'
	},
	'iz_d04_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '深海洞窟'
		},
		notifyEnter: true,
		displayName: '深海洞窟'
	},
	'amatsu.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '天津町',
			subTitle: '命运之地'
		},
		notifyEnter: true,
		displayName: '天津町，命运之地'
	},
	'pay_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斐扬洞窟 2层',
			subTitle: '斐扬弓箭手村'
		},
		notifyEnter: true,
		displayName: '斐扬洞窟 2层'
	},
	'gl_cas01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '格拉斯特海姆城堡 1层',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆城堡 1层'
	},
	'te_prtcas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '海涅城堡',
			subTitle: '卢恩·米德加尔兹'
		},
		notifyEnter: true,
		displayName: '海涅城堡'
	},
	'1@vrpo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '波利大地',
			subTitle: '幻想系列-007'
		},
		notifyEnter: true,
		displayName: '幻想系列－波利大地'
	},
	'ra_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '伊达平原'
		},
		notifyEnter: true,
		displayName: '伊达平原'
	},
	'2@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限塔'
		},
		notifyEnter: true,
		displayName: '无限塔'
	},
	'3@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限塔'
		},
		notifyEnter: true,
		displayName: '无限塔'
	},
	'4@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限塔'
		},
		notifyEnter: true,
		displayName: '无限塔'
	},
	'prt_cas_q.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '星之宫殿',
			subTitle: '普隆德拉城堡'
		},
		notifyEnter: true,
		displayName: '普隆德拉星之宫殿'
	},
	'6@tower.rsw': {
		displayName: '无限塔（未知区域）'
	},
	'yuno_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '基尔·哈伊尔的小屋'
		},
		notifyEnter: true,
		displayName: '基尔·哈伊尔的小屋'
	},
	'juperos_02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '朱佩洛斯遗迹内部'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯遗迹内部'
	},
	'prt_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'1@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限塔'
		},
		notifyEnter: true,
		displayName: '无限塔'
	},
	'lhz_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '生命体研究所 1层'
		},
		notifyEnter: true,
		displayName: '生命体研究所 1层'
	},
	'ma_zif01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'bif_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '北部彩虹桥'
		},
		notifyEnter: true,
		displayName: '北部彩虹桥'
	},
	'jor_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '蛇神温暖之地 2层'
		},
		notifyEnter: true,
		displayName: '蛇神温暖之地 2层'
	},
	'gl_chyard_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '修道院墓地',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '修道院墓地'
	},
	'ecl_in04.rsw': {
		displayName: '艾可拉珠内部'
	},
	've_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维恩斯原野'
		},
		notifyEnter: true,
		displayName: '维恩斯原野'
	},
	'sec_in02.rsw': {
		displayName: '英灵殿内部'
	},
	'hunter_1-1.rsw': {
		displayName: '猎人公会'
	},
	'nif_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '斯凯灵顿，孤独村落',
			subTitle: '尼弗尔海姆'
		},
		notifyEnter: true,
		displayName: '尼弗尔海姆的斯凯灵顿孤独村落'
	},
	'que_god02.rsw': {
		displayName: '任务地图'
	},
	'ecl_tdun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '彩虹桥塔 2层'
		},
		notifyEnter: true,
		displayName: '彩虹桥塔 2层'
	},
	'thor_v02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '托尔火山迷宫 2层'
		},
		notifyEnter: true,
		displayName: '托尔火山迷宫 2层'
	},
	'bif_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '南部彩虹桥'
		},
		notifyEnter: true,
		displayName: '南部彩虹桥'
	},
	'1@advs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '欺诈别墅'
		},
		notifyEnter: true,
		displayName: '欺诈别墅'
	},
	'dicastes01.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '迪卡斯特斯',
			subTitle: '约顿海姆萨帕首都'
		},
		notifyEnter: true,
		displayName: '迪卡斯特斯，萨帕首都'
	},
	'brasilis.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '巴西利斯'
		},
		notifyEnter: true,
		displayName: '巴西利斯'
	},
	'1@oz.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '奥兹迷宫'
		},
		notifyEnter: true,
		displayName: '奥兹迷宫'
	},
	'abyss_04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下洞窟 4层',
			subTitle: '深渊湖'
		},
		notifyEnter: true,
		displayName: '深渊湖地下洞窟 4层'
	},
	'c_tower3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 3层',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 3层'
	},
	'bl_temple.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '样本环境－神殿',
			subTitle: '瓦尔蒙德生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈样本环境－神殿'
	},
	'pay_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'hu_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '塔纳托斯塔前'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔前'
	},
	'int_land03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '偏远岛屿'
		},
		notifyEnter: true,
		displayName: '偏远岛屿'
	},
	'1@uns.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '最后的房间'
		},
		notifyEnter: true,
		displayName: '最后的房间'
	},
	'1@20cn1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '峡谷探索'
		},
		notifyEnter: true,
		displayName: '峡谷探索'
	},
	'quiz_02.rsw': {
		displayName: '问答竞技场'
	},
	'int_land04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '遥远岛屿'
		},
		notifyEnter: true,
		displayName: '遥远岛屿'
	},
	'ice_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '拉赫冰洞 1F'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞 1F'
	},
	'2@nyr.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '心之仓库',
			subTitle: '塞斯鲁姆尼尔圣域'
		},
		notifyEnter: true,
		displayName: '塞斯鲁姆尼尔圣域心之仓库'
	},
	'1@nyr.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '塞斯鲁姆尼尔圣域花园'
		},
		notifyEnter: true,
		displayName: '塞斯鲁姆尼尔圣域花园'
	},
	'moc_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'pvp_n_1-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 四人房间'
		},
		notifyEnter: true,
		displayName: 'PvP：四人房间'
	},
	'prt_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'bl_grass.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '标本环境 - 草原',
			subTitle: '瓦尔蒙特生物圈'
		},
		notifyEnter: true,
		displayName: '生物圈标本环境 - 草原'
	},
	'ba_pw03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '第二发电厂'
		},
		notifyEnter: true,
		displayName: '第二发电厂'
	},
	'p_track01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '魔物赛跑竞技场'
		},
		notifyEnter: true,
		displayName: '魔物赛跑竞技场'
	},
	'ice_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '冰封记忆',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '冰封记忆'
	},
	'ice_dun04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '拉赫冰洞 - 封印空间'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞 - 封印空间'
	},
	'x_lhz.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '里希塔乐镇',
			subTitle: '次元彼端'
		},
		notifyEnter: true,
		displayName: '里希塔乐镇 - 次元彼端'
	},
	'jor_back1.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '冰封鳞片山丘'
		},
		notifyEnter: true,
		displayName: '冰封鳞片山丘'
	},
	'mjo_wst01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '妙勒尼地下洞窟'
		},
		notifyEnter: true,
		displayName: '妙勒尼地下洞窟'
	},
	've_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '维因斯原野'
		},
		notifyEnter: true,
		displayName: '维因斯原野'
	},
	'evt_bomb.rsw': {
		displayName: '迷宫活动'
	},
	'mjo_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '死坑 F1',
			subTitle: '妙勒尼山北部'
		},
		notifyEnter: true,
		displayName: '妙勒尼山死坑 F1'
	},
	'te_aldecas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '德弗洛蒂城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '德弗洛蒂城堡'
	},
	'rgsr_in.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '雷肯贝尔研究所'
		},
		notifyEnter: true,
		displayName: '雷肯贝尔研究所'
	},
	'1@twig.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '树枝的巢穴'
		},
		notifyEnter: true,
		displayName: '树枝的巢穴'
	},
	'1@ch_u.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '沉没之塔',
			subTitle: '旧无尽之塔侵蚀区'
		},
		notifyEnter: true,
		displayName: '沉没之塔'
	},
	'jor_root1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '蛇神之根 1F'
		},
		notifyEnter: true,
		displayName: '蛇神之根 1F'
	},
	'gld2_pay.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '远古之风',
			subTitle: '绿林湖深渊走廊'
		},
		notifyEnter: true,
		displayName: '深渊走廊：远古之风'
	},
	'tha_t10.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '悲伤之间',
			subTitle: '塔纳托斯塔上层'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层 - 悲伤之间'
	},
	'veins.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '维因斯',
			subTitle: '阿鲁纳佩尔兹峡谷村落'
		},
		notifyEnter: true,
		displayName: '维因斯，峡谷村落'
	},
	'alde_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 B3',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 B3'
	},
	'arug_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '赛尔城堡',
			subTitle: '瓦尔弗雷亚'
		},
		notifyEnter: true,
		displayName: '赛尔城堡'
	},
	'xmas_in.rsw': {
		displayName: '玩具工厂内部'
	},
	'1@face.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '脸虫巢穴'
		},
		notifyEnter: true,
		displayName: '脸虫巢穴'
	},
	'jor_sanct.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '神圣之根',
			subTitle: 'Rgan 隐匿处'
		},
		notifyEnter: true,
		displayName: '神圣之根'
	},
	'odin_past.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '古代奥丁神殿'
		},
		notifyEnter: true,
		displayName: '古代奥丁神殿'
	},
	'malangdo.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '马兰岛'
		},
		notifyEnter: true,
		displayName: '马兰岛'
	},
	'ma_zif08.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'in_sphinx4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '梦罗克斯芬克斯 B4',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '梦罗克斯芬克斯 B4'
	},
	'que_thor.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '托尔火山地下城'
		},
		notifyEnter: true,
		displayName: '托尔火山地下城'
	},
	'pvp_y_4-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 普隆德拉房间'
		},
		notifyEnter: true,
		displayName: 'PvP：普隆德拉房间'
	},
	'te_aldecas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'W 城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: 'W 城堡'
	},
	'bra_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '瀑布彼端',
			subTitle: '巴西利斯'
		},
		notifyEnter: true,
		displayName: '瀑布彼端'
	},
	'gld2_prt.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '战士之路',
			subTitle: '女武神领域深渊走廊'
		},
		notifyEnter: true,
		displayName: '深渊走廊：战士之路'
	},
	'1@begi.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '波利村'
		},
		notifyEnter: true,
		displayName: '波利村'
	},
	'prt_church.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '圣域'
		},
		notifyEnter: true,
		displayName: '圣域'
	},
	'1@whl.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '未处理荒野内部（1）',
			subTitle: '瓦尔蒙特飞机收藏馆 3 号'
		},
		notifyEnter: true,
		displayName: '未处理荒野内部（1）'
	},
	'iz_ac01_c.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: '克里阿图拉学院 F1'
		},
		notifyEnter: true,
		displayName: '克里阿图拉学院 F1'
	},
	'ama_test.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '桃太郎体验场'
		},
		notifyEnter: true,
		displayName: '桃太郎体验场'
	},
	'gefenia03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬尼亚'
		},
		notifyEnter: true,
		displayName: '吉芬尼亚'
	},
	'1@twas.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '分离圣域'
		},
		notifyEnter: true,
		displayName: '分离圣域'
	},
	'airplane_01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '飞艇'
		},
		notifyEnter: true,
		displayName: '飞艇'
	},
	'orcsdun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '兽人地下城 F1',
			subTitle: '兽人村落'
		},
		notifyEnter: true,
		displayName: '兽人地下城 F1'
	},
	'1@4tro.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '克瓦希尔的船'
		},
		notifyEnter: true,
		displayName: '克瓦希尔的船'
	},
	'e_tower.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '迷雾岛'
		},
		notifyEnter: true,
		displayName: '迷雾岛'
	},
	'gef_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬地下城 B3'
		},
		notifyEnter: true,
		displayName: '吉芬地下城 B3'
	},
	'spl_in01.rsw': {
		displayName: '斯普兰迪德原野指挥部内部'
	},
	'ayothaya.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '阿育王朝'
		},
		notifyEnter: true,
		displayName: '阿育王朝'
	},
	'hero_out1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '希尔瓦里昂',
			subTitle: '赫罗斯利亚'
		},
		notifyEnter: true,
		displayName: '赫罗斯利亚希尔瓦里昂'
	},
	'pvp_y_8-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 梦罗克房间'
		},
		notifyEnter: true,
		displayName: 'PvP：梦罗克房间'
	},
	'pvp_y_7-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 梦罗克房间'
		},
		notifyEnter: true,
		displayName: 'PvP：梦罗克房间'
	},
	'pvp_y_6-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 梦罗克房间'
		},
		notifyEnter: true,
		displayName: 'PvP：梦罗克房间'
	},
	'un_myst.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '地下隧道'
		},
		notifyEnter: true,
		displayName: '地下隧道'
	},
	'que_job01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '私人酒馆'
		},
		notifyEnter: true,
		displayName: 'Private Pub'
	},
	'pvp_y_4-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Morocc'
	},
	'yuno_fild07.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'El Mes Gorge',
			subTitle: 'Valley of Abyss'
		},
		notifyEnter: true,
		displayName: 'El Mes Gorge (Valley of Abyss)'
	},
	'new_2-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: 'Training Ground'
	},
	'pvp_y_3-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Morocc'
	},
	'moc_prydn1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Pyramid B1'
		},
		notifyEnter: true,
		displayName: 'Morocc Pyramid B1 - Nightmare'
	},
	'moc_pryd06.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid B2',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: 'Inside Pyramid B2'
	},
	'lou_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'The Royal Tomb'
		},
		notifyEnter: true,
		displayName: 'The Royal Tomb'
	},
	'pvp_y_2-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Morocc'
	},
	'mag_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Nogg Road F1'
		},
		notifyEnter: true,
		displayName: 'Nogg Road F1'
	},
	'pvp_y_6-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Alberta'
	},
	'pvp_y_5-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Alberta'
	},
	'iz_int.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: 'Stranded Passenger Ship'
	},
	'aldeg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Wuerzburg Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: 'Wuerzburg Castle'
	},
	'teg_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Underground Dungeon',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Guild Underground Dungeon'
	},
	'pvp_y_8-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'pvp_y_7-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'hero_in4.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Winter Garden',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: 'Herosria Winter Garden'
	},
	'ma_scene01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Bakonawa Lake',
			subTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: 'Bakonawa Lake'
	},
	'pvp_y_6-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'nif_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Collapsed Opera House',
			subTitle: 'Niflheim Dungeon - 2nd Floor'
		},
		notifyEnter: true,
		displayName: 'Niflheim Dungeon - Collapsed Opera House'
	},
	'pvp_y_5-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'iz_int04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: 'Stranded Passenger Ship'
	},
	'yuno_in04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Republic Library'
		},
		notifyEnter: true,
		displayName: 'Republic Library'
	},
	'ra_san01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary North Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: 'Rachel Temple Sanctuary North Area 1F'
	},
	'pvp_n_3-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : Four Room'
	},
	'dali.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Dimensional Rift'
		},
		notifyEnter: true,
		displayName: 'Dimensional Rift'
	},
	'pvp_y_1-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Payon'
	},
	'new_1-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: 'Training Ground'
	},
	'pvp_y_3-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Izlude'
	},
	'pvp_y_8-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Prontera'
	},
	'pvp_y_7-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Prontera'
	},
	'ice_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Rachel Ice Cave 3F'
		},
		notifyEnter: true,
		displayName: 'Rachel Ice Cave 3F'
	},
	'moc_pryd01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid F1',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: 'Inside Pyramid F1'
	},
	'beach_dun.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Karu, the West Cave',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: 'Karu, the West Cave'
	},
	'pvp_n_6-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Copass'
	},
	'pvp_n_5-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Copass'
	},
	'ba_go.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Water Map (Palmist battlefield)'
		},
		notifyEnter: true,
		displayName: 'Water Map (Palmist battlefield)'
	},
	'ba_lib.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memory Corridor',
			subTitle: 'Library'
		},
		notifyEnter: true,
		displayName: 'Library Memory Corridor'
	},
	'pvp_n_4-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Rock On'
	},
	'pvp_n_3-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Copass'
	},
	'alb2trea.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Alberta Island',
			subTitle: 'Alberta'
		},
		notifyEnter: true,
		displayName: 'Alberta Island'
	},
	'pvp_n_8-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Undercross'
	},
	'pvp_n_7-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Undercross'
	},
	'pvp_n_6-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Undercross'
	},
	'pvp_n_4-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Undercross'
	},
	'pvp_n_2-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Undercross'
	},
	'cmd_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Beacon Island, Pharos'
		},
		notifyEnter: true,
		displayName: 'Beacon Island, Pharos'
	},
	'pvp_n_7-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : Four Room'
	},
	'um_fild04.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Hoomga Jungle',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: 'Hoomga Jungle'
	},
	'pvp_n_6-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : Four Room'
	},
	'pvp_n_5-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : Four Room'
	},
	'pvp_n_8-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Rock On'
	},
	'payon.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Payon',
			subTitle: 'Mountain City in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: 'Payon Town'
	},
	'prt_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: 'Prontera Field'
	},
	'job3_rune01.rsw': {
		displayName: 'Inside of Rune Knight Templar'
	},
	'pvp_n_8-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Sandwich'
	},
	'moc_fild16.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: 'Sograt Desert'
	},
	'pvp_n_4-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Sandwich'
	},
	'pvp_n_2-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : Room Sandwich'
	},
	'jor_back2.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Plains'
		},
		notifyEnter: true,
		displayName: 'Frozen Scale Plains'
	},
	'memohall.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Dimensional Guardian Memorial'
		},
		notifyEnter: true,
		displayName: 'Dimensional Guardian Memorial'
	},
	'comodo.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '海底洞窟',
			subTitle: '卢恩-米德加尔特王国的海滨城镇'
		},
		notifyEnter: true,
		displayName: '海底洞窟，海滨城镇'
	},
	'knight_2-1.rsw': {
		displayName: '骑士团'
	},
	'que_qsch02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尼尔'
	},
	'pvp_y_4-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 斐扬房间'
		},
		notifyEnter: true,
		displayName: 'PvP：斐扬房间'
	},
	'lhz_que01.rsw': {
		displayName: '莱特森内部'
	},
	'mjolnir_07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼尔山南部'
		},
		notifyEnter: true,
		displayName: '妙勒尼尔山南部'
	},
	'new_3-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'ein_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '艾因布洛克原野'
		},
		notifyEnter: true,
		displayName: '艾因布洛克原野'
	},
	'gl_step.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '阶梯地下城',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆阶梯地下城'
	},
	'jor_safty2.rsw': {
		backgroundBmp: 'dungeon_s1',
		signName: {
			subTitle: '安全地点'
		},
		notifyEnter: true,
		displayName: '安全地点'
	},
	'gl_sew04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下水道 B4',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆地下水道 B4'
	},
	'ordeal_2-4.rsw': {
		displayName: '战斗试炼模式'
	},
	'um_in.rsw': {
		displayName: '乌巴拉内部'
	},
	'kh_rossi.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '罗西米尔宅邸'
		},
		notifyEnter: true,
		displayName: '罗西米尔宅邸'
	},
	'ein_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '艾因布洛克原野'
		},
		notifyEnter: true,
		displayName: '艾因布洛克原野'
	},
	'moc_fild22.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '次元裂隙',
			subTitle: '苏克拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠 - 次元裂隙'
	},
	'ordeal_3-1.rsw': {
		displayName: '战斗试炼模式'
	},
	'force_2-2.rsw': {
		displayName: '限时战斗'
	},
	'gl_church.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '修道院',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆修道院'
	},
	'gef_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'1@pump.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '下水道'
		},
		notifyEnter: true,
		displayName: '下水道'
	},
	'2@pump.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '下水道'
		},
		notifyEnter: true,
		displayName: '下水道'
	},
	'job3_guil02.rsw': {
		displayName: '旧仓库内部'
	},
	'umbala.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '乌巴拉',
			subTitle: '伍坦族村庄'
		},
		notifyEnter: true,
		displayName: '伍坦族村庄，乌巴拉'
	},
	'prt_are_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '等待室'
		},
		notifyEnter: true,
		displayName: '等待室'
	},
	'thana_step.rsw': {
		signName: {
			mainTitle: '塔纳托斯塔上层 - 楼梯'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔上层 - 楼梯'
	},
	'izlu2dun.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '贝尔兰岛',
			subTitle: '伊斯鲁得'
		},
		notifyEnter: true,
		displayName: '贝尔兰岛'
	},
	'izlude.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '伊斯鲁得',
			subTitle: '卢恩-米德加尔特王国'
		},
		notifyEnter: true,
		displayName: '伊斯鲁得，卫星城'
	},
	'payon_in02.rsw': {
		displayName: '斐扬内部'
	},
	'payon_in01.rsw': {
		displayName: '斐扬内部'
	},
	'pvp_n_3-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Rock On 房间'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'1@twbs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '分离圣域'
		},
		notifyEnter: true,
		displayName: '分离圣域'
	},
	'yuno.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '朱诺',
			subTitle: '施瓦茨瓦尔德共和国首都'
		},
		notifyEnter: true,
		displayName: '朱诺，施瓦茨瓦尔德共和国首都'
	},
	'morocc.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '梦罗克',
			subTitle: '卢恩-米德加尔特王国的沙漠城市'
		},
		notifyEnter: true,
		displayName: '梦罗克城'
	},
	'geffen_in.rsw': {
		displayName: '吉芬内部'
	},
	'gef_tower.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '吉芬塔',
			subTitle: '吉芬'
		},
		notifyEnter: true,
		displayName: '吉芬塔'
	},
	'pvp_n_1-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间 Copass'
		},
		notifyEnter: true,
		displayName: 'PvP：Copass 房间'
	},
	'gl_prison1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '地下监狱 B2',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆地下监狱 B2'
	},
	'1@sara.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '莎拉的记忆'
		},
		notifyEnter: true,
		displayName: '莎拉的记忆'
	},
	'yuno_in02.rsw': {
		displayName: '贤者城堡内部'
	},
	'ordeal_1-4.rsw': {
		displayName: '战斗试炼模式'
	},
	'hu_in01.rsw': {
		displayName: '胡戈尔内部'
	},
	'ordeal_3-3.rsw': {
		displayName: '战斗试炼模式'
	},
	'gef_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'abbey03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '诅咒修道院地下城 B3',
			subTitle: '无名岛'
		},
		notifyEnter: true,
		displayName: '诅咒修道院地下城 B3'
	},
	'abbey01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '诅咒修道院地下城 B1',
			subTitle: '无名岛'
		},
		notifyEnter: true,
		displayName: '诅咒修道院地下城 B1'
	},
	'ordeal_3-2.rsw': {
		displayName: '战斗试炼模式'
	},
	'gl_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '格拉斯特海姆最低洞窟 B2',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆最低洞窟 B2'
	},
	'ordeal_2-1.rsw': {
		displayName: '战斗试炼模式'
	},
	'ordeal_1-1.rsw': {
		displayName: '战斗试炼模式'
	},
	'pvp_y_8-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 伊斯鲁得房间'
		},
		notifyEnter: true,
		displayName: 'PvP：伊斯鲁得房间'
	},
	'lhz_dun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '生体实验研究所地下 4 楼'
		},
		notifyEnter: true,
		displayName: '生体实验研究所地下 4 楼'
	},
	'force_1-3.rsw': {
		displayName: '限时战斗'
	},
	'um_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '鲁鲁卡森林',
			subTitle: '乌巴拉'
		},
		notifyEnter: true,
		displayName: '鲁鲁卡森林'
	},
	'gl_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '格拉斯特海姆最低洞窟 B1',
			subTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆最低洞窟 B1'
	},
	'force_3-1.rsw': {
		displayName: '限时战斗'
	},
	'force_2-1.rsw': {
		displayName: '限时战斗'
	},
	'force_1-1.rsw': {
		displayName: '限时战斗'
	},
	'wizard_3-1.rsw': {
		displayName: '巫师学院'
	},
	'prt_mz03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '扭曲迷宫森林',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '扭曲迷宫森林'
	},
	'ba_pw02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '污水处理厂'
		},
		notifyEnter: true,
		displayName: '污水处理厂'
	},
	'wizard_1-1.rsw': {
		displayName: '巫师学院'
	},
	'kh_mansion.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '基尔·海伊尔宅邸'
		},
		notifyEnter: true,
		displayName: '基尔·海伊尔宅邸'
	},
	'sword_3-1.rsw': {
		displayName: '剑士测试大厅'
	},
	'in_orcs01.rsw': {
		displayName: '兽人村内部'
	},
	'int_land02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '遥远岛屿'
		},
		notifyEnter: true,
		displayName: '遥远岛屿'
	},
	'knight_1-1.rsw': {
		displayName: '骑士团'
	},
	'in_hunter.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '猎人公会'
		},
		notifyEnter: true,
		displayName: '猎人公会'
	},
	'hunter_3-1.rsw': {
		displayName: '猎人公会'
	},
	'1@slug.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '黏稠之海'
		},
		notifyEnter: true,
		displayName: '黏稠之海'
	},
	'hunter_2-1.rsw': {
		displayName: '猎人公会'
	},
	'um_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '异世界通道',
			subTitle: '乌巴拉'
		},
		notifyEnter: true,
		displayName: '异世界通道'
	},
	'nameless_in.rsw': {
		displayName: '无名岛内部'
	},
	'prt_sewb1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '下水道 F1',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉下水道 F1'
	},
	'prt_maze01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '迷宫森林 F1',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '迷宫森林 F1'
	},
	'lhz_d_n2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '邪念虚空'
		},
		notifyEnter: true,
		displayName: '邪念虚空'
	},
	'pay_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斐扬洞窟 F5',
			subTitle: '斐扬弓箭手村'
		},
		notifyEnter: true,
		displayName: '斐扬洞窟 F5'
	},
	'pay_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '斐扬洞窟 F3',
			subTitle: '斐扬弓箭手村'
		},
		notifyEnter: true,
		displayName: '斐扬洞窟 F3'
	},
	'mjo_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '死坑 2层',
			subTitle: '妙勒尼山北部'
		},
		notifyEnter: true,
		displayName: '妙勒尼山死坑 2层'
	},
	'moc_prydb1.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '盗贼公会',
			subTitle: '梦罗克'
		},
		notifyEnter: true,
		displayName: '盗贼公会'
	},
	'moc_pryd02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '金字塔内部 2层',
			subTitle: '梦罗克'
		},
		notifyEnter: true,
		displayName: '金字塔内部 2层'
	},
	'job_duncer.rsw': {
		displayName: '科摩多剧院'
	},
	'sp_cor.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '科尔',
			subTitle: '特殊边境区域'
		},
		notifyEnter: true,
		displayName: '特殊边境区域科尔'
	},
	'bat_c03.rsw': {
		notifyEnter: true,
		displayName: '米德加尔特战场'
	},
	'in_sphinx3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '梦罗克斯芬克斯 B3层',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '梦罗克斯芬克斯 B3层'
	},
	'iz_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '海底隧道 B4层',
			subTitle: '拜蓝岛'
		},
		notifyEnter: true,
		displayName: '海底隧道 B4层'
	},
	'moc_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'p_track02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '怪物赛跑竞技场'
		},
		notifyEnter: true,
		displayName: '怪物赛跑竞技场'
	},
	'1@air2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '飞艇'
		},
		notifyEnter: true,
		displayName: '飞艇'
	},
	'yuno_in01.rsw': {
		displayName: '朱诺内部'
	},
	'gef_dun00.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬迷宫 B1层'
		},
		notifyEnter: true,
		displayName: '吉芬迷宫 B1层'
	},
	'anthell02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '蚂蚁地狱迷宫 2层',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '蚂蚁地狱迷宫 2层'
	},
	'new_4-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'1@pop2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '回家的路',
			subTitle: '白昼半月'
		},
		notifyEnter: true,
		displayName: '回家的路'
	},
	'dic_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '卡米达隧道',
			subTitle: '约顿海姆'
		},
		notifyEnter: true,
		displayName: '卡米达隧道'
	},
	'new_3-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'force_3-3.rsw': {
		displayName: '限时战斗'
	},
	'um_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '呼姆加森林',
			subTitle: '乌姆巴拉'
		},
		notifyEnter: true,
		displayName: '呼姆加森林'
	},
	'new_3-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'lou_in02.rsw': {
		displayName: '洛阳内部'
	},
	'pvp_n_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 等候室'
		},
		notifyEnter: true,
		displayName: 'PvP：等候室'
	},
	'pay_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'cmd_fild04.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '可可莫海滩',
			subTitle: '科摩多'
		},
		notifyEnter: true,
		displayName: '可可莫海滩'
	},
	'ayo_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '阿育他亚原野'
		},
		notifyEnter: true,
		displayName: '阿育他亚原野'
	},
	'yuno_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '朱诺原野'
		},
		notifyEnter: true,
		displayName: '朱诺原野'
	},
	'tur_d04_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '阴郁乌龟宫殿',
			subTitle: '幻境'
		},
		notifyEnter: true,
		displayName: '阴郁乌龟宫殿'
	},
	'pay_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'bat_b02.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '弗拉维安',
			subTitle: '战场'
		},
		notifyEnter: true,
		displayName: '弗拉维安'
	},
	'pvp_n_5-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（三明治）'
		},
		notifyEnter: true,
		displayName: 'PvP：三明治房间'
	},
	'aldeg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '新天鹅堡',
			subTitle: '鲁因'
		},
		notifyEnter: true,
		displayName: '新天鹅堡'
	},
	'ba_maison.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '瓦尔蒙德宅邸庭院'
		},
		notifyEnter: true,
		displayName: '瓦尔蒙德宅邸庭院'
	},
	'moc_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'cmd_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '圣达曼要塞（东）'
		},
		notifyEnter: true,
		displayName: '圣达曼要塞（东）'
	},
	'moc_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'moc_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'jupe_ele_r.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '朱佩洛斯电梯房'
		},
		notifyEnter: true,
		displayName: '朱佩洛斯电梯房'
	},
	'moc_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏格拉特沙漠'
	},
	'x_prt.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '普隆德拉',
			subTitle: '异次元'
		},
		notifyEnter: true,
		displayName: '普隆德拉－异次元'
	},
	'c_tower1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '钟楼 1层',
			subTitle: '艾尔帕兰'
		},
		notifyEnter: true,
		displayName: '钟楼 1层'
	},
	'priest_3-1.rsw': {
		displayName: '圣所'
	},
	'gef_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'gef_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'gef_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'gef_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '吉芬原野'
		},
		notifyEnter: true,
		displayName: '吉芬原野'
	},
	'prt_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'pvp_n_2-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 房间（Rock On）'
		},
		notifyEnter: true,
		displayName: 'PvP：Rock On 房间'
	},
	'prt_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'prt_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'e_hugel.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '被入侵的胡格尔'
		},
		notifyEnter: true,
		displayName: '被入侵的胡格尔'
	},
	'ein_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '艾音布罗克矿山 1层'
		},
		notifyEnter: true,
		displayName: '艾音布罗克矿山 1层'
	},
	'prt_fild00.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉原野'
	},
	'ba_bath.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '大型浴池冥想处'
		},
		notifyEnter: true,
		displayName: '大型浴池冥想处'
	},
	'mjolnir_02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山北部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山北部区域'
	},
	'x_ra.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '拉赫',
			subTitle: '异次元'
		},
		notifyEnter: true,
		displayName: '拉赫－异次元'
	},
	'mjolnir_11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山南部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山南部区域'
	},
	'mjolnir_09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山南麓'
		},
		notifyEnter: true,
		displayName: '妙勒尼山南麓'
	},
	'mjolnir_08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山南部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山南部区域'
	},
	'mjolnir_03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '妙勒尼山北部区域'
		},
		notifyEnter: true,
		displayName: '妙勒尼山北部区域'
	},
	'pvp_n_8-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 四人房'
		},
		notifyEnter: true,
		displayName: 'PvP：四人房'
	},
	'cmd_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '圣达曼要塞（西）'
		},
		notifyEnter: true,
		displayName: '圣达曼要塞（西）'
	},
	'pay_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'cmd_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '帕普奇查森林',
			subTitle: '科摩多'
		},
		notifyEnter: true,
		displayName: '帕普奇查森林'
	},
	'beach_dun2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '卢安达北洞窟',
			subTitle: '可可岛'
		},
		notifyEnter: true,
		displayName: '卢安达北洞窟'
	},
	'1@gl_he.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '污染次元',
			subTitle: '克雷斯特汉姆'
		},
		notifyEnter: true,
		displayName: '污染次元'
	},
	'pvp_y_6-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 普隆德拉房间'
		},
		notifyEnter: true,
		displayName: 'PvP：普隆德拉房间'
	},
	'cmd_in02.rsw': {
		displayName: '可可岛内部'
	},
	'quiz_01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '问答革命'
		},
		notifyEnter: true,
		displayName: '问答革命'
	},
	'guild_vs1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场'
		},
		notifyEnter: true,
		displayName: '公会竞技场'
	},
	'guild_vs4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场'
		},
		notifyEnter: true,
		displayName: '公会竞技场'
	},
	'guild_vs5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '公会竞技场'
		},
		notifyEnter: true,
		displayName: '公会竞技场'
	},
	'rebel_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '克拉纳·内米耶里'
		},
		notifyEnter: true,
		displayName: '克拉纳·内米耶里'
	},
	'tur_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '海龟村'
		},
		notifyEnter: true,
		displayName: '海龟村'
	},
	'tur_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '海龟岛地下城'
		},
		notifyEnter: true,
		displayName: '海龟岛地下城'
	},
	'thor_v01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '托尔火山地下城 1F'
		},
		notifyEnter: true,
		displayName: '托尔火山地下城 1F'
	},
	'tur_dun01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '海龟岛'
		},
		notifyEnter: true,
		displayName: '海龟岛'
	},
	'lighthalzen.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '里希塔乐镇',
			subTitle: '施瓦茨瓦尔德共和国繁荣城邦'
		},
		notifyEnter: true,
		displayName: '里希塔乐镇，繁荣城邦'
	},
	'bat_a02.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '提拉谷',
			subTitle: '战场'
		},
		notifyEnter: true,
		displayName: '提拉谷'
	},
	'prtg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '克里姆希尔德城堡',
			subTitle: '女武神领域'
		},
		notifyEnter: true,
		displayName: '克里姆希尔德城堡'
	},
	'lhz_dun_n.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '陨落者之墓'
		},
		notifyEnter: true,
		displayName: '陨落者之墓'
	},
	'1@mjo2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '遗忘洞窟',
			subTitle: '妙勒尼山脉'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 - 遗忘洞窟'
	},
	'aldeg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '霍恩施万高城堡',
			subTitle: '卢因'
		},
		notifyEnter: true,
		displayName: '霍恩施万高城堡'
	},
	'aldeg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '纽伦堡城堡',
			subTitle: '卢因'
		},
		notifyEnter: true,
		displayName: '纽伦堡城堡'
	},
	'pvp_y_1-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'dew_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '喀拉喀托火山岛',
			subTitle: '杜瓦塔'
		},
		notifyEnter: true,
		displayName: '喀拉喀托火山岛'
	},
	'payg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '圣坛城堡',
			subTitle: '绿林湖'
		},
		notifyEnter: true,
		displayName: '圣坛城堡'
	},
	'job_hunte.rsw': {
		displayName: '猎人转职场'
	},
	'gld_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城',
			subTitle: '巴尔德'
		},
		notifyEnter: true,
		displayName: '巴尔德公会地下城'
	},
	'ba_chess.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '将杀'
		},
		notifyEnter: true,
		displayName: '将杀'
	},
	'gld_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城',
			subTitle: '女武神'
		},
		notifyEnter: true,
		displayName: '女武神公会地下城'
	},
	'morocc_in.rsw': {
		displayName: '梦罗克内部'
	},
	'sp_rudus.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '鲁杜斯 F1',
			subTitle: '实验废弃物处理场'
		},
		notifyEnter: true,
		displayName: '鲁杜斯，实验废弃物处理场 F1'
	},
	'pvp_y_1-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 梦罗克房间'
		},
		notifyEnter: true,
		displayName: 'PvP：梦罗克房间'
	},
	'in_rogue.rsw': {
		displayName: '盗贼公会内部'
	},
	'monk_test.rsw': {
		displayName: '圣卡皮托利纳修道院'
	},
	'moro_cav.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '火焰洞窟'
		},
		notifyEnter: true,
		displayName: '火焰洞窟'
	},
	'in_sphinx5.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '梦罗克斯芬克斯 B5',
			subTitle: '苏格拉特沙漠'
		},
		notifyEnter: true,
		displayName: '梦罗克斯芬克斯 B5'
	},
	'pvp_n_1-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 三明治房间'
		},
		notifyEnter: true,
		displayName: 'PvP：三明治房间'
	},
	'gl_in01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '克雷斯特汉姆内部',
			subTitle: '克雷斯特汉姆'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆内部'
	},
	'sec_pri.rsw': {
		displayName: '冥想之间（英灵殿监狱）'
	},
	'tha_t02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '博物馆',
			subTitle: '塔纳托斯塔'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔博物馆'
	},
	'ecl_in02.rsw': {
		displayName: '艾可拉珠内部'
	},
	'ama_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '榻榻米迷宫'
		},
		notifyEnter: true,
		displayName: '榻榻米迷宫'
	},
	'gon_in.rsw': {
		displayName: '昆仑内部'
	},
	'gon_fild01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '昆仑原野'
		},
		notifyEnter: true,
		displayName: '昆仑原野'
	},
	'gon_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '桃花乡',
			subTitle: '昆仑'
		},
		notifyEnter: true,
		displayName: '桃花乡'
	},
	'gon_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '西王母神殿',
			subTitle: '昆仑'
		},
		notifyEnter: true,
		displayName: '西王母神殿'
	},
	'prt_are01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '竞技场'
		},
		notifyEnter: true,
		displayName: '竞技场'
	},
	'um_fild03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '卡拉拉沼泽',
			subTitle: '乌帕拉'
		},
		notifyEnter: true,
		displayName: '卡拉拉沼泽'
	},
	'thana_scene01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '塔纳托斯塔入口'
		},
		notifyEnter: true,
		displayName: '塔纳托斯塔入口'
	},
	'ama_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '天津町原野'
		},
		notifyEnter: true,
		displayName: '天津町原野'
	},
	'prt_sewb2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '下水道 F2',
			subTitle: '普隆德拉原野'
		},
		notifyEnter: true,
		displayName: '普隆德拉下水道 F2'
	},
	'nif_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '山谷',
			subTitle: '尼芙菲姆'
		},
		notifyEnter: true,
		displayName: '尼芙菲姆山谷'
	},
	'nif_in.rsw': {
		displayName: '尼芙菲姆内部'
	},
	'valkyrie.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: '女武神大厅',
			subTitle: '荣誉大厅'
		},
		notifyEnter: true,
		displayName: '女武神大厅，荣誉大厅'
	},
	'y_airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '朱诺机场'
		},
		notifyEnter: true,
		displayName: '朱诺机场'
	},
	'lou_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '洛阳原野'
		},
		notifyEnter: true,
		displayName: '洛阳原野'
	},
	'hu_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '胡格尔原野'
		},
		notifyEnter: true,
		displayName: '胡格尔原野'
	},
	'lou_in01.rsw': {
		displayName: '洛阳内部'
	},
	'new_4-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '训练场'
		},
		notifyEnter: true,
		displayName: '训练场'
	},
	'jawaii_in.rsw': {
		displayName: '爪哇伊内部'
	},
	'gefenia01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬尼亚'
		},
		notifyEnter: true,
		displayName: '吉芬尼亚'
	},
	'gefenia04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬尼亚'
		},
		notifyEnter: true,
		displayName: '吉芬尼亚'
	},
	'que_god01.rsw': {
		displayName: '任务地图'
	},
	'ayo_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '阿育王朝原野'
		},
		notifyEnter: true,
		displayName: '阿育王朝原野'
	},
	'ayo_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '古代神殿迷宫'
		},
		notifyEnter: true,
		displayName: '古代神殿迷宫'
	},
	'pay_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '月光噩梦',
			subTitle: '幻影'
		},
		notifyEnter: true,
		displayName: '月光噩梦'
	},
	'yuno_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '基尔·哈伊尔学院'
		},
		notifyEnter: true,
		displayName: '基尔·哈伊尔学院'
	},
	'pay_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'um_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '木匠商店',
			subTitle: '乌帕拉'
		},
		notifyEnter: true,
		displayName: "Carpenter's Shop in the Tree"
	},
	'turbo_n_4.rsw': {
		displayName: 'Turbo Track Stadium'
	},
	'einbroch.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Einbroch',
			subTitle: 'City of Steel in the Schwartzwald Republic'
		},
		notifyEnter: true,
		displayName: 'Einbroch, the City of Steel'
	},
	'ein_in01.rsw': {
		displayName: 'Inside Einbroch'
	},
	'airplane.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Airship'
		},
		notifyEnter: true,
		displayName: 'Airship'
	},
	'job_star.rsw': {
		displayName: 'The Sun, the Moon and the Stars'
	},
	'ein_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: 'Einbroch Field'
	},
	'prt_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: 'Prontera Field'
	},
	'ba_lost.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Lost Farm Valley'
		},
		notifyEnter: true,
		displayName: 'Lost Farm Valley'
	},
	'pvp_y_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Waiting Room'
		},
		notifyEnter: true,
		displayName: 'PvP : Waiting Room'
	},
	'bat_c01.rsw': {
		notifyEnter: true,
		displayName: 'Krieger von Midgard'
	},
	'lhz_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Lighthalzen Field'
		},
		notifyEnter: true,
		displayName: 'Lighthalzen Field'
	},
	'hero_ent2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "2nd Hero's Gateway",
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: "Herosria 2nd Hero's Gateway"
	},
	'job3_guil03.rsw': {
		displayName: 'Isolated mansion'
	},
	'yuno_pre.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Schwartzwald Government Buildings'
		},
		notifyEnter: true,
		displayName: 'Schwartzwald Government Buildings'
	},
	'lhz_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory F3'
		},
		notifyEnter: true,
		displayName: 'Somatology Laboratory F3'
	},
	'lhz_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory F2'
		},
		notifyEnter: true,
		displayName: 'Somatology Laboratory F2'
	},
	'jupe_ele.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos Elevator'
		},
		notifyEnter: true,
		displayName: 'Juperos Elevator'
	},
	'ver_tunn.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Tunnel Outskirts',
			subTitle: 'Verus'
		},
		notifyEnter: true,
		displayName: 'Verus - Tunnel Outskirts'
	},
	'jupe_area1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos, Restricted Zone'
		},
		notifyEnter: true,
		displayName: 'Juperos, Restricted Zone'
	},
	'juperos_01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Outside of the Juperos Ruins'
		},
		notifyEnter: true,
		displayName: 'Outside of the Juperos Ruins'
	},
	'odin_tem01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Odin's Temple West Area"
		},
		notifyEnter: true,
		displayName: "Odin's Temple West Area"
	},
	'tha_t12.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Hatred',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: 'Thanatos Tower Upper Level - Room of Hatred'
	},
	'gld2_ald.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Tears of Hero',
			subTitle: 'Louis Abyss Corridor'
		},
		notifyEnter: true,
		displayName: 'Corridor of the Abyss: Tears of Hero'
	},
	'1@pop1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Pope's Office",
			subTitle: 'Half Moon in the Daylight'
		},
		notifyEnter: true,
		displayName: "Pope's Office"
	},
	'tha_t01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Museum Entrance',
			subTitle: 'Thanatos Tower'
		},
		notifyEnter: true,
		displayName: 'Thanatos Tower Museum Entrance'
	},
	'abyss_03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 3F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: 'Abyss Lake Underground Cave 3F'
	},
	'abyss_01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 1F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: 'Abyss Lake Underground Cave 1F'
	},
	'ba_2whs01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Upper Floor of Tartaros Storage'
		},
		notifyEnter: true,
		displayName: 'Upper Floor of Tartaros Storage'
	},
	'mal_in02.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Inside the Ship',
			subTitle: 'Malangdo'
		},
		notifyEnter: true,
		displayName: 'Inside the Ship'
	},
	'auction_01.rsw': {
		displayName: 'Auction Hall'
	},
	'hero_out2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Lacusarium',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: 'Herosria Lacusarium'
	},
	'1@crd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Volcano Island Corodo'
		},
		notifyEnter: true,
		displayName: 'Volcano Island Corodo'
	},
	'kh_vila.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Kiel Hyre's Cottage"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Cottage"
	},
	'kh_kiehl01.rsw': {
		displayName: "Kiel's Room"
	},
	'ein_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: 'Einbroch Field'
	},
	'ein_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: 'Einbroch Field'
	},
	'jupe_cave.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos Dungeon Entrance'
		},
		notifyEnter: true,
		displayName: 'Juperos Dungeon Entrance'
	},
	'arug_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Arunafeltz'
		},
		notifyEnter: true,
		displayName: 'Arunafeltz Guild Dungeon'
	},
	'iz_dun00.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B1',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: 'Undersea Tunnel B1'
	},
	'prt_lib.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Memorial of Royal Family',
			subTitle: 'Prontera Royal Palace'
		},
		notifyEnter: true,
		displayName: 'Memorial of Royal Family'
	},
	'hugel.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Hugel',
			subTitle: 'Quaint Garden Village'
		},
		notifyEnter: true,
		displayName: 'Hugel, the Quaint Garden Village'
	},
	'ra_san03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary East Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: 'Rachel Temple Sanctuary East Area 1F'
	},
	'1@glast.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Past Glastheim'
		},
		notifyEnter: true,
		displayName: 'Past Glastheim'
	},
	'ra_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Audumla Grassland'
		},
		notifyEnter: true,
		displayName: 'Audumla Grassland'
	},
	'ra_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Od Canyon'
		},
		notifyEnter: true,
		displayName: 'Od Canyon'
	},
	'bossnia_01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: 'Bossnia'
	},
	'1@iwp.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Hill'
		},
		notifyEnter: true,
		displayName: 'Frozen Scale Hill'
	},
	'ra_temple.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Sesilmir',
			subTitle: "Freya's Grand Temple"
		},
		notifyEnter: true,
		displayName: "Freya's Grand Temple (Sesilmir)"
	},
	'int_land01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'ra_in01.rsw': {
		displayName: 'Inside Rachel'
	},
	'grademk.rsw': {
		backgroundBmp: 'village_s1',
		signName: {
			subTitle: 'Grade Enhancer'
		},
		notifyEnter: true,
		displayName: 'Grade Enhancer'
	},
	'1@tnm2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Demon's Tower - Top floor"
		},
		notifyEnter: true,
		displayName: "Demon's Tower - Top floor"
	},
	'turbo_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Waiting Room'
		},
		notifyEnter: true,
		displayName: 'Waiting Room'
	},
	'bossnia_03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: 'Bossnia'
	},
	'1@ma_c.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Buwaya Cave'
		},
		notifyEnter: true,
		displayName: 'Buwaya Cave'
	},
	'schg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Himinn Castle',
			subTitle: 'Nidhoggur'
		},
		notifyEnter: true,
		displayName: 'Himinn Castle'
	},
	'mosk_dun03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Dremuci Forest',
			subTitle: 'Moscovia'
		},
		notifyEnter: true,
		displayName: 'Dremuci Forest'
	},
	'mosk_dun01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Les Forest'
		},
		notifyEnter: true,
		displayName: 'Les Forest'
	},
	'te_prt_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Gloria',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Gloria'
	},
	'que_qaru03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: 'Fallacious Okolnir'
	},
	'que_qsch04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: 'Fallacious Okolnir'
	},
	'dic_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Bottom of Kamidal Mountain',
			subTitle: 'Jotunheim'
		},
		notifyEnter: true,
		displayName: 'Bottom of Kamidal Mountain'
	},
	'te_aldecas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Sorin Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Sorin Castle'
	},
	'que_qsch03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: 'Fallacious Okolnir'
	},
	'te_aldecas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '贝尼特城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '贝尼特城堡'
	},
	'moc_fild17.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '苏克拉特沙漠'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'5@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '无限塔'
		},
		notifyEnter: true,
		displayName: '无限塔'
	},
	'que_dan02.rsw': {
		displayName: '朱诺废弃房屋内部'
	},
	'jor_dun03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '蛇巢内部'
		},
		notifyEnter: true,
		displayName: '蛇巢内部'
	},
	'spl_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斯普兰迪德原野'
		},
		notifyEnter: true,
		displayName: '斯普兰迪德原野'
	},
	'spl_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斯普兰迪德原野'
		},
		notifyEnter: true,
		displayName: '斯普兰迪德原野'
	},
	'mid_campin.rsw': {
		displayName: '米德加尔特远征营地内部'
	},
	'spl_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斯普兰迪德原野'
		},
		notifyEnter: true,
		displayName: '斯普兰迪德原野'
	},
	'splendide.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '斯普兰迪德',
			subTitle: '约顿海姆拉比基地'
		},
		notifyEnter: true,
		displayName: '斯普兰迪德，拉比基地'
	},
	'job3_war02.rsw': {
		displayName: '妖术师转职测试房间'
	},
	'job3_war01.rsw': {
		displayName: '妖术师转职测试房间'
	},
	'1@def02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '天空',
			subTitle: '波利地下城'
		},
		notifyEnter: true,
		displayName: '波利地下城 - 天空'
	},
	'glast_01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆'
	},
	'jor_ab02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '废弃矿坑 2 楼'
		},
		notifyEnter: true,
		displayName: '废弃矿坑 2 楼'
	},
	'gld_dun02_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '公会地下城 F2',
			subTitle: '路易莎'
		},
		notifyEnter: true,
		displayName: '路易莎地下城 2F'
	},
	'mora.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '莫拉',
			subTitle: '彩虹桥抽奖村'
		},
		notifyEnter: true,
		displayName: '抽奖村莫拉'
	},
	'payg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '圣影城堡',
			subTitle: '绿林湖'
		},
		notifyEnter: true,
		displayName: '圣影城堡'
	},
	'que_house_s.rsw': {
		displayName: '奇怪的房子'
	},
	'iz_dun05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '海底隧道 B6',
			subTitle: '伊斯鲁得'
		},
		notifyEnter: true,
		displayName: '海底隧道 B6'
	},
	'que_ng.rsw': {
		displayName: '未知地点'
	},
	'que_lhz.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '生体实验研究所地下 4 楼'
		},
		notifyEnter: true,
		displayName: '生体实验研究所地下 4 楼'
	},
	'gld2_gef.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '死者之山',
			subTitle: '布里托尼亚深渊走廊'
		},
		notifyEnter: true,
		displayName: '深渊走廊：死者之山'
	},
	'bra_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '巴西利斯原野'
		},
		notifyEnter: true,
		displayName: '巴西利斯原野'
	},
	'job_ko.rsw': {
		displayName: '隐藏地点'
	},
	'ma_zif04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: '吉普尼'
		},
		notifyEnter: true,
		displayName: '吉普尼内部'
	},
	'que_avan01.rsw': {
		displayName: '阿凡特的实验室'
	},
	'ecl_tdun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '彩虹桥塔 4F'
		},
		notifyEnter: true,
		displayName: '彩虹桥塔 4F'
	},
	'rachel.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: '拉赫',
			subTitle: '阿鲁纳佩尔兹学术国首都'
		},
		notifyEnter: true,
		displayName: '拉赫，阿鲁纳佩尔兹学术国首都'
	},
	'job3_rang01.rsw': {
		displayName: '游侠转职等待室'
	},
	'moc_prydn2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '金字塔 B2'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 B2 - 梦魇'
	},
	'iz_ng01.rsw': {
		displayName: '忍者教程地图'
	},
	'que_qsch01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '虚假的奥克尼尔'
		},
		notifyEnter: true,
		displayName: '虚假的奥克尼尔'
	},
	'te_aldecas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: '格拉里斯城堡',
			subTitle: '卢恩-米德加尔特'
		},
		notifyEnter: true,
		displayName: '卢恩-米德加尔特'
	},
	'mosk_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: '鲸鱼岛',
			subTitle: '莫斯科比亚'
		},
		notifyEnter: true,
		displayName: '鲸鱼岛'
	},
	'ecl_in03.rsw': {
		displayName: '艾可拉斯室内'
	},
	'1@ecl.rsw': {
		displayName: '艾可拉斯内部'
	},
	'1@xm_d.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '恐怖玩具工厂'
		},
		notifyEnter: true,
		displayName: '恐怖玩具工厂'
	},
	'1@dth2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '生物岛'
		},
		notifyEnter: true,
		displayName: '生物岛'
	},
	'moro_vol.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '火焰盆地'
		},
		notifyEnter: true,
		displayName: '火焰盆地'
	},
	'ver_eju.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '东部遗迹',
			subTitle: '朱佩罗斯'
		},
		notifyEnter: true,
		displayName: '朱佩罗斯东部遗迹'
	},
	'1@lab.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '中央实验室'
		},
		notifyEnter: true,
		displayName: '中央实验室'
	},
	'prt_pri00.rsw': {
		displayName: '普隆德拉监狱'
	},
	'job4_tro.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: '空荡的卡瓦希尔船'
		},
		notifyEnter: true,
		displayName: '空荡的卡瓦希尔船'
	},
	'pvp_y_3-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP 艾尔贝塔房间'
		},
		notifyEnter: true,
		displayName: 'PvP：艾尔贝塔房间'
	},
	'tur_dun06.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '地下沼泽区域'
		},
		notifyEnter: true,
		displayName: '地下沼泽区域'
	},
	'1@gl_k2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F1',
			subTitle: '旧格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '旧格拉斯特海姆骑士团 F1'
	},
	'1@gl_prq.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '格拉斯特海姆的陨落'
		},
		notifyEnter: true,
		displayName: '格拉斯特海姆的陨落'
	},
	'pay_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '斐扬森林'
		},
		notifyEnter: true,
		displayName: '斐扬森林'
	},
	'1@gl_kh.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F1',
			subTitle: '旧格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '旧格拉斯特海姆骑士团 F2'
	},
	'2@gl_kh.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '骑士团 F2',
			subTitle: '旧格拉斯特海姆'
		},
		notifyEnter: true,
		displayName: '旧格拉斯特海姆骑士团 F2'
	},
	'1@sthb.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '空中要塞 - 内部'
		},
		notifyEnter: true,
		displayName: '空中要塞 - 内部'
	},
	'sp_rudus4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '鲁杜斯 F4',
			subTitle: '实验废弃物处理区'
		},
		notifyEnter: true,
		displayName: '鲁杜斯，实验废弃物处理区 F4'
	},
	'1@ge_sn.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '吉芬夜间竞技场'
		},
		notifyEnter: true,
		displayName: '吉芬夜间竞技场'
	},
	'gw_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: '灰狼森林'
		},
		notifyEnter: true,
		displayName: '灰狼森林'
	},
	'moc_para01.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: '乐园'
		},
		notifyEnter: true,
		displayName: '梦罗克伊甸园集团内部'
	},
	'que_dan01.rsw': {
		displayName: '胡戈尔原野'
	}
};

export default MapInfo;
