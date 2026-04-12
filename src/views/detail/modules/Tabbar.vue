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
        type="warning"
        text="加入购物车"
        @click="handleClick"
      />
      <van-action-bar-button
        :color="variables.red"
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
import variables from '@/styles/variables.scss?inline'

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

<style></style>
