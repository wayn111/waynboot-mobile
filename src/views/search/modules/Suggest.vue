<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(str, index) in suggestions"
      :key="index"
      icon="search"
      :title="str"
      @click="search(str)"
    >
      <div slot="title" v-html="hightlight(str)" />
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggest } from '@/api/search'
import { debounce } from 'lodash'
// /*// 函数防抖
// const fn = _.debounce(function () {
//   console.log('hello')
// }, 1000)
//
// fn()
// fn()
// setTimeout(() => {
//   fn()
// }, 1200)
// fn()*/
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
    // 当数据发生变化则会执行 handler处理函数
      handler: debounce(async function() {
      // 发请求
        const { data } = await getSearchSuggest({ keyword: this.searchText })
        this.suggestions = data
      }, 200),
      // async handler () {
      //   // 发请求
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    search(str) {
      this.$router.push({
        path: '/search/list',
        query: {
          keyword: str
        }
      })
    },
    hightlight(str) {
      // RegExp()是正则表达式的构造函数
      // 参数1： 字符串
      // 参数2： 匹配模式
      // 返回值： 正则对象
      const regStr = new RegExp(this.searchText, 'gi')
      return str.replace(regStr, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped>

</style>

