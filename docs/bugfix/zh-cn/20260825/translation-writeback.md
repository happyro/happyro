# 翻译生成与回写

## 数据链

长期维护顺序如下：

1. `inputs/official/` 与 `inputs/runtime/kro-20211105/` 是核验过的官方材料，只读。
2. `docs/translation/zh-cn/client-server/agents/*/chunks/translated/**` 与对应清单是已审阅翻译源。
3. `tools/translation/merge` 从翻译源生成临时合并文件和 `manifest.tsv`。
4. 校验通过后，将 files、manifest 和验证记录一起晋级到对应工作区的正式 `merged/`。
5. `tools/translation/writeback` 按正式 manifest 把 client-server 产物发布到 `repos/happyro-client`、`repos/happyro-server`。
6. `work/translation-merge/**/merged/files/**` 是一次运行的中间输出，不是源文件。
7. `localization/client/data/**` 是 zh-cn loose-data 运行时覆盖源，独立于 client/server 源码回写。

因此，发现合并文件损坏时不能只编辑 `work/`；必须回到翻译分块或工具规则修复，再重新合并和回写。目标仓库中的同一修复也应保持一致。

writeback 默认只预览计划；只有显式传入 `--write` 才会写入目标目录。目标必须通过 `--target-root client=...`、`--target-root server=...` 明确指定，工具会拒绝写入受保护的 `inputs/`。正式回写前应先 dry-run，并使用 `--backup-dir` 保存被替换文件。

## 本轮已同步的翻译源

- 地图、职业和技能名称。
- ESC、背包、导航、NPC、任务、队伍等 UI 文案。
- `Rodex.js`、`CodepageManager.js` 和 `DBManager.js` 中与本地化有关的源码分块。
- 新增技能描述本地化模块及其 source/translated 完整文件。
- 各 agent 的 `manifest.tsv` 与 `translated-files.tsv`。

## C_Persika 源头案例

损坏结果曾是裸文本：

```yaml
Persika 服装
```

正确结构是：

```yaml
Name: Persika 服装
```

这类问题是结构化翻译丢失 YAML 键，不是译文内容问题。修复必须进入规范翻译源和服务端目标文件，并用 YAML 解析器扫描全部受影响文件。服务端目标修复已在提交 `842de2a7a` 中；后续重跑仍需确认翻译源不会再次生成裸文本。

## 不属于回写的问题

Rodex detached host、UTF-8 加载、缺失按钮图片、资源网关路径、AI 链接和 MOTD 都有自己的维护源。重新生成翻译合并文件不会修复这些问题，提交时也不应把它们伪装成单一翻译提交。
