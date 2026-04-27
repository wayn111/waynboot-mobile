<template>
  <div>
    <div class="cart-submit">
      <div class="cart-submit__main">
        <van-checkbox
          v-model="checked"
          class="cart-submit__check"
          icon-size="18px"
          :checked-color="variables.theme"
        >
          全选
        </van-checkbox>

        <div class="cart-submit__summary">
          <span class="cart-submit__label">待结算</span>
          <strong class="cart-submit__amount">¥{{ displayAmount }}</strong>
          <span class="cart-submit__meta">已选 {{ selectedIds.length }} 款商品</span>
        </div>
      </div>

      <button
        type="button"
        class="cart-submit__button"
        :class="{ 'cart-submit__button--disabled': !canSubmit }"
        :disabled="!canSubmit"
        @click="onSubmit"
      >
        去结算
      </button>
    </div>
    <div class="cart-submit-placeholder" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { yuan } from '@/filter'
import variables from '@/styles/variables.scss?inline'

const router = useRouter()
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const onSubmit = () => {
  if (props.amount <= 0 || props.selectedIds.length <= 0) {
    showToast({
      type: 'fail',
      message: '请至少选择一件商品',
    })
    return
  }

  router.push({
    path: '/order/confirm',
    query: {
      cartIds: props.selectedIds.join(','),
    },
  })
}

const checked = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const canSubmit = computed(() => {
  return props.amount > 0
})

const displayAmount = computed(() => {
  return yuan(props.amount || 0)
})
</script>

<style scoped>
.cart-submit {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: calc(122px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  padding: 18px 18px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
}

.cart-submit__main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-submit__check {
  flex: none;
  margin-right: 0;
}

.cart-submit__summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cart-submit__label {
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.cart-submit__amount {
  font-size: 42px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.cart-submit__meta {
  font-size: 26px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.56);
}

.cart-submit__button {
  flex: none;
  min-width: 164px;
  height: 60px;
  padding: 0 28px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
}

.cart-submit__button--disabled {
  background: rgba(29, 29, 31, 0.14);
  color: rgba(29, 29, 31, 0.42);
}

.cart-submit-placeholder {
  width: 100%;
  height: 170px;
}

:deep(.van-checkbox__label) {
  font-size: 28px;
  line-height: 1.2;
  color: #1d1d1f;
}

:deep(.van-checkbox__icon .van-icon) {
  border-color: rgba(29, 29, 31, 0.12);
  background: #f5f5f7;
}

@media (max-width: 375px) {
  .cart-submit {
    left: 20px;
    right: 20px;
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .cart-submit__button {
    width: 100%;
  }
}
</style>
