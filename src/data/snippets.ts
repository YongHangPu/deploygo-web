import type { TemplateKey } from '@/data/templates'

/** 各框架的挂载示例（与 deploygo 演示页保持一致，仅调整文案与文件名说明） */
export const MOUNT_SNIPPETS: Record<TemplateKey, string> = {
  'vue3-ts': [
    '<script setup lang="ts">',
    "import VersionUpdateNotification from './components/VersionUpdateNotification.vue'",
    '<' + '/script>',
    '',
    '<template>',
    '  <RouterView />',
    '  <VersionUpdateNotification />',
    '<' + '/template>',
  ].join('\n'),
  'vue3-js': [
    '<script setup>',
    "import VersionUpdateNotification from './components/VersionUpdateNotification.vue'",
    '<' + '/script>',
    '',
    '<template>',
    '  <RouterView />',
    '  <VersionUpdateNotification />',
    '<' + '/template>',
  ].join('\n'),
  'vue2-ts': [
    '<script lang="ts">',
    "import VersionUpdateNotification from './components/VersionUpdateNotification.vue'",
    '',
    'export default {',
    '  components: { VersionUpdateNotification },',
    '}',
    '<' + '/script>',
    '',
    '<template>',
    '  <div id="app">',
    '    <router-view />',
    '    <VersionUpdateNotification />',
    '  </div>',
    '</template>',
  ].join('\n'),
  'vue2-js': [
    '<script>',
    "import VersionUpdateNotification from './components/VersionUpdateNotification.vue'",
    '',
    'export default {',
    '  components: { VersionUpdateNotification },',
    '}',
    '<' + '/script>',
    '',
    '<template>',
    '  <div id="app">',
    '    <router-view />',
    '    <VersionUpdateNotification />',
    '  </div>',
    '</template>',
  ].join('\n'),
  react: [
    "import VersionUpdateNotification from './components/VersionUpdateNotification'",
    '',
    'export default function App() {',
    '  return (',
    '    <>',
    '      <Router />',
    '      <VersionUpdateNotification />',
    '    </>',
    '  )',
    '}',
  ].join('\n'),
  angular: [
    "import { VersionUpdateNotificationComponent } from './components/version-update-notification.component'",
    '',
    '@Component({',
    '  // ...',
    '  imports: [VersionUpdateNotificationComponent],',
    '  template: `',
    '    <router-outlet />',
    '    <app-version-update-notification />',
    '  `,',
    '})',
    'export class AppComponent {}',
  ].join('\n'),
  svelte: [
    '<script>',
    "  import VersionUpdateNotification from './lib/VersionUpdateNotification.svelte'",
    '<' + '/script>',
    '',
    '<Router />',
    '<VersionUpdateNotification />',
  ].join('\n'),
  js: [
    '<!-- 在 HTML 中引入 -->',
    '<script src="./components/VersionUpdateNotification.js"><' + '/script>',
    '<script>',
    "  VersionUpdateNotification.init({ basePath: '/' })",
    '<' + '/script>',
  ].join('\n'),
}

/** version.json 约定：只需要 version 字段，其余字段可自由附加 */
export const VERSION_JSON_SAMPLE = [
  '{',
  '  "version": "1.1.3",',
  '  "releaseName": "release-20261028-120410",',
  '  "builtAt": "2026-10-28T04:04:10.000Z"',
  '}',
].join('\n')

/** 零停机发布顺序（与 deploygo 内置流程一致） */
export const RELEASE_ORDER_SNIPPET = [
  '[1/3] 同步静态资源（排除 index.html / version.json）',
  '[2/3] 替换 index.html',
  '[3/3] 替换 version.json',
].join('\n')

/** 远端目录结构约定 */
export const REMOTE_TREE_SNIPPET = [
  '/mnt/data/app/',
  '├── dist/                        # live_root，线上入口（软链）',
  '│   └── -> ../releases/20261028-120410',
  '└── releases/',
  '    ├── 20261028-120410/         # 本次发布（当前 live）',
  '    ├── 20261020-093312/         # 上一个版本，可直接回滚',
  '    └── ...                      # 按保留版本数自动清理',
].join('\n')

/** 业务项目构建命令 */
export const BUILD_SNIPPET = [
  '# 仍按原有方式构建，不需要为 deploygo 改构建脚本',
  'pnpm build',
  '# 或 npm run build / yarn build',
].join('\n')

/** Nginx 缓存配置：index.html 与 version.json 禁缓存，带 hash 资源长缓存 */
export const NGINX_CACHE_SNIPPET = [
  '# 1. index.html 与 version.json 禁止强缓存',
  'location ~* ^/(index\\.html|version\\.json)$ {',
  '    root /mnt/data/app/dist;',
  '    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";',
  '    add_header Pragma "no-cache";',
  '    add_header Expires "0";',
  '    try_files $uri =404;',
  '}',
  '',
  '# 2. 带 hash 的静态资源可以长缓存',
  'location /assets/ {',
  '    root /mnt/data/app/dist;',
  '    add_header Cache-Control "public, max-age=31536000, immutable";',
  '    try_files $uri =404;',
  '}',
].join('\n')

/** 桌面端安装说明（下载页与文档页共用） */
export const INSTALL_NOTES: { platform: string; lines: string[] }[] = [
  {
    platform: 'Windows',
    lines: [
      '下载 .exe 安装包并运行，按向导完成安装。',
      '未做代码签名时系统可能提示未知发布者，确认文件来自官方渠道后继续。',
      '首次启动后在「服务器」页填写 SSH 信息即可开始。',
    ],
  },
  {
    platform: 'macOS',
    lines: [
      '按芯片选择 arm64 或 x64 的 .dmg，打开后拖入「应用程序」。',
      '若提示无法验证开发者，在「系统设置 → 隐私与安全性」中允许打开。',
      '首次连接服务器同样只需要 SSH 主机、端口与凭据。',
    ],
  },
  {
    platform: 'Linux',
    lines: [
      'AppImage 下载后执行 chmod +x 再运行，免安装。',
      'deb 包使用 sudo dpkg -i 安装，适合 Debian / Ubuntu。',
      '需要系统具备可用的 SSH 客户端能力（deploygo 内置连接逻辑）。',
    ],
  },
]
