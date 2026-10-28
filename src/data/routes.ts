/**
 * 站点路由表。
 *
 * 这里同时承担三件事：
 * 1. vue-router 的路由元信息（标题、描述、导航文案）
 * 2. 构建期 vite-ssg 的预渲染清单（PRERENDER_PATHS）
 * 3. 构建后 sitemap.xml / robots.txt 的生成依据
 *
 * 本文件不允许导入任何 Vue 组件或 import.meta，方便 Node 脚本（scripts/postbuild.ts）与单测直接复用。
 */

export type ChangeFreq = 'daily' | 'weekly' | 'monthly'

export interface SiteRoute {
  /** 路由路径，例如 /pricing */
  path: string
  /** 路由名称，用于 router.push({ name }) */
  name: string
  /** 导航与页脚展示文案 */
  label: string
  /** SEO 标题（含品牌后缀） */
  title: string
  /** SEO 描述，长度控制在 60 到 140 字之间 */
  description: string
  /** sitemap changefreq */
  changefreq: ChangeFreq
  /** sitemap priority，0 到 1 */
  priority: number
  /** 是否出现在顶部导航 */
  nav?: boolean
  /** 是否允许搜索引擎收录（404 页为 false） */
  indexable?: boolean
}

export const HOME_ROUTE: SiteRoute = {
  path: '/',
  name: 'home',
  label: '首页',
  title: 'deploygo · 让前端发布更稳、更简单',
  description:
    'deploygo 是一款面向前端静态项目的桌面端部署工具：一键部署、零停机发布、版本管理、重复发布拦截与一键回滚。支持 Vue、React、Angular、Svelte 与纯静态站点。',
  changefreq: 'weekly',
  priority: 1,
}

export const SITE_ROUTES: readonly SiteRoute[] = [
  HOME_ROUTE,
  {
    path: '/features',
    name: 'features',
    label: '功能',
    title: '功能 · deploygo 的发布链路',
    description:
      '逐项说明 deploygo 的发布能力：零停机发布顺序、版本历史与回滚、重复发布拦截、缓存策略、框架支持矩阵，以及与手动 SSH、通用 CI 的差异。',
    changefreq: 'weekly',
    priority: 0.8,
    nav: true,
  },
  {
    path: '/pricing',
    name: 'pricing',
    label: '定价',
    title: '定价 · deploygo 授权套餐',
    description:
      'deploygo 授权按时长购买：月付、季付、年付、两年、三年与永久版。90 天免费试用无需注册，购买前可提交购买意向，由人工确认后签发授权码。',
    changefreq: 'weekly',
    priority: 0.9,
    nav: true,
  },
  {
    path: '/download',
    name: 'download',
    label: '下载',
    title: '下载 · deploygo 桌面端与更新通知组件',
    description:
      '下载 deploygo 桌面端（Windows / macOS / Linux），以及 8 个框架版本的更新通知组件源码：Vue 3、Vue 2、React、Angular、Svelte、纯 JavaScript，均含 TS 与 JS 变体。',
    changefreq: 'weekly',
    priority: 0.9,
    nav: true,
  },
  {
    path: '/docs',
    name: 'docs',
    label: '文档',
    title: '文档 · deploygo 接入与发布指南',
    description:
      'deploygo 接入文档：安装桌面端、挂载版本更新通知组件、按原有方式构建、version.json 约定、Nginx 缓存配置，以及发布与回滚流程。',
    changefreq: 'weekly',
    priority: 0.8,
    nav: true,
  },
  {
    path: '/changelog',
    name: 'changelog',
    label: '更新日志',
    title: '更新日志 · deploygo',
    description: 'deploygo 各版本的更新记录，包含修复、优化与发布流程改进，按发布时间倒序排列。',
    changefreq: 'weekly',
    priority: 0.6,
    nav: true,
  },
  {
    path: '/open-source',
    name: 'open-source',
    label: '开源说明',
    title: '开源说明 · deploygo 的双轨模式',
    description:
      'deploygo 采用界面与方案开源、部署引擎闭源的双轨模式。开源仓库包含完整界面实现、8 个框架更新通知组件、Rust 架构骨架与发布方案文档，采用 MIT 协议。',
    changefreq: 'monthly',
    priority: 0.6,
    nav: true,
  },
  {
    path: '/faq',
    name: 'faq',
    label: '常见问题',
    title: '常见问题 · deploygo',
    description:
      '关于 deploygo 的常见问题：购买与授权、更新通知组件接入、发布与回滚、安全设计，以及开源版与完整版的关系。',
    changefreq: 'monthly',
    priority: 0.5,
  },
] as const

/** 404 页面单独处理：需要预渲染，但不进 sitemap、不被收录 */
export const NOT_FOUND_PATH = '/404'

/** 预渲染路径清单（vite-ssg includedRoutes 使用） */
export const SITE_ROUTE_PATHS = SITE_ROUTES.map((route) => route.path)

/** 需要预渲染的全部页面路径 */
export const PRERENDER_PATHS: readonly string[] = [...SITE_ROUTE_PATHS, NOT_FOUND_PATH]

/** 顶部导航使用的路由 */
export const NAV_ROUTES: readonly SiteRoute[] = SITE_ROUTES.filter((route) => route.nav)

/** 按路径查找路由元信息，用于页面内自检与单测 */
export function findRouteByPath(path: string): SiteRoute | undefined {
  return SITE_ROUTES.find((route) => route.path === path)
}
