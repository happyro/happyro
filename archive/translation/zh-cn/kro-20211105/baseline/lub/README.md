# LUB 提取验证工作区

本目录只保存 LUB 提取验证产物和只读基准，不保存翻译切片或官方源文件副本的修改结果。

当前验证目标见：

- `source/`：复制到本工作区的最新提取 JSON；
- `../../manifest.tsv`：kRO 总翻译工作单元清单；
- `../../agents/agent-01/` 至 `../../agents/agent-08/`：并行翻译切片和各 agent 清单。

可重现提取流程见 [`../../LUB-EXTRACTION.md`](../../LUB-EXTRACTION.md)，长期工具为 [`tools/client/extract/lua51/playwright/main.mjs`](../../../../../../tools/client/extract/lua51/playwright/main.mjs)。

客户端现有 `DBManager.js` 已提供两种相关实现：

- `loadLuaValue()`：执行 LUB 后读取指定全局表并序列化；
- `loadAttendanceFile()`：注册签到回调后执行 `main()`。

已使用 Playwright 浏览器环境执行验证，结果保存在 `source/`。官方 LUB 文件保持只读。

验证结果：两个 OptionInfo 文件仅含命令、配置键和值；CheckAttendance 已提取 20 条奖励记录但不含文本字段，因此这 3 个文件不产生翻译工作单元。当前提取器覆盖 19 个 LUB 目标，提取结果与是否进入翻译清单的原因登记在 `../../status/extracted-files.tsv`；可翻译字段已分配到八个 agent 的 `chunks/source/`。
