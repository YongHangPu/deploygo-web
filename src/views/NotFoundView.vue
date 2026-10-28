<script setup lang="ts">
import { NOT_FOUND_PATH } from '@/data/routes'
import { usePageHead } from '@/utils/seo'

usePageHead({
  title: '页面不存在 · deploygo',
  description: '这个页面不存在，可能已经移动或从未存在。可以回到首页、查看文档或下载桌面端。',
  path: NOT_FOUND_PATH,
  noindex: true,
})
</script>

<template>
  <div class="not-found">
    <div class="container not-found__inner">
      <div class="not-found__code mono" aria-hidden="true">404</div>

      <div class="not-found__copy">
        <p class="eyebrow">路由未命中</p>
        <h1>这个页面不存在</h1>
        <p class="not-found__lead">
          链接可能已经移动，或者从未存在。下面这几个页面大概率是你要找的。
        </p>

        <div class="not-found__actions">
          <RouterLink to="/" class="btn btn--primary">回到首页</RouterLink>
          <RouterLink to="/docs" class="btn btn--secondary">阅读文档</RouterLink>
          <RouterLink to="/download" class="btn btn--ghost">下载桌面端</RouterLink>
        </div>
      </div>

      <div class="not-found__terminal dark-surface mono" role="presentation">
        <div class="not-found__terminal-bar">
          <span class="dot" />
          <span>deploygo · router</span>
        </div>
        <div class="not-found__terminal-body">
          <p><span class="not-found__prompt">$</span> deploygo open /this-page</p>
          <p class="not-found__error">error: 没有匹配的路由</p>
          <p class="not-found__hint"># 试试 /docs、/pricing 或 /download</p>
        </div>
      </div>

      <nav class="not-found__links" aria-label="常用页面">
        <p class="not-found__links-title mono">常用页面</p>
        <RouterLink to="/features" class="not-found__link">功能</RouterLink>
        <RouterLink to="/pricing" class="not-found__link">定价</RouterLink>
        <RouterLink to="/changelog" class="not-found__link">更新日志</RouterLink>
        <RouterLink to="/faq" class="not-found__link">常见问题</RouterLink>
        <RouterLink to="/open-source" class="not-found__link">开源说明</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  padding-block: clamp(40px, 6vw, 88px) clamp(56px, 8vw, 112px);
}

.not-found__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(20px, 3vw, 32px);
  align-items: start;
}

.not-found__code {
  color: var(--text-watermark);
  font-size: clamp(96px, 16vw, 190px);
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.06em;
  -webkit-text-stroke: 1px var(--border-strong);
  user-select: none;
}

.not-found__copy {
  display: grid;
  gap: 12px;
  align-content: start;
}

.not-found__copy h1 {
  font-size: clamp(28px, 3.4vw, 40px);
  letter-spacing: -0.02em;
}

.not-found__lead {
  max-width: 52ch;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.not-found__terminal {
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-code);
}

.not-found__terminal-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.not-found__terminal-bar .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-red);
}

.not-found__terminal-body {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  color: var(--text-secondary);
  font-size: 12.5px;
  line-height: 1.8;
}

.not-found__prompt {
  color: var(--accent-green);
}

.not-found__error {
  color: var(--text-warning-soft);
}

.not-found__hint {
  color: var(--text-muted);
}

.not-found__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
  padding-top: 20px;
  border-top: 1px solid var(--border-subtle);
}

.not-found__links-title {
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.not-found__link {
  color: var(--text-secondary);
  font-size: 13.5px;
}

.not-found__link:hover {
  color: var(--accent-blue);
}

@media (min-width: 901px) {
  .not-found__inner {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
  }

  .not-found__code {
    grid-column: 1 / -1;
  }

  .not-found__terminal {
    margin-top: 6px;
  }

  .not-found__links {
    grid-column: 1 / -1;
  }
}
</style>
