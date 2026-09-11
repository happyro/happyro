# 资源与网关

## 装备物品图片

图片缺失的根因是混合编码路径：部分韩文目录经过 CP949 乱码传递，而路径内的 Unicode 文件名不应再次整体转码。`clientController.js` 现在逐路径段处理，仅转换 Latin-1 范围内的乱码段，保留 `나이프.bmp` 等真实 Unicode 文件名。

该修复属于 gateway 源码，不属于翻译 writeback，也不需要数据库操作。

## 缺失按钮资源

官方 2021 GRF 不包含队伍整理按钮 `mesbtn_011*.bmp`。客户端 UI 已移除对这组三态图片的依赖，使用无贴图文字按钮保留功能。这里修复的是资源依赖和 UI，不应伪造或修改官方素材。

## AI、BGM 与 System

- `inputs/runtime/kro-20211105/client/AI` 中已有核验的 `AI.lua`、`Const.lua`、`Util.lua`。
- 配置脚本把 `AI`、`BGM`、`System` 接入 gateway；官方源材料不复制、不修改。
- gateway 工作树中的同名符号链接是运行生成物，不提交。

## loose-data 覆盖

`DATA_OVERRIDE_PATH=../../localization/client/data` 提供 `msgstringtable.txt`、`titletable.json`、`skilldesctable.txt`。资源配置和 gateway 启动检查会验证文件存在、基本覆盖范围和关键中文值。

## 剩余兼容探测

浏览器仍可能请求 `SystemEN/*`、`hateffectids.lub`、`System/itemInfo.lua|lub`、`System/mapInfo.lua|lub` 等可选路径。当前已有成功替代加载路径，且自动审计未发现可见功能异常，因此不为消除日志 404 而复制别名；若出现明确可见故障，再按单独资源问题处理。
