# 跨应用验收

| 目录 / 文件 | 用途 |
| --- | --- |
| [offline/](offline/README.md) | 最终离线 ZIP 的隔离部署、基础验收和批次清理 |
| [skills/](skills/README.md) | 技能会话、人工场景片段和只读证据核验 |
| [jobs/](jobs/README.md) | 原生转职浏览器驱动及分阶段场景 |
| [appearance/](appearance/ACCEPTANCE.md) | 本人/旁观者外观与移动验收 |
| `control.py` | 向显式选择的本机端口提交一个已审查场景 |

这些工具需要专用账号、运行中的游戏和明确的前置状态。单元测试、JS 语法通过不表示实机通过；场景不由 `tools/check.py` 自动执行。不能按文件名排序批量重放，也不能观察超时后自动重复写操作。

```bash
python3 tools/acceptance/control.py --run tools/acceptance/skills/scenarios/init.js --port 9341
```

控制器显式要求端口，固定只连接回环地址。场景的角色、地图、物品、职业、技能和恢复条件必须先核对。执行结果及私密账号配置放 work/ 或 artifacts/，正式证据只在审查后更新。
