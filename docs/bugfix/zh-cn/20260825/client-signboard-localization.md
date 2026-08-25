# NPC 标牌本地化

## 现象

点击或靠近 `Eden Teleport Officer` 时，NPC 头顶的静态标牌显示韩文 `낙원단 공간이동사`；NPC 下方的名称 `Eden Teleport Officer` 与标牌不是同一个文本来源。

## 来源与修复

- 标牌由客户端 `SignboardManager` 渲染。
- 标牌位置、图标和原始描述来自 `SignBoardList.lub`。
- 客户端随后加载 `SystemEN/Sign_Data.lub`，该加载阶段可能覆盖先前写入的同名翻译键。
- 需要强制修正的标牌应放入客户端高优先级覆盖表，并在 `DB.getTranslatedSignBoard()` 中优先返回覆盖值。
- 本例的覆盖为 `낙원단 공간이동사` -> `乐园团空间传送员`，同时对空格差异做归一化匹配。

## 构建判断

这类修复属于客户端 JS 运行时覆盖，不需要重建 `.lub`。修改后必须重新构建 PWA；如果浏览器仍显示旧文本，还需要刷新旧 bundle 或清理缓存。
