<template>
  <div>
    <div class="tabbar">
      <van-tabbar
        v-model="active"
        :active-color="variables.theme"
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
    <div class="tabbar--placeholder" style="width: 100%; height: 50px" />
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, onMounted } from 'vue'


import variables from '@/styles/variables.scss?inline'
import { getCartGoodsCount } from '@/api/cart'

const state = reactive({active: 0,
      count: 0,})
const { active, count } = toRefs(state)

const loadCartCount = () => {
  getCartGoodsCount()
        .then((res) => {
          const { data } = res
          count.value = data
        })
        .catch((e) => {})
}

const totalCartNum = computed(() => {
  if (count.value === 0) {
        return ''
      } else {
        return count.value <= 99 ? count.value : 99
      }
})

onMounted(() => {
  loadCartCount()
})
</script>

<style lang="scss" scoped>
.tabbar {
  width: 750px;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 2px solid #f5f5f5;
}
</style>
