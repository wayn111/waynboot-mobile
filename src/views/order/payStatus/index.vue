<template>
  <div class="payment_status">
    <div class="status_top">
      <van-icon :name="statusIcon" :class="statusClass"/>
      <div>{{statusText}}</div>
    </div>

    <div class="status_text" v-if="isSuccess">
      <span class="red">3秒</span>跳转订单
    </div>
    <div class="status_text" v-else>系统繁忙, 支付遇到问题, 请您稍后再试!</div>

    <div class="status_goLink">
      <router-link class="red" :to="{name: 'User'}">查看订单
        <van-icon name="arrow"/>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'payment-status',

  props: {
    status: String
  },
  created() {
    /* setTimeout(() => {
      this.$router.push({ path: '/user/order/list/0' })
    }, 3000) */
  },
  data() {
    return {
      isSuccess: true
    }
  },

  computed: {
    statusText() {
      return this.isSuccess ? '支付成功' : '支付失败'
    },
    statusIcon() {
      return this.isSuccess ? 'checked' : 'fail'
    },
    statusClass() {
      return this.isSuccess ? 'success_icon' : 'fail_icon'
    }
  },

  mounted() {
    this.isSuccess = this.status === 'success'
  }
}
</script>

<style lang="scss" scopd>
@import "@/styles/variables.scss";

.payment_status {
  padding-top: 5vw;
  box-sizing: border-box;
  background-color: #fff;
  text-align: center;
}

.status_top {
  margin-bottom: 5vw;
  i {
    margin-bottom: 3vw;
  }
  > div {
    font-size: 6vw;
  }
}

.status_text {
  color: $font-color-gray;
  margin-bottom: 8vw;
}

.status_icon {
  font-size: 8vw;
}

i.success_icon {
  @extend .status_icon;
  color: #06bf04;
}

i.fail_icon {
  @extend .status_icon;
  color: #f44;
}
</style>
