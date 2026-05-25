<template>
  <div class="home wb-page wb-page--tabbed">
    <Header />

    <main class="home__body">
      <section class="home__section home__section--hero">
        <Swiper :banner-list="bannerList" />
      </section>

      <section class="home__section">
        <CouponEntry :coupon-list="couponList" />
      </section>

      <section class="home__section">
        <Diamond :diamond-list="diamondList" />
      </section>

      <section class="home__section">
        <NewArrivals :goods-list="newGoodsList" />
      </section>

      <section class="home__section">
        <HotShelf :goods-list="hotGoodsList" />
      </section>

      <section class="home__section home__section--last">
        <RecommendFeed
          v-model="isLoading"
          :goods-list="goodsList"
          :is-finished="isFinished"
          @onReachBottom="onReachBottom"
        />
      </section>
    </main>

    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'

import { getHomeData, getRecommonGoodsList } from '@/api/home'
import { orderCoupon } from '@/api/coupon'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
import CouponEntry from './modules/CouponEntry'
import Diamond from './modules/Diamond'
import HotShelf from './modules/HotShelf'
import NewArrivals from './modules/NewArrivals'
import RecommendFeed from './modules/RecommendFeed'
import Skeleton from './modules/Skeleton'

const state = reactive({
  bannerList: [],
  diamondList: [],
  newGoodsList: [],
  hotGoodsList: [],
  couponList: [],
  goodsList: [],
  pageSize: 6,
  pageNum: 1,
  isLoading: false,
  isFinished: false,
  isSkeletonShow: true,
})

const {
  bannerList,
  diamondList,
  newGoodsList,
  hotGoodsList,
  couponList,
  goodsList,
  pageSize,
  pageNum,
  isLoading,
  isFinished,
  isSkeletonShow,
} = toRefs(state)

const getHomeIndexData = () => {
  getHomeData().then((res) => {
    const { data } = res
    bannerList.value = data.bannerList || []
    diamondList.value = data.diamondList || []
    newGoodsList.value = data.newGoodsList || []
    hotGoodsList.value = data.hotGoodsList || []
    isSkeletonShow.value = false
  })
}

const getRecommendGoods = () => {
  getRecommonGoodsList({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
  }).then((res) => {
    const { data } = res
    goodsList.value = [...goodsList.value, ...(data || [])]
    isLoading.value = false
    if ((data || []).length < pageSize.value && goodsList.value.length > 0) {
      isFinished.value = true
    }
  })
}

const getCouponList = async () => {
  try {
    const res = await orderCoupon({
      pageSize: 3,
      pageNum: 1,
    })
    couponList.value = res?.data?.records || []
  } catch (error) {
    couponList.value = []
  }
}

const onReachBottom = () => {
  pageNum.value += 1
  getRecommendGoods()
}

onMounted(() => {
  getHomeIndexData()
  getRecommendGoods()
  getCouponList()
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100%;
  
  background: linear-gradient(180deg, #f5f6fa 0%, #f3f4f8 100%);
}

.home__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 16px 0;
}

.home__section {
  padding-top: 24px;
}

.home__section--hero {
  padding-top: 10px;
}

.home__section--last {
  padding-bottom: 32px;
}

@media (max-width: 375px) {
  .home__body {
    padding-left: 14px;
    padding-right: 14px;
  }

  .home__section {
    padding-top: 22px;
  }
}
</style>
