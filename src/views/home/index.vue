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

<script>
import { getHomeData, getRecommonGoodsList } from '@/api/home'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
// import Goods from './modules/Goods'
import Goods from './modules/GoodsVantCard'
import GoodsLimit from './modules/GoodsLimit'
import Diamond from './modules/Diamond'
// import Session from './modules/Session'
import Skeleton from './modules/Skeleton'

export default {
  name: 'Home',
  components: {
    Header,
    Swiper,
    Diamond,
    // Session,
    Goods,
    GoodsLimit,
    Skeleton
  },
  data() {
    return {
      mallConfig: {},
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
      isSkeletonShow: true
    }
  },
  mounted() {
    this.getHomeIndexData()
    this.getRecommonGoodsList()
  },
  methods: {
    getHomeIndexData() {
      getHomeData().then(res => {
        const { data } = res
        this.bannerList = data.bannerList
        this.diamondList = data.diamondList
        this.newGoodsList = data.newGoodsList
        this.hotGoodsList = data.hotGoodsList
        this.isSkeletonShow = false
      })
    },
    getRecommonGoodsList() {
      getRecommonGoodsList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        const { data } = res
        this.goodsList = [...this.goodsList, ...data]
        this.isLoading = false
        if (data.length < this.pageSize && this.goodsList.length > 0) {
          this.isFinished = true
        }
      })
    },
    // reach-bottom
    onReachBottom() {
      this.pageNum += 1
      this.getRecommonGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  background: #f5f5f5;
  min-height: 100vh;
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
