# deploygo 官网（deploygo-web）

deploygo 的产品官网：深色 / 浅色 / 跟随系统三种主题模式（默认深色），中文内容，全站静态预渲染（vite-ssg），面向搜索引擎与直接分享都可用。

- 线上页面：`/`、`/features`、`/pricing`、`/download`、`/docs`、`/changelog`、`/open-source`、`/faq`、`/404`
- 每个路由在构建期生成 `dist/<route>/index.html`，HTML 内包含完整文案与 SEO meta
- 右上角主题按钮打开菜单，可选深色 / 浅色 / 跟随系统，选择保存到 `localStorage`（`deploygo-theme`）；首屏由 `index.html` 内联脚本提前应用，不会闪烁
- 跟随系统模式会监听 `prefers-color-scheme`，系统切换时实时更新
- 定价、下载、更新日志、站点信息读取 `/api/v1/public/*`，接口不可用时使用本地 fallback 数据
- 购买流程暂未接入在线支付：定价页的购买按钮打开「购买意向」弹窗，提交到 `/api/v1/public/purchase-intents`

## 技术栈

| 依赖 | 版本 | 用途 |
|---|---|---|
| Vue | 3.5.44 | `<script setup lang="ts">` 单文件组件 |
| Vite | 8.3.5 | 构建与开发服务器 |
| TypeScript | 6.0.3 | 严格模式类型检查 |
| Vue Router | 4.6.4 | 路由 |
| vite-ssg | 28.3.0 | 构建期预渲染所有路由 |
| @unhead/vue | ^2.1.2 | 每页 title / description / canonical / OG / JSON-LD |
| axios | 1.21.0 | 公开接口请求 |
| vitest | 5.0.5 | 单元测试 |
| @fontsource-variable/manrope、jetbrains-mono | 5.3.0 | 品牌字体（自托管，不请求 Google Fonts） |

视觉层不使用 UI 组件库与动画库：样式全部手写在 `src/styles/` 与各组件 `<style scoped>` 中，滚动入场用 IntersectionObserver + CSS transition。

## 主题切换

- `src/composables/useTheme.ts`：维护 `dark / light / system` 三种偏好，解析实际主题，监听 `prefers-color-scheme` 变化，写入 `localStorage`
- `src/components/ThemeToggle.vue`：导航栏右上角主题菜单，图标分别表示深色 / 浅色 / 跟随系统
- `index.html`：内联脚本在首屏渲染前应用已保存偏好，避免深色 ↔ 浅色闪烁
- 色板：`src/styles/tokens.css` 的 `:root`（深色）与 `:root[data-theme='light']`（浅色）；新增组件时优先使用 `--bg-* / --text-* / --border-*` 语义令牌
- 代码块、终端和桌面端产品窗口 mock 在浅色主题下仍保持深色，以保留终端质感

## 目录结构

```text
deploygo-web/
├── src/
│   ├── api/                 # axios 实例与 /public/* 请求
│   ├── components/          # 导航、页脚、产品窗口 mock、代码块、定价卡、购买意向弹窗等
│   ├── composables/         # 公开数据兜底、站点信息、锚点高亮
│   ├── data/                # fallback 数据、路由表、FAQ、能力文案、代码片段
│   ├── directives/          # v-reveal 滚动入场
│   ├── router/              # 路由表
│   ├── styles/              # 设计令牌 / 基础层 / 组件层
│   ├── templates/           # 8 个更新通知组件源码（来自 deploygo 开源仓库）
│   ├── utils/               # 格式化、sitemap 生成、SEO、复制与下载
│   └── views/               # 9 个页面
├── scripts/
│   ├── postbuild.ts         # 生成 robots.txt / sitemap.xml、复制 404.html、校验预渲染结果
│   └── generate-og-image.py # 一次性生成社交分享图（Pillow）
├── tests/                   # vitest 单元测试
├── nginx.conf               # 生产 Nginx：静态托管 + /api/ 反向代理 + 缓存与 gzip
├── Dockerfile               # node:24-alpine 构建 → nginx:alpine 运行
└── public/                  # favicon、社交分享图
```

## 本地开发

要求 Node 24 与 pnpm 11.24.0（见 `.node-version` 与 `package.json` 的 `packageManager`）。

```bash
pnpm install
pnpm dev          # http://localhost:5173，/api 代理到 http://127.0.0.1:3000
```

后端未启动也能正常开发与构建：所有公开数据都有本地 fallback，接口失败时静默保留 fallback，不显示错误状态。

## 构建与预览

```bash
pnpm build        # vite-ssg build + tsx scripts/postbuild.ts
pnpm preview      # 预览 dist，http://localhost:4173
```

`pnpm build` 之后：

- `dist/<route>/index.html`：8 个可索引页面 + `dist/404/index.html`
- `dist/sitemap.xml`、`dist/robots.txt`：由 `scripts/postbuild.ts` 生成
- `dist/404.html`：供 Nginx `error_page 404` 与静态托管使用

构建脚本会校验每个路由的预渲染 HTML 是否存在，缺失时以非零退出码失败。

## 环境变量

| 变量 | 默认 | 说明 |
|---|---|---|
| `VITE_API_BASE` | `/api` | API 基地址，客户端拼接 `/v1` |
| `VITE_SITE_URL` | `https://deploygo.example.com` | 站点域名，用于 canonical / og:url / sitemap / robots |

复制 `.env.example` 为 `.env` 后修改。Docker 构建时通过 `--build-arg` 传入：

```bash
docker build \
  --build-arg VITE_SITE_URL=https://your-domain.example \
  -t deploygo-web .
```

`VITE_SITE_URL` 影响构建产物里的绝对地址，发布前必须改成真实域名。

## 测试与类型检查

```bash
pnpm typecheck    # vue-tsc --noEmit
pnpm test         # vitest run
```

单测覆盖：

- 价格（分 → 元）、时长、价格周期、日期、字节、hash 等格式化函数
- fallback 数据完整性（套餐与契约一致、下载 sha256 合法、更新日志倒序、FAQ 唯一）
- 组件模板清单与挂载示例一一对应
- 路由表（唯一性、导航项、预渲染清单）与 sitemap / robots 生成函数

## 数据与兜底策略

| 页面 | 接口 | fallback 来源 |
|---|---|---|
| 站点信息（导航/页脚/联系方式） | `GET /public/site` | `src/data/site.ts` |
| 定价 | `GET /public/pricing` | `src/data/pricing.ts`（与后台默认套餐一致） |
| 下载 | `GET /public/downloads` | `src/data/downloads.ts` |
| 更新日志 | `GET /public/releases?limit=20` | `src/data/releases.ts`（取自 CHANGELOG.md） |

页面在 `onMounted` 后请求接口，成功且结构有效时覆盖 fallback；预渲染阶段不会请求接口，因此产出的 HTML 一定是完整文案。

## 部署

### Docker

```bash
docker build -t deploygo-web .
docker run --rm -p 8080:80 deploygo-web
```

容器内 Nginx：

- `/api/` 反向代理到 `http://api:3000`（compose 服务名 `api`），保证官网与公开接口同源
- 预渲染页面直接静态托管，`try_files $uri $uri/ $uri.html =404`
- `index.html` / `version.json` 不缓存，带 hash 的静态资源长期缓存
- 开启 gzip，未命中路由返回 404 页面

### 本地直接构建

```bash
pnpm build
# 把 dist/ 交给任意静态文件服务器
```

## 已知限制

- 未接入在线支付：购买按钮只提交购买意向，由人工确认后签发授权码。
- 站点域名来自构建期环境变量，构建产物不可在部署后动态改域名。
- 下载 fallback 数据中的地址指向官方 GitHub Releases 页面（真实 Cloudreve 直链由后台 `downloads` 表下发）。
- 更新通知组件源码为构建期 `?raw` 引入，修改 `src/templates/` 下的文件需重新构建。
