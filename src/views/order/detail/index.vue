<template>
  <div class="order_detail">
    <div v-if="loading" class="loading">
      <van-loading type="spinner">加载中...</van-loading>
    </div>
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>
    <div class="order-detail">
      <div>订单编号: {{ orderInfo.orderSn }}</div>
      <div>订单状态: {{ orderInfo.orderStatusText }}</div>
      <div>下单时间: {{ orderInfo.createTime }}</div>
      <div>支付方式: {{ orderInfo.payTypeText }}</div>
      <div>支付时间: {{ orderInfo.payTime }}</div>
      <div>运    费: {{ orderInfo.freightPrice | yuan }}</div>
      <div>订单金额: {{ orderInfo.orderPrice | yuan }}</div>
      <div>实付金额: {{ orderInfo.actualPrice | yuan }}</div>
      <div>收货地址: {{ orderInfo.address }}</div>
      <div>用户留言: {{ orderInfo.message }}</div>
      <van-card
        v-for="(goods, goodsIndex) in orderInfo.orderGoodsVOList"
        :key="goodsIndex"
        :title="goods.goodsName"
        :num="goods.number"
        :price="goods.price | yuan"
        :thumb="goods.picUrl"
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
      </van-card>
    </div>
  </div>
</template>
<script>
import { orderDetail } from '@/api/order'

export default {
  props: {
    orderSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderInfo: [],
      loading: true
    }
  },
  mounted() {
    console.log(this.orderSn)
    this.orderDetail()
  },
  methods: {
    orderDetail() {
      orderDetail(this.orderSn)
        .then((res) => {
          this.orderInfo = res.map.order
        })
        .finally((res) => {
          this.loading = false
        })
    }
  }
}
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
  > div:nth-child(-n + 10) {
    margin-top: 1vh;
  }
  van-card {
    margin-top: 2vh;
  }
  .van-card {
    background-color: #f9f8f8;
    padding: 15px 20px;
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
