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

本次初始化的游戏调试环境由用户级 launchd 管理，配置在 `work/runtime/native/launchd/`，仅加载到当前登录会话，不注册开机启动：

```bash
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh stop --no-color
bash scripts/local/macos-services.sh start --no-color
```

该命令只管理已经配置的进程，不负责首次安装。运行组件是本机 MariaDB 10.11、login/char/map/web、Node Gateway，以及 Admin 的 Laravel 后端和 Umi 前端。客户端构建固定 Renewal / PACKETVER=20211103 / 不混淆封包，保留启动页和全部查看器。

数据库使用独立目录 `work/runtime/native/database/`，仅监听 `127.0.0.1:13306`；游戏服务器仅监听回环地址，通过 Gateway 的 WebSocket 代理供手机访问。Gateway 监听 3338。数据库、内部服务密码和测试账号保存在权限为 0600 的 `work/runtime/native/credentials.json`，不要提交或放入诊断日志。

测试账号 `happytest` 有一个 `MobileDebug` 角色及本地 GM 权限，可用于生成战斗测试场景。进程日志在 `work/runtime/native/logs/`。`stop` 保留数据库和诊断日志；不要删除整个 `work/runtime/`。

Admin 前端入口为 `http://<Mac局域网IP>:8000`，Laravel 仅监听 `127.0.0.1:18081`，由前端代理 API 和认证请求。Mac 使用 `local.happyro.admin-frontend` 和 `local.happyro.admin-backend` 两个 launchd 服务管理，对应仓库 Linux 部署中的 systemd 单元。后台使用独立的 `happyro_native_admin` 数据库，初始化账号为 `admin/admin`；它与游戏账号分开存储。数据库凭据、后台账号和 Game Control 密钥仍保存在上述本机凭据文件中。

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
