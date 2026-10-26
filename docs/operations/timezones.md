# 日期与时区

HappyRO 使用 UTC 存储与传输时间，使用 `HAPPYRO_TIMEZONE` 指定面向玩家、管理员的显示时区。默认值为 `Asia/Shanghai`（北京时间，UTC+8），可以设置为 `UTC`、`America/New_York` 等 IANA 时区名称。非法名称会阻止 API 或 Gateway 启动。

## 配置

Docker 在部署 `.env` 中设置一个值，Compose 将其传给 API 和 Gateway：

```dotenv
HAPPYRO_TIMEZONE=Asia/Shanghai
```

修改后重新创建 API、Gateway 容器并刷新浏览器。无需重新编译前端或修改数据库时区。

原生部署在 API 的环境文件和 Gateway 的环境文件中设置相同值，并重启对应服务。本机 API 环境文件为 `work/runtime/native/api.env`，Gateway 使用其工作目录的 `.env`。浏览器刷新后，后台通过 `/api/public-config` 获取配置，PWA 通过 Gateway 生成的 `Config.runtime.js` 获取配置。API 和 Gateway 必须保持一致。

## 时间语义

- 游戏服 SQL 连接通过 `MYSQL_INIT_COMMAND` 设置 `time_zone='+00:00'`，首次连接与重连均生效。`NOW()`、`CURRENT_TIMESTAMP` 写入的角色登录、登录日志和工作记录均为 UTC。
- 账号登录时间由 login-server 通过 UTC 日历格式化写入，不依赖宿主机 `TZ`。
- API 的数据库连接保持 UTC，日期时间字段输出 RFC 3339（带 `Z`，保留微秒），空值继续返回 `null`。
- 前端只格式化明确的时间点；后台不接受不带时区的日期时间字符串。Unix 时间戳保持原值，渲染时按 `HAPPYRO_TIMEZONE` 转换，包括夏令时规则。
- 显示时区不修改数据库数据、不改变会话过期和任务倒计时，也不改变服务端 NPC 日历事件的宿主机时区。日志机器时间、HTTP 协议时间和资源构建标识继续使用 UTC。
- 历史数据不迁移、不推测其原始时区、不提供旧格式兼容。旧账号登录值直接按当前 UTC 语义解释，下一次正常登录会写入新的 UTC 时间。

## 覆盖范围

后台包括账号和角色登录时间、登录日志、删号任务、发放记录、设置修订与文章时间；API 同时修正审计记录。客户端包括桌面与移动任务截止时间、佣兵期限、邮件日期、成就、摆摊、删角时间、签到剩余日期、聊天导出与截图时间。Gateway 状态页使用相同的环境配置。
