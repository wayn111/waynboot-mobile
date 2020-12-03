<template>
  <div class="search">
    <nav-bar v-model="value" :default-search="defaultSearch" @handleSearch="handleSearch" />
    <search-words :hot-list="hotList" />
  </div>
</template>

<script>
import { getHotList } from '@/api/search'
import NavBar from './modules/NavBar'
import SearchWords from './modules/Words'

export default {
  name: 'Search',
  components: {
    NavBar,
    SearchWords
  },
  data() {
    return {
      value: '',
      defaultSearch: '',
      hotList: []
    }
  },
  mounted() {
    this.getHot()
  },
  methods: {
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
