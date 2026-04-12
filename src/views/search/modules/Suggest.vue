<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(str, index) in suggestions"
      :key="index"
      icon="search"
      :title="str"
      @click="search(str)"
    >
      <template #title><div v-html="highlight(str)" /></template>
    </van-cell>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

import { getSearchSuggest } from '@/api/search'

const props = defineProps({
  searchText: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const state = reactive({
  suggestions: [],
})
const { suggestions } = toRefs(state)

const search = (str) => {
  router.push({
    path: '/search/list',
    query: {
      keyword: str,
    },
  })
}

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const highlight = (str) => {
  if (!props.searchText) {
    return str
  }

  const regStr = new RegExp(escapeRegExp(props.searchText), 'gi')
  return str.replace(regStr, (match) => {
    return `<span style="color: red">${match}</span>`
  })
}

watch(
  () => props.searchText,
  debounce((value) => {
    if (!value) {
      suggestions.value = []
      return
    }

    getSearchSuggest({ keyword: value }).then((res) => {
      suggestions.value = res.data || []
    })
  }, 300),
  { immediate: true }
)
</script>

<style scoped></style>
