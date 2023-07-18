<template>
  <div class="home">
    <Header />
    <Swiper :banner-list="bannerList" />
    <Category :cate-list="cateList" />
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
import { getHomeData, getGoodsList } from '@/api/home'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
// import Goods from './modules/Goods'
import Goods from './modules/GoodsVantCard'
import GoodsLimit from './modules/GoodsLimit'
import Category from './modules/Category'
// import Session from './modules/Session'
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
      mallConfig: {},
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
        this.sessionList = [
          {
            '_id': '5f5b1ec83f8b304102b77e8d',
            'img': 'https://m.360buyimg.com/babel/s750x300_jfs/t1/96501/1/14812/180805/5e69f6e2E65623863/c40c27c4ec520eef.jpg',
            'title': '头号爆品、新书特卖专场',
            'tagnum': 1000,
            'discount': 3,
            'time': 1699807149739
          },
          {
            '_id': '5f5b1ec83f8b304102b77e90',
            'img': 'https://m.360buyimg.com/babel/s1125x450_jfs/t1/98771/1/15620/172104/5e733babEe579fad9/d7d5e51a1f2975e8.jpg',
            'title': '321阅读日、热门专场',
            'tagnum': 9999,
            'discount': 8,
            'time': 1699907149739
          },
          {
            '_id': '5f5b1ec83f8b304102b77e93',
            'img': 'https://m.360buyimg.com/babel/s1125x450_jfs/t1/85360/22/15634/120107/5e733524E4883f099/c8c92ebd6112a76e.jpg',
            'title': '电影学院，电影书籍专场特卖',
            'tagnum': 666,
            'discount': 5,
            'time': 2699907149739
          }
        ]
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
