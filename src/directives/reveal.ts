import type { Directive, DirectiveBinding } from 'vue'

const REVEAL_CLASS = 'reveal'
const VISIBLE_CLASS = 'is-revealed'

let observer: IntersectionObserver | null = null

function ensureObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add(VISIBLE_CLASS)
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
  }
  return observer
}

/**
 * v-reveal：滚动入场动画。
 *
 * 实现要点：
 * - 首屏内元素直接可见，不参与动画，避免首屏闪烁
 * - 首屏外元素在挂载时才加 .reveal（无 JS 时内容始终可见）
 * - 尊重 prefers-reduced-motion
 * - 可选延迟：v-reveal="120"（毫秒），用于同组元素错峰
 */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<number | undefined>) {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add(VISIBLE_CLASS)
      return
    }

    const delay = typeof binding.value === 'number' ? binding.value : 0
    if (delay > 0) el.style.setProperty('--reveal-delay', `${delay}ms`)

    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewportHeight * 0.92) {
      el.classList.add(VISIBLE_CLASS)
      return
    }

    el.classList.add(REVEAL_CLASS)
    ensureObserver().observe(el)
  },
  unmounted(el: HTMLElement) {
    observer?.unobserve(el)
  },
}
