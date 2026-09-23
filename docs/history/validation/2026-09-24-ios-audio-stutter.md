# iOS 攻击音效卡顿调查（2026-09-24）

状态：已定位主要问题路径，尚未实施性能修复。用户确认关闭音效后明显改善，希望保留音效，目前要求先讨论并记录方案。

本文保存当日诊断证据与待实施建议，不代表修复已经交付。后续采集操作见[移动端性能日志回传](../../development/mobile-diagnostics.md)。

## 现象与影响范围

- 用户反馈 iPhone、iPad 的 Safari 和 Chrome 在攻击时均有明显卡顿，表现为整个画面停顿；桌面端没有同样的明显问题。
- 本次收到的实机日志来自 iPhone Chrome 和 iPhone Safari。iPad 的现象来自用户反馈，尚未单独采样验证。
- 关闭游戏内“音效”后，用户确认卡顿明显改善。用户需要保留战斗音效，关闭音效仅作为排查对照和临时缓解方法。

## 采样环境与证据

当时入口为 `http://10.24.1.17:3338/applications/pwa/index.html?debug=1`，客户端构建标识为 `mufnng1z`，固定 Renewal / PACKETVER=20211103。两次手机采样的 DPR 均为 3、渲染比例为 100、帧率上限为 60，Bloom、Blur 和 FXAA 均关闭。

原始日志位于当时 Mac 的 `work/diagnostics/client/2026-09-24/`，属于本机生成数据，不随文档提交；其他检出不保证存在。以下统计冻结在调查时的时间范围，后续同一文件追加日志不改变本表结论。文中的时钟时间使用北京时间，JSONL 的 `time` 和 `receivedAt` 使用 UTC。

| 样本 | 会话 UUID | 统计范围与结果 |
| --- | --- | --- |
| iPhone Chrome，音效开启 | `2bc76e84-c5ce-4598-ba3c-abcc6e9999a9` | 截至 `elapsedMs=187135` 的采样记录了 34 次攻击；缓存音效 `.play()` 同步调用最高 242ms，伤害纹理生成最高 9ms，HUD 更新最高 4ms。 |
| iPhone Safari，音效开启 | `bbe64d67-97dc-41ed-b318-54f26b89d24a` | 前 4 个汇总窗口约 20.05 秒，未记录攻击；缓存音效 `.play()` 同步调用最高 99ms，渲染回调最高 100ms，帧间隔最高 118ms。 |
| 同一 Safari 会话，音效关闭后的稳定区间 | 同上 | 取截至 `elapsedMs=94967`、音效关闭且不含 `audio.*` 统计的 11 个完整窗口，约 55.09 秒，记录 46 次攻击、3,202 个帧间隔；仅 1 次达到或超过 50ms，最高 60ms；渲染回调最高 17ms，伤害纹理生成最高 4ms。 |

Safari 关闭后的稳定区间约为 23:07:47–23:08:42。切换音效的过渡窗口仍含音频调用，已从这一组统计排除。

这些证据强烈指向短音效播放路径。最严重的开启音效数据来自 Chrome，关闭后的主要战斗数据来自 Safari；Safari 开启音效的上述窗口没有攻击。因此这不是同一浏览器、同一战斗条件的完整开关对照，不能将全部改善幅度归因于关闭音效，也不能计算严格的性能提升比例。

## 测量含义

- `audio.play.cached` / `audio.play.new`：围绕 `sound.play()` 调用前后测量的耗时。242ms 发生在调用返回之前，缓存命中也会触发。该值是经过时间，可能包含系统调度等待，不等于纯 CPU 指令执行时间。
- `audio.play.ready`：从调用开始到播放 Promise 完成的等待时间，不能当作主线程阻塞时长。
- `perf.summary.cpuMs`：游戏渲染回调开始到结束的经过时间；`intervalMs` 是实际游戏渲染帧的间隔。60 帧目标下每帧预算约 16.7ms，长时间未返回的音效调用足以拖延下一帧。
- `damage.texture`：伤害数字 Canvas 处理和 WebGL 上传调用的耗时，不是 GPU 执行时间。
- 详细慢调用和长帧事件有数量上限；统计长帧次数应使用 `perf.summary.intervalMs.over50`，不能只数 `perf.frame-gap` 行数。

诊断实现见 [CombatDiagnostics.js](../../../repos/happyro-client/src/Core/CombatDiagnostics.js)。

## 代码中的问题路径

当时的 [SoundManager.js](../../../repos/happyro-client/src/Audio/SoundManager.js) 使用 HTML `<audio>` 播放 WAV 短音效：缺少可复用播放器时创建新元素，播放结束后重置播放位置并放入缓存，下次命中缓存继续调用 `.play()`。

已确认的两个问题点：

1. 复用播放器没有消除慢调用。日志中的最高 242ms 来自 `audio.play.cached`，因此仅增加文件预加载或播放器缓存不足以解决已观察到的停顿。
2. 100ms 同音效间隔和实例数量限制仅在新建播放器的加载回调中检查；缓存命中分支直接播放，绕过这些限制。这是可能放大密集战斗负载的代码因素，尚未单独测量其影响。

[EntitySound.js](../../../repos/happyro-client/src/Renderer/Entity/EntitySound.js) 根据实体动画触发音效，[Damage.js](../../../repos/happyro-client/src/Renderer/Effects/Damage.js) 也使用音效管理器。音频调用卡住时，影响会表现为整帧停顿，而不只是声音延迟。

## 为什么桌面端表现不同

相同的 JavaScript 媒体接口会进入不同平台的浏览器和系统音频实现，调用成本可能明显不同。Chrome 官方说明其 iOS 版本使用 WebKit，与其他平台的 Chrome 架构有差异；换用 iOS Chrome 不等于切换到桌面 Chrome 的媒体实现。

目前日志确认了 iOS 上 `.play()` 返回前的显著延迟，但尚未取得浏览器原生调用栈。具体慢在媒体进程通信、音频会话激活还是系统调度，仍是待验证项；不能笼统归因于“手机性能差”，也不能将某个 WebKit 已知问题直接认定为本次根因。桌面浏览器的触控模拟仅验证采集链路，不替代真实 iOS 性能验收。

## 待实施方案：使用 Web Audio 播放短音效

以下是讨论建议，尚未实施，也未完成实机效果验证。

1. 将战斗短音效加载并异步解码为 `AudioBuffer`，按资源缓存并合并重复加载请求。对当前角色常用攻击音效做适量预加载，避免把资源准备集中在第一次攻击时。
2. 共用一个长期存在的 `AudioContext`，每次播放创建 `AudioBufferSourceNode`，复用已经解码的缓冲区，通过增益节点控制音量和距离衰减。播放节点用完释放，不为每次攻击创建新的 `AudioContext`。
3. 统一处理缓存命中与首次加载时的并发限制、同音效节流和停止逻辑；优先保留玩家自己的攻击、受击与技能反馈，防止高攻速或连击被过度节流。为解码缓存设置内存上限和回收策略。
4. 在现有“进入游戏”等用户点击中激活音频，处理切后台、锁屏、音频中断后恢复，以及退出或切图时未完成加载和过期播放请求。
5. 建议桌面和移动端统一使用新的短音效实现。背景音乐由独立的 [BGM.js](../../../repos/happyro-client/src/Audio/BGM.js) 长音轨播放器管理，可继续沿用；改动重点是频繁触发的短音效。

Web Audio 提供缓冲区播放、混音与音频调度，适合这一使用场景。它仍有节点创建、缓存内存和首次解码成本，实际效果必须通过手机复测确认，不能承诺换 API 后所有长帧都会消失。

## 后续验收要求

- 在同一台手机、同一浏览器、同一地图与战斗场景下，固定画质和方向，执行音效开启、关闭、再开启的对照；分别覆盖 iPhone / iPad、Safari / Chrome。
- 保持音效开启，验证普通攻击、高攻速连击、技能和多怪战斗，观察声音与动作同步，以及关键音效是否丢失。
- 对比帧间隔 P95/P99、最大值、达到或超过 50ms 的次数，以及音效启动耗时；目标是接近关闭音效时的画面流畅度，消除攻击反复触发的百毫秒级停顿。
- 单独验证首次播放与缓存命中、音量调整、切图、重登、锁屏和切后台恢复；同时检查长时间战斗的内存增长和背景音乐共存。
- 桌面端做音效与战斗回归；完成后再更新本文的修复状态和新构建采样证据。

## 参考资料

- [Chrome 官方：Getting started with Chrome on iOS](https://developer.chrome.com/blog/chromium-chronicle-28)：iOS Chrome 的 WebKit 架构。
- [Apple：Playing Sounds with the Web Audio API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html)：游戏音效、共享上下文和缓冲区复用。该页是历史文档，其中旧 API 示例不作为新实现的代码模板。
- [W3C Web Audio API](https://www.w3.org/TR/webaudio/)：实现时核对当前的解码、播放节点、音频线程和上下文生命周期接口。
