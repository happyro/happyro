# 四转开发与维护

[返回开发文档](../README.md)

支持 13 个常规四转和 7 个扩展进阶职业，固定 PACKETVER=20211103、Renewal。客户端显示和管理工具请求均以服务端职业、等级、技能和点数规则为准。

- [实现](implementation.md)：跨仓库接口、角色状态和效果生命周期。
- [使用](usage.md)：导师入口、前置条件与管理工具。
- [资源维护](resources.md)：规范清单、安装校验及尚未引用的资源缺口。
- [验收与范围边界](acceptance.md)：核心门槛、抽样方法、完成判定和后续处理优先级。

源码和回归测试保存实现，changelog 保存产品变化；不维护已完成阶段的进度副本。发布按[镜像发布流程](../../operations/docker-release.md)，功能实现不等于最终包通过验收。

相关主题：[职业外观](../character-appearance/README.md)、[NPC转职实测](../job-change-review/README.md)、[技能审查](../skill-review/README.md)。
