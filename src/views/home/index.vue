<template>
  <div class="home">
    <Header />
    <Swiper :bannerList="bannerList" />
    <Category :cateList="cateList" />
    <Goods-limit
      v-model="isLoading"
      titleName="新品上线"
      :goodsList="newGoodsList"
      :isFinished="true"
      @onReachBottom="onReachBottom"
    />
     <Goods-limit
      v-model="isLoading"
      titleName="热卖商品"
      :goodsList="hotGoodsList"
      :isFinished="true"
      @onReachBottom="onReachBottom"
    />
    <Goods
      v-model="isLoading"
      titleName="为你推荐"
      :goodsList="goodsList"
      :isFinished="isFinished"
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
      pageSize: 1,
      pageNum: 8,
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
        const data = res.map
        this.goodsList = [...this.goodsList, ...data]
        this.isLoading = false
        if (data.length < this.pageNum && this.goodsList.length > 0) {
          this.isFinished = true
        }
      })
    },
    // reach-bottom
    onReachBottom() {
      this.pageSize += 1
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
