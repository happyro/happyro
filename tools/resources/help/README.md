# TIPBOX 帮助目录

`review.py generate` 审查当前 TIPBOX 来源并输出到 work/；显式 `--publish` 才更新客户端数据。`check` 重新计算并比对当前产物。无参数只显示帮助。

```bash
python3 tools/resources/help/review.py check --no-color
```

规则及产品行为见 [TIPBOX 实现说明](../../../docs/development/client/text-markup/tipbox-help.md)。它与 NAVI 共享资源生命周期，但帮助内容、标签有效性和导航权限是不同领域，不合并为一个决策器。
