<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { RELEASE_PHASES } from '@/data/content'
import { REMOTE_TREE_SNIPPET } from '@/data/snippets'
</script>

<template>
  <div class="zero-downtime">
    <div class="order-strip" aria-hidden="true">
      <span class="order-strip__item">静态资源</span>
      <span class="order-strip__arrow"><AppIcon name="arrow-right" :size="14" /></span>
      <span class="order-strip__item">index.html</span>
      <span class="order-strip__arrow"><AppIcon name="arrow-right" :size="14" /></span>
      <span class="order-strip__item">version.json</span>
    </div>

    <ol class="phases">
      <li v-for="(phase, index) in RELEASE_PHASES" :key="phase.index" class="phase">
        <div class="phase__head">
          <span class="phase__index mono">0{{ index + 1 }}</span>
          <span class="phase__connector" aria-hidden="true" />
        </div>
        <h3 class="phase__title">{{ phase.title }}</h3>
        <p class="phase__summary">{{ phase.summary }}</p>
        <div class="phase__state">
          <p class="phase__state-label">线上此刻</p>
          <p class="phase__effect">{{ phase.effect }}</p>
        </div>
      </li>
    </ol>

    <div class="symlink">
      <div class="symlink__head">
        <span class="symlink__label mono">远端目录约定</span>
        <span class="chip chip--green"><span class="dot dot--live" />live 始终指向一个完整版本</span>
      </div>
      <pre class="symlink__tree mono" tabindex="0">{{ REMOTE_TREE_SNIPPET }}</pre>
    </div>

    <p class="invariant">
      <AppIcon name="shield" :size="16" />
      <span>
        任一步骤失败都不会破坏当前线上版本；回滚只是把 live 重新指向上一个 release，不需要重新上传产物。
      </span>
    </p>
  </div>
</template>

<style scoped>
.zero-downtime {
  display: grid;
  gap: clamp(20px, 3vw, 32px);
}

/* —— 顺序条 —— */
.order-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-soft-dark);
  width: fit-content;
}

.order-strip__item {
  color: var(--text-secondary);
  font-family: var(--font-code);
  font-size: 12px;
  letter-spacing: 0.02em;
}

.order-strip__arrow {
  display: inline-flex;
  color: var(--accent-blue);
  opacity: 0.8;
}

/* —— 三阶段 —— */
.phases {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border);
}

.phase {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  padding: 22px 2px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.phase__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.phase__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--accent-blue-line);
  border-radius: 8px;
  background: var(--accent-blue-soft);
  color: var(--text-symlink);
  font-size: 12px;
  font-weight: 600;
}

.phase__connector {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-blue-line), transparent 70%);
}

.phase__title {
  font-size: 18px;
  letter-spacing: -0.01em;
}

.phase__summary {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.72;
  max-width: 46ch;
}

.phase__state {
  display: grid;
  gap: 4px;
  margin-top: 4px;
  padding: 10px 12px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent-green-line);
  border-radius: 6px;
  background: var(--bg-soft-panel-2);
  max-width: 48ch;
}

.phase__state-label {
  color: var(--accent-green);
  font-family: var(--font-code);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.phase__effect {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

/* —— 目录约定 —— */
.symlink {
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-code);
}

.symlink__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(17, 22, 31, 0.9);
}

.symlink__label {
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.symlink__tree {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  color: #a9b7c6;
  font-size: 12px;
  line-height: 1.75;
}

.invariant {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--accent-blue-line);
  border-radius: var(--radius-sm);
  background: var(--accent-blue-soft);
  color: var(--text-symlink-strong);
  font-size: 13.5px;
  line-height: 1.65;
}

.invariant :deep(svg) {
  margin-top: 2px;
  flex: none;
  color: var(--accent-blue);
}

@media (min-width: 901px) {
  .phases {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 28px;
    border-top: 0;
  }

  .phase {
    padding: 0;
    border-bottom: 0;
  }

  .phase::before {
    content: '';
    position: absolute;
    top: 15px;
    left: -20px;
    width: 12px;
    height: 1px;
    background: var(--accent-blue-line);
  }

  .phase:first-child::before {
    display: none;
  }
}
</style>
