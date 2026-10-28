/**
 * 官网文案与结构化内容。
 *
 * 事实来源：deploygo/README.md、deploygo/PRODUCT_COPY.md、deploygo/src/DemoApp.vue。
 * 这里只放可被多个页面复用、或需要保持顺序的内容；页面独占的说明文字写在各自的视图里。
 */

export interface Capability {
  id: string
  title: string
  summary: string
  points: string[]
}

/** 首页核心能力 6 项 */
export const CAPABILITIES: Capability[] = [
  {
    id: 'one-click',
    title: '一键部署',
    summary: '构建完成后点一次，剩下的产品自己做完：识别构建目录、生成版本信息、上传产物、执行远端发布。',
    points: ['自动识别最终构建目录', '自动生成 release 名称与 version.json', '上传后按内置顺序完成发布'],
  },
  {
    id: 'zero-downtime',
    title: '零停机发布顺序',
    summary: '静态资源、index.html、version.json 三步固定顺序，发布过程中旧页面始终有可用资源，不会白屏。',
    points: ['先资源后入口', '顺序不可调换', '任一步失败都不影响线上'],
  },
  {
    id: 'history',
    title: '版本历史与回滚',
    summary: '每次发布都写入历史：版本号、文件数量、大小、耗时与完整日志。出问题时回到历史版本点一次回滚。',
    points: ['保留版本数可配置', '回滚复用同一套发布流程', '日志可完整回看'],
  },
  {
    id: 'duplicate-guard',
    title: '重复发布拦截',
    summary: '产物指纹与最近一次发布完全一致时直接拦截，避免同一份产物被反复上线，也避免无意义的版本记录。',
    points: ['基于产物内容比对', '拦截时给出明确提示', '需要重新构建后才能再次发布'],
  },
  {
    id: 'vault',
    title: '凭证本地加密',
    summary: '服务器密码与密钥口令用 AES-256-GCM 加密后写入本地数据库，导出备份再用 Argon2id 派生密钥加密。',
    points: ['随机 nonce + 认证标签', '密钥只存在本机', '日志与调试输出脱敏'],
  },
  {
    id: 'frontend-semantics',
    title: '面向前端静态项目的发布语义',
    summary: '围绕 index.html、version.json 与带 hash 的静态资源设计，而不是把后端服务的发布逻辑套到静态站点上。',
    points: ['入口文件与资源分开处理', '版本感知由通知组件完成', '框架无关，产物存在即可'],
  },
]

export interface FlowStep {
  index: string
  title: string
  summary: string
  detail: string
}

/** 三步接入 */
export const FLOW_STEPS: FlowStep[] = [
  {
    index: '01',
    title: '挂载通知组件',
    summary: '从 8 个框架版本里挑一个，放进业务项目并挂载到根组件。',
    detail: '组件负责轮询线上 version.json，发现新版本时提示用户刷新，不依赖 deploygo 桌面端。',
  },
  {
    index: '02',
    title: '按原方式构建',
    summary: 'npm run build、pnpm build、yarn build，都按你原来的流程走。',
    detail: 'deploygo 不接管构建，只读取构建产物目录，因此不需要改流水线或新增构建插件。',
  },
  {
    index: '03',
    title: '桌面端一键部署',
    summary: '服务器与项目配置一次，之后每次发版就是构建加点击。',
    detail: '发布历史、重复发布拦截、回滚都在同一个界面里，不用再手写 SSH 命令。',
  },
]

export interface ReleasePhase {
  index: string
  title: string
  summary: string
  effect: string
}

/** 零停机发布顺序的 3 个阶段 */
export const RELEASE_PHASES: ReleasePhase[] = [
  {
    index: '1',
    title: '同步静态资源',
    summary: '把新的带 hash 资源先传到本次 release 目录，index.html 与 version.json 暂不处理。',
    effect: '线上页面没有任何变化，旧入口仍然指向旧资源，继续可用。',
  },
  {
    index: '2',
    title: '替换 index.html',
    summary: '入口文件原子替换，让新访客进入新版本；已经打开的页面继续使用已加载的资源。',
    effect: '新版本开始生效，旧页面不会因为资源被替换而白屏。',
  },
  {
    index: '3',
    title: '替换 version.json',
    summary: '最后写入版本号，在线页面的更新通知组件轮询到变化后提示用户刷新。',
    effect: '版本切换由用户主动刷新完成，而不是被强制打断。',
  },
]

/** 适用项目 */
export const FIT_ITEMS: string[] = [
  'Vue 2 / Vue 3 / React / Angular / Svelte 构建出的 SPA',
  'Vite、Webpack、Vue CLI、Create React App 等工具产出的静态站点',
  '构建产物带 hash 资源名，通过 Nginx 或类似静态服务托管',
  '后台管理系统、活动页、产品官网这类需要频繁发版的入口',
  '没有专职 DevOps，但希望发版稳定、可回滚的小团队',
  '需要保留历史版本、随时退回上一版的交付项目',
]

/** 暂不适合的项目 */
export const UNFIT_ITEMS: string[] = [
  'SSR 服务端渲染项目，需要 Node 进程常驻运行',
  '不产出静态入口文件的项目',
  '发布时必须立即清空旧资源的场景',
  '没有 hash 资源名、缓存策略也不可控的项目',
  '需要多环境编排、灰度发布这类重型发布流程的团队',
]

/** 条件支持的项目 */
export const CONDITIONAL_ITEMS: string[] = [
  'Next.js 静态导出（output: export）',
  'Nuxt 静态生成',
  'Astro 静态站点',
  '其他支持静态导出的前端框架',
]

export interface SupportCell {
  text: string
  included: boolean
}

export interface CompareRow {
  label: string
  openSource: SupportCell
  full: SupportCell
}

/** 开源版 vs 完整版 */
export const OPEN_SOURCE_COMPARISON: CompareRow[] = [
  {
    label: '桌面端界面实现（Vue 3 + Naive UI + Pinia）',
    openSource: { text: '完整包含', included: true },
    full: { text: '与开源仓库同源', included: true },
  },
  {
    label: '8 个框架的更新通知组件',
    openSource: { text: '完整包含，可独立使用', included: true },
    full: { text: '完整包含', included: true },
  },
  {
    label: '零停机发布方案与目录约定文档',
    openSource: { text: '完整包含', included: true },
    full: { text: '完整包含', included: true },
  },
  {
    label: 'Rust 后端架构骨架（契约层 + 桩实现）',
    openSource: { text: '完整包含', included: true },
    full: { text: '完整实现', included: true },
  },
  {
    label: '部署引擎：SSH 连接、上传、原子发布、回滚',
    openSource: { text: '不包含', included: false },
    full: { text: '内置', included: true },
  },
  {
    label: '授权与试用系统',
    openSource: { text: '不包含', included: false },
    full: { text: '内置', included: true },
  },
  {
    label: '自行构建得到的结果',
    openSource: { text: '开源展示版：可浏览界面，部署操作引导下载完整版', included: false },
    full: { text: '官方分发的完整版', included: true },
  },
  {
    label: '分发方式',
    openSource: { text: 'GitHub / Gitee 仓库，MIT 协议', included: true },
    full: { text: 'GitHub Releases，含 90 天免费试用', included: true },
  },
]

export interface SecurityItem {
  id: string
  title: string
  summary: string
  detail: string
}

/** 安全设计 4 项 */
export const SECURITY_ITEMS: SecurityItem[] = [
  {
    id: 'local-only',
    title: '无云端架构',
    summary: '纯本地桌面应用，不内置任何远端服务。',
    detail: '凭证与部署流量只在你自己的电脑与服务器之间通过 SSH 直连，不经过任何第三方服务器。',
  },
  {
    id: 'aes',
    title: 'AES-256-GCM 加密存储',
    summary: '密码与密钥口令加密后写入本地数据库。',
    detail: '每次加密使用随机 nonce 与认证标签；解密密钥保存在本机用户数据目录，Unix 下权限为 0600。',
  },
  {
    id: 'argon2',
    title: 'Argon2id 加密备份',
    summary: '凭证导出文件需要口令才能还原。',
    detail: '用 Argon2id 派生密钥，再用 AES-256-GCM 加密导出文件；不设置密码无法导出，文件泄露也无法直接还原凭证。',
  },
  {
    id: 'zeroize',
    title: '内存清零与日志脱敏',
    summary: '敏感数据用完就擦掉，日志里不会出现口令。',
    detail: '密码与派生密钥使用后立即从内存擦除（zeroize）；部署日志与调试输出不包含任何密码、口令字段。',
  },
]

export const THREAT_MODEL_NOTE =
  '加密密钥保存在本机，因此能完全控制你电脑的攻击者理论上可以还原凭证。这是所有本地加密工具的共同边界，deploygo 不做例外声明。请避免在共享或不受信任的设备上保存生产凭证；删除应用数据目录即可彻底删除全部凭证。'

/** 功能页：逐项展开的能力 */
export interface FeatureSection {
  id: string
  title: string
  summary: string
  points: string[]
}

export const FEATURE_SECTIONS: FeatureSection[] = [
  {
    id: 'deploy',
    title: '一键部署',
    summary:
      '把「构建完还要手动传文件」这一段彻底去掉。选择项目、点击部署，deploygo 自动完成产物识别、版本准备、上传与发布。',
    points: [
      '识别真实构建目录，dist 外层包裹了别的目录也能找到最终产物',
      '自动生成 release 名称与 version.json，不需要手工维护版本号',
      '在远端自动创建 live_root、releases_root 与备份目录',
      '上传完成后按内置顺序发布，并把结果写入部署历史',
      '拦截重复发布：同一份产物不允许重复上线',
    ],
  },
  {
    id: 'release-semantics',
    title: '零停机发布语义',
    summary:
      '发布顺序是固定方案而不是个人经验：静态资源先走，入口文件第二步，版本号最后一步。这个顺序决定了发布期间页面不会白屏。',
    points: [
      '第一步同步静态资源，此时旧入口仍指向旧资源，互不干扰',
      '第二步原子替换 index.html，新访客进入新版本',
      '第三步写入 version.json，在线页面通过通知组件感知并提示刷新',
      '任意一步失败都不会破坏当前线上版本，重试即可',
      'live 软链与 release 目录分离，回滚只是重新指向一个历史 release',
    ],
  },
  {
    id: 'rollback',
    title: '版本历史与回滚',
    summary:
      '每次发布都是一条可查的记录：版本号、文件数量、体积、耗时、完整日志。需要退回时不用 ssh 上服务器翻目录。',
    points: [
      '按项目、服务器、状态、时间范围筛选发布记录',
      '保留版本数可配置，超出数量的旧版本自动清理',
      '回滚复用内置发布流程，不依赖服务器上预先放置的脚本',
      '回滚同样写入历史，谁在什么时候退回了哪个版本一目了然',
    ],
  },
  {
    id: 'guard',
    title: '重复发布拦截',
    summary:
      '同一份产物被重复部署是前端发版里最常见的无效操作。deploygo 会对产物做内容比对，指纹一致时直接拦截。',
    points: [
      '比对发生在发布准备阶段，不会产生多余的上传流量',
      '拦截时明确提示「与最近一次发布内容一致」',
      '需要重新构建、改变产物内容后才能再次发布',
      '避免历史里堆满内容完全相同的版本记录',
    ],
  },
  {
    id: 'cache',
    title: '缓存策略与版本感知',
    summary:
      '更新提示不出现，九成是缓存策略问题。deploygo 的文档给出了可直接复制的 Nginx 配置，组件侧则用轮询兜住感知。',
    points: [
      'index.html 与 version.json 禁止强缓存，必须每次回源',
      '带 hash 的静态资源可以设置一年 immutable',
      '更新通知组件默认每 60 秒轮询一次 version.json',
      '页面重新可见时会补一次检查，长时间挂着也不会漏掉版本',
    ],
  },
  {
    id: 'security',
    title: '凭证安全与日志',
    summary:
      '部署工具手握服务器凭证，安全设计围绕「凭证不离开本机」展开，并且在日志层面保持克制。',
    points: [
      'AES-256-GCM 加密存储，随机 nonce 与认证标签',
      'Argon2id 派生密钥加密备份导出文件',
      '密码与派生密钥使用后立即从内存擦除',
      '日志与调试输出不包含密码、口令字段',
    ],
  },
]

export interface CacheRule {
  path: string
  header: string
  reason: string
}

/** 缓存建议表格 */
export const CACHE_RULES: CacheRule[] = [
  {
    path: '/index.html',
    header: 'no-store, no-cache, must-revalidate',
    reason: '入口文件必须每次回源，否则新版本无法生效',
  },
  {
    path: '/version.json',
    header: 'no-store, no-cache, must-revalidate',
    reason: '更新通知组件依赖它判断版本是否变化',
  },
  {
    path: '/assets/*（带 hash）',
    header: 'public, max-age=31536000, immutable',
    reason: '内容变化即改名，可以长期缓存',
  },
  {
    path: '其他静态文件（无 hash）',
    header: 'public, max-age=3600',
    reason: '没有文件名指纹，需要折中并配合 CDN 刷新',
  },
]

export interface FrameworkRow {
  framework: string
  tooling: string
  artifact: string
  support: '支持' | '条件支持' | '不支持'
  note: string
}

/** 框架支持矩阵 */
export const FRAMEWORK_MATRIX: FrameworkRow[] = [
  {
    framework: 'Vue 2 / Vue 3',
    tooling: 'Vite、Vue CLI、Webpack',
    artifact: 'dist/',
    support: '支持',
    note: '组件提供 TS / JS 两种写法',
  },
  {
    framework: 'React',
    tooling: 'Vite、Create React App、Webpack',
    artifact: 'build/ 或 dist/',
    support: '支持',
    note: '提供 TSX 组件',
  },
  {
    framework: 'Angular',
    tooling: 'Angular CLI',
    artifact: 'dist/<project>/browser/',
    support: '支持',
    note: 'Standalone 组件',
  },
  {
    framework: 'Svelte',
    tooling: 'Vite + Svelte',
    artifact: 'dist/',
    support: '支持',
    note: '单文件组件',
  },
  {
    framework: '纯 HTML / CSS / JS',
    tooling: '任意构建方式或无构建',
    artifact: '任意包含 index.html 的目录',
    support: '支持',
    note: '零依赖脚本直接引入',
  },
  {
    framework: 'Next.js 静态导出',
    tooling: 'next build（output: export）',
    artifact: 'out/',
    support: '条件支持',
    note: '仅限静态导出结果，不能是 Node 运行时',
  },
  {
    framework: 'Nuxt 静态生成',
    tooling: 'nuxt generate',
    artifact: '.output/public/',
    support: '条件支持',
    note: '需要完全静态化',
  },
  {
    framework: 'Astro',
    tooling: 'astro build',
    artifact: 'dist/',
    support: '条件支持',
    note: '不含 SSR adapter 的产物',
  },
  {
    framework: 'SSR / Node 常驻服务',
    tooling: 'Next.js、Nuxt SSR 等',
    artifact: '需要 Node 进程',
    support: '不支持',
    note: '发布物不是静态文件',
  },
]

export interface CompareColumnRow {
  label: string
  manual: string
  ci: string
  deploygo: string
}

/** 与手动 SSH、通用 CI 的对比 */
export const WORKFLOW_COMPARISON: CompareColumnRow[] = [
  {
    label: '初始接入成本',
    manual: '低，但每次都靠手工操作',
    ci: '中，需要写流水线并管理密钥',
    deploygo: '低，填服务器与项目即可',
  },
  {
    label: '版本留存与回滚',
    manual: '靠手工备份目录',
    ci: '需要自己实现制品留存',
    deploygo: '内置，按保留版本数管理',
  },
  {
    label: '回滚耗时',
    manual: '几分钟到几十分钟',
    ci: '重新跑一次流水线',
    deploygo: '历史记录里点一次',
  },
  {
    label: '零停机发布顺序',
    manual: '依赖个人经验',
    ci: '需要自己写脚本保证',
    deploygo: '内置固定顺序',
  },
  {
    label: '重复发布拦截',
    manual: '没有',
    ci: '需要自己实现',
    deploygo: '内置产物内容比对',
  },
  {
    label: '需要维护的基础设施',
    manual: '无',
    ci: 'Runner、密钥、流水线配置',
    deploygo: '一台装了桌面端的电脑',
  },
  {
    label: '适合场景',
    manual: '一次性、低频发布',
    ci: '多环境、复杂流程、多人协作',
    deploygo: '前端静态站点、频繁发版的小团队',
  },
]

/** 购买流程 4 步 */
export const PURCHASE_STEPS: { index: string; title: string; detail: string }[] = [
  { index: '01', title: '选择套餐并提交意向', detail: '在定价页选择授权时长，填写姓名与联系方式提交。' },
  { index: '02', title: '人工确认套餐与金额', detail: '我们会通过你留下的联系方式确认套餐、金额与开票信息。' },
  { index: '03', title: '完成付款', detail: '确认后按约定方式付款，本期暂未接入在线支付。' },
  { index: '04', title: '接收授权码并激活', detail: '授权码签发后，在桌面端激活页粘贴即可完成激活。' },
]
