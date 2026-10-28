import { DEFAULT_SITE_URL, normalizeSiteUrl } from '@/utils/sitemap'

/** 公开站点信息，结构对齐 deploy/CONTRACT.md 5.6 /public/site */
export interface SiteInfo {
  siteName: string
  slogan: string
  description: string
  icp: string
  contacts: {
    email: string
    wechat: string
    qq: string
  }
  links: {
    github: string
    gitee: string
    releases: string
  }
  trialDays: number
  announcement: string
  updatedAt: string
}

export const SITE_NAME = 'deploygo'

/** 构建期注入的站点域名；本地开发回退到 localhost，构建部署时请设置 VITE_SITE_URL */
export const SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : DEFAULT_SITE_URL),
)

/** 社交分享封面（build 前由脚本生成，1200x630） */
export const OG_IMAGE_PATH = '/og-cover.png'

/** API 基地址，默认 /api，拼接 /v1 后请求公开接口 */
export const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '')

/** 站点绝对地址 */
export function absoluteUrl(path: string): string {
  const base = SITE_URL
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * 本地兜底站点信息。
 * 构建时后端通常不可用，预渲染 HTML 必须包含真实文案，因此这里是最完整的一份内容。
 */
export const FALLBACK_SITE: SiteInfo = {
  siteName: SITE_NAME,
  slogan: '让前端发布更稳、更简单',
  description:
    'deploygo 是一款面向前端静态项目的桌面端部署工具，提供一键部署、版本管理、重复发布拦截与快速回滚能力。',
  icp: '',
  contacts: {
    email: '',
    wechat: '',
    qq: '',
  },
  links: {
    github: 'https://github.com/YongHangPu/deploygo',
    gitee: 'https://gitee.com/yonghangpu/deploygo',
    releases: 'https://github.com/YongHangPu/deploygo/releases',
  },
  trialDays: 90,
  announcement: '',
  updatedAt: '2026-10-01T00:00:00.000Z',
}

export interface ContactChannel {
  label: string
  value: string
  href?: string
}

/**
 * 把站点配置里的联系方式整理成可展示、可复制的列表。
 * 全部为空时回退到 GitHub Issues，保证购买意向提交失败时用户总有一条可用路径。
 */
export function resolveContactChannels(site: SiteInfo): ContactChannel[] {
  const channels: ContactChannel[] = []
  const { email, wechat, qq } = site.contacts
  if (email) channels.push({ label: '邮箱', value: email, href: `mailto:${email}` })
  if (wechat) channels.push({ label: '微信', value: wechat })
  if (qq) channels.push({ label: 'QQ', value: qq })

  if (channels.length === 0) {
    channels.push({
      label: 'GitHub Issues',
      value: `${site.links.github}/issues`,
      href: `${site.links.github}/issues`,
    })
  }
  return channels
}
