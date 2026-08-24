# 中文翻译工作区

本目录包含两个相互独立的中文翻译工作区：

- [`client-server/`](client-server/README.md)：HappyRO client 和 server 项目的主产品翻译工作区；
- [`kro-20211105/`](kro-20211105/README.md)：kRO 2021-11-05 官方客户端资源的独立翻译工作区。

两个工作区分别维护自己的清单、进度、术语表、基准文件和 agent 目录，不共用工作状态文件。

## 工作区边界

主产品翻译工作区：

```text
docs/translation/zh-cn/client-server/
```

kRO 专用翻译工作区：

```text
docs/translation/zh-cn/kro-20211105/
```

每个工作区的 agent 都位于各自的 `agents/` 目录下。kRO 的提取基准和状态记录也只属于 kRO 工作区，不写入主产品工作区。
