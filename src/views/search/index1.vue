<template>
  <div class="search">
    <nav-bar
      v-model="value"
      :default-search="defaultSearch"
      @handleSearch="handleSearch"
    />
    <search-words :hot-list="hotList" />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
