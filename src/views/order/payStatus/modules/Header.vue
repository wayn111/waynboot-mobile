<template>
  <div class="pay-status-card">
    <div class="pay-status-card__icon" :class="`pay-status-card__icon--${iconTone}`">
      <van-icon :name="isSuccess ? 'checked' : 'clear'" size="34" />
    </div>

    <div class="pay-status-card__copy">
      <h1 class="pay-status-card__title">{{ statusText }}</h1>
      <p class="pay-status-card__desc">{{ statusDesc }}</p>
    </div>

    <div class="pay-status-card__actions">
      <router-link class="pay-status-card__action" to="/" replace>返回首页</router-link>
      <router-link
        class="pay-status-card__action pay-status-card__action--primary"
        :to="`/user/order/list/${orderStatus}`"
        replace
      >
        查看订单
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
})

const currentStatus = computed(() => {
  return props.status || route.query.status || ''
})

const isSuccess = computed(() => currentStatus.value === 'success')

const statusText = computed(() => {
  if (currentStatus.value === 'cancel') {
    return '支付已取消'
  }
  return isSuccess.value ? '支付成功' : '支付失败'
})

const statusDesc = computed(() => {
  if (currentStatus.value === 'cancel') {
    return '订单仍保留在列表中，稍后可以重新选择支付方式。'
  }
  return isSuccess.value
    ? '订单已提交，后续发货和售后进度可在订单列表继续查看。'
    : '本次支付没有完成，可返回订单列表重新发起支付。'
})

const iconTone = computed(() => {
  return isSuccess.value ? 'success' : 'muted'
})

const orderStatus = computed(() => {
  return isSuccess.value ? 2 : 0
})
</script>

<style lang="scss" scoped>
.pay-status-card {
  padding: 42px 28px 30px;
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.pay-status-card__icon {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto;
}

.pay-status-card__icon--success {
  background: rgba(0, 113, 227, 0.1);
  color: #0071e3;
}

.pay-status-card__icon--muted {
  background: rgba(29, 29, 31, 0.08);
  color: rgba(29, 29, 31, 0.72);
}

.pay-status-card__copy {
  margin-top: 24px;
  text-align: center;
}

.pay-status-card__title {
  font-size: 44px;
  line-height: 1.08;
  font-weight: 600;
  color: #1d1d1f;
}

.pay-status-card__desc {
  margin-top: 16px;
  font-size: 28px;
  line-height: 1.5;
  color: rgba(29, 29, 31, 0.68);
}

.pay-status-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 32px;
}

.pay-status-card__action {
  min-height: 56px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(29, 29, 31, 0.12);
  background: #ffffff;
  color: #1d1d1f;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.pay-status-card__action--primary {
  border-color: #0071e3;
  background: #0071e3;
  color: #ffffff;
}

@media (max-width: 375px) {
  .pay-status-card {
    padding: 36px 20px 24px;
  }

  .pay-status-card__actions {
    grid-template-columns: 1fr;
  }
}
</style>
