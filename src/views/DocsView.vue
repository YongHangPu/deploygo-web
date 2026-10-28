<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import PageHero from '@/components/PageHero.vue'
import { useActiveSection } from '@/composables/useActiveSection'
import { CACHE_RULES } from '@/data/content'
import { pickFaqItems } from '@/data/faq'
import { findRouteByPath } from '@/data/routes'
import {
  BUILD_SNIPPET,
  MOUNT_SNIPPETS,
  NGINX_CACHE_SNIPPET,
  RELEASE_ORDER_SNIPPET,
  REMOTE_TREE_SNIPPET,
  VERSION_JSON_SAMPLE,
} from '@/data/snippets'
import {
  FRAMEWORK_TABS,
  findTemplate,
  templatesOfFramework,
  type FrameworkKey,
  type TemplateKey,
} from '@/data/templates'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/docs')
usePageHead({
  title: route?.title ?? '文档 · deploygo',
  description: route?.description ?? '',
  path: '/docs',
})

const SECTIONS = [
  { id: 'install', title: '安装桌面端' },
  { id: 'component', title: '挂载更新通知组件' },
  { id: 'build', title: '构建' },
  { id: 'version-json', title: 'version.json 约定' },
  { id: 'nginx-cache', title: 'Nginx 缓存配置' },
  { id: 'release', title: '发布与回滚' },
  { id: 'faq', title: '常见问题' },
] as const

const { activeId } = useActiveSection(SECTIONS.map((section) => section.id))

const activeKey = ref<TemplateKey>('vue3-ts')
const activeTemplate = computed(() => findTemplate(activeKey.value))
const activeFramework = computed<FrameworkKey>(() => activeTemplate.value.framework)
const variantTemplates = computed(() => templatesOfFramework(activeFramework.value))
const mountSnippet = computed(() => MOUNT_SNIPPETS[activeKey.value])

function selectFramework(key: FrameworkKey): void {
  const first = templatesOfFramework(key)[0]
  if (first) activeKey.value = first.key
}

const faqItems = pickFaqItems(['build', 'component', 'no-prompt', 'failure'])
</script>

<template>
  <div class="docs">
    <PageHero
      eyebrow="文档"
      title="接入 deploygo 发布流程"
      lead="从安装桌面端到完成第一次发布。业务项目只需要挂载一个更新通知组件，构建方式完全不变。"
      wide
    />

    <div class="container container--wide docs__layout">
      <aside class="docs__toc">
        <div class="docs__toc-inner">
          <p class="docs__toc-title mono">本页内容</p>
          <nav aria-label="文档目录">
            <a
              v-for="section in SECTIONS"
              :key="section.id"
              :href="`#${section.id}`"
              class="docs__toc-link"
              :class="{ 'is-active': activeId === section.id }"
            >
              {{ section.title }}
            </a>
          </nav>
          <div class="docs__toc-foot">
            <p>遇到文档没覆盖的问题？</p>
            <RouterLink to="/faq" class="docs__toc-more">
              查看全部常见问题
              <AppIcon name="arrow-right" :size="13" />
            </RouterLink>
          </div>
        </div>
      </aside>

      <div class="docs__content">
        <section id="install" class="docs-section">
          <h2>安装桌面端</h2>
          <p class="prose">
            桌面端包含完整部署引擎，Windows / macOS / Linux 均有安装包，提供 90 天免费试用，不需要注册账号。安装后首次启动即可添加服务器。
          </p>
          <ol class="docs-steps">
            <li>
              <span class="docs-steps__index mono">1</span>
              <div>
                <p class="docs-steps__title">从下载页选择对应平台的安装包</p>
                <p class="docs-steps__text">按芯片与系统选择，下载后用页面提供的 sha256 校验文件完整性。</p>
              </div>
            </li>
            <li>
              <span class="docs-steps__index mono">2</span>
              <div>
                <p class="docs-steps__title">打开应用，在「服务器」页添加服务器</p>
                <p class="docs-steps__text">
                  需要填写服务器名称、主机地址、端口、用户名与认证方式（密码或 SSH 密钥）。密码会以 AES-256-GCM 加密后保存在本地。
                </p>
              </div>
            </li>
            <li>
              <span class="docs-steps__index mono">3</span>
              <div>
                <p class="docs-steps__title">添加项目并关联服务器</p>
                <p class="docs-steps__text">
                  填写本地构建产物目录、线上发布目录与保留版本数。deploygo 会自动推导同级的 releases 目录。
                </p>
              </div>
            </li>
          </ol>
          <div class="docs-callout">
            <AppIcon name="info" :size="15" />
            <p>
              服务器只需要可用的 Linux 环境与 SSH 访问权限，不需要预装额外脚本或部署代理。
            </p>
          </div>
        </section>

        <section id="component" class="docs-section">
          <h2>挂载更新通知组件</h2>
          <p class="prose">
            组件负责轮询线上 <code>version.json</code>，发现版本变化时提示用户刷新页面。它不依赖桌面端，任何按约定生成
            <code>version.json</code> 的发布流程都可以使用。
          </p>

          <div class="docs-tabs">
            <div class="segmented" role="group" aria-label="选择框架">
              <button
                v-for="tab in FRAMEWORK_TABS"
                :key="tab.key"
                type="button"
                class="segmented__item"
                :aria-pressed="activeFramework === tab.key"
                @click="selectFramework(tab.key)"
              >
                {{ tab.label }}
              </button>
            </div>
            <div
              v-if="variantTemplates.length > 1"
              class="segmented"
              role="group"
              aria-label="选择语言版本"
            >
              <button
                v-for="template in variantTemplates"
                :key="template.key"
                type="button"
                class="segmented__item"
                :aria-pressed="activeKey === template.key"
                @click="activeKey = template.key"
              >
                {{ template.variantLabel }}
              </button>
            </div>
          </div>

          <div class="docs-mount">
            <div class="docs-mount__main">
              <CodeBlock
                :code="mountSnippet"
                :filename="`挂载示例 · ${activeTemplate.frameworkLabel}`"
                :max-height="360"
              />
              <p class="docs-mount__note">
                当前组件文件：<code>{{ activeTemplate.downloadName }}</code>，可到
                <RouterLink to="/download#templates">下载页</RouterLink>
                获取源码。
              </p>
            </div>
            <div class="docs-mount__side">
              <p class="docs-mount__title">组件行为</p>
              <ul class="kv-list">
                <li class="kv-list__row">
                  <span class="kv-list__key">轮询间隔</span>
                  <span class="kv-list__value">60 秒</span>
                </li>
                <li class="kv-list__row">
                  <span class="kv-list__key">页面可见</span>
                  <span class="kv-list__value">恢复可见 1 秒后补一次检查</span>
                </li>
                <li class="kv-list__row">
                  <span class="kv-list__key">点「稍后」</span>
                  <span class="kv-list__value">30 分钟后再次提醒</span>
                </li>
                <li class="kv-list__row">
                  <span class="kv-list__key">点「关闭」</span>
                  <span class="kv-list__value">60 分钟后再次提醒</span>
                </li>
                <li class="kv-list__row">
                  <span class="kv-list__key">请求地址</span>
                  <span class="kv-list__value"><code>version.json?t=时间戳</code>，避免被缓存</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="build" class="docs-section">
          <h2>构建</h2>
          <p class="prose">
            构建方式不变。deploygo 只读取构建产物目录，不接管构建流程，也不需要新增构建插件或环境变量。
          </p>
          <CodeBlock :code="BUILD_SNIPPET" filename="构建命令" />
          <div class="docs-callout">
            <AppIcon name="info" :size="15" />
            <p>
              构建产物目录通常选择 <code>dist</code>。如果 dist 外层还包了一层目录（例如
              <code>dist/app</code>），deploygo 也能自动识别最终产物所在的子目录。
            </p>
          </div>
        </section>

        <section id="version-json" class="docs-section">
          <h2>version.json 约定</h2>
          <p class="prose">
            站点根目录需要一个 <code>version.json</code>，其中 <code>version</code> 字段是必需的，其余字段可以自由附加。更新通知组件只读取
            <code>version</code> 并与首次加载时的值比较。
          </p>
          <CodeBlock :code="VERSION_JSON_SAMPLE" filename="version.json" />
          <ul class="docs-rules">
            <li>文件位置：静态站点根目录，与 index.html 同级，通过 <code>/version.json</code> 可访问。</li>
            <li>使用 deploygo 发布时由部署引擎自动生成，不需要手工维护。</li>
            <li>自行实现发布脚本时，需要在每次发布后更新这个文件，内容变化即视为新版本。</li>
            <li>不要对 version.json 做强缓存，否则组件会一直读到旧内容。</li>
          </ul>
        </section>

        <section id="nginx-cache" class="docs-section">
          <h2>Nginx 缓存配置</h2>
          <p class="prose">
            更新提示不出现，九成是缓存策略问题。核心只有一条规则：入口文件与版本文件每次回源，带 hash 的资源长期缓存。
          </p>

          <div class="table-wrap" tabindex="0">
            <table class="data-table">
              <caption class="visually-hidden">缓存规则建议</caption>
              <thead>
                <tr>
                  <th scope="col">路径</th>
                  <th scope="col">Cache-Control</th>
                  <th scope="col">原因</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rule in CACHE_RULES" :key="rule.path">
                  <td class="mono">{{ rule.path }}</td>
                  <td class="mono">{{ rule.header }}</td>
                  <td>{{ rule.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeBlock :code="NGINX_CACHE_SNIPPET" filename="nginx.conf" />
        </section>

        <section id="release" class="docs-section">
          <h2>发布与回滚</h2>
          <p class="prose">
            每次发版的日常动作只有两步：先在业务项目构建，再回到桌面端点「一键部署」。deploygo 会按固定顺序完成远端发布，并把结果写入部署历史。
          </p>

          <div class="docs-release">
            <div class="docs-release__steps">
              <p class="docs-release__label mono">内置发布顺序</p>
              <CodeBlock :code="RELEASE_ORDER_SNIPPET" filename="release order" :dense="true" />
            </div>
            <div class="docs-release__tree">
              <p class="docs-release__label mono">远端目录结构</p>
              <CodeBlock :code="REMOTE_TREE_SNIPPET" filename="远端目录" :dense="true" />
            </div>
          </div>

          <h3 class="docs-subtitle">回滚</h3>
          <p class="prose">
            打开部署历史，找到目标版本，点击回滚即可。回滚复用内置发布流程，只是把 live 重新指向历史 release，不会重新上传产物。
          </p>
          <ul class="docs-rules">
            <li>重复发布拦截：本次产物与最近一次发布内容一致时，会直接拦截并提示。</li>
            <li>保留版本数：超过配置数量的旧版本会被自动清理，历史里同时移除。</li>
            <li>失败处理：任一步骤失败都不会破坏当前 live 版本，可以直接重试或回滚。</li>
          </ul>
        </section>

        <section id="faq" class="docs-section">
          <h2>常见问题</h2>
          <FaqAccordion :items="faqItems" id-prefix="docs-faq" />
          <p class="docs-more">
            更多问题见 <RouterLink to="/faq">常见问题页面</RouterLink>。
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(28px, 4vw, 56px);
  padding-block: clamp(32px, 4vw, 56px) clamp(40px, 5vw, 72px);
  align-items: start;
}

/* —— 左侧目录 —— */
.docs__toc {
  display: none;
}

.docs__toc-inner {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: grid;
  gap: 14px;
  padding-right: 16px;
}

.docs__toc-title {
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.docs__toc nav {
  display: grid;
  gap: 1px;
  border-left: 1px solid var(--border-subtle);
}

.docs__toc-link {
  padding: 7px 0 7px 14px;
  margin-left: -1px;
  border-left: 1px solid transparent;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  transition:
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.docs__toc-link:hover {
  color: var(--text-primary);
}

.docs__toc-link.is-active {
  border-left-color: var(--accent-blue);
  color: var(--accent-blue);
}

.docs__toc-foot {
  display: grid;
  gap: 6px;
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}

.docs__toc-foot p {
  color: var(--text-muted);
  font-size: 12px;
}

.docs__toc-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
}

/* —— 内容区 —— */
.docs__content {
  display: grid;
  gap: clamp(36px, 4.5vw, 56px);
  min-width: 0;
}

.docs-section {
  scroll-margin-top: calc(var(--header-h) + 24px);
  display: grid;
  gap: 16px;
  min-width: 0;
}

.docs-section > h2 {
  font-size: clamp(22px, 2.4vw, 28px);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.docs-section .prose {
  font-size: 14.5px;
}

.docs-subtitle {
  margin-top: 8px;
  font-size: 17px;
}

.docs-steps {
  display: grid;
  gap: 14px;
}

.docs-steps li {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 12px;
}

.docs-steps__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--accent-blue);
  font-size: 11px;
}

.docs-steps__title {
  color: var(--text-primary);
  font-size: 14.5px;
  font-weight: 650;
}

.docs-steps__text {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.7;
}

.docs-callout {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 13px 15px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent-blue);
  border-radius: var(--radius-sm);
  background: rgba(17, 22, 31, 0.6);
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.docs-callout :deep(svg) {
  margin-top: 2px;
  flex: none;
  color: var(--accent-blue);
}

.docs-callout code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--bg-inset);
  font-size: 0.9em;
  color: #a8c7f0;
}

.docs-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.docs-mount {
  display: grid;
  gap: 18px;
  align-items: start;
}

.docs-mount__main {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.docs-mount__note {
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.6;
}

.docs-mount__note code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--bg-inset);
  font-size: 0.92em;
  color: #a8c7f0;
}

.docs-mount__side {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: rgba(17, 22, 31, 0.55);
}

.docs-mount__title {
  color: var(--text-primary);
  font-size: 13.5px;
  font-weight: 650;
}

.docs-mount__side .kv-list__row {
  grid-template-columns: 1fr;
  gap: 2px;
  padding: 9px 0;
}

.docs-mount__side .kv-list__key {
  font-size: 11px;
}

.docs-mount__side .kv-list__value {
  font-size: 12.5px;
}

.docs-mount__side code {
  font-size: 0.92em;
  color: #a8c7f0;
}

.docs-rules {
  display: grid;
  gap: 8px;
  padding-left: 0;
}

.docs-rules li {
  position: relative;
  padding-left: 18px;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.7;
}

.docs-rules li::before {
  content: '';
  position: absolute;
  top: 0.72em;
  left: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-blue-line);
}

.docs-rules code,
.docs-section .prose code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--bg-inset);
  font-size: 0.9em;
  color: #a8c7f0;
}

.docs-release {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
}

.docs-release__steps,
.docs-release__tree {
  min-width: 0;
}

.docs-release__label {
  margin-bottom: 6px;
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.docs-more {
  color: var(--text-muted);
  font-size: 13px;
}

@media (min-width: 760px) {
  .docs-mount {
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 0.85fr);
  }
}

@media (min-width: 1000px) {
  .docs__layout {
    grid-template-columns: 190px minmax(0, 1fr);
  }

  .docs__toc {
    display: block;
  }

  .docs-release {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
