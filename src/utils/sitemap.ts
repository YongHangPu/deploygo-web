/**
 * sitemap.xml / robots.txt 生成（纯函数，可在 Node 脚本与单测里复用）。
 *
 * 站点域名来自构建期环境变量 VITE_SITE_URL，域名缺失时回退到 DEFAULT_SITE_URL。
 */

import type { SiteRoute } from '@/data/routes'

export const DEFAULT_SITE_URL = 'https://deploygo.example.com'

export interface SitemapEntry {
  path: string
  changefreq?: string
  priority?: number
  lastmod?: string
}

/** 规范站点地址：补协议、去尾斜杠 */
export function normalizeSiteUrl(input: string | undefined | null): string {
  const raw = (input ?? '').trim()
  if (!raw) return DEFAULT_SITE_URL
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

/** 拼接绝对地址 */
export function absoluteSiteUrl(baseUrl: string, path: string): string {
  const base = normalizeSiteUrl(baseUrl)
  if (!path || path === '/') return `${base}/`
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/** 路由表 → sitemap 条目（过滤不可收录页面与 404） */
export function buildSitemapEntries(routes: readonly SiteRoute[]): SitemapEntry[] {
  return routes
    .filter((route) => route.indexable !== false)
    .map((route) => ({
      path: route.path,
      changefreq: route.changefreq,
      priority: route.priority,
    }))
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** 生成 sitemap.xml 文本 */
export function buildSitemapXml(
  entries: readonly SitemapEntry[],
  siteUrl: string,
  lastmod?: string,
): string {
  const base = normalizeSiteUrl(siteUrl)
  const urls = entries.map((entry) => {
    const lines = [`    <loc>${escapeXml(absoluteSiteUrl(base, entry.path))}</loc>`]
    if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`)
    if (entry.changefreq) lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`)
    if (typeof entry.priority === 'number') {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
    }
    return `  <url>\n${lines.join('\n')}\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** 生成 robots.txt 文本 */
export function buildRobotsTxt(siteUrl: string): string {
  const base = normalizeSiteUrl(siteUrl)
  return [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${absoluteSiteUrl(base, '/404')}`,
    '',
    `Sitemap: ${absoluteSiteUrl(base, '/sitemap.xml')}`,
    '',
  ].join('\n')
}
