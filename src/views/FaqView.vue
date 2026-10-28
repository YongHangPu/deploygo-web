<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import PageHero from '@/components/PageHero.vue'
import { FAQ_GROUPS, buildFaqPageJsonLd, flattenFaq } from '@/data/faq'
import { findRouteByPath } from '@/data/routes'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/faq')
usePageHead({
  title: route?.title ?? '常见问题 · deploygo',
  description: route?.description ?? '',
  path: '/faq',
  jsonLd: buildFaqPageJsonLd(),
})

const questionCount = flattenFaq().length
</script>

<template>
  <div class="faq">
    <PageHero
      eyebrow="常见问题"
      title="关于 deploygo 的常见问题"
      lead="购买与授权、组件接入、发布与回滚、安全设计，以及开源版与完整版的关系。如果这里没有你的问题，可以通过 GitHub Issues 找到我们。"
      :meta="[
        { label: '问题数量', value: `${questionCount} 个，分为 4 组` },
        { label: '结构化数据', value: '本页包含 FAQPage JSON-LD，便于搜索引擎收录' },
        { label: '反馈', value: '文档或产品问题都可以在 GitHub Issues 提出' },
      ]"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide faq__layout">
        <aside class="faq__nav" aria-label="问题分组">
          <p class="faq__nav-title mono">分组</p>
          <nav>
            <a
              v-for="group in FAQ_GROUPS"
              :key="group.id"
              :href="`#group-${group.id}`"
              class="faq__nav-link"
            >
              {{ group.title }}
              <span class="faq__nav-count mono">{{ group.items.length }}</span>
            </a>
          </nav>
        </aside>

        <div class="faq__groups">
          <section
            v-for="group in FAQ_GROUPS"
            :id="`group-${group.id}`"
            :key="group.id"
            class="faq-group"
          >
            <div class="faq-group__head">
              <h2>{{ group.title }}</h2>
              <p>{{ group.summary }}</p>
            </div>
            <FaqAccordion :items="group.items" :id-prefix="`faq-${group.id}`" />
          </section>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container container--wide">
        <div class="faq-help">
          <div class="faq-help__icon"><AppIcon name="terminal" :size="18" /></div>
          <div class="faq-help__body">
            <h2>没有找到答案？</h2>
            <p>
              产品使用问题可以在 GitHub Issues 提问；购买与授权相关问题可以在定价页提交购买意向，或直接通过页面底部的方式联系我们。
            </p>
          </div>
          <div class="faq-help__actions">
            <RouterLink to="/pricing" class="btn btn--secondary btn--sm">查看定价</RouterLink>
            <RouterLink to="/docs" class="btn btn--ghost btn--sm">
              阅读文档
              <AppIcon name="arrow-right" :size="14" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="先下载，再提问"
      description="很多问题在跑通一次发布之后就消失了。90 天试用不需要注册，装好就能验证完整流程。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <RouterLink to="/open-source" class="btn btn--secondary">了解开源版</RouterLink>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
.faq__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}

.faq__nav {
  display: none;
}

.faq__nav-title {
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.faq__nav nav {
  display: grid;
  gap: 2px;
  border-left: 1px solid var(--border-subtle);
}

.faq__nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0 8px 14px;
  color: var(--text-secondary);
  font-size: 13.5px;
  transition: color var(--dur-fast) var(--ease);
}

.faq__nav-link:hover {
  color: var(--accent-blue);
}

.faq__nav-count {
  color: var(--text-muted);
  font-size: 11px;
}

.faq__groups {
  display: grid;
  gap: clamp(32px, 4vw, 48px);
}

.faq-group {
  scroll-margin-top: calc(var(--header-h) + 24px);
}

.faq-group__head {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

.faq-group__head h2 {
  font-size: clamp(20px, 2.2vw, 25px);
}

.faq-group__head p {
  color: var(--text-muted);
  font-size: 13.5px;
}

.faq-help {
  display: grid;
  gap: 16px;
  align-items: center;
  padding: 22px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-soft-panel);
}

.faq-help__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-code);
  color: var(--accent-green);
}

.faq-help__body h2 {
  font-size: 17px;
}

.faq-help__body p {
  margin-top: 6px;
  max-width: 68ch;
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.7;
}

.faq-help__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (min-width: 760px) {
  .faq-help {
    grid-template-columns: 38px minmax(0, 1fr) auto;
    gap: 20px;
  }
}

@media (min-width: 1000px) {
  .faq__layout {
    grid-template-columns: 190px minmax(0, 1fr);
  }

  .faq__nav {
    display: block;
    position: sticky;
    top: calc(var(--header-h) + 24px);
  }
}
</style>
