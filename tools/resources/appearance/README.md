# 职业外观配置同步

唯一维护源为 [`config/character-appearance.json`](../../../config/character-appearance.json)。先核对职业 ID、阶段、性别、身体与特殊形态资源，再加入配置；不要直接编辑三仓生成文件。

```sh
python3 tools/resources/appearance/generate.py generate
python3 tools/resources/appearance/generate.py check --no-color
python3 -m unittest discover -s tools/resources/appearance -p 'test_*.py'
```

不带参数只显示帮助。`generate` 在完整配置校验成功后生成服务端 C++ 表、客户端 JavaScript 表和 Admin Go 参数白名单；`check` 对照当前配置逐字节检查三仓产物，不写入文件。三个文件均记录 canonical JSON 的 SHA-256，同一来源的格式缩进变化不会改变该摘要。

新增普通分支只需添加已核实的 `jobs` 与 `options`，重新生成，并验证服务端资格校验、显示及菜单。新特殊形态可能仍需渲染代码。选项 ID 是持久化与封包值，不能随意重新编号；分支索引仅用于生成表内部匹配。`mountedOf` 只表达同分支同阶段的完整战斗骑乘身体，不用于商城坐骑、手推车或随行单位。0 为默认；选项只列较早阶段，不列当前职业默认外观。

生成器拒绝重复 ID、跨分支引用、越界封包值、错误阶段、错误性别枚举和不匹配的身体／坐骑组合。通过结构校验不等于资源或真实游戏验收完成；实施验收仍遵循 [TODO](../../../docs/development/character-appearance/TODO.md)。

浏览器运行验收位于 [tools/acceptance/appearance](../../acceptance/appearance/ACCEPTANCE.md)，不与配置生成混放。
