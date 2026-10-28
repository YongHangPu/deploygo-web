/** 更新日志条目，结构对齐 deploy/CONTRACT.md 5.6 /public/releases */
export interface ReleaseItem {
  id: number
  source: 'manual' | 'github' | string
  tag: string
  name: string | null
  body: string
  publishedAt: string | null
  htmlUrl: string | null
  prerelease: boolean
  draft: boolean
}

const REPO_RELEASES = 'https://github.com/YongHangPu/deploygo/releases'

/**
 * 本地兜底更新日志，内容取自 deploygo 仓库 CHANGELOG.md。
 * 构建时后端不可用也必须产出完整 HTML，因此这里保留最近 5 个版本的正文。
 */
export const FALLBACK_RELEASES: ReleaseItem[] = [
  {
    id: 101,
    source: 'manual',
    tag: 'v1.1.3',
    name: 'v1.1.3',
    publishedAt: '2026-09-14T09:00:00.000Z',
    htmlUrl: `${REPO_RELEASES}/tag/v1.1.3`,
    prerelease: false,
    draft: false,
    body: [
      '- 修复点击「下载并安装」报错「Cannot read private member from an object whose class did not declare it」：更新实例内部私有字段被响应式代理破坏，导致更新无法下载，现改用浅响应保存原始实例',
      '- 更新提示更快弹出：启动后立即检查更新，不再人为等待 5 秒',
    ].join('\n'),
  },
  {
    id: 102,
    source: 'manual',
    tag: 'v1.1.2',
    name: 'v1.1.2',
    publishedAt: '2026-09-14T03:00:00.000Z',
    htmlUrl: `${REPO_RELEASES}/tag/v1.1.2`,
    prerelease: false,
    draft: false,
    body: [
      '- 修复部署日志中 tar「时间戳是未来的」警告被误标为红色错误：该警告源于打包机与服务器时钟偏移，退出码为 0、不影响部署结果，现降级为黄色提示展示',
      '- 远端解压优化：文件时间改用服务器解压时刻，打包机与服务器时钟偏差无论多大都不再触发该警告，服务器侧文件时间也更符合版本上线时刻的语义',
    ].join('\n'),
  },
  {
    id: 103,
    source: 'manual',
    tag: 'v1.1.1',
    name: 'v1.1.1',
    publishedAt: '2026-09-14T01:30:00.000Z',
    htmlUrl: `${REPO_RELEASES}/tag/v1.1.1`,
    prerelease: false,
    draft: false,
    body: [
      '- 修复应用内自动更新失效：官方版构建缺少更新器配置的编译期变量，导致更新检查被静默跳过。受影响的旧版本需手动下载安装本次更新，之后即可恢复正常自动更新',
      '- 应用内更新检查新增 6 小时低频轮询：长时间挂着的实例也能收到新版本提示',
      '- 演示页与 README 新增「下载桌面端」入口，官方完整版获取更直接',
      '- 发布流程优化：更新弹窗的更新说明改用 CHANGELOG 对应版本小节，发布后自动清理更新器中的旧版本更新包',
    ].join('\n'),
  },
  {
    id: 104,
    source: 'manual',
    tag: 'v1.1.0',
    name: 'v1.1.0',
    publishedAt: '2026-09-12T08:00:00.000Z',
    htmlUrl: `${REPO_RELEASES}/tag/v1.1.0`,
    prerelease: false,
    draft: false,
    body: [
      '- 服务器配置页新增凭证安全说明：在输入密码 / 口令的位置明确告知加密存储与 SSH 直连机制',
      '- 新增 README「安全设计」章节与威胁模型边界说明',
      '- 更新通知组件下载改用规范文件名，下载后无需手动改名',
      '- 引导页响应式布局优化，并新增仓库链接',
    ].join('\n'),
  },
  {
    id: 105,
    source: 'manual',
    tag: 'v1.0.0',
    name: 'v1.0.0',
    publishedAt: '2026-09-10T06:00:00.000Z',
    htmlUrl: `${REPO_RELEASES}/tag/v1.0.0`,
    prerelease: false,
    draft: false,
    body: [
      '- 首个开源版本发布：桌面端完整界面与零停机发布方案文档',
      '- 五种框架更新通知组件（Vue 3 / Vue 2 / React / Angular / Svelte）与纯 JS 版本',
      '- 应用内自动更新',
      '- 凭证安全：AES-256-GCM 加密存储、Argon2id 加密备份导出、日志脱敏',
    ].join('\n'),
  },
]

/** 把正文按行拆成可渲染的段落 / 列表项，去掉 Markdown 加粗标记 */
export function parseReleaseBody(body: string): { type: 'bullet' | 'paragraph'; text: string }[] {
  return (body ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const text = line.replaceAll('**', '').replace(/^[-*]\s+/, '').trim()
      const isBullet = /^[-*]\s+/.test(line)
      return { type: isBullet ? ('bullet' as const) : ('paragraph' as const), text }
    })
}
