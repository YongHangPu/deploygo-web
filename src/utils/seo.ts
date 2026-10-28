import { useHead } from '@unhead/vue'
import { absoluteUrl, OG_IMAGE_PATH, SITE_NAME } from '@/data/site'
import type { PricingPlan } from '@/data/pricing'

export interface PageHeadInput {
  title: string
  description: string
  /** 路由路径，例如 /pricing */
  path: string
  type?: 'website' | 'article'
  /** 结构化数据，可传对象或对象数组 */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** 不参与收录的页面（404） */
  noindex?: boolean
}

/** 每页统一的 SEO / OG / Twitter / canonical / JSON-LD 设置 */
export function usePageHead(input: PageHeadInput): void {
  const canonical = absoluteUrl(input.path)
  const image = absoluteUrl(OG_IMAGE_PATH)
  const robots = input.noindex ? 'noindex, nofollow' : 'index, follow'

  const jsonLdList = input.jsonLd
    ? Array.isArray(input.jsonLd)
      ? input.jsonLd
      : [input.jsonLd]
    : []

  useHead({
    title: input.title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: input.description },
      { name: 'robots', content: robots },
      { property: 'og:type', content: input.type ?? 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'zh_CN' },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: image },
    ],
    script: jsonLdList.map((jsonLd, index) => ({
      key: `json-ld-${index}`,
      type: 'application/ld+json',
      textContent: JSON.stringify(jsonLd),
    })),
  })
}

/** 首页 SoftwareApplication 结构化数据 */
export function buildSoftwareApplicationJsonLd(plans: readonly PricingPlan[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Static site deployment tool',
    operatingSystem: 'Windows 10+, macOS 12+, Linux',
    description:
      'deploygo 是一款面向前端静态项目的桌面端部署工具，提供一键部署、零停机发布、版本管理、重复发布拦截与快速回滚能力。',
    url: absoluteUrl('/'),
    downloadUrl: absoluteUrl('/download'),
    softwareVersion: '1.1.3',
    inLanguage: 'zh-CN',
    license: 'https://github.com/YongHangPu/deploygo/blob/main/LICENSE',
    featureList: [
      '一键部署前端静态项目',
      '零停机发布顺序：静态资源、index.html、version.json',
      '版本历史与一键回滚',
      '重复发布拦截',
      '服务器凭证 AES-256-GCM 本地加密',
    ],
    offers: plans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: (plan.priceCents / 100).toFixed(2),
      priceCurrency: 'CNY',
      description: plan.description,
      url: absoluteUrl('/pricing'),
    })),
  }
}
