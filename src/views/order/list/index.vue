<template>
  <div class="order-list-page">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>

    <van-tabs
      v-model:active="activeIndex"
      :swipe-threshold="5"
      sticky
      offset-top="46"
      type="line"
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
          style="min-height: calc(1334px - 84px)"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :immediate-check="false"
            @load="getOrderList"
          >
             <van-empty v-if="orderListEmptyShow" description="您还没有相关订单" />

            <div
              v-for="order in orderList"
              :key="order.id || order.orderSn"
              class="order-item"
              @click="toOrderDetail(order.orderSn)"
            >
              <div class="order-title">
                <div class="order-sn">订单编号: {{ order.orderSn }}</div>
                <div class="order-status">{{ order.orderStatusText }}</div>
              </div>

              <van-card
                v-for="goods in order.goodsList || []"
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

                <template #footer>
                  <van-button
                    v-if="order.handleOption?.comment && goods.comment === 0"
                    size="mini"
                    @click.stop="commentGoods(goods.id, goods.goodsId)"
                  >
                    去评价
                  </van-button>
                </template>
              </van-card>

              <div class="total">
                合计: {{ yuan(order.actualPrice || 0) }}（含运费{{ yuan(order.post_fee || order.freightPrice || 0) }}）
              </div>

              <div class="footer-btn">
                <van-button
                  v-if="order.handleOption?.cancel"
                  round
                  size="small"
                  @click.stop="cancelOrder(order.id)"
                >
                  取消订单
                </van-button>
                <van-button
                  v-if="order.handleOption?.pay"
                  round
                  size="small"
                  type="danger"
                  plain
                  @click.stop="toPay(order.orderSn, order.actualPrice)"
                >
                  去支付
                </van-button>
                <van-button
                  v-if="order.handleOption?.refund"
                  round
                  size="small"
                  @click.stop="refundOrder(order.id)"
                >
                  退款/售后
                </van-button>
                <van-button
                  v-if="order.handleOption?.confirm"
                  round
                  plain
                  size="small"
                  @click.stop="confirmOrder(order.id)"
                >
                  确认收货
                </van-button>
                <van-button
                  v-if="order.handleOption?.delete"
                  round
                  size="small"
                  @click.stop="delOrder(order.id)"
                >
                  删除订单
                </van-button>
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

const init = () => {
  page.value = 0
  orderList.value = []
  finished.value = false
  orderListEmptyShow.value = false
  getOrderList(true)
}

const onRefresh = () => {
  refreshing.value = true
  page.value = 0
  orderList.value = []
  finished.value = false
  getOrderList(true)
}

const getOrderList = async (initLoad = false) => {
  if (loading.value || finished.value) {
    refreshing.value = false
    return
  }

  loading.value = true
  orderListEmptyShow.value = false
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

    if (initLoad && list.length <= 0) {
      orderListEmptyShow.value = true
    }
  } catch (error) {
    page.value = Math.max(0, page.value - 1)
    showToast({
      type: 'fail',
      message: error?.message || '订单列表加载失败',
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const refreshListWithToast = (message) => {
  init()
  showToast({
    type: 'success',
    message,
  })
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

<style lang="scss">
.order-list-page {
  .van-card {
    background: #fff;
    margin-top: 0;
  }

  .van-tabs__wrap {
    background: #fff;
    padding: 4px 0;
  }
}
</style>

<style lang="scss" scoped>
.order-list-page {
  background: #f5f5f5;

  .order-item {
    background-color: #fff;
    margin: 15px 5px;
    border-radius: 15px;
  }

  .order-title {
    display: flex;
    justify-content: space-between;
    padding: 25px 20px;
  }

  .order-sn {
    text-align: left;
  }

  .order-status {
    text-align: right;
  }

  .van-card {
    background-color: #fff;
  }

  .total {
    text-align: right;
    padding: 10px;
  }

  .footer-btn {
    text-align: right;
    padding: 10px;

    .van-button {
      margin-left: 10px;
      min-width: 70px;
    }
  }
}
</style>
