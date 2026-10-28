import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SITE_URL,
  absoluteSiteUrl,
  buildRobotsTxt,
  buildSitemapEntries,
  buildSitemapXml,
  normalizeSiteUrl,
} from '@/utils/sitemap'
import { NOT_FOUND_PATH, PRERENDER_PATHS, SITE_ROUTES, findRouteByPath } from '@/data/routes'

describe('站点域名规范化', () => {
  it('补协议并去掉尾部斜杠', () => {
    expect(normalizeSiteUrl('https://example.com/')).toBe('https://example.com')
    expect(normalizeSiteUrl('http://example.com///')).toBe('http://example.com')
    expect(normalizeSiteUrl('example.com')).toBe('https://example.com')
    expect(normalizeSiteUrl('  https://example.com/blog/  ')).toBe('https://example.com/blog')
  })

  it('空值回退默认域名', () => {
    expect(normalizeSiteUrl('')).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl(null)).toBe(DEFAULT_SITE_URL)
  })

  it('拼接绝对地址', () => {
    expect(absoluteSiteUrl('https://example.com', '/')).toBe('https://example.com/')
    expect(absoluteSiteUrl('https://example.com/', '/pricing')).toBe('https://example.com/pricing')
    expect(absoluteSiteUrl('example.com', 'docs')).toBe('https://example.com/docs')
  })
})

describe('路由表', () => {
  it('包含 8 个可索引页面，路径与名称唯一', () => {
    expect(SITE_ROUTES).toHaveLength(8)
    expect(new Set(SITE_ROUTES.map((route) => route.path)).size).toBe(8)
    expect(new Set(SITE_ROUTES.map((route) => route.name)).size).toBe(8)
    for (const route of SITE_ROUTES) {
      expect(route.path.startsWith('/')).toBe(true)
      expect(route.title).toContain('deploygo')
      expect(route.description.length).toBeGreaterThan(30)
      expect(route.priority).toBeGreaterThan(0)
      expect(route.priority).toBeLessThanOrEqual(1)
      expect(route.indexable).not.toBe(false)
    }
  })

  it('导航项来自路由表且不少于 5 个', () => {
    const navRoutes = SITE_ROUTES.filter((route) => route.nav)
    expect(navRoutes.length).toBeGreaterThanOrEqual(5)
    expect(navRoutes.map((route) => route.path)).toContain('/pricing')
    expect(navRoutes.map((route) => route.path)).toContain('/docs')
  })

  it('预渲染清单包含全部页面与 404', () => {
    expect(PRERENDER_PATHS).toHaveLength(SITE_ROUTES.length + 1)
    expect(PRERENDER_PATHS).toContain('/')
    expect(PRERENDER_PATHS).toContain(NOT_FOUND_PATH)
    for (const route of SITE_ROUTES) {
      expect(PRERENDER_PATHS).toContain(route.path)
    }
  })

  it('按路径查找路由', () => {
    expect(findRouteByPath('/pricing')?.name).toBe('pricing')
    expect(findRouteByPath('/download')?.nav).toBe(true)
    expect(findRouteByPath('/missing')).toBeUndefined()
  })
})

describe('sitemap 生成', () => {
  it('只为可索引路由生成条目，不含 404', () => {
    const entries = buildSitemapEntries(SITE_ROUTES)
    expect(entries).toHaveLength(SITE_ROUTES.length)
    expect(entries.map((entry) => entry.path)).not.toContain(NOT_FOUND_PATH)

    const withNoindex = buildSitemapEntries([
      { ...SITE_ROUTES[0]!, indexable: false },
      SITE_ROUTES[1]!,
    ])
    expect(withNoindex.map((entry) => entry.path)).toEqual([SITE_ROUTES[1]!.path])
  })

  it('生成合法的 urlset 结构', () => {
    const xml = buildSitemapXml(buildSitemapEntries(SITE_ROUTES), 'https://deploygo.example.com')
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
    expect(xml).toContain('<loc>https://deploygo.example.com/</loc>')
    expect(xml).toContain('<loc>https://deploygo.example.com/pricing</loc>')
    expect(xml).toContain('<priority>1.0</priority>')
    expect(xml).toContain('<changefreq>weekly</changefreq>')
    expect(xml).not.toContain('/404')
  })

  it('包含 lastmod 时写入日期', () => {
    const xml = buildSitemapXml(
      [{ path: '/', changefreq: 'weekly', priority: 1 }],
      'https://example.com',
      '2026-10-28',
    )
    expect(xml).toContain('<lastmod>2026-10-28</lastmod>')
  })

  it('域名末尾斜杠不会产生双斜杠', () => {
    const xml = buildSitemapXml([{ path: '/docs' }], 'https://example.com/')
    expect(xml).toContain('<loc>https://example.com/docs</loc>')
    expect(xml).not.toContain('//docs')
  })
})

describe('robots.txt 生成', () => {
  it('允许抓取并声明 sitemap，屏蔽 404', () => {
    const robots = buildRobotsTxt('https://deploygo.example.com/')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Disallow: https://deploygo.example.com/404')
    expect(robots).toContain('Sitemap: https://deploygo.example.com/sitemap.xml')
  })
})
