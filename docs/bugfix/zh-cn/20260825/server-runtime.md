# 服务端与数据库

## 当前服务端变更

`repos/happyro-server/conf/motd.txt` 改为：

```text
欢迎来到 HappyRO！如发现问题，请及时反馈。
```

它是直接配置源，不经过翻译 writeback。

## 已提交的数据修复

C_Persika 的 `Name: Persika 服装` 已位于服务端提交 `842de2a7a feat(i18n): localize server content`。本轮未提交状态中不再包含该文件，但翻译源仍必须保存正确 YAML 键，防止未来回写回归。

## 是否重建数据库

本批不需要重建数据库，原因如下：

- 没有修改 SQL schema 或迁移文件。
- 没有改变 PACKETVER、Renewal 或封包配置。
- 客户端 UI、loose-data 覆盖、资源链接和网关解码都不进入数据库。
- MOTD 由服务进程读取，重启相关 rAthena 进程即可。

若以后修改尚未加载的 `db/*.yml` 实际游戏数据，应按 rAthena 当前加载方式执行 reload 或重启；这仍不同于重建 SQL 数据库。
