# kRO 2021-11-05 并行翻译进度

本目录是 kRO 专用翻译工作区，不写入 `docs/zh-cn/agent-xx/`。工作单元基于最新提取 JSON 和直接文本源，全部重新切片并分配给四个 agent。

- 工作单元总数：77
- 已处理：0
- 进度：0%（0 / 77）
- 待处理：77
- agent-01：20 个
- agent-02：19 个
- agent-03：19 个
- agent-04：19 个

## 切片规则

- 直接文本按原始物理行处理；不超过 500 行的文件作为完整工作单元。
- JSON 提取结果按顶层记录规范化为一条记录一行，再切成每片最多 500 个物理行。
- `start_line`、`end_line` 表示规范化切片中的连续记录序号；各片不重叠、不遗漏。
- 源切片位于本目录各 agent 的 `chunks/source/`，译文写入对应的 `chunks/translated/`。

最新基准位于 `workspace/lub/source/` 和 `workspace/text/source/`；官方输入和提取说明仍保留在本目录。
