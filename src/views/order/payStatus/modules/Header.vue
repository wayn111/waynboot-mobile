<template>
  <div class="header">
    <div class="header__title">
      <van-icon name="checked" color="#fff" size="25" />
      <span class="header__title__text">{{ statusText }}</span>
    </div>

    <p v-if="isSuccess" class="header__desc">我们将尽快为您配货~</p>
    <p v-else class="header__desc">请联系客客服~</p>

    <div class="header__btn">
      <router-link
        class="header__btn__item"
        to="/"
        replace
      >返回首页</router-link>
      <router-link
        class="header__btn__item"
        :to="`/user/order/list/${orderStatus}`"
        replace
      >查看订单</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PayStatus',

  props: {
    status: {
      type: String,
      default: ''
    }
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
    orderStatus() {
      return this.isSuccess ? 2 : 0
    }
  },
  mounted() {
    this.isSuccess = this.status === 'success'
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.header {
  width: 100%;
  height: 390px;
  background: $red;
  .header__title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: 92px;
    .header__title__text {
      font-size: 42px;
      font-weight: 500;
      color: #fff;
      margin-left: 12px;
    }
  }
  .header__desc {
    font-size: 26px;
    color: #fff;
    margin-top: 27px;
    text-align: center;
    opacity: 0.9;
  }
  .header__btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 48px;
    .header__btn__item {
      width: 180px;
      height: 60px;
      border-radius: 33px;
      border: 1px solid#fff;
      line-height: 60px;
      text-align: center;
      font-size: 26px;
      color: #fff;
      &:last-child {
        margin-left: 60px;
      }
    }
  }
}
</style>
