# tools/client

- `extract/`：用 Playwright 和客户端 Lua 5.1 WASM 从已核验 LUB 提取 JSON 快照。
- `build/`：把审查后的 JSON 回编译为 Lua 5.0 / 5.1 LUB，并做语义回环。

回编译说明见 [build/README.md](build/README.md)。默认输入为 `localization/sources/kro-20211105/merged/files/lub/`。
