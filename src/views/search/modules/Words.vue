<template>
  <div class="search-words">
    <section v-if="searchKey.length > 0" class="search-words__panel">
      <div class="search-words__head">
        <div class="search-words__title">
          <van-icon name="underway-o" />
          <span>最近搜索</span>
        </div>
        <button type="button" class="search-words__delete" @click="onDelete">
          <van-icon name="delete-o" />
        </button>
      </div>

      <div class="search-words__chips">
        <button
          v-for="(item, idx) in searchKey"
          :key="idx"
          type="button"
          class="search-words__chip"
          @click="onSearch(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <section class="search-words__panel">
      <div class="search-words__head">
        <div class="search-words__title">
          <van-icon name="fire-o" />
          <span>热门搜索</span>
        </div>
      </div>

      <div class="search-words__hot-grid">
        <button
          v-for="(item, idx) in hotList"
          :key="idx"
          type="button"
          class="search-words__hot"
          @click="onSearch(item)"
        >
          <span class="search-words__hot-index">{{ String(idx + 1).padStart(2, '0') }}</span>
          <span class="search-words__hot-text">{{ item }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const store = useStore()

const searchKey = computed(() => store.getters.searchKey || [])

defineProps({
  hotList: {
    type: Array,
    default: () => [],
  },
})

const onDelete = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定清空所有搜索记录吗？',
  })
    .then(() => {
      store.dispatch('search/delKey')
    })
    .catch(() => {})
}

const onSearch = (value) => {
  store.dispatch('search/setKey', value)
  router.push({
    path: '/search/list',
    query: {
      keyword: value,
    },
  })
}
</script>

<style lang="scss" scoped>
.search-words {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-words__panel {
  padding: 24px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.search-words__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.search-words__title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 30px;
  font-weight: 600;
  color: #1d1d1f;
}

.search-words__delete {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  border-radius: 50%;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.56);
}

.search-words__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.search-words__chip {
  min-height: 46px;
  padding: 0 18px;
  border: none;
  appearance: none;
  border-radius: 999px;
  background: #f5f5f7;
  color: #1d1d1f;
  font-size: 28px;
}

.search-words__hot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.search-words__hot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: none;
  appearance: none;
  border-radius: 24px;
  background: #f5f5f7;
  text-align: left;
}

.search-words__hot-index {
  min-width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.1);
  color: #1677ff;
  font-size: 24px;
  font-weight: 700;
}

.search-words__hot-text {
  flex: 1;
  font-size: 28px;
  line-height: 1.35;
  color: #1d1d1f;
}

@media (max-width: 375px) {
  .search-words {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
