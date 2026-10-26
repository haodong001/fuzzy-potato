/**
 * 大爱仙尊 · 春秋蝉 — 客户端插件本体。
 *
 * 这个文件是「源文件」：tools/build.mjs 把 tokens.mjs / skin.css / hud.css /
 * mascot.svg 内联进 __*__ 占位符，产出 client/client.js（浏览器加载的
 * __ModuleLoader__ 工厂包）。不要直接改 client/client.js。
 *
 * 对外只有三件事：
 *   1. 通过 ctx.theme.register 注册「大爱仙尊」主题（colorScheme 恒为 dark），
 *      并把当前偏好切过去；
 *   2. 注入一层极薄的 chrome CSS（圆角、字面、选区、裁切线）与 HUD 样式；
 *   3. 在 shell.overlay 放 Q 版方源挂件，在 conversation.composer.dock 放一个
 *      零高度的探针，读取会话的 tokenUsage / contextPressure 投影，喂给挂件。
 */

window.__ModuleLoader__.load({
  id: 'dsh-dalian-xianzun',
  factory: function (require) {
    var module = { exports: {} }
    var exports = module.exports

    var React = require('react')
    var h = React.createElement

    var THEME = __THEME__
    var SKIN_CSS = __SKIN_CSS__
    var HUD_CSS = __HUD_CSS__
    var MASCOT = __MASCOT__
    var VERSION = __VERSION__

    var PLUGIN_ID = 'dsh-dalian-xianzun'
    var KEYS = { skin: 'dalian.skin.enabled', open: 'dalian.hud.open', model: 'dalian.model' }

    /* ------------------------------------------------------------------ *
     * 小工具：存储、格式化
     * ------------------------------------------------------------------ */

    function readFlag(key, fallback) {
      try {
        var raw = window.localStorage.getItem(key)
        if (raw === null) return fallback
        return raw === '1'
      } catch (error) {
        return fallback
      }
    }

    function writeFlag(key, value) {
      try {
        window.localStorage.setItem(key, value ? '1' : '0')
      } catch (error) {
        /* 隐私模式下不可写，忽略 */
      }
    }

    function readText(key, fallback) {
      try {
        var value = window.localStorage.getItem(key)
        return value === null ? fallback : value
      } catch (error) {
        return fallback
      }
    }

    function writeText(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch (error) {
        /* ignore */
      }
    }

    function fmtCompact(value) {
      var n = Number(value) || 0
      if (n < 1000) return String(Math.round(n))
      if (n < 1e6) {
        var k = n / 1e3
        return (k >= 100 ? Math.round(k) : Math.round(k * 10) / 10) + 'k'
      }
      var m = n / 1e6
      return (m >= 100 ? Math.round(m) : Math.round(m * 10) / 10) + 'M'
    }

    function fmtExact(value) {
      return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    /* ------------------------------------------------------------------ *
     * 元石：官方峰谷价（元 / 百万 tokens）
     *
     * 单价与峰谷口径取 DeepSeek 官方价格页快照，并与社区插件
     * @dougen/dsh-deepseek-usage（lib/pricing.js）保持一致：
     *   高峰 = 北京时间 周一至周五（不含法定节假日）9:00–12:00、14:00–18:00，
     *   其余（周末、节假日、晚间）为空闲，空闲档单价减半；缓存写暂不计费。
     * 浏览器侧没办法 import 宿主的定价模块，所以这里放一份同口径的镜像；
     * 官方调价时要同步改这里。
     * ------------------------------------------------------------------ */

    var PRICES = {
      'deepseek-flash': { label: 'Flash', input: [2, 1], cacheRead: [0.04, 0.02], output: [8, 4] },
      'deepseek-v4-pro': { label: 'V4 Pro', input: [9, 4.5], cacheRead: [0.3, 0.15], output: [27, 13.5] },
      'deepseek-chat': { label: 'Chat', input: [2, 2], cacheRead: [0.5, 0.5], output: [8, 8] },
      'deepseek-reasoner': { label: 'Reasoner', input: [4, 4], cacheRead: [1, 1], output: [16, 16] },
    }
    var MODEL_ORDER = ['deepseek-flash', 'deepseek-v4-pro', 'deepseek-chat', 'deepseek-reasoner']
    var PEAK_WINDOWS = [[9, 12], [14, 18]]
    var HOLIDAY_RANGES = [
      ['2026-01-01', '2026-01-03'],
      ['2026-02-15', '2026-02-23'],
      ['2026-04-04', '2026-04-06'],
      ['2026-05-01', '2026-05-05'],
      ['2026-06-19', '2026-06-21'],
      ['2026-09-25', '2026-09-27'],
      ['2026-10-01', '2026-10-07'],
    ]

    var HOLIDAYS = (function () {
      var set = {}
      var day = 24 * 60 * 60 * 1000
      HOLIDAY_RANGES.forEach(function (range) {
        var from = Date.parse(range[0] + 'T00:00:00Z')
        var to = Date.parse(range[1] + 'T00:00:00Z')
        if (!isFinite(from) || !isFinite(to)) return
        for (var t = from; t <= to; t += day) set[new Date(t).toISOString().slice(0, 10)] = true
      })
      return set
    })()

    function pad2(n) {
      return (n < 10 ? '0' : '') + n
    }

    /** 北京时间的墙钟分量（固定 UTC+8，不随浏览器时区漂移）。 */
    function beijing(ms) {
      var d = new Date(ms + 8 * 60 * 60 * 1000)
      return {
        key: d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()),
        dow: d.getUTCDay(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
      }
    }

    function isPeak(ms) {
      var t = beijing(ms)
      if (HOLIDAYS[t.key]) return false
      if (t.dow === 0 || t.dow === 6) return false
      for (var i = 0; i < PEAK_WINDOWS.length; i += 1) {
        if (t.hour >= PEAK_WINDOWS[i][0] && t.hour < PEAK_WINDOWS[i][1]) return true
      }
      return false
    }

    /**
     * 下一次峰谷翻转：候选只能是窗口起止整点，按天枚举取第一个让 isPeak 翻面的时刻。
     * 返回 { peak, ms }，ms 为剩余毫秒；找不到时 at 为 null。
     */
    function nextChange(ms) {
      var current = isPeak(ms)
      var day = 24 * 60 * 60 * 1000
      var hour = 60 * 60 * 1000
      var today = Date.parse(beijing(ms).key + 'T00:00:00Z') - 8 * 60 * 60 * 1000
      var boundaries = [9, 12, 14, 18]
      for (var d = 0; d < 32; d += 1) {
        for (var i = 0; i < boundaries.length; i += 1) {
          var at = today + d * day + boundaries[i] * hour
          if (at <= ms) continue
          if (isPeak(at) !== current) return { peak: !current, at: at, ms: at - ms }
        }
      }
      return { peak: !current, at: null, ms: 0 }
    }

    /** 人话时长：2 小时 15 分 / 47 分钟。 */
    function fmtDuration(ms) {
      var minutes = Math.round(ms / 60000)
      if (minutes < 1) return '1 分钟内'
      if (minutes < 60) return minutes + ' 分钟'
      var hours = Math.floor(minutes / 60)
      var rest = minutes % 60
      if (hours < 24) return rest === 0 ? hours + ' 小时' : hours + ' 小时 ' + rest + ' 分'
      var days = Math.floor(hours / 24)
      return days + ' 天 ' + (hours % 24) + ' 小时'
    }

    /**
     * 本会话的元石估算：token 四个桶 × 当前时段单价。
     *
     * 口径说明：tokenUsage 是整个会话的累计值，没有逐轮时间戳，所以这里统一按
     * **此刻**的档位计价（高峰/空闲），用于"还要不要现在继续跑"的判断，不是账单。
     */
    function estimateCost(usage, model, peak) {
      if (usage === null) return null
      var price = PRICES[model] || PRICES['deepseek-flash']
      function at(tier) {
        return (
          (usage.uncached * price.input[tier] +
            usage.cacheRead * price.cacheRead[tier] +
            usage.output * price.output[tier]) /
          1e6
        )
      }
      var live = at(peak ? 0 : 1)
      var peakCost = at(0)
      var idleCost = at(1)
      return { live: live, peak: peakCost, idle: idleCost, savedIfIdle: peakCost - idleCost }
    }

    /** 北京时间的 HH:MM，给"几点转档"用。 */
    function beijingClock(ms) {
      var t = beijing(ms)
      return pad2(t.hour) + ':' + pad2(t.minute)
    }

    function fmtYuan(value) {
      if (value === null) return '—'
      if (value >= 100) return '¥' + value.toFixed(0)
      if (value >= 1) return '¥' + value.toFixed(2)
      return '¥' + value.toFixed(3)
    }

    /* ------------------------------------------------------------------ *
     * 极简 store：投影和皮肤开关都不走 React state，避免挂件与探针互相重挂
     * ------------------------------------------------------------------ */

    function createStore(initial) {
      var state = initial
      var listeners = new Set()
      return {
        get: function () {
          return state
        },
        set: function (next) {
          var value = typeof next === 'function' ? next(state) : next
          if (value === state) return
          state = value
          listeners.forEach(function (listener) {
            try {
              listener()
            } catch (error) {
              /* 单个订阅者失败不能拖垮其它 */
            }
          })
        },
        subscribe: function (listener) {
          listeners.add(listener)
          return function () {
            listeners.delete(listener)
          }
        },
      }
    }

    /** 探针写入、挂件读取的会话用量。 */
    var probe = createStore({ usage: undefined, pressure: undefined })

    function useStore(store) {
      return React.useSyncExternalStore(store.subscribe, store.get)
    }

    /* ------------------------------------------------------------------ *
     * 峰谷软提醒：高峰时段、草稿非空时，拦一次 submit，弹确认。
     * 计价模型是模块级 store，挂件与守卫共用同一个来源。
     * ------------------------------------------------------------------ */

    var modelStore = createStore(readText(KEYS.model, 'deepseek-flash'))
    var confirmStore = createStore(null)
    var snoozedUntil = 0

    /** 高峰、且本窗口还没被"别再问"，才需要提醒。 */
    function peakGate(now, model) {
      var price = PRICES[model] || PRICES['deepseek-flash']
      if (price.input[0] === price.input[1]) return false // 无峰谷差价的模型不提醒
      return isPeak(now) && !(now < snoozedUntil)
    }

    function snoozeUntil(until) {
      if (typeof until === 'number' && isFinite(until) && until > 0) snoozedUntil = until
    }

    function resolveConfirm(action) {
      var entry = confirmStore.get()
      if (entry === null) return
      confirmStore.set(null)
      snoozeUntil(entry.until)
      if (action === 'continue') {
        try {
          entry.original.call(entry.keyboard, entry.mode, entry.source)
        } catch (error) {
          console.warn('[dalian] 重发失败', error)
        }
      }
    }

    function cycleModel() {
      var index = MODEL_ORDER.indexOf(modelStore.get())
      var nextModel = MODEL_ORDER[(index + 1) % MODEL_ORDER.length]
      modelStore.set(nextModel)
      writeText(KEYS.model, nextModel)
    }

    /* ------------------------------------------------------------------ *
     * 用量归一：tokenUsage 的四个桶，以及上下文占用
     * ------------------------------------------------------------------ */

    function normalizeUsage(usage) {
      if (usage === undefined || usage === null || typeof usage !== 'object') return null
      var uncached = Number(usage.uncachedInputTokens) || 0
      var cacheRead = Number(usage.cacheReadTokens) || 0
      var cacheWrite = Number(usage.cacheWriteTokens) || 0
      var output = Number(usage.outputTokens) || 0
      var billed = uncached + cacheRead + cacheWrite
      if (billed === 0 && output === 0) return null
      return {
        uncached: uncached,
        cacheRead: cacheRead,
        cacheWrite: cacheWrite,
        output: output,
        billed: billed,
        total: billed + output,
        cacheHit: billed > 0 ? Math.round((cacheRead / billed) * 100) : null,
      }
    }

    function normalizeContext(pressure) {
      if (pressure === undefined || pressure === null || typeof pressure !== 'object') return null
      var used = Number(pressure.projectedTokens ?? pressure.pressureTokens)
      var window = Number(pressure.contextWindow)
      if (!isFinite(used) || !isFinite(window) || window <= 0) return null
      return { used: used, window: window, percent: Math.min(100, Math.round((used / window) * 100)) }
    }

    /* ------------------------------------------------------------------ *
     * 皮肤控制器：注册主题 + 切换偏好 + 清掉 html 上的开关属性
     *
     * 热重载（HMR）会先挂新实例、后拆旧实例，旧实例的 dispose 若直接「恢复上一个
     * 偏好」就会把新实例刚点亮的主题按回去（表现为皮肤突然变回浅色）。所以：
     *   - 主题注册只做一次，永不注销（id 固定，重复注册被吞掉）；
     *   - dispose 里的恢复延后一个微任务，并且只在没有更新实例接手时才执行。
     * ------------------------------------------------------------------ */

    var activeGeneration = 0

    function createSkinController(ctx) {
      var registered = null
      var previous = 'dark'
      var enabled = readFlag(KEYS.skin, true)
      var store = createStore(enabled)

      function register() {
        if (registered !== null) return
        try {
          registered = ctx.theme.register(THEME)
        } catch (error) {
          // 上一个实例还注册着同一个 id：沿用它，不要把它当成失败。
          registered = null
        }
      }

      function apply(on) {
        var root = document.documentElement
        if (on) {
          register()
          try {
            ctx.theme.setTheme(THEME.id)
          } catch (error) {
            console.warn('[dalian] 无法切换到大爱仙尊主题', error)
          }
          root.setAttribute('data-dalian-skin', 'on')
        } else {
          try {
            ctx.theme.setTheme(previous === THEME.id ? 'dark' : previous)
          } catch (error) {
            /* 宿主没注册过这个偏好就保持原样 */
          }
          root.removeAttribute('data-dalian-skin')
        }
      }

      return {
        start: function () {
          activeGeneration += 1
          try {
            var snapshot = ctx.theme.getTheme()
            if (snapshot && typeof snapshot.preference === 'string' && snapshot.preference !== THEME.id) {
              previous = snapshot.preference
            }
          } catch (error) {
            previous = 'dark'
          }
          apply(enabled)
        },
        /**
         * 守住皮肤：宿主的设置页每次“采纳”持久化偏好（light/dark/system）都会把
         * 第三方主题 id 覆盖掉，皮囊会莫名其妙变回浅色。这里两条保险：
         *   · 监听 theme/change，一旦发现偏好不是我们的、而皮囊是开的，就再点亮一次；
         *   · 每 20 秒兜底检查一次（有些设置推送不会发事件）。
         */
        guard: function () {
          var off = function () {}
          try {
            off = ctx.on('theme/change', function () {
              if (!store.get()) return
              var snap = null
              try {
                snap = ctx.theme.getTheme()
              } catch (error) {
                return
              }
              if (snap && snap.preference !== THEME.id) {
                if (snap.preference !== 'system') previous = snap.preference
                try {
                  ctx.theme.setTheme(THEME.id)
                } catch (error) {
                  /* ignore */
                }
              }
            })
          } catch (error) {
            off = function () {}
          }
          var timer = setInterval(function () {
            if (!store.get()) return
            var snap = null
            try {
              snap = ctx.theme.getTheme()
            } catch (error) {
              return
            }
            if (snap && snap.preference !== THEME.id) {
              try {
                ctx.theme.setTheme(THEME.id)
              } catch (error) {
                /* ignore */
              }
            }
          }, 20000)
          return function () {
            try {
              if (typeof off === 'function') off()
            } catch (error) {
              /* ignore */
            }
            clearInterval(timer)
          }
        },
        dispose: function () {
          var generation = activeGeneration
          var restore = function () {
            // 已经有新实例接手：让新实例说了算。
            if (activeGeneration !== generation) return
            document.documentElement.removeAttribute('data-dalian-skin')
            try {
              if (previous && previous !== THEME.id) ctx.theme.setTheme(previous)
            } catch (error) {
              /* ignore */
            }
          }
          if (typeof queueMicrotask === 'function') queueMicrotask(restore)
          else setTimeout(restore, 0)
        },
        enabled: function () {
          return store.get()
        },
        get: store.get,
        subscribe: store.subscribe,
        set: function (on) {
          enabled = on
          writeFlag(KEYS.skin, on)
          store.set(on)
          apply(on)
        },
      }
    }

    /* ------------------------------------------------------------------ *
     * 探针：坐在 composer dock 里，只为拿 useProjection
     * ------------------------------------------------------------------ */

    function ProbeHooks(props) {
      var useProjection = props.useProjection
      var usage = useProjection('tokenUsage')
      var pressure = useProjection('contextPressure')

      React.useEffect(
        function () {
          probe.set({ usage: usage, pressure: pressure })
        },
        [usage, pressure],
      )
      return null
    }

    /** dock 槽在极老宿主上不传 useProjection：那时安静地什么都不做。 */
    function Probe(props) {
      if (typeof props.useProjection !== 'function') return null
      return h(ProbeHooks, props)
    }

    /* ------------------------------------------------------------------ *
     * 挂件
     * ------------------------------------------------------------------ */

    /** 卡片自己的错误边界：用量卡片再怎么坏，也不许把方源一起带走。 */
    class CardBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { failed: false }
      }

      static getDerivedStateFromError() {
        return { failed: true }
      }

      componentDidCatch(error) {
        console.warn('[dalian] 用量卡片渲染失败，已降级', error)
      }

      render() {
        if (this.state.failed) {
          return h('div', { className: 'dl-card dl-card--failed' }, '用量卡片暂时不可用 · 点方源重试')
        }
        return this.props.children
      }
    }

    /** 峰谷软提醒：坐在 composer dock 里，把 shell.submit 包一层。 */
    function PeakGuard(props) {
      var keyboard = props.keyboard

      React.useEffect(
        function () {
          if (keyboard === undefined || keyboard === null) return undefined
          var original = keyboard.submit
          if (typeof original !== 'function' || original.__dalian === true) return undefined

          var wrapped = function (mode, source) {
            var now = Date.now()
            var model = modelStore.get()
            if (!peakGate(now, model)) {
              original.call(keyboard, mode, source)
              return
            }
            var text = ''
            try {
              text = keyboard.draftSnapshot && keyboard.draftSnapshot.text ? keyboard.draftSnapshot.text : ''
            } catch (error) {
              text = ''
            }
            if (typeof text === 'string' && text.trim() === '') {
              original.call(keyboard, mode, source)
              return
            }
            confirmStore.set({
              keyboard: keyboard,
              original: original,
              mode: mode,
              source: source,
              until: nextChange(now).at,
              change: nextChange(now),
            })
          }
          wrapped.__dalian = true
          keyboard.submit = wrapped
          return function () {
            if (keyboard.submit === wrapped) keyboard.submit = original
          }
        },
        [keyboard],
      )

      return null
    }

    function PeakConfirm(props) {
      var c = props.confirm
      var change = c.change
      var clock = change && change.at ? beijingClock(change.at) : '—'
      var wait = change && change.ms ? fmtDuration(change.ms) : ''

      return h(
        'div',
        { className: 'dl-confirm', role: 'dialog', 'aria-modal': 'true', 'aria-label': '高峰时段提醒' },
        h(
          'div',
          { className: 'dl-confirm-box' },
          h('div', { className: 'dl-confirm-eyebrow' }, '高峰档 · 元石翻倍'),
          h(
            'p',
            { className: 'dl-confirm-text' },
            '现在是高峰档，单价是空闲时段的 2 倍。再等 ' + wait + '（' + clock + '）转空闲，同量约省一半。',
          ),
          h(
            'div',
            { className: 'dl-confirm-actions' },
            h(
              'button',
              { type: 'button', className: 'dl-btn dl-btn--danger', onClick: function () { resolveConfirm('continue') } },
              '继续发送',
            ),
            h(
              'button',
              { type: 'button', className: 'dl-btn', onClick: function () { resolveConfirm('wait') } },
              '再等等',
            ),
          ),
        ),
      )
    }

    function PeakConfirmHost() {
      var confirm = useStore(confirmStore)
      if (confirm === null) return null
      return h(PeakConfirm, { confirm: confirm })
    }

    function Hud(props) {
      var controller = props.controller
      var state = useStore(probe)
      var skinOn = useStore(controller)
      var usage = normalizeUsage(state.usage)
      var context = normalizeContext(state.pressure)

      // 时钟：峰谷倒计时每 30 秒重算一次，不必更密。
      var clockState = React.useState(Date.now())
      var now = clockState[0]
      var setNow = clockState[1]
      React.useEffect(function () {
        var timer = setInterval(function () {
          setNow(Date.now())
        }, 30000)
        return function () {
          clearInterval(timer)
        }
      }, [])

      // 计价模型：宿主没把"当前模型"投影给我们，所以显式选一次并记住（模块级 store）。
      var model = useStore(modelStore)

      var peak = isPeak(now)
      var change = nextChange(now)
      var cost = estimateCost(usage, model, peak)
      var priceInfo = PRICES[model] || PRICES['deepseek-flash']

      var openState = React.useState(readFlag(KEYS.open, false))
      var open = openState[0]
      var setOpen = openState[1]

      // 卡片展开时把右边那枚竖排朱印收起来，免得和卡片压在一起。
      React.useEffect(function () {
        var root = document.documentElement
        if (open) root.setAttribute('data-dalian-card', 'open')
        else root.removeAttribute('data-dalian-card')
        return function () {
          root.removeAttribute('data-dalian-card')
        }
      }, [open])

      var flashState = React.useState(false)
      var flash = flashState[0]
      var setFlash = flashState[1]

      var busyState = React.useState(false)
      var busy = busyState[0]
      var setBusy = busyState[1]

      var lastTotal = React.useRef(0)

      React.useEffect(
        function () {
          var total = usage === null ? 0 : usage.total
          if (total > lastTotal.current) {
            setFlash(true)
            setBusy(true)
            var flashTimer = setTimeout(function () {
              setFlash(false)
            }, 900)
            var busyTimer = setTimeout(function () {
              setBusy(false)
            }, 2600)
            lastTotal.current = total
            return function () {
              clearTimeout(flashTimer)
              clearTimeout(busyTimer)
            }
          }
          lastTotal.current = total
          return undefined
        },
        [usage === null ? 0 : usage.total],
      )

      function toggle() {
        var next = !open
        setOpen(next)
        writeFlag(KEYS.open, next)
      }

      var totalText = usage === null ? '—' : fmtCompact(usage.total)
      var costText = fmtYuan(cost === null ? null : cost.live)
      var switchClock = change.at === null ? '—' : beijingClock(change.at)
      var advice =
        cost === null
          ? '等一会儿：会话用量还没到。'
          : peak
            ? '再等 ' + fmtDuration(change.ms) + '（' + switchClock + '）转空闲，同量约省 ' + fmtYuan(cost.savedIfIdle) + '。'
            : '现在是空闲档，' + fmtDuration(change.ms) + '后（' + switchClock + '）转高峰，单价翻倍。'
      var rows = [
        { key: 'in', dot: 'var(--dl-dot, #33414f)', label: '输入', value: usage === null ? '—' : fmtExact(usage.uncached) },
        { key: 'cr', dot: '#4f6b82', label: '缓存读', value: usage === null ? '—' : fmtExact(usage.cacheRead) },
        { key: 'cw', dot: '#7d94a8', label: '缓存写', value: usage === null ? '—' : fmtExact(usage.cacheWrite) },
        { key: 'out', dot: '#a62a31', label: '输出', value: usage === null ? '—' : fmtExact(usage.output) },
      ]

      var segments = usage === null
        ? []
        : [
            { className: 'dl-m-in', share: usage.billed === 0 ? 0 : usage.uncached / usage.total },
            { className: 'dl-m-cr', share: usage.billed === 0 ? 0 : usage.cacheRead / usage.total },
            { className: 'dl-m-cw', share: usage.billed === 0 ? 0 : usage.cacheWrite / usage.total },
            { className: 'dl-m-out', share: usage.output / usage.total },
          ]

      var figure = h(
        'button',
        {
          type: 'button',
          className: 'dl-figure',
          'aria-expanded': open ? 'true' : 'false',
          'aria-label': '大爱仙尊 · 方源，点击查看本会话用量',
          onClick: toggle,
        },
        h('span', {
          className: 'dl-tag',
          children: [
            h('i', { key: 'k', children: busy ? '推演中' : '今生' }),
            h('b', { key: 'v', children: totalText }),
            h('i', { key: 'u', children: 'tok' }),
            cost === null ? null : h('i', { key: 'y', children: '· ' + costText }),
          ],
        }),
        h('span', { className: 'dl-glow-plate', 'aria-hidden': 'true' }),
        h('span', {
          className: 'dl-svg-host',
          style: { display: 'block' },
          dangerouslySetInnerHTML: { __html: MASCOT },
        }),
      )

      var card = open
        ? h(
            'section',
            { className: 'dl-card', 'aria-label': '本会话 token 用量' },
            h(
              'header',
              { className: 'dl-head' },
              h('span', { className: 'dl-seal', children: '大爱' }),
              h('div', null, h('h2', null, '大爱仙尊'), h('p', null, '春秋蝉 · 实时用量')),
              h(
                'button',
                { type: 'button', className: 'dl-close', 'aria-label': '收起', onClick: toggle },
                '×',
              ),
            ),
            h(
              'div',
              { className: 'dl-total' },
              h('strong', { 'data-flash': flash ? 'true' : 'false' }, totalText),
              h('span', null, 'TOKENS'),
              usage !== null && usage.cacheHit !== null ? h('em', null, '命中 ' + usage.cacheHit + '%') : null,
            ),
            h(
              'div',
              { className: 'dl-meter', 'aria-hidden': 'true' },
              segments.map(function (segment, index) {
                return h('i', {
                  key: index,
                  className: segment.className,
                  style: { width: Math.max(0, Math.min(100, segment.share * 100)) + '%' },
                })
              }),
            ),
            h(
              'dl',
              { className: 'dl-rows' },
              rows.map(function (row) {
                return [
                  h('dt', { key: row.key + '-t', style: { '--dl-dot': row.dot } }, row.label),
                  h('dd', { key: row.key + '-d' }, row.value),
                ]
              }),
            ),
            h(
              'div',
              { className: 'dl-context' },
              h('span', null, '上下文 ', h('b', null, context === null ? '—' : context.percent + '%')),
              h(
                'span',
                null,
                context === null
                  ? '等待会话'
                  : fmtCompact(context.used) + ' / ' + fmtCompact(context.window),
              ),
            ),
            h(
              'div',
              { className: 'dl-cost' },
              h('span', { className: 'dl-cost-label' }, '元石'),
              h('b', null, costText),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dl-model',
                  title: '按哪个模型计价（点一下换一档）',
                  onClick: cycleModel,
                },
                priceInfo.label,
              ),
            ),
            h(
              'div',
              { className: 'dl-peak', 'data-peak': peak ? 'true' : 'false' },
              h('i', { 'aria-hidden': 'true' }),
              h('span', null, peak ? '高峰档' : '空闲档 · 半价'),
              h('span', { className: 'dl-peak-next' }, (change.peak ? '转高峰 ' : '转空闲 ') + fmtDuration(change.ms)),
            ),
            h('p', { className: 'dl-advice' }, advice),
            h(
              'footer',
              { className: 'dl-foot' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'dl-btn',
                  'data-on': skinOn ? 'true' : 'false',
                  onClick: function () {
                    controller.set(!skinOn)
                  },
                },
                '皮囊 · ' + (skinOn ? '开' : '关'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dl-btn',
                  onClick: function () {
                    setOpen(false)
                    writeFlag(KEYS.open, false)
                  },
                },
                '收起',
              ),
              h('span', { style: { marginLeft: 'auto', fontSize: '9px', color: '#3f4854', letterSpacing: '.08em' } }, 'v' + VERSION),
            ),
            h('p', { className: 'dl-quote' }, '「不过是些许风霜罢了。」'),
          )
        : null

      return h(
        'div',
        { className: 'dl-hud', 'data-open': open ? 'true' : 'false', 'data-busy': busy ? 'true' : 'false' },
        card === null ? null : h(CardBoundary, { key: 'card' }, card),
        figure,
      )
    }

    /* ------------------------------------------------------------------ *
     * 插件入口
     * ------------------------------------------------------------------ */

    function apply(ctx) {
      var controller = createSkinController(ctx)

      ctx.effect(
        function () {
          controller.start()
          return function () {
            controller.dispose()
          }
        },
        'dalian: skin theme',
      )

      ctx.effect(
        function () {
          return controller.guard()
        },
        'dalian: keep the theme pinned',
      )

      ctx.effect(
        function () {
          var style = document.createElement('style')
          style.dataset.plugin = PLUGIN_ID
          style.dataset.dalianStyle = 'chrome'
          style.textContent = SKIN_CSS + '\n' + HUD_CSS
          document.head.appendChild(style)

          var frame = document.createElement('div')
          frame.className = 'dl-frame'
          frame.setAttribute('aria-hidden', 'true')
          frame.innerHTML = '<i></i><i></i><i></i><i></i><b>大爱仙尊</b>'
          document.body.appendChild(frame)

          return function () {
            style.remove()
            frame.remove()
          }
        },
        'dalian: chrome stylesheet',
      )

      function HudBound() {
        return h(Hud, { controller: controller })
      }

      try {
        ctx.slots.inject('shell.overlay', function () {
          return ctx.slots.register(
            { name: 'shell.overlay', id: 'dalian-hud', label: function () { return '大爱仙尊' } },
            HudBound,
          )
        })
      } catch (error) {
        console.warn('[dalian] 挂件注册失败', error)
      }

      try {
        ctx.slots.inject('conversation.composer.dock', function* () {
          yield ctx.slots.register(
            { name: 'conversation.composer.dock', id: 'dalian-usage-probe', order: 90 },
            Probe,
          )
          yield ctx.slots.register(
            { name: 'conversation.composer.dock', id: 'dalian-peak-guard', order: 89 },
            PeakGuard,
          )
        })
      } catch (error) {
        console.warn('[dalian] 用量探针注册失败', error)
      }

      try {
        ctx.slots.inject('shell.overlay', function () {
          return ctx.slots.register(
            { name: 'shell.overlay', id: 'dalian-peak-confirm' },
            PeakConfirmHost,
          )
        })
      } catch (error) {
        console.warn('[dalian] 峰谷确认框注册失败', error)
      }
    }

    exports.name = PLUGIN_ID
    exports.inject = ['slots', 'theme']
    exports.apply = apply
    return module.exports
  },
})
