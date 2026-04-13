<template>
  <div class="product">
    <nav-bar :title="diamond.name || ''">
      <van-icon
        name="shopping-cart-o"
        :color="variables.black"
        :badge="count"
        size="18"
        @click="cartClick"
      />
    </nav-bar>

    <div class="banner">
      <image-pic :src="diamond.picUrl" width="100%" height="200px" />
    </div>

    <div class="main">
      <van-empty
        v-if="!isSkeletonShow && list.length === 0"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        description="暂无商品"
      />

      <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
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
            :is-new="item.isNew"
            :is-hot="item.isHot"
            style="margin-bottom: 7.5px"
            @getCartGoodsCount="handleGetCartGoodsCount"
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
import { getGoodsList } from '@/api/diamond'
import NavBar from '@/components/NavBar'
import ProductItem from '@/components/ProductItem'
import variables from '@/styles/variables.scss?inline'
import Skeleton from './modules/Skeleton'

const router = useRouter()

const props = defineProps({
  diamondId: {
    type: [Number, String],
    default: 0,
  },
})

const state = reactive({
  list: [],
  diamond: {},
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
  diamond,
  count,
  pageNo,
  pageSize,
  loading,
  finished,
  refreshing,
  isSkeletonShow,
} = toRefs(state)

const getProductList = async () => {
  const res = await getGoodsList({
    pageNum: pageNo.value,
    pageSize: pageSize.value,
    diamondId: props.diamondId,
  })

  const goods = res.data?.goods || []
  diamond.value = res.data?.diamond || {}

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

const handleGetCartGoodsCount = async () => {
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
  getProductList()
  handleGetCartGoodsCount()
})
</script>

<style lang="scss" scoped>
.product {
  min-height: 1334px;
  background: #f5f5f5;
}

.main {
  padding: 7.5px 0 0 0;
}
</style>
