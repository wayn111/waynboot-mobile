<template>
  <div class="payment">
    <nav-bar :title="$route.meta.title" />

    <van-notice-bar mode="closeable">
      请在半小时内完成支付，否则系统将自动取消订单
    </van-notice-bar>

    <van-cell-group class="payment_group">
      <van-cell title="订单编号" :value="orderSn || '--'" />
      <van-cell title="实付金额">
        <span class="red">{{ yuan(actualPrice) }}</span>
      </van-cell>
    </van-cell-group>

    <div class="pay_way_group">
      <div class="pay_way_title">选择支付方式</div>
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell clickable @click="payWay = 'test'">
            <template #title>
              <p class="pay_way_label">测试支付方式</p>
            </template>
            <template #right-icon>
              <van-radio name="test" />
            </template>
          </van-cell>
          <van-cell clickable @click="payWay = 'ali'">
            <template #title>
              <img
                src="../../../assets/images/ali_pay.png"
                alt="支付宝"
                width="82"
                height="29"
              />
            </template>
            <template #right-icon>
              <van-radio name="ali" />
            </template>
          </van-cell>
          <van-cell clickable @click="payWay = 'wx'">
            <template #title>
              <img
                src="../../../assets/images/wx_pay.png"
                alt="微信支付"
                width="113"
                height="23"
              />
            </template>
            <template #right-icon>
              <van-radio name="wx" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <van-button class="pay_submit" type="primary" @click="pay">
      去支付
    </van-button>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

onMounted(() => {
  ensurePayContext()
})
</script>

<style lang="scss" scoped>
$mb2vw: 2vw;

.payment {
  min-height: 100vh;
  background: #f5f5f5;

  .van-notice-bar {
    margin-bottom: $mb2vw;
  }

  .payment_group {
    margin-bottom: $mb2vw;
  }

  .pay_submit {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .pay_way_group img {
    vertical-align: middle;
  }

  .pay_way_title {
    padding: 5vw 4vw;
    background-color: #fff;
  }

  .pay_way_label {
    font-size: 17px;
  }
}
</style>
