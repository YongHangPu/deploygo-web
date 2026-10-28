<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    lead: string
    eyebrow?: string
    meta?: { label: string; value: string }[]
    wide?: boolean
  }>(),
  { eyebrow: '', meta: undefined, wide: false },
)
</script>

<template>
  <header class="page-hero">
    <div class="container" :class="{ 'container--wide': wide }">
      <div class="page-hero__inner">
        <div class="page-hero__copy">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h1>{{ title }}</h1>
          <p class="page-hero__lead">{{ lead }}</p>
          <div v-if="$slots.actions" class="page-hero__actions">
            <slot name="actions" />
          </div>
        </div>
        <dl v-if="meta && meta.length > 0" class="page-hero__meta">
          <div v-for="item in meta" :key="item.label" class="page-hero__meta-item">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-hero__copy {
  min-width: 0;
}

.page-hero h1 {
  margin-top: 10px;
}

.page-hero__meta-item + .page-hero__meta-item {
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}
</style>
