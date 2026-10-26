# 环境配置登记表

`deploy/environment/registry.json` 登记配置所有者、类型、范围、默认值和部署语义。客户端、API、Gateway 与地图服代码是各自定义的权威来源；登记表记录出厂默认值，禁止从本机 `.env` 或运行数据库取默认值。

修改消费者定义后，同步登记表及部署模板，再执行：

```bash
python3 tools/configuration/environment.py check
python3 tools/configuration/environment.py sync
```

`check` 校验代码定义、Compose 容器归属、部署模板及 happyro-doc 的生成清单；`sync` 在校验通过后更新文档清单。无参数只显示帮助，支持 `--no-color`。

游戏规则环境变量留空时保留持久化配置，显式设置时覆盖并锁定编辑；登记表的游戏默认值表示全新安装值，不表示每次启动重置。客户端环境变量只提供偏好默认值，玩家保存的设置优先。注册显式默认组只在 API 启动应用，独立的注册编辑开关默认 true；允许编辑时可修改，下次启动重新应用非空默认组。
