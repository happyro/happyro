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
- repos/happyro-client 和 repos/happyro-server 是独立 Git 仓库。
- vendor/robrowserlegacy-remote-client-js 是固定版本的第三方代码；HappyRO 兼容补丁留在本仓库，不创建自有 fork。

## 中文产品分支

- 三个仓库中属于产品且已纳入 Git 跟踪的源码、脚本、数据库、配置和客户端数据文件，翻译时都必须直接修改；不能建立新的 locale 或 overlay 源码树。
- 翻译对象包括英文、韩文及其他语言的非中文内容，不限于英文。
- 翻译不得改变 NPC ID、数据库 ID、变量、控制流、任务条件、奖励逻辑、占位符、颜色码或安全相关命令。
- NPC 唯一名、变量名、事件标签、代码标识符和玩家自定义角色名保持原样。
- 玩家可见人名默认使用稳定中文名；已有官方或项目译名时沿用，其他语言人名通常采用中文音译，英文人名无既定译名时选择稳定音译。
- 特定术语可按语境保留原样，例如 Zeny；同一语境中必须保持一致。
- 新增译名、人名和保留项登记到 docs/zh-cn/terms-names.csv。
- 中文汉化工作流和文档入口见 docs/zh-cn/README.md。
- 当前阶段不进行自动测试，全部源码翻译完成后由用户统一手动验收。

