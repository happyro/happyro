# HappyRO 代理说明

本仓库属于仅限局域网运行的 HappyRO Web 栈。

## Git 规则

- HappyRO 自有提交必须使用 type(scope): subject 格式。
- scope 必须存在，使用小写英文；破坏性变更使用 type(scope)!: subject，并在正文说明迁移方式。
- 允许的 type：feat、fix、config、docs、refactor、test、build、ci、chore、perf、style、revert。
- subject 使用祈使语气的英文，不以句号结尾，首行总长度不超过 72 个字符。
- 一个提交只包含一个逻辑变更；上游合并提交和上游作者提交不受此限制。
- lang/zh-cn 是长期中文产品分支；语言分支不合并回 main。
- 三个仓库只推送到各自的 origin，不推送到 upstream。
- 未经用户明确要求，不提交、不推送。

## 仓库边界

- 运行时不得使用公共 GRF 或公共 WebSocket 服务。
- 固定 PACKETVER=20211103、Renewal，以及客户端和服务端一致的封包设置。
- inputs/official/ 和 inputs/runtime/kro-20211105/ 中经过核验的官方 kRO 2021-11-05 文件视为不可修改的源材料。
- 不得使用第三方翻译客户端、批量翻译表、私服可执行文件或私服配置作为来源。
- 生成文件放在 work/ 或 artifacts/；客户端资源、密钥、数据库数据、截图、测试输出和运行时文件不得提交。
- docs/zh-cn/agent-xx/chunks/ 是翻译期间的临时切片工作区，不属于产品源码或运行时资源。
- repos/happyro-client 和 repos/happyro-server 是独立 Git 仓库。
- vendor/robrowserlegacy-remote-client-js 是固定版本的第三方代码；HappyRO 兼容补丁留在本仓库，不创建自有 fork。

## 中文产品分支

- 三个仓库中属于产品且已纳入 Git 跟踪的源码、脚本、数据库、配置和客户端数据文件，翻译结果最终必须直接写回原文件；翻译期间使用 docs/zh-cn/agent-xx/chunks/ 的临时切片，不建立新的 locale 或 overlay 源码树。
- 翻译对象包括英文、韩文及其他语言的非中文内容，不限于英文。
- 翻译不得改变 NPC ID、数据库 ID、变量、控制流、任务条件、奖励逻辑、占位符、颜色码或安全相关命令。
- NPC 唯一名、变量名、事件标签、代码标识符和玩家自定义角色名保持原样。
- 玩家可见人名默认使用稳定中文名；已有官方或项目译名时沿用，其他语言人名通常采用中文音译，英文人名无既定译名时选择稳定音译。
- 特定术语可按语境保留原样，例如 Zeny；同一语境中必须保持一致。
- 翻译总清单和四个 agent 的工作目录位于 docs/zh-cn/translation-manifest.tsv 和 docs/zh-cn/agent-xx/。
- 新增译名、人名和保留项先登记到对应 agent 的 terms-names.csv，最终合并到 docs/zh-cn/terms-names.csv。
- 实际翻译完成的文件或切片才登记到对应 agent 的 translated-files.tsv，最终合并到 docs/zh-cn/translated-files.tsv。
- 翻译期间每个 agent 只修改自己 docs/zh-cn/agent-xx/ 下的切片和记录，不写回正式源码，不修改根目录总表，不提交代码。
- 超过 500 行的文件必须按原始行范围切成每片最多 500 行；不同切片可以分配给不同 agent，但切片范围不得重叠或遗漏。
- 翻译切片必须保持原始物理行数；不确定的边界行保留原文，不删除或新增行；全部 agent 完成后才合并回正式源码。
- 翻译进度以去重后的已处理源文件数统计；文件的全部工作单元得到已翻译、跳过或阻塞状态后计数，切片数量只用于 agent 内部恢复。
- 每个 agent 的 progress.md 必须按已处理源文件数记录百分比；根目录只记录去重后的已处理文件数量，不记录百分比。
- 状态只使用待处理、进行中、已翻译、跳过、阻塞，不使用待复核或待验收。
- text_scope=unknown 只能作为初始状态；agent 必须完成分类后才能结束工作单元。
- 不得使用脚本、批量翻译或预生成翻译内容；每个工作单元必须由 agent 独立处理。
- 代码注释、变量名、函数名、标签、协议字段和代码逻辑不翻译，由 agent 判断并在 manifest notes 中记录跳过原因。
- 中文汉化工作流和文档入口见 docs/zh-cn/README.md。
- 当前阶段不进行自动测试，agent 必须独立完成判断和翻译，不依赖人工逐项处理。
