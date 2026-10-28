<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import CtaBand from '@/components/CtaBand.vue'
import PageHero from '@/components/PageHero.vue'
import { useSiteInfo } from '@/composables/useSiteInfo'
import { findRouteByPath } from '@/data/routes'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/open-source')
usePageHead({
  title: route?.title ?? '开源说明 · deploygo',
  description: route?.description ?? '',
  path: '/open-source',
})

const { site } = useSiteInfo()

const BUILD_SNIPPET = [
  '# 1. 克隆开源仓库',
  'git clone https://github.com/YongHangPu/deploygo.git',
  'cd deploygo',
  '',
  '# 2. 安装依赖',
  'pnpm install',
  '',
  '# 3. 构建开源展示版（Tauri 桌面应用）',
  'pnpm tauri:build',
].join('\n')

const includedItems = [
  '完整的桌面端界面实现（Vue 3 + Naive UI + Pinia）',
  '8 个框架的版本更新通知组件，可独立使用',
  'Rust 后端架构骨架：契约层与桩实现',
  '零停机发布方案文档：发布语义、缓存策略、目录约定',
]

const excludedItems = ['部署引擎：SSH 连接管理、产物上传、原子发布与回滚执行', '授权与试用系统']

const meta = [
  { label: '协议', value: 'MIT，仓库全部代码与组件可自由使用' },
  { label: '仓库', value: 'GitHub 主仓库，Gitee 同步镜像' },
  { label: '完整版', value: '同源同版本号，从 GitHub Releases 分发' },
]
</script>

<template>
  <div class="open-source">
    <PageHero
      eyebrow="开源说明"
      title="界面与方案开源，部署引擎闭源"
      lead="deploygo 采用双轨模式：对社区最有价值的部分完整开源，部署引擎与授权系统随官方完整版分发，用授权收入支持项目持续开发。"
      :meta="meta"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide">
        <div class="section-head">
          <h2>两个版本的关系</h2>
          <p>开源仓库不是功能阉割的试用版，而是「方案与组件的分享」。官方完整版在开源仓库的界面基础上注入部署引擎与授权系统构建而成。</p>
        </div>

        <div class="model">
          <div class="model__col model__col--open">
            <div class="model__head">
              <span class="model__badge mono">MIT</span>
              <h3>开源仓库</h3>
            </div>
            <ul class="model__list">
              <li><AppIcon name="check" :size="14" :stroke-width="2" />完整界面实现</li>
              <li><AppIcon name="check" :size="14" :stroke-width="2" />8 个更新通知组件</li>
              <li><AppIcon name="check" :size="14" :stroke-width="2" />发布方案文档</li>
              <li><AppIcon name="check" :size="14" :stroke-width="2" />Rust 架构骨架</li>
            </ul>
            <p class="model__foot">可自由学习、参考与复用</p>
          </div>

          <div class="model__join" aria-hidden="true">
            <AppIcon name="plus" :size="16" />
          </div>

          <div class="model__col model__col--closed">
            <div class="model__head">
              <span class="model__badge model__badge--muted mono">私有</span>
              <h3>完整版独有</h3>
            </div>
            <ul class="model__list model__list--muted">
              <li><AppIcon name="lock" :size="14" />部署引擎</li>
              <li><AppIcon name="lock" :size="14" />SSH 连接与上传</li>
              <li><AppIcon name="lock" :size="14" />原子发布与回滚</li>
              <li><AppIcon name="lock" :size="14" />授权与试用系统</li>
            </ul>
            <p class="model__foot">随官方完整版分发</p>
          </div>

          <div class="model__join model__join--arrow" aria-hidden="true">
            <AppIcon name="arrow-right" :size="16" />
          </div>

          <div class="model__result">
            <span class="model__result-label mono">官方完整版</span>
            <p>与开源仓库同源同版本号，内置全部部署能力，提供 90 天免费试用。</p>
            <a :href="site.links.releases" class="btn btn--secondary btn--sm" target="_blank" rel="noopener noreferrer">
              前往 GitHub Releases
              <AppIcon name="arrow-up-right" :size="13" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>为什么这样拆分</h2>
          <p>
            开源与商业化的边界划在「部署引擎」上，而不是把功能拆得零碎。对使用者来说，这个边界意味着两件很实际的事。
          </p>
        </div>
        <div class="prose why__copy">
          <p>
            deploygo 由独立开发者维护。把对社区最有价值的部分完整开源，包括界面实现、更新通知组件与零停机发布方案文档，可以让更多人直接受益：学习桌面端产品的界面组织方式，或者只取一个组件放进自己的项目。
          </p>
          <p>
            而部署引擎涉及 SSH 连接管理、上传、原子发布与回滚的具体执行，是产品真正的工作量与维护成本所在。授权收入用于支持这部分持续开发，这是商业开源产品常见的组织方式。
          </p>
          <p>
            因此对使用者的实际影响很小：想了解方案或复用组件，开源仓库已经够用；想直接用它发版，官方完整版就是同一个界面加完整引擎。
          </p>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>开源仓库包含什么</h2>
          <p>下面按「包含」与「不包含」两组列清楚，避免下载后才发现少了关键能力。</p>
        </div>

        <div class="grid-12 repo-lists">
          <div class="span-6 repo-list repo-list--yes">
            <h3 class="repo-list__title">
              <span class="repo-list__icon"><AppIcon name="check" :size="15" :stroke-width="2.2" /></span>
              包含
            </h3>
            <ul class="check-list">
              <li v-for="item in includedItems" :key="item">
                <span class="icon-slot"><AppIcon name="check" :size="15" :stroke-width="2" /></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="span-6 repo-list repo-list--no">
            <h3 class="repo-list__title">
              <span class="repo-list__icon"><AppIcon name="minus" :size="15" /></span>
              不包含
            </h3>
            <ul class="check-list">
              <li v-for="item in excludedItems" :key="item">
                <span class="icon-slot"><AppIcon name="minus" :size="15" /></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 build">
          <div class="span-5">
            <div class="section-head">
              <h2>自行构建展示版</h2>
              <p>
                在开源仓库执行 Tauri 构建，得到的是开源展示版：可以启动并浏览全部界面，但部署、连接测试与回滚操作会引导下载官方完整版。
              </p>
            </div>
            <ul class="build__notes">
              <li><AppIcon name="info" :size="14" />需要 Rust 与 Tauri 的本地构建环境。</li>
              <li><AppIcon name="info" :size="14" />展示版不包含部署引擎，无法真正连接服务器发版。</li>
              <li><AppIcon name="info" :size="14" />组件与方案不受影响，可以照常拆出来用。</li>
            </ul>
          </div>
          <div class="span-7">
            <CodeBlock :code="BUILD_SNIPPET" filename="开源展示版构建" />
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 standalone">
          <div class="span-6">
            <div class="section-head">
              <h2>组件可以独立使用</h2>
              <p>
                更新通知组件不依赖 deploygo 桌面端，只依赖一个按约定生成的 version.json。任何前端项目都可以直接接入，配合自己的发布脚本也能工作。
              </p>
            </div>
            <div class="standalone__actions">
              <RouterLink to="/download#templates" class="btn btn--primary btn--sm">
                下载组件源码
                <AppIcon name="arrow-right" :size="14" />
              </RouterLink>
              <RouterLink to="/docs#component" class="btn btn--secondary btn--sm">查看挂载方式</RouterLink>
            </div>
          </div>
          <div class="span-6">
            <div class="license-card">
              <div class="license-card__head">
                <AppIcon name="book" :size="17" />
                <h3>MIT License</h3>
              </div>
              <p>
                开源仓库与其中的更新通知组件均采用 MIT 协议。你可以自由使用、修改、分发，包括用于商业项目，只需保留版权与许可声明。
              </p>
              <a
                :href="`${site.links.github}/blob/main/LICENSE`"
                class="license-card__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看完整协议文本
                <AppIcon name="arrow-up-right" :size="13" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="先看代码，再决定怎么用"
      description="开源仓库可以直接克隆、阅读、复用组件；需要真正部署时，下载官方完整版即可开始 90 天试用。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <a :href="site.links.github" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">
          浏览开源仓库
        </a>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
/* —— 双轨模型 —— */
.model {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  align-items: stretch;
}

.model__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-soft-panel-2);
}

.model__col--open {
  border-top: 2px solid var(--accent-green-line);
}

.model__col--closed {
  border-top: 2px solid var(--border-strong);
}

.model__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.model__head h3 {
  font-size: 17px;
}

.model__badge {
  padding: 2px 7px;
  border: 1px solid var(--accent-green-line);
  border-radius: 5px;
  background: var(--accent-green-soft);
  color: var(--text-chip-green);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.model__badge--muted {
  border-color: var(--border);
  background: var(--bg-inset);
  color: var(--text-muted);
}

.model__list {
  display: grid;
  gap: 8px;
}

.model__list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 13.5px;
}

.model__list :deep(svg) {
  flex: none;
  color: var(--accent-green);
}

.model__list--muted li {
  color: var(--text-muted);
}

.model__list--muted :deep(svg) {
  color: var(--text-muted);
}

.model__foot {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 12px;
}

.model__join {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.model__result {
  display: grid;
  gap: 10px;
  align-content: center;
  justify-items: start;
  padding: 20px;
  border: 1px solid var(--accent-blue-line);
  border-radius: var(--radius-md);
  background: var(--bg-repo-highlight);
}

.model__result-label {
  color: var(--accent-blue);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.model__result p {
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.65;
}

/* —— 为什么 —— */
.why__copy {
  max-width: 72ch;
}

/* —— 仓库内容 —— */
.repo-list {
  padding: 22px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-soft-panel);
}

.repo-list--yes {
  border-top: 2px solid var(--accent-green-line);
}

.repo-list--no {
  border-top: 2px solid var(--border-strong);
}

.repo-list__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}

.repo-list__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
}

.repo-list--yes .repo-list__icon {
  border-color: var(--accent-green-line);
  background: var(--accent-green-soft);
  color: var(--accent-green);
}

/* —— 构建 —— */
.build {
  align-items: start;
}

.build__notes {
  display: grid;
  gap: 8px;
}

.build__notes li {
  display: flex;
  align-items: start;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12.8px;
  line-height: 1.65;
}

.build__notes :deep(svg) {
  margin-top: 2px;
  flex: none;
  color: var(--accent-blue);
}

/* —— 独立使用 —— */
.standalone {
  align-items: start;
}

.standalone__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.license-card {
  display: grid;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-card-soft-gradient-3);
}

.license-card__head {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--accent-blue);
}

.license-card__head h3 {
  color: var(--text-primary);
  font-size: 16px;
}

.license-card p {
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.72;
}

.license-card__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  font-size: 13px;
}

@media (min-width: 901px) {
  .model {
    grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr) 36px minmax(0, 1.1fr);
    gap: 0;
  }
}
</style>
