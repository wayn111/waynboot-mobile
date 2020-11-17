<template>
  <div class="search-list">
    <nav-bar v-model="value" @handleSearch="handleSearch" />
    <filter-bar @changeGoods="changeGoods($event)" />

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <goods-item
          v-for="(item,idx) in list"
          :key="idx"
          :goods-id="item.id"
          :img="item.picUrl"
          :title="item.name"
          :desc="item.brief"
          :price="item.retailPrice"
          :discount="item.counterPrice"
        />
      </div>
    </van-list>
    <van-empty v-if="list && list.length <=0 " description="没有搜索到商品" />
  </div>
</template>

<script>
import { getSearchList } from '@/api/search'
import NavBar from './modules/NavBar'
import FilterBar from './modules/FilterBar'
import GoodsItem from '@/components/GoodsItem'

export default {
  name: 'SearchList',
  components: {
    NavBar,
    FilterBar,
    GoodsItem
  },
  data() {
    return {
      value: '',
      list: [],
      pageSize: 10,
      pageNum: 1,
      keyword: '',
      isNew: false,
      isHot: false,
      isPrice: false,
      isSales: false,
      filterNew: false,
      filterHot: false,
      loading: false,
      finished: false,
      isSkeletonShow: true
    }
  },
  mounted() {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      overlay: true,
      duration: 0
    })
    const { keyword } = this.$route.query
    this.value = keyword
    this.keyword = keyword
    this.getList()
  },
  methods: {
    onReachBottom() {
      this.pageNum += 1
      this.getList()
    },
    getList() {
      getSearchList({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        keyword: this.keyword,
        isNew: this.isNew,
        isHot: this.isHot,
        isPrice: this.isPrice,
        isSales: this.isSales,
        filterNew: this.filterNew,
        filterHot: this.filterHot
      }).then((res) => {
        const data = res.map.goods
        this.list = [...this.list, ...data]
        this.loading = false
        if (data.length < this.pageNum && this.list.length > 0) {
          this.finished = true
        }
        this.$toast.clear()
      })
    },
    handleSearch(key) {
      this.$router.replace({
        path: '/search/list',
        query: {
          keyword: key,
          t: +new Date()
        }
      })
    },
    changeGoods(val) {
      // 筛选
      if (val['search'] === 'filterNew') {
        this.filterNew = val['val']
        this.pageNum = 1
      }
      if (val['search'] === 'filterHot') {
        this.filterHot = val['val']
        this.pageNum = 1
      }
      // 存在筛选条件时，不过滤排序条件
      if (val['search'] !== 'filterNew' && val['search'] !== 'filterHot') {
        this.reset()
      }

      // 排序
      if (val['search'] === 'isNew') {
        this.isNew = true
      } else if (val['search'] === 'isHot') {
        this.isHot = true
      } else if (val['search'] === 'price') {
        this.isPrice = true
        this.orderBy = val['orderBy']
      } else if (val['search'] === 'isSales') {
        this.isSales = true
      } else if (val['search'] === 'cancelPrice') {
        this.isPrice = false
        this.orderBy = ''
      }

      getSearchList({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        keyword: this.keyword,
        isNew: this.isNew,
        isHot: this.isHot,
        isPrice: this.isPrice,
        isSales: this.isSales,
        orderBy: this.orderBy,
        filterNew: this.filterNew,
        filterHot: this.filterHot
      }).then((res) => {
        const data = res.map.goods
        this.list = [...data]
        this.loading = false
        if (data.length < this.pageNum && this.list.length > 0) {
          this.finished = true
        }
        this.$toast.clear()
      })
    },
    reset() {
      this.pageSize = 10
      this.pageNum = 1
      this.isNew = false
      this.isHot = false
      this.isPrice = false
      this.isSales = false
      this.finished = false
    }
  }
}
</script>

<style lang="scss" scoped>
.search-list {
  .main {
    background: #fff;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
