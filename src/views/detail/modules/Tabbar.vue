<template>
  <div class="tab-bar">
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" />
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="count" @click="cartClick" />
      <van-goods-action-button type="warning" text="加入购物车" @click="handleClick" />
      <van-goods-action-button :color="variables.red" text="立即购买" @click="handleClick" />
    </van-goods-action>
    <div class="tabbar--placeholder" style="width:100%;height:50px" />
  </div>
</template>

<script>
import { getCartGoodsCount } from '@/api/cart'
import variables from '@/styles/variables.scss'

export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    variables() {
      return variables
    }
  },
  mounted() {
    this.getCartGoodsCount()
  },
  methods: {
    getCartGoodsCount() {
      getCartGoodsCount().then(res => {
        const { count } = res.map
        this.count = count
      }).catch(e => {})
    },
    handleClick() {
      this.$emit('input', true)
    },
    cartClick() {
      this.$router.push({ name: 'Cart' })
    }

  }
}
</script>

<style>
</style>
