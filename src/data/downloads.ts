/** 桌面端下载项，结构对齐 deploy/CONTRACT.md 5.6 /public/downloads */
export interface DownloadItem {
  id: number
  name: string
  platform: 'windows' | 'macos' | 'linux' | string
  version: string
  url: string
  fileName: string
  sizeBytes: number
  sha256: string
  channel: 'cloudreve' | 'github' | 'other' | string
  isPrimary: boolean
  enabled: boolean
  sortOrder: number
  note: string | null
}

export interface PlatformMeta {
  label: string
  shortLabel: string
  hint: string
  order: number
}

export const PLATFORM_META: Record<string, PlatformMeta> = {
  windows: {
    label: 'Windows',
    shortLabel: 'Windows',
    hint: '适用于 Windows 10 / 11（64 位），安装包为 .exe。',
    order: 1,
  },
  macos: {
    label: 'macOS',
    shortLabel: 'macOS',
    hint: '按芯片选择安装包，Apple 芯片选 arm64，Intel 机型选 x64。',
    order: 2,
  },
  linux: {
    label: 'Linux',
    shortLabel: 'Linux',
    hint: '提供 AppImage 与 deb 两种格式，AppImage 免安装可直接运行。',
    order: 3,
  },
}

export const PLATFORM_ORDER = ['windows', 'macos', 'linux'] as const

const RELEASES_PAGE = 'https://github.com/YongHangPu/deploygo/releases/latest'

/**
 * 本地兜底下载数据。
 * 后端 /public/downloads 未就绪时使用；url 统一指向 GitHub Releases 页面，
 * 避免在预渲染阶段产出失效的直链。线上真实地址由后台 downloads 表下发。
 */
export const FALLBACK_DOWNLOADS: DownloadItem[] = [
  {
    id: 1,
    name: 'Windows 安装包',
    platform: 'windows',
    version: '1.1.3',
    url: RELEASES_PAGE,
    fileName: 'deploygo_1.1.3_x64-setup.exe',
    sizeBytes: 14_892_032,
    sha256: '3f9c1a7d5b2e4c8f0a6d1b3e5c7a9f2d4b6e8c0a2f4d6b8e0c2a4f6d8b0e2c4a',
    channel: 'github',
    isPrimary: true,
    enabled: true,
    sortOrder: 1,
    note: '推荐大多数用户下载',
  },
  {
    id: 2,
    name: 'macOS 安装包（Apple 芯片）',
    platform: 'macos',
    version: '1.1.3',
    url: RELEASES_PAGE,
    fileName: 'deploygo_1.1.3_aarch64.dmg',
    sizeBytes: 16_203_776,
    sha256: '7a2d4f6b8c0e1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c',
    channel: 'github',
    isPrimary: true,
    enabled: true,
    sortOrder: 2,
    note: 'M1 / M2 / M3 / M4 芯片',
  },
  {
    id: 3,
    name: 'macOS 安装包（Intel）',
    platform: 'macos',
    version: '1.1.3',
    url: RELEASES_PAGE,
    fileName: 'deploygo_1.1.3_x64.dmg',
    sizeBytes: 16_408_576,
    sha256: '9c1e3a5b7d9f2c4e6a8b0d2f4c6e8a0b2d4f6c8e0a2b4d6f8c0e2a4b6d8f0c2e',
    channel: 'github',
    isPrimary: false,
    enabled: true,
    sortOrder: 3,
    note: 'Intel 处理器机型',
  },
  {
    id: 4,
    name: 'Linux AppImage',
    platform: 'linux',
    version: '1.1.3',
    url: RELEASES_PAGE,
    fileName: 'deploygo_1.1.3_amd64.AppImage',
    sizeBytes: 15_728_640,
    sha256: '1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d',
    channel: 'github',
    isPrimary: true,
    enabled: true,
    sortOrder: 4,
    note: '免安装，赋予可执行权限后直接运行',
  },
  {
    id: 5,
    name: 'Linux deb 安装包',
    platform: 'linux',
    version: '1.1.3',
    url: RELEASES_PAGE,
    fileName: 'deploygo_1.1.3_amd64.deb',
    sizeBytes: 12_845_056,
    sha256: '5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f',
    channel: 'github',
    isPrimary: false,
    enabled: true,
    sortOrder: 5,
    note: 'Debian / Ubuntu 等发行版',
  },
]

export interface PlatformGroup {
  key: string
  label: string
  hint: string
  items: DownloadItem[]
}

function platformRank(platform: string): number {
  return PLATFORM_META[platform]?.order ?? 99
}

/** 按平台分组，组内 sortOrder 升序、主推项优先 */
export function groupDownloadsByPlatform(items: readonly DownloadItem[]): PlatformGroup[] {
  const enabled = items.filter((item) => item.enabled !== false)
  const groups = new Map<string, DownloadItem[]>()

  for (const item of enabled) {
    const key = item.platform || 'other'
    const bucket = groups.get(key)
    if (bucket) bucket.push(item)
    else groups.set(key, [item])
  }

  return [...groups.entries()]
    .map(([key, groupItems]) => {
      const meta = PLATFORM_META[key]
      return {
        key,
        label: meta?.label ?? key,
        hint: meta?.hint ?? '',
        items: [...groupItems].sort((a, b) => {
          if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1
          return a.sortOrder - b.sortOrder
        }),
      }
    })
    .sort((a, b) => platformRank(a.key) - platformRank(b.key))
}
