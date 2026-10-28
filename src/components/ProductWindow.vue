<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'

const history = [
  { tag: 'v1.1.3', time: '12:04', size: '42.6 MB', current: true },
  { tag: 'v1.1.2', time: '09:12', size: '42.5 MB', current: false },
  { tag: 'v1.1.1', time: '昨天', size: '42.1 MB', current: false },
]

const logLines = [
  { time: '12:04:11', text: '连接服务器 root@47.100.*.34:22', tone: 'dim' },
  { time: '12:04:12', text: '准备发布 release-20261028-120410', tone: 'dim' },
  { time: '12:04:13', text: '上传 218 个文件（42.6 MB）', tone: 'normal' },
  { time: '12:04:18', text: '静态资源同步完成', tone: 'ok' },
  { time: '12:04:19', text: '切换 live → releases/20261028-120410', tone: 'accent' },
  { time: '12:04:20', text: '写入 version.json {"version":"1.1.3"}', tone: 'normal' },
  { time: '12:04:20', text: '发布完成，耗时 9.4s', tone: 'ok' },
]
</script>

<template>
  <div class="product-window dark-surface" role="img" aria-label="deploygo 桌面端发布界面示意：左侧服务器与项目列表，右侧展示发布进度、终端日志和版本历史与回滚按钮">
    <div class="product-window__bar">
      <span class="product-window__lights" aria-hidden="true">
        <i class="light light--red" />
        <i class="light light--yellow" />
        <i class="light light--green" />
      </span>
      <span class="product-window__title mono">deploygo</span>
      <span class="product-window__env mono">production</span>
    </div>

    <div class="product-window__body">
      <aside class="sidebar" aria-hidden="true">
        <div class="sidebar__section">
          <p class="sidebar__label">服务器</p>
          <div class="sidebar__item is-selected">
            <span class="dot dot--live sidebar__dot sidebar__dot--online" />
            <span class="sidebar__text">prod-shanghai</span>
          </div>
          <div class="sidebar__item">
            <span class="dot sidebar__dot sidebar__dot--idle" />
            <span class="sidebar__text">staging</span>
          </div>
        </div>

        <div class="sidebar__section">
          <p class="sidebar__label">项目</p>
          <div class="sidebar__item is-active">
            <AppIcon name="cube" :size="13" />
            <span class="sidebar__text">deploygo-web</span>
            <span class="sidebar__count mono">3</span>
          </div>
          <div class="sidebar__item">
            <AppIcon name="cube" :size="13" />
            <span class="sidebar__text">admin-console</span>
          </div>
          <div class="sidebar__item">
            <AppIcon name="cube" :size="13" />
            <span class="sidebar__text">campaign-page</span>
          </div>
        </div>

        <div class="sidebar__footer">
          <span class="chip chip--green"><span class="dot" />已连接</span>
          <span class="sidebar__ssh mono">SSH · 22</span>
        </div>
      </aside>

      <div class="workspace">
        <header class="workspace__head">
          <div class="workspace__title">
            <p class="workspace__eyebrow mono">项目</p>
            <p class="workspace__name">deploygo-web</p>
          </div>
          <div class="workspace__actions">
            <span class="chip workspace__path mono">/mnt/data/app/dist</span>
            <span class="mock-button">
              <AppIcon name="upload-cloud" :size="13" />
              一键部署
            </span>
          </div>
        </header>

        <section class="release">
          <div class="release__head">
            <span class="release__label">本次发布</span>
            <span class="release__pct mono">58%</span>
          </div>
          <div class="release__bar" aria-hidden="true">
            <span class="release__bar-fill" />
          </div>
          <ul class="release__steps">
            <li class="release__step is-done">
              <span class="release__icon"><AppIcon name="check" :size="10" :stroke-width="2.4" /></span>
              <span class="release__name">同步静态资源</span>
              <span class="release__meta mono">218 个文件 · 42.6 MB</span>
            </li>
            <li class="release__step is-done">
              <span class="release__icon"><AppIcon name="check" :size="10" :stroke-width="2.4" /></span>
              <span class="release__name">替换 index.html</span>
              <span class="release__meta mono">原子切换</span>
            </li>
            <li class="release__step is-active">
              <span class="release__icon release__icon--pulse" />
              <span class="release__name">替换 version.json</span>
              <span class="release__meta mono">写入中</span>
            </li>
          </ul>
        </section>

        <section class="terminal" aria-hidden="true">
          <div class="terminal__bar">
            <span class="terminal__label mono">发布日志</span>
            <span class="terminal__meta mono">release-20261028-120410</span>
          </div>
          <ul class="terminal__lines mono">
            <li v-for="line in logLines" :key="line.time + line.text" class="terminal__line">
              <span class="terminal__time">{{ line.time }}</span>
              <span class="terminal__text" :class="`terminal__text--${line.tone}`">{{ line.text }}</span>
            </li>
            <li class="terminal__line terminal__line--cursor">
              <span class="terminal__time">12:04:20</span>
              <span class="terminal__caret" aria-hidden="true" />
            </li>
          </ul>
        </section>

        <section class="history" aria-hidden="true">
          <div class="history__head">
            <span class="history__label">版本历史</span>
            <span class="history__meta mono">保留 5 个版本</span>
          </div>
          <ul class="history__list">
            <li v-for="row in history" :key="row.tag" class="history__row">
              <span class="history__tag mono">{{ row.tag }}</span>
              <span v-if="row.current" class="chip chip--green history__current"><span class="dot" />当前</span>
              <span v-else class="history__rollback">回滚</span>
              <span class="history__stamp mono">{{ row.time }} · {{ row.size }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-window {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, #141a23 0%, #0e131a 100%);
  box-shadow:
    0 0 0 1px rgba(88, 166, 255, 0.06),
    0 40px 90px -40px rgba(0, 0, 0, 0.95),
    0 0 80px -50px rgba(88, 166, 255, 0.5);
  font-size: 12px;
  animation: window-in 0.7s var(--ease) both;
}

@keyframes window-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-window__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 34px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-subtle);
  background: rgba(17, 22, 31, 0.9);
}

.product-window__lights {
  display: inline-flex;
  gap: 6px;
}

.light {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: block;
}

.light--red {
  background: #ff5f57;
}

.light--yellow {
  background: #febc2e;
}

.light--green {
  background: #28c840;
}

.product-window__title {
  color: var(--text-muted);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.product-window__env {
  margin-left: auto;
  padding: 2px 7px;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-window__body {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  min-height: 402px;
}

/* —— 侧栏 —— */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 14px 10px;
  border-right: 1px solid var(--border-subtle);
  background: rgba(12, 16, 22, 0.7);
}

.sidebar__section {
  display: grid;
  gap: 3px;
}

.sidebar__label {
  margin: 0 0 4px 6px;
  color: var(--text-muted);
  font-family: var(--font-code);
  font-size: 8.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  border-radius: 5px;
  color: var(--text-secondary);
  font-size: 10.5px;
  line-height: 1.3;
}

.sidebar__item.is-selected,
.sidebar__item.is-active {
  background: rgba(88, 166, 255, 0.1);
  color: #cfe4ff;
}

.sidebar__item.is-active :deep(svg) {
  color: var(--accent-blue);
}

.sidebar__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__dot {
  width: 5px;
  height: 5px;
}

.sidebar__dot--online {
  color: var(--accent-green);
  background: var(--accent-green);
}

.sidebar__dot--idle {
  color: var(--text-muted);
  background: var(--text-muted);
}

.sidebar__count {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 9px;
}

.sidebar__footer {
  display: grid;
  gap: 8px;
  margin-top: auto;
  padding: 10px 6px 2px;
  border-top: 1px solid var(--border-subtle);
}

.sidebar__ssh {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.04em;
}

/* —— 工作区 —— */
.workspace {
  display: grid;
  gap: 10px;
  padding: 12px;
  align-content: start;
  min-width: 0;
}

.workspace__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.workspace__eyebrow {
  margin: 0 0 2px;
  color: var(--text-muted);
  font-size: 8.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.workspace__title h3,
.workspace__name {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--text-primary);
}

.workspace__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.workspace__path {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 9px;
  color: var(--text-muted);
}

.mock-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border: 1px solid #7cbaff;
  border-radius: 6px;
  background: var(--accent-blue);
  color: var(--text-inverse);
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

/* —— 发布进度 —— */
.release {
  padding: 10px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(18, 24, 32, 0.85);
}

.release__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.release__label {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 600;
}

.release__pct {
  color: var(--accent-blue);
  font-size: 9.5px;
}

.release__bar {
  height: 3px;
  border-radius: 2px;
  background: #1b232e;
  overflow: hidden;
}

.release__bar-fill {
  display: block;
  width: 58%;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent-blue), #79c0ff);
}

.release__steps {
  display: grid;
  gap: 5px;
  margin-top: 9px;
}

.release__step {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) auto;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  color: var(--text-muted);
}

.release__step.is-done {
  color: var(--text-secondary);
}

.release__step.is-active {
  color: var(--text-primary);
}

.release__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid var(--accent-green-line);
  background: var(--accent-green-soft);
  color: var(--accent-green);
}

.release__icon--pulse {
  border-color: var(--accent-blue-line);
  background: var(--accent-blue-soft);
  animation: step-pulse 1.6s ease-in-out infinite;
}

@keyframes step-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(88, 166, 255, 0.35);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(88, 166, 255, 0);
  }
}

.release__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.release__meta {
  font-size: 9px;
  color: var(--text-muted);
}

/* —— 终端 —— */
.terminal {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  overflow: hidden;
  background: #080c11;
}

.terminal__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 9px;
  border-bottom: 1px solid #161d26;
  background: #0c1117;
}

.terminal__label {
  color: var(--text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.terminal__meta {
  color: #8b949e;
  font-size: 8.5px;
}

.terminal__lines {
  display: grid;
  gap: 2px;
  padding: 8px 9px;
}

.terminal__line {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 8px;
  font-size: 9.5px;
  line-height: 1.5;
}

.terminal__time {
  color: #8b949e;
}

.terminal__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.terminal__text--dim {
  color: #7d8a99;
}

.terminal__text--normal {
  color: #b6c2cf;
}

.terminal__text--ok {
  color: #6fd47a;
}

.terminal__text--accent {
  color: #79b8ff;
}

.terminal__line--cursor {
  grid-template-columns: 58px 6px;
}

.terminal__caret {
  width: 5px;
  height: 10px;
  margin-top: 1px;
  background: #6fd47a;
  animation: caret-blink 1.1s steps(2, start) infinite;
}

@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* —— 版本历史 —— */
.history {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: rgba(18, 24, 32, 0.85);
  padding: 8px 10px 6px;
}

.history__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 1px solid #1a222c;
}

.history__label {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 600;
}

.history__meta {
  color: var(--text-muted);
  font-size: 8.5px;
}

.history__list {
  display: grid;
}

.history__row {
  display: grid;
  grid-template-columns: 54px auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid #151c25;
}

.history__row:last-child {
  border-bottom: 0;
}

.history__tag {
  color: var(--text-primary);
  font-size: 9.5px;
}

.history__stamp {
  justify-self: end;
  color: var(--text-muted);
  font-size: 8.5px;
}

.history__current {
  padding: 1px 6px;
  font-size: 8.5px;
}

.history__rollback {
  padding: 1px 7px;
  border: 1px solid #2a3441;
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 8.5px;
  text-align: center;
}

@media (max-width: 640px) {
  .product-window__body {
    grid-template-columns: 108px minmax(0, 1fr);
    min-height: 0;
  }

  .sidebar {
    padding: 10px 7px;
  }

  .workspace__path,
  .terminal__meta,
  .history__stamp {
    display: none;
  }

  .terminal__line {
    grid-template-columns: 50px minmax(0, 1fr);
  }
}

/* 手机竖屏：侧栏信息量有限，让出宽度给发布流程本身 */
@media (max-width: 520px) {
  .product-window__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .sidebar {
    display: none;
  }

  .workspace {
    padding: 10px;
  }

  .workspace__head {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-window {
    animation: none;
  }

  .release__icon--pulse {
    animation: none;
  }

  .terminal__caret {
    animation: none;
    opacity: 1;
  }
}
</style>
