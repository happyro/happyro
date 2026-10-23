# RO321 扫描进度

后续合并与产品同步已完成，当前结论见 [两站合并结果](../../docs/localization/item-name-scans/merged/README.md)。下文为扫描阶段记录。

当前状态：RO321 扫描已完成并通过独立完整性审计。13 个 Renewal 公开分类共 **2,421 / 2,421 页**，名称快照共 **29,006 个唯一 ID**；无缺页、无审计错误，扫描进程正常退出（0）。结果独立保存，供用户之后合并两份来源，本次未合并小册子数据或更新产品翻译。

完成结果（2026-10-24）：

- `work/item-name-sources/ro321-names.json`：以物品 ID 为键，每条含 `name`、`aegis`、`source`。
- `work/item-name-sources/ro321-cache-audit.json`：完整性审计，`complete: true`、`missingPages: []`、`errors: []`。
- `work/item-name-sources/ro321-lists/`：2,421 页提取记录、来源 URL 和原始响应 SHA-256；不代表保存了全部原始 HTML。
- 审计已逐页核对分类分页、行数、分类内重复 ID、跨分类名称及内部标识冲突，并核对最终快照和状态计数。
- 最终以单线程、响应后间隔 2 秒完成。未提交、未 push。

以下为此前暂停时的历史断点记录：

用户于 2026-10-24 要求暂时停止。抓取进程已收到 SIGINT 并退出（130），没有后台扫描继续运行。缓存审计无错误。

- 已扫描 **996 / 2,421 页（41.1%）**，剩余 **1,425 页**；范围为 13 个 Renewal 公开分类。
- RO321 快照已保存 **11,948 个 ID**，另记录 61 个详情页来源缓存。
- 映射审查副本有 **15,866 个可靠中文 ID**：小册子 15,565，RO321 301；比当前产品映射新增 **133 个**。
- 尚有 **13,490 个服务端 ID** 无可核对中文映射；保留原名，不自行翻译。
- 两个来源的中文名称差异共 **56 项**，依既定小册子优先规则选择，原始写法保留供审查。
- 当前产品映射仍为 **15,733 个**；本轮新增 133 个尚未同步至客户端、服务端、后台和运行资源。
- 未提交、未 push。

## 已完成的流程改进

单线程限速、缓存续跑、逐页原子保存；补齐租赁及宠物认养分类；修正接近末页时隐藏“最后”按钮导致的分页误判，并重新核验 15 页旧缓存。增加独立缓存完整性审计、映射输入记录数／哈希校验、独立审查输出和 NPC 显式物品链接同步。目录工具 36 项测试通过。

## 断点与证据

- `work/item-name-sources/source-status.json`：实际页数、各分类总页数及暂停时间。
- `work/item-name-sources/ro321-lists/`：逐页记录、URL、原页哈希。
- `work/item-name-sources/ro321-names.json`：RO321 名称快照。
- `work/item-name-sources/full-ro321-scan.log`：扫描日志，末尾 KeyboardInterrupt 是主动暂停。
- `work/item-name-sources/ro321-cache-audit.json`：暂停后审计，errors 为空。
- `work/item-name-sources/mapping-preview/`：当前审查映射、未解决项、来源冲突。
- `work/item-name-sources/new-reference-review.json`：早期新增条目的 27 处说明引用候选，恢复后需针对全部新增条目重新生成并核对。
- `work/item-name-sources/full-ro321-job.json`：旧会话 75224 已结束，不应继续等待它。

## 恢复操作

收到用户恢复指令后执行（自动跳过缓存，不从头抓取）：

```bash
python3 tools/resources/catalog/ro321_scan.py scan --output work/item-name-sources --interval 8 --no-color
```

遇到 401／403／429 停止；不轮换代理或身份。扫描完整结束后：

1. 执行 `python3 tools/resources/catalog/audit_ro321.py check --references work/item-name-sources --require-complete --no-color`，确认全页覆盖和数据一致。
2. 汇总最终页数、唯一 ID、缺失项及来源核验结果，保留 RO321 独立名称快照和逐页证据。
3. 将结果位置提供给用户，供其之后与小册子结果合并。当前任务不更新正式翻译或运行资源；未经用户要求不提交、不推送。

用户随后要求小幅提速：当前单线程请求间隔由 8 秒改为 5 秒，已保存断点后重新启动。运行会话及时间见 `work/item-name-sources/full-ro321-job.json`；遇到 401／403／429 仍停止。

用户再次明确要求使用 4 秒间隔，已保存断点后切换为单线程 4 秒；当前会话信息见上述 job 文件。

用户明确要求改为 2 秒间隔，已保存断点后切换为单线程 2 秒；当前会话信息见上述 job 文件。遇到拒绝访问仍停止。
