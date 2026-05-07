<template>
  <div class="product wb-page">
    <nav-bar :title="diamond.name || ''">
      <van-icon
        name="shopping-cart-o"
        :color="variables.black"
        :badge="count"
        size="18"
        @click="cartClick"
      />
    </nav-bar>

    <section class="product__hero">
      <span class="product__hero__eyebrow">Spotlight</span>
      <h1 class="product__hero__title">{{ diamond.name || '精选会场' }}</h1>
      <p class="product__hero__desc">
        用更纯净的展示层保留原有金刚位跳转与商品分页体验。
      </p>
      <div class="banner">
        <image-pic :src="diamond.picUrl" width="100%" height="220px" />
      </div>
    </section>

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
            style="margin-bottom: 12px"
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
  background: linear-gradient(180deg, #000000 0, #000000 520px, #f5f5f7 520px, #f5f5f7 100%);

  .product__hero {
    padding: 20px 24px 28px;
    color: #fff;
  }

  .product__hero__eyebrow {
    display: inline-block;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.72);
  }

  .product__hero__title {
    margin-top: 14px;
    font-size: 52px;
    line-height: 1.08;
    letter-spacing: -0.24px;
    font-weight: 600;
  }

  .product__hero__desc {
    margin-top: 16px;
    font-size: 24px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.78);
  }

  .banner {
    margin-top: 36px;
    overflow: hidden;
    border-radius: 36px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  }

  .main {
    margin: 0 24px 24px;
    padding: 24px;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  }
}
</style>
