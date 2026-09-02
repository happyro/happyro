# 客户端产物

## 当前版本

- 客户端资源版本：kRO 2021-11-05。
- 产物批次：`client-resource-audit-20260902`。
- 数据源：`docs/translation/zh-cn/kro-20211105/merged/files/lub/`。
- 临时输出：`work/client-resource-audit/kro-20211105/lua51/`。
- 编译版本：Lua 5.1。
- 编码：UTF-8。

## 编译产物

| 文件 | SHA-256 | 语义回环 | 发布状态 |
| --- | --- | --- | --- |
| `System/LuaFiles514/MsgString.lub` | `9fdf2f9cea3ceb86339f6b6a3c85cfc9a2e20a137294cbf8e4fb97e934f71e6d` | 通过 | 未发布 |
| `System/achievement_list.lub` | `8446c780c8efe1c8da6d221e00d9b5a61d5ddf1254323bf431f53c33032c860d` | 通过 | 未发布 |
| `System/OngoingQuestInfoList.lub` | `33607ef6fdbf4582b6263cb1f25506ee0c66b55223c36b20c61b8eb8d84b9c8d` | 通过 | 未发布 |
| `System/OngoingQuestInfoList_True.lub` | `66d3ad5887f6b02c76b01f1415b928ff89912648cd70a2cea6cf5971fe9bca63` | 通过 | 未发布 |
| `System/RecommendedQuestInfoList.lub` | `8d0a309699889406e2098382135b2af4c339f0f688c56bcb6fba57f3d52af9ed` | 通过 | 未发布 |
| `System/RecommendedQuestInfoList_True.lub` | `4a8e08e9f78b4ed3052618cf86ddd1c83be707fdb73b67b6b0ee0fe665dbd2db` | 通过 | 未发布 |
| `System/Towninfo.lub` | `1ccd949c5f6e6275580f26798e91d4f3b1a3b24bc3daebe10015bc143c298521` | 通过 | 未发布 |
| `System/itemInfo_true.lub` | `1e7c4cc36621c9c04d97ced7fddf009585e0f892caca951d497101430888e902` | 通过 | 已发布 |
| `System/mapInfo_true.lub` | `0faa87be08e809dd40127bb154eefe18a3a4d0f6615c71e8506ca337595f8388` | 通过 | 未发布 |
| `System/tipbox.lub` | `d819904f4c693ab0a934926a7a9099e60689d9dfd01cb2bafdab25e2ab78fa4a` | 通过 | 未发布 |

## 运行时发布

本批次只修改物品显示名称，因此只发布对应的物品资源：

| 产物 | 运行时目标 | SHA-256 | 状态 |
| --- | --- | --- | --- |
| `System/itemInfo_true.lub` | `inputs/runtime/kro-20211105/client/System/itemInfo_true.lub` | `1e7c4cc36621c9c04d97ced7fddf009585e0f892caca951d497101430888e902` | 源文件与目标文件哈希一致 |

其余 9 个文件由完整 Lua 5.1 构建流程重新生成并完成语义校验，但本批次没有修改对应翻译内容，因此没有覆盖运行目录。

## 验收状态

- 21 个普通物品名称已按审查结论写入正式合并 JSON。
- 属性缩写保持原文，`hari` 按确认保持原文。
- 10 个 Lua 5.1 产物全部通过逐值语义回环。
- 已发布的 `itemInfo_true.lub` 与构建产物 SHA-256 一致。
- 客户端实机字体和界面渲染尚待验收。

单次构建的机器可读清单位于 `work/client-resource-audit/kro-20211105/lua51/manifest-lua51.tsv`，该文件属于可重建产物，不提交 Git。
