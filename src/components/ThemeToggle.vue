<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    title="切换浅色 / 深色主题"
    aria-label="切换浅色 / 深色主题"
    @click="toggle"
  >
    <AppIcon name="sun" :size="17" class="theme-toggle__icon theme-toggle__icon--sun" />
    <AppIcon name="moon" :size="17" class="theme-toggle__icon theme-toggle__icon--moon" />
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.theme-toggle:hover {
  border-color: var(--border-strong);
  background: var(--bg-hover);
  color: var(--text-primary);
}

.theme-toggle__icon--moon {
  display: none;
}
</style>

<style>
/* 主题图标切换（非 scoped，确保能命中 html 上的 data-theme） */
html[data-theme='light'] .theme-toggle__icon--sun {
  display: none;
}

html[data-theme='light'] .theme-toggle__icon--moon {
  display: block;
}
</style>
