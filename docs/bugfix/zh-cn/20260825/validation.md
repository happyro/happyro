# 验证记录

## 自动检查

- 客户端单元测试：43 个测试文件、253 个测试通过。
- PWA 构建：`npm run build:pwa` 通过。
- client/server 最终合并结构检查：四组结果均为 `Errors: 0`。
- 翻译分块校验：最终相关校验无错误；历史行数变化警告保留供人工审阅，不等同于 YAML/HTML 结构错误。
- gateway 启动检查：health、PWA、rAthena Web API、消息表、称号表、技能表和 AI 端点通过。
- HTTP：`AI/AI.lua`、`AI/Const.lua`、`AI/Util.lua`、`data/skilldesctable.txt` 和已验证的装备图片返回成功。

主要复现入口：

```bash
bash scripts/client/test-client.sh
bash scripts/gateway/test-gateway.sh
bash scripts/gateway/gateway.sh verify
bash scripts/server/server.sh verify
node work/runtime/ui-audit.mjs
```

翻译合并证据来自 `work/translation-merge/repair-20260824-01-run3/`；最终 kRO 证据已晋级到 `docs/translation/zh-cn/kro-20211105/merged/validation/`。`work/` 证据不提交，长期需要保留的结论必须写回本文或正式 validation 目录。

## 浏览器自动审计

`work/runtime/ui-audit.mjs` 已完整执行登录、角色选择、进入地图、14 个菜单、称号、装备背包、技能说明、ESC 和 NPC 对话检查。证据位于 `work/runtime/ui-audit/**`，包括逐阶段 JSON 与截图。

最终结果：

- 审计流程正常退出，不再因全页截图等待超时。
- `skill-description.png` 中 `NV_BASIC` 显示完整可读的简体中文说明。
- JSON 快照扫描未发现韩文或 Unicode 替换字符。
- 剩余 404 是已有替代路径的兼容探测，未观察到对应可见故障。

## 手工验收清单

1. 登录并进入角色，确认人物、地图和右上角地图可正常显示。
2. 打开背包，检查分类文案和装备图片。
3. 打开称号和技能窗口，检查中文称号、技能名称与描述。
4. 打开邮件，检查列表、详情和关闭/清理行为。
5. 打开 NPC 对话、ESC、任务和队伍窗口，检查返回、确认/取消和整理按钮。
6. 观察网络日志中的 404 是否对应真实可见功能故障。

技能中文资料曾参考 RO 小册子的 `NV_BASIC`、`NV_FIRSTAID`、`NV_TRICKDEAD` 条目：<https://ro.dvg.cn/skill.php>。
