<template>
  <div class="search-list">
    <nav-bar
      v-model="searchText"
      @handleSearch="handleSearch"
      @handleFocus="handleFocus"
    />
    <div v-if="!focus">
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
            v-for="(item, idx) in list"
            :key="idx"
            :goods-id="item.id"
            :img="item.picUrl"
            :title="item.name"
            :desc="item.brief"
            :price="item.retailPrice"
            :discount="item.counterPrice"
            :virtual-sales="item.virtualSales"
          />
        </div>
      </van-list>
      <van-empty v-if="list && list.length <= 0" description="没有搜索到商品" />
    </div>
    <search-suggestion v-else :search-text="searchText" />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { getSearchList } from '@/api/search'
import SearchSuggestion from './modules/Suggest'
import NavBar from './modules/NavBar'
import FilterBar from './modules/FilterBar'
import GoodsItem from '@/components/GoodsItem'

const router = useRouter()
const route = useRoute()

const state = reactive({
  searchText: '',
  focus: false,
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
  orderBy: '',
})
const {
  searchText,
  focus,
  list,
  pageSize,
  pageNum,
  keyword,
  isNew,
  isHot,
  isPrice,
  isSales,
  filterNew,
  filterHot,
  loading,
  finished,
  orderBy,
} = toRefs(state)

const getList = () => {
  getSearchList({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
    keyword: keyword.value,
    isNew: isNew.value,
    isHot: isHot.value,
    isPrice: isPrice.value,
    isSales: isSales.value,
    orderBy: orderBy.value,
    filterNew: filterNew.value,
    filterHot: filterHot.value,
  }).then((res) => {
    const data = res.data || []
    list.value = [...list.value, ...data]
    loading.value = false
    if (data.length < pageSize.value && list.value.length > 0) {
      finished.value = true
    }
    closeToast()
  })
}

const reset = () => {
  pageSize.value = 10
  pageNum.value = 1
  isNew.value = false
  isHot.value = false
  isPrice.value = false
  isSales.value = false
  finished.value = false
}

const loadByKeyword = (nextKeyword) => {
  const normalizedKeyword = nextKeyword || ''
  searchText.value = normalizedKeyword
  keyword.value = normalizedKeyword
  list.value = []
  focus.value = false
  reset()
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    overlay: true,
    duration: 0,
  })
  getList()
}

const onReachBottom = () => {
  pageNum.value += 1
  getList()
}

const handleSearch = (key) => {
  router.replace({
    path: '/search/list',
    query: {
      keyword: key,
      t: +new Date(),
    },
  })
}

const handleFocus = () => {
  focus.value = true
}

const changeGoods = (val) => {
  if (val.search === 'filterNew') {
    filterNew.value = val.val
    pageNum.value = 1
  }
  if (val.search === 'filterHot') {
    filterHot.value = val.val
    pageNum.value = 1
  }
  if (val.search !== 'filterNew' && val.search !== 'filterHot') {
    reset()
  }

  if (val.search === 'isNew') {
    isNew.value = true
  } else if (val.search === 'isHot') {
    isHot.value = true
  } else if (val.search === 'price') {
    isPrice.value = true
    orderBy.value = val.orderBy
  } else if (val.search === 'isSales') {
    isSales.value = true
  } else if (val.search === 'cancelPrice') {
    isPrice.value = false
    orderBy.value = ''
  }

  getSearchList({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
    keyword: keyword.value,
    isNew: isNew.value,
    isHot: isHot.value,
    isPrice: isPrice.value,
    isSales: isSales.value,
    orderBy: orderBy.value,
    filterNew: filterNew.value,
    filterHot: filterHot.value,
  }).then((res) => {
    const data = res.data || []
    list.value = [...data]
    loading.value = false
    finished.value = data.length < pageSize.value && list.value.length > 0
    closeToast()
  })
}

onMounted(() => {
  loadByKeyword(route.query.keyword)
})

watch(
  () => route.query.keyword,
  (nextKeyword, prevKeyword) => {
    if (nextKeyword === prevKeyword) {
      return
    }
    loadByKeyword(nextKeyword)
  }
)
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
