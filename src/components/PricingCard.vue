<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { hasOriginalPrice, type PricingPlan } from '@/data/pricing'
import { durationInMonths, formatPriceCompact, formatPriceCycle } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    plan: PricingPlan
    featured?: boolean
  }>(),
  { featured: false },
)

const emit = defineEmits<{ select: [plan: PricingPlan] }>()

const originalPrice = computed(() =>
  hasOriginalPrice(props.plan) && props.plan.originalPriceCents !== null
    ? formatPriceCompact(props.plan.originalPriceCents)
    : '',
)

const cycleLabel = computed(() => formatPriceCycle(props.plan.durationValue, props.plan.durationUnit))

const monthlyPrice = computed(() => {
  if (props.plan.isLifetime) return ''
  const months = durationInMonths(props.plan.durationValue, props.plan.durationUnit)
  if (!months || months < 3) return ''
  return formatPriceCompact(Math.round(props.plan.priceCents / months))
})
</script>

<template>
  <article class="plan-card" :class="{ 'plan-card--featured': featured }">
    <header class="plan-card__head">
      <div class="plan-card__title-row">
        <h3 class="plan-card__name">{{ plan.name }}</h3>
        <span v-if="plan.badge" class="chip chip--blue">{{ plan.badge }}</span>
      </div>
      <p class="plan-card__duration">{{ plan.durationLabel }}授权</p>
    </header>

    <div class="plan-card__price-row">
      <span class="plan-card__price mono">{{ formatPriceCompact(plan.priceCents) }}</span>
      <span class="plan-card__unit">{{ cycleLabel }}</span>
    </div>

    <div class="plan-card__compare">
      <span v-if="originalPrice" class="plan-card__original">原价 <s>{{ originalPrice }}</s></span>
      <span v-if="monthlyPrice" class="plan-card__monthly">约 {{ monthlyPrice }} / 月</span>
    </div>

    <p class="plan-card__desc">{{ plan.description }}</p>

    <ul class="check-list plan-card__features">
      <li v-for="feature in plan.features" :key="feature">
        <span class="icon-slot"><AppIcon name="check" :size="15" :stroke-width="2" /></span>
        <span>{{ feature }}</span>
      </li>
    </ul>

    <button
      type="button"
      class="btn btn--block"
      :class="featured ? 'btn--primary' : 'btn--secondary'"
      @click="emit('select', plan)"
    >
      购买此套餐
    </button>
  </article>
</template>

<style scoped>
.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 20px 20px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, rgba(21, 27, 36, 0.92), rgba(15, 20, 28, 0.94));
  transition:
    border-color var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}

.plan-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.plan-card--featured {
  border-color: var(--accent-blue-line);
  background: linear-gradient(180deg, rgba(25, 33, 45, 0.96), rgba(16, 21, 29, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(88, 166, 255, 0.16),
    0 0 0 1px rgba(88, 166, 255, 0.1),
    var(--shadow-md);
}

.plan-card__head {
  display: grid;
  gap: 4px;
}

.plan-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.plan-card__name {
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.plan-card__duration {
  color: var(--text-muted);
  font-family: var(--font-code);
  font-size: 11.5px;
  letter-spacing: 0.03em;
}

.plan-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.plan-card__price {
  color: var(--text-primary);
  font-size: clamp(30px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.plan-card__unit {
  color: var(--text-muted);
  font-size: 12.5px;
}

.plan-card__compare {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  min-height: 18px;
  font-size: 12px;
}

.plan-card__original {
  color: var(--text-muted);
}

.plan-card__original s {
  color: #7d8590;
}

.plan-card__monthly {
  color: var(--accent-green);
}

.plan-card__desc {
  color: var(--text-secondary);
  font-size: 13.5px;
  line-height: 1.65;
}

.plan-card__features {
  flex: 1;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.plan-card__features li {
  font-size: 13.5px;
}
</style>
