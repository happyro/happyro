# 可选 Lua 数据文件说明

## 结论

`inputs/runtime/kro-20211105/client` 不包含以下 HatEffect 数据文件：

```text
data/luafiles514/lua files/hateffectinfo/hateffectids.lub
data/luafiles514/lua files/hateffectinfo/hateffectinfo.lub
data/luafiles514/lua files/hateffectinfo/footprinteffectinfo.lub
```

这些文件用于帽饰特效和脚印特效，不属于登录、地图、移动或战斗所需的基础数据。本项目不从其它 kRO 版本复制或伪造这些文件，相关控制台缺失日志暂不作为部署故障处理。

以下文件缺失属于正常候选回退或可选翻译数据：

- `System/itemInfo.lub`：使用 `System/itemInfo_true.lub` 回退。
- `System/mapInfo.lub`：使用 `System/mapInfo_true.lub` 回退。
- `SystemEN/Sign_Data.lub`、`SystemEN/OngoingQuests.lub`、`SystemEN/Towninfo.lub`：可选英文/翻译覆盖。

## 维护约束

固定使用 `PACKETVER=20211103` 和 `kro-20211105` 资源基线。除非引入经过核验且版本匹配的官方资源，不补充 HatEffect 文件，也不把缺失日志误判为资源部署失败。
