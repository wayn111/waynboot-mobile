<template>
  <div class="home">
    <Header />
    <Swiper :bannerList="bannerList" />
    <Category :cateList="cateList" />
    <back-top />
    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script>
import { getHomeData } from '@/api/home'
import Header from './modules/Header'
import Swiper from './modules/Swiper'
import Category from './modules/Category'
import Skeleton from './modules/Skeleton'

export default {
  name: 'Home',
  components: {
    Header,
    Swiper,
    Category,
    // Session,
    // Goods,
    Skeleton
  },
  data() {
    return {
      bannerList: [],
      cateList: [],
      sessionList: [],
      goodsList: [],
      pageSize: 1,
      pageNum: 4,
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
        this.isSkeletonShow = false
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
