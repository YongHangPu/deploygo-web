# ============ 构建阶段 ============
FROM node:24-alpine AS build

WORKDIR /app

# 使用与仓库一致的 pnpm 版本（package.json packageManager: pnpm@11.24.0）
RUN npm install -g pnpm@11.24.0

# 先只安装依赖，利用镜像层缓存
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# 构建期注入的站点配置（sitemap / canonical / og:url 使用 VITE_SITE_URL）
ARG VITE_API_BASE=/api
ARG VITE_SITE_URL=https://deploygo.example.com
ENV VITE_API_BASE=${VITE_API_BASE} \
    VITE_SITE_URL=${VITE_SITE_URL}

RUN pnpm build

# ============ 运行阶段 ============
FROM nginx:alpine AS runtime

# 站点配置：静态托管 + /api/ 反向代理到 compose 服务 api:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 预渲染站点（每个路由是 dist/<route>/index.html）
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
