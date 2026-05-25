<template>
  <div class="order-list-page wb-page wb-page--tabbed">
    <nav-bar :title="$route.meta.title" />

    <section class="order-list__hero">
      <div class="order-list__hero__main">
        <span class="order-list__hero__label">订单状态</span>
        <h1 class="order-list__hero__title">{{ currentTabTitle }}</h1>
      </div>

      <div class="order-list__hero__stats">
        <div class="order-list__hero__stat">
          <span>订单数</span>
          <strong>{{ orderList.length }}</strong>
        </div>
        <div class="order-list__hero__stat">
          <span>商品件数</span>
          <strong>{{ totalGoodsCount }}</strong>
        </div>
      </div>
    </section>

    <van-tabs
      v-model:active="activeIndex"
      :swipe-threshold="5"
      sticky
      offset-top="92"
      type="line"
      class="order-list__tabs"
      @change="handleTabChange"
    >
      <van-tab
        v-for="(tabTitle, index) in tabTitles"
        :key="index"
        :name="index"
        :title="tabTitle"
      >
        <van-pull-refresh
          v-model="refreshing"
          class="order-list__refresh"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="order-list__content">
              <div v-if="orderListEmptyShow" class="order-list__empty">
                <div class="order-list__empty__panel">
                  <h2 class="order-list__empty__title">暂无{{ currentTabTitle }}订单</h2>
                  <p class="order-list__empty__hint">先逛逛精选好物，挑一件喜欢的吧</p>
                </div>
              </div>

              <div
                v-for="order in orderList"
                :key="order.id || order.orderSn"
                class="order-card"
                @click="toOrderDetail(order.orderSn)"
              >
                <header class="order-card__head">
                  <div class="order-card__serial">
                    <span class="order-card__serial-label">订单编号</span>
                    <span class="order-card__serial-value">{{ order.orderSn }}</span>
                  </div>
                  <span class="order-card__status">{{ order.orderStatusText }}</span>
                </header>

                <article
                  v-for="goods in order.goodsList || []"
                  :key="goods.id || goods.goodsId"
                  class="order-goods"
                >
                  <div class="order-goods__media">
                    <img :src="goods.picUrl" :alt="goods.goodsName" />
                  </div>

                  <div class="order-goods__content">
                    <div class="order-goods__head">
                      <h3 class="order-goods__title">{{ goods.goodsName }}</h3>
                      <span class="order-goods__quantity">x{{ goods.number }}</span>
                    </div>

                    <div
                      v-if="(goods.specifications || []).length"
                      class="order-goods__specs"
                    >
                      <span
                        v-for="(spec, idx) in goods.specifications"
                        :key="idx"
                        class="order-goods__spec"
                      >
                        {{ spec }}
                      </span>
                    </div>

                    <div class="order-goods__footer">
                      <span class="order-goods__price">¥{{ yuan(goods.price || 0) }}</span>
                      <van-button
                        v-if="order.handleOption?.comment && goods.comment === 0"
                        round
                        class="order-goods__comment"
                        @click.stop="commentGoods(goods.id, goods.goodsId)"
                      >
                        去评价
                      </van-button>
                    </div>
                  </div>
                </article>

                <div class="order-card__summary">
                  <div class="order-card__summary__total">
                    <span class="order-card__summary__label">合计</span>
                    <strong class="order-card__summary__value">
                      ¥{{ yuan(order.actualPrice || 0) }}
                    </strong>
                  </div>
                  <span class="order-card__summary__meta">
                    含运费 ¥{{ yuan(order.post_fee || order.freightPrice || 0) }}
                  </span>
                </div>

                <div v-if="hasActions(order)" class="order-card__actions">
                  <van-button
                    v-if="order.handleOption?.cancel"
                    round
                    class="order-action"
                    @click.stop="cancelOrder(order.id)"
                  >
                    取消订单
                  </van-button>
                  <van-button
                    v-if="order.handleOption?.refund"
                    round
                    class="order-action"
                    @click.stop="refundOrder(order.id)"
                  >
                    退款/售后
                  </van-button>
                  <van-button
                    v-if="order.handleOption?.delete"
                    round
                    class="order-action"
                    @click.stop="delOrder(order.id)"
                  >
                    删除订单
                  </van-button>
                  <van-button
                    v-if="order.handleOption?.confirm"
                    round
                    class="order-action order-action--primary"
                    @click.stop="confirmOrder(order.id)"
                  >
                    确认收货
                  </van-button>
                  <van-button
                    v-if="order.handleOption?.pay"
                    round
                    class="order-action order-action--primary"
                    @click.stop="toPay(order.orderSn, order.actualPrice)"
                  >
                    去支付
                  </van-button>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

import {
  orderCancel,
  orderConfirm,
  orderDelete,
  orderList as listOrder,
  orderRefund,
} from '@/api/order'
import { yuan } from '@/filter'

const router = useRouter()
const route = useRoute()

const normalizeType = (value) => {
  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 4) {
    return 0
  }
  return parsed
}

const routeType = computed(() => {
  return normalizeType(route.params.active ?? route.query.type)
})

const state = reactive({
  activeIndex: routeType.value,
  tabTitles: ['全部', '待付款', '待发货', '待收货', '已完成'],
  orderList: [],
  refreshing: false,
  page: 0,
  limit: 10,
  loading: false,
  orderListEmptyShow: false,
  finished: false,
})

const {
  activeIndex,
  tabTitles,
  orderList,
  refreshing,
  page,
  limit,
  loading,
  orderListEmptyShow,
  finished,
} = toRefs(state)

const currentTabTitle = computed(() => {
  return tabTitles.value[activeIndex.value] || '全部'
})

const totalGoodsCount = computed(() => {
  return orderList.value.reduce((total, order) => {
    return total + (order.goodsList || []).reduce((goodsTotal, goods) => {
      return goodsTotal + Number(goods.number || 0)
    }, 0)
  }, 0)
})

const hasActions = (order) => {
  const handleOption = order.handleOption || {}
  return Boolean(
    handleOption.cancel ||
      handleOption.pay ||
      handleOption.refund ||
      handleOption.confirm ||
      handleOption.delete
  )
}

// van-list @load 回调 — 只负责加载下一页
const onLoad = async () => {
  page.value += 1
  try {
    const res = await listOrder({
      showType: routeType.value,
      type: routeType.value,
      pageNum: page.value,
      pageSize: limit.value,
      sortName: 'updateTime,createTime',
      sortOrder: 'desc',
    })
    const list = res.data?.data || []
    orderList.value.push(...list)
    finished.value = (res.data?.page || 0) >= (res.data?.pages || 0)
    if (page.value === 1 && list.length === 0) {
      orderListEmptyShow.value = true
    }
  } catch (error) {
    page.value = Math.max(0, page.value - 1)
    showToast({ type: 'fail', message: error?.message || '订单列表加载失败' })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 重置状态，让 van-list 重新触发 @load
const init = () => {
  page.value = 0
  orderList.value = []
  finished.value = false
  loading.value = false
  orderListEmptyShow.value = false
  onLoad()
}

const onRefresh = () => {
  init()
  onLoad()
}

const refreshListWithToast = (message) => {
  init()
  onLoad()
  showToast({ type: 'success', message })
}

const delOrder = (id) => {
  showDialog({
    message: '确认要删除该订单吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderDelete(id)
      refreshListWithToast('订单已删除')
    })
    .catch(() => {})
}

const cancelOrder = (id) => {
  showDialog({
    message: '确认要取消该订单吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderCancel(id)
      refreshListWithToast('订单已取消')
    })
    .catch(() => {})
}

const refundOrder = (id) => {
  showDialog({
    message: '确认要提交退款申请吗？',
    showCancelButton: true,
  })
    .then(async () => {
      await orderRefund(id)
      refreshListWithToast('已提交退款申请')
    })
    .catch(() => {})
}

const confirmOrder = (id) => {
  showDialog({
    message: '请确认已收到货物，确认收货后将无法撤销',
    showCancelButton: true,
  })
    .then(async () => {
      await orderConfirm(id)
      refreshListWithToast('已确认收货')
    })
    .catch(() => {})
}

const commentGoods = (orderGoodsId, goodsId) => {
  router.push({
    path: `/goodsComment/${orderGoodsId}/${goodsId}`,
  })
}

const toPay = (orderSn, actualPrice) => {
  router.push({
    name: 'OrderPay',
    query: { orderSn, actualPrice },
  })
}

const handleTabChange = (name) => {
  const nextType = normalizeType(name)
  if (nextType === routeType.value) {
    return
  }

  router.replace({
    name: 'OrderList',
    params: { active: String(nextType) },
    query: {
      ...route.query,
      type: String(nextType),
    },
  })
}

const toOrderDetail = (orderSn) => {
  router.push({
    path: `/order/detail/${orderSn}`,
  })
}

watch(
  routeType,
  (nextType) => {
    activeIndex.value = nextType
    init()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: #f5f5f7;
}

.order-list__hero {
  width: calc(100% - 36px);
  max-width: calc(var(--wb-content-width) - 36px);
  margin: 0 auto 16px;
  padding: 28px 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 28px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
}

.order-list__hero__main {
  min-width: 0;
}

.order-list__hero__label {
  display: block;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-list__hero__title {
  margin-top: 12px;
  font-size: 48px;
  line-height: 1.04;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.4px;
}

.order-list__hero__stats {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 28px;
  padding-left: 28px;
  border-left: 1px solid rgba(29, 29, 31, 0.08);
}

.order-list__hero__stat {
  min-width: 88px;
  text-align: center;
}

.order-list__hero__stat span {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-list__hero__stat strong {
  display: block;
  margin-top: 12px;
  font-size: 44px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.order-list__refresh {
  min-height: 50vh;
}

.order-list__content {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 18px 140px;
}

.order-list__empty__panel {
  margin-top: 24px;
  padding: 40px 28px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.order-list__empty__title {
  font-size: 36px;
  line-height: 1.18;
  font-weight: 700;
  color: #1d1d1f;
}

.order-list__empty__hint {
  margin-top: 12px;
  font-size: 28px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.5);
}

:deep(.van-tabs__wrap) {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  // padding: 0 18px 16px;
  background: rgba(245, 245, 247, 0.86);
  backdrop-filter: saturate(180%) blur(18px);
}

:deep(.van-tabs__nav) {
  padding: 8px;
  // border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}

:deep(.van-tabs__line) {
  bottom: 12px;
  width: 32px !important;
  height: 6px;
  // border-radius: 999px;
  background: #0071e3;
}

:deep(.van-tab) {
  flex: 1;
  padding: 0;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.62);
}

:deep(.van-tab--active) {
  color: #0071e3;
  font-weight: 700;
}

.order-card {
  margin-top: 18px;
  padding: 26px 26px 22px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
}

.order-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.order-card__serial {
  min-width: 0;
  flex: 1;
}

.order-card__serial-label {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-card__serial-value {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  line-height: 1.3;
  color: #1d1d1f;
  word-break: break-all;
}

.order-card__status {
  flex: none;
  height: 44px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 26px;
  line-height: 1;
  font-weight: 600;
}

.order-goods {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  border-radius: 26px;
  background: #f5f5f7;
}

.order-goods__media {
  width: 116px;
  height: 116px;
  overflow: hidden;
  border-radius: 22px;
  background: #ffffff;
}

.order-goods__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-goods__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-goods__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.order-goods__title {
  flex: 1;
  font-size: 30px;
  line-height: 1.3;
  font-weight: 600;
  color: #1d1d1f;
  word-break: break-word;
}

.order-goods__quantity {
  flex: none;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-goods__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.order-goods__spec {
  padding: 6px 14px;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 26px;
  line-height: 1.2;
}

.order-goods__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.order-goods__price {
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.order-card__summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.order-card__summary__total {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
}

.order-card__summary__label,
.order-card__summary__meta {
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.order-card__summary__value {
  font-size: 32px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.order-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

:deep(.van-button.order-action) {
  height: 56px;
  min-width: 132px;
  padding: 0 22px;
  border-radius: 999px;
  border-color: rgba(29, 29, 31, 0.14);
  background: #ffffff;
  color: #1d1d1f;
  font-size: 26px;
  line-height: 1;
  font-weight: 600;
}

:deep(.van-button.order-action--primary) {
  border-color: #0071e3;
  background: #0071e3;
  color: #ffffff;
}

:deep(.van-button.order-goods__comment) {
  height: 50px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 26px;
  line-height: 1;
}

@media (max-width: 375px) {
  .order-list__hero {
    width: calc(100% - 32px);
    padding: 22px 22px;
    gap: 18px;
  }

  .order-list__hero__title {
    font-size: 42px;
  }

  .order-list__hero__stat strong {
    font-size: 40px;
  }

  .order-list__hero__stats {
    gap: 20px;
    padding-left: 20px;
  }

  .order-list__content {
    padding-left: 16px;
    padding-right: 16px;
  }

  :deep(.van-tabs__wrap) {
    padding-left: 16px;
    padding-right: 16px;
  }

  .order-card {
    padding: 22px 22px 20px;
  }

  .order-goods {
    grid-template-columns: 104px minmax(0, 1fr);
    padding: 18px;
  }

  .order-goods__media {
    width: 104px;
    height: 104px;
  }

  .order-card__summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
