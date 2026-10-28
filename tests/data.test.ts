import { describe, expect, it } from 'vitest'
import { FALLBACK_DOWNLOADS, groupDownloadsByPlatform } from '@/data/downloads'
import { FALLBACK_PRICING, PREVIEW_PLAN_CODES, findPlan, hasOriginalPrice } from '@/data/pricing'
import { FALLBACK_RELEASES, parseReleaseBody } from '@/data/releases'
import { FAQ_GROUPS, buildFaqPageJsonLd, flattenFaq, pickFaqItems } from '@/data/faq'
import { COMPONENT_TEMPLATES } from '@/data/templates'
import { MOUNT_SNIPPETS } from '@/data/snippets'
import { formatDuration } from '@/utils/format'

describe('套餐 fallback 数据', () => {
  it('与契约中的 6 个套餐一一对应', () => {
    expect(FALLBACK_PRICING).toHaveLength(6)
    expect(FALLBACK_PRICING.map((plan) => plan.code)).toEqual([
      'monthly',
      'quarterly',
      'yearly',
      'two_year',
      'three_year',
      'lifetime',
    ])
  })

  it('价格与契约一致（单位：分）', () => {
    const prices = Object.fromEntries(FALLBACK_PRICING.map((plan) => [plan.code, plan.priceCents]))
    expect(prices).toMatchObject({
      monthly: 1500,
      quarterly: 3500,
      yearly: 9900,
      two_year: 13900,
      three_year: 16900,
      lifetime: 19900,
    })
  })

  it('durationLabel 与时长换算保持一致', () => {
    for (const plan of FALLBACK_PRICING) {
      expect(plan.durationLabel).toBe(formatDuration(plan.durationValue, plan.durationUnit))
      expect(plan.features.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('永久版标记正确，推荐套餐带 badge', () => {
    const lifetime = findPlan(FALLBACK_PRICING, 'lifetime')
    expect(lifetime?.isLifetime).toBe(true)
    expect(lifetime?.durationValue).toBe(100)
    expect(lifetime?.durationUnit).toBe('years')
    expect(lifetime?.durationLabel).toBe('永久')

    const yearly = findPlan(FALLBACK_PRICING, 'yearly')
    expect(yearly?.badge).toBe('推荐')
    expect(yearly).toBeDefined()
    if (yearly) expect(hasOriginalPrice(yearly)).toBe(true)
  })

  it('首页预览的套餐 code 都真实存在', () => {
    for (const code of PREVIEW_PLAN_CODES) {
      expect(findPlan(FALLBACK_PRICING, code)).toBeDefined()
    }
  })
})

describe('下载 fallback 数据', () => {
  it('覆盖三个平台且包含主推项', () => {
    expect(FALLBACK_DOWNLOADS.length).toBeGreaterThanOrEqual(3)
    const platforms = new Set(FALLBACK_DOWNLOADS.map((item) => item.platform))
    expect(platforms).toEqual(new Set(['windows', 'macos', 'linux']))
    expect(FALLBACK_DOWNLOADS.some((item) => item.isPrimary)).toBe(true)
  })

  it('每项都有合法 sha256 与下载地址', () => {
    for (const item of FALLBACK_DOWNLOADS) {
      expect(item.sha256).toMatch(/^[0-9a-f]{64}$/)
      expect(item.url.startsWith('https://')).toBe(true)
      expect(item.fileName.length).toBeGreaterThan(0)
      expect(item.sizeBytes).toBeGreaterThan(0)
      expect(item.version.length).toBeGreaterThan(0)
    }
  })

  it('按平台分组时顺序固定、主推项排在前面', () => {
    const groups = groupDownloadsByPlatform(FALLBACK_DOWNLOADS)
    expect(groups.map((group) => group.key)).toEqual(['windows', 'macos', 'linux'])
    for (const group of groups) {
      const firstPrimaryIndex = group.items.findIndex((item) => item.isPrimary)
      if (firstPrimaryIndex >= 0) expect(firstPrimaryIndex).toBe(0)
    }
    expect(groups.flatMap((group) => group.items)).toHaveLength(FALLBACK_DOWNLOADS.length)
  })

  it('禁用项不参与分组', () => {
    const groups = groupDownloadsByPlatform([
      ...FALLBACK_DOWNLOADS,
      { ...FALLBACK_DOWNLOADS[0]!, id: 99, enabled: false },
    ])
    expect(groups.flatMap((group) => group.items).some((item) => item.id === 99)).toBe(false)
  })
})

describe('更新日志 fallback 数据', () => {
  it('按发布时间倒序，tag 唯一', () => {
    const times = FALLBACK_RELEASES.map((item) => new Date(item.publishedAt ?? 0).getTime())
    expect([...times].sort((a, b) => b - a)).toEqual(times)
    expect(new Set(FALLBACK_RELEASES.map((item) => item.tag)).size).toBe(FALLBACK_RELEASES.length)
  })

  it('正文可以解析为列表项', () => {
    const lines = parseReleaseBody(FALLBACK_RELEASES[0]?.body ?? '')
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.every((line) => line.text.length > 0)).toBe(true)
    expect(lines.some((line) => line.type === 'bullet')).toBe(true)
    expect(parseReleaseBody('')).toEqual([])
  })
})

describe('FAQ 数据与结构化数据', () => {
  it('分组与问题 id 全局唯一', () => {
    const ids = flattenFaq().map((item) => item.id)
    expect(ids.length).toBeGreaterThan(10)
    expect(new Set(ids).size).toBe(ids.length)
    for (const group of FAQ_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0)
      expect(group.title.length).toBeGreaterThan(0)
    }
  })

  it('每个问题都有完整问答文案', () => {
    for (const item of flattenFaq()) {
      expect(item.question.length).toBeGreaterThan(4)
      expect(item.answer.length).toBeGreaterThan(20)
    }
  })

  it('pickFaqItems 保持传入顺序并忽略不存在的 id', () => {
    const picked = pickFaqItems(['payment', 'not-exist', 'component'])
    expect(picked.map((item) => item.id)).toEqual(['payment', 'component'])
  })

  it('FAQPage JSON-LD 结构正确', () => {
    const jsonLd = buildFaqPageJsonLd()
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('FAQPage')
    const entities = jsonLd.mainEntity as { name: string; acceptedAnswer: { text: string } }[]
    expect(entities).toHaveLength(flattenFaq().length)
    expect(entities[0]?.acceptedAnswer.text.length).toBeGreaterThan(10)
  })
})

describe('更新通知组件模板', () => {
  it('8 个文件全部存在且 key 唯一', () => {
    expect(COMPONENT_TEMPLATES).toHaveLength(8)
    expect(new Set(COMPONENT_TEMPLATES.map((template) => template.key)).size).toBe(8)
  })

  it('每个模板都有源码与挂载示例', () => {
    for (const template of COMPONENT_TEMPLATES) {
      expect(template.source.length).toBeGreaterThan(500)
      expect(template.sizeBytes).toBeGreaterThan(500)
      expect(template.downloadName.length).toBeGreaterThan(0)
      expect(MOUNT_SNIPPETS[template.key]).toBeTruthy()
      expect(MOUNT_SNIPPETS[template.key].length).toBeGreaterThan(20)
    }
  })

  it('覆盖 Vue 3 / Vue 2 / React / Angular / Svelte / 纯 JS 六个框架', () => {
    const frameworks = new Set(COMPONENT_TEMPLATES.map((template) => template.framework))
    expect(frameworks).toEqual(new Set(['vue3', 'vue2', 'react', 'angular', 'svelte', 'js']))
  })
})
