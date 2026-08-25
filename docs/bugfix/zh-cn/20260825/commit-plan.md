# 提交计划与执行记录

本文件记录本批次的提交边界。提交前复核 diff，保持一个提交一个逻辑变更，并遵守 `type(scope): subject`。本批次只提交三个目标仓库，不推送远端。

## 本批次执行

为便于回溯，本次将每个仓库的同一批修复合并为一个提交：

- 根仓库：`fix(i18n): complete zh-cn localization repair`
- `happyro-client`：`fix(i18n): complete zh-cn client localization`
- `happyro-server`：`fix(i18n): localize server motd`

提交完成后，将实际短哈希补录到本节。

实际提交：

- 根仓库：本文件所在提交，以根仓库 `git log -1` 为准
- `happyro-client`：`fc9503e5`
- `happyro-server`：`2c9117b18`

## 根仓库

建议拆为：

1. `fix(i18n): preserve zh-cn translation sources`：agent 分块、清单和与目标源码一致的翻译源。
2. `fix(localization): serve zh-cn runtime overrides`：`localization/client`、`.env.example` 和资源/健康检查脚本。
3. `docs(bugfix): document zh-cn repair 20260825`：本目录。

另行使用 `build(i18n): publish verified kRO translation outputs` 提交 `docs/translation/zh-cn/kro-20211105/merged/**`，确保 files、manifest 和 validation 来自同一批次。`work/**` 始终不提交。

## happyro-client

建议拆为：

1. `fix(i18n): load zh-cn runtime localization`：DBManager、CodepageManager、技能描述模块及测试。
2. `fix(i18n): localize client data and controls`：地图、职业、技能名称和各 UI 文案。
3. `fix(ui): repair localized dialog layouts`：只在 CSS/资源降级足够独立时拆出，否则与对应 UI 文案同交。
4. `fix(mail): repair detached Rodex lifecycle`：Rodex 运行逻辑。

实际拆分时，源文件与对应测试必须放在同一个逻辑提交中；不要机械按目录拆分。

## happyro-server

当前建议单独提交：

- `config(i18n): localize server motd`

C_Persika 已在既有提交中，不重复纳入。

## gateway

当前明确可归属的提交：

- `fix(resources): decode mixed-encoding path segments`

`index.js` 与 `package.json` 必须先确认来源，再决定各自提交；`AI/BGM/System` 运行链接不提交。所有仓库只推送各自 `origin`，且当前未授权推送。
