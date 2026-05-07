<template>
  <div class="search-list wb-page">
    <template v-if="!focus">
      <nav-bar
        v-model="searchText"
        :autofocus="false"
        @handleSearch="handleSearch"
        @handleFocus="handleFocus"
      />
      <div class="search-list__shell">
        <section class="search-list__summary">
          <div>
            <p class="search-list__eyebrow">搜索结果</p>
            <div class="search-list__title">
              {{ keyword || '搜索结果' }}
            </div>
          </div>
          <span class="search-list__meta">{{ list.length }} 件已加载</span>
        </section>
        <filter-bar @changeGoods="changeGoods($event)" />
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onReachBottom"
        >
          <div class="search-list__grid">
            <button
              v-for="(item, idx) in list"
              :key="idx"
              type="button"
              class="search-list__card"
              @click="goDetail(item.id)"
            >
              <span class="search-list__card__thumb">
                <image-pic fit="cover" width="100%" height="100%" :src="item.picUrl" />
              </span>
              <span class="search-list__card__body">
                <span class="search-list__card__badge">销量 {{ item.virtualSales || 0 }}</span>
                <span class="search-list__card__title">{{ item.name }}</span>
                <span class="search-list__card__desc">{{ item.brief }}</span>
                <span class="search-list__card__sales">已售 {{ item.virtualSales || 0 }}</span>
                <span class="search-list__card__footer">
                  <span class="search-list__card__price">¥{{ yuan(item.retailPrice) }}</span>
                  <span v-if="item.counterPrice" class="search-list__card__compare">
                    ¥{{ yuan(item.counterPrice) }}
                  </span>
                </span>
              </span>
            </button>
          </div>
        </van-list>
        <van-empty v-if="list && list.length <= 0" description="没有搜索到商品" />
      </div>
    </template>
    <template v-else>
      <nav-bar
        v-model="searchText"
        @handleSearch="handleSearch"
        @handleFocus="handleFocus"
      />
      <search-suggestion :search-text="searchText" />
    </template>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { getSearchList } from '@/api/search'
import { yuan } from '@/filter'
import SearchSuggestion from './modules/Suggest'
import NavBar from './modules/NavBar'
import FilterBar from './modules/FilterBar'

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

const goDetail = (goodsId) => {
  router.push({
    path: `/detail/${goodsId}`,
  })
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
.search-list__shell {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding-bottom: 24px;
}

.search-list__summary {
  margin: 0 24px 16px;
  padding: 24px 24px 26px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.search-list__eyebrow {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.search-list__title {
  margin-top: 10px;
  font-size: 68px;
  line-height: 1.04;
  font-weight: 600;
  color: #1d1d1f;
}

.search-list__meta {
  flex: none;
  min-height: 44px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.08);
  font-size: 26px;
  white-space: nowrap;
  color: #1677ff;
}

.search-list__grid {
  box-sizing: border-box;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.search-list__card {
  overflow: hidden;
  padding: 0;
  border: none;
  border-radius: 30px;
  background: #ffffff;
  text-align: left;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.search-list__card__thumb {
  display: block;
  overflow: hidden;
  background: #f5f5f7;
}

.search-list__card__body {
  display: block;
  padding: 16px 16px 18px;
}

.search-list__card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.1);
  color: #1677ff;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.search-list__card__title {
  display: block;
  margin-top: 14px;
  min-height: 84px;
  font-size: 34px;
  line-height: 1.26;
  font-weight: 600;
  color: #1d1d1f;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-list__card__desc {
  display: block;
  margin-top: 10px;
  min-height: 72px;
  font-size: 28px;
  line-height: 1.42;
  color: rgba(29, 29, 31, 0.46);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-list__card__sales {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.44);
}

.search-list__card__footer {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 16px;
}

.search-list__card__price {
  font-size: 36px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.search-list__card__compare {
  font-size: 26px;
  color: rgba(29, 29, 31, 0.34);
  text-decoration: line-through;
}

:deep(.van-empty) {
  padding: 72px 0 32px;
}

@media (max-width: 375px) {
  .search-list__summary {
    margin: 0 20px 12px;
    padding: 22px 20px 24px;
  }

  .search-list__grid {
    gap: 12px;
    padding: 0 20px;
  }
}
</style>
