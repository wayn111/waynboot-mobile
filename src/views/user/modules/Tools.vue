<template>
  <div class="user-tools">
    <van-cell title="优惠券" is-link to="order/my" />
    <van-cell title="收货地址" is-link to="address" />
    <van-cell title="退出登录" is-link @click="logout" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showNotify } from 'vant'

const router = useRouter()
const store = useStore()

const logout = () => {
  store.dispatch('user/logout').then(() => {
    showNotify({
      type: 'success',
      message: '退出成功',
      duration: 2000,
      onOpened: () => {
        router.push({ name: 'Login' })
      },
    })
  })
}
</script>

<style>
:root {
  --user-tools-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.09);
}
</style>

<style lang="scss" scoped>
.user-tools {
  width: 702px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  margin-top: 24px;
  box-shadow: var(--user-tools-shadow);
  border-radius: 24px;
  overflow: hidden;
}
</style>
