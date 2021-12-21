<template>
  <div class="order_list">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>
    <van-tabs
      v-model="activeIndex"
      :swipe-threshold="5"
      sticky
      swipeable
      offset-top="46"
      type="line"
      @click="handleTabClick"
    >
      <van-tab
        v-for="(tabTitle, index) in tabTitles"
        :key="index"
        :title="tabTitle"
      >
        <van-pull-refresh
          v-model="refreshing"
          style="min-height: calc(100vh - 84px)"
          @refresh="onRefresh"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            @load="getOrderList"
          >
            <van-empty
              v-if="orderListEmptyShow"
              description="您还没有相关订单"
            />
            <div
              v-for="(el, i) in orderList"
              :key="i"
              class="order-item"
              @click="toOrderDetail(el.orderSn)"
            >
              <div class="order-title">
                <div class="order-sn">订单编号: {{ el.orderSn }}</div>
                <div class="order-staus">{{ el.orderStatusText }}</div>
              </div>
              <van-card
                v-for="(goods, goodsIndex) in el.goodsList"
                :key="goodsIndex"
                :title="goods.goodsName"
                :num="goods.number"
                :price="goods.price"
                :thumb="goods.picUrl"
                @click.native="toOrderDetail(goods.goodsId)"
              >
                <div slot="desc">
                  <div class="desc">
                    <van-tag
                      v-for="(spec, idx) in goods.specifications"
                      :key="idx"
                      plain
                      style="margin-right: 6px"
                    >{{ spec }}</van-tag>
                  </div>
                </div>
                <template #footer>
                  <van-button
                    v-if="el.handleOption.comment && goods.comment == 0"
                    size="mini"
                    @click.stop="commentGoods(goods.id, goods.goodsId)"
                  >去评价</van-button>
                </template>
              </van-card>
              <div class="total">
                合计: {{ el.actualPrice | yuan }}（含运费{{
                  el.post_fee | yuan
                }}）
              </div>

              <div slot="footer" class="footer_btn">
                <van-button
                  v-if="el.handleOption.cancel"
                  round
                  size="small"
                  @click.stop="cancelOrder(el.id)"
                >取消订单</van-button>
                <van-button
                  v-if="el.handleOption.pay"
                  round
                  size="small"
                  type="danger"
                  plain
                  @click.stop="toPay(el.orderSn, el.actualPrice)"
                >去支付</van-button>
                <van-button
                  v-if="el.handleOption.refund"
                  round
                  size="small"
                  @click.stop="refundOrder(el.id)"
                >退款/售后</van-button>
                <van-button
                  v-if="el.handleOption.confirm"
                  round
                  plain
                  size="small"
                  @click.stop="confirmOrder(el.id)"
                >确认收货</van-button>
                <van-button
                  v-if="el.handleOption.delete"
                  round
                  size="small"
                  @click.stop="delOrder(el.id)"
                >删除订单</van-button>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  orderList,
  orderDelete,
  orderConfirm,
  orderCancel,
  orderRefund
} from '@/api/order'

export default {
  name: 'OrderList',

  props: {
    active: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      activeIndex: Number(this.active),
      tabTitles: ['全部', '待付款', '待发货', '待收货', '已完成'],
      orderList: [],
      refreshing: false,
      page: 0,
      limit: 10,
      loading: true,
      orderListEmptyShow: false,
      finished: false
    }
  },
  created() {
    this.init()
  },

  methods: {
    init() {
      this.page = 0
      this.orderList = []
      this.getOrderList(true)
    },
    // 下拉刷新
    onRefresh() {
      this.refreshing = true
      this.page = 0
      this.getOrderList(true)
    },
    getOrderList(init) {
      this.loading = true
      this.orderListEmptyShow = false
      this.page++
      orderList({
        showType: this.activeIndex,
        pageNum: this.page,
        pageSize: this.limit,
        sortName: 'updateTime,createTime',
        sortOrder: 'desc'
      }).then((res) => {
        this.orderList.push(...res.map.data)
        this.loading = false
        this.refreshing = false
        this.finished = res.map.page >= res.map.pages
        if (init && res.map.data.length <= 0) {
          this.orderListEmptyShow = true
        }
      })
    },
    delOrder(id) {
      this.$dialog
        .confirm({ message: '确定要删除该订单吗?' })
        .then(() => {
          orderDelete(id).then(() => {
            this.init()
            this.$toast('已删除订单')
          })
        })
        .catch(() => {})
    },
    cancelOrder(id) {
      this.$dialog
        .confirm({ message: '确定要取消该订单吗?' })
        .then(() => {
          orderCancel(id).then(() => {
            this.init()
            this.$toast('已取消该订单')
          })
        })
        .catch(() => {})
    },
    refundOrder(id) {
      this.$dialog
        .confirm({ message: '确定要申请退款吗?' })
        .then(() => {
          orderRefund(id).then(() => {
            this.init()
            this.$toast('已申请订单退款')
          })
        })
        .catch(() => {})
    },
    confirmOrder(id) {
      this.$dialog
        .confirm({
          message: '请确认收到货物, 确认收货后无法撤销!'
        })
        .then(() => {
          orderConfirm(id).then(() => {
            this.init()
            this.$toast('已确认收货')
          })
        })
        .catch(() => {})
    },
    commentGoods(orderGoodsId, goodsId) {
      this.$router.push({
        path: `/goodsComment/${orderGoodsId}/${goodsId}`
      })
    },
    toPay(orderSn, actualPrice) {
      this.$router.push({ name: 'OrderPay', params: { orderSn, actualPrice }})
    },
    handleTabClick() {
      this.page = 0
      this.orderList = []
      this.getOrderList(true)
    },
    toOrderDetail(orderSn) {
      this.$router.push({
        path: `/order/detail/${orderSn}`
      })
    }
  }
}
</script>
<style lang="scss">
.order-list {
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
.order_list {
  background: #f5f5f5;
  .order-item {
    background-color: #fff;
    margin: 20px 5px;
    border-radius: 15px;
    .order-title {
      display: flex;
      justify-content: space-between;
      padding: 25px 20px;
      .order-sn {
        text-align: left;
      }
      .order-staus {
        text-align: right;
      }
    }
    .van-card {
      background-color: #fff;
    }

    .total {
      text-align: right;
      padding: 10px;
    }

    .footer_btn {
      text-align: right;
      padding: 10px;
      .van-button {
        margin-left: 10px;
        min-width: 70px;
      }
    }
  }
}
</style>
