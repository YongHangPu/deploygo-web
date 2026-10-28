<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="cta-section">
    <div class="container container--wide">
      <div class="cta-band">
        <div class="cta-band__inner">
          <div>
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
          </div>
          <div class="cta-band__actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding-block: clamp(40px, 5vw, 64px);
}
</style>
