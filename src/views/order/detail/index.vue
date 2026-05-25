<template>
  <div class="order-detail-page wb-page">
    <nav-bar :title="$route.meta.title" />

    <div v-if="loading" class="loading">
      <van-loading type="spinner">加载中...</van-loading>
    </div>

    <main v-else class="order-detail">
      <section class="order-summary">
        <div class="order-summary__top">
          <div class="order-summary__main">
            <span class="order-summary__label">订单状态</span>
            <h1 class="order-summary__status" :class="`order-summary__status--${statusTone}`">
              {{ orderInfo.orderStatusText || '--' }}
            </h1>
          </div>
          <div class="order-summary__amount">
            <span>实付金额</span>
            <strong>¥{{ yuan(orderInfo.actualPrice || 0) }}</strong>
          </div>
        </div>

        <div class="order-summary__serial">
          <span>订单编号</span>
          <strong>{{ orderInfo.orderSn || '--' }}</strong>
        </div>

        <div class="order-summary__grid">
          <div
            v-for="item in heroRows"
            :key="item.label"
            class="order-summary__grid__item"
          >
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="order-section">
        <div class="order-section__head">
          <h2 class="order-section__title">商品清单</h2>
          <span class="order-section__meta">{{ goodsCount }} 件</span>
        </div>

        <article
          v-for="goods in goodsList"
          :key="goods.id || goods.goodsId"
          class="goods-card"
        >
          <div class="goods-card__media">
            <img :src="goods.picUrl" :alt="goods.goodsName" />
          </div>

          <div class="goods-card__content">
            <div class="goods-card__head">
              <h3 class="goods-card__title">{{ goods.goodsName }}</h3>
              <span class="goods-card__quantity">x{{ goods.number || 0 }}</span>
            </div>

            <div class="goods-card__specs">
              <span
                v-for="(spec, idx) in goods.specifications || []"
                :key="idx"
                class="goods-card__spec"
              >
                {{ spec }}
              </span>
            </div>

            <div class="goods-card__footer">
              <span class="goods-card__price">¥{{ yuan(goods.price || 0) }}</span>
              <van-button
                v-if="orderInfo.handleOption?.comment && goods.comment === 0"
                round
                class="goods-card__comment"
                @click.stop="commentGoods(goods.id, goods.goodsId)"
              >
                去评价
              </van-button>
            </div>
          </div>
        </article>
      </section>

      <section class="order-section">
        <div class="order-section__head">
          <h2 class="order-section__title">金额明细</h2>
        </div>

        <div
          v-for="item in amountRows"
          :key="item.label"
          class="order-row"
          :class="{ 'order-row--strong': item.emphasis }"
        >
          <span class="order-row__label">{{ item.label }}</span>
          <span class="order-row__value">{{ item.value }}</span>
        </div>
      </section>

      <section class="order-section">
        <div class="order-section__head">
          <h2 class="order-section__title">收货信息</h2>
        </div>

        <div class="contact-list">
          <div class="contact-list__item">
            <span>收货地址</span>
            <strong>{{ orderInfo.address || '--' }}</strong>
          </div>
          <div class="contact-list__item">
            <span>用户留言</span>
            <strong>{{ orderInfo.message || '无' }}</strong>
          </div>
        </div>
      </section>
    </main>

    <footer v-if="!loading && actionButtonList.length" class="order-actions">
      <van-button
        v-for="button in actionButtonList"
        :key="button.key"
        round
        class="order-actions__button"
        :class="{ 'order-actions__button--primary': button.primary }"
        @click="onAction(button.key)"
      >
        {{ button.text }}
      </van-button>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

import {
  orderCancel,
  orderConfirm,
  orderDelete,
  orderDetail,
  orderRefund,
} from '@/api/order'
import { yuan } from '@/filter'
import {
  buildOrderAmountRows,
  getPayTypeText,
} from './order-detail-view.mjs'

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

const goodsList = computed(() => {
  return orderInfo.value.orderGoodsVOList || []
})

const goodsCount = computed(() => {
  return goodsList.value.reduce((total, item) => total + Number(item.number || 0), 0)
})

const statusTone = computed(() => {
  const statusText = String(orderInfo.value.orderStatusText || '')
  if (statusText.includes('待')) {
    return 'pending'
  }
  if (statusText.includes('取消') || statusText.includes('关闭')) {
    return 'muted'
  }
  return 'success'
})

const heroRows = computed(() => {
  return [
    {
      label: '下单时间',
      value: orderInfo.value.createTime || '--',
    },
    {
      label: '支付方式',
      value: getPayTypeText(orderInfo.value),
    },
    {
      label: '支付时间',
      value: orderInfo.value.payTime || '--',
    },
    {
      label: '商品件数',
      value: `${goodsCount.value} 件`,
    },
  ]
})

const amountRows = computed(() => {
  return buildOrderAmountRows(orderInfo.value)
})

const actionButtonList = computed(() => {
  const handleOption = orderInfo.value.handleOption || {}
  return [
    {
      key: 'cancel',
      text: '取消订单',
      show: handleOption.cancel,
    },
    {
      key: 'refund',
      text: '退款/售后',
      show: handleOption.refund,
    },
    {
      key: 'confirm',
      text: '确认收货',
      show: handleOption.confirm,
      primary: true,
    },
    {
      key: 'pay',
      text: '去支付',
      show: handleOption.pay,
      primary: true,
    },
    {
      key: 'delete',
      text: '删除订单',
      show: handleOption.delete,
    },
  ].filter((button) => button.show)
})

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

const refreshDetailWithToast = async (message) => {
  await getOrderDetail()
  showToast({
    type: 'success',
    message,
  })
}

const cancelOrder = () => {
  showDialog({
    message: '确认要取消该订单吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderCancel(orderInfo.value.id)
      await refreshDetailWithToast('订单已取消')
    })
    .catch(() => {})
}

const refundOrder = () => {
  showDialog({
    message: '确认要提交退款申请吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderRefund(orderInfo.value.id)
      await refreshDetailWithToast('已提交退款申请')
    })
    .catch(() => {})
}

const confirmOrder = () => {
  showDialog({
    message: '请确认已收到货物，确认收货后将无法撤销',
    showCancelButton: true,
  })
    .then(async () => {
      await orderConfirm(orderInfo.value.id)
      await refreshDetailWithToast('已确认收货')
    })
    .catch(() => {})
}

const deleteOrder = () => {
  showDialog({
    message: '确认要删除该订单吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderDelete(orderInfo.value.id)
      showToast({
        type: 'success',
        message: '订单已删除',
      })
      router.replace('/user/order/list/0')
    })
    .catch(() => {})
}

const toPay = () => {
  router.push({
    name: 'OrderPay',
    query: {
      orderSn: orderInfo.value.orderSn,
      actualPrice: orderInfo.value.actualPrice,
    },
  })
}

const commentGoods = (orderGoodsId, goodsId) => {
  router.push({
    path: `/goodsComment/${orderGoodsId}/${goodsId}`,
  })
}

const onAction = (key) => {
  const actionMap = {
    cancel: cancelOrder,
    refund: refundOrder,
    confirm: confirmOrder,
    pay: toPay,
    delete: deleteOrder,
  }

  actionMap[key]?.()
}

onMounted(() => {
  getOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 46%, #f5f5f7 100%);
}

.loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(14px);
}

.order-detail {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 18px 18px calc(128px + env(safe-area-inset-bottom, 0px));
}

.order-summary,
.order-section {
  margin-bottom: 18px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.order-summary {
  padding: 26px 24px;
}

.order-summary__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: start;
}

.order-summary__label,
.order-summary__amount span,
.order-summary__serial span,
.order-summary__grid__item span,
.contact-list__item span {
  display: block;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-summary__status {
  margin-top: 10px;
  font-size: 48px;
  line-height: 1.04;
  font-weight: 700;
  color: #1d1d1f;
}

.order-summary__status--pending {
  color: #0066cc;
}

.order-summary__status--success {
  color: #0071e3;
}

.order-summary__status--muted {
  color: rgba(29, 29, 31, 0.62);
}

.order-summary__amount {
  min-width: 180px;
  padding-left: 24px;
  border-left: 1px solid rgba(29, 29, 31, 0.08);
  text-align: right;
}

.order-summary__amount strong {
  display: block;
  margin-top: 12px;
  font-size: 42px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.order-summary__serial {
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid rgba(29, 29, 31, 0.08);
}

.order-summary__serial strong {
  display: block;
  margin-top: 10px;
  font-size: 30px;
  line-height: 1.35;
  font-weight: 600;
  color: #1d1d1f;
  word-break: break-all;
}

.order-summary__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px 22px;
  margin-top: 22px;
  border-top: 1px solid rgba(29, 29, 31, 0.08);
}

.order-summary__grid__item {
  min-width: 0;
  padding-top: 20px;
}

.order-summary__grid__item strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  line-height: 1.4;
  font-weight: 600;
  color: #1d1d1f;
  word-break: break-word;
}

.order-section {
  padding: 24px;
}

.order-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.order-section__title {
  font-size: 36px;
  line-height: 1.12;
  font-weight: 700;
  color: #1d1d1f;
}

.order-section__meta {
  flex: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.goods-card {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 18px;
  padding: 18px 0;
  border-top: 1px solid rgba(29, 29, 31, 0.08);
}

.goods-card:first-of-type {
  padding-top: 0;
  border-top: none;
}

.goods-card:last-of-type {
  padding-bottom: 0;
}

.goods-card__media {
  width: 118px;
  height: 118px;
  overflow: hidden;
  border-radius: 24px;
  background: #f5f5f7;
}

.goods-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-card__content {
  min-width: 0;
}

.goods-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.goods-card__title {
  font-size: 30px;
  line-height: 1.3;
  font-weight: 700;
  color: #1d1d1f;
  word-break: break-word;
}

.goods-card__quantity {
  flex: none;
  font-size: 28px;
  line-height: 1.25;
  color: rgba(29, 29, 31, 0.5);
}

.goods-card__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.goods-card__spec {
  padding: 6px 14px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
}

.goods-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.goods-card__price {
  font-size: 36px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

:deep(.goods-card__comment) {
  height: 52px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 28px;
  line-height: 1;
}

.order-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 0;
  border-top: 1px solid rgba(29, 29, 31, 0.08);
}

.order-section__head + .order-row {
  border-top: none;
  padding-top: 0;
}

.order-row:last-child {
  padding-bottom: 0;
}

.order-row__label,
.order-row__value {
  font-size: 28px;
  line-height: 1.35;
}

.order-row__label {
  color: rgba(29, 29, 31, 0.6);
}

.order-row__value {
  font-weight: 600;
  color: #1d1d1f;
  text-align: right;
}

.order-row--strong .order-row__label,
.order-row--strong .order-row__value {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
}

.contact-list {
  display: grid;
  gap: 18px;
}

.contact-list__item {
  padding-top: 18px;
  border-top: 1px solid rgba(29, 29, 31, 0.08);
}

.contact-list__item:first-child {
  padding-top: 0;
  border-top: none;
}

.contact-list__item strong {
  display: block;
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.5;
  font-weight: 600;
  color: #1d1d1f;
}

.order-actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 16px 18px calc(16px + env(safe-area-inset-bottom, 0px));
  background: rgba(245, 245, 247, 0.86);
  backdrop-filter: saturate(180%) blur(18px);
}

:deep(.order-actions__button) {
  min-width: 136px;
  height: 64px;
  padding: 0 22px;
  border-radius: 999px;
  border-color: rgba(29, 29, 31, 0.12);
  background: #ffffff;
  color: #1d1d1f;
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
}

:deep(.order-actions__button--primary) {
  border-color: #0071e3;
  background: #0071e3;
  color: #ffffff;
}

@media (max-width: 375px) {
  .order-detail {
    padding-right: 16px;
    padding-left: 16px;
  }

  .order-summary,
  .order-section {
    border-radius: 28px;
  }

  .order-summary {
    padding: 22px 20px;
  }

  .order-summary__top {
    grid-template-columns: minmax(0, 1fr);
  }

  .order-summary__amount {
    min-width: 0;
    padding-top: 20px;
    padding-left: 0;
    border-top: 1px solid rgba(29, 29, 31, 0.08);
    border-left: none;
    text-align: left;
  }

  .goods-card {
    grid-template-columns: 104px minmax(0, 1fr);
  }

  .goods-card__media {
    width: 104px;
    height: 104px;
  }

  .order-actions {
    flex-wrap: wrap;
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
