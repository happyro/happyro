# 自动化复用方案

[返回图片制作](README.md)

本页是待实现方案。当前只有已保存的合成与预览模板，以及[所有图片的截图参数](capture.md)，尚无统一截图 CLI。

## 按变化重跑

| 变化 | 重跑范围 |
| --- | --- |
| 设备边框、布局、背景、导出尺寸或质量 | 复用原图，仅合成 |
| 首图地图、角色、镜头 | 重拍三端首图，再合成 |
| 某一端 UI | 只重拍该端，核对版本一致后合成 |
| 技能对比内容 | 重拍平板和手机技能图，再合成 |
| 图鉴、战斗、后台页面 | 只重拍对应图片 |

采用固定预设、人工取景、自动出图。人负责确认角色和场景是否合适，工具负责顺序登录、加载检查、截图、合成、文件参数核对和宽度预览。同账号不并发登录。

## 配置与工具边界

- 将设备预设、命名场景（例如 `prontera-square`）、实际落点、各端镜头和窗口状态保存成非敏感配置。
- 账号凭据与令牌使用本地未跟踪配置或环境输入；不进入公开参数和模板。
- 缺少原图、素材加载失败或版本不一致时明确报错，不静默复用不明旧图。
- 模板已经位于本目录；未来 CLI 可放在 `tools/readme/` 并直接读取这些模板，避免复制两份维护。模板迁移时同步修改文档入口。
- 原图与中间文件放在 `work/readme-images/<场景>/`，候选输出放在 `artifacts/readme-preview/`，正式素材在 `docs/assets/readme/`。
- 优先实现三端首图，再接入技能对比、图鉴、战斗与后台，共五张图；不自动更改服务器倍率、角色资产或职业以凑截图。

拟议接口如下，**尚未实现，不能直接执行**：

```bash
./scripts/readme/images.sh capture hero --scene prontera-square
./scripts/readme/images.sh capture hero --scene prontera-square --device phone
./scripts/readme/images.sh capture responsive --scene prontera-square
./scripts/readme/images.sh capture codex
./scripts/readme/images.sh capture combat
./scripts/readme/images.sh capture admin
./scripts/readme/images.sh compose hero --scene prontera-square
./scripts/readme/images.sh preview
```

工具无参数只输出帮助，提供 `--no-color` 并遵循根 `AGENTS.md` 的 ANSI 配色与首尾空行规则。正式实现后，实际参数以工具帮助为准，本页移除不再适用的拟议接口。
