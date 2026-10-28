import vue3TsSource from '@/templates/VersionUpdateNotification.vue?raw'
import vue3JsSource from '@/templates/VersionUpdateNotification.vue.js?raw'
import vue2TsSource from '@/templates/VersionUpdateNotification.vue2.ts?raw'
import vue2JsSource from '@/templates/VersionUpdateNotification.vue2?raw'
import reactSource from '@/templates/VersionUpdateNotification.tsx?raw'
import angularSource from '@/templates/VersionUpdateNotification.angular.ts?raw'
import svelteSource from '@/templates/VersionUpdateNotification.svelte?raw'
import jsSource from '@/templates/VersionUpdateNotification.js?raw'

/** 更新通知组件的 8 个源码变体，均从 deploygo 开源仓库 templates/ 目录同步而来 */
export type TemplateKey =
  | 'vue3-ts'
  | 'vue3-js'
  | 'vue2-ts'
  | 'vue2-js'
  | 'react'
  | 'angular'
  | 'svelte'
  | 'js'

export type FrameworkKey = 'vue3' | 'vue2' | 'react' | 'angular' | 'svelte' | 'js'

export interface ComponentTemplate {
  key: TemplateKey
  framework: FrameworkKey
  frameworkLabel: string
  /** 语言 / 变体标签，例如 TypeScript、TSX、零依赖 */
  variantLabel: string
  /** 仓库内部的文件名，文档里用于对照 */
  repoFileName: string
  /** 下载到业务项目时建议使用的文件名 */
  downloadName: string
  /** 源码（构建期由 ?raw 读入） */
  source: string
  /** 字节数，用于下载列表展示 */
  sizeBytes: number
  note: string
}

export interface FrameworkTab {
  key: FrameworkKey
  label: string
  hint: string
}

export const FRAMEWORK_TABS: FrameworkTab[] = [
  { key: 'vue3', label: 'Vue 3', hint: '提供 TypeScript 与 JavaScript 两种写法，下载后放到 components 目录。' },
  { key: 'vue2', label: 'Vue 2', hint: 'Options API 写法，兼容 Vue 2.6 / 2.7。' },
  { key: 'react', label: 'React', hint: 'TSX 组件，函数式写法，无额外依赖。' },
  { key: 'angular', label: 'Angular', hint: 'Standalone 组件，直接加入 imports。' },
  { key: 'svelte', label: 'Svelte', hint: '单文件组件，Svelte 3 及以上可用。' },
  { key: 'js', label: '纯 JS', hint: '零依赖脚本，传统多页站点也可以直接引入。' },
]

function byteLength(source: string): number {
  return new TextEncoder().encode(source).byteLength
}

interface TemplateSeed {
  key: TemplateKey
  framework: FrameworkKey
  frameworkLabel: string
  variantLabel: string
  repoFileName: string
  downloadName: string
  source: string
  note: string
}

const SEEDS: TemplateSeed[] = [
  {
    key: 'vue3-ts',
    framework: 'vue3',
    frameworkLabel: 'Vue 3',
    variantLabel: 'TypeScript',
    repoFileName: 'VersionUpdateNotification.vue',
    downloadName: 'VersionUpdateNotification.vue',
    source: vue3TsSource,
    note: '<script setup lang="ts"> 写法，Vue 3.2 及以上。',
  },
  {
    key: 'vue3-js',
    framework: 'vue3',
    frameworkLabel: 'Vue 3',
    variantLabel: 'JavaScript',
    repoFileName: 'VersionUpdateNotification.vue.js',
    downloadName: 'VersionUpdateNotification.vue',
    source: vue3JsSource,
    note: '与 TS 版逻辑一致，去掉类型标注，适合纯 JS 项目。',
  },
  {
    key: 'vue2-ts',
    framework: 'vue2',
    frameworkLabel: 'Vue 2',
    variantLabel: 'TypeScript',
    repoFileName: 'VersionUpdateNotification.vue2.ts',
    downloadName: 'VersionUpdateNotification.vue',
    source: vue2TsSource,
    note: 'Vue 2 + TypeScript，使用 @Component 装饰器风格。',
  },
  {
    key: 'vue2-js',
    framework: 'vue2',
    frameworkLabel: 'Vue 2',
    variantLabel: 'JavaScript',
    repoFileName: 'VersionUpdateNotification.vue2',
    downloadName: 'VersionUpdateNotification.vue',
    source: vue2JsSource,
    note: 'Vue 2 + JavaScript，Options API，兼容 2.6 / 2.7。',
  },
  {
    key: 'react',
    framework: 'react',
    frameworkLabel: 'React',
    variantLabel: 'TSX',
    repoFileName: 'VersionUpdateNotification.tsx',
    downloadName: 'VersionUpdateNotification.tsx',
    source: reactSource,
    note: '函数式组件，使用 useState / useEffect，无第三方依赖。',
  },
  {
    key: 'angular',
    framework: 'angular',
    frameworkLabel: 'Angular',
    variantLabel: 'TypeScript',
    repoFileName: 'VersionUpdateNotification.angular.ts',
    downloadName: 'version-update-notification.component.ts',
    source: angularSource,
    note: 'Standalone 组件，加入 imports 即可在模板中使用。',
  },
  {
    key: 'svelte',
    framework: 'svelte',
    frameworkLabel: 'Svelte',
    variantLabel: 'Svelte',
    repoFileName: 'VersionUpdateNotification.svelte',
    downloadName: 'VersionUpdateNotification.svelte',
    source: svelteSource,
    note: 'Svelte 单文件组件，onMount / onDestroy 管理轮询。',
  },
  {
    key: 'js',
    framework: 'js',
    frameworkLabel: '纯 JS',
    variantLabel: '零依赖',
    repoFileName: 'VersionUpdateNotification.js',
    downloadName: 'VersionUpdateNotification.js',
    source: jsSource,
    note: 'UMD 风格全局对象，多页站点可直接用 script 引入。',
  },
]

export const COMPONENT_TEMPLATES: ComponentTemplate[] = SEEDS.map((seed) => ({
  ...seed,
  sizeBytes: byteLength(seed.source),
}))

export function findTemplate(key: TemplateKey): ComponentTemplate {
  const found = COMPONENT_TEMPLATES.find((template) => template.key === key)
  if (!found) throw new Error(`未找到组件模板：${key}`)
  return found
}

export function templatesOfFramework(framework: FrameworkKey): ComponentTemplate[] {
  return COMPONENT_TEMPLATES.filter((template) => template.framework === framework)
}

/** 代码预览最多展示的行数，超出部分由「展开全部」控制 */
export const CODE_PREVIEW_LINES = 26
