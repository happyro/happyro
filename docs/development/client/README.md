# 客户端专题

[返回开发文档](../README.md)

查看功能界面与实际操作步骤，请先阅读[玩家指南](https://happyro.kugarocks.com/game/)；其中包含当前 UI 截图和电脑、手机、平板的操作差异。本目录记录实现与验收专题，功能说明统一链接玩家指南。

- [说明标签专题](text-markup/README.md)：NAVI、TIPBOX、物品引用、URL、FONT 的规则、跨窗口交互及审查边界。
- [移动端 UI 开发与验收](mobile-ui.md)：客户端规范入口、跨端检查和菜单样式维护。
- [移动端性能诊断](mobile-diagnostics.md)：本机接收手机日志、复现战斗长帧、分段指标和分析限制。
- [自动恢复](auto-recovery.md)：HP／SP 比例、道具选择、独立调度与回执隔离。
- [自身增益维持](auto-buffs.md)：单列表 UI、七项技能范围、状态确认与调度边界。
- [技能条件实测后修复](skill-condition-fixes/README.md)：动态列表、目标标记及“无法判断就不提示”规则与定向验证。
- [技能使用条件审计](skill-conditions/README.md)：12 条主线、996 条职业技能记录的条件修复、覆盖与已知预判缺口。
- [四转技能审查](fourth-job-auto-combat-audit.md)、[交叉复查](fourth-job-auto-combat-second-audit.md)：覆盖清单、问题证据与发布前复核。
- [README 图片制作](../readme-images/README.md)：全部五张展示图的截图参数、合成模板、预览与自动化复用方案。

环境和构建命令见[开发流程](../workflow/README.md)。本目录按客户端表现与交互归类；涉及服务端保存、权限和协议的部分仍明确记录对应边界。

职业外观作为独立跨仓库功能，见[职业外观目录](../character-appearance/README.md)。
