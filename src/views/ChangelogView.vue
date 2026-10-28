<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import PageHero from '@/components/PageHero.vue'
import { fetchReleases } from '@/api/public'
import { usePublicData } from '@/composables/usePublicData'
import { FALLBACK_RELEASES, parseReleaseBody, type ReleaseItem } from '@/data/releases'
import { findRouteByPath } from '@/data/routes'
import { formatDate, formatDateLabel, formatVersionTag } from '@/utils/format'
import { usePageHead } from '@/utils/seo'

const route = findRouteByPath('/changelog')
usePageHead({
  title: route?.title ?? '更新日志 · deploygo',
  description: route?.description ?? '',
  path: '/changelog',
})

const { data: releases } = usePublicData<ReleaseItem[]>(FALLBACK_RELEASES, () => fetchReleases(20))

const expandedIds = ref<number[]>(releases.value[0] ? [releases.value[0].id] : [])

function isExpanded(id: number): boolean {
  return expandedIds.value.includes(id)
}

function toggle(id: number): void {
  expandedIds.value = isExpanded(id)
    ? expandedIds.value.filter((value) => value !== id)
    : [...expandedIds.value, id]
}

const latest = computed(() => releases.value[0])

const meta = computed(() => [
  {
    label: '最新版本',
    value: latest.value ? `${formatVersionTag(latest.value.tag)} · ${formatDate(latest.value.publishedAt)}` : '等待加载',
  },
  { label: '更新条目', value: `${releases.value.length} 个版本记录` },
  { label: '来源', value: '后台 releases 数据，构建时回退到 CHANGELOG.md 内容' },
])
</script>

<template>
  <div class="changelog">
    <PageHero
      eyebrow="更新日志"
      title="每个版本改了什么"
      lead="桌面端的版本更新记录，按发布时间倒序排列。发布新版本时，同样的内容会出现在应用内的更新提示里。"
      :meta="meta"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide">
        <ol class="timeline">
          <li v-for="release in releases" :key="release.id" class="timeline__item">
            <div class="timeline__aside">
              <time class="timeline__date mono" :datetime="release.publishedAt ?? undefined">
                {{ formatDateLabel(release.publishedAt) }}
              </time>
              <span v-if="release.prerelease" class="chip chip--yellow">预发布</span>
            </div>

            <div class="timeline__body">
              <div class="timeline__head">
                <h2 class="timeline__title">
                  <span class="mono timeline__version">{{ formatVersionTag(release.tag) }}</span>
                  <span v-if="release.name && release.name !== release.tag" class="timeline__name">
                    {{ release.name }}
                  </span>
                </h2>
                <a
                  v-if="release.htmlUrl"
                  :href="release.htmlUrl"
                  class="timeline__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Release
                  <AppIcon name="arrow-up-right" :size="13" />
                </a>
              </div>

              <ul class="timeline__changes">
                <li
                  v-for="(line, index) in parseReleaseBody(release.body)"
                  v-show="isExpanded(release.id) || index < 2"
                  :key="`${release.id}-${index}`"
                  class="timeline__change"
                  :class="{ 'timeline__change--plain': line.type === 'paragraph' }"
                >
                  <span class="timeline__bullet" aria-hidden="true" />
                  <span>{{ line.text }}</span>
                </li>
              </ul>

              <button
                v-if="parseReleaseBody(release.body).length > 2"
                type="button"
                class="timeline__toggle"
                :aria-expanded="isExpanded(release.id)"
                @click="toggle(release.id)"
              >
                {{ isExpanded(release.id) ? '收起全部更新' : '展开全部更新' }}
                <AppIcon
                  name="chevron-down"
                  :size="14"
                  :style="{ transform: isExpanded(release.id) ? 'rotate(180deg)' : 'none' }"
                />
              </button>
            </div>
          </li>
        </ol>

        <p class="changelog__more">
          完整历史与每个版本的安装包见
          <a :href="`${latest?.htmlUrl ?? 'https://github.com/YongHangPu/deploygo/releases'}`" target="_blank" rel="noopener noreferrer">
            GitHub Releases
          </a>。
        </p>
      </div>
    </section>

    <CtaBand
      title="用上最新版本"
      description="桌面端内置应用内更新检查；如果当前版本较旧，也可以直接从下载页获取最新安装包。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <RouterLink to="/docs" class="btn btn--secondary">阅读文档</RouterLink>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
.timeline {
  display: grid;
  border-top: 1px solid var(--border-subtle);
}

.timeline__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px 32px;
  padding: 24px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.timeline__aside {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.timeline__date {
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.timeline__tag {
  padding: 2px 7px;
  border: 1px solid var(--accent-blue-line);
  border-radius: 5px;
  background: var(--accent-blue-soft);
  color: var(--text-chip-blue);
  font-size: 11.5px;
}

.timeline__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.timeline__version {
  color: var(--accent-blue);
  font-size: 0.82em;
  font-weight: 600;
  letter-spacing: 0;
}

.timeline__name {
  font-size: 0.82em;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0;
}

.timeline__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 16px;
}

.timeline__title {
  font-size: clamp(18px, 2vw, 22px);
  letter-spacing: -0.01em;
}

.timeline__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
}

.timeline__changes {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}

.timeline__change {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.72;
}

.timeline__bullet {
  width: 5px;
  height: 5px;
  margin-top: 0.68em;
  border-radius: 50%;
  background: var(--accent-blue-line);
}

.timeline__change--plain {
  grid-template-columns: minmax(0, 1fr);
}

.timeline__change--plain .timeline__bullet {
  display: none;
}

.timeline__toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--accent-blue);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.timeline__toggle:hover {
  color: var(--text-link-hover);
}

.changelog__more {
  margin-top: 22px;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.65;
}

@media (min-width: 760px) {
  .timeline__item {
    grid-template-columns: 176px minmax(0, 1fr);
  }

  .timeline__aside {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding-top: 3px;
  }
}
</style>
