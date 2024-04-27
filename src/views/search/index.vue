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

<script>
import { getHotList } from '@/api/search'
import SearchWords from './modules/Words'
import NavBar from './modules/NavBar'
import SearchSuggestion from './modules/Suggest'
export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchWords,
    NavBar
  },
  data() {
    return {
      defaultSearch: '',
      hotList: [],
      searchText: '', // 输入搜索框的内容
      isResultShow: false // 控制搜索结果的显示状态
    }
  },
  mounted() {
    this.getHot()
  },
  methods: {
    getHot() {
      getHotList().then(res => {
        this.hotList = res.data.hotStrings
        this.defaultSearch = res.data.defaultSearch
      }).catch(e => {})
      // this.hotList = ['衣服', '手机', '三体书籍三体书籍', '鞋子', '箱包']
    },
    handleSearch(value) {
      this.$router.push({
        path: '/search/list',
        query: {
          keyword: value
        }
      })
    },
    handleFocus() {

    }
  }
}
</script>

<style scoped>
</style>

