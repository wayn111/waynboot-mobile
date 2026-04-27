<template>
  <div class="search-suggestion">
    <button
      v-for="(str, index) in suggestions"
      :key="index"
      type="button"
      class="search-suggestion__item"
      @click="search(str)"
    >
      <span class="search-suggestion__icon">
        <van-icon name="search" />
      </span>
      <span class="search-suggestion__text" v-html="highlight(str)" />
      <span class="search-suggestion__arrow">
        <van-icon name="arrow" />
      </span>
    </button>
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
    return `<span class="search-suggestion__highlight">${match}</span>`
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

<style lang="scss" scoped>
.search-suggestion {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-suggestion__item {
  width: 100%;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: none;
  appearance: none;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  text-align: left;
}

.search-suggestion__icon,
.search-suggestion__arrow {
  width: 42px;
  height: 42px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.48);
}

.search-suggestion__text {
  flex: 1;
  font-size: 30px;
  line-height: 1.35;
  color: #1d1d1f;
}

:deep(.search-suggestion__highlight) {
  color: #1677ff;
  font-weight: 600;
}

@media (max-width: 375px) {
  .search-suggestion {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
