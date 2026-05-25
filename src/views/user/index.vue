<template>
  <div class="user wb-page wb-page--tabbed">
    <div class="user__shell">
      <section class="user__hero">
        <Info />
      </section>
      <section class="user__section">
        <Order />
      </section>
      <section class="user__section">
        <Tools />
      </section>
      <section class="user__section user__logout-section">
        <button type="button" class="user__logout-btn" @click="logout">退出登录</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showNotify } from 'vant'

import Info from './modules/Info'
import Order from './modules/Order'
import Tools from './modules/Tools'

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

<style lang="scss" scoped>
.user {
  background: #f5f5f7;
  min-height: 100vh;
}

.user__shell {
  width: 100%;
  max-width: var(--wb-content-width, 750px);
  margin: 0 auto;
  padding: 64px 24px 120px;
}

.user__header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.user__title {
  font-size: 58px;
  line-height: 1.08;
  letter-spacing: -0.28px;
  font-weight: 600;
  color: #1d1d1f;
}

.user__hero {
  margin-bottom: 24px;
}

.user__section {
  margin-bottom: 24px;
}

.user__logout-section {
  margin-top: 32px;
}

.user__logout-btn {
  width: 100%;
  height: 88px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 600;
}

@media (max-width: 375px) {
  .user__shell {
    padding: 60px 20px 100px;
  }
}
</style>
