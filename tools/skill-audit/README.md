# 技能审计工具

本目录持久化本次九条职业线、607 个技能审计使用的会话、实机操作片段和诊断脚本。范围与技能清单见[审查总览](../../docs/development/skill-review/README.md)，修复明细见[已修复问题](../../docs/development/skill-review/fixes.md)，后续工作见[未解决事项](../../docs/development/skill-review/pending.md)，已审查证据位于 [evidence](../../docs/development/skill-review/evidence)。它们属于根仓库版本管理，不再依赖 `work/skill-live/` 中的脚本。

## 只读核验

从根仓库执行：

```sh
python3 tools/skill-audit/verify.py --run --no-color
```

检查去重技能总数、处理状态、逐项证据、Git 跟踪状态、文档链接及已有证据哈希，不启动浏览器、不写数据库、不生成报告。所有 Python／MJS 命令行入口无参数时只显示帮助，提供 `--no-color`，业务执行须显式带 `--run`。

## 文件职责

| 文件 | 用途与条件 |
| --- | --- |
| `session.mjs` | 主测试浏览器／本地控制器；需 Chromium、Playwright、运行中的本地游戏及测试账号配置 |
| `partner-session.mjs`、`assist-session.mjs` | 双人／三人场景的另一个独立浏览器和账号；不能与已启动的相同端口会话重复运行 |
| `control.py` | 将指定 JS 片段交给本机已运行的控制器执行 |
| `init.js`、`*-helper.js`、`install-*.js` | 为会话建立操作、回包观察和技能前置学习工具 |
| 其他 `.js` | 当时使用的施放、交易、状态对照、复测、诊断及收尾片段；文件名对应技能或操作 |
| `coverage-tree.mjs` | 从当前服务端技能树和新测试产物提取覆盖数据，不改已入库快照 |
| `db-read.py` | 诊断查询入口；仅应使用人工审查后的只读 SQL，前缀检查不是 SQL 安全隔离 |
| `prepare-*-fixture.py` | 当时为鉴定／修理创建样本的条件更新，包含固定角色和库存 ID；移植前必须重新选择样本并核对离线状态，不能直接复用 ID |
| `read-live-battle-config.py`、`battle-config-offsets.cpp` | 读取本机地图服务实际配置；依赖当时构建的符号、布局及权限 |
| `scripts.json` | 持久化脚本清单及未保留的一次性工具 |

JS 文件是控制器内 `AsyncFunction` 的函数体，可以包含顶层 `return`，不是独立 Node CLI。它们依赖 `game`、`fs`、`assert`、`live`、`command` 等会话变量及前置初始化；不能按文件名排序批量执行。

## 实机使用边界

原脚本保留实际测试步骤及断言，包含角色 ID、地图、目标、物品索引、职业／属性、时间窗口、端口和当前客户端构建内部符号等环境假设。部分是失败采样后的续跑脚本，必须阅读对应证据并核对当前状态，不能将它们称为可无条件重放的回归套件。

运行入口示例（需要先准备专用测试环境）：

```sh
node tools/skill-audit/session.mjs --run
python3 tools/skill-audit/control.py --run tools/skill-audit/init.js 9341
```

会话使用 `work/runtime/automation-account.env`、`test-account.env`、`skill-assist-account.env` 等本机配置；不把账号密码、会话令牌或数据库配置放入 Git。账号准备使用现有[账号工具](../../scripts/account/README.md)，不保存原来写死密码的临时账号创建脚本。

执行片段可能实际改变测试角色的职业、技能、物品、货币和位置，或创建／关闭交易。操作前核对专用角色，执行后根据对应场景收尾；本次持久化没有执行这些操作。控制器仅供可信本机使用。

新测试输出继续写入忽略目录 `artifacts/skill-live/`，临时环境仍在 `work/runtime/`。这两个目录是运行时输出／私有配置，不是已入库证据的来源依赖。验收后人工选择需要保留的证据，更新 `docs/development/skill-review/evidence/` 和结果文档，不让实机脚本直接覆盖正式证据。

旧的一次性源码补丁、翻译生成、过程计数写入器和已被替代的验收统计器未保留。最终统计快照已入库，使用 `verify.py` 核验；不保留可重新写出过时结论的入口。此目录脚本已做语法和无参数帮助检查，没有在迁移后重新进行实机验收。

配置内存诊断的辅助程序须先编译到临时目录；结构为当时布局，服务端变更后必须重新核对，不能直接套用旧偏移：

```sh
mkdir -p work/skill-audit
c++ tools/skill-audit/battle-config-offsets.cpp -o work/skill-audit/battle-config-offsets
python3 tools/skill-audit/read-live-battle-config.py --run --no-color
```
