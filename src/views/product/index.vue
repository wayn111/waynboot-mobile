<template>
  <div class="product">
    <nav-bar :title="category.name">
      <van-icon
        name="shopping-cart-o"
        :color="variables.black"
        :badge="count"
        size="18"
        @click="cartClick"
      />
    </nav-bar>

    <div class="main">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <product-item
            v-for="item in list"
            :key="item.id"
            :goods-id="item.id"
            :img="item.picUrl"
            :title="item.name"
            :desc="item.brief"
            :price="item.retailPrice"
            :discount="item.counterPrice"
            style="margin-bottom: 7.5px"
            @getCartGoodsCount="getCartGoodsCount"
          />
        </van-list>
      </van-pull-refresh>
    </div>

    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { getCartGoodsCount as getCartGoodsCountApi } from '@/api/cart'
import { firstCategoryGoods, secondCategoryGoods } from '@/api/product'
import NavBar from '@/components/NavBar'
import ProductItem from '@/components/ProductItem'
import variables from '@/styles/variables.scss?inline'
import Skeleton from './modules/Skeleton'

const router = useRouter()

const props = defineProps({
  cateId: {
    type: [String, Number],
    default: 0,
  },
  categoryLevel: {
    type: [String, Number],
    default: '',
  },
})

const state = reactive({
  list: [],
  category: {},
  initFun: null,
  count: 0,
  pageNo: 1,
  pageSize: 10,
  loading: false,
  finished: false,
  refreshing: false,
  isSkeletonShow: true,
})

const {
  list,
  category,
  initFun,
  count,
  pageNo,
  pageSize,
  loading,
  finished,
  refreshing,
  isSkeletonShow,
} = toRefs(state)

const getProductList = async () => {
  if (!initFun.value) {
    return
  }

  const res = await initFun.value({
    pageNum: pageNo.value,
    pageSize: pageSize.value,
    cateId: props.cateId,
  })

  const goods = res.data?.goods || []
  category.value = res.data?.category || {}

  if (refreshing.value) {
    list.value = goods
    refreshing.value = false
  } else if (pageNo.value === 1) {
    list.value = goods
  } else {
    list.value = [...list.value, ...goods]
  }

  finished.value = goods.length < pageSize.value
  loading.value = false
  isSkeletonShow.value = false
}

const getCartGoodsCount = async () => {
  try {
    const res = await getCartGoodsCountApi()
    count.value = res.data || 0
  } catch (error) {
    console.log(error)
  }
}

const onLoad = () => {
  if (pageNo.value === 1 && list.value.length === 0) {
    getProductList()
    return
  }

  loading.value = true
  pageNo.value += 1
  getProductList()
}

const onRefresh = () => {
  refreshing.value = true
  finished.value = false
  pageNo.value = 1
  getProductList()
}

const cartClick = () => {
  router.push({ name: 'Cart' })
}

onMounted(() => {
  initFun.value =
    props.categoryLevel === '1' ? firstCategoryGoods : secondCategoryGoods
  getProductList()
  getCartGoodsCount()
})
</script>

<style lang="scss" scoped>
.product {
  min-height: 1334px;
  background: #f5f5f5;
}
</style>
