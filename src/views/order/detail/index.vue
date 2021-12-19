<template>
  <div class="order_detail">
    <nav-bar :title="$route.meta.title">
      <span style="color: #333">
        <svg-icon icon-class="share" :width="15" :height="15" />
      </span>
    </nav-bar>
    <div>
      <div>orderSn: {{ orderInfo.orderSn }}</div>
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
