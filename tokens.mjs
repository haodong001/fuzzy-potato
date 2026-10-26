/**
 * 大爱仙尊 · 春秋蝉 — design tokens.
 *
 * One palette, two consumers:
 *   1. `tools/build.mjs` inlines this object into the client bundle, where it is
 *      handed to `ctx.theme.register({ id, colorScheme, tokens })`. The ui-layout
 *      presenter writes each entry onto <body> as an inline CSS variable.
 *   2. The same object is emitted as a `:root` block into the static preview, so
 *      the preview and the live client can never drift apart.
 *
 * Rules of the palette:
 *   - 墨 ink first: every surface is a near-black with a faint blue cast, never
 *     pure #000, so hairlines read as 霜 frost instead of screen glare.
 *   - 朱 vermilion is the only warm colour and it is used sparingly: primary
 *     action, active seed, seal stamp. Nothing else may be this red.
 *   - 霜青 steel blue carries information (links, business state, selection).
 *   - Contrast targets: primary text on bg-base >= 12:1, secondary >= 6:1,
 *     tertiary >= 3:1. Hairlines stay under 24% so they never look boxed-in.
 */

/** Vermilion: brand / primary action. */
const ZHU = '#A62A31'
const ZHU_HOVER = '#C0333B'
const ZHU_DIM = '#5E181C'

/** Steel blue: information, links, business state. */
const SHUANG = '#8FB6D9'

export const THEME = {
  id: 'dalian-xianzun',
  colorScheme: 'dark',
  tokens: {
    /* ---- 纸 paper: surfaces, darkest at the back ---- */
    '--dsw-alias-bg-base': '#06070A',
    '--dsw-alias-bg-layer-1': '#0A0C10',
    '--dsw-alias-bg-layer-2': '#0E1116',
    '--dsw-alias-bg-layer-3': '#13171D',
    '--dsw-alias-bg-overlay': '#0B0E12',
    '--dsw-alias-bg-module-platform': '#10141A',
    '--dsw-alias-bg-skeleton': '#12161C',
    '--dsw-alias-bg-document-preview': '#0A0C10',
    '--dsw-alias-bg-document-selection': 'rgba(143, 182, 217, 0.24)',
    '--dsw-alias-bg-multi-select': 'rgba(143, 182, 217, 0.16)',

    /* ---- 幕 masks: modal veils, kept cold rather than warm black ---- */
    '--dsw-alias-bg-mask-1': 'rgba(2, 3, 5, 0.55)',
    '--dsw-alias-bg-mask-2': 'rgba(2, 3, 5, 0.72)',
    '--dsw-alias-bg-mask-3': 'rgba(2, 3, 5, 0.86)',
    '--dsw-alias-bg-mask-drop': 'rgba(2, 3, 5, 0.62)',
    '--dsw-alias-bg-mask-photo': 'rgba(2, 3, 5, 0.80)',

    /* ---- 线 hairlines: 6 / 10 / 15 / 22 % frost ---- */
    '--dsw-alias-border-l1': 'rgba(226, 236, 246, 0.06)',
    '--dsw-alias-border-l2': 'rgba(226, 236, 246, 0.10)',
    '--dsw-alias-border-l2-darkmode-thin': 'rgba(226, 236, 246, 0.08)',
    '--dsw-alias-border-l3': 'rgba(226, 236, 246, 0.15)',
    '--dsw-alias-border-l4': 'rgba(226, 236, 246, 0.22)',
    '--dsw-alias-border-inverted': 'rgba(6, 7, 10, 0.85)',
    '--dsw-alias-border-inverted2': 'rgba(6, 7, 10, 0.60)',

    /* ---- 字 labels: cold white down to ash ---- */
    '--dsw-alias-label-primary': '#E8EEF5',
    '--dsw-alias-label-secondary': '#A9B4C0',
    '--dsw-alias-label-tertiary': '#7A8592',
    '--dsw-alias-label-caption': '#5B6672',
    '--dsw-alias-label-dimmed': '#8C97A3',
    '--dsw-alias-label-primary-dimmed': '#C7D1DB',
    '--dsw-alias-label-primary-bluish': '#D5DFEA',
    '--dsw-alias-label-primary-foreground': '#F5F8FB',
    '--dsw-alias-label-primary-inverted': '#06070A',
    '--dsw-alias-label-document-preview': '#A9B4C0',
    '--dsw-alias-label-shimmer': 'rgba(255, 255, 255, 0.14)',
    '--dsw-alias-label-deep-diving': SHUANG,
    '--dsw-alias-label-deep-diving-shimmer': 'rgba(143, 182, 217, 0.26)',

    /* ---- 朱 vermilion brand ---- */
    '--dsw-alias-brand-primary': ZHU,
    '--dsw-alias-brand-primary-invert': '#E8EEF5',
    '--dsw-alias-brand-text': '#E8EEF5',
    '--dsw-alias-brand-primary-new-colorprimary-new-color': ZHU,
    '--dsw-alias-button-primary-fill': ZHU,
    '--dsw-alias-button-primary-hover': ZHU_HOVER,
    '--dsw-alias-button-primary-dimmed': ZHU_DIM,
    '--dsw-alias-button-contrast-fill': '#E8EEF5',
    '--dsw-alias-button-elevated-fill': '#14181F',
    '--dsw-alias-button-floating-fill': 'rgba(12, 15, 20, 0.92)',
    '--dsw-alias-button-floating-hover': 'rgba(22, 27, 34, 0.96)',
    '--dsw-alias-button-ghost-active-fill': 'rgba(226, 236, 246, 0.08)',
    '--dsw-alias-button-ghost-active-border': 'rgba(226, 236, 246, 0.16)',
    '--dsw-alias-button-ghost-active-hover': 'rgba(226, 236, 246, 0.12)',
    '--dsw-alias-button-info-fill': '#1B2733',
    '--dsw-alias-button-info-hover': '#23323F',
    '--dsw-alias-button-tool-bar-fill': 'rgba(226, 236, 246, 0.05)',
    '--dsw-alias-button-tool-bar-fill-invisible': 'transparent',
    '--dsw-alias-button-tool-bar-hover': 'rgba(226, 236, 246, 0.10)',

    /* ---- 触 interactive layers ---- */
    '--dsw-alias-interactive-bg-hover': 'rgba(226, 236, 246, 0.055)',
    '--dsw-alias-interactive-bg-active': 'rgba(226, 236, 246, 0.09)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(166, 42, 49, 0.14)',
    '--dsw-alias-interactive-bg-hover-danger': 'rgba(207, 68, 75, 0.16)',
    '--dsw-alias-interactive-bg-hover-solid': '#171C24',

    /* ---- 态 states ---- */
    '--dsw-alias-state-success-primary': '#5B9C85',
    '--dsw-alias-state-success-secondary': 'rgba(91, 156, 133, 0.16)',
    '--dsw-alias-state-success-tertiary': 'rgba(91, 156, 133, 0.32)',
    '--dsw-alias-state-error-primary': '#CF444B',
    '--dsw-alias-state-error-secondary': 'rgba(207, 68, 75, 0.16)',
    '--dsw-alias-state-warn-primary': '#C69B4E',
    '--dsw-alias-state-warn-secondary': 'rgba(198, 155, 78, 0.16)',
    '--dsw-alias-state-warn-tertiary': 'rgba(198, 155, 78, 0.30)',
    '--dsw-alias-state-warn-label': '#C69B4E',
    '--dsw-alias-state-idle-primary': '#66727F',
    '--dsw-alias-state-business-primary': SHUANG,
    '--dsw-alias-state-business-tertiary': 'rgba(143, 182, 217, 0.30)',
    '--dsw-alias-link': SHUANG,

    /* ---- 文 markdown / code ---- */
    '--dsw-alias-markdown-code-block': '#08090C',
    '--dsw-alias-markdown-code-block-banner': '#0C0F13',
    '--dsw-alias-markdown-inline-code': 'rgba(226, 236, 246, 0.07)',
    '--dsw-alias-markdown-code-segment-selected': 'rgba(226, 236, 246, 0.12)',
    '--dsw-alias-markdown-code-segment-unselected': 'rgba(226, 236, 246, 0.04)',
    '--dsw-alias-markdown-citation': 'rgba(143, 182, 217, 0.14)',
    '--dsw-alias-markdown-placeholder': '#5B6672',
    '--dsw-alias-markdown-tag': 'rgba(166, 42, 49, 0.18)',
    '--dsw-alias-code-diff-added': 'rgba(91, 156, 133, 0.16)',
    '--dsw-alias-code-diff-deleted': 'rgba(207, 68, 75, 0.16)',
    '--dsw-alias-file-diff-added-bg': 'rgba(91, 156, 133, 0.13)',
    '--dsw-alias-file-diff-added-gutter': 'rgba(91, 156, 133, 0.22)',
    '--dsw-alias-file-diff-added-marker': '#5B9C85',
    '--dsw-alias-file-diff-deleted-bg': 'rgba(207, 68, 75, 0.13)',
    '--dsw-alias-file-diff-deleted-gutter': 'rgba(207, 68, 75, 0.22)',
    '--dsw-alias-file-diff-deleted-marker': '#CF444B',

    /* ---- 器 chrome: menus, sidebar, cards ---- */
    '--dsw-alias-menu-icon': '#A9B4C0',
    '--dsw-alias-menu-group-header-fill': 'rgba(10, 12, 16, 0.94)',
    '--dsw-alias-scrollbar-bg-l1': 'transparent',
    '--dsw-alias-scrollbar-bg-l2': 'transparent',
    '--dsw-alias-scrollbar-hover-l1': 'rgba(226, 236, 246, 0.10)',
    '--dsw-alias-scrollbar-hover-l2': 'rgba(226, 236, 246, 0.14)',
    '--dsw-alias-settings-card-fill': '#0C0F13',
    '--dsw-alias-settings-card-stroke': 'rgba(226, 236, 246, 0.10)',
    '--dsw-alias-switch-thumb': '#C7D1DB',
    '--dsw-alias-toast-bg': '#12161C',
    '--dsw-alias-toast-label': '#E8EEF5',
    '--dsw-alias-tooltip-bg': '#161B22',
    '--dsw-alias-tooltip-key-bg': 'rgba(226, 236, 246, 0.10)',
    '--dsw-alias-turn-trigger-bg': '#0F1318',
    '--dsw-alias-turn-trigger-bg-hover': '#151A21',

    /* ---- 籍 onboarding ---- */
    '--dsw-alias-onboarding-accent': ZHU,
    '--dsw-alias-onboarding-card-fill': '#0C0F13',
    '--dsw-alias-onboarding-checkbox-border': 'rgba(226, 236, 246, 0.22)',
    '--dsw-alias-onboarding-secondary-fill': '#14181F',

    /* ---- 专 specific surfaces ---- */
    '--dsw-specific-sidebar-fill': '#080A0D',
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(226, 236, 246, 0.05)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(166, 42, 49, 0.14)',
    '--dsw-specific-sidebar-nav-item-active-accent': ZHU,
    '--dsw-specific-bubble': '#0E1116',
    '--dsw-specific-bubble-highlight': '#12161D',
    '--dsw-specific-input-major': '#0C0F13',
    '--dsw-specific-login-input': '#0C0F13',
    '--dsw-specific-menu': 'rgba(12, 15, 20, 0.94)',
    '--dsw-specific-selector': '#12161C',
    '--dsw-specific-tip': '#101419',
  },
}

/** Radii are not theme tokens; the skin sharpens them through the stylesheet. */
export const RADII = {
  '--dsw-radius-xs': '2px',
  '--dsw-radius-sm': '3px',
  '--dsw-radius-md': '4px',
  '--dsw-radius-lg': '6px',
  '--dsw-radius-xl': '8px',
  '--dsw-radius-panel': '10px',
}

/** Human-readable palette, for the design doc and the preview legend. */
export const SWATCHES = [
  { name: '墨 base', value: '#06070A' },
  { name: '纸 layer-1', value: '#0A0C10' },
  { name: '纸 layer-2', value: '#0E1116' },
  { name: '霜 line-l3', value: 'rgba(226,236,246,0.15)' },
  { name: '字 primary', value: '#E8EEF5' },
  { name: '字 tertiary', value: '#7A8592' },
  { name: '朱 brand', value: ZHU },
  { name: '朱 hover', value: ZHU_HOVER },
  { name: '霜青 link', value: SHUANG },
  { name: '苔 success', value: '#5B9C85' },
  { name: '错 error', value: '#CF444B' },
  { name: '警 warn', value: '#C69B4E' },
]
