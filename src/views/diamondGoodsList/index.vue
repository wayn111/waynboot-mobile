<template>
  <div class="diamond-page wb-page">
    <nav-bar :title="diamond.name || ''">
      <button class="cart-entry" type="button" aria-label="购物车" @click="cartClick">
        <van-icon name="shopping-cart-o" :color="variables.black" size="32" />
        <span v-if="count" class="cart-entry__badge">{{ count }}</span>
      </button>
    </nav-bar>

    <section class="diamond-hero">
      <div class="diamond-hero__copy">
        <p class="diamond-hero__label">商品专题</p>
        <h1 class="diamond-hero__title">{{ diamond.name || '精选商品' }}</h1>
      </div>
      <div v-if="diamond.picUrl" class="diamond-hero__media">
        <image-pic :src="diamond.picUrl" width="100%" height="100%" fit="cover" />
      </div>
    </section>

    <main class="diamond-main">
      <div v-if="list.length > 0" class="section-head">
        <h2 class="section-head__title">商品清单</h2>
        <span class="section-head__count">{{ list.length }} 款</span>
      </div>

      <van-empty
        v-if="!isSkeletonShow && list.length === 0"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="120"
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
          <product-card
            v-for="item in list"
            :key="item.id"
            :goods="item"
            @cart-count-change="handleGetCartGoodsCount"
          />
        </van-list>
      </van-pull-refresh>
    </main>

    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getCartGoodsCount as getCartGoodsCountApi } from '@/api/cart'
import { getGoodsList } from '@/api/diamond'
import NavBar from '@/components/NavBar'
import variables from '@/styles/variables.scss?inline'
import ProductCard from './modules/ProductCard'
import Skeleton from './modules/Skeleton'

const router = useRouter()

const props = defineProps({
  diamondId: {
    type: [Number, String],
    default: 0,
  },
})

const list = ref([])
const diamond = ref({})
const count = ref(0)
const pageNo = ref(1)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const isSkeletonShow = ref(true)

const pageSize = 10

const setProductList = (goods) => {
  if (pageNo.value === 1) {
    list.value = goods
    return
  }

  list.value = [...list.value, ...goods]
}

const getProductList = async () => {
  const res = await getGoodsList({
    pageNum: pageNo.value,
    pageSize,
    diamondId: props.diamondId
  })

  const goods = res.data?.goods || []
  diamond.value = res.data?.diamond || {}
  setProductList(goods)
  finished.value = goods.length < pageSize
  refreshing.value = false
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
.diamond-page {
  min-height: 100vh;
  background: #f5f5f7;
  color: #1d1d1f;

  :deep(.van-sticky) {
    background: rgba(245, 245, 247, 0.82);
    backdrop-filter: blur(18px);
  }

  :deep(.van-empty) {
    margin: 40px 0;
    padding: 72px 24px;
    border-radius: 32px;
    background: #fff;
  }

  :deep(.van-empty__description) {
    font-size: 30px;
    color: rgba(29, 29, 31, 0.58);
  }
}

.cart-entry {
  position: relative;
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  padding: 0;

  &:active {
    transform: scale(0.95);
  }
}

.cart-entry__badge {
  position: absolute;
  top: -10px;
  right: -10px;
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: 999px;
  background: #0071e3;
  color: #fff;
  font-size: 28px;
  line-height: 34px;
  font-weight: 600;
  transform: scale(0.72);
  transform-origin: center;
}

.diamond-hero {
  margin: 16px 24px 0;
  padding: 32px 28px 28px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 36px;
  background: #fff;
  overflow: hidden;
}

.diamond-hero__copy {
  position: relative;
  z-index: 1;
}

.diamond-hero__label {
  width: fit-content;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f5f5f7;
  color: #0066cc;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
}

.diamond-hero__title {
  margin-top: 24px;
  font-size: 52px;
  line-height: 1.08;
  letter-spacing: -0.32px;
  font-weight: 600;
}

.diamond-hero__meta {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    border-radius: 999px;
    background: #f5f5f7;
    color: rgba(29, 29, 31, 0.72);
    font-size: 28px;
    line-height: 1;
  }
}

.diamond-hero__media {
  margin-top: 32px;
  aspect-ratio: 270 / 100;
  border-radius: 28px;
  background: #f5f5f7;
  overflow: hidden;

  :deep(.van-image),
  :deep(.van-image__img) {
    width: 100%;
    height: 100%;
  }
}

.diamond-main {
  padding: 32px 24px 48px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-head__title {
  font-size: 38px;
  line-height: 1.16;
  letter-spacing: -0.24px;
  font-weight: 600;
}

.section-head__count {
  color: rgba(29, 29, 31, 0.56);
  font-size: 28px;
  line-height: 1.2;
}
</style>
