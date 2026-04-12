<template>
  <div class="user-order">
    <h3 class="order__title">
      <p class="order__title__title">我的订单</p>
      <p
        class="order__title__navigate"
        @click="$router.push({ path: '/user/order/list/0' })"
      >
        <span>查看全部</span>
        <van-icon name="arrow" color="#969799" />
      </p>
    </h3>
    <div class="order__bd">
      <div
        v-for="(item, idx) in orderList"
        :key="idx"
        class="order__bd__item"
        @click="$router.push({ path: `/user/order/list/${item.type}` })"
      >
        <van-icon
          :name="item.icon"
          size="25"
          color="#dab309"
          :badge="item.count"
        />
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'

import { statusCount } from '@/api/order'

const state = reactive({
  orderList: [
    {
      icon: 'pending-payment',
      name: '待付款',
      count: '',
      type: 1,
    },
    {
      icon: 'peer-pay',
      name: '待发货',
      count: '',
      type: 2,
    },
    {
      icon: 'logistics',
      name: '待收货',
      count: '',
      type: 3,
    },
    {
      icon: 'chat-o',
      name: '待评价',
      count: '',
      type: 4,
    },
  ],
})
const { orderList } = toRefs(state)

const init = () => {
  statusCount().then((res) => {
    orderList.value[0].count = res.data.unpaid || ''
    orderList.value[1].count = res.data.unship || ''
    orderList.value[2].count = res.data.unrecv || ''
    orderList.value[3].count = res.data.uncomment || ''
  })
}

onMounted(() => {
  init()
})
</script>

<style>
:root {
  --user-order-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.09);
}
</style>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-order {
  width: 702px;
  height: 268px;
  margin: 0 auto;
  box-shadow: var(
    --user-order-shadow
  ); // 这里使用 css 函数，是为了避免旧版本 vue-cli 依赖的 css 压缩工具（mini-css-extract-plugin）导致的 bug
  border-radius: 24px;
  margin-top: 42px;
  .order__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 34px 24px 34px 34px;
    .order__title__title {
      font-size: 36px;
      font-weight: 500;
      color: $black;
    }
    .order__title__navigate {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 6px;
      span {
        font-size: 26px;
        font-family: PingFangSC;
        font-weight: 400;
        color: $gray;
        margin-right: 10px;
      }
    }
  }
  .order__bd {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 46px;
    .order__bd__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 14px;
      .name {
        font-size: 26px;
        color: $gray;
        margin-top: 16px;
      }
    }
  }
}
</style>
