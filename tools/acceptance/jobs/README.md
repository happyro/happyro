# 转职实机工具

在根仓库执行。需要运行中的本地游戏服务、MariaDB、Chromium 和tools/ 中固定版本的 playwright-core。

- `python3 tools/acceptance/jobs/prepare.py --run`：创建专用普通权限男性／女性账号及 NPC 流程／直接转职各一名初心者；已有账号不覆盖。凭据仅放忽略的 `work/runtime/job-change-audit.json`，不写入证据。
- `node tools/acceptance/jobs/session.mjs --run`：实际浏览器登录专用男性角色；`--female` 使用女性角色，`--mobile` 使用手机视口；`--slot=1` 使用独立直接转职角色；`--port=9361` 更换控制端口（浏览器调试端口为该端口减一）。新增的专用测试角色可使用 `--slot=2 --character=JobCruRegM` 指定；显式名称必须以 `Job` 开头，登录后仍严格核对角色名。同一账号不可同时登录两名角色。
- 不带参数只显示帮助；`--no-color` 禁用帮助颜色。

会话将调试接口绑定到本机 9351，浏览器调试端口为 9350。只能在可信开发机使用，测试结束后停止进程。调试接口用于读状态及执行浏览器操作，不能将注入角色状态当作 NPC 完成证据。冒险工具 API 仅用于明确标注的准备动作和状态核验。正式操作和 NPC 对话在浏览器中进行。

测试辅助访问器只通过浏览器路由追加到本次页面，不修改服务端提供的客户端文件。过程数据存于 work，审核后的脱敏证据放到 `docs/development/job-change-review/evidence/`。

## 场景执行

`python3 tools/acceptance/control.py --run FILE --port 9351` 执行审核过的场景片段。片段依赖已登录会话中的 `game`、`snapshot`、`command`，不作为独立 CLI 使用。

- `scenarios/direct-female.js`：必须使用 JobDirectF 会话（`--female --slot=1 --port=9361`），实际点击十二条线的逐阶段转职；第 11 条只覆盖舞娘。
- `dialogue.mjs`：NPC 实际对话、选项、继续／关闭的浏览器驱动；接触与赶路使用当前客户端正常封包，不写服务端任务变量。

证据中的「通过」只覆盖记录明确说明的环节。准备等级、技能、素质不等于通过相应任务。测试角色的销毁或重置必须另行明确执行，本工具不会自动删除历史测试角色。

## 回归与分阶段场景

- `scenarios/npc-progression-regression.js`：专用女性直接转职角色，验证 NPC 对话期间拒绝转职和等级修改，结束对话后恢复；保存真实 UI 请求结果。
- `scenarios/npc-concurrency-*.js`：修复前复现脚本，不能作为当前版本的通过测试。
- `scenarios/rune-knight-*.js`、`scenarios/mage-native.js`、`scenarios/wizard-*.js`：原生任务分阶段场景。运行前先核对角色、当前地图、NPC 对话和已保存证据，不重复初始化进行中的任务。
- 第一项符文骑士战斗使用强化素质；仅验证正常攻击触发任务推进及原生计时，不评价战斗难度。
- `dialogueDriver(game, snapshot)` 等待目标地图的附近安全落点及 NPC 实体加载。地图可通行落点可能偏离所选格，不要求强制精确落点。

运行场景前核对服务与本机控制端口；不得因观察超时直接重复运行场景。测试结束后停止测试会话，保留游戏服务。浏览器重启后重新初始化对话驱动，避免沿用失效页面。

- `scenarios/ranger-survival.js`：已领补给后的生存路线续跑，通过普通步行抵达泪滴教官并接取狩猎任务；不得对已经接取狩猎任务的角色重复执行。
- `scenarios/ranger-hunt.js`：使用原生测试弓箭击杀自然刷新的刺尾蜻蜓，读取服务端任务计数并实际拾取蜻蜓翅膀，随后交付。仅用于已接取该任务的 JobDirectM；运行中不得重复启动。

- `scenarios/archbishop-entry-regression.js`：修复后的前厅入场回归；主动停留关闭按钮 3.5 秒，再验证卷轴到达及女武神化身召唤。只用于任务已到试炼阶段、没有佣兵的 JobAuditF。
- `scenarios/archbishop-trial-walk.js`：持有原生女武神化身后，普通步行及攻击推进第一段试炼；保留返回前厅／路径失败证据，不把走完路线当作转职成功。
- `scenarios/direct-remaining-male-relog.js`：JobAuditM 补测其余十条男性职业线，每次实际点击冒险工具转换并返回选角重进，逐阶段比对技能树和状态；JobDirectM 的原生游侠任务保留。启动后须等待原进程，不能重复执行。
- 玩家转职流程的索引是 `docs/development/job-change-review/walkthrough.md`，各线独立文档位于其下 `walkthroughs/`。

## 独立账号与并行会话

`prepare.py --run --pair 2` 创建第二对独立普通账号（已有凭据时不重复创建），私密凭据保存于忽略目录 `work/runtime/`。`session.mjs --run --pair=2 --port=9371` 和加上 `--female --port=9381` 分别运行第二对账号。第一对仍使用 9351 / 9361。每个账号独立登录；共享的考试地图必须错开占用，不能同时重启地图服务或修改同一角色。

用户已取消后续冒险工具验收。并行会话用于原生 NPC 职业线；等级、金币、技能点和材料准备仍需记入证据，不能修改任务变量或以直接改职业替代原生流程。

十二条职业线已在 macOS M5 完成验收，结果见[验收总览](../../../docs/development/job-change-review/README.md)。工具支持四对独立账号（最多八个账号会话）；并行数量需结合机器资源和共享考场限制决定。

### macOS 本机运行

安装 tools/ 的固定依赖 后，可使用已安装的 Google Chrome：

```sh
npm ci --prefix tools
node tools/acceptance/jobs/session.mjs --run --slot=1 --port=9351 --base-url=http://127.0.0.1:3338
```

可用 `--browser-path=PATH` 指定其他 Chromium。路径从工具文件位置解析；不依赖 Linux 工作区路径或 systemd。启动后仍须核实 WebGL 渲染器、角色和数据库，不能假设硬件加速或角色迁移已经完成。状态读取由 `snapshot.mjs` 以至少 650ms 的间隔串行执行，避免高频循环触发每账号每分钟 120 次限制；此间隔不改变游戏考试计时。

`dialogueDriver.run(choices, maxPages, inputs)` 的第三个参数可提供数字／文本输入答案数组或回调，实际填写客户端输入框并按回车，输入值随对话证据保存。NPC 联系等待允许原生 5 秒挖掘进度条结束。`prepare.py --run --pair 3` 创建新的独立账号对，支持 1–4；数据库容器和库名可分别用 `--database-container`、`--database` 指定，默认本机原生部署的数据库容器。
