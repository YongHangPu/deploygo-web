<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import type { FaqItem } from '@/data/faq'

const props = withDefaults(
  defineProps<{
    items: FaqItem[]
    defaultOpenId?: string
    idPrefix?: string
  }>(),
  { defaultOpenId: '', idPrefix: 'faq' },
)

const openId = ref<string | null>(props.defaultOpenId || props.items[0]?.id || null)

function toggle(id: string): void {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="item in items"
      :key="item.id"
      class="accordion__item"
      :data-open="openId === item.id"
    >
      <h3 class="accordion__heading">
        <button
          :id="`${idPrefix}-trigger-${item.id}`"
          type="button"
          class="accordion__trigger"
          :aria-expanded="openId === item.id"
          :aria-controls="`${idPrefix}-panel-${item.id}`"
          @click="toggle(item.id)"
        >
          <span class="accordion__question">{{ item.question }}</span>
          <AppIcon class="accordion__icon" name="chevron-down" :size="18" />
        </button>
      </h3>
      <div
        v-show="openId === item.id"
        :id="`${idPrefix}-panel-${item.id}`"
        class="accordion__panel"
        role="region"
        :aria-labelledby="`${idPrefix}-trigger-${item.id}`"
      >
        <p>{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion__heading {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: normal;
}
</style>
