# 离线产物基础验收

使用 `manage.py start/check/stop/clean/list/status --version VERSION --batch NAME`。不带参数只输出帮助，支持 `--no-color`；clean 默认预览，`--execute` 才停止容器、移除网络并删除整个批次（包括数据库、报告、日志、截图和登记），随后可以复用批次名；stop 保留数据和证据。

完整说明见 [happyro-doc](../../../repos/happyro-doc/docs/development/offline-acceptance.md)。按版本与批次保存安装、数据、日志和证据；release 的清理不删除验收环境。本入口不构建镜像、不推送 Docker Hub。

- `environment.py`：安全解压、批次锁、配置隔离、包内部署工具调用、停止与清理。
- `checks.py`：包完整性、容器健康、HTTP、报告。
- `browser.mjs`：真实启动页、默认测试账号登录、罗安进图、正常鼠标移动及截图；不注入客户端代码，不覆盖专项游戏功能。

包内 `tools/deployment/manage.py` 通过显式 `--compose-override PATH` 接受隔离配置，正式部署默认行为不变。只有重新打包后的 ZIP 才包含此功能。源码单元测试不表示真实包验收通过。

真实试打包已验证 Linux arm64 隔离部署、HTTP、罗安进图及移动。网段分配忽略 Docker 无子网网络；浏览器以角色接口响应确认身份，按实际大小选择主画布，不依赖骑乘区域等无关界面文字。验收结果和截图保留在批次 evidence/，不把单元测试结果当作实机结果。

新批次使用 `happyro-test-<批次名>-<16位哈希>-<服务名>`；已登记的项目名不变。执行阶段默认彩色，每 10 秒显示等待耗时，并给出日志路径；`--no-color` 禁用颜色。包内进度模块需要重新打包，已有 ZIP 不会随源码更新。

list 可按 --version 筛选，仅读取登记；status 需要 --version 与 --batch，读取当前容器健康状态但不执行内容或浏览器验收。check 的 --health-timeout 只控制服务健康等待（默认 300 秒），浏览器有独立的 300 秒限制。
