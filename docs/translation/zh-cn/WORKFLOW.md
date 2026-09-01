# zh-cn 翻译、修复与发布流程

本文是 HappyRO 简体中文翻译工作的端到端流程入口。工作区规则、工具参数和具体批次记录仍由各自文档维护；当它们对阶段顺序或产物边界描述不一致时，以本文为准。

## 适用范围

流程覆盖两条相互独立、可以并行推进的翻译线：

| 工作区 | 输入 | 正式翻译产物 | 最终去向 |
| --- | --- | --- | --- |
| `client-server` | `repos/happyro-client`、`repos/happyro-server` 的冻结源码 | `docs/translation/zh-cn/client-server/merged/` | 回写两个独立源码仓库 |
| `kro-20211105` | 只读的官方 kRO 2021-11-05 材料及提取基线 | `docs/translation/zh-cn/kro-20211105/merged/` | 回编译为客户端资源或发布直接文本 |

`repair/` 是翻译分片校验失败后的可选修复回路；`docs/bugfix/` 是运行验证发现产品缺陷后的追踪记录。二者都不是新的翻译维护源。

## 记录归属

| 内容 | 保存位置 |
| --- | --- |
| 长期流程和完成条件 | 本文 |
| 翻译分片、清单、术语和正式 merged | 对应 `docs/translation/zh-cn/<workspace>/` |
| 一次运行的合并、编译、回写和检查记录 | `work/translation-release/<workspace>/<batch>/` |
| 可分配的翻译内容修复 | `docs/translation/zh-cn/repair/<batch>/` |
| 构建产物 | `artifacts/` |
| 产品缺陷、根因、验证和提交计划 | `docs/bugfix/<locale>/<batch>/` |
| 已发布的简短用户可见变化 | 项目 changelog（存在时） |

## 完整流程

```text
冻结输入与建立基线

+----------------------------------------+    +-------------------------------------------+
|  client-server                         |    |  kRO                                      |
+----------------------------------------+    +-------------------------------------------+
|  agents                                |    |  agents                                   |
|    |                                   |    |    |                                      |
|    +-- 阻塞 -> 解决任务                |    |    +-- 阻塞 -> 解决任务                   |
|    |                                   |    |    |                                      |
|    v                                   |    |    v                                      |
|  validate chunks                       |    |  validate chunks                          |
|    +-- 失败 -> repair -> 重试          |    |    +-- 失败 -> repair -> 重试             |
|    v                                   |    |    v                                      |
|  merge 到 work/                        |    |  merge 到 work/                           |
|    v                                   |    |    v                                      |
|  validate merged                       |    |  validate merged + validate-kro           |
|    +-- 失败 -> 修源/工具 -> 重试       |    |    +-- 失败 -> 修源/工具 -> 重试          |
|    v                                   |    |    v                                      |
|  晋级正式 merged/                      |    |  晋级正式 merged/                         |
|    +-- 失败 -> 回滚重试                |    |    +-- 失败 -> 回滚重试                   |
|    v                                   |    |    v                                      |
|  回写 client/server                    |    |  LUB 回编译 + 直接文本发布                |
|    +-- 失败 -> 检查映射/备份 -> 重试   |    |    +-- 失败 -> 修 ABI/资源路径 -> 重试    |
+----------------------------------------+    +-------------------------------------------+
                       |                                       |
                       +---------------------------------------+
                                           |
                                  构建、重启、运行验证
                                           |
                                +----------+----------+
                                |                     |
                             发现缺陷               通过
                                |                     |
                          bugfix 根因分类       分仓库提交
                                |
                          修复真实维护源
                                |
                          回到受影响的最早阶段
```

## 1. 冻结输入和批次

每次运行先确定唯一 `<batch>`，推荐使用 `YYYYMMDD-NN`。同一批次的临时输出必须使用新目录，不能覆盖上一轮证据。

开始前确认：

- client/server 的源码提交和清单基线已经冻结，分片仍对应原始行范围。
- kRO 的不可变官方输入来自 `inputs/official/`；`inputs/runtime/kro-20211105/` 是客户端运行目录，可由发布工具写入已通过校验的翻译产物。
- LUB 提取基线、Lua 版本和目标 ABI 已登记。
- `work/` 用于可重建的临时产物，`artifacts/` 用于构建产物，两者都不是翻译维护源。

如果源代码已经漂移，应先重新建立基线和分片，不能让合并器对错误行范围强行回写。

## 2. Agent 翻译

两个工作区可以并行，但不能共用 agent 状态或清单。

Agent 只修改自己的：

- `chunks/translated/`
- `manifest.tsv`
- `translated-files.tsv`（工作区存在时）
- `progress.md`
- `terms-names.csv`（工作区存在时）

本阶段不修改目标源码、不生成完整合并文件，也不提交。进入校验前，所有工作单元必须处于终态；`阻塞` 需要先解决，不能在正式发布中使用 `--allow-incomplete` 绕过。

当正式仓库已经发生 bugfix 或翻译回写后，旧 agent 分片不再是当前源码基线。日常 bugfix 直接修改源码维护源，不要求为每次修复重新分片；源一致性错误不得通过指定旧备份或关闭检查绕过。旧批次保留为历史审计，不能直接作为新的 writeback 输入。只有明确启动新翻译项目时，才从最新仓库重新扫描和分片。

工作区细则见 [client-server/README.md](client-server/README.md) 和 [kro-20211105/README.md](kro-20211105/README.md)。

## 3. 校验原始分片

分别校验两个工作区，不复用默认目录：

```bash
python3 tools/translation/validate/main.py chunks \
  --root docs/translation/zh-cn/client-server/agents \
  --all

python3 tools/translation/validate/main.py chunks \
  --root docs/translation/zh-cn/kro-20211105/agents \
  --all
```

颜色码、占位符、转义符、替换字符、清单重复项和译文登记缺失属于错误。物理行数变化默认只是复核项；只有业务确实要求固定行数时才使用 `--strict-lines`。

完成条件：命令无错误退出，所有警告都有明确复核结论。

## 4. 使用发布工具生成批次

推荐使用统一发布工具。它会在 `work/translation-release/<workspace>/<batch>/` 中依次执行分片校验、合并、merged 校验和 kRO Lua 回编译；默认只生成临时结果和 dry-run 计划：

client-server 若使用已回写仓库对应的冻结基线合并，并且校验只出现已复核的结构审阅告警，可增加 `--allow-review-findings`；日志中的 `Errors` 仍必须为 0。

```bash
python3 tools/translation/release/main.py \
  --workspace client-server \
  --batch <batch>

python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch <batch>
```

每个输出目录的 `merged/` 必须同时包含 `files/`、`manifest.tsv` 和 `validation/merge-warnings.tsv`；kRO 还会在 `artifacts/lua50/`、`artifacts/lua51/` 保存回编译产物。临时合并结果不能直接视为正式源。

## 5. 校验完整合并文件

对每个工作区使用自己的 agent 根目录、合并目录和 manifest：

```bash
python3 tools/translation/validate/main.py merged \
  --root docs/translation/zh-cn/client-server/agents \
  --all \
  --merged-root work/translation-release/client-server/<batch>/merged/files \
  --merged-manifest work/translation-release/client-server/<batch>/merged/manifest.tsv

python3 tools/translation/validate/main.py merged \
  --root docs/translation/zh-cn/kro-20211105/agents \
  --all \
  --merged-root work/translation-release/kro-20211105/<batch>/merged/files \
  --merged-manifest work/translation-release/kro-20211105/<batch>/merged/manifest.tsv

node tools/workspace/validate-kro/main.mjs
```

还应按文件类型执行结构解析，例如 JSON、YAML、HTML 或源码语法检查。工具报告的 `需复核` 不能仅因“命令退出成功”而忽略。

完成条件：结构错误为零、未完成文件为零、复核项有结论，并能从 manifest 追溯每个输出文件的来源。

## 6. Repair 修复回路

只有在分片或合并文件出现批量、可分配的内容问题时，才建立：

```text
docs/translation/zh-cn/repair/<batch>/
```

没有活动批次时不保留 `repair/` 目录或批次索引。批次完成、修复结果回填原工作区并通过重新校验后，删除对应 repair 工作区；历史记录由 Git 保留。

Repair agent 的 `fixed/` 是临时修复结果。协调者复核后必须按 `target_file` 回填原工作区的 `agents/*/chunks/translated/`，同步对应 manifest、进度和术语记录，然后从“校验原始分片”重新开始。

禁止只修改以下位置：

- `repair/*/fixed/`
- `work/translation-release/**`
- 目标仓库中已经回写的文件

否则下一次合并会重新产生同一问题。具体 repair 批次规则由该批次自己的 README 和 AGENTS.md 管理。

## 7. 晋级正式 merged 和回写

校验和编译全部通过后，使用 `--promote-merged` 将本批次的 `files/`、`manifest.tsv`、`BATCH_STATE` 和 `validation/` 晋级到正式 `docs/translation/zh-cn/<workspace>/merged/`。默认仍是 dry-run；确认计划后才增加 `--write`。

kRO 晋级并写入运行时：

```bash
python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch <batch> \
  --promote-merged \
  --runtime-root inputs/runtime/kro-20211105/client
```

确认 dry-run 后，使用同一命令增加 `--write`。被替换的正式 merged 和运行时文件会备份到当前批次的 `backup/`。

client-server 晋级并回写两个源码仓库：

```bash
python3 tools/translation/release/main.py \
  --workspace client-server \
  --batch <batch> \
  --allow-review-findings \
  --promote-merged \
  --target-root client=repos/happyro-client \
  --target-root server=repos/happyro-server
```

确认目标和文件数后，在同一命令末尾增加 `--write`。发布工具只发布 manifest 登记的文件，不删除目标中的旧文件；正式 merged 的元数据和验证报告由 `--promote-merged` 一并晋级。

晋级时还必须从各 agent 清单生成工作区根 `translated-files.tsv`，并对 agent 术语表去重、处理冲突后更新根 `terms-names.csv`。这些汇总表不能直接拼接，因为工作区根表与 agent 表的 schema 可能不同。

完成条件：正式 `merged/files/`、正式 manifest 和验证记录来自同一批次，Git diff 中没有过期合并文件。

## 8. 发布到目标

### client-server

使用发布工具从同一个临时批次晋级正式 merged 并回写两个独立仓库：

```bash
python3 tools/translation/release/main.py \
  --workspace client-server \
  --batch <batch> \
  --promote-merged \
  --target-root client=repos/happyro-client \
  --target-root server=repos/happyro-server \
  --write
```

回写结束后分别检查两个仓库的 `git diff`，并运行各自的语法、单元测试和构建检查。

### kRO

使用发布工具从同一个临时批次晋级正式 merged、回编译 Lua 5.0/5.1，并写入运行时资源：

```bash
python3 tools/translation/release/main.py \
  --workspace kro-20211105 \
  --batch <batch> \
  --promote-merged \
  --runtime-root inputs/runtime/kro-20211105/client \
  --write
```

编译器执行字节码 ABI 检查和语义回环；直接文本按工具记录的资源路径发布。运行时目标受 `--runtime-root` 限制，并由当前批次的 `backup/runtime/` 提供回滚备份。

### 当前自动化边界

- 发布工具不会删除目标中的旧文件；过期文件必须在复核后单独清理。
- 发布工具不会重建数据库、重启服务或执行浏览器审计。
- 浏览器审计证据和 bugfix 文档仍由批次流程整理，尚未由单一命令自动关联。

## 9. 构建、重启和运行验证

发布后按变更范围执行：

- 重建 happyro-client PWA。
- 重新配置并重启资源网关，使 loose-data、LUB 和链接生效。
- 服务端脚本、YAML 或配置发生变化时，按 rAthena 支持的 reload 或重启方式加载。
- 只有 SQL schema 或迁移变化才重建/迁移数据库；普通 YAML、UI 和资源修复不触发数据库重建。
- 执行自动浏览器审计和关键路径手工验收，检查韩文、乱码、替换字符、空文案、资源 404 和交互回归。

自动检查通过不替代实际渲染验证，尤其是字体、编码、图片路径、对话框布局和客户端 Lua 加载链。

## 10. Bugfix 记录与源头回修

运行验证发现产品缺陷时，在 `docs/bugfix/<locale>/<batch>/` 建立或更新记录。Bugfix 文档保存现象、根因、代码归属、环境操作、验证证据和提交计划，但不取代维护源。

根据根因回修：

| 根因 | 必须修复的位置 |
| --- | --- |
| 译文内容错误 | 原 agent translated 分片及清单 |
| 合并破坏结构 | merge/validate 工具或分片源，随后重新合并 |
| client/server 运行逻辑 | 对应目标仓库源码，并同步存在的翻译源分片 |
| kRO 构建错误 | 提取/回编译工具或正式 JSON 源 |
| 资源、编码或部署错误 | gateway、资源脚本或环境配置源 |
| 临时 `work/` 文件错误 | 找到上述真实维护源，禁止只修临时文件 |

修复后回到受影响的最早阶段重新执行，而不是只重复最后一次构建。

## 11. 提交与完成条件

根仓库、happyro-client、happyro-server 和嵌套 gateway 是独立 Git 工作树。提交前逐一检查状态，按逻辑拆分提交，只推送各自 `origin`；未经明确授权不提交、不推送。

一个批次只有同时满足以下条件才算完成：

- agent 分片和清单是最终维护源，不依赖 repair 或 work 中的孤立修复。
- chunks、merged 和结构化文件校验通过，警告已复核。
- 正式 `merged/files/`、manifest 和验证记录属于同一批次。
- 工作区根 translated-files 和术语表已按当前 agent 状态完成汇总。
- client/server 目标源码与正式 merged 一致。
- kRO LUB 已通过目标 ABI 构建和语义回环，直接文本已进入正确资源路径。
- 所需构建和服务重启已完成，不必要的数据库重建没有执行。
- 自动审计与手工关键路径验收通过。
- bugfix 记录中的每项修复都能追溯到真实维护源。
- 各工作树的提交边界、生成物排除项和剩余风险已经明确。

## 相关文档

- [中文翻译工作区](README.md)
- [翻译工具说明](../../../tools/translation/README.md)
- [LUB 回编译工具](../../../tools/client/build/README.md)
- [Bugfix 记录](../../bugfix/README.md)
