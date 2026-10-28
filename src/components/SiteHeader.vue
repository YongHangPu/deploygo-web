<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ROUTES } from '@/data/routes'
import AppIcon from '@/components/AppIcon.vue'
import BrandMark from '@/components/BrandMark.vue'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileMenu = ref<HTMLElement | null>(null)

let sentinelObserver: IntersectionObserver | null = null
let previousOverflow = ''

function isActive(path: string): boolean {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && menuOpen.value) closeMenu()
}

function toggleMenu(): void {
  if (menuOpen.value) closeMenu()
  else openMenu()
}

function openMenu(): void {
  menuOpen.value = true
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    const firstLink = mobileMenu.value?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()
  })
}

function closeMenu(): void {
  if (!menuOpen.value) return
  menuOpen.value = false
  document.body.style.overflow = previousOverflow
  menuButton.value?.focus()
}

onMounted(() => {
  // 用 IntersectionObserver 监听顶部哨兵，避免注册 scroll 事件
  const sentinel = document.getElementById('scroll-sentinel')
  if (sentinel && typeof IntersectionObserver !== 'undefined') {
    sentinelObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        scrolled.value = entry ? !entry.isIntersecting : false
      },
      { threshold: 0 },
    )
    sentinelObserver.observe(sentinel)
  }
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  sentinelObserver?.disconnect()
  window.removeEventListener('keydown', onKeydown)
  if (menuOpen.value) document.body.style.overflow = previousOverflow
})

watch(
  () => route.fullPath,
  () => {
    if (menuOpen.value) {
      menuOpen.value = false
      document.body.style.overflow = previousOverflow
    }
  },
)
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'is-open': menuOpen }">
    <div class="container container--wide site-header__inner">
      <RouterLink to="/" class="brand" aria-label="deploygo 首页">
        <BrandMark :size="26" />
        <span class="brand__name">deploygo</span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="item in NAV_ROUTES"
          :key="item.path"
          :to="item.path"
          class="nav__link"
          :class="{ 'is-active': isActive(item.path) }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="site-header__actions">
        <RouterLink to="/download" class="btn btn--primary btn--sm header-cta">
          下载桌面端
        </RouterLink>
        <button
          ref="menuButton"
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="20" />
          <span class="visually-hidden">{{ menuOpen ? '关闭导航菜单' : '打开导航菜单' }}</span>
        </button>
      </div>
    </div>

    <div v-show="menuOpen" id="mobile-menu" ref="mobileMenu" class="mobile-menu">
      <nav class="mobile-menu__nav" aria-label="移动端导航">
        <RouterLink
          v-for="item in NAV_ROUTES"
          :key="item.path"
          :to="item.path"
          class="mobile-menu__link"
          :class="{ 'is-active': isActive(item.path) }"
        >
          <span>{{ item.label }}</span>
          <AppIcon name="arrow-right" :size="16" />
        </RouterLink>
      </nav>
      <RouterLink to="/download" class="btn btn--primary btn--block">下载桌面端</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  border-bottom: 1px solid transparent;
  background: rgba(13, 17, 23, 0.72);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}

.site-header.is-scrolled,
.site-header.is-open {
  border-bottom-color: var(--border-subtle);
  background: rgba(11, 15, 21, 0.94);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: var(--header-h);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  flex: none;
}

.brand:hover {
  color: var(--text-primary);
}

.brand__name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.nav {
  display: none;
  align-items: center;
  gap: 4px;
}

.nav__link {
  position: relative;
  padding: 7px 11px;
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 550;
  white-space: nowrap;
  transition:
    color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.nav__link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav__link.is-active {
  color: var(--text-primary);
}

.nav__link.is-active::after {
  content: '';
  position: absolute;
  left: 11px;
  right: 11px;
  bottom: 1px;
  height: 2px;
  border-radius: 1px;
  background: var(--accent-blue);
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}

.header-cta {
  display: none;
}

.menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.menu-toggle:hover {
  border-color: var(--border-strong);
  background: var(--bg-hover);
}

.mobile-menu {
  display: grid;
  gap: 10px;
  padding: 12px var(--gutter) 20px;
  border-top: 1px solid var(--border-subtle);
  background: rgba(11, 15, 21, 0.98);
}

.mobile-menu__nav {
  display: grid;
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 2px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
}

.mobile-menu__link.is-active {
  color: var(--accent-blue);
}

.mobile-menu__link :deep(svg) {
  color: var(--text-muted);
}

@media (min-width: 1000px) {
  .nav {
    display: flex;
  }

  .header-cta {
    display: inline-flex;
  }

  .menu-toggle {
    display: none;
  }

  .mobile-menu {
    display: none !important;
  }
}
</style>
