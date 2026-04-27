<template>
  <div class="payment wb-page">
    <nav-bar :title="$route.meta.title" />

    <div class="payment__body">
      <section class="payment__summary">
        <span class="payment__summary__label">待支付金额</span>
        <h1 class="payment__summary__amount">¥{{ yuan(actualPrice) }}</h1>
        <div class="payment__summary__sn">
          <span>{{ orderSn || '--' }}</span>
          <button type="button" class="payment__summary__copy" @click="copyOrderSn">
            <van-icon name="description" />
          </button>
        </div>
        <p class="payment__summary__notice">请在 30 分钟内完成支付，逾期订单将自动关闭。</p>
      </section>

      <section class="payment__panel">
        <div class="payment__panel__head">
          <h2 class="payment__panel__title">支付方式</h2>
          <span class="payment__panel__meta">{{ payWayLabel }}</span>
        </div>

        <div class="payment__methods">
          <button
            type="button"
            class="payment__method"
            :class="{ 'payment__method--active': payWay === 'test' }"
            @click="payWay = 'test'"
          >
            <div class="payment__method__label">
              <span class="payment__method__icon">T</span>
              <div class="payment__method__info">
                <span class="payment__method__text">测试支付方式</span>
                <span class="payment__method__hint">快速体验支付流程</span>
              </div>
            </div>
            <span class="payment__method__indicator" />
          </button>

          <button
            type="button"
            class="payment__method"
            :class="{ 'payment__method--active': payWay === 'ali' }"
            @click="payWay = 'ali'"
          >
            <div class="payment__method__label">
              <img src="../../../assets/images/ali_pay.png" alt="支付宝" width="96" height="34" />
              <div class="payment__method__info">
                <span class="payment__method__text">支付宝</span>
                <span class="payment__method__hint">安全便捷，推荐使用</span>
              </div>
            </div>
            <span class="payment__method__indicator" />
          </button>

          <button
            type="button"
            class="payment__method"
            :class="{ 'payment__method--active': payWay === 'wx' }"
            @click="payWay = 'wx'"
          >
            <div class="payment__method__label">
              <img src="../../../assets/images/wx_pay.png" alt="微信支付" width="128" height="26" />
              <div class="payment__method__info">
                <span class="payment__method__text">微信支付</span>
                <span class="payment__method__hint">亿万用户的选择</span>
              </div>
            </div>
            <span class="payment__method__indicator" />
          </button>
        </div>
      </section>

      <div class="payment__submit">
        <div class="payment__submit__summary">
          <span class="payment__submit__label">应付金额</span>
          <strong class="payment__submit__amount">¥{{ yuan(actualPrice) }}</strong>
        </div>
        <button type="button" class="payment__submit__button" @click="pay">
          确认支付
        </button>
      </div>

      <div class="payment__submit-placeholder" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showLoadingToast, showToast } from 'vant'

import { orderPrepay } from '@/api/pay'
import { yuan } from '@/filter'

const router = useRouter()
const route = useRoute()

const state = reactive({
  payWay: '',
  orderSn: '',
  actualPrice: 0,
})

const { payWay, orderSn, actualPrice } = toRefs(state)

const payWayLabel = computed(() => {
  if (payWay.value === 'wx') {
    return '微信支付'
  }
  if (payWay.value === 'ali') {
    return '支付宝'
  }
  if (payWay.value === 'test') {
    return '测试支付'
  }
  return '未选择'
})

const goPayStatus = (status) => {
  router.replace({
    name: 'PayStatus',
    query: { status },
  })
}

const ensurePayContext = () => {
  const queryOrderSn = route.query.orderSn
  if (typeof queryOrderSn !== 'string' || !queryOrderSn) {
    showToast({
      type: 'fail',
      message: '订单信息已失效，请返回订单列表重新支付',
    })
    router.replace('/user/order/list/0')
    return false
  }

  orderSn.value = queryOrderSn
  actualPrice.value = Number(route.query.actualPrice || 0)
  return true
}

const pay = async () => {
  if (!ensurePayContext()) {
    return
  }

  if (!payWay.value) {
    showToast({
      type: 'fail',
      message: '请选择支付方式',
    })
    return
  }

  const returnUrl = `${window.location.origin}${window.location.pathname}#/order/payStatus?status=success`

  try {
    if (payWay.value === 'wx') {
      const res = await orderPrepay({
        orderSn: orderSn.value,
        payType: 5,
        returnUrl,
      })
      window.location.href = res.data.epayurl
      return
    }

    if (payWay.value === 'ali') {
      showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '支付中，请稍后...',
      })
      const res = await orderPrepay({
        orderSn: orderSn.value,
        payType: 4,
        returnUrl,
      })
      window.location.href = res.data.epayurl
      return
    }

    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: '支付中，请稍后...',
    })
    await orderPrepay({
      orderSn: orderSn.value,
      payType: 99,
    })
    goPayStatus('success')
  } catch (error) {
    console.log(error)
    goPayStatus('failed')
  }
}

const copyOrderSn = async () => {
  if (!orderSn.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(orderSn.value)
    showToast({
      type: 'success',
      message: '订单号已复制',
    })
  } catch (error) {
    showToast({
      type: 'fail',
      message: '复制失败',
    })
  }
}

onMounted(() => {
  ensurePayContext()
})
</script>

<style lang="scss" scoped>
.payment__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
}

.payment__summary,
.payment__panel {
  padding: 24px 22px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.payment__panel {
  margin-top: 18px;
}

.payment__summary__label {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.payment__summary__amount {
  margin-top: 16px;
  font-size: 104px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.payment__summary__sn {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 30px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.72);
  word-break: break-all;
}

.payment__summary__copy {
  width: 42px;
  height: 42px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.56);
}

.payment__summary__notice {
  margin-top: 16px;
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.6);
}

.payment__panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.payment__panel__title {
  font-size: 56px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.payment__panel__meta {
  font-size: 28px;
  line-height: 1.2;
  color: #1677ff;
}

.payment__methods {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
}

.payment__method {
  width: 100%;
  padding: 18px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid rgba(29, 29, 31, 0.06);
  border-radius: 24px;
  background: #ffffff;
  text-align: left;
}

.payment__method--active {
  border-color: rgba(22, 119, 255, 0.22);
  background: rgba(22, 119, 255, 0.06);
}

.payment__method__label {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.payment__method__text {
  font-size: 38px;
  line-height: 1.2;
  font-weight: 600;
  color: #1d1d1f;
}

.payment__method__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment__method__hint {
  font-size: 28px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.48);
}

.payment__method__icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.12);
  color: #1677ff;
  font-size: 24px;
  font-weight: 700;
}

.payment__method__indicator {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  border: 2px solid rgba(29, 29, 31, 0.22);
  background: #ffffff;
}

.payment__method--active .payment__method__indicator {
  border-color: #1677ff;
  background: radial-gradient(circle, #1677ff 0 44%, #ffffff 48% 100%);
}

.payment__submit {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: 24px;
  z-index: 5;
  padding: 18px 18px calc(18px + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
}

.payment__submit__summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment__submit__label {
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.payment__submit__amount {
  font-size: 52px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.payment__submit__button {
  flex: none;
  min-width: 198px;
  height: 62px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
}

.payment__submit-placeholder {
  width: 100%;
  height: 126px;
}

img {
  vertical-align: middle;
}

@media (max-width: 375px) {
  .payment__body {
    padding: 16px 20px 24px;
  }

  .payment__submit {
    left: 20px;
    right: 20px;
  }
}
</style>
