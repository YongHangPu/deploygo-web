import { onMounted, ref } from 'vue'
import { fetchSite } from '@/api/public'
import { FALLBACK_SITE, type SiteInfo } from '@/data/site'

/**
 * 站点信息：模块级单例，预渲染时始终是 FALLBACK_SITE，浏览器端只请求一次。
 * 顶部导航、页脚、购买意向弹窗都从这里取联系方式与仓库链接。
 */
const site = ref<SiteInfo>(FALLBACK_SITE)
let requested = false

export function useSiteInfo() {
  if (!import.meta.env.SSR) {
    onMounted(async () => {
      if (requested) return
      requested = true
      try {
        const remote = await fetchSite()
        if (remote) site.value = remote
      } catch {
        // 保留本地兜底
      }
    })
  }

  return { site }
}
