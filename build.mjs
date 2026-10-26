#!/usr/bin/env node
/**
 * 零依赖构建：把 src/ 里的 CSS / SVG / token 定义内联进
 *   - client/client.js   ← 宿主按 dsh.client 声明下发的浏览器 bundle
 *   - preview/index.html ← 静态视觉预览（不参与插件运行）
 *
 * 用法：node tools/build.mjs
 * 本机没有独立 node 时，可用 DSH 自带的 Electron node：
 *   & "E:\...\DeepSeek Harness.exe" tools/build.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { THEME, SWATCHES } from '../src/tokens.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const write = (relative, content) => {
  const target = path.join(root, relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
  return content.length
}

const pkg = JSON.parse(read('package.json'))
const clientSource = read('src/client/index.js')
const skinCss = read('src/skin.css')
const hudCss = read('src/hud.css')
const previewCss = read('src/preview.css')
const mascot = read('src/mascot.svg').trim()
const template = read('src/preview/app.template.html')

// ---- 1. 浏览器 bundle -------------------------------------------------------
const replacements = {
  __THEME__: JSON.stringify(THEME, null, 2),
  __SKIN_CSS__: JSON.stringify(skinCss),
  __HUD_CSS__: JSON.stringify(hudCss),
  __MASCOT__: JSON.stringify(mascot),
  __VERSION__: JSON.stringify(pkg.version),
}

let bundle = clientSource
for (const [placeholder, value] of Object.entries(replacements)) {
  if (!bundle.includes(placeholder)) throw new Error(`src/client/index.js 缺少占位符 ${placeholder}`)
  bundle = bundle.split(placeholder).join(value)
}
const leftover = /__[A-Z][A-Z_]+__/.exec(bundle)
if (leftover !== null) throw new Error(`仍有未替换的占位符 ${leftover[0]}`)

// 语法体检：只编译不执行（bundle 顶层引用了 window.__ModuleLoader__）
new vm.Script(bundle, { filename: 'client/client.js' })

const bundleBytes = write('client/client.js', bundle)

// ---- 2. 静态预览 -----------------------------------------------------------
const tokenBlock = Object.entries(THEME.tokens)
  .map(([name, value]) => `        ${name}: ${value};`)
  .join('\n')

const html = template
  .replace('__TOKENS_CSS__', tokenBlock)
  .replace('__SKIN_CSS__', skinCss)
  .replace('__HUD_CSS__', hudCss)
  .replace('__PREVIEW_CSS__', previewCss)
  .replace('__MASCOT__', mascot)
  .replace('__VERSION__', pkg.version)

const previewBytes = write('preview/index.html', html)

// ---- 3. 设计板 -------------------------------------------------------------
const board = renderBoard()
const boardBytes = write('preview/board.html', board)

function renderBoard() {
  const swatches = SWATCHES.map(
    (swatch) => `
        <li class="sw">
          <span class="chip" style="background:${swatch.value}"></span>
          <span class="nm">${swatch.name}</span>
          <code>${swatch.value}</code>
        </li>`,
  ).join('')

  const tokens = Object.entries(THEME.tokens)
    .map(
      ([name, value]) => `
        <tr><td><code>${name.replace('--dsw-alias-', '')}</code></td><td><code>${value}</code></td>
        <td><span class="mini" style="background:${value}"></span></td></tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="zh-CN" data-dalian-skin="on">
  <head>
    <meta charset="utf-8" />
    <title>大爱仙尊 · 春秋蝉 — 设计板</title>
    <style>
      :root {
${tokenBlock}
      }
${skinCss}
${hudCss}
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 34px 40px 60px;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        font-size: 13px;
      }
      .wrap { max-width: 1120px; margin: 0 auto; }
      .eyebrow { font-size: 10px; letter-spacing: .32em; color: #7a8592; }
      h1 { font-family: var(--dalian-serif); font-weight: 500; font-size: 30px; letter-spacing: .12em; margin: 8px 0 4px; }
      .sub { color: #8c97a3; letter-spacing: .06em; margin: 0 0 26px; }
      h2 { font-family: var(--dalian-serif); font-weight: 500; font-size: 13px; letter-spacing: .22em; color: #a9b4c0; margin: 30px 0 12px; }
      .cols { display: grid; grid-template-columns: 1.15fr .85fr; gap: 34px; }
      ul { list-style: none; margin: 0; padding: 0; }
      .sw { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px solid rgba(226,236,246,.06); }
      .sw .chip { width: 18px; height: 18px; border: 1px solid rgba(226,236,246,.16); }
      .sw .nm { width: 108px; letter-spacing: .1em; color: #a9b4c0; font-size: 11.5px; }
      .sw code { color: #6b7684; font-size: 10.5px; }
      table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
      th { text-align: left; font-weight: 400; color: #6b7684; letter-spacing: .18em; padding: 0 0 6px; border-bottom: 1px solid rgba(226,236,246,.12); }
      td { padding: 3px 0; border-bottom: 1px solid rgba(226,236,246,.05); color: #8c97a3; }
      td code { color: #b9c6d4; }
      .mini { display: inline-block; width: 30px; height: 10px; border: 1px solid rgba(226,236,246,.14); }
      .type { margin: 0 0 10px; }
      .t-serif { font-family: var(--dalian-serif); font-size: 26px; letter-spacing: .12em; }
      .t-body { font-size: 13.5px; color: #a9b4c0; }
      .t-mono { font-family: var(--dalian-mono); font-size: 11.5px; color: #8fb6d9; letter-spacing: .02em; }
      .figure-case { display: flex; align-items: flex-end; gap: 18px; padding: 12px 0 4px; }
      .figure-case .dl-figure { position: relative; width: 150px; height: 184px; }
      .rules { color: #8c97a3; line-height: 1.85; padding-left: 16px; }
      .rules li { list-style: disc; }
      footer { margin-top: 34px; color: #4f5966; font-size: 10px; letter-spacing: .18em; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="eyebrow">DSH CLIENT PLUGIN / SKIN BOARD</div>
      <h1>大爱仙尊 · 春秋蝉</h1>
      <p class="sub">冷冽漫画感皮肤的取色、字体与形制 —— 所有颜色经由 ctx.theme 的 alias token 下发，共 ${Object.keys(THEME.tokens).length} 个。</p>

      <div class="cols">
        <section>
          <h2>色板</h2>
          <ul>${swatches}</ul>

          <h2>字面</h2>
          <p class="t-serif type">春秋蝉 · 第八转</p>
          <p class="t-body type">正文保持系统 UI 字面，只为速度与可读性；标题与印章用宋体。</p>
          <p class="t-mono type">12,438 tok · cache 9,468 · 41.2 tok/s</p>
        </section>

        <section>
          <h2>形象</h2>
          <div class="figure-case">
            <button type="button" class="dl-figure" aria-expanded="false" aria-label="方源">
              <span class="dl-svg-host">${mascot}</span>
            </button>
            <button type="button" class="dl-figure" aria-expanded="true" aria-label="方源">
              <span class="dl-tag"><i>推演中</i><b>12.4k</b><i>tok</i></span>
              <span class="dl-svg-host">${mascot}</span>
            </button>
          </div>
          <h2>规则</h2>
          <ul class="rules">
            <li>朱色只出现在主行动、印章、输出桶 —— 一屏不超过三处。</li>
            <li>线宽只有 0.5 / 1 / 2px 三档，绝不用 3px 以上的描边。</li>
            <li>圆角 2–6px，页面四角打裁切线，像分镜纸。</li>
            <li>数字等宽；变化时闪一次冷光，不做弹跳。</li>
            <li>动效 200–500ms，只改位移与透明度，不改尺寸。</li>
          </ul>
        </section>
      </div>

      <h2>alias token</h2>
      <table>
        <thead><tr><th>token</th><th>值</th><th></th></tr></thead>
        <tbody>${tokens}</tbody>
      </table>

      <footer>大爱仙尊 · 春秋蝉 · v${pkg.version} · generated by tools/build.mjs</footer>
    </div>
  </body>
</html>
`
}

console.log(
  JSON.stringify(
    {
      version: pkg.version,
      tokens: Object.keys(THEME.tokens).length,
      client: `${bundleBytes} bytes → client/client.js`,
      preview: `${previewBytes} bytes → preview/index.html`,
      board: `${boardBytes} bytes → preview/board.html`,
    },
    null,
    2,
  ),
)

// 以 GUI 进程方式启动的 Electron 拿不到 stdout，构建摘要同时落盘一份。
fs.writeFileSync(
  path.join(root, 'build.log'),
  `ok ${pkg.version} tokens=${Object.keys(THEME.tokens).length} client=${bundleBytes}B preview=${previewBytes}B board=${boardBytes}B\n`,
)
