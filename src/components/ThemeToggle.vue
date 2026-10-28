<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { useTheme, type ThemePreference } from '@/composables/useTheme'

const { preference, setPreference } = useTheme()

const root = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuOpen = ref(false)

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: 'moon' | 'sun' | 'monitor' }> = [
  { value: 'dark', label: '深色', icon: 'moon' },
  { value: 'light', label: '浅色', icon: 'sun' },
  { value: 'system', label: '跟随系统', icon: 'monitor' },
]

function closeMenu(returnFocus = false): void {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (returnFocus) {
    nextTick(() => {
      root.value?.querySelector<HTMLButtonElement>('.theme-toggle')?.focus({ preventScroll: true })
    })
  }
}

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}

function selectTheme(value: ThemePreference): void {
  setPreference(value)
  closeMenu(true)
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target
  if (target instanceof Node && !root.value?.contains(target)) closeMenu()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeMenu(true)
}

watch(menuOpen, async (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    menu.value?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus({ preventScroll: true })
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="theme-picker">
    <button
      type="button"
      class="theme-toggle"
      title="主题设置"
      aria-label="主题设置"
      aria-haspopup="menu"
      :aria-expanded="menuOpen"
      @click.stop="toggleMenu"
    >
      <AppIcon name="sun" :size="17" class="theme-toggle__icon theme-toggle__icon--sun" />
      <AppIcon name="moon" :size="17" class="theme-toggle__icon theme-toggle__icon--moon" />
      <AppIcon name="monitor" :size="17" class="theme-toggle__icon theme-toggle__icon--monitor" />
    </button>

    <Transition name="theme-menu">
      <div v-if="menuOpen" ref="menu" class="theme-menu" role="menu" aria-label="主题">
        <button
          v-for="option in OPTIONS"
          :key="option.value"
          type="button"
          class="theme-menu__item"
          :class="{ 'is-active': preference === option.value }"
          role="menuitemradio"
          :aria-checked="preference === option.value"
          @click="selectTheme(option.value)"
        >
          <AppIcon :name="option.icon" :size="15" />
          <span>{{ option.label }}</span>
          <AppIcon
            v-if="preference === option.value"
            name="check"
            :size="13"
            class="theme-menu__check"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-picker {
  position: relative;
  display: inline-flex;
}

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

.theme-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: var(--z-menu);
  min-width: 164px;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-elevated);
  box-shadow: var(--shadow-md);
}

.theme-menu__item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.theme-menu__item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.theme-menu__item.is-active {
  background: var(--accent-blue-soft);
  color: var(--accent-blue);
}

.theme-menu__check {
  margin-left: auto;
}

.theme-menu-enter-active,
.theme-menu-leave-active {
  transition:
    opacity 140ms var(--ease),
    transform 140ms var(--ease);
}

.theme-menu-enter-from,
.theme-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<style>
/* 图标显示当前主题模式：深色月亮 / 浅色太阳 / 跟随系统显示器 */
html .theme-picker .theme-toggle__icon {
  display: none;
}

html .theme-picker .theme-toggle__icon--moon {
  display: block;
}

html[data-theme-mode='light'] .theme-picker .theme-toggle__icon--sun {
  display: block;
}

html[data-theme-mode='light'] .theme-picker .theme-toggle__icon--moon {
  display: none;
}

html[data-theme-mode='system'] .theme-picker .theme-toggle__icon--monitor {
  display: block;
}

html[data-theme-mode='system'] .theme-picker .theme-toggle__icon--moon {
  display: none;
}
</style>
