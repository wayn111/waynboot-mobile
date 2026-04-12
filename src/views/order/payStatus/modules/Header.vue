<template>
  <div class="header">
    <div class="header__title">
      <van-icon :name="isSuccess ? 'checked' : 'clear'" color="#fff" size="25" />
      <span class="header__title__text">{{ statusText }}</span>
    </div>

    <p v-if="isSuccess" class="header__desc">我们将尽快为您配货</p>
    <p v-else class="header__desc">请联系客服处理~</p>

    <div class="header__btn">
      <router-link class="header__btn__item" to="/" replace>返回首页</router-link>
      <router-link class="header__btn__item" :to="`/user/order/list/${orderStatus}`" replace>
        查看订单
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
})

const currentStatus = computed(() => {
  return props.status || route.query.status || ''
})

const isSuccess = computed(() => currentStatus.value === 'success')

const statusText = computed(() => {
  if (currentStatus.value === 'cancel') {
    return '支付已取消'
  }
  return isSuccess.value ? '支付成功' : '支付失败'
})

const orderStatus = computed(() => {
  return isSuccess.value ? 2 : 0
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

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
      border: 1px solid #fff;
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
