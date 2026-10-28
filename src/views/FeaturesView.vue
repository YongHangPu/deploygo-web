<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import CtaBand from '@/components/CtaBand.vue'
import PageHero from '@/components/PageHero.vue'
import {
  CACHE_RULES,
  FEATURE_SECTIONS,
  FRAMEWORK_MATRIX,
  WORKFLOW_COMPARISON,
} from '@/data/content'
import { findRouteByPath } from '@/data/routes'
import { NGINX_CACHE_SNIPPET, RELEASE_ORDER_SNIPPET, REMOTE_TREE_SNIPPET } from '@/data/snippets'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/features')
usePageHead({
  title: route?.title ?? '功能 · deploygo',
  description: route?.description ?? '',
  path: '/features',
})

const meta = [
  { label: '发布顺序', value: '静态资源、index.html、version.json 三步固定' },
  { label: '版本留存', value: '按保留版本数管理，支持一键回滚' },
  { label: '框架', value: '框架无关，静态产物即可发布' },
]

function supportChip(support: string): string {
  if (support === '支持') return 'chip--green'
  if (support === '条件支持') return 'chip--yellow'
  return 'chip--red'
}
</script>

<template>
  <div class="features">
    <PageHero
      eyebrow="功能"
      title="一条只为前端静态项目设计的发布链路"
      lead="deploygo 的能力围绕同一件事展开：让静态站点的发布可预测、可回滚、可追踪。下面是每一项能力的具体行为。"
      :meta="meta"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide">
        <div class="feature-list">
          <article
            v-for="(feature, index) in FEATURE_SECTIONS"
            :id="feature.id"
            :key="feature.id"
            v-reveal
            class="feature-row"
          >
            <div class="feature-row__aside">
              <span class="feature-row__index mono">{{ String(index + 1).padStart(2, '0') }}</span>
              <h2 class="feature-row__title">{{ feature.title }}</h2>
            </div>
            <div class="feature-row__body">
              <p class="feature-row__summary">{{ feature.summary }}</p>
              <ul class="feature-row__points">
                <li v-for="point in feature.points" :key="point">
                  <span class="feature-row__bullet" aria-hidden="true" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>发布语义：顺序本身就是方案</h2>
          <p>
            三个阶段的顺序不可调换。先资源、再入口、最后版本号，因此发布过程中任何时刻都有可用页面，也不会出现「新入口请求旧资源」的错位。
          </p>
        </div>

        <div class="grid-12 semantics">
          <div class="span-7 semantics__main">
            <CodeBlock :code="RELEASE_ORDER_SNIPPET" filename="内置发布顺序" />
            <div class="semantics__guarantees">
              <div class="guarantee">
                <span class="guarantee__icon"><AppIcon name="shield" :size="16" /></span>
                <div>
                  <p class="guarantee__title">失败不影响线上</p>
                  <p class="guarantee__text">任一步骤失败，live 仍指向旧版本，重新发布即可。</p>
                </div>
              </div>
              <div class="guarantee">
                <span class="guarantee__icon"><AppIcon name="history" :size="16" /></span>
                <div>
                  <p class="guarantee__title">回滚只是重指软链</p>
                  <p class="guarantee__text">历史版本保留在 releases 目录，回滚不需要重新上传产物。</p>
                </div>
              </div>
              <div class="guarantee">
                <span class="guarantee__icon"><AppIcon name="refresh" :size="16" /></span>
                <div>
                  <p class="guarantee__title">版本感知在最后一步</p>
                  <p class="guarantee__text">version.json 变化后，通知组件才会提示用户刷新。</p>
                </div>
              </div>
            </div>
          </div>
          <div class="span-5">
            <CodeBlock :code="REMOTE_TREE_SNIPPET" filename="远端目录结构" />
            <p class="semantics__note">
              首次发布时 deploygo 会在远端自动创建 live_root、releases_root 与备份目录，不需要手工准备目录结构。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>缓存建议</h2>
          <p>缓存是「更新提示不出现」最常见的原因。这张表可以直接对照线上 Nginx 配置检查。</p>
        </div>

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

        <div class="cache-code">
          <CodeBlock :code="NGINX_CACHE_SNIPPET" filename="nginx.conf" />
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>框架支持矩阵</h2>
          <p>deploygo 支持的不是某个框架，而是「能构建出静态产物」这个前提。下面按框架与产物形态列出支持情况。</p>
        </div>

        <div class="table-wrap" tabindex="0">
          <table class="data-table matrix-table">
            <caption class="visually-hidden">框架支持矩阵</caption>
            <thead>
              <tr>
                <th scope="col">框架 / 项目类型</th>
                <th scope="col">构建工具</th>
                <th scope="col">产物目录</th>
                <th scope="col">支持程度</th>
                <th scope="col">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in FRAMEWORK_MATRIX" :key="row.framework">
                <td>{{ row.framework }}</td>
                <td>{{ row.tooling }}</td>
                <td class="mono">{{ row.artifact }}</td>
                <td>
                  <span class="chip" :class="supportChip(row.support)">{{ row.support }}</span>
                </td>
                <td>{{ row.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="matrix-note">
          组件覆盖 Vue 3 / Vue 2 / React / Angular / Svelte / 纯 JS 六个方向，共 8 个源码文件。条件支持的项目只要最终产物是静态目录即可发布。
        </p>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>与手动 SSH、通用 CI 的差别</h2>
          <p>deploygo 不是通用 CI/CD 平台，也不试图取代它。它解决的是前端静态站点频繁发版时，缺少版本留存与安全发布顺序的问题。</p>
        </div>

        <div class="table-wrap" tabindex="0">
          <table class="data-table compare-workflow">
            <caption class="visually-hidden">与手动 SSH、通用 CI 的对比</caption>
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">手动 SSH</th>
                <th scope="col">通用 CI</th>
                <th scope="col">deploygo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in WORKFLOW_COMPARISON" :key="row.label">
                <td>{{ row.label }}</td>
                <td>{{ row.manual }}</td>
                <td>{{ row.ci }}</td>
                <td class="compare-workflow__highlight">{{ row.deploygo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <CtaBand
      title="看完功能，直接试一次"
      description="90 天试用覆盖全部部署能力。配置一台服务器和一个项目，就能走完构建到回滚的完整流程。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <RouterLink to="/pricing" class="btn btn--secondary">查看定价</RouterLink>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
.feature-list {
  display: grid;
  border-top: 1px solid var(--border-subtle);
}

.feature-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px 40px;
  padding: 26px 0;
  border-bottom: 1px solid var(--border-subtle);
  scroll-margin-top: calc(var(--header-h) + 24px);
}

.feature-row__aside {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.feature-row__index {
  color: var(--text-decorative);
  font-size: 11.5px;
  letter-spacing: 0.08em;
}

.feature-row__title {
  font-size: clamp(18px, 2vw, 22px);
  letter-spacing: -0.01em;
}

.feature-row__summary {
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.78;
  max-width: 68ch;
}

.feature-row__points {
  display: grid;
  gap: 7px;
  margin-top: 14px;
}

.feature-row__points li {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 8px;
  color: var(--text-muted);
  font-size: 13.5px;
  line-height: 1.7;
}

.feature-row__bullet {
  width: 5px;
  height: 5px;
  margin-top: 0.7em;
  border-radius: 50%;
  background: var(--accent-blue-line);
}

/* —— 发布语义 —— */
.semantics {
  align-items: start;
}

.semantics__main {
  display: grid;
  gap: 16px;
}

.semantics__guarantees {
  display: grid;
  gap: 10px;
}

.guarantee {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-soft-panel);
}

.guarantee__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--accent-blue);
}

.guarantee__title {
  color: var(--text-primary);
  font-size: 13.5px;
  font-weight: 650;
}

.guarantee__text {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.6;
}

.semantics__note {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.65;
}

/* —— 缓存 —— */
.cache-code {
  margin-top: 18px;
}

/* —— 矩阵 —— */
.matrix-table {
  min-width: 780px;
}

.matrix-note {
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.65;
}

/* —— 对比 —— */
.compare-workflow {
  min-width: 760px;
}

.compare-workflow__highlight {
  color: var(--text-accent-soft) !important;
  font-weight: 600;
  background: var(--accent-blue-soft);
}

@media (min-width: 901px) {
  .feature-row {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }

  .feature-row__aside {
    display: grid;
    gap: 8px;
    align-content: start;
    position: sticky;
    top: calc(var(--header-h) + 32px);
  }
}
</style>
