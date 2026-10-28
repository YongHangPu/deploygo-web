import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type UserConfig } from 'vite'
import type { ViteSSGOptions } from 'vite-ssg'
import { NOT_FOUND_PATH, SITE_ROUTE_PATHS } from './src/data/routes'

/**
 * vite-ssg 预渲染配置。
 * - dirStyle: 'nested' → 每个路由输出 dist/<route>/index.html
 * - includedRoutes 显式给出全部可索引路由，避免 catch-all（/:pathMatch(.*)*）参与预渲染
 */
const ssgOptions: ViteSSGOptions = {
  entry: 'src/main.ts',
  formatting: 'minify',
  dirStyle: 'nested',
  concurrency: 8,
  includedRoutes: () => [...SITE_ROUTE_PATHS, NOT_FOUND_PATH],
}

// 端口/代理目标可通过环境变量覆盖（dev:all 会用不同端口同时启动多个项目）
const devPort = Number(process.env.WEB_PORT || 5173)
const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:3000'

const config: UserConfig & { ssgOptions: ViteSSGOptions } = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: devPort,
    strictPort: true,
    proxy: {
      // 开发环境：/api/v1/... 代理到本地后端，不重写路径
      '/api': { target: apiProxyTarget, changeOrigin: false },
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
  },
  ssgOptions,
}

export default defineConfig(config)
