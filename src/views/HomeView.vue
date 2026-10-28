<script setup lang="ts">
import { computed } from 'vue'
import AppIcon, { type IconName } from '@/components/AppIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import ProductWindow from '@/components/ProductWindow.vue'
import ZeroDowntimeDiagram from '@/components/ZeroDowntimeDiagram.vue'
import { fetchPricing } from '@/api/public'
import { usePublicData } from '@/composables/usePublicData'
import {
  CAPABILITIES,
  CONDITIONAL_ITEMS,
  FIT_ITEMS,
  FLOW_STEPS,
  OPEN_SOURCE_COMPARISON,
  SECURITY_ITEMS,
  THREAT_MODEL_NOTE,
  UNFIT_ITEMS,
} from '@/data/content'
import { HOME_FAQ_IDS, pickFaqItems } from '@/data/faq'
import { FALLBACK_PRICING, PREVIEW_PLAN_CODES, type PricingPlan } from '@/data/pricing'
import { HOME_ROUTE } from '@/data/routes'
import { buildSoftwareApplicationJsonLd, usePageHead } from '@/utils/seo'
import { formatPriceCompact } from '@/utils/format'

usePageHead({
  title: HOME_ROUTE.title,
  description: HOME_ROUTE.description,
  path: HOME_ROUTE.path,
  jsonLd: buildSoftwareApplicationJsonLd(FALLBACK_PRICING),
})

const { data: plans } = usePublicData<PricingPlan[]>(FALLBACK_PRICING, fetchPricing)

const previewPlans = computed(() =>
  PREVIEW_PLAN_CODES.map((code) => plans.value.find((plan) => plan.code === code)).filter(
    (plan): plan is PricingPlan => Boolean(plan),
  ),
)

const faqItems = pickFaqItems(HOME_FAQ_IDS)

const CAPABILITY_ICONS: IconName[] = [
  'upload-cloud',
  'layers',
  'history',
  'refresh',
  'lock',
  'code',
]
const CAPABILITY_SPANS = ['span-7', 'span-5', 'span-4', 'span-4', 'span-4', 'span-12']
</script>

<template>
  <div class="home">
    <!-- ================= Hero ================= -->
    <section class="hero">
      <div class="container container--wide hero__inner">
        <div class="hero__copy">
          <p class="eyebrow">前端静态站点发布工具</p>
          <h1 class="hero__title">
            让前端发布<br />
            <span class="hero__stress">更稳</span>、更简单
          </h1>
          <p class="hero__lead">
            一键部署、版本管理、重复发布拦截与快速回滚，收进一个桌面端工具。
          </p>
          <div class="hero__actions">
            <RouterLink to="/download" class="btn btn--primary btn--lg">下载桌面端</RouterLink>
            <RouterLink to="/pricing" class="btn btn--secondary btn--lg">查看定价</RouterLink>
          </div>
        </div>
        <div class="hero__visual">
          <ProductWindow />
        </div>
      </div>
    </section>

    <section class="hero-facts" aria-label="产品要点">
      <div class="container container--wide hero-facts__inner">
        <div class="hero-fact">
          <span class="hero-fact__key mono">试用</span>
          <span class="hero-fact__value">90 天，无需注册</span>
        </div>
        <div class="hero-fact">
          <span class="hero-fact__key mono">接入</span>
          <span class="hero-fact__value">8 个框架的更新通知组件</span>
        </div>
        <div class="hero-fact">
          <span class="hero-fact__key mono">架构</span>
          <span class="hero-fact__value">纯本地，无云端中转</span>
        </div>
        <div class="hero-fact">
          <span class="hero-fact__key mono">仓库</span>
          <span class="hero-fact__value">MIT 开源，界面与方案完整公开</span>
        </div>
      </div>
    </section>

    <!-- ================= 核心能力 ================= -->
    <section id="capabilities" class="section">
      <div class="container container--wide">
        <div class="section-head">
          <h2>专为前端静态项目设计的发布体验</h2>
          <p>
            不是把后端服务的发布逻辑套过来，而是围绕 index.html、version.json 与带 hash 的静态资源，重新设计一条发布链路。
          </p>
        </div>

        <div class="grid-12 cap-grid">
          <article
            v-for="(capability, index) in CAPABILITIES"
            :key="capability.id"
            v-reveal="index * 40"
            class="cap"
            :class="[CAPABILITY_SPANS[index], { 'cap--wide': index === 5 }]"
          >
            <div class="cap__top">
              <span class="cap__icon"><AppIcon :name="CAPABILITY_ICONS[index] ?? 'info'" :size="17" /></span>
              <span class="cap__index mono">0{{ index + 1 }}</span>
            </div>
            <h3 class="cap__title">{{ capability.title }}</h3>
            <p class="cap__summary">{{ capability.summary }}</p>
            <ul v-if="index !== 5" class="cap__points">
              <li v-for="point in capability.points" :key="point">{{ point }}</li>
            </ul>
            <div v-else class="cap__semantics" aria-hidden="true">
              <div class="cap__node">
                <span class="mono">assets/*.a1b2c3.js</span>
                <span class="chip chip--muted">长缓存</span>
              </div>
              <div class="cap__node">
                <span class="mono">index.html</span>
                <span class="chip chip--yellow">不缓存</span>
              </div>
              <div class="cap__node">
                <span class="mono">version.json</span>
                <span class="chip chip--blue">轮询感知</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= 三步接入 ================= -->
    <section id="quickstart" class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>3 步完成一次稳定发布</h2>
          <p>
            业务项目只多一个组件，构建方式完全不变，发布动作收进桌面端。第一次配置完成后，日常发版只有两步：构建、点击。
          </p>
        </div>

        <ol class="steps">
          <li v-for="step in FLOW_STEPS" :key="step.index" v-reveal class="step">
            <div class="step__rail">
              <span class="step__num mono">{{ step.index }}</span>
            </div>
            <div class="step__body">
              <h3 class="step__title">{{ step.title }}</h3>
              <p class="step__summary">{{ step.summary }}</p>
              <p class="step__detail">{{ step.detail }}</p>
            </div>
          </li>
        </ol>

        <div class="quickstart-cta">
          <RouterLink to="/docs" class="btn btn--secondary">
            看接入文档
            <AppIcon name="arrow-right" :size="15" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ================= 零停机发布顺序 ================= -->
    <section id="release-order" class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>零停机发布，靠的是顺序</h2>
          <p>
            发布期间的每一次文件替换都可能造成白屏或版本错位。deploygo 内置的发布流程固定为三个阶段，顺序本身就是方案。
          </p>
        </div>
        <ZeroDowntimeDiagram />
      </div>
    </section>

    <!-- ================= 适用 / 不适用 ================= -->
    <section id="fit" class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>适合哪些项目</h2>
          <p>
            判断标准只有一条：能不能构建出静态产物，并由静态文件服务托管。框架不是限制，产物形态才是。
          </p>
        </div>

        <div class="grid-12 fit-grid">
          <div v-reveal class="span-6 fit-col fit-col--yes">
            <h3 class="fit-col__title">
              <span class="fit-col__icon"><AppIcon name="check" :size="15" :stroke-width="2.2" /></span>
              适合
            </h3>
            <ul class="check-list">
              <li v-for="item in FIT_ITEMS" :key="item">
                <span class="icon-slot"><AppIcon name="check" :size="15" :stroke-width="2" /></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <div v-reveal="80" class="span-6 fit-col fit-col--no">
            <h3 class="fit-col__title">
              <span class="fit-col__icon"><AppIcon name="minus" :size="15" /></span>
              暂不适合
            </h3>
            <ul class="check-list">
              <li v-for="item in UNFIT_ITEMS" :key="item">
                <span class="icon-slot"><AppIcon name="minus" :size="15" /></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="conditional">
          <span class="conditional__label mono">条件支持</span>
          <ul class="conditional__items">
            <li v-for="item in CONDITIONAL_ITEMS" :key="item" class="chip">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ================= 开源版 vs 完整版 ================= -->
    <section id="editions" class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>开源版与官方完整版</h2>
          <p>
            界面实现、更新通知组件与零停机发布方案完整开源；部署引擎与授权系统随官方完整版分发。开源仓库是方案与组件的分享，不是功能阉割的试用版。
          </p>
        </div>

        <div class="table-wrap" tabindex="0">
          <table class="data-table compare-table">
            <caption class="visually-hidden">开源版与官方完整版功能对比</caption>
            <thead>
              <tr>
                <th scope="col">内容</th>
                <th scope="col">开源仓库</th>
                <th scope="col">官方完整版</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in OPEN_SOURCE_COMPARISON" :key="row.label">
                <td>{{ row.label }}</td>
                <td>
                  <span class="compare-cell" :class="{ 'is-muted': !row.openSource.included }">
                    <AppIcon
                      :name="row.openSource.included ? 'check' : 'minus'"
                      :size="15"
                      :stroke-width="2"
                    />
                    {{ row.openSource.text }}
                  </span>
                </td>
                <td>
                  <span class="compare-cell" :class="{ 'is-muted': !row.full.included }">
                    <AppIcon :name="row.full.included ? 'check' : 'minus'" :size="15" :stroke-width="2" />
                    {{ row.full.text }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="editions-foot">
          <p class="editions-note">
            完整版从 GitHub Releases 分发，含 90 天免费试用；自行构建开源仓库得到的是展示版，部署操作会引导下载完整版。
          </p>
          <RouterLink to="/open-source" class="btn btn--ghost btn--sm">
            了解开源策略
            <AppIcon name="arrow-right" :size="14" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ================= 安全设计 ================= -->
    <section id="security" class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 security">
          <div class="span-4 security__intro">
            <div class="section-head">
              <h2>凭证不离开你的电脑</h2>
              <p>
                deploygo 是纯本地桌面应用，不内置任何远端服务。服务器凭证与部署流量只在你自己的电脑与服务器之间通过 SSH 直连。
              </p>
            </div>
            <div class="security__model">
              <span class="security__model-label mono">数据流</span>
              <p class="security__model-flow mono">
                你的电脑 <span class="security__arrow">──SSH──</span> 你的服务器
              </p>
              <p class="security__model-note">没有第三方中转，没有云端存储，删除应用数据目录即彻底删除凭证。</p>
            </div>
          </div>

          <ul class="span-8 security__list">
            <li v-for="(item, index) in SECURITY_ITEMS" :key="item.id" v-reveal="index * 40" class="security__item">
              <span class="security__index mono">0{{ index + 1 }}</span>
              <div class="security__body">
                <h3>{{ item.title }}</h3>
                <p class="security__summary">{{ item.summary }}</p>
                <p class="security__detail">{{ item.detail }}</p>
              </div>
            </li>
          </ul>
        </div>

        <p class="security__boundary">
          <AppIcon name="info" :size="15" />
          <span>{{ THREAT_MODEL_NOTE }}</span>
        </p>
      </div>
    </section>

    <!-- ================= 定价预览 ================= -->
    <section id="pricing-preview" class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>按时长购买授权</h2>
          <p>
            从月付到永久版，授权按使用时长计。90 天免费试用不需要注册，先验证完整工作流再决定买哪个周期。
          </p>
        </div>

        <div class="preview-plans">
          <article v-for="plan in previewPlans" :key="plan.code" class="preview-plan">
            <div class="preview-plan__head">
              <h3 class="preview-plan__name">{{ plan.name }}</h3>
              <span v-if="plan.badge" class="chip chip--blue">{{ plan.badge }}</span>
              <span class="preview-plan__duration mono">{{ plan.durationLabel }}</span>
            </div>
            <p class="preview-plan__desc">{{ plan.description }}</p>
            <p class="preview-plan__price">
              <span class="mono">{{ formatPriceCompact(plan.priceCents) }}</span>
              <s v-if="plan.originalPriceCents && plan.originalPriceCents > plan.priceCents" class="preview-plan__original mono">
                {{ formatPriceCompact(plan.originalPriceCents) }}
              </s>
            </p>
          </article>
        </div>

        <div class="preview-actions">
          <RouterLink to="/pricing" class="btn btn--secondary">查看定价</RouterLink>
          <p class="preview-note">购买流程暂未接入在线支付，提交意向后由人工确认套餐与金额。</p>
        </div>
      </div>
    </section>

    <!-- ================= FAQ ================= -->
    <section id="faq" class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 faq-grid">
          <div class="span-4 faq-grid__intro">
            <div class="section-head">
              <h2>发布前常见问题</h2>
              <p>关于购买、接入、缓存与安全的常见疑问。完整问答在 FAQ 页面。</p>
            </div>
            <RouterLink to="/faq" class="btn btn--ghost btn--sm">
              查看全部常见问题
              <AppIcon name="arrow-right" :size="14" />
            </RouterLink>
          </div>
          <div class="span-8">
            <FaqAccordion :items="faqItems" id-prefix="home-faq" />
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="把下一次发版交给流程"
      description="在业务项目里挂载通知组件，构建后回到桌面端点一次，剩下的交给 deploygo。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <RouterLink to="/docs" class="btn btn--secondary">阅读文档</RouterLink>
      </template>
    </CtaBand>
  </div>
</template>

<style scoped>
/* ================= Hero ================= */
.hero {
  position: relative;
  padding-block: clamp(36px, 4.6vw, 68px) clamp(40px, 5vw, 72px);
  overflow: hidden;
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(32px, 5vw, 56px);
  align-items: center;
}

.hero__copy {
  min-width: 0;
}

.hero__title {
  margin-top: 18px;
  font-size: clamp(36px, 5.2vw, 64px);
  line-height: 1.06;
  letter-spacing: -0.035em;
  font-weight: 800;
}

.hero__stress {
  position: relative;
  color: var(--accent-green);
}

.hero__stress::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.02em;
  height: 0.12em;
  background: rgba(63, 185, 80, 0.22);
  border-radius: 2px;
}

.hero__lead {
  margin-top: 20px;
  max-width: 34ch;
  color: var(--text-secondary);
  font-size: clamp(15.5px, 1.5vw, 17.5px);
  line-height: 1.72;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: clamp(24px, 3vw, 34px);
}

.hero__visual {
  min-width: 0;
}

/* ================= Hero 事实条 ================= */
.hero-facts {
  border-block: 1px solid var(--border-subtle);
  background: rgba(13, 17, 23, 0.45);
}

.hero-facts__inner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  padding-block: 0;
}

.hero-fact {
  display: grid;
  gap: 4px;
  padding: 16px 4px 16px 0;
}

.hero-fact__key {
  color: var(--accent-blue);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-fact__value {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

/* ================= 能力 ================= */
.cap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, rgba(21, 27, 36, 0.82), rgba(14, 19, 26, 0.86));
  transition:
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}

.cap:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.cap__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cap__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-inset);
  color: var(--accent-blue);
}

.cap__index {
  color: #4d5866;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.cap__title {
  font-size: 17.5px;
  letter-spacing: -0.01em;
}

.cap__summary {
  color: var(--text-secondary);
  font-size: 13.8px;
  line-height: 1.7;
  max-width: 52ch;
}

.cap__points {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 12px;
}

.cap__points li {
  padding: 3px 8px;
  border: 1px solid var(--border-subtle);
  border-radius: 5px;
  color: var(--text-muted);
  font-family: var(--font-code);
  font-size: 10.5px;
  letter-spacing: 0.01em;
}

.cap--wide {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 32px;
}

.cap--wide .cap__top {
  order: 1;
}

.cap--wide .cap__title,
.cap--wide .cap__summary {
  order: 2;
  width: 100%;
}

.cap--wide .cap__title {
  width: auto;
}

.cap--wide .cap__summary {
  flex: 1 1 320px;
  padding-top: 0;
}

.cap--wide .cap__top {
  width: 100%;
}

.cap__semantics {
  order: 3;
  flex: 1 1 340px;
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-code);
}

.cap__node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #a9b7c6;
  font-size: 11.5px;
}

/* ================= 三步 ================= */
.steps {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border-subtle);
}

.step {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 16px;
  padding: 22px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.step__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--bg-inset);
  color: var(--accent-blue);
  font-size: 12px;
}

.step__title {
  font-size: 18px;
}

.step__summary {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 14.5px;
  line-height: 1.7;
}

.step__detail {
  margin-top: 6px;
  max-width: 66ch;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.65;
}

.quickstart-cta {
  margin-top: 28px;
}

/* ================= 适用 ================= */
.fit-col {
  padding: 22px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: rgba(17, 22, 31, 0.55);
}

.fit-col--yes {
  border-top: 2px solid var(--accent-green-line);
}

.fit-col--no {
  border-top: 2px solid var(--border-strong);
}

.fit-col__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}

.fit-col__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--bg-inset);
  border: 1px solid var(--border);
}

.fit-col--yes .fit-col__icon {
  color: var(--accent-green);
  border-color: var(--accent-green-line);
  background: var(--accent-green-soft);
}

.fit-col--no .fit-col__icon {
  color: var(--text-muted);
}

.conditional {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.conditional__label {
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.conditional__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ================= 版本对比 ================= */
.compare-table {
  min-width: 720px;
}

.compare-cell {
  display: inline-flex;
  align-items: start;
  gap: 8px;
}

.compare-cell :deep(svg) {
  margin-top: 3px;
  flex: none;
  color: var(--accent-green);
}

.compare-cell.is-muted :deep(svg) {
  color: var(--text-muted);
}

.compare-table tbody td:nth-child(2),
.compare-table tbody td:nth-child(3) {
  width: 30%;
}

.editions-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.editions-note {
  max-width: 70ch;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.65;
}

/* ================= 安全 ================= */
.security {
  align-items: start;
}

.security__intro {
  display: grid;
  gap: 20px;
  align-content: start;
}

.security__model {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--accent-green-line);
  border-radius: 8px;
  background: rgba(17, 22, 31, 0.6);
}

.security__model-label {
  color: var(--accent-green);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.security__model-flow {
  color: var(--text-primary);
  font-size: 12.5px;
  line-height: 1.7;
}

.security__arrow {
  color: var(--accent-blue);
}

.security__model-note {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.security__list {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border-subtle);
}

.security__item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.security__index {
  color: #4d5866;
  font-size: 11px;
  padding-top: 3px;
}

.security__body h3 {
  font-size: 16px;
  letter-spacing: -0.01em;
}

.security__summary {
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.security__detail {
  margin-top: 5px;
  max-width: 62ch;
  color: var(--text-muted);
  font-size: 12.8px;
  line-height: 1.65;
}

.security__boundary {
  display: flex;
  align-items: start;
  gap: 10px;
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: rgba(17, 22, 31, 0.6);
  color: var(--text-muted);
  font-size: 12.8px;
  line-height: 1.7;
}

.security__boundary :deep(svg) {
  margin-top: 2px;
  flex: none;
  color: var(--accent-yellow);
}

/* ================= 定价预览 ================= */
.preview-plans {
  display: grid;
  border-top: 1px solid var(--border);
}

.preview-plan {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px 24px;
  padding: 20px 2px;
  border-bottom: 1px solid var(--border-subtle);
}

.preview-plan__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.preview-plan__name {
  font-size: 18px;
}

.preview-plan__duration {
  color: var(--text-muted);
  font-size: 11.5px;
  letter-spacing: 0.03em;
}

.preview-plan__desc {
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.6;
}

.preview-plan__price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
}

.preview-plan__original {
  color: #7d8590;
  font-size: 13px;
  font-weight: 400;
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 24px;
}

.preview-note {
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.6;
}

/* ================= FAQ ================= */
.faq-grid__intro {
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: start;
}

/* ================= 响应式 ================= */
@media (min-width: 640px) {
  .hero-facts__inner {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .hero-fact {
    padding: 18px 16px;
    border-left: 1px solid var(--border-subtle);
  }

  .hero-fact:first-child {
    border-left: 0;
    padding-left: 0;
  }
}

@media (min-width: 901px) {
  .hero__inner {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: clamp(32px, 4vw, 64px);
  }

  .steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 0;
    gap: 28px;
  }

  .step {
    position: relative;
    grid-template-columns: minmax(0, 1fr);
    padding: 0;
    border-bottom: 0;
  }

  .step__rail {
    position: relative;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  .step__rail::after {
    content: '';
    position: absolute;
    left: 46px;
    right: 0;
    top: 18px;
    height: 1px;
    background: var(--border);
  }

  .step:last-child .step__rail::after {
    display: none;
  }

  .preview-plan {
    grid-template-columns: 210px minmax(0, 1fr) 190px;
    align-items: center;
    padding: 18px 4px;
  }

  .preview-plan__price {
    justify-self: end;
  }
}
</style>
