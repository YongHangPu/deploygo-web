/**
 * 构建后处理脚本。
 *
 * 在 `vite-ssg build` 之后执行：
 * 1. 生成 dist/sitemap.xml（路由来自 src/data/routes.ts）
 * 2. 生成 dist/robots.txt
 * 3. 复制 dist/404/index.html -> dist/404.html（Nginx error_page 与静态托管使用）
 * 4. 校验每个路由都产出了预渲染 HTML，缺一个就让构建失败
 *
 * 站点域名取 VITE_SITE_URL（环境变量优先，其次读 .env / .env.local / .env.production）。
 */

import { existsSync } from 'node:fs'
import { access, copyFile, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { SITE_ROUTES, NOT_FOUND_PATH } from '../src/data/routes'
import {
  buildRobotsTxt,
  buildSitemapEntries,
  buildSitemapXml,
  normalizeSiteUrl,
} from '../src/utils/sitemap'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    result[key] = value
  }
  return result
}

async function resolveSiteUrl(): Promise<string> {
  if (process.env.VITE_SITE_URL) return normalizeSiteUrl(process.env.VITE_SITE_URL)

  for (const filename of ['.env', '.env.local', '.env.production']) {
    const filePath = path.join(projectRoot, filename)
    if (!existsSync(filePath)) continue
    const parsed = parseEnvFile(await readFile(filePath, 'utf8'))
    if (parsed.VITE_SITE_URL) return normalizeSiteUrl(parsed.VITE_SITE_URL)
  }

  return normalizeSiteUrl(undefined)
}

function distIndexPath(routePath: string): string {
  if (routePath === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function main(): Promise<void> {
  if (!existsSync(distDir)) {
    throw new Error('未找到 dist 目录，请先执行 vite-ssg build')
  }

  const siteUrl = await resolveSiteUrl()
  const lastmod = new Date().toISOString().slice(0, 10)

  const entries = buildSitemapEntries(SITE_ROUTES)
  await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(entries, siteUrl, lastmod), 'utf8')
  await writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8')

  // 404 页面同时提供 /404/index.html 与 /404.html，方便 Nginx error_page 直接使用
  const notFoundIndex = distIndexPath(NOT_FOUND_PATH)
  if (await fileExists(notFoundIndex)) {
    await copyFile(notFoundIndex, path.join(distDir, '404.html'))
  }

  const missing: string[] = []
  for (const route of SITE_ROUTES) {
    if (!(await fileExists(distIndexPath(route.path)))) missing.push(route.path)
  }

  console.log('')
  console.log(`[postbuild] 站点域名: ${siteUrl}`)
  console.log(`[postbuild] sitemap.xml: ${entries.length} 条路由`)
  console.log(`[postbuild] robots.txt: 已生成`)
  console.log(`[postbuild] 预渲染页面: ${SITE_ROUTES.length - missing.length}/${SITE_ROUTES.length} 通过`)
  if (missing.length > 0) {
    console.error(`[postbuild] 缺少预渲染 HTML: ${missing.join(', ')}`)
    process.exitCode = 1
    return
  }
  console.log('[postbuild] 完成')
}

main().catch((error: unknown) => {
  console.error('[postbuild] 失败:', error instanceof Error ? error.message : error)
  process.exitCode = 1
})
