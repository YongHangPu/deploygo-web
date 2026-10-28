import { describe, expect, it } from 'vitest'
import {
  contactTypeLabel,
  durationInMonths,
  formatBytes,
  formatDate,
  formatDateLabel,
  formatDateTime,
  formatDuration,
  formatPriceCents,
  formatPriceCompact,
  formatPriceCycle,
  formatVersionTag,
  monthlyEquivalentCents,
  shortenHash,
} from '@/utils/format'

describe('价格格式化（分 → 元）', () => {
  it('保留两位小数', () => {
    expect(formatPriceCents(1500)).toBe('¥15.00')
    expect(formatPriceCents(9900)).toBe('¥99.00')
    expect(formatPriceCents(19900)).toBe('¥199.00')
    expect(formatPriceCents(1550)).toBe('¥15.50')
  })

  it('异常输入回退为 0', () => {
    expect(formatPriceCents(Number.NaN)).toBe('¥0.00')
    expect(formatPriceCents(-100)).toBe('¥-1.00')
  })

  it('紧凑展示在整数分时去掉小数', () => {
    expect(formatPriceCompact(9900)).toBe('¥99')
    expect(formatPriceCompact(1500)).toBe('¥15')
    expect(formatPriceCompact(1550)).toBe('¥15.50')
    expect(formatPriceCompact(0)).toBe('¥0')
  })
})

describe('时长格式化', () => {
  it('对齐契约中的 durationLabel 约定', () => {
    expect(formatDuration(1, 'months')).toBe('1 个月')
    expect(formatDuration(3, 'months')).toBe('3 个月')
    expect(formatDuration(12, 'months')).toBe('1 年')
    expect(formatDuration(24, 'months')).toBe('2 年')
    expect(formatDuration(36, 'months')).toBe('3 年')
    expect(formatDuration(100, 'years')).toBe('永久')
  })

  it('支持 days / quarters / years', () => {
    expect(formatDuration(30, 'days')).toBe('30 天')
    expect(formatDuration(2, 'quarters')).toBe('6 个月')
    expect(formatDuration(4, 'quarters')).toBe('1 年')
    expect(formatDuration(1, 'years')).toBe('1 年')
    expect(formatDuration(1, 'unknown-unit')).toBe('1 个月')
  })

  it('时长换算为月数', () => {
    expect(durationInMonths(1, 'months')).toBe(1)
    expect(durationInMonths(2, 'quarters')).toBe(6)
    expect(durationInMonths(1, 'years')).toBe(12)
    expect(durationInMonths(30, 'days')).toBeNull()
  })

  it('折算每月价格，永久版返回 null', () => {
    expect(monthlyEquivalentCents(9900, 12, 'months')).toBe(825)
    expect(monthlyEquivalentCents(3500, 3, 'months')).toBe(1167)
    expect(monthlyEquivalentCents(19900, 100, 'years')).toBeNull()
    expect(monthlyEquivalentCents(1500, 1, 'months')).toBe(1500)
  })

  it('价格周期文案', () => {
    expect(formatPriceCycle(1, 'months')).toBe('每月')
    expect(formatPriceCycle(3, 'months')).toBe('每季度')
    expect(formatPriceCycle(12, 'months')).toBe('每年')
    expect(formatPriceCycle(24, 'months')).toBe('每 2 年')
    expect(formatPriceCycle(36, 'months')).toBe('每 3 年')
    expect(formatPriceCycle(100, 'years')).toBe('一次买断')
    expect(formatPriceCycle(30, 'days')).toBe('每 30 天')
  })
})

describe('日期格式化（UTC，保证预渲染与客户端一致）', () => {
  it('格式化为日期、时间线与日期时间', () => {
    expect(formatDate('2026-09-14T09:00:00.000Z')).toBe('2026-09-14')
    expect(formatDateLabel('2026-09-14T09:00:00.000Z')).toBe('2026.09.14')
    expect(formatDateTime('2026-09-14T09:07:00.000Z')).toBe('2026-09-14 09:07')
  })

  it('空值与非法值返回空字符串', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('not-a-date')).toBe('')
    expect(formatDateLabel('')).toBe('')
    expect(formatDateTime('')).toBe('')
  })
})

describe('其它展示格式化', () => {
  it('字节大小', () => {
    expect(formatBytes(0)).toBe('未知大小')
    expect(formatBytes(null)).toBe('未知大小')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(14_892_032)).toBe('14.2 MB')
  })

  it('sha256 缩略', () => {
    const hash = 'a'.repeat(64)
    expect(shortenHash(hash)).toBe(`${'a'.repeat(12)}…`)
    expect(shortenHash('abcdef')).toBe('abcdef')
    expect(shortenHash('')).toBe('未提供')
  })

  it('版本号补 v 前缀', () => {
    expect(formatVersionTag('1.1.3')).toBe('v1.1.3')
    expect(formatVersionTag('v1.1.3')).toBe('v1.1.3')
    expect(formatVersionTag('')).toBe('')
  })

  it('联系类型中文标签', () => {
    expect(contactTypeLabel('wechat')).toBe('微信')
    expect(contactTypeLabel('qq')).toBe('QQ')
    expect(contactTypeLabel('email')).toBe('邮箱')
    expect(contactTypeLabel('phone')).toBe('手机号')
    expect(contactTypeLabel('unknown')).toBe('其他')
  })
})
