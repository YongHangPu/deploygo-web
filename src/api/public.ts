import { http } from '@/api/client'
import { FALLBACK_SITE, type SiteInfo } from '@/data/site'
import { FALLBACK_PRICING, type PricingPlan, type DurationUnit } from '@/data/pricing'
import { FALLBACK_DOWNLOADS, type DownloadItem } from '@/data/downloads'
import { FALLBACK_RELEASES, type ReleaseItem } from '@/data/releases'
import { formatDuration } from '@/utils/format'

interface ListResponse<T> {
  items?: T[]
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/** GET /public/site */
export async function fetchSite(): Promise<SiteInfo | null> {
  const { data } = await http.get<Partial<SiteInfo>>('/public/site')
  if (!data) return null
  return {
    siteName: asString(data.siteName, FALLBACK_SITE.siteName),
    slogan: asString(data.slogan, FALLBACK_SITE.slogan),
    description: asString(data.description, FALLBACK_SITE.description),
    icp: asString(data.icp, FALLBACK_SITE.icp),
    contacts: {
      email: asString(data.contacts?.email),
      wechat: asString(data.contacts?.wechat),
      qq: asString(data.contacts?.qq),
    },
    links: {
      github: asString(data.links?.github, FALLBACK_SITE.links.github),
      gitee: asString(data.links?.gitee, FALLBACK_SITE.links.gitee),
      releases: asString(data.links?.releases, FALLBACK_SITE.links.releases),
    },
    trialDays: asNumber(data.trialDays, FALLBACK_SITE.trialDays),
    announcement: asString(data.announcement),
    updatedAt: asString(data.updatedAt, FALLBACK_SITE.updatedAt),
  }
}

/** GET /public/pricing */
export async function fetchPricing(): Promise<PricingPlan[] | null> {
  const { data } = await http.get<ListResponse<Partial<PricingPlan>>>('/public/pricing')
  const items = Array.isArray(data?.items) ? data.items : []
  const plans = items
    .filter((item): item is Partial<PricingPlan> & { code: string } => typeof item?.code === 'string')
    .map((item) => {
      const durationValue = asNumber(item.durationValue, 1)
      const durationUnit = (item.durationUnit ?? 'months') as DurationUnit
      return {
        code: item.code,
        name: asString(item.name, item.code),
        durationValue,
        durationUnit,
        durationLabel: asString(item.durationLabel, formatDuration(durationValue, durationUnit)),
        priceCents: asNumber(item.priceCents),
        originalPriceCents:
          typeof item.originalPriceCents === 'number' ? item.originalPriceCents : null,
        isLifetime: Boolean(item.isLifetime),
        badge: typeof item.badge === 'string' && item.badge ? item.badge : null,
        description: asString(item.description),
        features: Array.isArray(item.features) ? item.features.filter((f): f is string => typeof f === 'string') : [],
      } satisfies PricingPlan
    })

  return plans.length > 0 ? plans : null
}

/** GET /public/downloads */
export async function fetchDownloads(): Promise<DownloadItem[] | null> {
  const { data } = await http.get<ListResponse<DownloadItem>>('/public/downloads')
  const items = Array.isArray(data?.items) ? data.items : []
  const filtered = items.filter((item) => item && typeof item.url === 'string' && item.enabled !== false)
  return filtered.length > 0 ? filtered : null
}

/** GET /public/releases?limit=20 */
export async function fetchReleases(limit = 20): Promise<ReleaseItem[] | null> {
  const { data } = await http.get<ListResponse<ReleaseItem>>('/public/releases', { params: { limit } })
  const items = Array.isArray(data?.items) ? data.items : []
  const filtered = items.filter((item) => item && typeof item.tag === 'string')
  return filtered.length > 0 ? filtered : null
}

export interface PurchaseIntentPayload {
  name: string
  contact: string
  contactType: 'wechat' | 'qq' | 'email' | 'phone' | 'other'
  planCode: string
  note?: string
}

/** POST /public/purchase-intents */
export async function submitPurchaseIntent(payload: PurchaseIntentPayload): Promise<{ id: number }> {
  const body: Record<string, string> = {
    name: payload.name.trim(),
    contact: payload.contact.trim(),
    contactType: payload.contactType,
    planCode: payload.planCode,
  }
  const note = payload.note?.trim()
  if (note) body.note = note

  const { data } = await http.post<{ id?: number }>('/public/purchase-intents', body)
  return { id: typeof data?.id === 'number' ? data.id : 0 }
}

/** 兜底数据集中导出，方便页面在请求失败时保持完整内容 */
export const FALLBACK = {
  site: FALLBACK_SITE,
  pricing: FALLBACK_PRICING,
  downloads: FALLBACK_DOWNLOADS,
  releases: FALLBACK_RELEASES,
}
