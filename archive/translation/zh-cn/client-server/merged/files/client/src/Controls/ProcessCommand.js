/**
 * Controls/ProcessCommand.js - extended from ChatBox
 *
 * Command in chatbox handler
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import DB from 'DB/DBManager.js';
import Emotions from 'DB/Emotions.js';
import BGM from 'Audio/BGM.js';
import Sound from 'Audio/SoundManager.js';
import Session from 'Engine/SessionStorage.js';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import Network from 'Network/NetworkManager.js';
import ControlPreferences from 'Preferences/Controls.js';
import UIPreferences from 'Preferences/UI.js';
import AudioPreferences from 'Preferences/Audio.js';
import MapPreferences from 'Preferences/Map.js';
import CameraPreferences from 'Preferences/Camera.js';
import Renderer from 'Renderer/Renderer.js';
import Configs from 'Core/Configs.js';
import EffectConst from 'DB/Effects/EffectConst.js';
import StatusState from 'DB/Status/StatusState.js';
import EntityManager from 'Renderer/EntityManager.js';
import EffectManager from 'Renderer/EffectManager.js';
import MapRenderer from 'Renderer/MapRenderer.js';
import ChatRoomCreate from 'UI/Components/ChatRoomCreate/ChatRoomCreate.js';
import ChatRoom from 'UI/Components/ChatRoom/ChatRoom.js';
import Group from 'Engine/MapEngine/Group.js';
import Friends from 'Engine/MapEngine/Friends.js';
import Guild from 'Engine/MapEngine/Guild.js';
import HomunInformations from 'UI/Components/HomunInformations/HomunInformations.js';
import MercenaryInformations from 'UI/Components/MercenaryInformations/MercenaryInformations.js';
import CaptchaUpload from 'UI/Components/Captcha/CaptchaUpload.js';
import CaptchaSelector from 'UI/Components/Captcha/CaptchaSelector.js';
import SnowWeather from 'Renderer/Effects/SnowWeather.js';
import RainWeather from 'Renderer/Effects/RainWeather.js';
import SakuraWeatherEffect from 'Renderer/Effects/SakuraWeatherEffect.js';
import PokJukWeatherEffect from 'Renderer/Effects/PokJukWeatherEffect.js';
import CloudWeatherEffect from 'Renderer/Effects/CloudWeatherEffect.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import Navigation from 'UI/Components/Navigation/Navigation.js';
import RankingTypes from 'DB/Jobs/RankingTypes.js';

let aliases = {};

const CommandStore = {
	sound: {
		description: '切换音效播放',
		callback: function () {
			this.addText(DB.getMessage(27 + AudioPreferences.Sound.play), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			AudioPreferences.Sound.play = !AudioPreferences.Sound.play;
			AudioPreferences.save();
			if (AudioPreferences.Sound.play) {
				Sound.stop();
			}
		}
	},
	bgm: {
		description: '切换背景音乐播放',
		callback: function () {
			this.addText(DB.getMessage(31 + AudioPreferences.BGM.play), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			AudioPreferences.BGM.play = !AudioPreferences.BGM.play;
			AudioPreferences.save();

			if (AudioPreferences.BGM.play) {
				BGM.play(BGM.filename);
			} else {
				BGM.stop();
			}
			return;
		}
	},
	effect: {
		description: '切换除基础图形效果外其他效果的显示',
		callback: function () {
			this.addText(DB.getMessage(23 + MapPreferences.effect), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.effect = !MapPreferences.effect;
			MapPreferences.save();
			return;
		}
	},
	mineffect: {
		description: '启用较低画质效果。此命令对巫师的范围技能无效。',
		callback: function () {
			this.addText(DB.getMessage(687 + MapPreferences.mineffect), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.mineffect = !MapPreferences.mineffect;
			MapPreferences.save();
			return;
		}
	},
	miss: {
		description: '切换“未命中”动画显示',
		callback: function () {
			this.addText(DB.getMessage(317 + MapPreferences.miss), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.miss = !MapPreferences.miss;
			MapPreferences.save();
			return;
		}
	},
	aura: {
		description: '最小化 99 级和 175 级角色的光环效果',
		callback: function () {
			const isSimplified = MapPreferences.aura > 1;
			this.addText(DB.getMessage(711 + isSimplified), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.aura = isSimplified ? 1 : 2;
			MapPreferences.save();

			EntityManager.forEach(function (entity) {
				entity.aura.load(EffectManager);
			});
			return;
		}
	},
	aura2: {
		description: '禁用 99 级和 175 级角色的光环效果',
		callback: function () {
			this.addText(
				DB.getMessage(
					2994 + MapPreferences.aura,
					MapPreferences.aura ? '光环效果已关闭' : '光环效果已开启' // default text if not in DB msgstringtable
				),
				this.TYPE.INFO,
				this.FILTER.PUBLIC_LOG
			);
			MapPreferences.aura = MapPreferences.aura ? 0 : 1;
			MapPreferences.save();

			EntityManager.forEach(function (entity) {
				entity.aura.load(EffectManager);
			});
			return;
		}
	},
	showname: {
		description: '恢复原始字体',
		callback: function () {
			this.addText(DB.getMessage(722 + MapPreferences.showname), this.TYPE.INFO);
			MapPreferences.showname = !MapPreferences.showname;
			MapPreferences.save();

			// update all display names
			EntityManager.forEach(function (entity) {
				entity.display.refresh(entity);
			});
			return;
		}
	},
	camera: {
		description: '切换相机“平滑”效果。',
		callback: function () {
			this.addText(DB.getMessage(319 + CameraPreferences.smooth), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			CameraPreferences.smooth = !CameraPreferences.smooth;
			CameraPreferences.save();
			return;
		}
	},

	fog: {
		description: '切换雾效',
		callback: function () {
			MapPreferences.fog = !MapPreferences.fog;
			this.addText('雾效' + (MapPreferences.fog ? '开启' : '关闭'), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.save();
			return;
		}
	},

	lightmap: {
		description: '移除阴影效果和大部分光照效果',
		callback: function () {
			MapPreferences.lightmap = !MapPreferences.lightmap;
			MapPreferences.save();
			return;
		}
	},

	smoothlight: {
		description: '循环切换光照贴图的色调分离效果：开启、关闭、带伽马校正关闭',
		callback: function () {
			MapPreferences.smoothlight = (MapPreferences.smoothlight + 1) % 3;
			const messages = ['色调分离已开启', '平滑光照已开启', '带伽马校正的平滑光照已开启'];
			this.addText(messages[MapPreferences.smoothlight], this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			MapPreferences.save();
			return;
		}
	},

	noctrl: {
		description: '只需单击左键即可连续攻击怪物',
		callback: function () {
			this.addText(DB.getMessage(717 + ControlPreferences.noctrl), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			ControlPreferences.noctrl = !ControlPreferences.noctrl;
			ControlPreferences.save();
			return;
		},
		aliases: ['nc']
	},

	noshift: {
		description:
			' 无需按 Shift 键即可在 PvP 竞技场中使用辅助技能指定怪物或其他玩家',
		callback: function () {
			this.addText(DB.getMessage(701 + ControlPreferences.noshift), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			ControlPreferences.noshift = !ControlPreferences.noshift;
			ControlPreferences.save();
			return;
		},
		aliases: ['ns']
	},

	snap: {
		description: '鼠标光标半自动移动到目标',
		callback: function () {
			this.addText(DB.getMessage(271 + ControlPreferences.snap), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			ControlPreferences.snap = !ControlPreferences.snap;
			ControlPreferences.save();
			return;
		}
	},

	itemsnap: {
		description: '鼠标光标半自动移动到战利品',
		callback: function () {
			this.addText(DB.getMessage(276 + ControlPreferences.itemsnap), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			ControlPreferences.itemsnap = !ControlPreferences.itemsnap;
			ControlPreferences.save();
			return;
		}
	},
	window: {
		description: '切换窗口吸附',
		callback: function () {
			UIPreferences.windowmagnet = !UIPreferences.windowmagnet;
			this.addText(
				'窗口吸附' + (UIPreferences.windowmagnet ? '开启' : '关闭'),
				this.TYPE.INFO,
				this.FILTER.PUBLIC_LOG
			);
			UIPreferences.save();
			return;
		},
		aliases: ['wi']
	},

	stand: {
		description: '让角色坐下或站立',
		callback: function () {
			let pkt;
			if (PACKETVER.value >= 20180307) {
				pkt = new PACKET.CZ.REQUEST_ACT2();
			} else {
				pkt = new PACKET.CZ.REQUEST_ACT();
			}
			if (Session.Entity.action === Session.Entity.ACTION.SIT) {
				pkt.action = 3; // stand up
			} else {
				pkt.action = 2; // sit down
			}
			Network.sendPacket(pkt);
			return;
		},
		aliases: ['sit']
	},

	doridori: {
		description: '让角色左右转头',
		callback: function () {
			let pkt;
			Session.Entity.headDir = Session.Entity.headDir === 1 ? 2 : 1;
			if (PACKETVER.value >= 20180307) {
				pkt = new PACKET.CZ.CHANGE_DIRECTION2();
			} else {
				pkt = new PACKET.CZ.CHANGE_DIRECTION();
			}
			pkt.headDir = Session.Entity.headDir;
			pkt.dir = Session.Entity.direction;
			Network.sendPacket(pkt);

			// Doridori recovery bonus
			if (Session.Entity.action === Session.Entity.ACTION.SIT) {
				if (!Session.Entity.doriTime) {
					Session.Entity.doriTime = [0, 0, 0, 0, 0];
				}

				Session.Entity.doriTime.shift();
				Session.Entity.doriTime.push(Renderer.tick);

				const doriStart = Session.Entity.doriTime[0];
				const doriEnd = Session.Entity.doriTime[4];

				if (doriEnd - doriStart > 1500 && doriEnd - doriStart < 3000) {
					const doripkt = new PACKET.CZ.DORIDORI();
					Network.sendPacket(doripkt);
					Session.Entity.doriTime = [0, 0, 0, 0, 0];
				}
			}
			return;
		}
	},

	bangbang: {
		description: '顺时针旋转角色',
		callback: function () {
			let pkt;
			Session.Entity.direction = (Session.Entity.direction + 1) % 8;
			if (PACKETVER.value >= 20180307) {
				pkt = new PACKET.CZ.CHANGE_DIRECTION2();
			} else {
				pkt = new PACKET.CZ.CHANGE_DIRECTION();
			}
			pkt.headDir = Session.Entity.headDir;
			pkt.dir = Session.Entity.direction;
			Network.sendPacket(pkt);
			return;
		}
	},

	bingbing: {
		description: '逆时针旋转角色',
		callback: function () {
			let pkt;
			Session.Entity.direction = (Session.Entity.direction + 7) % 8;
			if (PACKETVER.value >= 20180307) {
				pkt = new PACKET.CZ.CHANGE_DIRECTION2();
			} else {
				pkt = new PACKET.CZ.CHANGE_DIRECTION();
			}
			pkt.headDir = Session.Entity.headDir;
			pkt.dir = Session.Entity.direction;
			Network.sendPacket(pkt);
			return;
		}
	},

	where: {
		description: '以地图名称和坐标显示角色位置',
		callback: function () {
			const currentMap = MapRenderer.currentMap;
			this.addText(
				DB.getMapName(currentMap) +
					'(' +
					currentMap +
					') : ' +
					Math.floor(Session.Entity.position[0]) +
					', ' +
					Math.floor(Session.Entity.position[1]),
				this.TYPE.INFO,
				this.FILTER.PUBLIC_LOG
			);
			return;
		}
	},

	who: {
		description: '显示服务器当前玩家数量',
		callback: function () {
			const pkt = new PACKET.CZ.REQ_USER_COUNT();
			Network.sendPacket(pkt);
			return;
		},
		aliases: ['w']
	},

	memo: {
		description: '记忆一个位置，供瞬间移动技能使用',
		callback: function () {
			const pkt = new PACKET.CZ.REMEMBER_WARPPOINT();
			Network.sendPacket(pkt);
			return;
		}
	},

	chat: {
		description: '创建聊天室',
		callback: function () {
			ChatRoomCreate.show();
			return;
		}
	},

	q: {
		description: '离开聊天室',
		callback: function () {
			ChatRoom.remove();
			return;
		}
	},

	leave: {
		description: '离开队伍',
		callback: function () {
			Group.onRequestLeave();
			return;
		}
	},

	invite: {
		description: '"<name>" 邀请玩家加入队伍，可跨地图使用',
		callback: function (text) {
			const matches = text.match(/^invite\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				Group.onRequestInvitation(0, matches[2]);
				return;
			}
		}
	},

	organize: {
		description: '创建名为 <Party Name> 的队伍',
		callback: function (text) {
			const matches = text.match(/^organize\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				Group.onRequestCreationEasy(matches[2]);
				return;
			}
		}
	},

	hi: {
		description: '向好友列表中的所有人发送指定消息',
		callback: function () {
			Friends.sayHi();
			return;
		}
	},

	guild: {
		description: '创建名为 <Guild Name> 的公会。创建者背包中必须有 Emperium',
		callback: function (text) {
			const matches = text.match(/^guild\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				Guild.createGuild(matches[2]);
				return;
			}
		}
	},

	breakguild: {
		description: '解散公会。仅公会会长可用，且必须先驱逐所有成员',
		callback: function (text) {
			const matches = text.match(/^breakguild\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				Guild.breakGuild(matches[2]);
				return;
			}
		}
	},

	alchemist: {
		description: '显示服务器炼金术士酿造排名前 10 名。',
		callback: function () {
			if (PACKETVER.value >= 20130605) {
				const pkt = new PACKET.CZ.RANKING();
				pkt.rankType = RankingTypes.ALCHEMIST;
				Network.sendPacket(pkt);
			} else {
				const pkt = new PACKET.CZ.ALCHEMIST_RANK();
				Network.sendPacket(pkt);
			}
			return;
		}
	},

	blacksmith: {
		description: '显示服务器铁匠锻造/升级排名前 10 名',
		callback: function () {
			if (PACKETVER.value >= 20130605) {
				const pkt = new PACKET.CZ.RANKING();
				pkt.rankType = RankingTypes.BLACKSMITH;
				Network.sendPacket(pkt);
			} else {
				const pkt = new PACKET.CZ.BLACKSMITH_RANK();
				Network.sendPacket(pkt);
			}
			return;
		}
	},

	taekwon: {
		description: '根据跆拳任务完成度显示服务器跆拳小子排名前 10 名',
		callback: function () {
			if (PACKETVER.value >= 20130605) {
				const pkt = new PACKET.CZ.RANKING();
				pkt.rankType = RankingTypes.TAEKWON;
				Network.sendPacket(pkt);
			} else {
				const pkt = new PACKET.CZ.TAEKWON_RANK();
				Network.sendPacket(pkt);
			}
			return;
		}
	},

	hoai: {
		description: '在默认和自定义模式之间切换 Homunculus AI',
		callback: function () {
			Session.homCustomAI = !Session.homCustomAI;
			if (Session.homCustomAI) {
				HomunInformations.resetAI();
				this.addText(DB.getMessage(1024), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			} else {
				HomunInformations.resetAI();
				this.addText(DB.getMessage(1023), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			}
			return;
		}
	},

	merai: {
		description: '在默认和自定义模式之间切换佣兵 AI',
		callback: function () {
			Session.merCustomAI = !Session.merCustomAI;
			if (Session.merCustomAI) {
				this.addText(DB.getMessage(1274), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				MercenaryInformations.resetAI();
			} else {
				MercenaryInformations.resetAI();
				this.addText(DB.getMessage(1273), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			}
			return;
		}
	},
	call: {
		description: '切换是否允许紧急召回。',
		callback: function () {
			const pkt = new PACKET.CZ.CONFIG();
			pkt.Config = 1;
			pkt.Value = !Session.Entity.call_flag ? 1 : 0;
			Network.sendPacket(pkt);
			return;
		}
	},

	cl: {
		description: '向玩家氏族发送消息。',
		callback: function (text) {
			const pkt = new PACKET.CZ.CLAN_CHAT();
			const matches = text.match(/(^cl)\s+(.*)/);
			if (matches && matches[2]) {
				pkt.msg = Session.Entity.display.name + ' : ' + matches[2];
				Network.sendPacket(pkt);
				return;
			}
		}
	},

	/*
	 *  GM COMMANDS
	 */
	broadcast: {
		description: '使用你的名字发送广播消息（黄色）。',
		callback: function (text) {
			const matches = text.match(/(^broadcast|^b)\s+(.*)/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.BROADCAST();
				pkt.msg = Session.Entity.display.name + ' : ' + matches[2];
				Network.sendPacket(pkt);
				return;
			}
		},
		aliases: ['b']
	},
	nb: {
		description: '不使用你的名字发送广播消息（黄色）。',
		callback: function (text) {
			const matches = text.match(/(^nb)\s+(.*)/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.BROADCAST();
				pkt.msg = matches[2];
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	localbroadcast: {
		description: '使用你的名字发送本地广播消息（黄色）。',
		callback: function (text) {
			const matches = text.match(/(^localbroadcast|^lb)\s+(.*)/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.LOCALBROADCAST();
				pkt.msg = Session.Entity.display.name + ' : ' + matches[2];
				Network.sendPacket(pkt);
				return;
			}
		},
		aliases: ['lb']
	},
	nlb: {
		description: '不使用你的名字发送本地广播消息（黄色）。',
		callback: function (text) {
			const matches = text.match(/(^nlb)\s+(.*)/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.LOCALBROADCAST();
				pkt.msg = matches[2];
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	mapmove: {
		description: '移动到地图 x y。',
		callback: function (text) {
			const matches = text.match(/(^mapmove|^mm)\s+([\w.]+)\s+(\d+)\s+(\d+)/);
			if (matches) {
				const pkt = new PACKET.CZ.MOVETO_MAP();
				pkt.mapName = matches[2];
				pkt.xPos = parseInt(matches[3], 10);
				pkt.yPos = parseInt(matches[4], 10);
				Network.sendPacket(pkt);
				return;
			}
		},
		aliases: ['mm']
	},
	shift: {
		description: '传送到角色身边。',
		callback: function (text) {
			const matches = text.match(/^shift\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.SHIFT();
				pkt.CharacterName = matches[2].trim();
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	summon: {
		description: '将玩家召回到你的位置。',
		callback: function (text) {
			const matches = text.match(/^summon\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.RECALL_GID();
				pkt.CharacterName = matches[2].trim();
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	recall: {
		description: '按账号名召回玩家。',
		callback: function (text) {
			const matches = text.match(/^recall\s+(.*)/);
			if (matches && matches[1]) {
				const pkt = new PACKET.CZ.RECALL();
				pkt.AccountName = matches[1].trim();
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	hide: {
		description: '切换完全隐身。',
		callback: function () {
			// Server handles toggle state
			const pkt = new PACKET.CZ.CHANGE_EFFECTSTATE();
			pkt.EffectState = StatusState.EffectState.INVISIBLE;
			Network.sendPacket(pkt);
			return;
		}
	},
	kill: {
		description: '断开玩家连接（需要账号 ID）。',
		callback: function (text) {
			const matches = text.match(/(^kill)\s+(\d+)/);
			if (matches) {
				const pkt = new PACKET.CZ.DISCONNECT_CHARACTER();
				pkt.AID = matches[2];
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	killall: {
		description: '断开所有玩家连接。',
		callback: function () {
			const pkt = new PACKET.CZ.DISCONNECT_ALL_CHARACTER();
			Network.sendPacket(pkt);
			return;
		}
	},
	item: {
		description: '创建物品或怪物（使用 AEGIS 名称）。',
		callback: function (text) {
			const matches = text.match(/(^item|^monster)\s+(")?([^"]+)(")?/);
			if (matches && matches[3]) {
				const pkt = new PACKET.CZ.ITEM_CREATE();
				pkt.itemName = matches[3];
				Network.sendPacket(pkt);
				return;
			}
		},
		aliases: ['monster']
	},
	resetstate: {
		description: '重置属性。',
		callback: function () {
			const pkt = new PACKET.CZ.RESET();
			pkt.type = 0;
			Network.sendPacket(pkt);
			return;
		}
	},
	resetskill: {
		description: '重置技能。',
		callback: function () {
			const pkt = new PACKET.CZ.RESET();
			pkt.type = 1;
			Network.sendPacket(pkt);
			return;
		}
	},
	remove: {
		description: '移除玩家（需要账号名）。',
		callback: function (text) {
			const matches = text.match(/(^remove)\s+(.*)/);
			if (matches) {
				const pkt = new PACKET.CZ.REMOVE_AID();
				pkt.AccountName = matches[2];
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	changemaptype: {
		description: '更改格子类型（x、y、类型）。',
		callback: function (text) {
			const matches = text.match(/(^changemaptype|cmt)\s+(\d+)\s+(\d+)\s+(\d+)/);
			if (matches) {
				const pkt = new PACKET.CZ.MOVETO_MAP();
				pkt.xPos = matches[2];
				pkt.yPos = matches[3];
				pkt.type = matches[4];
				Network.sendPacket(pkt);
				return;
			}
		},
		aliases: ['cmt']
	},
	check: {
		description: '查看玩家属性（GM 命令）。',
		callback: function (text) {
			const matches = text.match(/^check\s+(")?([^"]+)(")?/);
			if (matches && matches[2]) {
				const pkt = new PACKET.CZ.REQ_STATUS_GM();
				pkt.CharName = matches[2].trim();
				Session.gmCheckTarget = pkt.CharName;
				Network.sendPacket(pkt);
				return;
			}
		}
	},
	macro_register: {
		description: '打开向验证码系统上传图片的界面',
		callback: function () {
			CaptchaUpload.prepare();
			CaptchaUpload.append();
		},
		aliases: ['mr']
	},
	macro_detector: {
		description: '打开宏检测器界面',
		callback: function () {
			CaptchaSelector.prepare();
			CaptchaSelector.append();
		},
		aliases: ['md']
	},
	macro_preview: {
		description: '请求预览验证码图片',
		callback: function (text) {
			const matches = text.match(/^macro_preview\s+(\d+)/);
			if (matches && matches[1]) {
				const pkt = new PACKET.CZ.REQ_PREVIEW_MACRO_DETECTOR();
				pkt.captchaID = matches[1];
				Network.sendPacket(pkt);
			}
			return;
		}
	},
	navi: {
		description: '导航到地图位置。用法：/navi mapname x y',
		callback: function (text) {
			const matches = text.match(/^navi\s+(\S+)\s+(\d+)\s+(\d+)/);
			if (matches) {
				Navigation.append();
				Navigation.navigateTo({
					startMap: MapRenderer.currentMap,
					startX: Session.Entity.position[0] | 0,
					startY: Session.Entity.position[1] | 0,
					endMap: matches[1],
					endX: parseInt(matches[2], 10),
					endY: parseInt(matches[3], 10),
					displayName: matches[1] + ' (' + matches[2] + ', ' + matches[3] + ')'
				});
				return;
			}
		}
	},
	commands: {
		description: '显示可用命令。',
		callback: function () {
			function addTextCommand(cmd, commands) {
				let textAliases = '';

				if (commands[cmd].aliases && commands[cmd].aliases.length > 0) {
					textAliases = ` (${commands[cmd].aliases.join(', ')})`;
				}

				return `/${cmd}` + textAliases + `：${commands[cmd].description || '未知描述。'}\n`;
			}
			// we list custom in a separate section
			let customsEnabled = false;

			const separator = '=======================\n';

			let messages = `${separator}可用命令：\n${separator}`;
			let customMessages = `${separator}自定义命令：\n${separator}`;

			const sortedCommands = {};

			// sort a-z commands by their name
			Object.keys(CommandStore)
				.sort()
				.forEach(function (key) {
					sortedCommands[key] = CommandStore[key];
				});

			for (const cmd in sortedCommands) {
				if (sortedCommands[cmd].custom) {
					customMessages += addTextCommand(cmd, sortedCommands);
					customsEnabled = true;
				} else {
					messages += addTextCommand(cmd, sortedCommands);
				}
			}

			this.addText(messages, this.TYPE.BLUE, this.FILTER.PUBLIC_LOG);

			if (customsEnabled) {
				this.addText(customMessages, this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
			}

			return;
		},
		aliases: ['cmd', 'h', 'help']
	}
};

// Dev-only weather helper to trigger weather effects locally.
if (Configs.get('development')) {
	CommandStore.weather = {
		description: '仅开发模式可用的天气切换。用法：/weather snow|rain|leaves|sakura|fireworks|cloud|cloud2|off',
		callback: function (text) {
			const args = text.trim().split(/\s+/).slice(1);
			const mode = (args[0] || '').toLowerCase();

			if (!mode || mode === 'help') {
				this.addText(
					'用法：/weather snow|rain|leaves|sakura|fireworks|cloud|cloud2|off',
					this.TYPE.INFO,
					this.FILTER.PUBLIC_LOG
				);
				return;
			}

			if (!Session.Entity) {
				return;
			}

			const ownerAID = Session.Entity.GID || Session.GID || Session.AID;

			if (mode === 'snow' || mode === 'on') {
				EffectManager.spam({
					effectId: EffectConst.EF_SNOW,
					ownerAID: ownerAID
				});
				this.addText('已开始下雪。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'rain') {
				EffectManager.spam({
					effectId: EffectConst.EF_RAIN,
					ownerAID: ownerAID
				});
				this.addText('已开始下雨。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'sakura') {
				EffectManager.spam({
					effectId: EffectConst.EF_SAKURA,
					ownerAID: ownerAID
				});
				this.addText('樱花花瓣开始飘落。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'leaves') {
				EffectManager.spam({
					effectId: EffectConst.EF_MAPLE,
					ownerAID: ownerAID
				});
				this.addText('落叶纷纷飘落。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'fireworks') {
				EffectManager.spam({
					effectId: EffectConst.EF_POKJUK,
					ownerAID: ownerAID
				});
				this.addText('烟花已发射。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'cloud') {
				EffectManager.spam({
					effectId: EffectConst.EF_CLOUD,
					ownerAID: ownerAID
				});
				this.addText('云朵出现了。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'cloud2') {
				EffectManager.spam({
					effectId: EffectConst.EF_CLOUD2,
					ownerAID: ownerAID
				});
				this.addText('另一种云朵出现了。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			if (mode === 'off' || mode === 'stop' || mode === 'clear') {
				SnowWeather.stop(ownerAID, Renderer.tick);
				RainWeather.stop(ownerAID, Renderer.tick);
				SakuraWeatherEffect.stop(ownerAID, Renderer.tick);
				PokJukWeatherEffect.stop(ownerAID, Renderer.tick);
				CloudWeatherEffect.stop(ownerAID, Renderer.tick);

				this.addText('天气效果停止中。', this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
				return;
			}

			this.addText(
				'未知天气。用法：/weather snow|rain|leaves|sakura|fireworks|cloud|cloud2|off',
				this.TYPE.INFO,
				this.FILTER.PUBLIC_LOG
			);
		}
	};
}

/**
 * Load aliases
 */
function loadAliases() {
	for (const cmd in CommandStore) {
		if (CommandStore[cmd].aliases) {
			for (let i = 0; i < CommandStore[cmd].aliases.length; i++) {
				aliases[CommandStore[cmd].aliases[i]] = cmd;
			}
		}
	}
}

loadAliases();

/**
 * Process command
 */
function processCommand(text) {
	const cmd = text.split(' ')[0];
	let pkt, matches;

	// Check if the command exists in the store
	if (CommandStore[cmd]) {
		CommandStore[cmd].callback.call(this, text);
	} else if (aliases[cmd]) {
		const parentCommand = aliases[cmd];
		CommandStore[parentCommand].callback.call(this, text);
	} else {
		// /str+
		// TODO: do we have to spam the server with "1" unit or do we have to fix the servers code ?
		matches = text.match(/^(\w{3})\+ (\d+)$/);
		if (matches) {
			const pos = ['str', 'agi', 'vit', 'int', 'dex', 'luk'].indexOf(matches[1]);
			if (pos > -1 && matches[2] !== 0) {
				pkt = new PACKET.CZ.STATUS_CHANGE();
				pkt.statusID = pos + 13;
				pkt.changeAmount = parseInt(matches[2], 10);
				Network.sendPacket(pkt);
				return;
			}
		}

		if (matches) {
			const pos = ['pow', 'sta', 'wis', 'spl', 'con', 'crt'].indexOf(matches[1]);
			if (pos > -1 && matches[2] !== 0) {
				pkt = new PACKET.CZ.STATUS_CHANGE();
				pkt.statusID = pos + 219;
				pkt.changeAmount = parseInt(matches[2], 10);
				Network.sendPacket(pkt);
				return;
			}
		}

		// Show emotion
		if (cmd in Emotions.commands) {
			pkt = new PACKET.CZ.REQ_EMOTION();
			pkt.type = Emotions.commands[cmd];
			Network.sendPacket(pkt);
			return;
		}

		// Command not found
		this.addText(DB.getMessage(95), this.TYPE.INFO, this.FILTER.PUBLIC_LOG);
	}
}

/**
 * Add a command to the store
 */
function addCommand(name, description = '', callback = () => {}, alias = [], custom = true) {
	callback = callback.bind(ChatBox);

	CommandStore[name] = {
		description: description,
		callback: callback,
		aliases: alias,
		custom
	};
	reloadAliases();
}

/**
 * Remove a command from the store
 */
function removeCommand(name) {
	delete CommandStore[name];
	reloadAliases();
}

/**
 * Reload aliases (we dont reload aliases on each ProcessCommand because it's not a common operation)
 */
function reloadAliases() {
	aliases = {};
	loadAliases();
}

/**
 * Export Methods
 */
export default {
	processCommand: processCommand,
	add: addCommand,
	remove: removeCommand,
	isEnabled: name => name in CommandStore,
	reloadAliases: reloadAliases
};
