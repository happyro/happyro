# 游戏资料构建工具

`catalog/` 是 HappyRO Admin 游戏资料的独立构建工程。当前实现物品的客户端与服务端流水线，后续魔物、NPC 和地图作为并列资料类型扩展；生成逻辑和跨仓库来源校验归根仓库维护。

## 结构

```text
catalog/
├── main.py       # 薄命令入口
├── cli.py        # 参数、帮助和流程选择
├── service.py    # 可注入读写适配器的应用服务
├── client.py     # 客户端集合及双语名称合并规则
├── assets.py     # 客户端图标映射与说明索引规则
├── server.py     # rAthena 双语服务端快照规则
├── storage.py    # JSON、YAML、Git 和原子写出适配器
├── errors.py     # 领域错误
└── tests/        # 单元测试
```

`client.py` 和 `server.py` 只处理内存数据，不读取文件或调用 Git；`service.py` 通过参数注入读写函数，因此核心流程可以独立 Mock 和测试。`storage.py` 是唯一执行文件系统及 Git I/O 的模块。

## 使用

不带参数运行只显示帮助：

```bash
python3 tools/resources/catalog/main.py
```

生成仅客户端快照：

```bash
python3 tools/resources/catalog/main.py items client
```

该命令读取 `docs/translation/zh-cn/kro-20211105/merged/files/lub/itemInfo_true.json`、GRF 解压 `manifest.json` 与后台 Renewal 快照，一次生成 `client-kro-20211105.json`、`item-assets.json` 和 `descriptions.json`。客户端物品 ID 必须全部命中服务端快照，中文、英文名称和说明不能为空。

`item-assets.json` 会先精确匹配 GRF 路径，再依次使用 Unicode NFC 和不区分大小写的方式解析官方资源名，最终记录解压目录中的真实 icon 与 collection 相对路径。多个文件命中同一规范化路径时生成失败；资源名或图片缺失时保留物品，并写入明确的资源状态。

生成 Renewal 与 Pre-Renewal 服务端快照：

```bash
python3 tools/resources/catalog/main.py items server
```

该命令读取当前 `repos/happyro-server/db/` 中文数据，并通过 Git 读取英文基线 `2fe6ab3dc4d8`，生成后台的 `renewal.json` 和 `pre-renewal.json`。两个子命令都支持显式覆盖输入和输出路径；完整选项通过对应子命令的 `--help` 查看。

## 测试

```bash
python3 -m unittest discover tools/resources/catalog/tests
```
