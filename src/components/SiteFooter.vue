<script setup lang="ts">
import { useSiteInfo } from '@/composables/useSiteInfo'
import AppIcon from '@/components/AppIcon.vue'
import BrandMark from '@/components/BrandMark.vue'

const { site } = useSiteInfo()
const year = 2026

const productLinks = [
  { label: '功能', to: '/features' },
  { label: '定价', to: '/pricing' },
  { label: '下载', to: '/download' },
  { label: '更新日志', to: '/changelog' },
]

const resourceLinks = [
  { label: '接入文档', to: '/docs' },
  { label: '常见问题', to: '/faq' },
  { label: '开源说明', to: '/open-source' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="container container--wide">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <RouterLink to="/" class="site-footer__logo" aria-label="deploygo 首页">
            <BrandMark :size="26" />
            <span>deploygo</span>
          </RouterLink>
          <p class="site-footer__desc">
            面向前端静态项目的桌面端部署工具。一键部署、零停机发布、版本管理与一键回滚，凭证只留在你自己的电脑上。
          </p>
          <div class="site-footer__chips">
            <span class="chip chip--green"><span class="dot dot--live" />{{ site.trialDays }} 天免费试用</span>
            <span class="chip">MIT 开源仓库</span>
          </div>
        </div>

        <nav class="site-footer__col" aria-label="产品">
          <h2 class="site-footer__title">产品</h2>
          <RouterLink v-for="link in productLinks" :key="link.to" :to="link.to" class="site-footer__link">
            {{ link.label }}
          </RouterLink>
        </nav>

        <nav class="site-footer__col" aria-label="资源">
          <h2 class="site-footer__title">资源</h2>
          <RouterLink v-for="link in resourceLinks" :key="link.to" :to="link.to" class="site-footer__link">
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="site-footer__col">
          <h2 class="site-footer__title">项目</h2>
          <a
            :href="site.links.github"
            class="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <AppIcon name="arrow-up-right" :size="13" />
          </a>
          <a
            :href="site.links.gitee"
            class="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gitee
            <AppIcon name="arrow-up-right" :size="13" />
          </a>
          <a
            :href="site.links.releases"
            class="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Releases
            <AppIcon name="arrow-up-right" :size="13" />
          </a>
          <a
            :href="`${site.links.github}/blob/main/LICENSE`"
            class="site-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
            <AppIcon name="arrow-up-right" :size="13" />
          </a>
        </div>
      </div>

      <div class="site-footer__bottom">
        <p class="site-footer__copy">
          © {{ year }} deploygo · 本地优先的前端发布工具
        </p>
        <p class="site-footer__meta">
          <span v-if="site.icp">{{ site.icp }}</span>
          <span>购买流程暂未接入在线支付，提交意向后由人工联系</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: clamp(48px, 6vw, 88px);
  padding-block: clamp(40px, 5vw, 64px) 28px;
  border-top: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, rgba(13, 17, 23, 0) 0%, rgba(10, 14, 20, 0.85) 100%);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.site-footer__brand {
  display: grid;
  gap: 14px;
  max-width: 42ch;
}

.site-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.site-footer__desc {
  color: var(--text-muted);
  font-size: 13.5px;
  line-height: 1.75;
}

.site-footer__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.site-footer__col {
  display: grid;
  align-content: start;
  gap: 11px;
}

.site-footer__title {
  margin: 0 0 2px;
  color: var(--text-primary);
  font-family: var(--font-code);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.site-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  color: var(--text-secondary);
  font-size: 13.5px;
  transition: color var(--dur-fast) var(--ease);
}

.site-footer__link:hover {
  color: var(--accent-blue);
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 24px;
  margin-top: clamp(32px, 4vw, 48px);
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
}

.site-footer__copy,
.site-footer__meta {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.site-footer__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}

@media (min-width: 760px) {
  .site-footer__grid {
    grid-template-columns: minmax(0, 1.7fr) repeat(3, minmax(0, 0.7fr));
    gap: 40px;
  }
}
</style>
