/**
 * 展示层格式化工具。
 *
 * 规则来自 deploy/CONTRACT.md：
 * - 金额以「分」传输，展示为 ¥xx.xx
 * - durationLabel：1 → 1 个月，12 → 1 年，100 years → 永久
 * - 时间统一 ISO 8601 UTC，展示时按 UTC 格式化，保证预渲染与客户端输出一致
 */

const PRICE_UNIT = '¥'

/** 分 → ¥xx.xx（保留两位小数） */
export function formatPriceCents(cents: number): string {
  const safe = Number.isFinite(cents) ? Math.round(cents) : 0
  return `${PRICE_UNIT}${(safe / 100).toFixed(2)}`
}

/** 分 → ¥xx（整数分金额去掉小数，用于定价卡这类大字号展示） */
export function formatPriceCompact(cents: number): string {
  const safe = Number.isFinite(cents) ? Math.round(cents) : 0
  if (safe % 100 === 0) return `${PRICE_UNIT}${safe / 100}`
  return `${PRICE_UNIT}${(safe / 100).toFixed(2)}`
}

/** 把时长换算为月数，无法换算（days / 永久）时返回 null */
export function durationInMonths(value: number, unit: string): number | null {
  const safe = Math.max(1, Math.round(value))
  switch (unit) {
    case 'months':
      return safe
    case 'quarters':
      return safe * 3
    case 'years':
      return safe * 12
    default:
      return null
  }
}

/**
 * 时长中文标签，对齐契约里的 durationLabel：
 * 1 month → 1 个月，3 months → 3 个月，12 months → 1 年，100 years → 永久
 */
export function formatDuration(value: number, unit: string): string {
  const safe = Math.max(1, Math.round(value))
  if (unit === 'years' && safe >= 100) return '永久'
  if (unit === 'days') return `${safe} 天`
  if (unit === 'quarters') {
    const months = safe * 3
    return months % 12 === 0 ? `${months / 12} 年` : `${months} 个月`
  }
  if (unit === 'years') return `${safe} 年`
  if (unit === 'months') {
    return safe % 12 === 0 ? `${safe / 12} 年` : `${safe} 个月`
  }
  return `${safe} 个月`
}

/** 折算每月价格（分）；永久版或按天售卖返回 null */
export function monthlyEquivalentCents(priceCents: number, value: number, unit: string): number | null {
  if (unit === 'years' && value >= 100) return null
  const months = durationInMonths(value, unit)
  if (!months) return null
  return Math.round(priceCents / months)
}

/** 价格周期的口语化写法：每月 / 每季度 / 每年 / 每 2 年 / 一次买断 */
export function formatPriceCycle(value: number, unit: string): string {
  const safe = Math.max(1, Math.round(value))
  if (unit === 'years' && safe >= 100) return '一次买断'
  if (unit === 'days') return `每 ${safe} 天`
  if (unit === 'quarters') return safe === 1 ? '每季度' : `每 ${safe} 个季度`
  if (unit === 'years') return safe === 1 ? '每年' : `每 ${safe} 年`
  if (unit === 'months') {
    if (safe === 1) return '每月'
    if (safe === 3) return '每季度'
    if (safe === 12) return '每年'
    return safe % 12 === 0 ? `每 ${safe / 12} 年` : `每 ${safe} 个月`
  }
  return `每 ${safe} 个月`
}

/** ISO 时间 → YYYY-MM-DD（UTC） */
export function formatDate(iso: string | null | undefined): string {
  const date = parseDate(iso)
  if (!date) return ''
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

/** ISO 时间 → YYYY.MM.DD（UTC，时间线用） */
export function formatDateLabel(iso: string | null | undefined): string {
  const value = formatDate(iso)
  return value ? value.replaceAll('-', '.') : ''
}

/** ISO 时间 → YYYY-MM-DD HH:mm（UTC） */
export function formatDateTime(iso: string | null | undefined): string {
  const date = parseDate(iso)
  if (!date) return ''
  return `${formatDate(iso)} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

/** 字节数 → 人类可读大小，保留一位小数 */
export function formatBytes(bytes: number | null | undefined): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '未知大小'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  const digits = value >= 100 || index === 0 ? 0 : 1
  return `${value.toFixed(digits)} ${units[index]}`
}

/** sha256 长串缩略展示 */
export function shortenHash(hash: string, keep = 12): string {
  const value = (hash ?? '').trim()
  if (!value) return '未提供'
  if (value.length <= keep + 6) return value
  return `${value.slice(0, keep)}…`
}

/** 版本号：v1.1.3 / 1.1.3 统一带 v 前缀 */
export function formatVersionTag(tag: string): string {
  const value = (tag ?? '').trim()
  if (!value) return ''
  return value.startsWith('v') ? value : `v${value}`
}

/** 联系方式按类型展示 */
export function contactTypeLabel(type: string): string {
  const map: Record<string, string> = {
    wechat: '微信',
    qq: 'QQ',
    email: '邮箱',
    phone: '手机号',
    other: '其他',
  }
  return map[type] ?? '其他'
}

function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
