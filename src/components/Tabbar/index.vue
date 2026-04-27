<template>
  <div>
    <div class="tabbar">
      <van-tabbar
        v-model="active"
        :active-color="variables.theme"
        :border="false"
        :fixed="false"
        route
      >
        <van-tabbar-item :to="{ name: 'Home' }" icon="wap-home"
          >首页</van-tabbar-item
        >
        <van-tabbar-item :to="{ name: 'Category' }" icon="bars"
          >分类</van-tabbar-item
        >
        <van-tabbar-item
          :to="{ name: 'Cart' }"
          icon="shopping-cart"
          :badge="totalCartNum"
          >购物车</van-tabbar-item
        >
        <van-tabbar-item :to="{ name: 'User' }" icon="manager"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
    <div class="tabbar--placeholder" />
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, onMounted } from 'vue'

import variables from '@/styles/variables.scss?inline'
import { getCartGoodsCount } from '@/api/cart'

const state = reactive({
  active: 0,
  count: 0
})
const { active, count } = toRefs(state)

const loadCartCount = () => {
  getCartGoodsCount()
    .then((res) => {
      const { data } = res
      count.value = data
    })
    .catch(() => {})
}

const totalCartNum = computed(() => {
  if (count.value === 0) {
    return ''
  }

  return count.value <= 99 ? count.value : 99
})

onMounted(() => {
  loadCartCount()
})
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  width: calc(100% - 32px);
  max-width: calc(var(--wb-content-width) - 32px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
  left: 50%;
  z-index: 100;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom, 0px));
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
  transform: translateX(-50%);

  :deep(.van-tabbar) {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    height: auto;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  :deep(.van-tabbar-item) {
    min-height: 68px;
    padding: 10px 0 8px;
    border-radius: 999px;
    color: rgba(29, 29, 31, 0.54);
    transition:
      color 0.24s ease,
      opacity 0.24s ease;
  }

  :deep(.van-tabbar-item__icon) {
    margin-bottom: 6px;
    font-size: 26px;
    line-height: 1;
  }

  :deep(.van-tabbar-item__text) {
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.08px;
    font-weight: 500;
  }

  :deep(.van-tabbar-item--active) {
    color: #0071e3;
    background: transparent;
  }

  :deep(.van-tabbar-item--active .van-tabbar-item__text) {
    font-weight: 600;
  }

  :deep(.van-info) {
    min-width: 18px;
    padding: 0 5px;
    border: 2px solid rgba(255, 255, 255, 0.86);
    background: #0071e3;
  }

  :deep(.van-badge__wrapper),
  :deep(.van-tabbar-item__icon),
  :deep(.van-tabbar-item__text) {
    line-height: 1.2;
  }
}

.tabbar--placeholder {
  width: 100%;
  height: calc(104px + env(safe-area-inset-bottom, 0px));
}
</style>
