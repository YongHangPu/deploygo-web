<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import PageHero from '@/components/PageHero.vue'
import { fetchDownloads } from '@/api/public'
import { usePublicData } from '@/composables/usePublicData'
import {
  FALLBACK_DOWNLOADS,
  groupDownloadsByPlatform,
  type DownloadItem,
} from '@/data/downloads'
import { findRouteByPath } from '@/data/routes'
import { INSTALL_NOTES } from '@/data/snippets'
import {
  COMPONENT_TEMPLATES,
  FRAMEWORK_TABS,
  findTemplate,
  templatesOfFramework,
  type FrameworkKey,
  type TemplateKey,
} from '@/data/templates'
import { formatBytes, formatVersionTag, shortenHash } from '@/utils/format'
import { copyText, downloadText } from '@/utils/clipboard'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/download')
usePageHead({
  title: route?.title ?? '下载 · deploygo',
  description: route?.description ?? '',
  path: '/download',
})

const { data: downloads } = usePublicData<DownloadItem[]>(FALLBACK_DOWNLOADS, fetchDownloads)
const platformGroups = computed(() => groupDownloadsByPlatform(downloads.value))
const currentVersion = computed(() => formatVersionTag(downloads.value[0]?.version ?? '1.1.3'))

const copiedSha = ref<number | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function copySha(item: DownloadItem): Promise<void> {
  const ok = await copyText(item.sha256)
  if (!ok) return
  copiedSha.value = item.id
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedSha.value = null
  }, 2000)
}

/* —— 更新通知组件 —— */
const activeKey = ref<TemplateKey>('vue3-ts')
const activeTemplate = computed(() => findTemplate(activeKey.value))
const activeFramework = computed<FrameworkKey>(() => activeTemplate.value.framework)
const variantTemplates = computed(() => templatesOfFramework(activeFramework.value))
const copiedSource = ref(false)
const downloadedSource = ref(false)
const actionMessage = ref('')

function selectFramework(key: FrameworkKey): void {
  const first = templatesOfFramework(key)[0]
  if (first) activeKey.value = first.key
}

async function copySource(): Promise<void> {
  const ok = await copyText(activeTemplate.value.source)
  copiedSource.value = ok
  actionMessage.value = ok ? '已复制源码' : '复制失败，请展开代码手动选择'
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedSource.value = false
    downloadedSource.value = false
    actionMessage.value = ''
  }, 2200)
}

function downloadSource(): void {
  const ok = downloadText(activeTemplate.value.downloadName, activeTemplate.value.source)
  downloadedSource.value = ok
  actionMessage.value = ok ? `已开始下载 ${activeTemplate.value.downloadName}` : '下载失败，请改用复制'
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedSource.value = false
    downloadedSource.value = false
    actionMessage.value = ''
  }, 2400)
}

const meta = computed(() => [
  { label: '最新版本', value: `${currentVersion.value}，桌面端与开源仓库同源同版本号` },
  { label: '安装包', value: 'Windows / macOS / Linux，共 5 个平台安装包' },
  { label: '更新组件', value: '8 个文件，覆盖 Vue 3 / Vue 2 / React / Angular / Svelte / 纯 JS' },
])
</script>

<template>
  <div class="download">
    <PageHero
      eyebrow="下载"
      title="下载 deploygo 桌面端"
      lead="桌面端包含完整部署引擎，提供 90 天免费试用，无需注册。更新通知组件是独立的源码文件，即使不使用桌面端也可以直接接入。"
      :meta="meta"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide">
        <div class="section-head">
          <h2>选择你的平台</h2>
          <p>
            安装包来自后台 downloads 配置，通常由 Cloudreve 或 GitHub Releases 分发。下载后可用下方 sha256 校验文件完整性。
          </p>
        </div>

        <div class="platforms">
          <section
            v-for="group in platformGroups"
            :key="group.key"
            class="platform"
            :aria-labelledby="`platform-${group.key}`"
          >
            <header class="platform__head">
              <div class="platform__title-row">
                <span class="platform__icon"><AppIcon name="monitor" :size="17" /></span>
                <h3 :id="`platform-${group.key}`" class="platform__title">{{ group.label }}</h3>
                <span class="chip chip--muted">{{ group.items.length }} 个安装包</span>
              </div>
              <p v-if="group.hint" class="platform__hint">{{ group.hint }}</p>
            </header>

            <ul class="download-list">
              <li v-for="item in group.items" :key="item.id" class="download-item">
                <div class="download-item__main">
                  <div class="download-item__title-row">
                    <span class="download-item__name">{{ item.name }}</span>
                    <span v-if="item.isPrimary" class="chip chip--blue">主推</span>
                    <span class="chip chip--muted">{{ formatVersionTag(item.version) }}</span>
                  </div>
                  <p class="download-item__file mono">{{ item.fileName }}</p>
                  <p class="download-item__meta">
                    <span>{{ formatBytes(item.sizeBytes) }}</span>
                    <span class="download-item__sep" aria-hidden="true">/</span>
                    <span class="mono">sha256 {{ shortenHash(item.sha256) }}</span>
                    <span class="download-item__sep" aria-hidden="true">/</span>
                    <span>{{ item.channel === 'cloudreve' ? 'Cloudreve 直链' : item.channel === 'github' ? 'GitHub Releases' : item.channel }}</span>
                  </p>
                  <p v-if="item.note" class="download-item__note">{{ item.note }}</p>
                </div>
                <div class="download-item__actions">
                  <a
                    class="btn btn--primary btn--sm"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppIcon name="download" :size="14" />
                    下载
                  </a>
                  <button type="button" class="btn btn--ghost btn--sm" @click="copySha(item)">
                    <AppIcon :name="copiedSha === item.id ? 'check' : 'copy'" :size="14" />
                    {{ copiedSha === item.id ? '已复制' : '复制 sha256' }}
                  </button>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <p class="downloads-note">
          <AppIcon name="info" :size="14" />
          <span>
            下载地址与校验值由后台维护，页面展示的是最新一次同步的数据。若后端接口不可用，则展示官方 Releases 页面作为兜底入口。
          </span>
        </p>
      </div>
    </section>

    <section id="templates" class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 templates-intro">
          <div class="span-7">
            <div class="section-head">
              <h2>更新通知组件</h2>
              <p>
                8 个源码文件，覆盖 6 个框架。组件只做一件事：轮询线上 version.json，发现新版本时提示用户刷新。它不依赖 deploygo 桌面端，可以独立用于任何按约定生成 version.json 的发布流程。
              </p>
            </div>
          </div>
          <div class="span-5 templates-intro__side">
            <ul class="kv-list">
              <li class="kv-list__row">
                <span class="kv-list__key">轮询间隔</span>
                <span class="kv-list__value">默认 60 秒，页面重新可见时会补一次检查</span>
              </li>
              <li class="kv-list__row">
                <span class="kv-list__key">依赖</span>
                <span class="kv-list__value">零第三方依赖，直接放进项目即可</span>
              </li>
              <li class="kv-list__row">
                <span class="kv-list__key">协议</span>
                <span class="kv-list__value">MIT，可用于商业项目</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="templates">
          <div class="templates__toolbar">
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

          <div class="grid-12 templates__body">
            <div class="span-8">
              <CodeBlock
                :code="activeTemplate.source"
                :filename="activeTemplate.downloadName"
                :max-height="420"
              />
            </div>

            <aside class="span-4 templates__side">
              <div class="templates__side-head">
                <h3>{{ activeTemplate.frameworkLabel }}</h3>
                <span class="chip">{{ activeTemplate.variantLabel }}</span>
              </div>
              <p class="templates__note">{{ activeTemplate.note }}</p>

              <dl class="kv-list templates__meta">
                <div class="kv-list__row">
                  <dt class="kv-list__key">下载文件名</dt>
                  <dd class="kv-list__value mono">{{ activeTemplate.downloadName }}</dd>
                </div>
                <div class="kv-list__row">
                  <dt class="kv-list__key">仓库源文件</dt>
                  <dd class="kv-list__value mono">{{ activeTemplate.repoFileName }}</dd>
                </div>
                <div class="kv-list__row">
                  <dt class="kv-list__key">大小</dt>
                  <dd class="kv-list__value">{{ formatBytes(activeTemplate.sizeBytes) }}</dd>
                </div>
              </dl>

              <div class="templates__actions">
                <button type="button" class="btn btn--primary btn--sm" @click="downloadSource">
                  <AppIcon name="download" :size="14" />
                  下载文件
                </button>
                <button type="button" class="btn btn--secondary btn--sm" @click="copySource">
                  <AppIcon :name="copiedSource ? 'check' : 'copy'" :size="14" />
                  {{ copiedSource ? '已复制' : '复制源码' }}
                </button>
              </div>
              <p class="visually-hidden" role="status">{{ actionMessage }}</p>

              <p class="templates__hint">
                推荐放到业务项目的 components 目录，挂载方式见
                <RouterLink to="/docs">接入文档</RouterLink>。
              </p>
            </aside>
          </div>

          <div class="table-wrap templates__table" tabindex="0">
            <table class="data-table">
              <caption class="visually-hidden">全部 8 个更新通知组件文件</caption>
              <thead>
                <tr>
                  <th scope="col">文件</th>
                  <th scope="col">框架</th>
                  <th scope="col">语言 / 变体</th>
                  <th scope="col">大小</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="template in COMPONENT_TEMPLATES" :key="template.key">
                  <td class="mono">{{ template.downloadName }}</td>
                  <td>{{ template.frameworkLabel }}</td>
                  <td>{{ template.variantLabel }}</td>
                  <td class="mono">{{ formatBytes(template.sizeBytes) }}</td>
                  <td>
                    <button
                      type="button"
                      class="link-button"
                      @click="activeKey = template.key"
                    >
                      预览
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>安装说明</h2>
          <p>三个平台的安装要点。桌面端首次启动后，在「服务器」页填写 SSH 信息即可开始。</p>
        </div>

        <div class="install-grid">
          <article v-for="note in INSTALL_NOTES" :key="note.platform" class="install-note">
            <h3 class="install-note__title">{{ note.platform }}</h3>
            <ul class="check-list">
              <li v-for="line in note.lines" :key="line">
                <span class="icon-slot"><AppIcon name="check" :size="15" :stroke-width="2" /></span>
                <span>{{ line }}</span>
              </li>
            </ul>
          </article>
        </div>

        <p class="platform-note">
          系统要求：Windows 10 及以上、macOS 12 及以上、主流 x86_64 / arm64 Linux 发行版。桌面端需要能直连目标服务器的 SSH。
        </p>
      </div>
    </section>

    <CtaBand
      title="装好之后，先跑一次真实发布"
      description="90 天试用覆盖完整部署引擎。配置服务器与项目，完成第一次一键部署，比看十页文档更直接。"
    >
      <template #actions>
        <RouterLink to="/docs" class="btn btn--primary">阅读接入文档</RouterLink>
        <RouterLink to="/changelog" class="btn btn--secondary">查看更新日志</RouterLink>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
.platforms {
  display: grid;
  gap: 18px;
}

.platform {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-card-soft-gradient);
  overflow: hidden;
}

.platform__head {
  display: grid;
  gap: 6px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border-subtle);
}

.platform__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.platform__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-inset);
  color: var(--accent-blue);
}

.platform__title {
  font-size: 18px;
}

.platform__hint {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.6;
}

.download-list {
  display: grid;
}

.download-item {
  display: grid;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.download-item:last-child {
  border-bottom: 0;
}

.download-item__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.download-item__name {
  color: var(--text-primary);
  font-size: 14.5px;
  font-weight: 650;
}

.download-item__file {
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 12px;
  word-break: break-all;
}

.download-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 5px;
  color: var(--text-muted);
  font-size: 12px;
}

.download-item__sep {
  color: var(--text-sep);
}

.download-item__note {
  margin-top: 5px;
  color: var(--text-muted);
  font-size: 12.5px;
}

.download-item__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.downloads-note {
  display: flex;
  align-items: start;
  gap: 8px;
  margin-top: 18px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.65;
}

.downloads-note :deep(svg) {
  margin-top: 2px;
  flex: none;
}

/* —— 组件区 —— */
.templates-intro {
  align-items: start;
  margin-bottom: clamp(24px, 3vw, 36px);
}

.templates-intro .section-head {
  margin-bottom: 0;
}

.templates-intro__side {
  padding-top: 4px;
}

.templates {
  display: grid;
  gap: 18px;
}

.templates__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.templates__body {
  align-items: start;
}

.templates__side {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-soft-panel-2);
}

.templates__side-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.templates__side-head h3 {
  font-size: 16px;
}

.templates__note {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.templates__meta {
  border-top: 1px solid var(--border-subtle);
}

.templates__meta .kv-list__value {
  word-break: break-all;
}

.templates__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.templates__hint {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.templates__table {
  margin-top: 6px;
}

.link-button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--accent-blue);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
}

.link-button:hover {
  color: var(--text-link-hover);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* —— 安装说明 —— */
.install-grid {
  display: grid;
  gap: 16px;
}

.install-note {
  padding: 20px;
  border: 1px solid var(--border-subtle);
  border-top: 2px solid var(--accent-blue-line);
  border-radius: var(--radius-md);
  background: var(--bg-soft-panel);
}

.install-note__title {
  margin-bottom: 14px;
  font-size: 16px;
}

.install-note .check-list li {
  font-size: 13.5px;
}

.platform-note {
  margin-top: 18px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.65;
}

@media (min-width: 640px) {
  .install-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 901px) {
  .download-item {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}
</style>
