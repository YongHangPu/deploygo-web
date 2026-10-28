<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { copyText } from '@/utils/clipboard'

const props = withDefaults(
  defineProps<{
    code: string
    filename?: string
    maxHeight?: number
    dense?: boolean
  }>(),
  { filename: '', maxHeight: 0, dense: false },
)

const copied = ref(false)
const failed = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

async function handleCopy(): Promise<void> {
  const ok = await copyText(props.code)
  copied.value = ok
  failed.value = !ok
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
    failed.value = false
  }, 2000)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="code-block" :class="{ 'code-block--dense': dense }">
    <div class="code-block__bar">
      <span class="code-block__name">
        <AppIcon name="file-code" :size="14" />
        <span>{{ filename || '代码片段' }}</span>
      </span>
      <div class="code-block__actions">
        <button type="button" class="code-block__copy" @click="handleCopy">
          <AppIcon :name="copied ? 'check' : 'copy'" :size="14" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
        <span class="visually-hidden" role="status">
          {{ copied ? '代码已复制到剪贴板' : '' }}{{ failed ? '复制失败，请手动选择代码' : '' }}
        </span>
      </div>
    </div>
    <pre
      tabindex="0"
      :style="maxHeight > 0 ? { '--code-max-height': `${maxHeight}px` } : undefined"
    ><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block__copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.code-block__copy:hover {
  border-color: var(--border);
  background: var(--bg-hover);
  color: var(--text-primary);
}

.code-block--dense pre {
  padding: 12px 14px;
}
</style>
