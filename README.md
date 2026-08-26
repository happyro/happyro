# HappyRO

HappyRO 致力于提供一个简单易用、汉化完整、自由开放的 RO 世界。得益于现代浏览器技术的发展和 roBrowserLegacy 的持续演进，现在无需安装桌面客户端，便可以直接在浏览器中运行《仙境传说》。这既减少了传统客户端的兼容问题和存储负担，也让游戏能够运行在 macOS、iPadOS 等支持现代浏览器的平台上。

项目基于 rAthena、roBrowserLegacy 和 RemoteClient-JS 开发。个人精力有限，问题和疏漏在所难免；我会定期整理大家反馈的问题并集中修复。希望这个项目能让大家找回小时候的感觉，偶尔回到南门走一走。

## 关于汉化

HappyRO 的汉化不是简单替换一份语言文件。项目首先扫描客户端、服务端和运行资源中的源文件，识别需要处理的文本，再将结果拆分成可追踪、可校验的工作分片，交由多个 AI Agent 并行翻译，最后统一合并。

AI 翻译可能出现误译、漏译，也可能破坏文件格式或造成内容不一致，因此首次合并的 `merged` 版本不能直接作为发布结果。当前版本是在初次合并后，经过多轮格式检查、内容校准、实机验证和问题修复才逐步形成的；后续仍会根据实际游戏体验持续修正。

kRO 客户端资源采用独立流程处理。二进制 LUB 资源则先提取为结构化 JSON，分片翻译其中玩家可见的文本，合并校验后再回编译为对应的 Lua 5.0 或 Lua 5.1 字节码。生成结果还要经过逐值语义回环和客户端实机验证，确认键名、索引、控制流及运行时行为没有改变。整个过程始终保持官方输入资源只读。

`docs/translation/zh-cn/` 仅保存已完成翻译批次的历史记录，不再用于当前翻译或发布。产品翻译直接维护在 `repos/happyro-client`、`repos/happyro-server` 和 `localization/client/data`，不得从归档目录回写。

## 版权与资源获取

项目所需的 kRO 客户端资源属于第三方版权内容，受原权利人的版权和许可条款约束，不能随项目源码在 Git 仓库中公开分发。使用者需要自行确认资源来源及使用方式符合相关授权和当地法律。如需了解本项目兼容的资源版本和准备方式，可以加入 QQ 交流群联系：

- QQ 群：`928171346`
- 群名称：熊猫模拟器

## 仓库结构

```text
happyro/
├── configs/                         # 客户端默认配置
├── deploy/                          # 数据库、服务端和网关默认配置
├── docs/                            # 部署文档与历史归档
├── inputs/                          # 官方源材料与运行时资源
├── localization/client/data/        # 客户端中文运行时覆盖
├── repos/happyro-client/            # roBrowserLegacy 派生仓库
├── repos/happyro-server/            # rAthena 派生仓库
├── scripts/                         # 构建、运行和维护脚本
├── vendor/robrowserlegacy-remote-client-js/
└── work/                            # 本地生成文件与运行状态
```

根仓库、客户端和服务端是三个独立 Git 仓库，只推送到各自的 `origin`。

## 安装部署

先按实际环境修改以下配置：

- `configs/Config.happyro.js`：客户端和游戏服务器连接配置；
- `deploy/mariadb/profile.env`：数据库配置；
- `deploy/rathena/profile.env`：rAthena 服务配置；
- `deploy/remote-client/.env.example`：资源网关配置。

部署前，将准备好的 kRO 运行时资源放入 `inputs/runtime/kro-20211105/client/`。其中 `data.grf` 和 `DATA.INI` 为必需文件；需要音乐、人工生命 AI 和系统字体时，同时放入对应目录：

```text
inputs/runtime/kro-20211105/client/
├── data.grf
├── DATA.INI
├── AI/                              # 可选
├── BGM/                             # 可选
└── System/                          # 可选
```

资源就位后，准备并构建客户端：

```bash
make configure-client
npm --prefix repos/happyro-client install
npm --prefix repos/happyro-client run build:pwa
make configure-resources
```

按依赖顺序启动数据库，构建并启动服务端，最后启动网关：

```bash
make database-start
make build-server
make server-start
make gateway-start
```

停止全部服务：

```bash
make gateway-stop
make server-stop
make database-stop
```

## 测试

检查本地环境和仓库配置：

```bash
make doctor
```

运行客户端和网关测试：

```bash
make test-client
make test-gateway
```

验证已启动的数据库、服务端和网关：

```bash
make database-verify
make server-verify
make gateway-verify
make status
```

HappyRO 自有修改记录在 [`changelog/`](changelog/README.md)。
