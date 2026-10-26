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

    var THEME = {
  "id": "dalian-xianzun",
  "colorScheme": "dark",
  "tokens": {
    "--dsw-alias-bg-base": "#06070A",
    "--dsw-alias-bg-layer-1": "#0A0C10",
    "--dsw-alias-bg-layer-2": "#0E1116",
    "--dsw-alias-bg-layer-3": "#13171D",
    "--dsw-alias-bg-overlay": "#0B0E12",
    "--dsw-alias-bg-module-platform": "#10141A",
    "--dsw-alias-bg-skeleton": "#12161C",
    "--dsw-alias-bg-document-preview": "#0A0C10",
    "--dsw-alias-bg-document-selection": "rgba(143, 182, 217, 0.24)",
    "--dsw-alias-bg-multi-select": "rgba(143, 182, 217, 0.16)",
    "--dsw-alias-bg-mask-1": "rgba(2, 3, 5, 0.55)",
    "--dsw-alias-bg-mask-2": "rgba(2, 3, 5, 0.72)",
    "--dsw-alias-bg-mask-3": "rgba(2, 3, 5, 0.86)",
    "--dsw-alias-bg-mask-drop": "rgba(2, 3, 5, 0.62)",
    "--dsw-alias-bg-mask-photo": "rgba(2, 3, 5, 0.80)",
    "--dsw-alias-border-l1": "rgba(226, 236, 246, 0.06)",
    "--dsw-alias-border-l2": "rgba(226, 236, 246, 0.10)",
    "--dsw-alias-border-l2-darkmode-thin": "rgba(226, 236, 246, 0.08)",
    "--dsw-alias-border-l3": "rgba(226, 236, 246, 0.15)",
    "--dsw-alias-border-l4": "rgba(226, 236, 246, 0.22)",
    "--dsw-alias-border-inverted": "rgba(6, 7, 10, 0.85)",
    "--dsw-alias-border-inverted2": "rgba(6, 7, 10, 0.60)",
    "--dsw-alias-label-primary": "#E8EEF5",
    "--dsw-alias-label-secondary": "#A9B4C0",
    "--dsw-alias-label-tertiary": "#7A8592",
    "--dsw-alias-label-caption": "#5B6672",
    "--dsw-alias-label-dimmed": "#8C97A3",
    "--dsw-alias-label-primary-dimmed": "#C7D1DB",
    "--dsw-alias-label-primary-bluish": "#D5DFEA",
    "--dsw-alias-label-primary-foreground": "#F5F8FB",
    "--dsw-alias-label-primary-inverted": "#06070A",
    "--dsw-alias-label-document-preview": "#A9B4C0",
    "--dsw-alias-label-shimmer": "rgba(255, 255, 255, 0.14)",
    "--dsw-alias-label-deep-diving": "#8FB6D9",
    "--dsw-alias-label-deep-diving-shimmer": "rgba(143, 182, 217, 0.26)",
    "--dsw-alias-brand-primary": "#A62A31",
    "--dsw-alias-brand-primary-invert": "#E8EEF5",
    "--dsw-alias-brand-text": "#E8EEF5",
    "--dsw-alias-brand-primary-new-colorprimary-new-color": "#A62A31",
    "--dsw-alias-button-primary-fill": "#A62A31",
    "--dsw-alias-button-primary-hover": "#C0333B",
    "--dsw-alias-button-primary-dimmed": "#5E181C",
    "--dsw-alias-button-contrast-fill": "#E8EEF5",
    "--dsw-alias-button-elevated-fill": "#14181F",
    "--dsw-alias-button-floating-fill": "rgba(12, 15, 20, 0.92)",
    "--dsw-alias-button-floating-hover": "rgba(22, 27, 34, 0.96)",
    "--dsw-alias-button-ghost-active-fill": "rgba(226, 236, 246, 0.08)",
    "--dsw-alias-button-ghost-active-border": "rgba(226, 236, 246, 0.16)",
    "--dsw-alias-button-ghost-active-hover": "rgba(226, 236, 246, 0.12)",
    "--dsw-alias-button-info-fill": "#1B2733",
    "--dsw-alias-button-info-hover": "#23323F",
    "--dsw-alias-button-tool-bar-fill": "rgba(226, 236, 246, 0.05)",
    "--dsw-alias-button-tool-bar-fill-invisible": "transparent",
    "--dsw-alias-button-tool-bar-hover": "rgba(226, 236, 246, 0.10)",
    "--dsw-alias-interactive-bg-hover": "rgba(226, 236, 246, 0.055)",
    "--dsw-alias-interactive-bg-active": "rgba(226, 236, 246, 0.09)",
    "--dsw-alias-interactive-bg-hover-accent": "rgba(166, 42, 49, 0.14)",
    "--dsw-alias-interactive-bg-hover-danger": "rgba(207, 68, 75, 0.16)",
    "--dsw-alias-interactive-bg-hover-solid": "#171C24",
    "--dsw-alias-state-success-primary": "#5B9C85",
    "--dsw-alias-state-success-secondary": "rgba(91, 156, 133, 0.16)",
    "--dsw-alias-state-success-tertiary": "rgba(91, 156, 133, 0.32)",
    "--dsw-alias-state-error-primary": "#CF444B",
    "--dsw-alias-state-error-secondary": "rgba(207, 68, 75, 0.16)",
    "--dsw-alias-state-warn-primary": "#C69B4E",
    "--dsw-alias-state-warn-secondary": "rgba(198, 155, 78, 0.16)",
    "--dsw-alias-state-warn-tertiary": "rgba(198, 155, 78, 0.30)",
    "--dsw-alias-state-warn-label": "#C69B4E",
    "--dsw-alias-state-idle-primary": "#66727F",
    "--dsw-alias-state-business-primary": "#8FB6D9",
    "--dsw-alias-state-business-tertiary": "rgba(143, 182, 217, 0.30)",
    "--dsw-alias-link": "#8FB6D9",
    "--dsw-alias-markdown-code-block": "#08090C",
    "--dsw-alias-markdown-code-block-banner": "#0C0F13",
    "--dsw-alias-markdown-inline-code": "rgba(226, 236, 246, 0.07)",
    "--dsw-alias-markdown-code-segment-selected": "rgba(226, 236, 246, 0.12)",
    "--dsw-alias-markdown-code-segment-unselected": "rgba(226, 236, 246, 0.04)",
    "--dsw-alias-markdown-citation": "rgba(143, 182, 217, 0.14)",
    "--dsw-alias-markdown-placeholder": "#5B6672",
    "--dsw-alias-markdown-tag": "rgba(166, 42, 49, 0.18)",
    "--dsw-alias-code-diff-added": "rgba(91, 156, 133, 0.16)",
    "--dsw-alias-code-diff-deleted": "rgba(207, 68, 75, 0.16)",
    "--dsw-alias-file-diff-added-bg": "rgba(91, 156, 133, 0.13)",
    "--dsw-alias-file-diff-added-gutter": "rgba(91, 156, 133, 0.22)",
    "--dsw-alias-file-diff-added-marker": "#5B9C85",
    "--dsw-alias-file-diff-deleted-bg": "rgba(207, 68, 75, 0.13)",
    "--dsw-alias-file-diff-deleted-gutter": "rgba(207, 68, 75, 0.22)",
    "--dsw-alias-file-diff-deleted-marker": "#CF444B",
    "--dsw-alias-menu-icon": "#A9B4C0",
    "--dsw-alias-menu-group-header-fill": "rgba(10, 12, 16, 0.94)",
    "--dsw-alias-scrollbar-bg-l1": "transparent",
    "--dsw-alias-scrollbar-bg-l2": "transparent",
    "--dsw-alias-scrollbar-hover-l1": "rgba(226, 236, 246, 0.10)",
    "--dsw-alias-scrollbar-hover-l2": "rgba(226, 236, 246, 0.14)",
    "--dsw-alias-settings-card-fill": "#0C0F13",
    "--dsw-alias-settings-card-stroke": "rgba(226, 236, 246, 0.10)",
    "--dsw-alias-switch-thumb": "#C7D1DB",
    "--dsw-alias-toast-bg": "#12161C",
    "--dsw-alias-toast-label": "#E8EEF5",
    "--dsw-alias-tooltip-bg": "#161B22",
    "--dsw-alias-tooltip-key-bg": "rgba(226, 236, 246, 0.10)",
    "--dsw-alias-turn-trigger-bg": "#0F1318",
    "--dsw-alias-turn-trigger-bg-hover": "#151A21",
    "--dsw-alias-onboarding-accent": "#A62A31",
    "--dsw-alias-onboarding-card-fill": "#0C0F13",
    "--dsw-alias-onboarding-checkbox-border": "rgba(226, 236, 246, 0.22)",
    "--dsw-alias-onboarding-secondary-fill": "#14181F",
    "--dsw-specific-sidebar-fill": "#080A0D",
    "--dsw-specific-sidebar-nav-item-hover": "rgba(226, 236, 246, 0.05)",
    "--dsw-specific-sidebar-nav-item-active": "rgba(166, 42, 49, 0.14)",
    "--dsw-specific-sidebar-nav-item-active-accent": "#A62A31",
    "--dsw-specific-bubble": "#0E1116",
    "--dsw-specific-bubble-highlight": "#12161D",
    "--dsw-specific-input-major": "#0C0F13",
    "--dsw-specific-login-input": "#0C0F13",
    "--dsw-specific-menu": "rgba(12, 15, 20, 0.94)",
    "--dsw-specific-selector": "#12161C",
    "--dsw-specific-tip": "#101419"
  }
}
    var SKIN_CSS = "/* =========================================================================\n   大爱仙尊 · 春秋蝉 — chrome layer\n   Colours are NOT here: they arrive as alias tokens through ctx.theme.register\n   (see src/tokens.mjs). This sheet only owns what tokens cannot express:\n   corner radii, the display face, selection, crop marks and scrollbar feel.\n   Everything is keyed on html[data-dalian-skin=\"on\"] so switching the skin off\n   in the HUD leaves zero residue.\n   ========================================================================= */\n\nhtml[data-dalian-skin='on'] {\n  /* Sharper corners: printed page, not a glass panel. */\n  --dsw-radius-xs: 2px;\n  --dsw-radius-sm: 3px;\n  --dsw-radius-md: 4px;\n  --dsw-radius-lg: 6px;\n  --dsw-radius-xl: 8px;\n  --dsw-radius-panel: 10px;\n\n  /* Display face for titles and the HUD; falls back through CN serifs. */\n  --dalian-serif: 'Songti SC', 'STSong', 'SimSun', 'Noto Serif SC', 'Source Han Serif SC',\n    'Source Han Serif CN', serif;\n  --dalian-mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Mono', Consolas, 'SimSun', monospace;\n  --dalian-cold-line: rgba(226, 236, 246, 0.14);\n  --dalian-zhu: #a62a31;\n  --dalian-shuang: #8fb6d9;\n}\n\n/* ---- Type: headings read as cut stone, body stays the system UI face ---- */\nhtml[data-dalian-skin='on'] h1,\nhtml[data-dalian-skin='on'] h2,\nhtml[data-dalian-skin='on'] h3,\nhtml[data-dalian-skin='on'] h4,\nhtml[data-dalian-skin='on'] h5 {\n  font-family: var(--dalian-serif);\n  font-weight: 500;\n  letter-spacing: 0.015em;\n}\n\n/* ---- Selection: frost blue over ink, never the browser default ---- */\nhtml[data-dalian-skin='on'] ::selection {\n  background: rgba(143, 182, 217, 0.28);\n  color: #f5f8fb;\n}\n\n/* ---- Scrollbar: a hairline that thickens under the pointer ---- */\nhtml[data-dalian-skin='on'] ::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n}\nhtml[data-dalian-skin='on'] ::-webkit-scrollbar-track {\n  background: transparent;\n}\nhtml[data-dalian-skin='on'] ::-webkit-scrollbar-thumb {\n  background: rgba(226, 236, 246, 0.09);\n  border: 3px solid transparent;\n  border-radius: 999px;\n  background-clip: content-box;\n}\nhtml[data-dalian-skin='on'] ::-webkit-scrollbar-thumb:hover {\n  background: rgba(226, 236, 246, 0.2);\n  background-clip: content-box;\n}\n\n/* ---- Crop marks: four corner brackets, the page treated as a manga panel ---- */\n.dl-frame {\n  display: none;\n  position: fixed;\n  inset: 8px;\n  z-index: 5;\n  pointer-events: none;\n  opacity: 0.7;\n}\nhtml[data-dalian-skin='on'] .dl-frame {\n  display: block;\n}\n.dl-frame i {\n  position: absolute;\n  width: 14px;\n  height: 14px;\n  border-color: rgba(226, 236, 246, 0.18);\n  border-style: solid;\n  border-width: 0;\n}\n.dl-frame i:nth-child(1) {\n  top: 0;\n  left: 0;\n  border-top-width: 1px;\n  border-left-width: 1px;\n}\n.dl-frame i:nth-child(2) {\n  top: 0;\n  right: 0;\n  border-top-width: 1px;\n  border-right-width: 1px;\n}\n.dl-frame i:nth-child(3) {\n  bottom: 0;\n  left: 0;\n  border-bottom-width: 1px;\n  border-left-width: 1px;\n}\n.dl-frame i:nth-child(4) {\n  bottom: 0;\n  right: 0;\n  border-bottom-width: 1px;\n  border-right-width: 1px;\n}\n/* The seal hangs on the right crop mark, in the empty margin beside the\n   transcript — a painter's mark, not chrome. */\n.dl-frame b {\n  position: absolute;\n  top: 15%;\n  right: 2px;\n  writing-mode: vertical-rl;\n  font-family: var(--dalian-serif);\n  font-size: 9px;\n  font-weight: 400;\n  letter-spacing: 0.34em;\n  color: rgba(166, 42, 49, 0.8);\n  padding: 5px 2px;\n  border: 1px solid rgba(166, 42, 49, 0.35);\n  background: rgba(166, 42, 49, 0.06);\n  opacity: 0.9;\n  transition: opacity 200ms ease;\n}\n\n/* 用量卡片展开时，右缘的朱印让位，避免两件东西压在一起。 */\nhtml[data-dalian-card='open'] .dl-frame b {\n  opacity: 0;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html[data-dalian-skin='on'] * {\n    animation-duration: 0.001ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.001ms !important;\n  }\n}\n"
    var HUD_CSS = "/* =========================================================================\n   大爱仙尊 · 春秋蝉 — HUD (mascot + live token panel)\n   Self-contained: every colour here is a literal from src/tokens.mjs, because\n   the HUD sits above the app's surfaces and must not inherit a component's\n   local token rebinds.\n   ========================================================================= */\n\n.dl-hud {\n  position: fixed;\n  right: 24px;\n  bottom: 92px;\n  z-index: 60;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 12px;\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;\n  color: #e8eef5;\n}\n\n/* ---------------- the figure ---------------- */\n\n.dl-figure {\n  position: relative;\n  width: 104px;\n  height: 126px;\n  padding: 0;\n  border: 0;\n  background: none;\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1), filter 220ms ease;\n  filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.55));\n}\n.dl-figure:hover,\n.dl-figure[aria-expanded='true'] {\n  transform: translateY(-2px) scale(1.015);\n}\n.dl-figure:focus-visible {\n  outline: 1px solid rgba(143, 182, 217, 0.7);\n  outline-offset: 4px;\n}\n.dl-figure .dl-svg {\n  width: 100%;\n  height: 100%;\n  overflow: visible;\n  display: block;\n}\n.dl-svg-host {\n  display: block;\n  height: 100%;\n  position: relative;\n  z-index: 1;\n}\n\n/* 一团极淡的墨：让白发在任何底色（包括浅色主题）上都立得住 */\n.dl-glow-plate {\n  position: absolute;\n  inset: -8% -14% -6%;\n  border-radius: 50%;\n  background: radial-gradient(closest-side, rgba(4, 5, 7, 0.62) 0%, rgba(4, 5, 7, 0.34) 46%, rgba(4, 5, 7, 0) 74%);\n  box-shadow: none;\n  pointer-events: none;\n}\n\n.dl-art {\n  transform-box: fill-box;\n  transform-origin: 50% 100%;\n  animation: dl-breathe 5.6s ease-in-out infinite;\n}\n.dl-hair-back {\n  transform-box: fill-box;\n  transform-origin: 50% 20%;\n  animation: dl-sway 8s ease-in-out infinite;\n}\n.dl-cicada {\n  transform-box: fill-box;\n  transform-origin: 50% 50%;\n  animation: dl-perch 4.2s ease-in-out infinite;\n}\n.dl-iris {\n  transition: fill 300ms ease;\n}\n\n.dl-hud[data-busy='true'] .dl-iris {\n  animation: dl-glow 1.15s ease-in-out infinite;\n}\n.dl-hud[data-busy='true'] .dl-cicada {\n  animation: dl-cicada-flutter 0.9s ease-in-out infinite;\n}\n\n@keyframes dl-breathe {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-2px); }\n}\n@keyframes dl-sway {\n  0%, 100% { transform: rotate(-0.7deg); }\n  50% { transform: rotate(0.7deg); }\n}\n@keyframes dl-perch {\n  0%, 100% { transform: translate(112px, 146px) rotate(-16deg); }\n  50% { transform: translate(112px, 145px) rotate(-13deg); }\n}\n@keyframes dl-glow {\n  0%, 100% { fill: #8e2028; }\n  50% { fill: #e0454c; }\n}\n@keyframes dl-cicada-flutter {\n  0%, 100% { transform: translate(112px, 146px) rotate(-16deg) scale(1); }\n  50% { transform: translate(112px, 146px) rotate(-16deg) scale(1.12); }\n}\n\n/* ---------------- the speech tag ---------------- */\n\n.dl-tag {\n  position: absolute;\n  right: calc(100% - 14px);\n  top: 26px;\n  display: flex;\n  align-items: baseline;\n  gap: 5px;\n  padding: 4px 9px 5px;\n  white-space: nowrap;\n  background: rgba(10, 12, 16, 0.94);\n  border: 1px solid rgba(226, 236, 246, 0.14);\n  border-radius: 3px;\n  box-shadow: 0 10px 22px -12px rgba(0, 0, 0, 0.9);\n  font-size: 11px;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  color: #a9b4c0;\n  transition: border-color 200ms ease, color 200ms ease;\n}\n.dl-tag::after {\n  content: '';\n  position: absolute;\n  right: -5px;\n  top: 50%;\n  width: 8px;\n  height: 8px;\n  margin-top: -4px;\n  background: inherit;\n  border-right: 1px solid rgba(226, 236, 246, 0.14);\n  border-top: 1px solid rgba(226, 236, 246, 0.14);\n  transform: rotate(45deg);\n}\n.dl-tag b {\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.04em;\n  color: #e8eef5;\n}\n.dl-tag i {\n  font-style: normal;\n  font-size: 10px;\n  color: #7a8592;\n  letter-spacing: 0.12em;\n}\n.dl-figure:hover .dl-tag {\n  border-color: rgba(166, 42, 49, 0.55);\n  color: #c7d1db;\n}\n\n/* ---------------- the panel ---------------- */\n\n.dl-card {\n  position: relative;\n  width: 272px;\n  padding: 14px 16px 12px;\n  pointer-events: auto;\n  background: linear-gradient(158deg, rgba(17, 21, 27, 0.985), rgba(7, 8, 11, 0.985));\n  border: 1px solid rgba(226, 236, 246, 0.16);\n  border-radius: 4px;\n  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);\n  box-shadow: 0 28px 64px -26px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(0, 0, 0, 0.4) inset;\n}\n.dl-card::before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  background: linear-gradient(to bottom, rgba(166, 42, 49, 0.95), rgba(166, 42, 49, 0.15));\n}\n.dl-card::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  height: 1px;\n  background: linear-gradient(to right, transparent, rgba(143, 182, 217, 0.55), transparent);\n}\n\n.dl-card--failed {\n  padding: 14px 16px;\n  font-size: 11.5px;\n  letter-spacing: 0.06em;\n  color: #a9b4c0;\n  text-align: center;\n}\n\n.dl-head {\n  display: flex;\n  align-items: flex-start;\n  gap: 9px;\n  padding-bottom: 11px;\n  border-bottom: 1px solid rgba(226, 236, 246, 0.08);\n}\n.dl-head h2 {\n  margin: 0;\n  font-family: 'Songti SC', 'SimSun', 'Noto Serif SC', serif;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.16em;\n  color: #e8eef5;\n}\n.dl-head p {\n  margin: 3px 0 0;\n  font-size: 9.5px;\n  letter-spacing: 0.22em;\n  color: #6b7684;\n}\n.dl-head .dl-close {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  display: grid;\n  place-items: center;\n  border: 1px solid transparent;\n  border-radius: 2px;\n  background: none;\n  color: #7a8592;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n}\n.dl-head .dl-close:hover {\n  color: #e8eef5;\n  border-color: rgba(226, 236, 246, 0.16);\n  background: rgba(226, 236, 246, 0.05);\n}\n\n.dl-seal {\n  flex: none;\n  width: 22px;\n  height: 22px;\n  margin-top: 1px;\n  display: grid;\n  place-items: center;\n  background: #a62a31;\n  color: #f6ece9;\n  font-family: 'Songti SC', 'SimSun', serif;\n  font-size: 9px;\n  line-height: 0.95;\n  writing-mode: vertical-rl;\n  letter-spacing: 0.06em;\n  box-shadow: 0 0 0 1px rgba(166, 42, 49, 0.35), 0 6px 14px -8px rgba(166, 42, 49, 0.9);\n}\n\n.dl-total {\n  display: flex;\n  align-items: baseline;\n  gap: 7px;\n  margin: 13px 0 2px;\n  font-variant-numeric: tabular-nums;\n}\n.dl-total strong {\n  font-size: 30px;\n  font-weight: 200;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: #f1f5fa;\n  transition: color 400ms ease;\n}\n.dl-total strong[data-flash='true'] {\n  color: #ffffff;\n  text-shadow: 0 0 18px rgba(143, 182, 217, 0.55);\n}\n.dl-total span {\n  font-size: 10px;\n  letter-spacing: 0.24em;\n  color: #7a8592;\n}\n.dl-total em {\n  margin-left: auto;\n  font-style: normal;\n  font-size: 10px;\n  letter-spacing: 0.08em;\n  color: #8fb6d9;\n}\n\n.dl-meter {\n  display: flex;\n  gap: 1px;\n  height: 3px;\n  margin: 9px 0 12px;\n  background: rgba(226, 236, 246, 0.06);\n  overflow: hidden;\n}\n.dl-meter i {\n  display: block;\n  height: 100%;\n  min-width: 2px;\n  transition: width 500ms cubic-bezier(0.2, 0.7, 0.2, 1);\n}\n.dl-meter .dl-m-in { background: #33414f; }\n.dl-meter .dl-m-cr { background: #4f6b82; }\n.dl-meter .dl-m-cw { background: #7d94a8; }\n.dl-meter .dl-m-out { background: #a62a31; }\n\n.dl-rows {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 6px 12px;\n  margin: 0;\n  font-size: 11.5px;\n}\n.dl-rows dt {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: #8c97a3;\n  letter-spacing: 0.06em;\n}\n.dl-rows dt::before {\n  content: '';\n  width: 5px;\n  height: 5px;\n  flex: none;\n  background: var(--dl-dot, #33414f);\n  box-shadow: 0 0 0 1px rgba(226, 236, 246, 0.12);\n}\n.dl-rows dd {\n  margin: 0;\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n  color: #dbe3ec;\n  letter-spacing: 0.02em;\n}\n\n.dl-context {\n  margin-top: 12px;\n  padding-top: 10px;\n  border-top: 1px solid rgba(226, 236, 246, 0.08);\n  font-size: 10px;\n  letter-spacing: 0.1em;\n  color: #6b7684;\n  display: flex;\n  justify-content: space-between;\n  gap: 10px;\n  font-variant-numeric: tabular-nums;\n}\n.dl-context b {\n  font-weight: 500;\n  color: #a9b4c0;\n}\n\n/* ---------------- 元石：这一炉烧了多少钱 ---------------- */\n\n.dl-cost {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  margin-top: 11px;\n  padding-top: 9px;\n  border-top: 1px solid rgba(226, 236, 246, 0.08);\n}\n.dl-cost-label {\n  font-size: 9.5px;\n  letter-spacing: 0.24em;\n  color: #7a8592;\n}\n.dl-cost b {\n  font-size: 19px;\n  font-weight: 300;\n  line-height: 1;\n  letter-spacing: 0.01em;\n  color: #f1f5fa;\n  font-variant-numeric: tabular-nums;\n}\n.dl-model {\n  margin-left: auto;\n  appearance: none;\n  border: 1px solid rgba(143, 182, 217, 0.32);\n  background: rgba(143, 182, 217, 0.08);\n  color: #a9c6de;\n  font: inherit;\n  font-size: 9.5px;\n  letter-spacing: 0.12em;\n  padding: 2px 7px;\n  border-radius: 2px;\n  cursor: pointer;\n}\n.dl-model:hover {\n  border-color: rgba(143, 182, 217, 0.6);\n  color: #d5e4f2;\n}\n\n.dl-peak {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n  font-size: 10px;\n  letter-spacing: 0.08em;\n  color: #a9b4c0;\n}\n.dl-peak i {\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: #c69b4e;\n  box-shadow: 0 0 7px rgba(198, 155, 78, 0.75);\n}\n.dl-peak[data-peak='false'] i {\n  background: #5b9c85;\n  box-shadow: 0 0 7px rgba(91, 156, 133, 0.75);\n}\n.dl-peak-next {\n  margin-left: auto;\n  color: #6b7684;\n  font-variant-numeric: tabular-nums;\n}\n\n.dl-advice {\n  margin: 7px 0 0;\n  padding-left: 8px;\n  border-left: 1px solid rgba(166, 42, 49, 0.55);\n  font-size: 10px;\n  line-height: 1.65;\n  letter-spacing: 0.02em;\n  color: #8c97a3;\n}\n\n.dl-foot {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 11px;\n}\n.dl-btn {\n  appearance: none;\n  border: 1px solid rgba(226, 236, 246, 0.14);\n  background: rgba(226, 236, 246, 0.03);\n  color: #a9b4c0;\n  font: inherit;\n  font-size: 10px;\n  letter-spacing: 0.14em;\n  padding: 4px 8px;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: color 160ms ease, border-color 160ms ease, background 160ms ease;\n}\n.dl-btn:hover {\n  color: #f1f5fa;\n  border-color: rgba(226, 236, 246, 0.28);\n  background: rgba(226, 236, 246, 0.07);\n}\n.dl-btn[data-on='true'] {\n  color: #f0d9d8;\n  border-color: rgba(166, 42, 49, 0.5);\n  background: rgba(166, 42, 49, 0.13);\n}\n.dl-quote {\n  margin: 10px 0 0;\n  font-family: 'Songti SC', 'SimSun', serif;\n  font-size: 10px;\n  line-height: 1.7;\n  letter-spacing: 0.08em;\n  color: #4f5966;\n  text-align: right;\n}\n\n/* ---------------- 峰谷软提醒：发送前确认 ---------------- */\n\n.dl-confirm {\n  position: fixed;\n  inset: 0;\n  z-index: 70;\n  display: grid;\n  place-items: end center;\n  padding-bottom: 140px;\n  pointer-events: none;\n}\n.dl-confirm-box {\n  pointer-events: auto;\n  width: min(380px, calc(100vw - 32px));\n  padding: 14px 16px 13px;\n  background: linear-gradient(158deg, rgba(17, 21, 27, 0.99), rgba(7, 8, 11, 0.99));\n  border: 1px solid rgba(226, 236, 246, 0.16);\n  border-left: 2px solid #c69b4e;\n  border-radius: 4px;\n  box-shadow: 0 28px 64px -26px rgba(0, 0, 0, 0.95);\n}\n.dl-confirm-eyebrow {\n  font-size: 10px;\n  letter-spacing: 0.24em;\n  color: #c69b4e;\n}\n.dl-confirm-text {\n  margin: 8px 0 0;\n  font-size: 12.5px;\n  line-height: 1.7;\n  letter-spacing: 0.01em;\n  color: #c7d1db;\n}\n.dl-confirm-actions {\n  display: flex;\n  gap: 8px;\n  justify-content: flex-end;\n  margin-top: 12px;\n}\n.dl-btn--danger {\n  color: #f0d9d8;\n  border-color: rgba(166, 42, 49, 0.55);\n  background: rgba(166, 42, 49, 0.16);\n}\n.dl-btn--danger:hover {\n  background: rgba(166, 42, 49, 0.28);\n  border-color: rgba(166, 42, 49, 0.8);\n  color: #ffffff;\n}\n\n@media (max-width: 720px) {\n  .dl-hud { right: 12px; bottom: 78px; }\n  .dl-card { width: 236px; }\n  .dl-figure { width: 84px; height: 102px; }\n  .dl-tag { display: none; }\n}\n"
    var MASCOT = "<svg class=\"dl-svg\" viewBox=\"0 0 160 196\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Q版方源\">\n  <defs>\n    <radialGradient id=\"dl-halo\" cx=\"50%\" cy=\"40%\" r=\"60%\">\n      <stop offset=\"0\" stop-color=\"#A62A31\" stop-opacity=\".14\" />\n      <stop offset=\".62\" stop-color=\"#A62A31\" stop-opacity=\".03\" />\n      <stop offset=\"1\" stop-color=\"#A62A31\" stop-opacity=\"0\" />\n    </radialGradient>\n    <linearGradient id=\"dl-hair\" x1=\".2\" y1=\"0\" x2=\".75\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"#F8FBFE\" />\n      <stop offset=\".45\" stop-color=\"#E2EAF2\" />\n      <stop offset=\"1\" stop-color=\"#A6B5C6\" />\n    </linearGradient>\n    <linearGradient id=\"dl-robe\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"#171C24\" />\n      <stop offset=\".5\" stop-color=\"#0B0E13\" />\n      <stop offset=\"1\" stop-color=\"#050608\" />\n    </linearGradient>\n    <linearGradient id=\"dl-blade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"#C0333B\" />\n      <stop offset=\"1\" stop-color=\"#5E1218\" />\n    </linearGradient>\n    <filter id=\"dl-soft\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\">\n      <feGaussianBlur stdDeviation=\"4.5\" />\n    </filter>\n  </defs>\n\n  <ellipse cx=\"80\" cy=\"84\" rx=\"64\" ry=\"68\" fill=\"url(#dl-halo)\" />\n  <ellipse class=\"dl-shadow\" cx=\"80\" cy=\"186\" rx=\"39\" ry=\"5\" fill=\"#000\" opacity=\".7\" filter=\"url(#dl-soft)\" />\n\n  <g class=\"dl-art\">\n    <!-- 后发：整片垂到肩线以下，末端削尖 -->\n    <g class=\"dl-hair-back\">\n      <path d=\"M80 24C50 26 34 54 34 92c0 28 4 58 10 86 3-26 5-52 9-74 8 12 19 18 27 18s19-6 27-18c4 22 6 48 9 74 6-28 10-58 10-86 0-38-16-66-46-68Z\" fill=\"url(#dl-hair)\" />\n      <path d=\"M42 96c-3 28-2 56 3 80 3-24 5-50 10-70Z\" fill=\"#B9C6D5\" opacity=\".55\" />\n      <path d=\"M118 96c3 28 2 56-3 80-2-24-5-50-10-70Z\" fill=\"#B9C6D5\" opacity=\".55\" />\n      <path d=\"M48 148 43 178M112 148l5 30M56 132l-3 22M104 132l3 22\" stroke=\"#8B9CB0\" stroke-width=\".9\" opacity=\".45\" />\n      <!-- 冷边光：把白发从夜色里切出来 -->\n      <path d=\"M42 58c-6 20-7 44-4 66\" stroke=\"rgba(226,236,246,.55)\" stroke-width=\"1.1\" fill=\"none\" />\n    </g>\n\n    <!-- 黑袍：宽肩、立领、朱红内衬 -->\n    <g class=\"dl-body\">\n      <path d=\"M20 196c2-36 22-56 44-60h32c22 4 42 24 44 60Z\" fill=\"url(#dl-robe)\" />\n      <path d=\"M24 196c3-24 11-38 23-47\" stroke=\"rgba(143,182,217,.34)\" stroke-width=\"1.2\" fill=\"none\" />\n      <path d=\"M30 196c4-18 12-30 22-38\" stroke=\"rgba(226,236,246,.07)\" stroke-width=\"1\" fill=\"none\" />\n      <path d=\"M136 196c-4-24-12-38-24-47\" stroke=\"rgba(226,236,246,.05)\" stroke-width=\"1\" fill=\"none\" />\n\n      <!-- 立领（黑）＋朱红内缘 -->\n      <path d=\"M66 126c4-3 9-5 14-5s10 2 14 5l-2 10c-4-2-8-3-12-3s-8 1-12 3Z\" fill=\"#0C1015\" />\n      <path d=\"M67 126.6c4-2.8 8-4.2 13-4.2s9 1.4 13 4.2\" stroke=\"#B3272D\" stroke-width=\"1.6\" fill=\"none\" />\n      <path d=\"M67 125.6c4-2.8 8-4.2 13-4.2s9 1.4 13 4.2\" stroke=\"rgba(226,236,246,.35)\" stroke-width=\".7\" fill=\"none\" />\n\n      <!-- 交叉领 -->\n      <path d=\"M62 136 80 173l-6 3-17-36Z\" fill=\"url(#dl-blade)\" />\n      <path d=\"M98 136 80 173l6 3 17-36Z\" fill=\"url(#dl-blade)\" />\n      <path d=\"M56 138 76 178l-7 3-17-38Z\" fill=\"#10141A\" />\n      <path d=\"M104 138 84 178l7 3 17-38Z\" fill=\"#10141A\" />\n      <path d=\"M56 138 76 178M104 138 84 178\" stroke=\"rgba(4,5,8,.9)\" stroke-width=\"1.5\" />\n      <path d=\"M61 139 79 174M99 139 81 174\" stroke=\"rgba(179,39,45,.45)\" stroke-width=\".8\" />\n\n      <!-- 左肩朱绳 -->\n      <path d=\"M52 149c-2 8-1 15 1 21\" stroke=\"#8E2028\" stroke-width=\"1.4\" fill=\"none\" />\n      <path d=\"M49 170c2 4 5 6 8 6\" stroke=\"#A62A31\" stroke-width=\"1.2\" fill=\"none\" />\n    </g>\n\n    <!-- 颈、脸 -->\n    <path d=\"M70 112h20l-2 30H72Z\" fill=\"#D7C7B8\" />\n    <path d=\"M80 44c18 0 30 14 30 34 0 21-11 38-30 49-19-11-30-28-30-49 0-20 12-34 30-34Z\" fill=\"#F3EEE7\" />\n    <path d=\"M52 90c3 15 10 25 20 32-10-11-16-21-20-32Z\" fill=\"rgba(196,170,152,.26)\" />\n    <path d=\"M108 86c-1 14-7 26-16 34 11-11 16-22 16-34Z\" fill=\"rgba(150,120,105,.22)\" />\n\n    <!-- 眼：墨线窄眼，只在瞳底留一线朱 -->\n    <g class=\"dl-eyes\">\n      <path d=\"M56 84c5-4 15-4 20 0-5 3.4-15 3.4-20 0Z\" fill=\"#FBFDFE\" opacity=\".9\" />\n      <path d=\"M84 84c5-4 15-4 20 0-5 3.4-15 3.4-20 0Z\" fill=\"#FBFDFE\" opacity=\".9\" />\n      <ellipse cx=\"66\" cy=\"84\" rx=\"3.2\" ry=\"3.8\" fill=\"#141014\" />\n      <ellipse cx=\"94\" cy=\"84\" rx=\"3.2\" ry=\"3.8\" fill=\"#141014\" />\n      <path class=\"dl-iris\" d=\"M63.2 84.8c1.6 2 4.2 2 5.6 0\" stroke=\"#B3272D\" stroke-width=\"1.4\" fill=\"none\" />\n      <path class=\"dl-iris\" d=\"M91.2 84.8c1.6 2 4.2 2 5.6 0\" stroke=\"#B3272D\" stroke-width=\"1.4\" fill=\"none\" />\n      <circle cx=\"67.1\" cy=\"82.4\" r=\".85\" fill=\"#FFFFFF\" opacity=\".75\" />\n      <circle cx=\"95.1\" cy=\"82.4\" r=\".85\" fill=\"#FFFFFF\" opacity=\".75\" />\n\n      <path d=\"M54 83.4c5.6-5.6 18.6-5.6 24 0l-.8 2.4c-5.4-4.4-17-4.4-22.4 0Z\" fill=\"#0A0E13\" />\n      <path d=\"M82 83.4c5.4-5.6 18.4-5.6 24 0l-.8 2.4c-5.4-4.4-17-4.4-22.4 0Z\" fill=\"#0A0E13\" />\n\n      <path d=\"M52.5 72.6 75 69.2M85 69.2 107.5 72.6\" stroke=\"#1A2028\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n      <path d=\"M55 75 72 72.4M88 72.4 105 75\" stroke=\"rgba(26,32,40,.35)\" stroke-width=\".7\" stroke-linecap=\"round\" />\n    </g>\n\n    <path d=\"M80 91.5v5.6\" stroke=\"#C3AC9C\" stroke-width=\"1\" stroke-linecap=\"round\" />\n    <path d=\"M76 108.4 84.2 108\" stroke=\"#966A63\" stroke-width=\"1.4\" stroke-linecap=\"round\" />\n\n    <!-- 前发：中分碎刘海 + 过肩侧发 + 朱红发带 -->\n    <g class=\"dl-hair-front\">\n      <path d=\"M80 26C57 32 45 55 43 86c5-16 13-27 22-33-4 10-6 21-6 32 6-15 14-26 21-32 7 6 15 17 21 32 0-11-2-22-6-32 9 6 17 17 22 33-2-31-14-54-37-60Z\" fill=\"#EFF4F9\" />\n      <path d=\"M62 31c-10 16-14 34-16 55 6-19 13-32 22-40Z\" fill=\"#DDE6EF\" />\n      <path d=\"M98 31c10 16 14 34 16 55-6-19-13-32-22-40Z\" fill=\"#DDE6EF\" />\n      <path d=\"M80 29c-2 16-2 31-1 44M73.6 32.6c-3 15-4.4 28-4.4 40M86.4 32.6c3 15 4.4 28 4.4 40\" stroke=\"#C1CEDB\" stroke-width=\".75\" fill=\"none\" opacity=\".7\" />\n      <path d=\"M80 28v18\" stroke=\"#B9C6D5\" stroke-width=\"1.1\" opacity=\".8\" />\n      <path d=\"M80 30c-7 6-11 15-13 24 7-10 13-18 13-24Z\" fill=\"#D2DCE8\" opacity=\".85\" />\n      <path d=\"M80 30c7 6 11 15 13 24-7-10-13-18-13-24Z\" fill=\"#D2DCE8\" opacity=\".85\" />\n      <path d=\"M44 84c-3 30-1 58 5 78 2-26 3-52 9-70Z\" fill=\"#DCE5EE\" />\n      <path d=\"M116 84c3 30 1 58-5 78-2-26-3-52-9-70Z\" fill=\"#DCE5EE\" />\n      <path d=\"M47 96c-2 23 0 45 4 59M113 96c2 23 0 45-4 59\" stroke=\"#B7C4D3\" stroke-width=\".75\" fill=\"none\" opacity=\".5\" />\n      <path d=\"M104 44c9 10 13 21 15 33\" stroke=\"#A62A31\" stroke-width=\"2.4\" fill=\"none\" opacity=\".85\" />\n      <path d=\"M104 44c9 10 13 21 15 33\" stroke=\"#C0333B\" stroke-width=\".9\" fill=\"none\" opacity=\".6\" />\n    </g>\n\n    <!-- 春秋蝉：右肩，推演时翅会颤 -->\n    <g class=\"dl-cicada\" transform=\"translate(115,150) rotate(-18)\">\n      <ellipse cx=\"0\" cy=\"0\" rx=\"5\" ry=\"7.6\" fill=\"#5F8574\" />\n      <path d=\"M0-7C-7-5-10 2-8 9-5 5-2 0 0-2Z\" fill=\"#D6E6DF\" opacity=\".5\" />\n      <path d=\"M0-7C7-5 10 2 8 9 5 5 2 0 0-2Z\" fill=\"#D6E6DF\" opacity=\".36\" />\n      <path d=\"M0-2v8\" stroke=\"#2A3B34\" stroke-width=\".7\" opacity=\".75\" />\n      <path d=\"M-1.6-4.6h3.2\" stroke=\"#2A3B34\" stroke-width=\".7\" opacity=\".5\" />\n      <circle cx=\"0\" cy=\"-8\" r=\"1.9\" fill=\"#23302B\" />\n    </g>\n  </g>\n</svg>"
    var VERSION = "0.1.0"

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
