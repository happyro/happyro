# 2026-09-08-world-catalog 验收快照

仅记录当日结果，不代表当前测试基线或运行状态。

## 当前验证基准

2026-09-08 重构完成时的验证结果：

- Client 完整测试 442/442 通过，1 个测试文件跳过；
- `map-server` 完整编译并以新协议运行；
- 真实 Chromium 验证 NPC 图鉴、NPC 传送、地图寻路以及地图传送请求/响应成功；
- 运行时审计结果位于 `artifacts/adventure-tools-audit.json`。
