<template>
  <div class="tab-bar">
    <van-action-bar>
      <van-action-bar-icon icon="home-o" text="首页" @click="goHome" />
      <van-action-bar-icon
        icon="cart-o"
        text="购物车"
        :badge="count"
        @click="cartClick"
      />
      <van-action-bar-button
        class="detail-action__cart"
        text="加入购物车"
        @click="handleClick"
      />
      <van-action-bar-button
        class="detail-action__buy"
        text="立即购买"
        @click="handleClick"
      />
    </van-action-bar>
    <div class="tabbar--placeholder" style="width: 100%; height: 50px" />
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getCartGoodsCount } from '@/api/cart'

const router = useRouter()
const emit = defineEmits(['update:value'])
const state = reactive({
  count: 0
})
const { count } = toRefs(state)

const getCartCount = () => {
  getCartGoodsCount()
    .then((res) => {
      const { data } = res
      count.value = data
    })
    .catch(() => {})
}

const handleClick = () => {
  emit('update:value', true)
}

const cartClick = () => {
  router.push({ name: 'Cart' })
}

const goHome = () => {
  router.push({ name: 'Home' })
}

defineExpose({
  getCartCount
})

onMounted(() => {
  getCartCount()
})
</script>

<style lang="scss" scoped>
.tab-bar {
  :deep(.van-action-bar) {
    left: 18px;
    right: 18px;
    bottom: 16px;
    width: auto;
    overflow: hidden;
    border: 1px solid rgba(29, 29, 31, 0.08);
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.12);
    backdrop-filter: saturate(180%) blur(18px);
  }

  :deep(.van-action-bar-icon) {
    color: rgba(29, 29, 31, 0.72);
    background: transparent;
    font-size: 28px;
  }

  :deep(.van-action-bar-icon .van-icon) {
    font-size: 34px;
  }

  :deep(.van-action-bar-button) {
    height: 68px;
    border-radius: 999px;
    font-size: 28px;
    font-weight: 700;
  }

  :deep(.detail-action__cart) {
    color: #0066cc;
    background: #f2f7ff;
  }

  :deep(.detail-action__buy) {
    color: #ffffff;
    background: #0071e3;
  }
}
</style>
