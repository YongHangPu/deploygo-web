/** FAQ 内容与 FAQPage 结构化数据构建（纯数据 + 纯函数，便于单测） */

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqGroup {
  id: string
  title: string
  summary: string
  items: FaqItem[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'purchase',
    title: '购买与授权',
    summary: '授权形式、试用、换机与升级置换。',
    items: [
      {
        id: 'payment',
        question: '现在可以在线支付吗？',
        answer:
          '不能。本期购买流程尚未接入在线支付。在定价页选择套餐并提交购买意向即可，我们会通过你留下的联系方式确认套餐与金额，再人工签发授权码。提交成功后页面会提示「我们会尽快联系你」。',
      },
      {
        id: 'license-form',
        question: '授权是什么形式，怎么激活？',
        answer:
          '授权码是一串带签名的长字符串。在桌面端的激活页粘贴授权码即可完成激活；联网设备会记录首次激活时间，离线内网设备同样可以本地激活，只是后台没有激活记录。',
      },
      {
        id: 'devices',
        question: '一份授权可以几台机器使用？',
        answer:
          '一码一机。同一份授权只允许绑定一台未释放的设备；同一设备重复激活是幂等的，会返回原来的激活时间。换电脑时可以联系管理员重置激活，再重新绑定。',
      },
      {
        id: 'trial',
        question: '90 天试用需要注册账号吗？',
        answer:
          '不需要。从 GitHub Releases 下载官方完整版即可开始试用，deploygo 不要求注册，也不会收集你的服务器信息。',
      },
      {
        id: 'upgrade',
        question: '已经买了短周期套餐，可以换成年付或永久版吗？',
        answer:
          '支持升级置换。系统会按生效中授权的剩余时长折算金额，抵扣新套餐价格，具体金额由人工确认后再签发新的授权码，旧授权同时作废。',
      },
    ],
  },
  {
    id: 'usage',
    title: '接入与发布',
    summary: '组件接入、构建、缓存与失败处理。',
    items: [
      {
        id: 'build',
        question: '业务项目需要改构建流程吗？',
        answer:
          '不需要。构建仍是 npm run build、pnpm build 或 yarn build，deploygo 只读取构建产物目录，不修改你的构建配置。',
      },
      {
        id: 'component',
        question: '为什么页面里要挂载更新通知组件？',
        answer:
          '它负责轮询线上 version.json，发现版本变化时提示当前用户刷新页面获取最新资源。这一步让发布顺序的最后一段真正生效：入口切换后，已经打开的页面能主动感知新版本。',
      },
      {
        id: 'no-prompt',
        question: '更新提示一直不出现怎么办？',
        answer:
          '先检查线上缓存策略：index.html 和 version.json 不能被强缓存，带 hash 的静态资源才可以长缓存。其次确认 version.json 已经被替换、组件轮询路径正确。文档页提供了可直接复制的 Nginx 配置。',
      },
      {
        id: 'ssr',
        question: '支持 SSR 服务端渲染项目吗？',
        answer:
          '不支持。deploygo 面向的是可以构建成静态产物、由静态文件服务托管的项目。Next.js 使用静态导出、Nuxt 使用静态生成时，产物是静态文件，就可以发布。',
      },
      {
        id: 'failure',
        question: '发布失败会不会把线上搞挂？',
        answer:
          '设计上不会。发布顺序把资源、入口、版本号分开处理，任一步骤失败都不会破坏当前 live 版本；需要时可以在历史记录里回滚到上个稳定版本。',
      },
      {
        id: 'duplicate',
        question: '重复发布拦截是怎么判断的？',
        answer:
          'deploygo 会比对本次构建产物与最近一次发布产物的内容指纹。完全一致时直接拦截，避免同一份产物被重复上传与重复记录。',
      },
    ],
  },
  {
    id: 'security',
    title: '安全',
    summary: '凭证存储、网络边界与日志。',
    items: [
      {
        id: 'upload',
        question: 'deploygo 会把我的服务器信息上传到云端吗？',
        answer:
          '不会。deploygo 是纯本地桌面应用，不内置远端服务，凭证与部署流量只在你自己的电脑与服务器之间通过 SSH 直连。',
      },
      {
        id: 'storage',
        question: '服务器密码保存在哪里？',
        answer:
          '服务器密码与密钥口令用 AES-256-GCM 加密后写入本地数据库，每次加密使用随机 nonce 与认证标签，解密密钥保存在本机用户数据目录（Unix 下权限 0600）。',
      },
      {
        id: 'boundary',
        question: '加密的边界在哪里？',
        answer:
          '密钥保存在本机，因此能完全控制你电脑的攻击者理论上可以还原凭证。这是所有本地加密工具的共同边界。请避免在共享或不受信任的设备上保存生产凭证。',
      },
    ],
  },
  {
    id: 'open-source',
    title: '开源',
    summary: '开源仓库包含什么，与完整版是什么关系。',
    items: [
      {
        id: 'build-full',
        question: '开源仓库能自己编译出完整功能吗？',
        answer:
          '不能。部署引擎与授权系统不在开源仓库中，自行构建得到的是开源展示版，可以浏览全部界面，但部署、连接测试与回滚操作会引导下载官方完整版。',
      },
      {
        id: 'why-partial',
        question: '为什么不全开源？',
        answer:
          '界面实现、8 个框架的更新通知组件与零停机发布方案已经完整开源，可以自由学习、参考与复用。部署引擎与授权系统是维持项目持续开发的基础，这是商业开源产品常见的组织方式。',
      },
      {
        id: 'standalone',
        question: '更新通知组件可以脱离 deploygo 单独使用吗？',
        answer:
          '可以。组件只依赖一个按约定生成的 version.json，与 deploygo 桌面端完全解耦，任何前端项目都能直接接入。',
      },
      {
        id: 'license',
        question: '开源协议是什么？',
        answer: '开源仓库采用 MIT 协议，更新通知组件同样可以自由用于商业项目。',
      },
    ],
  },
]

/** 首页展示的 FAQ 子集 */
export const HOME_FAQ_IDS = ['payment', 'component', 'no-prompt', 'upload', 'build-full', 'failure']

/** 按 id 取问答，找不到时返回 undefined */
export function findFaqItem(id: string, groups: readonly FaqGroup[] = FAQ_GROUPS): FaqItem | undefined {
  for (const group of groups) {
    const found = group.items.find((item) => item.id === id)
    if (found) return found
  }
  return undefined
}

/** 按 id 列表取问答，保持传入顺序 */
export function pickFaqItems(ids: readonly string[], groups: readonly FaqGroup[] = FAQ_GROUPS): FaqItem[] {
  return ids
    .map((id) => findFaqItem(id, groups))
    .filter((item): item is FaqItem => Boolean(item))
}

/** 展平所有问答 */
export function flattenFaq(groups: readonly FaqGroup[] = FAQ_GROUPS): FaqItem[] {
  return groups.flatMap((group) => group.items)
}

/** FAQPage JSON-LD，用于 /faq 页面 */
export function buildFaqPageJsonLd(groups: readonly FaqGroup[] = FAQ_GROUPS): Record<string, unknown> {
  const items = flattenFaq(groups)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
