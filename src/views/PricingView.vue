<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import CtaBand from '@/components/CtaBand.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import PageHero from '@/components/PageHero.vue'
import PricingCard from '@/components/PricingCard.vue'
import PurchaseIntentModal from '@/components/PurchaseIntentModal.vue'
import { fetchPricing } from '@/api/public'
import { usePublicData } from '@/composables/usePublicData'
import { PURCHASE_STEPS } from '@/data/content'
import { pickFaqItems } from '@/data/faq'
import { FALLBACK_PRICING, type PricingPlan } from '@/data/pricing'
import { findRouteByPath } from '@/data/routes'
import { usePageHead } from '@/utils/seo'
import { formatPriceCompact } from '@/utils/format'

const route = findRouteByPath('/pricing')
usePageHead({
  title: route?.title ?? '定价 · deploygo',
  description: route?.description ?? '',
  path: '/pricing',
})

const { data: plans } = usePublicData<PricingPlan[]>(FALLBACK_PRICING, fetchPricing)

const modalOpen = ref(false)
const selectedPlan = ref<PricingPlan | null>(null)

const faqItems = pickFaqItems(['payment', 'license-form', 'devices', 'upgrade'])
const cheapestPrice = computed(() => {
  const prices = plans.value.map((plan) => plan.priceCents)
  return prices.length > 0 ? formatPriceCompact(Math.min(...prices)) : '¥15.00'
})

const meta = [
  { label: '试用', value: '90 天免费试用，无需注册' },
  { label: '授权', value: '一码一机，可在换机时重置激活' },
  { label: '支付', value: '本期未接入在线支付，提交意向后人工联系' },
]

function openPurchase(plan: PricingPlan): void {
  selectedPlan.value = plan
  modalOpen.value = true
}
</script>

<template>
  <div class="pricing">
    <PageHero
      eyebrow="定价"
      title="按时长购买授权"
      lead="deploygo 的授权按时长计费，从月付到永久版共 6 个周期。90 天免费试用不需要注册，先验证完整发布流程，再决定买哪个周期。"
      :meta="meta"
      wide
    />

    <section class="section section--tight">
      <div class="container container--wide">
        <div class="payment-note" role="note">
          <AppIcon name="info" :size="16" />
          <p>
            本期<strong>暂未接入在线支付</strong>：点击「购买此套餐」会打开购买意向表单，提交后我们会通过你留下的联系方式确认套餐、金额与开票信息，再人工签发授权码。
            <RouterLink to="/faq">查看购买相关问答</RouterLink>
          </p>
        </div>

        <div class="plans">
          <PricingCard
            v-for="plan in plans"
            :key="plan.code"
            :plan="plan"
            :featured="plan.badge === '推荐'"
            @select="openPurchase"
          />
        </div>

        <p class="plans-foot">
          最低 {{ cheapestPrice }} 起，所有套餐使用同一套完整部署引擎；价格与套餐以页面上展示的最新数据为准。
        </p>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>购买流程</h2>
          <p>没有在线支付，所以购买是人工确认的过程。每一步都会留下记录，确认清楚再付款。</p>
        </div>

        <ol class="purchase-steps">
          <li v-for="step in PURCHASE_STEPS" :key="step.index" v-reveal class="purchase-step">
            <span class="purchase-step__index mono">{{ step.index }}</span>
            <h3 class="purchase-step__title">{{ step.title }}</h3>
            <p class="purchase-step__detail">{{ step.detail }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="grid-12 license">
          <div class="span-4 license__intro">
            <div class="section-head">
              <h2>授权说明</h2>
              <p>授权码带签名、可离线校验。下面是购买前最常被问到的规则。</p>
            </div>
            <RouterLink to="/docs" class="btn btn--secondary btn--sm">
              查看激活与接入文档
              <AppIcon name="arrow-right" :size="14" />
            </RouterLink>
          </div>

          <div class="span-8">
            <div class="table-wrap" tabindex="0">
              <table class="data-table license-table">
                <caption class="visually-hidden">授权规则说明</caption>
                <tbody>
                  <tr>
                    <th scope="row">授权形式</th>
                    <td>带签名的授权码字符串，在桌面端激活页粘贴即可，不需要联网也能校验。</td>
                  </tr>
                  <tr>
                    <th scope="row">有效期</th>
                    <td>从首次激活时间起算，按购买时长计算；永久版为长期有效。</td>
                  </tr>
                  <tr>
                    <th scope="row">设备绑定</th>
                    <td>一码一机。同一设备重复激活是幂等的，不会重置有效期。</td>
                  </tr>
                  <tr>
                    <th scope="row">换电脑</th>
                    <td>可联系管理员重置激活后重新绑定，原设备记录会被释放。</td>
                  </tr>
                  <tr>
                    <th scope="row">离线内网</th>
                    <td>可以本地激活，激活方式记为手工登记；后台不会记录在线激活时间。</td>
                  </tr>
                  <tr>
                    <th scope="row">升级置换</th>
                    <td>按生效中授权的剩余时长折算金额抵扣新套餐，旧授权同时作废。</td>
                  </tr>
                  <tr>
                    <th scope="row">开源协议</th>
                    <td>开源仓库与更新通知组件采用 MIT 协议，可自由用于商业项目。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--divided">
      <div class="container container--wide">
        <div class="section-head">
          <h2>购买前常见问题</h2>
        </div>
        <FaqAccordion :items="faqItems" id-prefix="pricing-faq" />
      </div>
    </section>

    <CtaBand
      title="先试用，再决定"
      description="下载官方完整版即可获得 90 天试用，不需要注册，也不会收集你的服务器信息。"
    >
      <template #actions>
        <RouterLink to="/download" class="btn btn--primary">下载桌面端</RouterLink>
        <RouterLink to="/docs" class="btn btn--secondary">阅读文档</RouterLink>
      </template>
    </CtaBand>

    <PurchaseIntentModal v-model:open="modalOpen" :plan="selectedPlan" />
  </div>
</template>

<style scoped>
.payment-note {
  display: flex;
  align-items: start;
  gap: 10px;
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 1px solid var(--accent-yellow-line);
  border-radius: var(--radius-sm);
  background: var(--accent-yellow-soft);
  color: var(--text-gold);
  font-size: 13.5px;
  line-height: 1.7;
}

.payment-note :deep(svg) {
  margin-top: 2px;
  flex: none;
  color: var(--accent-yellow);
}

.payment-note strong {
  color: var(--text-gold-strong);
}

.payment-note a {
  color: var(--text-gold-link);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.plans {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.plans-foot {
  margin-top: 18px;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.6;
}

/* —— 购买流程 —— */
.purchase-steps {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border-subtle);
}

.purchase-step {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 4px 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.purchase-step__index {
  grid-row: span 2;
  color: var(--accent-blue);
  font-size: 12px;
  padding-top: 3px;
}

.purchase-step__title {
  font-size: 16px;
}

.purchase-step__detail {
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.65;
}

/* —— 授权说明 —— */
.license__intro {
  display: grid;
  gap: 8px;
  align-content: start;
  justify-items: start;
}

.license-table {
  min-width: 520px;
}

.license-table th {
  width: 128px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: normal;
  text-transform: none;
  white-space: normal;
  vertical-align: top;
}

@media (min-width: 640px) {
  .plans {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .purchase-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: 0;
    gap: 0 32px;
  }
}

@media (min-width: 1000px) {
  .plans {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .purchase-steps {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
