<template>
  <div class="diamond-list wb-page">
    <nav-bar :title="diamond.name || '精选商品'">
      <van-icon
        name="shopping-cart-o"
        color="#1d1d1f"
        :badge="count"
        size="22"
        @click="cartClick"
      />
    </nav-bar>

    <section class="diamond-list__hero">
      <div class="diamond-list__hero__copy">
        <span class="diamond-list__eyebrow">精选</span>
        <h1 class="diamond-list__title">{{ diamond.name || '精选商品' }}</h1>
      </div>
      <span class="diamond-list__count">{{ list.length }} 件</span>

      <div v-if="diamond.picUrl" class="diamond-list__banner">
        <image-pic :src="diamond.picUrl" width="100%" height="100%" />
      </div>
    </section>

    <main class="diamond-list__main">
      <div class="diamond-list__section-head">
        <h2 class="diamond-list__section-title">商品</h2>
        <span class="diamond-list__section-meta">{{ finished ? '已全部加载' : '继续浏览' }}</span>
      </div>

      <van-empty
        v-if="!isSkeletonShow && list.length === 0"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="96"
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
            :virtual-sales="item.virtualSales"
            @getCartGoodsCount="handleGetCartGoodsCount"
          />
        </van-list>
      </van-pull-refresh>
    </main>

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
.diamond-list {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 84% 0%, rgba(0, 113, 227, 0.13), transparent 34%),
    linear-gradient(180deg, #f5f5f7 0%, #ffffff 46%, #f5f5f7 100%);
  color: #1d1d1f;
}

.diamond-list__hero,
.diamond-list__main {
  width: calc(100% - 48px);
  max-width: calc(var(--wb-content-width) - 48px);
  margin: 0 auto;
}

.diamond-list__hero {
  position: relative;
  padding: 26px 24px 24px;
  overflow: hidden;
  border: 1px solid rgba(210, 210, 215, 0.72);
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.07);
}

.diamond-list__hero__copy {
  padding-right: 130px;
}

.diamond-list__eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
}

.diamond-list__title {
  margin-top: 18px;
  font-size: 50px;
  line-height: 1.08;
  letter-spacing: -0.24px;
  font-weight: 600;
  color: #1d1d1f;
  word-break: break-word;
}

.diamond-list__count {
  position: absolute;
  top: 28px;
  right: 24px;
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  font-weight: 600;
}

.diamond-list__banner {
  margin-top: 24px;
  height: 260px;
  overflow: hidden;
  border-radius: 30px;
  background: linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%);
}

.diamond-list__main {
  margin-top: 18px;
  padding: 24px;
  border: 1px solid rgba(210, 210, 215, 0.64);
  border-radius: 36px 36px 0 0;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
}

.diamond-list__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.diamond-list__section-title {
  font-size: 40px;
  line-height: 1.12;
  font-weight: 600;
  color: #1d1d1f;
}

.diamond-list__section-meta {
  flex: none;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

:deep(.van-list) {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

:deep(.van-empty__description),
:deep(.van-list__finished-text),
:deep(.van-pull-refresh__head) {
  font-size: 28px;
  color: rgba(29, 29, 31, 0.52);
}

@media (max-width: 375px) {
  .diamond-list__hero,
  .diamond-list__main {
    width: calc(100% - 40px);
    max-width: calc(var(--wb-content-width) - 40px);
  }

  .diamond-list__hero {
    padding: 24px 20px;
  }

  .diamond-list__main {
    padding: 22px 20px;
  }
}
</style>
