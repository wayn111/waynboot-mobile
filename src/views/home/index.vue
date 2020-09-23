<template>
  <div class="home">
    <Header />
    <Swiper :banner-list="bannerList" />
    <Category :cate-list="cateList" />
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
import { getHomeData, getGoodsList } from '@/api/home'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
import Goods from './modules/Goods'
import GoodsLimit from './modules/GoodsLimit'
import Category from './modules/Category'
import Skeleton from './modules/Skeleton'

export default {
  name: 'Home',
  components: {
    Header,
    Swiper,
    Category,
    // Session,
    Goods,
    GoodsLimit,
    Skeleton
  },
  data() {
    return {
      bannerList: [],
      cateList: [],
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
  },
  methods: {
    getHomeIndexData() {
      getHomeData().then(res => {
        const { map } = res
        this.bannerList = map.bannerList
        this.cateList = map.categoryList
        this.newGoodsList = map.newGoodsList
        this.hotGoodsList = map.hotGoodsList
        this.isSkeletonShow = false
        this.getGoodsList()
      })
    },
    getGoodsList() {
      getGoodsList({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        const { map: { data }} = res
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
      this.getGoodsList()
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
