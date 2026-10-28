import { onMounted, ref, type Ref } from 'vue'

export interface PublicDataResult<T> {
  /** 页面直接使用的数据：预渲染时是 fallback，挂载后可能被真实接口覆盖 */
  data: Ref<T>
  /** 是否正在请求接口 */
  loading: Ref<boolean>
  /** 是否已经用真实接口数据替换了 fallback */
  live: Ref<boolean>
}

/**
 * 公开接口 + 本地兜底的通用模式。
 *
 * 关键点：预渲染阶段不会执行 onMounted，因此构建出的 HTML 一定是 fallback 里的完整文案；
 * 浏览器挂载后再尝试请求 /public/*，成功且结构有效时覆盖，失败则静默保留 fallback。
 */
export function usePublicData<T>(fallback: T, loader: () => Promise<T | null>): PublicDataResult<T> {
  const data = ref(fallback) as Ref<T>
  const loading = ref(false)
  const live = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      const remote = await loader()
      if (remote) {
        data.value = remote
        live.value = true
      }
    } catch {
      // 接口不可用是预期情况：保留本地兜底数据，页面不出现错误状态
    } finally {
      loading.value = false
    }
  })

  return { data, loading, live }
}
