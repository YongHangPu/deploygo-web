<script setup lang="ts">
import { computed } from 'vue'

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'book'
  | 'bolt'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'close'
  | 'code'
  | 'copy'
  | 'cube'
  | 'download'
  | 'external'
  | 'file-code'
  | 'github'
  | 'gitee'
  | 'history'
  | 'info'
  | 'layers'
  | 'link'
  | 'lock'
  | 'menu'
  | 'minus'
  | 'monitor'
  | 'plus'
  | 'refresh'
  | 'server'
  | 'shield'
  | 'terminal'
  | 'upload-cloud'

interface IconShape {
  d: string
  filled?: boolean
}

const ICONS: Record<IconName, IconShape[]> = {
  'arrow-right': [{ d: 'M5 12h14M13 6l6 6-6 6' }],
  'arrow-up-right': [{ d: 'M7 17 17 7M8 7h9v9' }],
  book: [{ d: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z' }, { d: 'M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z' }],
  bolt: [{ d: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z' }],
  check: [{ d: 'M20 6 9 17l-5-5' }],
  'chevron-down': [{ d: 'm6 9 6 6 6-6' }],
  clock: [{ d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z' }, { d: 'M12 8v4.5l3 1.8' }],
  close: [{ d: 'M6 6l12 12M18 6 6 18' }],
  code: [{ d: 'm9 8-4 4 4 4M15 8l4 4-4 4' }],
  copy: [
    { d: 'M9.5 9.5h8.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H9.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2Z' },
    { d: 'M7.5 15.5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v1.5' },
  ],
  cube: [{ d: 'm12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z' }, { d: 'M4 7.5 12 12l8-4.5M12 12v9' }],
  download: [{ d: 'M12 3v11M7.5 10.5 12 15l4.5-4.5M4 20h16' }],
  external: [{ d: 'M14 4h6v6M20 4l-8.5 8.5M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5' }],
  'file-code': [
    { d: 'M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z' },
    { d: 'M14 3v4h4' },
    { d: 'm10 12.5-2 2.5 2 2.5M14 12.5l2 2.5-2 2.5' },
  ],
  github: [
    {
      filled: true,
      d: 'M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.1c-3.2.7-3.87-1.4-3.87-1.4-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z',
    },
  ],
  gitee: [
    { filled: true, d: 'M2 2h20v20H2Z' },
    {
      filled: true,
      d: 'M5.6 8.6a3.3 3.3 0 0 1 3.3-3.3h8.2a3.3 3.3 0 0 1 0 6.6h-4.4v2.1h4.2a3.3 3.3 0 1 1 0 6.6H9.2a3.3 3.3 0 0 1-3.3-3.3V8.6Zm4.9 1.5h4.5a1.2 1.2 0 1 0 0-2.4H9.2a1.2 1.2 0 0 0-1.2 1.2v8.2c0 .66.54 1.2 1.2 1.2h6.1a1.2 1.2 0 1 0 0-2.4h-5a1.05 1.05 0 0 1-1.05-1.05V10.1c0-.58.47-1.05 1.05-1.05Z',
    },
  ],
  history: [{ d: 'M3 12a9 9 0 1 0 2.65-6.44M3 4v5h5' }, { d: 'M12 8v4.2l3 1.8' }],
  info: [{ d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z' }, { d: 'M12 11v6M12 7.8h.01' }],
  layers: [{ d: 'm12 3 8.5 4.5L12 12 3.5 7.5 12 3Z' }, { d: 'm3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5' }],
  link: [{ d: 'M10.5 13.5a4.5 4.5 0 0 0 6.36 0l2.12-2.12a4.5 4.5 0 0 0-6.36-6.36L11.5 6.1' }, { d: 'M13.5 10.5a4.5 4.5 0 0 0-6.36 0L5.02 12.62a4.5 4.5 0 0 0 6.36 6.36l1.07-1.07' }],
  lock: [{ d: 'M6 10.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1Z' }, { d: 'M8.5 10.5V7.75a3.5 3.5 0 0 1 7 0v2.75' }, { d: 'M12 14.5v2.5' }],
  menu: [{ d: 'M4 7h16M4 12h16M4 17h16' }],
  minus: [{ d: 'M5 12h14' }],
  monitor: [{ d: 'M3.5 5h17v11h-17Z' }, { d: 'M9 20h6M12 16v4' }],
  plus: [{ d: 'M12 5v14M5 12h14' }],
  refresh: [{ d: 'M20.5 12a8.5 8.5 0 1 1-2.5-6.02M20.5 4v5h-5' }],
  server: [{ d: 'M4 4.5h16v5H4Z' }, { d: 'M4 14.5h16v5H4Z' }, { d: 'M7.5 7h.01M7.5 17h.01' }],
  shield: [{ d: 'M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z' }, { d: 'm9 12 2 2 4-4' }],
  terminal: [{ d: 'm5 8 4 4-4 4M12.5 16h6.5' }],
  'upload-cloud': [{ d: 'M12 16V4M7.5 8.5 12 4l4.5 4.5' }, { d: 'M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3' }],
}

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number
    strokeWidth?: number
    label?: string
  }>(),
  { size: 20, strokeWidth: 1.5, label: undefined },
)

const shapes = computed<IconShape[]>(() => ICONS[props.name] ?? ICONS.info)
const isDecorative = computed(() => !props.label)
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :role="isDecorative ? undefined : 'img'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="label"
    fill="none"
  >
    <path
      v-for="(shape, index) in shapes"
      :key="index"
      :d="shape.d"
      :fill="shape.filled ? 'currentColor' : 'none'"
      :stroke="shape.filled ? 'none' : 'currentColor'"
      :stroke-width="shape.filled ? undefined : strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.app-icon {
  display: block;
  flex: none;
}
</style>
