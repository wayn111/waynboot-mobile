<template>
  <div class="search-container">
    <div class="search-nav-bar">
      <van-icon
        size="16"
        name="arrow-left"
        style="padding: 12px 0 12px 12px"
        @click="$router.back()"
      />
      <!--搜索栏-->
      <van-search
        v-model="searchText"
        style="width: 100%"
        show-action
        placeholder="搜索商品名称"
        @search="onSearch"
        @focus="isResultShow = false"
        @cancel="onCancel"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <search-words v-if="searchText == ''" :hot-list="hotList" />
    <!--联想建议-->
    <search-suggestion v-else-if="searchText" :search-text="searchText" />
  </div>
</template>

<script>
import { getHotList } from '@/api/search'
import SearchWords from './modules/Words'
import SearchSuggestion from './modules/Suggest'
export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchWords
  },
  data() {
    return {
      defaultSearch: '',
      hotList: [],
      searchText: '', // 输入搜索框的内容
      isResultShow: false // 控制搜索结果的显示状态
    }
  },
  methods: {
    onSearch(val) {
      // 展示搜索结果
      this.isResultShow = true
      this.$router.push({
        path: '/search/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    onCancel() {
      this.$router.back()
    },
    getHot() {
      getHotList().then(res => {
        this.hotList = res.map.data
        this.defaultSearch = res.map.default
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
    }
  }
}
</script>

<style lang="scss" scoped>
.search-nav-bar {
  display: flex;
  align-items: center;
}
</style>

