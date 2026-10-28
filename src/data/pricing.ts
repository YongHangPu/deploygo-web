import { formatDuration } from '@/utils/format'

export type DurationUnit = 'days' | 'months' | 'quarters' | 'years'

/** 套餐，结构对齐 deploy/CONTRACT.md 5.6 /public/pricing */
export interface PricingPlan {
  code: string
  name: string
  durationValue: number
  durationUnit: DurationUnit
  durationLabel: string
  priceCents: number
  originalPriceCents: number | null
  isLifetime: boolean
  badge: string | null
  description: string
  features: string[]
}

interface PlanSeed {
  code: string
  name: string
  durationValue: number
  durationUnit: DurationUnit
  priceCents: number
  originalPriceCents: number | null
  isLifetime?: boolean
  badge?: string
  description: string
  features: string[]
}

const SHARED_FEATURES = ['完整部署引擎（SSH 直连）', '零停机发布顺序', '版本历史与一键回滚', '重复发布拦截']

const PLAN_SEEDS: PlanSeed[] = [
  {
    code: 'monthly',
    name: '月付',
    durationValue: 1,
    durationUnit: 'months',
    priceCents: 1500,
    originalPriceCents: 1900,
    description: '先跑通完整发布链路，按月续费，随时可停。',
    features: [...SHARED_FEATURES, '单机授权，一码一机'],
  },
  {
    code: 'quarterly',
    name: '季付',
    durationValue: 3,
    durationUnit: 'months',
    priceCents: 3500,
    originalPriceCents: 4500,
    description: '一个季度内反复发版，折算下来更省一点。',
    features: [...SHARED_FEATURES, '单机授权，一码一机'],
  },
  {
    code: 'yearly',
    name: '年付',
    durationValue: 12,
    durationUnit: 'months',
    priceCents: 9900,
    originalPriceCents: 12900,
    badge: '推荐',
    description: '适合持续迭代的产品，一整年不用惦记授权。',
    features: [...SHARED_FEATURES, '单机授权，一码一机', '一年内的版本更新'],
  },
  {
    code: 'two_year',
    name: '两年',
    durationValue: 24,
    durationUnit: 'months',
    priceCents: 13900,
    originalPriceCents: 19800,
    description: '长期维护的项目，一次覆盖两个年度周期。',
    features: [...SHARED_FEATURES, '单机授权，一码一机', '两年内的版本更新'],
  },
  {
    code: 'three_year',
    name: '三年',
    durationValue: 36,
    durationUnit: 'months',
    priceCents: 16900,
    originalPriceCents: 29700,
    description: '交付周期长的项目，把授权成本压到最低。',
    features: [...SHARED_FEATURES, '单机授权，一码一机', '三年内的版本更新'],
  },
  {
    code: 'lifetime',
    name: '永久版',
    durationValue: 100,
    durationUnit: 'years',
    priceCents: 19900,
    originalPriceCents: 39900,
    isLifetime: true,
    badge: '一次买断',
    description: '一次买断，授权长期有效，适合长期自用。',
    features: [...SHARED_FEATURES, '单机授权，一码一机', '授权长期有效'],
  },
]

/** 本地兜底套餐数据；页面挂载后再用 /public/pricing 覆盖 */
export const FALLBACK_PRICING: PricingPlan[] = PLAN_SEEDS.map((seed) => ({
  code: seed.code,
  name: seed.name,
  durationValue: seed.durationValue,
  durationUnit: seed.durationUnit,
  durationLabel: formatDuration(seed.durationValue, seed.durationUnit),
  priceCents: seed.priceCents,
  originalPriceCents: seed.originalPriceCents,
  isLifetime: seed.isLifetime ?? false,
  badge: seed.badge ?? null,
  description: seed.description,
  features: seed.features,
}))

/** 首页定价预览挑选的三个套餐 */
export const PREVIEW_PLAN_CODES = ['monthly', 'yearly', 'lifetime'] as const

export function findPlan(plans: readonly PricingPlan[], code: string): PricingPlan | undefined {
  return plans.find((plan) => plan.code === code)
}

/** 判断是否存在需要划掉的原价 */
export function hasOriginalPrice(plan: PricingPlan): boolean {
  return typeof plan.originalPriceCents === 'number' && plan.originalPriceCents > plan.priceCents
}
