<template>
  <div class="category">
    <Header />
    <van-tree-select
      height="calc(100vh - 50px)"
      :items="categoryList"
      v-model:main-active-index="active"
      @click-nav="onL1CateClick"
    >
      <template #content>
        <div class="main">
          <div class="main__item">
            <h3 class="main__item__title">{{ currentCategory.remark }}</h3>
            <div class="main__item__content">
              <van-grid :column-num="3" :border="false">
                <van-grid-item
                  v-for="(single, idx) in subCategoryList"
                  :key="idx"
                  class="single"
                  @click="onL2CateClick(single.id)"
                >
                  <image-pic fit="contain" :src="single.icon" />
                  <span class="textName">{{ single.text }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showLoadingToast } from 'vant'

import { getCategoryContent as getCategoryContentApi, getCategoryData as getCategoryDataApi } from '@/api/category'
import Header from '../home/modules/Header'

const router = useRouter()

const state = reactive({
  active: 0,
  categoryList: [],
  currentCategory: {},
  subCategoryList: [],
})
const { active, categoryList, currentCategory, subCategoryList } = toRefs(state)

const getCategoryData = async () => {
  const res = await getCategoryDataApi()
  const {
    categoryList: list,
    currentCategory: current,
    subCategoryList: sub,
  } = res.data
  categoryList.value = list || []
  currentCategory.value = current || {}
  subCategoryList.value = sub || []
}

const getCategoryContent = async () => {
  if (!categoryList.value[active.value]) {
    return
  }

  showLoadingToast({
    message: '加载中...',
    overlay: true,
    duration: 0,
    forbidClick: true,
  })

  try {
    const res = await getCategoryContentApi({
      id: categoryList.value[active.value].id,
    })
    const { currentCategory: current, subCategoryList: sub } = res.data
    currentCategory.value = current || {}
    subCategoryList.value = sub || []
  } finally {
    closeToast()
  }
}

const onL1CateClick = () => {
  getCategoryContent()
}

const onL2CateClick = (cateId) => {
  router.push({
    path: `/product/2/${cateId}`,
  })
}

onMounted(() => {
  getCategoryData()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.category {
  .main {
    box-sizing: border-box;
    padding: 10px;

    .main__item {
      .main__item__title {
        color: $black;
        font-size: $small;
        text-align: center;
        font-weight: bold;
        padding: 16px;
      }

      .main__item__content {
        .single {
          text-align: center;
          color: $black;
          font-size: $mini;
        }
      }
    }

    .textName {
      margin-top: 20px;
    }
  }
}
</style>
