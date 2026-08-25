# Bugfix 记录

本目录保存运行验证中发现的跨仓库缺陷及其修复记录。Bugfix 文档用于追踪现象、根因、维护源、环境操作、验证证据和提交边界，不保存正式源码、翻译分片或构建产物。

翻译相关缺陷必须按 [`../translation/zh-cn/WORKFLOW.md`](../translation/zh-cn/WORKFLOW.md) 回到真实维护源，再重新执行受影响阶段。不能只修改 `work/`、`artifacts/`、临时 merged 或目标仓库中的生成文件。

## 目录约定

```text
docs/bugfix/<locale>/<YYYYMMDD-NN>/
```

不依赖语言的缺陷可以使用 `docs/bugfix/common/<YYYYMMDD-NN>/`。同一批次可以涵盖多个仓库，但提交仍按仓库和逻辑变更拆分。

当前 zh-cn 批次见 [`zh-cn/`](zh-cn/README.md)。
