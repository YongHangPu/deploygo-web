<script setup lang="ts">
import { useHead } from '@unhead/vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useSiteInfo } from '@/composables/useSiteInfo'

const { site } = useSiteInfo()

useHead({
  htmlAttrs: { lang: 'zh-CN' },
})
</script>

<template>
  <div id="scroll-sentinel" class="scroll-sentinel" aria-hidden="true" />
  <a class="skip-link" href="#main">跳到主要内容</a>

  <p v-if="site.announcement" class="notice-bar" role="status">{{ site.announcement }}</p>

  <SiteHeader />

  <main id="main" tabindex="-1">
    <RouterView />
  </main>

  <SiteFooter />
</template>

<style>
.scroll-sentinel {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

#main:focus {
  outline: none;
}
</style>
