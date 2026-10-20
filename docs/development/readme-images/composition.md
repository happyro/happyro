# 合成与预览

[返回图片制作](README.md)

## 已持久化模板

[templates/compose.html](templates/compose.html) 保存本次实际使用的 HTML/CSS，未采用旧文档中的 Pillow、字体或大图参数。它包含 `#hero` 三端首图和 `#skills` 技能对比图两个独立区域。

模板默认读取同目录中的 `desktop.png`、`tablet.png`、`phone.png`、`tablet-skills.png`、`phone-skills.png`。将模板复制到含这些原图的生成目录后渲染，不要将临时输入或登录凭据提交到模板目录。

## 首图参数

画布为 1600 × 1000，透明背景，不添加图片内标题、版本或宣传文案。通用 `box-sizing: border-box`；截图使用 `object-fit: contain` 保持比例。

| 元素 | x, y | 宽 × 高 | 样式 |
| --- | --- | --- | --- |
| 电脑外框 | 420, 35 | 992 × 776 | 背景 `#25272a`，2px 边框 `#5b6066`，圆角 19px |
| 支架 | 846, 806 | 140 × 94 | `#a6adb3`，梯形裁剪 |
| 底座 | 771, 889 | 290 × 16 | `#c1c7cc` |
| 平板外框 | 36, 440 | 696 × 532 | 背景 `#24272a`，2px 边框 `#6b7076`，圆角 26px |
| 手机外框 | 1252, 358 | 300 × 600 | 背景 `#202428`，3px 边框 `#626970`，圆角 35px |

桌面原图为 1024 × 768，以 960 × 720 等比显示；平板与手机保留完整原图，三端镜头固定为 90 / 85 / 20。

电脑 padding 为 `14px 14px 38px`，图片元素高度 720px；平板 padding 为 `14px 18px`；手机 padding 为 10px。屏幕圆角、指示灯和手势条以模板 CSS 为完整依据。坐标表为外框，不应拿来拉伸原图。

## 技能对比图参数

画布 1600 × 858，透明背景，上下保留 30px，设备间距 55px，整体水平居中。

第二张复用首图的 `.tablet`、`.phone` 设备框，包括背景色、边框、屏幕圆角及手机手势条；不再维护另一套简化框。两张图均不添加设备外框或底座阴影。平板按 1.5 倍显示为 1044 × 798，手机按 1.33 倍显示为 399 × 798，两者等高。各自等比缩放，不拉伸截图。

屏幕仍以 `object-fit: contain` 完整显示；比例差产生的少量空隙由设备深色背景承接，不透明露底，不出现白色内边。

## 导出

用 Playwright Chromium 在 1600 × 1100、`deviceScaleFactor: 1` 的视口打开复制后的合成页，等待全部图片解码，截取对应元素。以下片段假设调用方已准备 `page`、模板 URL 和输出目录，不包含依赖安装或浏览器启动：

```javascript
await page.goto(templateUrl);
await page.locator('img').evaluateAll(images =>
  Promise.all(images.map(image => image.decode()))
);
await page.locator('#hero').screenshot({
  path: `${outputDir}/happyro-three-devices.png`,
  type: 'png', omitBackground: true
});
await page.locator('#skills').screenshot({
  path: `${outputDir}/happyro-responsive-skills.png`,
  type: 'png', omitBackground: true
});
```

图鉴、战斗和后台图片直接按[截图参数](capture.md)导出 PNG，不套设备框、不经过此合成页。不要把整个合成页截图当作首图。

## 阅读宽度与验收

[templates/preview.html](templates/preview.html) 可直接打开，读取 `docs/assets/readme/` 中的正式成图。它是本地阅读宽度预览，不是 GitHub 实际 Markdown 渲染器。查看候选图时，将预览页复制到生成目录并调整图片路径。

- 桌面检查视口为 1000 × 900；正文外框最大宽 880px、左右 padding 40px，图片实际约 800px 宽。
- 手机检查视口为 390 × 844；左右 padding 16px，图片宽 358px，无横向溢出。
- 首图在约 800px 宽下显示高度约 500px。README 以 `width="100%"` 嵌入，保持自然比例。
- 检查三端布局差异、角色遮挡、边框裁切、素材加载、缩小后的辨识度及原图细节。
- 检查 PNG 文字是否清楚、透明背景是否正确、文件体积是否合理。具体尺寸和文件哈希记录在整套预览的 capture.json 中。
- 候选输出先预览，再替换正式图片；检查本地引用和 `git diff --check`。无明确要求不提交、不推送。
