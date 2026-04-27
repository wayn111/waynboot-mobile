<template>
  <div class="search-container wb-page">
    <nav-bar
      v-model="searchText"
      :default-search="defaultSearch"
      @handleSearch="handleSearch"
      @handleFocus="handleFocus"
    />

    <search-words v-if="searchText === ''" :hot-list="hotList" />
    <search-suggestion v-else :search-text="searchText" />
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { getHotList } from '@/api/search'
import SearchWords from './modules/Words'
import NavBar from './modules/NavBar'
import SearchSuggestion from './modules/Suggest'

const router = useRouter()

const state = reactive({
  defaultSearch: '',
  hotList: [],
  searchText: '',
})

const { defaultSearch, hotList, searchText } = toRefs(state)

const getHot = () => {
  getHotList()
    .then((res) => {
      hotList.value = res.data.hotStrings || []
      defaultSearch.value = res.data.defaultSearch || ''
    })
    .catch(() => {})
}

const handleSearch = (value) => {
  router.push({
    path: '/search/list',
    query: {
      keyword: value,
    },
  })
}

const handleFocus = () => {}

onMounted(() => {
  getHot()
})
</script>
