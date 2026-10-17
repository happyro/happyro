# 四转资源维护

资源来自已核验的官方输入，安装到 `inputs/runtime/kro-20211105/client/data/` 散文件覆盖；原 GRF 和官方源保持不变。来源 URL、补丁与文件 SHA-256 的权威记录为：

- [职业技能图标清单](../../../inputs/manifests/fourth-job-icons.json)
- [技能效果及纹理清单](../../../inputs/manifests/fourth-job-effects.json)

## 安装与检查

从清单列出的补丁提取文件后，按安装工具的帮助提供来源目录；工具校验源与目标哈希，不用猜测名称或其他技能图片替代缺失资源。

```bash
node tools/resources/install-fourth-job-icons.mjs install --source work/fourth-jobs/official-patches/extracted
node tools/resources/install-fourth-job-icons.mjs verify --no-color
node tools/resources/install-fourth-job-effects.mjs --no-color
node tools/resources/audit-fourth-jobs.mjs audit --no-color
```

效果安装工具无子命令时只显示帮助。审计报告写入 artifacts/；文件可读取不等于已正确渲染或完成玩法验收。Gateway 必须同时支持 Unicode 和客户端 CP949 字节形式路径。最终包从统一运行目录收录散文件，无需资源镜像。

## 效果映射约束

技能成功、伤害和地面单位通知不能重复播放同一主动画。状态附着按服务端状态开始/结束，地面效果使用通知坐标；多段技能按真实阶段处理。合法跨技能资源复用需保留来源，不能只按路径相同判定错误。BSON 与显式映射合并后还需检查阶段内重复路径。

## 尚未引用的缺口

此前核对以下三个条目没有技能或地面阶段绑定，缺失不直接代表可玩技能不可用；引用关系改变时重新审查：

- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_start.str`
- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_loop.str`
- `data/texture/effect/shinkiro_shiranui/npc_kinai/kunaiarea_00_end.str`

不要通过修改官方输入、猜测 `npc_kinai` 拼写或隐藏审计缺项消除报告。处理优先级见[待办与边界](acceptance.md#后续范围与处理优先级)。
