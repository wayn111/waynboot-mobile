<template>
  <div>
    <div class="tabbar">
      <van-tabbar v-model="active" :active-color="variables.theme" :fixed="false" route>
        <van-tabbar-item :to="{name: 'Home'}" icon="wap-home">首页</van-tabbar-item>
        <van-tabbar-item :to="{name: 'Category'}" icon="bars">分类</van-tabbar-item>
        <van-tabbar-item :to="{name: 'Cart'}" icon="shopping-cart" :badge="totalCartNum">购物车</van-tabbar-item>
        <van-tabbar-item :to="{name: 'User'}" icon="manager">我的</van-tabbar-item>
      </van-tabbar>
    </div>
    <div class="tabbar--placeholder" style="width:100%;height:50px" />
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { getCartGoodsCount } from '@/api/cart'

export default {
  data() {
    return {
      active: 0,
      count: 0
    }
  },
  computed: {
    variables() {
      return variables
    },
    totalCartNum() {
      if (this.count === 0) {
        return ''
      } else {
        return this.count <= 99 ? this.count : 99
      }
    }
  },
  mounted() {
    this.getCartGoodsCount()
  },
  methods: {
    getCartGoodsCount() {
      getCartGoodsCount().then(res => {
        const { data } = res
        this.count = data
      }).catch(e => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 2px solid #f5f5f5;
}
</style>
