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
        <div v-for="(item, i) in goodsList" :key="i" class="content">
          <div class="left">
            <div class="title">{{ item.discount }}元{{ item.title }}</div>
            <div class="desc">最低消费{{ item.min }}可用</div>
          </div>
          <van-button v-if="item.receiveStatus" class="btnInfo" type="info">
            已领取
          </van-button>
          <van-button v-else type="info" @click="onSubmit(item.id)">领取</van-button>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showDialog, showToast } from 'vant'

import { orderCoupon, orderReceive } from '@/api/order'
import { getToken } from '@/utils/auth'

const router = useRouter()
const store = useStore()

const state = reactive({
  goodsList: [],
  isLoading: false,
  isFinished: false,
  pageSize: 10,
  pageNum: 1,
})
const { goodsList, isLoading, isFinished, pageSize, pageNum } = toRefs(state)

const getOrderCouponList = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const res = await orderCoupon({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    })
    const { records = [] } = res.data || {}

    if (pageNum.value === 1) {
      goodsList.value = records
    } else {
      goodsList.value = [...goodsList.value, ...records]
    }

    isFinished.value = records.length < pageSize.value
  } catch (error) {
    showToast({ type: 'fail', message: error?.message || '优惠券加载失败' })
    isFinished.value = true
  } finally {
    isLoading.value = false
  }
}

const onReachBottom = () => {
  pageNum.value += 1
  getOrderCouponList()
}

const onSubmit = async (id) => {
  const hasToken = getToken()
  if (!hasToken) {
    showDialog({
      title: '提示',
      message: '您还未登录，请先登录',
    }).then(() => {
      store.dispatch('user/resetToken').then(() => {
        router.push({ name: 'Login' })
      })
    })
    return
  }

  try {
    const res = await orderReceive({ couponId: id })
    if (res.code === 200) {
      pageNum.value = 1
      isFinished.value = false
      getOrderCouponList()
      showToast({ type: 'success', message: '领取成功' })
      return
    }
    showToast({ type: 'fail', message: res.msg })
  } catch (error) {
    showToast({ type: 'fail', message: error?.message || '领取失败' })
  }
}

onMounted(() => {
  getOrderCouponList()
})
</script>

<style lang="scss" scoped>
.coupon {
  background: #f5f5f5;
  min-height: 1334px;

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

    .van-button--info {
      border-radius: 20px;
      height: 70px;
    }
  }

  .btnInfo {
    background: #999;
    border: none;
  }
}
</style>
