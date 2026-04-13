<template>
  <div class="home">
    <Header />
    <Swiper :banner-list="bannerList" />
    <Diamond :diamond-list="diamondList" />
    <!-- <Session :session-list="sessionList" /> -->
    <Goods-limit
      v-model="isLoading"
      title-name="新品上线"
      :goods-list="newGoodsList"
      :is-finished="true"
      @onReachBottom="onReachBottom"
    />
    <Goods-limit
      v-model="isLoading"
      title-name="热卖商品"
      :goods-list="hotGoodsList"
      :is-finished="true"
      @onReachBottom="onReachBottom"
    />
    <Goods
      v-model="isLoading"
      title-name="为你推荐"
      :goods-list="goodsList"
      :is-finished="isFinished"
      @onReachBottom="onReachBottom"
    />
    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'


import { getHomeData, getRecommonGoodsList } from '@/api/home'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
// import Goods from './modules/Goods'
import Goods from './modules/GoodsVantCard'
import GoodsLimit from './modules/GoodsLimit'
import Diamond from './modules/Diamond'
// import Session from './modules/Session'
import Skeleton from './modules/Skeleton'

const state = reactive({mallConfig: {},
      bannerList: [],
      diamondList: [],
      sessionList: [],
      newGoodsList: [],
      hotGoodsList: [],
      goodsList: [],
      pageSize: 6,
      pageNum: 1,
      isLoading: false,
      isFinished: false,
      isSkeletonShow: true,})
const { mallConfig, bannerList, diamondList, sessionList, newGoodsList, hotGoodsList, goodsList, pageSize, pageNum, isLoading, isFinished, isSkeletonShow } = toRefs(state)

const getHomeIndexData = () => {
  getHomeData().then((res) => {
        const { data } = res
        bannerList.value = data.bannerList
        diamondList.value = data.diamondList
        newGoodsList.value = data.newGoodsList
        hotGoodsList.value = data.hotGoodsList
        isSkeletonShow.value = false
      })
}

const getRecommendGoods = () => {
  getRecommonGoodsList({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
      }).then((res) => {
        const { data } = res
        goodsList.value = [...goodsList.value, ...data]
        isLoading.value = false
        if (data.length < pageSize.value && goodsList.value.length > 0) {
          isFinished.value = true
        }
      })
}

const onReachBottom = () => {
  pageNum.value += 1
      getRecommendGoods()
}

onMounted(() => {
  getHomeIndexData()
    getRecommendGoods()
})
</script>

<style lang="scss" scoped>
.home {
  background: #f5f5f5;
  min-height: 1334px;
  .logo {
    display: block;
    width: 200px;
    margin: 0 auto;
    padding-top: 40px;
  }
  .menu__right {
    width: 50px;
  }
}
</style>
