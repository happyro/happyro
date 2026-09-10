# HappyRO

HappyRO 是一个基于 [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) 的开源中文 RO 项目。玩家打开浏览器即可进入游戏，不必安装桌面客户端；开发者可以在同一套固定版本基线上部署、维护和参与项目。

## 在线演示

[roBrowser 应用启动器](https://happyro-demo.kugarocks.com/applications/pwa/index.html)

## 项目组成

HappyRO 由一个编排仓库和四个独立的应用仓库组成：

- 根仓库：部署脚本、配置、本地化资源、文档和编排入口。
- [happyro-client](https://github.com/happyro/happyro-client)：浏览器客户端和 PWA 构建产物。
- [happyro-server](https://github.com/happyro/happyro-server)：基于 rAthena 的登录、角色、地图和 Web API 服务。
- [happyro-gateway](https://github.com/happyro/happyro-gateway)：Node.js 网关、静态资源服务和 WebSocket 代理。
- [happyro-admin](https://github.com/happyro/happyro-admin)：GM 管理后台，包含 Laravel API 和 Ant Design Pro 前端。

各仓库职责和数据边界见 [仓库边界](docs/architecture/repository-boundaries.md)。

## 项目基线

| 项目 | 基线 |
| --- | --- |
| kRO 客户端资源 | 2021-11-05（`RAG_SETUP_211105.exe`） |
| `PACKETVER` | `20211103` |
| 服务端模式 | Renewal |

## 依赖基线

| 依赖 | 版本或基线 |
| --- | --- |
| [rAthena](https://github.com/rathena/rathena) | `master` @ [`2fe6ab3dc4d8`](https://github.com/rathena/rathena/commit/2fe6ab3dc4d830b11d93fb44c3b48436571890bd) |
| [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) | `master` @ [`402e61ce7ae8`](https://github.com/MrAntares/roBrowserLegacy/commit/402e61ce7ae80cd45c76365371d4dbfd6aa10f49) |
| [RemoteClient-JS](https://github.com/FranciscoWallison/roBrowserLegacy-RemoteClient-JS) | HappyRO Gateway `main` @ [`400dad7`](https://github.com/happyro/happyro-gateway/commit/400dad7) |
| Node.js | 22 或更高版本 |
| MariaDB | 10.11 |
| LUB 回编译工具链 | Lua 5.0.2、Lua 5.1.5 |

## 最短启动路径

本机开发默认通过根仓库 `Makefile` 和 systemd transient units 启动，不使用完整 Docker Compose 作为当前运行方式。

```bash
make doctor
make database-start
make configure-server
make build-server
make server-start
make configure-client
make configure-gateway
make configure-resources
make gateway-start
```

浏览器打开 <http://127.0.0.1:3338/applications/pwa/index.html>。完整步骤、依赖和常见命令见 [本地开发](docs/development/local-setup.md)。

## 文档导航

| 入口 | 说明 |
| --- | --- |
| [文档总览](docs/README.md) | 全部文档的分类入口 |
| [系统概览](docs/architecture/system-overview.md) | 浏览器到 Gateway、Server、Admin 的调用关系 |
| [本地开发](docs/development/local-setup.md) | 安装、启动和常用命令 |
| [运维](docs/operations/services.md) | 服务、端口、故障检查 |
| [本地化](docs/localization/overview.md) | 中文资源、客户端生效链和校验 |
| [游戏资料](docs/game-data/README.md) | 物品、魔物、地图、NPC 目录 |

## 相关站点

| 站点 | 地址 |
| --- | --- |
| 阿里云 | [happyro.kugarocks.com](https://happyro.kugarocks.com) |
| GitHub Page | [happyro.org](https://happyro.org) |

安装教程：[Docker](https://happyro.kugarocks.com/installation/docker) / [Linux](https://happyro.kugarocks.com/installation/linux) / [macOS](https://happyro.kugarocks.com/installation/macos) / [Windows](https://happyro.kugarocks.com/installation/windows)

## kRO 客户端

[kro-20211105.zip](https://pan.baidu.com/s/1dHzJ2RGMt4zZkA-MXF_BxQ?pwd=jy3k) 仅供个人学习与研究，任何商业用途均须自行承担相应责任。

## 联系方式

- QQ 群：`662191549`
- 群名：HappyRO

## 开源协议

[GNU General Public License v3.0](LICENSE)
