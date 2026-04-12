<template>
  <div class="search-container">
    <nav-bar
      v-model="searchText"
      :default-search="defaultSearch"
      @handleSearch="handleSearch"
      @handleFocus="handleFocus"
    />
    <search-words v-if="searchText == ''" :hot-list="hotList" />
    <!--联想建议-->
    <search-suggestion v-else-if="searchText" :search-text="searchText" />
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getHotList } from '@/api/search'
import SearchWords from './modules/Words'
import NavBar from './modules/NavBar'
import SearchSuggestion from './modules/Suggest'

const router = useRouter()
const route = useRoute()

const state = reactive({
  defaultSearch: '',
  hotList: [],
  searchText: '', // 输入搜索框的内容
  isResultShow: false, // 控制搜索结果的显示状态
})
const { defaultSearch, hotList, searchText, isResultShow } = toRefs(state)

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

const handleFocus = () => {
  
}

onMounted(() => {
  getHot()
})
</script>

<style scoped></style>
