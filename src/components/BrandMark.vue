<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <!-- 品牌标识：沿用 deploygo/public/favicon.svg 的图形（深色圆角方块 + 蓝色 D + 绿色短横与圆点） -->
  <svg
    class="brand-mark"
    :width="size"
    :height="size"
    viewBox="0 0 1024 1024"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="32" y="32" width="960" height="960" rx="220" fill="#0d1117" />
    <rect
      x="34"
      y="34"
      width="956"
      height="956"
      rx="218"
      fill="none"
      stroke="#2d3645"
      stroke-width="4"
    />
    <path
      d="M286 250v524h184c188 0 302-98 302-262S658 250 470 250H286"
      fill="none"
      stroke="#58a6ff"
      stroke-width="104"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M548 512h184" fill="none" stroke="#4fd162" stroke-width="58" stroke-linecap="round" />
    <circle cx="748" cy="512" r="30" fill="#4fd162" />
  </svg>
</template>

<style scoped>
.brand-mark {
  display: block;
  flex: none;
  border-radius: 7px;
}
</style>
