import type { RouteRecordRaw } from 'vue-router'
import { NOT_FOUND_PATH } from '@/data/routes'
import HomeView from '@/views/HomeView.vue'
import FeaturesView from '@/views/FeaturesView.vue'
import PricingView from '@/views/PricingView.vue'
import DownloadView from '@/views/DownloadView.vue'
import DocsView from '@/views/DocsView.vue'
import ChangelogView from '@/views/ChangelogView.vue'
import OpenSourceView from '@/views/OpenSourceView.vue'
import FaqView from '@/views/FaqView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

/**
 * 路由表与 src/data/routes.ts 一一对应。
 * 404 同时保留 /404 与 catch-all：前者用于预渲染与 Nginx 的 404.html 回落，后者用于客户端兜底。
 */
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/features', name: 'features', component: FeaturesView },
  { path: '/pricing', name: 'pricing', component: PricingView },
  { path: '/download', name: 'download', component: DownloadView },
  { path: '/docs', name: 'docs', component: DocsView },
  { path: '/changelog', name: 'changelog', component: ChangelogView },
  { path: '/open-source', name: 'open-source', component: OpenSourceView },
  { path: '/faq', name: 'faq', component: FaqView },
  { path: NOT_FOUND_PATH, name: 'not-found-explicit', component: NotFoundView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]
