<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { describeApiError } from '@/api/client'
import { submitPurchaseIntent, type PurchaseIntentPayload } from '@/api/public'
import { resolveContactChannels } from '@/data/site'
import type { PricingPlan } from '@/data/pricing'
import { useSiteInfo } from '@/composables/useSiteInfo'
import { contactTypeLabel, formatPriceCompact, formatPriceCycle } from '@/utils/format'
import { copyText } from '@/utils/clipboard'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ plan: PricingPlan | null }>()

const CONTACT_TYPES: { value: PurchaseIntentPayload['contactType']; label: string }[] = [
  { value: 'wechat', label: '微信' },
  { value: 'qq', label: 'QQ' },
  { value: 'email', label: '邮箱' },
  { value: 'phone', label: '手机号' },
  { value: 'other', label: '其他' },
]

const form = ref({
  name: '',
  contact: '',
  contactType: 'wechat' as PurchaseIntentPayload['contactType'],
  note: '',
})
const errors = ref<{ name?: string; contact?: string }>({})
const submitting = ref(false)
const submitted = ref(false)
const serverError = ref('')
const copiedChannel = ref('')

const dialogRef = ref<HTMLElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)

const { site } = useSiteInfo()
const contactChannels = computed(() => resolveContactChannels(site.value))
const planTitle = computed(() => (props.plan ? `购买 ${props.plan.name}授权` : '提交购买意向'))
const payHint = computed(() => {
  if (!props.plan) return '按选择时的套餐确认价格'
  const cycle = formatPriceCycle(props.plan.durationValue, props.plan.durationUnit)
  return cycle === '一次买断' ? '一次买断' : `${cycle}计费，一次付清`
})

let lastFocused: HTMLElement | null = null
let copyTimer: ReturnType<typeof setTimeout> | null = null

function resetState(): void {
  form.value = { name: '', contact: '', contactType: 'wechat', note: '' }
  errors.value = {}
  serverError.value = ''
  submitted.value = false
  submitting.value = false
}

function close(): void {
  open.value = false
}

function validate(): boolean {
  const next: { name?: string; contact?: string } = {}
  const name = form.value.name.trim()
  const contact = form.value.contact.trim()

  if (!name) next.name = '请填写称呼，方便我们联系你。'
  else if (name.length > 60) next.name = '称呼请控制在 60 个字符以内。'

  if (contact.length < 3) next.contact = '请填写可用的联系方式。'
  else if (contact.length > 200) next.contact = '联系方式过长，请精简后重试。'
  else if (form.value.contactType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    next.contact = '邮箱格式看起来不对，请检查。'
  }

  errors.value = next
  return Object.keys(next).length === 0
}

async function handleSubmit(): Promise<void> {
  if (!validate() || !props.plan) return

  submitting.value = true
  serverError.value = ''
  try {
    await submitPurchaseIntent({
      name: form.value.name.trim(),
      contact: form.value.contact.trim(),
      contactType: form.value.contactType,
      planCode: props.plan.code,
      note: form.value.note.trim() || undefined,
    })
    submitted.value = true
    await nextTick()
    dialogRef.value?.querySelector<HTMLElement>('button')?.focus()
  } catch (error) {
    serverError.value = describeApiError(error)
  } finally {
    submitting.value = false
  }
}

async function handleCopyChannel(value: string): Promise<void> {
  const ok = await copyText(value)
  if (!ok) return
  copiedChannel.value = value
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedChannel.value = ''
  }, 2000)
}

function onKeydown(event: KeyboardEvent): void {
  if (!open.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab' || !dialogRef.value) return

  const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function lockScroll(): void {
  document.body.style.overflow = 'hidden'
}

function unlockScroll(): void {
  document.body.style.overflow = ''
}

watch(open, async (value) => {
  if (value) {
    resetState()
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    lockScroll()
    await nextTick()
    nameInput.value?.focus()
  } else {
    unlockScroll()
    lastFocused?.focus()
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  unlockScroll()
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-root">
        <div class="modal-backdrop" @click="close" />
        <div
          ref="dialogRef"
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purchase-title"
          aria-describedby="purchase-desc"
        >
          <button type="button" class="modal__close" aria-label="关闭购买意向弹窗" @click="close">
            <AppIcon name="close" :size="18" />
          </button>

          <template v-if="!submitted">
            <header class="modal__head">
              <p class="eyebrow">购买意向</p>
              <h2 id="purchase-title">{{ planTitle }}</h2>
              <p id="purchase-desc" class="modal__lead">
                留下联系方式，我们会确认套餐、金额与开票信息后签发授权码。
              </p>
              <div v-if="plan" class="modal__plan">
                <span class="chip chip--blue">{{ plan.name }}</span>
                <span class="chip">{{ plan.durationLabel }}</span>
                <strong class="mono">{{ formatPriceCompact(plan.priceCents) }}</strong>
                <span class="modal__plan-note">{{ payHint }}</span>
              </div>
            </header>

            <form class="modal__form" novalidate @submit.prevent="handleSubmit">
              <div class="field">
                <label for="intent-name">称呼 <span class="required">必填</span></label>
                <input
                  id="intent-name"
                  ref="nameInput"
                  v-model="form.name"
                  class="input"
                  type="text"
                  autocomplete="name"
                  placeholder="怎么称呼你"
                  :aria-invalid="Boolean(errors.name)"
                  :aria-describedby="errors.name ? 'intent-name-error' : undefined"
                />
                <p v-if="errors.name" id="intent-name-error" class="field__error">{{ errors.name }}</p>
              </div>

              <div class="modal__row">
                <div class="field">
                  <label for="intent-contact">联系方式 <span class="required">必填</span></label>
                  <input
                    id="intent-contact"
                    v-model="form.contact"
                    class="input"
                    type="text"
                    autocomplete="off"
                    placeholder="微信号 / 邮箱 / 手机号"
                    :aria-invalid="Boolean(errors.contact)"
                    aria-describedby="intent-contact-hint"
                  />
                  <p id="intent-contact-hint" class="field__hint">
                    只用于确认套餐与发送授权码，不会用于其他用途。
                  </p>
                  <p v-if="errors.contact" class="field__error">{{ errors.contact }}</p>
                </div>
                <div class="field">
                  <label for="intent-type">联系类型</label>
                  <select id="intent-type" v-model="form.contactType" class="select">
                    <option v-for="type in CONTACT_TYPES" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="field">
                <label for="intent-note">备注（可选）</label>
                <textarea
                  id="intent-note"
                  v-model="form.note"
                  class="textarea"
                  rows="3"
                  maxlength="500"
                  placeholder="例如：需要开票、想先确认试用流程、使用场景说明"
                />
              </div>

              <p v-if="serverError" class="modal__error" role="alert">
                {{ serverError }} 你也可以直接通过下方联系方式找到我们。
              </p>

              <div class="modal__actions">
                <button type="submit" class="btn btn--primary" :disabled="submitting">
                  {{ submitting ? '提交中…' : '提交购买意向' }}
                </button>
                <button type="button" class="btn btn--secondary" @click="close">取消</button>
              </div>

              <p class="modal__note">
                <AppIcon name="info" :size="14" />
                本期暂未接入在线支付：提交意向后由人工联系确认，不会产生任何线上扣款。
              </p>
            </form>
          </template>

          <template v-else>
            <div class="modal__success">
              <span class="modal__success-icon"><AppIcon name="check" :size="24" /></span>
              <h2 id="purchase-title">提交成功</h2>
              <p class="modal__lead">我们会尽快联系你，请留意你留下的联系方式。</p>
              <dl class="kv-list modal__summary">
                <div class="kv-list__row">
                  <dt class="kv-list__key">套餐</dt>
                  <dd class="kv-list__value">
                    {{ plan?.name }}（{{ plan?.durationLabel }}，{{ plan ? formatPriceCompact(plan.priceCents) : '' }}）
                  </dd>
                </div>
                <div class="kv-list__row">
                  <dt class="kv-list__key">联系类型</dt>
                  <dd class="kv-list__value">{{ contactTypeLabel(form.contactType) }}</dd>
                </div>
                <div class="kv-list__row">
                  <dt class="kv-list__key">联系方式</dt>
                  <dd class="kv-list__value mono">{{ form.contact }}</dd>
                </div>
              </dl>
              <button type="button" class="btn btn--primary" @click="close">知道了</button>
            </div>
          </template>

          <div class="modal__fallback">
            <p>如果长时间没有收到回复，可以直接通过这些渠道找到我们：</p>
            <ul class="modal__channels">
              <li v-for="channel in contactChannels" :key="channel.label">
                <span class="mono modal__channel-label">{{ channel.label }}</span>
                <a
                  v-if="channel.href"
                  :href="channel.href"
                  class="modal__channel-value"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ channel.value }}</a
                >
                <span v-else class="modal__channel-value">{{ channel.value }}</span>
                <button type="button" class="modal__copy" @click="handleCopyChannel(channel.value)">
                  {{ copiedChannel === channel.value ? '已复制' : '复制' }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(4, 7, 11, 0.76);
  backdrop-filter: blur(3px);
}

.modal {
  position: relative;
  width: min(560px, 100%);
  max-height: min(90vh, 880px);
  overflow-y: auto;
  padding: clamp(22px, 3vw, 32px);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg, #151b24 0%, #10151d 100%);
  box-shadow: var(--shadow-lg);
}

.modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.modal__close:hover {
  border-color: var(--border);
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal__head {
  display: grid;
  gap: 10px;
  padding-right: 32px;
}

.modal__head h2 {
  font-size: clamp(21px, 2.4vw, 25px);
  line-height: 1.25;
}

.modal__lead {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.modal__plan {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 10px 12px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-inset);
}

.modal__plan strong {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
}

.modal__plan-note {
  color: var(--text-muted);
  font-size: 12px;
}

.modal__form {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.modal__row {
  display: grid;
  gap: 16px;
}

@media (min-width: 560px) {
  .modal__row {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
}

.required {
  margin-left: 4px;
  color: var(--accent-red);
  font-size: 11px;
  font-weight: 600;
}

.modal__error {
  padding: 10px 12px;
  border: 1px solid var(--accent-red-line);
  border-radius: var(--radius-sm);
  background: var(--accent-red-soft);
  color: #ffbdb8;
  font-size: 13px;
  line-height: 1.6;
}

.modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modal__note {
  display: flex;
  align-items: start;
  gap: 7px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.modal__note :deep(svg) {
  margin-top: 2px;
  flex: none;
}

.modal__success {
  display: grid;
  gap: 12px;
  justify-items: start;
  padding-right: 32px;
}

.modal__success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid var(--accent-green-line);
  border-radius: 12px;
  background: var(--accent-green-soft);
  color: var(--accent-green);
}

.modal__summary {
  width: 100%;
  margin-top: 4px;
}

.modal__fallback {
  display: grid;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.modal__fallback > p {
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.6;
}

.modal__channels {
  display: grid;
  gap: 8px;
}

.modal__channels li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.modal__channel-label {
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.modal__channel-value {
  color: var(--text-primary);
  word-break: break-all;
}

.modal__copy {
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11.5px;
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.modal__copy:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur) var(--ease);
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    transform var(--dur) var(--ease),
    opacity var(--dur) var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  opacity: 0;
  transform: translateY(12px) scale(0.99);
}
</style>
