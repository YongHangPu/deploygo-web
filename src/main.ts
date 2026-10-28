import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/components.css'

import { ViteSSG } from 'vite-ssg'
import App from '@/App.vue'
import { routes } from '@/router'
import { vReveal } from '@/directives/reveal'

/**
 * 应用入口：由 vite-ssg 接管。
 * - 构建：`vite-ssg build` 会针对 includedRoutes 逐页渲染并写入 dist/<route>/index.html
 * - 开发：普通 Vite dev server，路由与页面逻辑完全相同
 */
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 88 }
      return { top: 0 }
    },
  },
  ({ app }) => {
    app.directive('reveal', vReveal)
  },
)
