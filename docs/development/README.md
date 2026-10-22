# 开发文档

本目录集中维护跨仓库开发流程、客户端专题和职业系统资料。按任务进入对应目录；产品内部规范仍以各应用仓库为准。

| 主题目录 | 内容 | 常用入口 |
| --- | --- | --- |
| [开发流程](workflow/README.md) | 本地环境、命令、测试、Git 与文档协作 | [本地开发](workflow/local-setup.md)、[常用命令](workflow/common-commands.md) |
| [客户端专题](client/README.md) | 移动端 UI 与性能诊断 | [移动端诊断](client/mobile-diagnostics.md)、[UI 规范](client/mobile-ui.md) |
| [README 图片制作](readme-images/README.md) | 五张展示图的截图、合成与复用 | [截图参数](readme-images/capture.md)、[合成与预览](readme-images/composition.md) |
| [设置审查](settings/README.md) | 设置汉化、实际效果检查、修复与暂时关闭项 | [已修复与未完成](settings/README.md) |
| [随行菜单实测](companion-review/README.md) | 宠物、佣兵、生命体双端已测路径、修复和未覆盖项 | [测试覆盖](companion-review/coverage.md)、[修复总结](companion-review/repair-summary.md)、[有效待办](companion-review/pending.md) |
| [职业外观](character-appearance/README.md) | 职业与显示分离、同步协议及十二职业线扩展 | [当前实现](character-appearance/implementation.md)、[有效待办](character-appearance/TODO.md) |
| [四转开发](fourth-jobs/README.md) | 使用、实现、资源、回归规则与有效待办 | [四转使用](fourth-jobs/usage.md)、[验收边界](fourth-jobs/acceptance.md) |
| [技能审查](skill-review/README.md) | 12 条职业线代码复查、607 项实机处理清单、修复与待办 | [已修复问题](skill-review/fixes.md)、[未解决事项](skill-review/pending.md)、[逐技能清单](skill-review/catalog.md) |
| [转职实测](job-change-review/README.md) | 12 条线、13 个分支至四转和正常重登的流程与证据 | [转职流程索引](job-change-review/walkthrough.md)、[缺陷修复](job-change-review/fixes.md) |
| [训练场修复与验收](trainning-ground/README.md) | 三场缺图、假人外观、仓库和中文修复及官方补丁附件 | [修复问题](trainning-ground/fixes.md)、[验收记录](trainning-ground/verification.md)、[资源与安装](trainning-ground/resources.md) |
| [经典初心者流程](classic-novice/README.md) | 沉船／经典出生模式、新手教学与任务验收 | [配置与流程](classic-novice/README.md) |
| [地图加载失败恢复](map-load-recovery/README.md) | 缺图自动恢复、登录救援、超时交互与停止循环 | [实现与验收](map-load-recovery/README.md) |

技能效果审查与 NPC 转职流程验收是不同范围：转职整线通过不表示该线每项技能效果均已通过。统计口径、测试准备和例外说明以各主题总览为准。

部署、发布和备份见[运维文档](../operations/README.md)，文档分类与维护规则见[文档维护](workflow/documentation.md)。同一主题的说明与证据集中在所属目录，避免在本层新增重复入口文件。
