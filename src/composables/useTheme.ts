import { computed, ref } from 'vue'

/** 用户选择的主题模式：跟随系统 / 浅色 / 深色 */
export type ThemePreference = 'system' | 'light' | 'dark'
/** 实际生效的主题 */
export type ResolvedTheme = 'dark' | 'light'

const STORAGE_KEY = 'deploygo-theme'
const DARK_THEME_COLOR = '#0d1117'
const LIGHT_THEME_COLOR = '#f6f7f9'

const preference = ref<ThemePreference>('dark')
const resolved = ref<ResolvedTheme>('dark')

let initialized = false
let switchTimer: ReturnType<typeof setTimeout> | null = null
let mediaQuery: MediaQueryList | null = null
let mediaListenerAttached = false

function isPreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function systemPrefersLight(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: light)').matches
    : false
}

function resolveTheme(value: ThemePreference): ResolvedTheme {
  if (value === 'system') return systemPrefersLight() ? 'light' : 'dark'
  return value
}

function applyTheme(value: ThemePreference, persist: boolean, guardTransitions = true): void {
  const theme = resolveTheme(value)
  preference.value = value
  resolved.value = theme

  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (guardTransitions) {
    // 主题切换瞬间禁用过渡，避免文字与背景颜色短暂错位。
    if (switchTimer) clearTimeout(switchTimer)
    root.classList.add('theme-switching')
  }

  root.dataset.theme = theme
  root.dataset.themeMode = value
  root.style.colorScheme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR)
  }

  if (guardTransitions) {
    switchTimer = setTimeout(() => {
      root.classList.remove('theme-switching')
      switchTimer = null
    }, 80)
  }

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // 隐私模式下 localStorage 可能不可用，忽略即可
    }
  }
}

function attachSystemThemeListener(): void {
  if (mediaListenerAttached) return
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  mediaListenerAttached = true

  const syncSystemTheme = (): void => {
    if (preference.value === 'system') applyTheme('system', false)
  }

  mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
  mediaQuery.addEventListener('change', syncSystemTheme)
  // 部分环境（旧浏览器 / 从后台切回）可能不派发 change，补两个兜底入口。
  window.addEventListener('focus', syncSystemTheme)
  window.addEventListener('pageshow', syncSystemTheme)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncSystemTheme()
  })
}

function initTheme(): void {
  if (initialized) return
  initialized = true
  if (typeof document === 'undefined') return

  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    stored = null
  }

  // 兼容旧版本只存 dark/light 的情况；未设置过时保持品牌默认深色。
  const next: ThemePreference = isPreference(stored) ? stored : 'dark'
  applyTheme(next, false, false)
  attachSystemThemeListener()
}

export function useTheme() {
  initTheme()

  const isDark = computed(() => resolved.value === 'dark')
  const isSystem = computed(() => preference.value === 'system')

  function setPreference(value: ThemePreference): void {
    applyTheme(value, true)
  }

  return { preference, resolved, isDark, isSystem, setPreference }
}
