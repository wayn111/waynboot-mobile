<template>
  <div class="category">
    <Header />
    <van-tree-select
      height="calc(100vh - 50px)"
      :items="categoryList"
      :main-active-index.sync="active"
      @click-nav="onL1CateClick"
    >
      <template #content>
        <div class="main">
          <image-pic width="100%" height="85" fit="fill" :src="currentCategory.picUrl" />
          <div class="main__item">
            <h3 class="main__item__title">{{ currentCategory.remark }}</h3>
            <div class="main__item__content">
              <van-grid :column-num="3" :border="false">
                <van-grid-item v-for="(single,idx) in subCategoryList" :key="idx" class="single" @click="onL2CateClick(single.id)">
                  <image-pic fit="contain" :src="single.icon" />
                  <span>{{ single.text }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </div>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>

<script>
import Header from '../home/modules/Header'
import { getCategoryData, getCategoryContent } from '@/api/category'

export default {
  name: 'Category',
  components: {
    Header
  },
  data() {
    return {
      active: 0,
      categoryList: [],
      currentCategory: {},
      subCategoryList: []
    }
  },
  mounted() {
    this.getCategoryData()
  },
  methods: {
    getCategoryData() {
      getCategoryData().then((res) => {
        const { categoryList, currentCategory, subCategoryList } = res.map
        this.categoryList = categoryList
        this.currentCategory = currentCategory
        this.subCategoryList = subCategoryList
      })
    },
    getCategoryContent() {
      getCategoryContent({
        id: this.categoryList[this.active].id
      }).then((res) => {
        const { currentCategory, subCategoryList } = res.map
        this.currentCategory = currentCategory
        this.subCategoryList = subCategoryList
      })
    },
    onL1CateClick() {
      this.getCategoryContent()
    },
    // 跳转
    onL2CateClick(cateId) {
      this.$router.push({
        path: `/product/2/${cateId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

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
  }
}
</style>
