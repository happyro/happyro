# HappyRO

HappyRO 是一个基于 [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) 的开源中文 RO 项目，致力于提供完整的中文体验和简单易用的部署方式，让玩家打开浏览器即可进入游戏，省去安装桌面客户端的麻烦，也让开发者能够更轻松地部署、维护和参与项目。

## 项目基线

| 项目 | 基线 |
| --- | --- |
| kRO 客户端资源 | 2021-11-05（`RAG_SETUP_211105.exe`） |
| `PACKETVER` | `20211103` |
| 服务端模式 | Renewal |

| 依赖 | 版本或基线 |
| --- | --- |
| [rAthena](https://github.com/rathena/rathena) | `master` @ [`2fe6ab3dc4d8`](https://github.com/rathena/rathena/commit/2fe6ab3dc4d830b11d93fb44c3b48436571890bd) |
| [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) | `master` @ [`402e61ce7ae8`](https://github.com/MrAntares/roBrowserLegacy/commit/402e61ce7ae80cd45c76365371d4dbfd6aa10f49) |
| [HappyRO Gateway](https://github.com/happyro/happyro-gateway) | `main` @ [`400dad7`](https://github.com/happyro/happyro-gateway/commit/400dad7)（基于 [RemoteClient-JS](https://github.com/FranciscoWallison/roBrowserLegacy-RemoteClient-JS)） |
| Node.js | 22 或更高版本 |
| MariaDB | 10.11 |
| LUB 回编译工具链 | Lua 5.0.2、Lua 5.1.5 |

## 项目组成

HappyRO 由一个编排仓库和三个独立的应用仓库组成：

- 根仓库：部署脚本、配置、资源链接和文档。
- [happyro-client](https://github.com/happyro/happyro-client)：浏览器客户端和 PWA 构建产物。
- [happyro-server](https://github.com/happyro/happyro-server)：基于 rAthena 的登录、角色、地图和 Web API 服务。
- [happyro-gateway](https://github.com/happyro/happyro-gateway)：Node.js 网关、静态资源服务和 WebSocket 代理。

## 关于汉化

AI 并不能自动完成高质量的汉化，尤其是在面对数量庞大、结构复杂的客户端和服务端文件时。单个文件可能有几千甚至上万行，直接交给 AI 处理不仅速度慢，也容易出现遗漏、误改和格式损坏。

HappyRO 采用分阶段的方式处理汉化：先让 AI 扫描项目中的文件，整理出可能包含玩家可见文本的清单；再将需要处理的文件按约 500 行分片，交由多个 Agent 分别翻译，最后统一合并、校验并回写。由于文件数量很多，Agent 仍可能漏翻文本、误翻程序标识，或者在回写时破坏原有格式。项目早期刚合并翻译分片时，甚至出现过进入游戏后人物只剩下一个头部模型的情况。之后虽然进行了大量修复和校正，但这可能还只是冰山一角。

kRO 客户端中的部分文字保存在 LUB 文件中，不能直接修改。项目会先将 Lua 5.0 和 Lua 5.1 字节码提取为结构化数据，再翻译其中的玩家可见文本，经过校验后重新编译为对应版本的 LUB 文件，并进行运行时验证。

运行时汉化还会遇到更多情况：有些文字来自图片，有些文件使用特殊编码，有些译文会被其他资源覆盖，还有一些内容只有进入游戏后才能确认是否生效。因此，项目无法保证所有内容都达到 100% 汉化，只能优先完善玩家最常接触的界面和功能，并在发现问题后持续修复。

汉化问题会在使用中逐步发现，项目会持续修复和完善，稳定性也需要时间积累。

## 版权资源

kRO 客户端资源属于第三方版权内容，未经授权不得分发，可加群交流：

- QQ：`928171346`
- 名称：[熊猫模拟器](https://github.com/PandasWS/Pandas)

群里有很多技术大佬，提问、求助或索取资源时，请尊重他人的时间和劳动成果。

## 开源协议

[GNU General Public License v3.0](LICENSE)
