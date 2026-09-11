# HappyRO 全仓库审查修复（2026-09-12）

本文件是审查清单 1–41 的独立修复记录，放在 `docs/history/bugfix/` 下，与产品 changelog 分开。它说明改了什么、文件在哪，以及风险项如何取舍。不是提交记录，也不替代各仓库 `changelog/`。

审查范围是 HappyRO 自有代码：根仓库脚本/文档/工具，以及 `repos/happyro-client`、`happyro-server`（HappyRO 触及路径）、`happyro-admin`、`happyro-gateway`。未改 vendor、`node_modules`、rAthena `3rdparty`、`archive/translation` 发布源。

## 产品取舍

| 项 | 取舍 |
| --- | --- |
| 19 记住账号 | 文案与实现保持只记账号（`saveID` / `ID`），不增加记密码。 |
| 23 `achievment` | 改成正确拼写 `achievement`（HTML id 与 `dispatchButton`）。 |
| 24 权限缺省 | 缺配置时默认管理员策略 `1`，不再默认所有人 `2`。 |
| 30 validate-kro | 仍读历史归档 `archive/translation/`；文件头注明它不是发布源。 |
| 40 `canGameControl` | 继续只守页面内召唤/维护按钮；后端 `permission:operations.game-control` 仍守接口。魔物图鉴路由不对全页加该权限。 |

## 客户端

| 项 | 修复 | 位置 |
| --- | --- | --- |
| 1 | 登录框 `mousedown` 不再清空账号/密码 | `repos/happyro-client/src/UI/Components/WinLogin/WinLoginCommon.js` |
| 2 | 注册按钮改为 `id="btn_signup"`，去掉重复 `btn_connect` | `WinLoginV2/WinLoginV2.html` |
| 3 | `addValueToInput` 抽出纯函数，MAX/数字都有返回值 | `Bank/BankAmount.js`、`Bank.js` |
| 4 | 金额框 Enter 发起存款 | `Bank.js` `onKeyDown` |
| 5 | 成就「已完成 / 未完成」真正筛选 | `Achievement.js` |
| 6 | 技能窗 `TOGGLE` 不再丢掉未确认加点 | `SkillListCommon.js` |
| 7 | 世界地图已打开且被挡住时快捷键置顶；已在最前再按则关闭 | `Navigation.js` `toggle` |
| 8 | 自动填充 CSS `5000s ease-in-out` | `WinLogin.css`、`WinLoginV2.css` |
| 9 | NPC 传送按钮同时要求 `type === 'NPC'` 且 `npcClass` 有限 | `NpcCatalogTab.js` |
| 10 | GAT 未加载或仍是随机坐标时禁用传送 | `MapCatalogTab.js` |
| 11 | `/mapmove` 改发静默 `CZ.HAPPYRO_MAP_TELEPORT`（0xd00） | `ProcessCommand.js` |
| 21 / 33 | `GameTools.needFocus` 恢复默认 true，去掉写死 `zIndex 1000`，打开时 `focus()` | `GameTools.js` |
| 22 | bootstrap 失败时 `itemGrantAllowed: false` | `GameTools.js` |
| 31 | 删除已隐藏的传送服务开关 JS/CSS；`warpTypes` 固定 `[200, 201]` | `Navigation.js`、`Navigation.css` |
| 32 | 去掉无效的 `#win_popup .btn { bottom: 4px }` | `WinPopup.css` |
| 34 | 注册 BMP 按钮去掉叠字「注册」 | `WinLoginV2.html` |
| 37 | 点当前页签不再整页重挂 | `GameTools.js` `selectTab` |
| 38 | 行动按钮不再强制 `display: block` | `Navigation.js` |

## 服务端

| 项 | 修复 | 位置 |
| --- | --- | --- |
| 11 | `atcommand_mapmove` 成功后不再打 `Warped.` | `atcommand.cpp` |
| 12 | 转职/回满对死亡角色走 `status_revive` | `game_control.cpp` |
| 13 | 不可堆叠发放中途失败时按空位回滚已进包物品 | `game_control_item_grant.cpp` |
| 26 | 删除 `process_battle_config_command` 之后达不到的副本 | `game_control.cpp` |
| 36 | 毁灭之剑任务对话与注释中的 Emperium 改为华丽金属 | `npc/quests/doomed_swords.txt`、`doomed_swords_quest.txt` |

## 后台

| 项 | 修复 | 位置 |
| --- | --- | --- |
| 17 | 物品详情 `find($itemId, 'client')`，与列表范围一致 | `AdventureItemController.php` |
| 24 | 缺策略时默认 `1`（管理员） | `AdventureToolAccessService.php` |
| 28 | `UMI_ENV=test` 代理改为本机 `127.0.0.1:18081` | `frontend/config/proxy.ts` |
| 40 | `canGameControl` 仍用于页面内按钮；后端权限不变 | `access.ts`、`routes.ts`、`web.php` |

发放接口仍用服务端物品范围（`GrantAdventureItemService`），避免把仅客户端条目发到 map-server。

本机后台 `.env` 使用 MariaDB；PHPUnit 在 `phpunit.xml` 中强制 `DB_CONNECTION=sqlite` 内存库。`reason`→`remark` 迁移对 MariaDB/MySQL 仍用 `MODIFY`，对 SQLite 改走 Schema `change()`，这样发放功能测试能在测试库上跑完。

## Gateway 与根仓库脚本

| 项 | 修复 | 位置 |
| --- | --- | --- |
| 14 | `configure-gateway.sh` 无参数只打印帮助；已有 `.env` 不覆盖；`gateway.sh start` 传 `apply` | `scripts/gateway/configure-gateway.sh` |
| 15 | `database.sh` / `server.sh` / `gateway.sh` 无参数打印帮助退出 0；`configure-*` 需 `apply` | `scripts/` |
| 16 / 39 | NPC 生成命令写成 `generate`；文档区分目录生成器与客户端图集脚本 | `docs/game-data/`、`docs/architecture/world-catalog-navigation.md` |
| 18 | `getFile` 拒绝用户路径中的 `..` | `repos/happyro-gateway/src/utils/safePath.js`、`clientController.js` |
| 20 | 默认 `ROBROWSER_PATH=../../repos/happyro-client/dist/Web` | `index.js`、`runtime-config.js`、`.env.example` |
| 25 | `DISABLED` 脚本不再标成动态，也不进入目录 | `tools/generate-npc-catalog.mjs` |
| 27 | `POST /search` 把过滤条件当字面量，不再编译用户正则 | `src/routes/index.js`、`safePath.js` |
| 29 | `upstreams.sh status` 只读本地 ahead/behind，不 fetch | `scripts/maintenance/upstreams.sh` |
| 35 | 本地化扫描无参数只打印帮助，需 `scan` 才写 TSV | `scripts/localization/scan-localization-inventory.py` |
| 41 | NPC PNG 写明已提交 Admin 路径；物品大图仍在 `work/game-data/` | `world-catalog-navigation.md`、`docs/game-data/npcs.md` |

## 测试

- Client：`tests/ui/BankAmount.test.js`、`WinLoginLocalization.test.js`、`WorldMapNavigation.test.js`
- Gateway：`test/safe-path.test.js`
- Admin：`AdventureItemControllerTest` 详情走 `client` 范围；发放路径在 SQLite 测试库上通过（MariaDB 本机应用不受影响）
- 根仓库：`tools/generate-npc-catalog.test.mjs`；CLI 无参数帮助用脚本实测
