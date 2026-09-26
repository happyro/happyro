# 移动端性能日志回传

手机访问本机 Gateway 的调试入口后，日志自动写入接收机器，无需复制、截图或连接 Safari 检查器：

```text
http://<Mac局域网IP>:3338/applications/pwa/index.html?debug=1
work/diagnostics/client/YYYY-MM-DD/<会话UUID>.jsonl
```

日期目录使用 UTC。每次重新进入游戏页面建立一个独立会话，首条 `debug.enabled` 包含构建标识、浏览器和 DPR。接收时间 `receivedAt` 来自服务器，事件时间和 `elapsedMs` 来自手机，分析事件先后应使用同一会话的 `elapsedMs`。

已采集的问题记录见 [2026-09-24 iOS 攻击音效卡顿调查](../history/validation/2026-09-24-ios-audio-stutter.md)，包含实机数据、结论边界、Web Audio 修复实现与实机验收状态。

## 开启接收

Gateway 的 `.env` 配置如下；相对目录基于 Gateway 进程工作目录解析：

```dotenv
CLIENT_DIAGNOSTICS_DIR=../../work/diagnostics/client
```

空值或未配置时，接收接口返回 404。配置后重启 Gateway。手机需要显式使用 `?debug=1`，普通入口不开启采集。所有日志只回传到当前页面同源的 Gateway，不提供公开下载日志的接口。

修改客户端后必须完整构建 `npm run build -- --all`。构建清单同时校验 `debug.js`、`debug-upload.js` 和 `Online.js`；只重启 Gateway 不会更新客户端代码。

## 当前 Mac 的物理运行环境

当前采用 Docker 数据库与 macOS 原生应用的混合部署。应用由用户级 launchd 管理，配置在 `work/runtime/native/launchd/`，仅加载到当前登录会话，不注册开机启动：

```bash
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh stop --no-color
bash scripts/local/macos-services.sh start --no-color
```

该命令只管理已经配置的容器与进程，不负责首次安装。数据库使用独立的 `happyro-native-database` Docker 容器（Compose 项目为 `happyro-native`）；login/char/map/web、Node Gateway、Admin 的 Laravel 后端和 Umi 前端均在 macOS 原生运行。启动时先等待 Docker 数据库健康，停止时先退出应用再停止数据库，不删除数据。客户端构建固定 Renewal / PACKETVER=20211103 / 不混淆封包，保留启动页和全部查看器。

本机独立数据库包含 `happyro`、`happyro_log` 和 `happyro_admin`，数据位于 `artifacts/deployment/install/happyro-v0.3.1/data/database/`；完整 Docker 游戏栈的数据库使用 `artifacts/deployment/install/happyro-v0.3.2/data/database/`，二者不共享数据目录。独立数据库由 `work/runtime/native/database-compose.json` 定义，固定映射 `127.0.0.1:13306:3306`，应用通过主机端口连接，不依赖容器 IP。该配置含凭据，不提交；不得使用完整游戏栈的 Compose 管理本机独立数据库。其他 Docker 应用容器保持停止，不同时启动两套应用。游戏服务器仅监听回环地址，通过 Gateway 的 WebSocket 代理供手机访问。Gateway 监听 3338。数据库、内部服务密码和本地验收账号保存在权限为 0600 的 `work/runtime/native/credentials.json`，不要提交或放入诊断日志。

原生 MariaDB 已停止，其 launchd 配置已移入切换备份；旧数据目录 `work/runtime/native/database/` 保留。两套数据库的 SQL 备份及切换前配置保存在 `work/runtime/native/backups/`，本次备份路径记录于 `work/runtime/native/hybrid-backup-path.txt`。不要删除数据库数据目录、切换备份或整个 `work/runtime/`。

本机 `repos/happyro-server/conf/import/packet_conf.txt` 配置 `allow: 127.0.0.1`，用于上述仅监听回环地址的原生环境。Gateway 转发的玩家连接和服务间连接都来自该地址；2026-09-25 曾被角色服务的连接频率检查标记为 DDoS，表现为登录成功后连接角色服务立即断开、地图服务反复重连。增加本机地址允许规则并重启 login／char／map 后恢复。运行配置位于 Git 忽略目录，其他机器部署时需按自身入口配置；进程显示 running 不代表服务间连接已恢复，应继续确认 char 收到地图注册并实际登录游戏。

账号和角色沿用 Docker 库，当前本地验收使用已有 `happyro` 账号；旧原生库的 `happytest` / `MobileDebug` 仅保留在旧数据和备份中，未合并到当前库。进程日志在 `work/runtime/native/logs/`。

Admin 前端入口为 `http://<Mac局域网IP>:8000`，Laravel 仅监听 `127.0.0.1:18081`，由前端代理 API 和认证请求。Mac 使用 `local.happyro.admin-frontend` 和 `local.happyro.admin-backend` 两个 launchd 服务管理，对应仓库 Linux 部署中的 systemd 单元。后台沿用 Docker 中的 `happyro_admin` 数据库和原有管理员账号，并同步原 Docker 应用的加密密钥；它与游戏账号分开存储。数据库凭据、后台账号和 Game Control 密钥仍保存在上述本机凭据文件中。

Admin 已导入物品、魔物和 NPC 图鉴，图片指向本次替换的运行资源。Game Control 经回环地址上的 web-server 访问 map-server Socket，并使用独立密钥认证。后台日志为 `admin-backend.log`、`admin-frontend.log`。游戏内冒险工具也通过 Gateway 的默认 `127.0.0.1:18081` 代理接入该后台。

## 如何复现与分析

1. 手机与 Mac 连同一局域网，从带 `debug=1` 的启动页进入游戏。
2. 展开右侧“日志”，确认显示“已回传”和会话短编号，然后收起侧栏。
3. 静止约 5 秒，再持续普通攻击 20 秒；感觉卡顿时可点“标记卡顿”。
4. 单独关闭游戏内“音效”并保存，重复攻击。再恢复音效、单独把渲染比例改为 50，重复攻击。
5. 用最新 JSONL 对照 `combat.attack`、`combat.skill`、`perf.frame-gap`、`perf.slow`、`perf.summary` 和 `perf.manual-stutter`。

```bash
ls -lt work/diagnostics/client/*/*.jsonl
tail -f work/diagnostics/client/YYYY-MM-DD/<会话UUID>.jsonl
```

`perf.summary` 每约 5 秒记录一次：实际执行游戏渲染的帧间隔、渲染回调 CPU 耗时的 P50/P95/P99/最大值、超过 50ms 的次数、伤害数字纹理生成、音效播放和 HUD 更新的累计/最大耗时，以及分辨率、DPR、帧率上限和音效开关。只统计进入游戏后的渲染，切后台清空间隔基线，避免把切后台时间当作卡顿。

`damage.texture` 包含 Canvas 拼图和 WebGL 上传的 JavaScript 调用耗时；WebGL 异步执行，因此这不是 GPU 执行时间。新构建的 `audio.start` 测量缓冲音源节点的创建、连接和启动；`audio.load.wait`、`audio.decode.wait` 是异步等待时间，不是主线程阻塞时长。旧构建的 `audio.play.ready` 同样只是播放 Promise 等待时间。若整帧间隔很长但各项 CPU 耗时很短，需要进一步检查 GPU、浏览器合成或系统调度，不能仅凭日志认定根因。

## 第二轮：定位剩余战斗长帧

音效修复通过实机验收后，新增 `profileVersion: 2` 的分段采样。此次先固定原画质并保持音效开启，进入游戏后静止约 5 秒，再连续攻击 30–60 秒，尽量包含暴击。采样期间收起日志面板。除非需要进一步对照，不同时调整音效、画质或方向。

- `combat.attack`／`combat.skill` 的 `combatId` 用于关联附近的战斗事件；`frameId` 非空时表示事件发生在被计时的渲染循环内。
- `perf.frame` 记录同步渲染循环达到 32ms 的帧，包含帧编号、总耗时、最耗时的 8 个阶段、计数及最近的战斗事件。阶段上下文可包含实体部件、动作类型或特效类名。
- `perf.frame-gap` 仍表示实际帧间隔达到 50ms，新增 `previousFrame` 和 `betweenFrames`，分别记录上一帧及两帧之间已测量的同步工作。`outsideRenderMs` 是帧间隔减去上一帧同步经过时间，包含正常等帧、浏览器调度及未测工作，不能直接解释为阻塞或 GPU 耗时。
- `perf.summary` 保留全部窗口统计，并汇总阶段耗时和资源计数。阶段最多 40 种、计数最多 20 种；详细慢事件合计每窗口最多 20 条，被省略的数量记入 `omittedSlowEvents`。

| 阶段 | 覆盖范围 |
| --- | --- |
| `render.events`／`render.callbacks`／`render.cursor` | 帧内延时事件、全部渲染回调、光标绘制 |
| `map.*` | 地面与准备、环境更新、模型、实体、前后两次特效、特效实体、水面、伤害显示、覆盖层、拾取、清理及后处理 |
| `entity.animation` | 实体部件的动画帧计算及其中触发的动作切换 |
| `effect.classInit`／`effect.init`／`effect.render` | 特效类初始化、实例初始化、实例绘制 |
| `texture.spriteUpload`／`texture.paletteUpload`／`texture.imageUpload` | 精灵帧、调色板及图片纹理准备与上传的同步调用；计时从异步资源返回之后开始 |
| `texture.effectDecode`／`texture.effectDecode.wait` | 共享特效纹理的 TGA 同步解码／普通图片异步加载等待；后者不参与同步长帧归因 |
| `memory.scan`／`memory.release` | 构造清理键列表、逐项释放；计数记录扫描、检查、成功释放的条目，以及精灵上传帧数 |

纹理复用验证还记录 `texture.effectHit`、`texture.effectMiss`、`texture.effectUpload`、`texture.effectEvict` 计数。命中包含共享正在加载的同一资源；上传表示新建完成的共享 GPU 纹理。进图预热会产生少量 miss／upload，持续攻击应主要增加 hit；其他特效种类及地图仍会产生独立的 `texture.imageUpload`，不能要求该指标在游戏全程归零。

上述计时存在父子包含关系，例如 `render.callbacks` 包含 `map.entities`，不能把所有阶段相加。异步 `.wait` 指标仅进入窗口汇总，不进入某一帧或两帧之间的同步工作归因。浏览器仍可能在任何计时区间暂停执行，因此测量值是经过时间，不是纯 CPU 时间。资源解析中在 Worker 内执行的部分，以及 GPU、布局和合成工作，不在这轮分段计时范围内。

## 开销、断线与限制

- 批量回传周期为 2 秒，每批最多 100 条、约 32 KiB。接收请求上限 48 KiB。
- 浏览器待传队列最多 1000 条 / 512 KiB，溢出丢弃最旧记录并显示丢弃数量；单条上限 8 KiB。
- 失败自动退避重试，批次去重；接收器重启后建立新会话并重传未确认批次。切后台或离开页面时尝试 `sendBeacon`，强杀浏览器仍可能丢失最后的未发送数据。
- 慢调用/长帧详细事件每约 5 秒最多 20 条，其余计入汇总。WebSocket 只汇总字节数，不逐包记录正文。
- 接收器最多保留 128 个活动会话，每会话最长 24 小时、20 MiB，接收目录累计上限 256 MiB。达到上限返回 507，不自动删除历史记录；归档或清理已分析日志并重启 Gateway 后再采集。
- 错误、资源 URL 和控制台文本沿用调试工具的输入值隐藏与 URL 查询参数清除；不采集封包正文、密码字段或聊天输入正文。调试日志仍只应在本机排查使用。

## 资源来源

本机运行资源已替换为用户提供的 `happyro-resources-20260924.tar.gz`，旧的三个运行资源目录已删除。归档 SHA-256 为 `ab4cffdbdb40e34ae096cca139d9a1398f0cf696fc77a184ceca00aa400523dc`。下载目录没有配套校验文件；已记录归档哈希，并逐文件比较解包内容、暂存文件和安装目标的 SHA-256。

完整的 37,305 个文件来源和目标哈希在 `work/diagnostics/resource-import/20260924-installed.json`。官方源材料 `inputs/official/` 未修改。
