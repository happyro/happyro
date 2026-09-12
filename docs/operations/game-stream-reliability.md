# 游戏连接与封包可靠性

游戏链路为 Browser → WebSocket Gateway → TCP → rAthena。TCP 和 Gateway 输出的数据块均不代表游戏包边界。任何合法包都必须允许任意分段和与其他包合并。

## 接收契约

- 包头不完整时等待；长度合法但包体不完整时等待，不消费字节、不推进加密状态。
- 地图服变长包长度为 4–32768 字节，按已校验长度扩展接收 FIFO。
- 每次解析后先清理已消费字节，再检查缓冲是否耗尽，避免每轮包数预算触发误断线。
- 客户端使用已知包长表确定边界，未知边界不猜测为当前网络块长度。变长包至少 4 字节，长度不得超过 uint16 范围。
- 客户端和游戏客户端连接的服务端均限制未完成包的等待时间。服务端沿用 socket stall_time（默认 60 秒），客户端为 60 秒；收到零碎字节不重置当前包的期限。
- 角色服原始 4 字节 AID 握手也必须收齐后才能解析。
- 连接结束或切换时清除接收缓存、握手状态和关联请求，旧连接事件不进入新连接。

## Gateway

使用 ws 的 createWebSocketStream 与 TCP 双向 pipe，让慢接收端的背压传到上游，包括 TCP 连接尚未建立的阶段。高水位 64 KiB，单条 WebSocket 消息上限 64 KiB，建立 TCP 连接超时 10 秒。队列满不得静默丢弃游戏字节；连接结束或错误时统一释放两端，并记录原因。

## HappyRO NPC 查询协议

维持 PACKETVER=20211103、Renewal 和现有包号。0x0cfa 为 10 字节头 + N × 24 字节条目，N ≤ 50；0x0cfb 为 10 字节头 + N 字节结果。字段长度有 C++ static_assert，客户端验证真实编码字节和响应 count/length。37 条请求合法长度为 898，收到 838 字节时必须等待剩余 60 字节。

## 验证

```bash
node repos/happyro-server/tests/stream-parser.test.mjs work/runtime/stream-parser-test --no-color
node repos/happyro-server/tests/stream-live.test.mjs --port 5121 --no-color
cd repos/happyro-gateway
node --test test/*.test.js
cd ../happyro-client
npm test
```

parser 测试直接提取当前生产 clif_parse 函数，以最小 session 模型执行，并启用 ASan/UBSan。它不替代 socket 集成测试；live 测试通过实际 TCP 端口验证半包、32 KiB FIFO 扩容及合包，使用未认证请求避免执行业务，最后用非法包号确认解析确实推进到流末尾。测试会产生预期的拒绝日志。

Gateway 测试建立真实 TCP/WebSocket 连接，验证连接早期突发、慢读和断开清理。客户端测试覆盖拆分位置、合包、握手、重连、typed-array 偏移、异常长度、响应计数、绝对超时及请求清理。

集成测试复用连接批量验证，避免触发服务端每 IP 的建连频率保护。不要为了测试关闭保护；Gateway 的所有游戏 TCP 连接使用同一源 IP，重复登录测试也应控制频率。

## 2026-09-13 本机验收

- ASan/UBSan 下，实际 clif_parse 的 898、1210、32768 字节包每个拆分位置、混合包和非法长度通过。
- 客户端通信相关 49 项测试通过；全量测试运行时 538 项通过、1 项失败（已有 `InterfaceDefaults` 测试要求旧式 display 写法，而 HEAD 产品代码使用 is-visible 类）。该失败与通信修改无关，未修改该测试或 NPC UI。
- Gateway 13 项测试通过，包括实际 TCP/WebSocket 的 1 MiB 字节完整性与失败清理。
- 服务端完整编译成功；运行中的 login、char、map、web 二进制逐一与构建产物比较一致。
- PWA 通过 `--all` 构建，Gateway 提供构建 `mtylf4yb`，保留启动页。
- 实际地图服 TCP 验证半包头、半包体、32 KiB 包、连续合包及非法长度通过。未完成帧每 5 秒追加数据，约 61074 ms 后触发绝对期限，符合默认 60 秒期限加循环调度精度。
- Chromium 使用已有 AutoTest 账号完成登录；将 37 条 NPC 查询拆为 838 + 60 字节，收到 37 条结果，连接保持在线，无协议错误。

本次保留现有游戏协议和业务结构，未引入新协议版本或全量协议代码生成器。新增 wire layout 断言和真实字节测试直接约束此次涉及的扩展包；其他扩展协议的生成化可作为独立工程推进。

## 更新运行服务

先完成测试、服务端编译和 PWA `--all` 构建。确认在线连接情况后更新运行进程；任何重启都会断开现有连接。重新登录验证完整链路，检查实际运行二进制、Gateway 提供的构建标识，以及新增断线日志，不能仅凭源码修改宣称线上修复。
