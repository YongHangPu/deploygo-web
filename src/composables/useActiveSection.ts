import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 文档页左侧锚点导航的高亮状态。
 * 用 IntersectionObserver 观察各章节，避免监听 scroll 事件。
 */
export function useActiveSection(ids: readonly string[]) {
  const activeId = ref<string>(ids[0] ?? '')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const first = visible[0]
        if (first) activeId.value = first.target.id
      },
      { rootMargin: '-96px 0px -62% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer?.observe(element))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return { activeId }
}
