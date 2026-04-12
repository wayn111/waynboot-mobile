<template>
  <div class="order-detail-page">
    <div v-if="loading" class="loading">
      <van-loading type="spinner">加载中...</van-loading>
    </div>

    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>

    <div v-if="!loading" class="order-detail">
      <div>订单编号: {{ orderInfo.orderSn || '--' }}</div>
      <div>订单状态: {{ orderInfo.orderStatusText || '--' }}</div>
      <div>下单时间: {{ orderInfo.createTime || '--' }}</div>
      <div>支付方式: {{ orderInfo.payTypeText || '--' }}</div>
      <div>支付时间: {{ orderInfo.payTime || '--' }}</div>
      <div>运费: {{ yuan(orderInfo.freightPrice || 0) }}</div>
      <div>订单金额: {{ yuan(orderInfo.orderPrice || 0) }}</div>
      <div>实付金额: {{ yuan(orderInfo.actualPrice || 0) }}</div>
      <div>退款金额: {{ yuan(orderInfo.refundAmount || 0) }}</div>
      <div>收货地址: {{ orderInfo.address || '--' }}</div>
      <div>用户留言: {{ orderInfo.message || '--' }}</div>

      <van-card
        v-for="goods in orderInfo.orderGoodsVOList || []"
        :key="goods.id || goods.goodsId"
        :title="goods.goodsName"
        :num="goods.number"
        :price="yuan(goods.price || 0)"
        :thumb="goods.picUrl"
      >
        <template #desc>
          <div class="desc">
            <van-tag
              v-for="(spec, idx) in goods.specifications || []"
              :key="idx"
              plain
              style="margin-right: 6px"
            >
              {{ spec }}
            </van-tag>
          </div>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import { orderDetail } from '@/api/order'
import { yuan } from '@/filter'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  orderSn: {
    type: String,
    default: '',
  },
})

const state = reactive({
  orderInfo: {},
  loading: true,
})

const { orderInfo, loading } = toRefs(state)

const currentOrderSn = props.orderSn || route.params.orderSn || ''

const getOrderDetail = async () => {
  if (!currentOrderSn) {
    loading.value = false
    showToast({
      type: 'fail',
      message: '订单号不能为空',
    })
    router.replace('/user/order/list/0')
    return
  }

  try {
    const res = await orderDetail(currentOrderSn)
    orderInfo.value = res.data || {}
  } catch (error) {
    showToast({
      type: 'fail',
      message: error?.message || '订单详情加载失败',
    })
    router.replace('/user/order/list/0')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOrderDetail()
})
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.order-detail {
  padding: 10px 20px;

  > div:nth-child(-n + 11) {
    margin-top: 1vh;
  }

  .van-card {
    background-color: #f9f8f8;
    padding: 15px 20px;
    margin-top: 2vh;
  }

  .van-card__header {
    text-align: right;

    .van-button {
      margin-left: 10px;
      min-width: 70px;
      height: 32px;
    }
  }
}
</style>
