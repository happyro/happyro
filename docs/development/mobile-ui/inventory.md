# 游戏 UI 与输入入口盘点

盘点日期：2026-09-23。范围是实施顺序中的第一步：进入游戏时的 UI 装配、旧移动辅助输入、地图输入及共享业务依赖。本页是源码审查结果，不是新 UI 已实现或实机行为已验证的声明。

源码路径均相对 `repos/happyro-client/src/`。条件挂载、偏好设置可能使部分组件隐藏；调用 `append()` 不等于玩家首屏能看到该窗口。

## 1. 装配与生命周期

主要入口：[MapEngine.js](../../../repos/happyro-client/src/Engine/MapEngine.js)。

| 时机 | 当前入口与行为 | 重构接入点 |
| --- | --- | --- |
| 地图引擎初始化 | 选择 BasicInfo、MiniMap 等版本；准备窗口；调用 `MapControl.init()`，绑定行走、停止、丢弃物品回调 | 平台选择与业务绑定应在这里协调；不能仅替换最终挂载的 DOM |
| 地图加载完成 | `MapRenderer.onLoad` 中设置摄像机目标，挂载游戏组件，调用插件初始化，通知服务端角色初始化完成 | 在游戏 UI 装配区选择桌面或移动实现，不更改地图加载与网络通知顺序 |
| 换图／服务器切换 | 地图加载流程再次发生，地图实体可能重建 | 新移动组件需要可重复挂载，清空旧目标和输入状态，避免监听器重复注册 |
| 退出游戏 | `onExitSuccess()` 释放方向遮罩，保存快捷栏，清理 UI、网络与渲染器 | 移动输入停止必须先于组件移除；不得依赖“节点不可见”停止计时器 |
| 返回选角／断线 | 另有重启、网络终止路径 | 后续实现需逐路径接入统一清理，不能只覆盖正常退出 |

### 地图加载完成时的组件清单

| 当前组件／入口 | 职责 | 移动端去向 |
| --- | --- | --- |
| BasicInfo、WinStats | 人物摘要与详细属性 | 左上摘要、点击打开属性面板 |
| MiniMap、MapName | 小地图、地图名称 | 右上固定地图与地图标题 |
| StatusIcons | 状态图标 | 点击详情的状态区 |
| ChatBox、ChatBoxSettings | 消息和聊天配置 | 聊天摘要、独立展开面板与设置 |
| ShortCut、ShortCuts | 战斗快捷栏、功能入口 | 图标快捷栏、统一功能菜单；需要分别核对两者接口 |
| Inventory、Equipment | 背包、装备 | 固定业务面板，点击条目操作 |
| CartItems、Vending、ChangeCart、CartDecoration | 手推车、摆摊、车外观 | 后续物品与经营面板 |
| SkillList、SkillListMH.homunculus／mercenary | 玩家、生命体、佣兵技能 | 技能面板与职业专属入口 |
| PartyFriends、Guild | 队伍、好友、公会 | 社交菜单与面板 |
| ChatRoomCreate、Emoticons | 聊天室、表情 | 聊天扩展操作 |
| WorldMap、Navigation | 世界地图、导航 | 展开地图与导航面板 |
| Quest | 任务 | 任务入口与列表 |
| Escape | 游戏系统菜单 | 设置、返回选角、退出等明确按钮 |
| FPS | 性能显示 | 独立诊断选项，不挤占主要操作区 |
| MobileUI | 旧屏幕摇杆和触摸辅助按钮 | 新移动控制生效时退出其移动输入路径 |
| JoystickUI | 实体游戏手柄及映射界面 | 保留独立设备能力，不当作屏幕摇杆删除 |
| GameTools.restoreAfterMapLoad | 恢复游戏工具界面 | 单独审查工具入口与恢复状态 |
| Roulette | 转盘 | 后续系统面板 |
| Achievement | 条件启用的成就 | 后续系统面板 |
| PCGoldTimer | 条件显示的计时 | 后续辅助信息区 |
| CashShopIcon、CheckAttendance | 条件启用的商城、签到 | 后续系统入口 |
| Announce | 条件显示的公告／倍率消息 | 不遮挡主要操作的消息层 |
| PluginManager.init | 插件 UI 扩展 | 额外盘点，不能据上述列表宣称所有 UI 已覆盖 |

NPC、交易、仓库、邮件等由封包或用户操作打开，不都在上述挂载区。完整窗口适配阶段还需从 `Engine/MapEngine/` 下的 NPC、Store、Storage、Trade、Bank、Mail、Rodex、Pet、Homun、Mercenary、Group、Friends、Guild、Quest、UIOpen、Captcha、CashShop 等业务入口继续追踪。

## 2. 当前输入链路

```text
window touchstart / touchmove / touchend
  → Core/Mobile.js（全局触摸状态、200ms 单指点击延迟、双指镜头手势）
  → MapControl 的鼠标按下／松开回调
  → 地图行走 或 EntityControl 的拾取／交谈／聚焦与攻击

MobileUI 的屏幕摇杆
  → document touchmove / touchend
  → 每 100ms 计算移动目的地并直接发移动请求

MobileUI 的攻击按钮
  → attackTargeted()
  → 当前目标；无目标或目标死亡时自动找目标
  → 寻路、攻击请求或 Session.moveAction 延迟动作

实体游戏手柄
  → JoystickInputService / JoystickPollingLoop
  → JoystickInteractionService / JoystickShortcutMapper
```

### 入口证据与风险

| 源码 | 已确认行为 | 后续处理 |
| --- | --- | --- |
| [Core/Mobile.js](../../../repos/happyro-client/src/Core/Mobile.js) | 模块加载时注册全局触摸事件；用全部 `event.touches` 判断双指手势；单指延迟 200ms 转鼠标操作；首次触摸还可能显示 MobileUI | 新移动 UI 的触点不能进入旧地图手势；新入口启用时防止旧 MobileUI 被首次触摸重新显示 |
| [Controls/MapControl.js](../../../repos/happyro-client/src/Controls/MapControl.js) | 绑定全局鼠标、地图滚轮和拖放；触摸回调复用鼠标处理；点实体会调用 `onMouseDown()` 和 `onFocus()`，不是纯选择 | 新移动目标选择要与执行攻击区分；桌面右键旋转、滚轮、拖放保持原路径 |
| [Controls/MouseEventHandler.js](../../../repos/happyro-client/src/Controls/MouseEventHandler.js) | 全局鼠标坐标和相交状态被地图、实体和窗口共用 | 不用移动按钮篡改鼠标位置来模拟操作；显式传递移动向量和目标 |
| [Controls/EntityControl.js](../../../repos/happyro-client/src/Controls/EntityControl.js) | 鼠标按下处理拾取、NPC 等；`onFocus()` 包含攻击分支，受 TouchTargeting、autoFollow、键盘状态和可攻击条件影响 | 提取显式目标操作，保留合法目标、距离、负重等判断，避免绕过桌面业务约束 |
| [UI/GUIComponent.js](../../../repos/happyro-client/src/UI/GUIComponent.js) | Shadow DOM、相交状态、模态冻结、拖动和触摸阻断均有公共逻辑 | 移动组件用独立交互层；事件判断考虑 Shadow DOM 路径，不全局修改桌面拖动 |
| [UI/Platform.js](../../../repos/happyro-client/src/UI/Platform.js) | `pointer: coarse` 在加载时决定平台；方向另行更新 | 统一沿用平台入口，避免与 Session.isTouchDevice 混用后在触屏电脑误切 UI |
| [UI/RotationGuard.js](../../../repos/happyro-client/src/UI/RotationGuard.js) | 显示竖屏遮罩并阻断事件；没有直接停止旧屏幕摇杆的移动计时器 | 遮罩出现时新控制器必须主动取消输入，仅遮挡屏幕不足以停止已有动作 |

## 3. 旧屏幕摇杆与攻击的具体问题

来源：[MobileUI.js](../../../repos/happyro-client/src/UI/Components/MobileUI/MobileUI.js)。以下为静态代码事实及其风险判断，尚未逐条进行实机复现。

1. `startDrag()`／`moveJoystick()` 使用 `touches[0]`，没有绑定触点 ID。第二根手指参与时缺少稳定归属。
2. document 上任意 `touchend` 都调用 `stopDrag()`；松开攻击手指也可能停止摇杆。该摇杆链路未注册 `touchcancel`。
3. 移动由 100ms interval 驱动；`onRemove()` 保存偏好和处理自动目标，但没有调用 `stopDrag()`／`stopMovement()`。隐藏或移除 UI 不足以保证停止输入。
4. `stopMovement()` 只停止本地发包，不表示服务端立即中断已接受的行走路径；验收时必须区分“停止持续输入”和“立即停步”。
5. `attackTargeted()` 自带自动找目标，并直接构造攻击和移动封包。不能直接当作“点击选中目标后再攻击”的新业务接口。
6. 摇杆按摄像机方向转换向量，并做可行走格检查；这些算法可以复用，但应脱离 DOM 事件和计时器。
7. 按钮通过 touchstart + click 防重；快捷按钮模拟键盘事件。新移动 UI 应调用明确业务接口，避免继续通过键码间接触发桌面组件。

实体手柄是另一套系统：[JoystickModule.js](../../../repos/happyro-client/src/UI/Components/JoystickUI/JoystickModule.js) 组织 prepare／dispose；[JoystickInputService.js](../../../repos/happyro-client/src/UI/Components/JoystickUI/JoystickInputService.js) 监听 gamepad 连接并使用 `navigator.getGamepads()`。需保留桌面手柄支持，未来再明确手机外接手柄和屏幕摇杆的输入优先级。

## 4. 共享业务不能靠隐藏桌面窗口替代

| 能力 | 当前依赖 | 建议复用边界 |
| --- | --- | --- |
| 人物摘要 | MapEngine 直接更新 BasicInfo；Session.Entity 提供角色状态 | 建立摘要视图绑定，保留现有数据更新语义 |
| 地图 | MapRenderer.currentMap、Camera、MiniMap.getUI().setMap | 复用地图信息，另做移动展示与镜头按钮 |
| 行走 | MapEngine 行走回调依赖 Mouse.world；MobileUI 另发移动封包 | 提取明确目的地／移动向量接口，统一取消和频率控制 |
| 目标、攻击、交谈、拾取 | EntityManager、EntityControl、Session.moveAction，旧 MobileUI 内另有实现 | 共享实体识别、规则检查和网络操作，移动输入负责选择及触发 |
| 背包／装备 | Engine/MapEngine/Item.js 直接调用 Inventory.getUI().setItems、addItem、removeItem 及 Equipment.getUI() 的装备方法 | 先确认数据所有权并提取业务状态；不能停止准备桌面窗口后仍把数据写入其 UI |
| 技能／快捷栏 | Engine/MapEngine/Skill.js 直接设置 ShortCut 列表、冷却，并绑定 onChange、onUseSkill 等回调 | 共享技能与快捷配置数据、发送操作；展示和槽位编辑独立 |
| 聊天 | MapEngine 绑定 ChatBox.onRequestTalk，各引擎直接 ChatBox.addText | 提供共享消息流与发送入口，不另建不一致的日志列表 |
| 面板生命周期 | UIManager、GUIComponent、地图初始化及退出清理 | 统一移动 UI 装配／移除与输入取消；桌面生命周期不变 |

后续建议新增移动游戏入口、首屏组件和输入控制器，位置在 `UI/Mobile/game/`。这是拟定边界，尚未创建这些产品文件。

## 5. 下一阶段可执行清单

- 在地图 UI 装配处增加单一平台入口，分别管理桌面和移动组件；先处理数据绑定再替换视图。
- 定义移动输入控制器的 start／stop／cancel 生命周期，以每个控件的 pointerId 跟踪触点，明确 pointercancel、失焦、后台、遮罩、弹窗、换图和退出的取消行为。
- 新屏幕控件不再接入旧 MobileUI；只在新移动模式中隔离 Core/Mobile 的旧触摸转鼠标路径，保留桌面输入及实体手柄能力。
- 将点地移动、目标选择和攻击分开；固定摇杆及原生 Pointer Events 已在后续讨论确认（见[整体方案](plan.md)）；是否保留点地移动、具体攻击和自动寻敌策略仍待细化。
- 实现左上摘要、右上小地图与菜单、左下摇杆、右下攻击，预留聊天与快捷区域。未适配业务窗口继续记录在待办中，不能宣称全量完成。

## 6. 验证基线与待补检查

现有相关测试有 `tests/ui/JoystickInputService.test.js`、`JoystickUIRenderer.test.js`、`RotationGuard.test.js`、`MobileMessageDialog.test.js`、`MobileViewport.test.js`。它们分别覆盖已有模块，不能证明新的摇杆与攻击联动可用。本步骤没有修改产品或运行这些测试。

实现后至少新增或执行：双指操作且释放攻击手指不停止摇杆；touch／pointer 取消和退出清理；点击 UI 不产生地图操作；一个动作仅发送一次；旋转遮罩和后台停止持续输入；换图不累加监听器；桌面右键旋转、拖放、快捷键、目标攻击及手柄原流程回归。移动实机和本机自动检查分别记录。
