<template>
  <div class="category wb-page wb-page--tabbed">
    <div class="category__shell">
      <div class="category__topbar">
        <button type="button" class="category-search" @click="goSearch">
          <span class="category-search__icon">
            <svg-icon icon-class="search" :width="20" :height="20" />
          </span>
          <span class="category-search__placeholder">搜索商品、分类、关键词</span>
          <span class="category-search__divider" />
          <span class="category-search__action">搜索</span>
        </button>
      </div>

      <section class="category__hero">
        <span class="category__hero__eyebrow">分类</span>
        <h1 class="category__hero__title">挑一个感兴趣的开始</h1>
      </section>

      <section v-if="categoryList.length" class="category__rail">
        <div class="category__rail__track">
          <button
            v-for="(item, index) in categoryList"
            :key="item.id"
            type="button"
            class="category__rail__item"
            :class="{ 'category__rail__item--active': active === index }"
            @click="onCategoryClick(index)"
          >
            <span class="category__rail__thumb">
              <img v-if="item.icon" :src="item.icon" :alt="item.text" />
              <span v-else>{{ getInitial(item.text) }}</span>
            </span>
            <span class="category__rail__label">{{ item.text }}</span>
          </button>
        </div>
      </section>

      <button type="button" class="category__current" @click="goCurrentCategory">
        <div class="category__current__thumb">
          <img v-if="currentCover" :src="currentCover" :alt="currentLabel" />
          <span v-else>{{ getInitial(currentLabel) }}</span>
        </div>

        <div class="category__current__body">
          <span class="category__current__eyebrow">当前分类</span>
          <h2 class="category__current__title">{{ currentLabel }}</h2>
          <p class="category__current__desc">{{ currentRemark }}</p>
          <span class="category__current__meta">{{ subCategoryList.length }} 个子分类 · 进入全部</span>
        </div>

        <span class="category__current__arrow">
          <van-icon name="arrow" />
        </span>
      </button>

      <section class="category__section">
        <div class="category__section__head">
          <h2 class="category__section__title">继续浏览</h2>
          <span class="category__section__meta">{{ subCategoryList.length }} 项</span>
        </div>

        <div v-if="subCategoryList.length" class="category__grid">
          <button
            v-for="item in subCategoryList"
            :key="item.id"
            type="button"
            class="category__card"
            @click="goSubCategory(item.id)"
          >
            <span class="category__card__thumb">
              <img v-if="item.icon" :src="item.icon" :alt="item.text" />
              <span v-else>{{ getInitial(item.text) }}</span>
            </span>

            <span class="category__card__body">
              <span class="category__card__title">{{ item.text }}</span>
              <span class="category__card__link">
                进入分类
                <van-icon name="arrow" />
              </span>
            </span>
          </button>
        </div>

        <div v-else class="category__empty">
          <p class="category__empty__title">暂无更多子分类</p>
          <p class="category__empty__hint">直接进入「{{ currentLabel }}」查看全部商品</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getCategoryContent as getCategoryContentApi,
  getCategoryData as getCategoryDataApi,
} from '@/api/category'

const router = useRouter()
const route = useRoute()

const state = reactive({
  active: 0,
  categoryList: [],
  currentCategory: {},
  subCategoryList: [],
})

const { active, categoryList, currentCategory, subCategoryList } = toRefs(state)

const currentLabel = computed(() => {
  return currentCategory.value.name || categoryList.value[active.value]?.text || '分类'
})

const currentRemark = computed(() => {
  return currentCategory.value.remark || '精选好物，舒享品质生活'
})

const currentCover = computed(() => {
  return currentCategory.value.picUrl || currentCategory.value.iconUrl || categoryList.value[active.value]?.icon || ''
})

const getInitial = (text) => {
  return String(text || '分').slice(0, 1)
}

const applyCategoryContent = (data = {}) => {
  currentCategory.value = data.currentCategory || {}
  subCategoryList.value = data.subCategoryList || []
}

const syncCategory = async (index, options = {}) => {
  const currentItem = categoryList.value[index]
  if (!currentItem) {
    return
  }

  active.value = index

  const res = await getCategoryContentApi({
    id: currentItem.id,
  })

  applyCategoryContent(res.data)

  if (!options.skipRoute) {
    router.replace({
      path: '/category',
      query: {
        ...route.query,
        id: currentItem.id,
      },
    })
  }
}

const getCategoryData = async () => {
  const res = await getCategoryDataApi()
  categoryList.value = res.data?.categoryList || []
  applyCategoryContent(res.data)

  const queryId = Number(route.query.id)
  const matchedIndex = categoryList.value.findIndex((item) => Number(item.id) === queryId)
  const nextIndex = matchedIndex >= 0 ? matchedIndex : 0

  await syncCategory(nextIndex, { skipRoute: true })
}

const onCategoryClick = async (index) => {
  await syncCategory(index)
}

const goSearch = () => {
  router.push('/search')
}

const goCurrentCategory = () => {
  if (!currentCategory.value?.id) {
    return
  }

  router.push({
    path: `/product/1/${currentCategory.value.id}`,
  })
}

const goSubCategory = (cateId) => {
  router.push({
    path: `/product/2/${cateId}`,
  })
}

onMounted(() => {
  getCategoryData()
})

watch(
  () => route.query.id,
  (value, oldValue) => {
    if (value === oldValue || categoryList.value.length <= 0) {
      return
    }

    const index = categoryList.value.findIndex((item) => Number(item.id) === Number(value))
    if (index >= 0) {
      syncCategory(index, { skipRoute: true })
    }
  }
)
</script>

<style lang="scss" scoped>
.category {
  min-height: 100%;
  background: #f5f5f7;
}

.category__shell {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 18px 32px;
}

.category__topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  margin: 0 -18px;
  padding: calc(max(env(safe-area-inset-top, 0px), 0px) + 14px) 18px 14px;
  background: rgba(245, 245, 247, 0.86);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
}

.category-search {
  width: 100%;
  min-height: 72px;
  padding: 0 20px 0 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
  text-align: left;
}

.category-search__icon {
  flex: none;
  color: rgba(29, 29, 31, 0.42);
}

.category-search__placeholder {
  flex: 1;
  min-width: 0;
  font-size: 28px;
  line-height: 1.25;
  color: rgba(29, 29, 31, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-search__divider {
  width: 1px;
  height: 24px;
  flex: none;
  background: rgba(29, 29, 31, 0.08);
}

.category-search__action {
  flex: none;
  color: #0071e3;
  font-size: 28px;
  font-weight: 600;
}

.category__hero {
  padding: 22px 6px 0;
}

.category__hero__eyebrow {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
}

.category__hero__title {
  margin-top: 14px;
  font-size: 48px;
  line-height: 1.06;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.4px;
}

.category__rail {
  margin-top: 20px;
}

.category__rail__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 112px;
  gap: 12px;
  overflow-x: auto;
  margin: 0 -18px;
  padding: 4px 18px 8px;
  scrollbar-width: none;
}

.category__rail__track::-webkit-scrollbar {
  display: none;
}

.category__rail__item {
  min-height: 124px;
  padding: 16px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(29, 29, 31, 0.04);
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.category__rail__item:active {
  transform: scale(0.97);
}

.category__rail__item--active {
  border-color: rgba(0, 113, 227, 0.32);
  box-shadow:
    inset 0 0 0 2px rgba(0, 113, 227, 0.18),
    0 14px 32px rgba(0, 113, 227, 0.1);
}

.category__rail__thumb {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.52);
  font-size: 30px;
  font-weight: 600;
}

.category__rail__item--active .category__rail__thumb {
  background: #eaf3ff;
  color: #0071e3;
}

.category__rail__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category__rail__label {
  font-size: 24px;
  line-height: 1.2;
  color: #1d1d1f;
  font-weight: 500;
}

.category__rail__item--active .category__rail__label {
  color: #0071e3;
  font-weight: 700;
}

.category__current {
  width: 100%;
  margin-top: 22px;
  padding: 24px;
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 18px;
  border: none;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
  text-align: left;
  transition: transform 0.2s ease;
}

.category__current:active {
  transform: scale(0.98);
}

.category__current__thumb {
  width: 116px;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 26px;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.5);
  font-size: 40px;
  font-weight: 600;
}

.category__current__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category__current__body {
  min-width: 0;
}

.category__current__eyebrow {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 600;
}

.category__current__title {
  margin-top: 10px;
  font-size: 36px;
  line-height: 1.14;
  font-weight: 700;
  color: #1d1d1f;
  word-break: break-word;
}

.category__current__desc {
  margin-top: 8px;
  font-size: 26px;
  line-height: 1.32;
  color: rgba(29, 29, 31, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category__current__meta {
  display: inline-block;
  margin-top: 12px;
  font-size: 24px;
  line-height: 1.2;
  color: #0071e3;
  font-weight: 600;
}

.category__current__arrow {
  justify-self: end;
  color: rgba(29, 29, 31, 0.32);
  font-size: 30px;
}

.category__section {
  margin-top: 28px;
}

.category__section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.category__section__title {
  font-size: 36px;
  line-height: 1.14;
  font-weight: 700;
  color: #1d1d1f;
}

.category__section__meta {
  padding: 6px 14px;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
}

.category__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.category__card {
  min-height: 112px;
  padding: 18px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border: none;
  border-radius: 26px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category__card:active {
  transform: scale(0.97);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
}

.category__card__thumb {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
  background: #f5f5f7;
  color: rgba(29, 29, 31, 0.52);
  font-size: 30px;
  font-weight: 600;
}

.category__card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category__card__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category__card__title {
  font-size: 28px;
  line-height: 1.26;
  color: #1d1d1f;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.category__card__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 22px;
  line-height: 1.2;
  color: #0071e3;
  font-weight: 600;
}

.category__empty {
  padding: 32px 24px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
  text-align: center;
}

.category__empty__title {
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
  color: #1d1d1f;
}

.category__empty__hint {
  margin-top: 10px;
  font-size: 26px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.5);
}

@media (max-width: 375px) {
  .category__shell {
    padding-left: 14px;
    padding-right: 14px;
  }

  .category__topbar {
    margin: 0 -14px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .category__rail__track {
    margin: 0 -14px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .category__hero__title {
    font-size: 42px;
  }

  .category__current {
    grid-template-columns: 100px minmax(0, 1fr) 32px;
    gap: 14px;
  }

  .category__current__thumb {
    width: 100px;
    height: 100px;
  }

  .category__grid {
    gap: 12px;
  }

  .category__card {
    padding: 16px;
  }
}
</style>
