# LUB 提取验证工作区

本目录用于保存 LUB 提取验证产物和翻译切片，不保存官方源文件副本的修改结果。

当前验证目标见：

- `source/`：复制到本工作区的最新提取 JSON；
- `../../manifest.tsv`：重新置零后的翻译工作单元清单。

可重现提取流程见 [`../../LUB-EXTRACTION.md`](../../LUB-EXTRACTION.md)，长期工具为仓库根目录的 [`tools/extract-lub-playwright.mjs`](../../../../tools/extract-lub-playwright.mjs)。

客户端现有 `DBManager.js` 已提供两种相关实现：

- `loadLuaValue()`：执行 LUB 后读取指定全局表并序列化；
- `loadAttendanceFile()`：注册签到回调后执行 `main()`。

已使用 Playwright 浏览器环境执行验证，结果保存在 `source/`。官方 LUB 文件保持只读。

验证结果：两个 OptionInfo 文件仅含命令、配置键和值；CheckAttendance 已提取 20 条奖励记录但不含文本字段，因此这 3 个文件不产生翻译工作单元。当前工具还生成了消息、地图、城镇、交通、宠物进化以及两个 Lua 5.0 可见资源 JSON；所有结果均写入 `work/lub-reextract/`，后续按 manifest 工作单元分配给 agent 处理。
