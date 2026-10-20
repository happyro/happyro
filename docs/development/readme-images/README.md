# README 图片制作

本目录是根 README 全部五张图片的长期制作依据，覆盖真实页面截图、设备合成、参数、预览与后续自动化方案。

**唯一视觉基准为本次实际生成并已放入根 README 的五张图片**，正式文件位于 `docs/assets/readme/`。不沿用旧版 2400 × 1680、图片内标题、旧设备尺寸或 Pillow 制作参数。

## 入口

| 文档或模板 | 用途 |
| --- | --- |
| [截图参数与操作](capture.md) | 罗安截图角色与六格快捷栏方案，以及所有图片的视口、场景、裁剪与输出参数 |
| [合成与预览](composition.md) | 实际模板、设备坐标、导出方法与 README 阅读宽度检查 |
| [自动化复用方案](automation.md) | 局部重拍、命名场景与待实现的统一工具 |
| [合成模板](templates/compose.html) | 本次使用的 HTML/CSS，输入五张原始截图 |
| [正式图片预览](templates/preview.html) | 直接打开，检查仓库中的五张正式成图 |

## 当前正式图片

| 图片 | 文件 | 像素尺寸 | 格式 |
| --- | --- | --- | --- |
| 三端首图 | `happyro-three-devices.png` | 1600 × 1000 | PNG，透明背景 |
| 跨端技能界面 | `happyro-responsive-skills.png` | 1600 × 858 | PNG，透明背景 |
| 魔物图鉴 | `happyro-codex.png` | 880 × 680 | PNG |
| 自动战斗 | `happyro-combat.png` | 920 × 670 | PNG |
| 后台掉落倍率 | `happyro-admin-settings.png` | 1280 × 630 | PNG |

## 已保存与待实现

本次使用 Playwright 控制 Chromium，本机真实页面截图，再通过 HTML/CSS 合成和浏览器截图导出。实际使用的合成模板已保存到本目录；预览页沿用本次样式，将图片引用改为仓库正式素材。

登录、取景和截图命令当时在交互式 JavaScript 会话中执行，没有完整的一键截图脚本。本目录记录可复用参数和操作，不把设计中的 CLI 描述为现成工具。模板不需要 AI 生成图片，也不依赖临时目录里的旧脚本。

原始截图和预览仍属于生成物，放在 `work/` 或 `artifacts/`。模板、参数与流程保存在本目录并纳入版本管理；正式成图放在 `docs/assets/readme/`。截图使用浏览器视口模拟，不代表手机或平板真机验收。

后续请求示例：

> 按 docs/development/readme-images/README.md 更新 README 图片，以当前五张正式成图为基准。首图换成指定地图和角色，只重拍受影响的画面，沿用已保存的合成模板，先生成预览。
