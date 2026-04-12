<template>
  <div class="coupon">
    <nav-bar :title="$route.meta.title" />

    <van-list
      v-model:loading="isLoading"
      :finished="isFinished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <div v-for="(item, i) in goodsList" :key="item.id || i" class="content">
          <div class="left">
            <div class="title">{{ item.discount }}元{{ item.title }}</div>
            <div class="desc">最低消费 {{ item.min }} 元可用</div>
          </div>
          <div :class="statusClass(item.useStatus)">
            {{ statusText(item.useStatus) }}
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'

import { orderCouponMy } from '@/api/order'

const state = reactive({
  goodsList: [],
  isLoading: false,
  isFinished: false,
  pageSize: 10,
  pageNum: 1,
})

const { goodsList, isLoading, isFinished, pageSize, pageNum } = toRefs(state)

const statusText = (status) => {
  if (status === 1) return '已使用'
  if (status === 2) return '已过期'
  return '未使用'
}

const statusClass = (status) => (status === 0 ? 'unused' : 'right')

const getOrderCouponMyList = () => {
  orderCouponMy({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
  }).then((res) => {
    const records = res?.data?.records || []

    if (pageNum.value === 1) {
      goodsList.value = records
    } else {
      goodsList.value = [...goodsList.value, ...records]
    }

    isLoading.value = false
    if (records.length < pageSize.value) {
      isFinished.value = true
    }
  }).catch(() => {
    isLoading.value = false
    isFinished.value = true
  })
}

const onReachBottom = () => {
  pageNum.value += 1
  getOrderCouponMyList()
}

onMounted(() => {
  getOrderCouponMyList()
})
</script>

<style lang="scss" scoped>
.coupon {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    margin: 20px 30px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px;
    border-radius: 10px;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        font-weight: bold;
        font-size: 36px;
        color: #000;
        line-height: 70px;
      }

      .desc {
        font-size: 24px;
        color: #666;
        line-height: 50px;
      }
    }

    .right,
    .unused {
      font-size: 32px;
    }

    .right {
      color: #ce4141;
    }

    .unused {
      color: #44b2ee;
    }
  }
}
</style>
