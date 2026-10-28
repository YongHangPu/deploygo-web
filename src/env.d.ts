/// <reference types="vite/client" />

export {}

declare global {
  interface ImportMetaEnv {
    /** API 基地址，默认 /api（拼接 /v1 后请求公开接口） */
    readonly VITE_API_BASE?: string
    /** 站点域名，用于 canonical / sitemap / robots，例如 https://deploygo.example.com */
    readonly VITE_SITE_URL?: string
  }
}

/** 全局注册的自定义指令类型（main.ts 里 app.directive('reveal', vReveal)） */
declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof import('./directives/reveal').vReveal
  }
}
