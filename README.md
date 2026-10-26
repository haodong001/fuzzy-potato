# 大爱仙尊 · 春秋蝉

一个 DeepSeek Harness Web GUI 的**客户端插件**（`dsh.client` / `platform: web`），做两件事：

1. **皮囊**：把整个界面换成「大爱仙尊」的冷冽漫画感 —— 墨黑底色、霜白细线、朱红只给主行动与印章、圆角收到 2–6px、标题换宋体、页面四角打上裁切线。
2. **方源**：右下角坐一个 Q 版方源（白长发、黑袍朱领、肩上停着春秋蝉），点开是一张实时账单 —— 本会话的 token 总量、四个桶（输入 / 缓存读 / 缓存写 / 输出）、缓存命中率、上下文占用，以及按官方**峰谷价**折算的「元石」花费和"什么时候跑更便宜"的建议。高峰时段还会在**发送前**弹一句软提醒。数字跟着会话走，变化时闪一次冷光，推演中蝉翅会颤。

![皮肤与挂件在真实 GUI 里的样子](preview/live-app.png)

> 上图是从运行中的 DSH 窗口直接截的：左边是换上皮肤后的侧栏与对话区，右下是挂件（折叠态，只显示「今生 21.4M tok」）。

---

## 一、视觉语言

不自造一套设计系统，只覆盖 ui-theme 的 **alias token**：宿主把 118 个 `--dsw-alias-*` 变量写成 `<body>` 的内联变量，所有组件自然跟着变色。剩下的形制（圆角、字面、选区、裁切线、挂件）由插件自带的一层薄 CSS 负责。

| 角色 | 值 | 用法 |
| --- | --- | --- |
| 墨 base | `#06070A` | 应用底色，比纯黑亮一档，避免屏幕死黑 |
| 纸 layer-1/2/3 | `#0A0C10` / `#0E1116` / `#13171D` | 卡片、嵌套面、输入框 |
| 霜 line-l1…l4 | 霜白 6% / 10% / 15% / 22% | 所有分隔线只用这四档，永远不上 24% |
| 字 primary/secondary/tertiary | `#E8EEF5` / `#A9B4C0` / `#7A8592` | 三级文字，对比度 12:1 / 6:1 / 3:1 |
| 朱 brand | `#A62A31`（hover `#C0333B`） | 主行动、选中条、印章、输出桶；一屏不超过三处 |
| 霜青 link / business | `#8FB6D9` | 链接、信息态、上下文占用环 |
| 苔 success | `#5B9C85` | 成功态 |
| 错 / 警 | `#CF444B` / `#C69B4E` | 错误 / 警告 |

形制规则（写在 `src/skin.css` 与设计板里）：

- 线宽只有 `0.5 / 1 / 2px` 三档，绝不用 3px 以上的描边。
- 圆角 2–6px（`--dsw-radius-*` 全部下调），页面四角打 14px 裁切线 —— 像分镜纸，不像玻璃控件。
- 标题用宋体（`Songti SC / SimSun / Noto Serif SC`），正文保持系统 UI 字面，代码用等宽。
- 动效 200–500ms，只改位移与透明度，不改尺寸；`prefers-reduced-motion` 下全部停掉。
- 选区是霜青 28%，不是浏览器默认蓝。

![设计板](preview/board.png)

---

## 二、实时 token 从哪来

插件**不猜、不爬 DOM、不另开接口**，只用宿主公开的会话投影：

- `conversation.composer.dock` 槽里的一个**零高度探针**组件拿到 `useProjection`，
  读 `tokenUsage`（四个互斥桶：`uncachedInputTokens` / `cacheReadTokens` /
  `cacheWriteTokens` / `outputTokens`）和 `contextPressure`（`projectedTokens` /
  `pressureTokens` + `contextWindow`）；
- 探针把结果推给一个模块级 store，`shell.overlay` 里的挂件用
  `useSyncExternalStore` 订阅它。

```js
// 探针（不渲染任何东西）
const usage = useProjection('tokenUsage')
const pressure = useProjection('contextPressure')
useEffect(() => probe.set({ usage, pressure }), [usage, pressure])

// 挂件（右下角）
const total = billed + usage.outputTokens       // billed = 输入 + 缓存读 + 缓存写
const cacheHit = Math.round(cacheRead / billed * 100)
const ctxPercent = Math.round(used / contextWindow * 100)
```

这样做的两个理由：

1. **口径和宿主一致**：对话区底部那行统计用的是同一份投影，挂件的数字永远不会和它打架。
2. **零额外请求**：挂件不触发任何 RPC，切会话时只是投影对象换了引用，开销可以忽略。

会话切走时探针卸载、挂件显示 `—`；新会话的投影到了就恢复。

---

## 三、元石：这一炉烧了多少钱

按官方峰谷价折成本会话花费（元 / 百万 tokens，缓存写暂不计费）：

| 模型 | 输入 峰/谷 | 缓存读 峰/谷 | 输出 峰/谷 |
| --- | --- | --- | --- |
| Flash | 2 / 1 | 0.04 / 0.02 | 8 / 4 |
| V4 Pro | 9 / 4.5 | 0.3 / 0.15 | 27 / 13.5 |
| Chat | 2 / 2 | 0.5 / 0.5 | 8 / 8 |
| Reasoner | 4 / 4 | 1 / 1 | 16 / 16 |

峰谷口径（北京时间，固定 UTC+8）：**周一至周五 9:00–12:00、14:00–18:00 为高峰**，其余时段——含整个周末、法定节假日、以及 12:00–14:00 午休——都是空闲档，单价减半。

![展开后的用量与元石卡片](preview/live-card.png)

卡片上因此多了四样东西：

- **元石**：本会话估算花费，按当前档位计价；
- **模型芯片**：点一下在 Flash / V4 Pro / Chat / Reasoner 之间切换（换计价档，记在 `localStorage` 的 `dalian.model`）；
- **峰谷灯 + 倒计时**：琥珀点是高峰、苔绿点是空闲，右边是距下次转档的剩余时间；
- **一句建议**：高峰时是「再等 15 分钟（12:00）转空闲，同量约省 ¥2.02」；空闲时提醒你还有多久转高峰、单价翻倍；
- **发送前软提醒**：高峰时段、草稿非空时，第一次按发送（回车或点发送键）会弹一张确认卡「现在是高峰档，再等 X 分钟转空闲，同量约省一半」，可选**继续发送**或**再等等**。选哪个都会在本段高峰内不再打扰，下一段高峰再问。只对有峰谷差价的模型（Flash / V4 Pro）生效，Chat / Reasoner 无折扣不拦。

口径的诚实说明：`tokenUsage` 是整段会话的累计值，没有逐轮时间戳，所以统一按**此刻**的档位计价 —— 它用来判断"还要不要现在接着跑"，不是账单。单价表与峰谷表（含法定节假日）参照官方价格页快照，并与社区插件 [`@dougen/dsh-deepseek-usage`](https://github.com/dougen/dsh-deepseek-usage) 的 `lib/pricing.js` 保持一致；官方调价时改 `src/client/index.js` 顶部的 `PRICES` / `HOLIDAY_RANGES` 即可。

---

## 四、安装

### 已装到本机

- 包本体：`%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-dalian-xianzun`
- 挂载行：`%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml`

```yaml
- insert:
    - id: dalian-xianzun
      name: 'dsh-dalian-xianzun'
```

profile 的配置文件有 watcher（约 1s 重组），所以**不需要重启应用**：保存后宿主会挂载这个包，页面通过 `/plugins` 热加载模块。若页面没有立刻出现挂件，按 `Ctrl+R` 刷新一次（模块图更新在个别情况下会滞后）。

### 换一台机器

```powershell
# 1. 把整个目录放进 profile 的 node_modules
Copy-Item .\dsh-dalian-xianzun "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\" -Recurse

# 2. 往 profile 的 cordis.patch.yml 末尾追加上面那三行 insert
```

或者用 `dsh plugin add` / 插件市场安装（包内自带 `cordis.patch.yml` 与 `skin.json`，市场会识别为 `theme` 类）。

### 卸载

删掉 `node_modules\dsh-dalian-xianzun` 与 `cordis.patch.yml` 里的 insert 行即可。`cordis.patch.yml.bak` 是安装前的备份。

---

## 五、用起来

- 点右下角的方源：展开用量卡片；再点一次收起。
- 卡片里的「皮囊 · 开/关」：只关皮肤、留挂件（关掉时把主题还原成你原来的 light / dark / system）。
- 展开状态与皮肤开关存在 `localStorage`：`dalian.hud.open` / `dalian.skin.enabled`。
- 「推演中」出现在 token 数增长后的 2.6 秒内，蝉翅同频颤动；平时是静止的。

---

## 六、目录结构

```
dsh-dalian-xianzun/
├─ package.json            dsh.client = { platform: 'web' }，exports ./client
├─ cordis.patch.yml        把本包作为 Loader 行插入 profile
├─ skin.json               市场用的皮肤清单
├─ lib/index.js            宿主半边：空插件（这个皮肤不需要任何 Host 服务）
├─ client/client.js        构建产物：window.__ModuleLoader__.load(...) 工厂包
├─ src/
│  ├─ tokens.mjs           118 个 alias token 的唯一来源（同时喂给 client 与预览）
│  ├─ skin.css             形制层：圆角、宋体、选区、裁切线、印章
│  ├─ hud.css              挂件：方源、气泡、用量卡片、动效
│  ├─ mascot.svg           Q 版方源（纯 SVG，无位图）
│  ├─ preview.css          预览页外壳（模拟 DSH 骨架，不参与插件运行）
│  ├─ preview/             预览模板
│  └─ client/index.js      客户端逻辑源（构建时内联上面的资源）
├─ tools/build.mjs         零依赖构建：产出 client/client.js 与 preview/*.html
└─ preview/                静态预览页与截图
```

### 构建

```powershell
# 有 node
node tools/build.mjs

# 只有 DSH 自带的 Electron
& "E:\...\DeepSeek Harness.exe" tools\build.mjs
```

构建会做三件事：把 `tokens.mjs` / 两个 CSS / mascot.svg 内联进 `src/client/index.js` 的占位符、用 `vm.Script` 做一次语法体检、再生成 `preview/index.html` 与 `preview/board.html`。

---

## 七、实现上踩过的坑

- **主题注册要幂等**。HMR 先挂新实例、后拆旧实例，旧实例的 `dispose` 若直接「恢复上一个偏好」会把新实例刚点亮的主题按回浅色（亲眼见过：皮肤突然变白）。现在的做法是：主题只注册一次、永不注销；`dispose` 的恢复延后一个微任务，并检查有没有更新实例接手。
- **卡片单独包了错误边界**。用量卡片再怎么坏，也不许把方源一起带走 —— 失败时降级成一行「用量卡片暂时不可用」。
- **白发在浅色主题下会消失**。挂件因此自带一团极淡的墨（`radial-gradient`），在浅色底上也能立住。
- **不要自己拿 RPC 算 token**。宿主已经把 `tokenUsage` 投影好了，重算一遍只会得到和底部统计不一致的数字。

---

## 八、已知取舍

- 皮肤是**强制深色**的（`colorScheme: 'dark'`）。冷冽感靠深墨底才成立，所以不提供浅色变体。
- 第三方主题 id 不写进 ui-theme 的设置命名空间（宿主只持久化 light/dark/system），刷新后由插件重新点亮；这期间有一瞬间的原主题，可接受。
- 挂件固定在右下、不与输入框抢点击；窄屏（<720px）会缩小并隐藏气泡。
- Q 版方源是手写 SVG，只保证"一眼是白长发黑袍修士"；要更接近原画需要矢量绘师，不是 CSS 能补的。
- 手动放进 `node_modules` 的包不会被写进 profile 的 `package.json`，下次跑 `dsh plugin add/remove` 时 pnpm 可能把它 prune 掉；那时把目录拷回去、确认 insert 行还在即可。

---

## License

MIT
