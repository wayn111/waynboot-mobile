<template>
  <div class="search wb-page">
    <div class="search__body">
      <nav-bar
        v-model="value"
        :default-search="defaultSearch"
        @handleSearch="handleSearch"
      />
      <search-words :hot-list="hotList" />
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

import { getHotList } from '@/api/search'
import NavBar from './modules/NavBar'
import SearchWords from './modules/Words'

const state = reactive({value: '',
      defaultSearch: '',
      hotList: [],})
const { value, defaultSearch, hotList } = toRefs(state)

const getHot = () => {
  getHotList()
        .then((res) => {
          hotList.value = res.data.hotStrings
          defaultSearch.value = res.data.defaultSearch
        })
        .catch((e) => {})
      // hotList.value = ['衣服', '手机', '三体书籍三体书籍', '鞋子', '箱包']
}

const handleSearch = (value) => {
  router.push({
        path: '/search/list',
        query: {
          keyword: value,
        },
      })
}

onMounted(() => {
  getHot()
})
</script>

<style lang="scss" scoped>
.search__body {
  margin: 24px 24px 24px;
  padding-bottom: 12px;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(28px);
}
</style>
