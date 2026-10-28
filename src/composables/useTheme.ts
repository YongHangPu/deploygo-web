import { computed, ref } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'deploygo-theme'
const theme = ref<Theme>('dark')
let initialized = false
let switchTimer: ReturnType<typeof setTimeout> | null = null

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}

function applyTheme(next: Theme, persist: boolean): void {
  theme.value = next
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (persist) {
    // 切换瞬间禁用过渡，避免文字已经变暗、背景还在渐变造成短暂低对比。
    if (switchTimer) clearTimeout(switchTimer)
    root.classList.add('theme-switching')
  }

  root.dataset.theme = next
  root.style.colorScheme = next

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', next === 'light' ? '#f6f7f9' : '#0d1117')

  if (persist) {
    switchTimer = setTimeout(() => {
      root.classList.remove('theme-switching')
      switchTimer = null
    }, 80)
  }

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // 隐私模式下 localStorage 可能不可用，忽略即可
    }
  }
}

function initTheme(): void {
  if (initialized) return
  initialized = true
  if (typeof document === 'undefined') return

  // index.html 的内联脚本已经提前写入 data-theme，避免首屏闪烁。
  const fromDom = document.documentElement.dataset.theme
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    stored = null
  }
  const next: Theme = isTheme(fromDom) ? fromDom : isTheme(stored) ? stored : 'dark'
  applyTheme(next, false)
}

export function useTheme() {
  initTheme()
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(next: Theme): void {
    applyTheme(next, true)
  }

  function toggle(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { theme, isDark, setTheme, toggle }
}
