<template>
  <div class="order_detail">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>
    <div>
      <div>订单编号: {{ orderInfo.orderSn }}</div>
      <div>订单状态: {{ orderInfo.orderStatus }}</div>
      <div>下单时间: {{ orderInfo.createTime }}</div>
      <div>支付方式: {{ orderInfo.payType }}</div>
      <div>支付时间: {{ orderInfo.payTime }}</div>
      <div>订单金额: {{ orderInfo.orderPrice | yuan }}</div>
      <div>实付金额: {{ orderInfo.actualPrice | yuan }}</div>
      <div>收货地址: {{ orderInfo.address }}</div>
      <van-card
        v-for="(goods, goodsIndex) in orderInfo.orderGoodsVOList"
        :key="goodsIndex"
        :title="goods.goodsName"
        :num="goods.number"
        :price="goods.price"
        :thumb="goods.picUrl"
        @click.native="toOrderDetail(goods.goodsId)"
      /></div>
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
      orderInfo: []
    }
  },
  mounted() {
    console.log(this.orderSn)
    this.orderDetail()
  },
  methods: {
    orderDetail() {
      orderDetail(this.orderSn).then(res => {
        debugger
        this.orderInfo = res.map.order
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
