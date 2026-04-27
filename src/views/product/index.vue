<template>
  <div class="product wb-page">
    <nav-bar :title="category.name || '商品列表'">
      <button type="button" class="product__cart" @click="cartClick">
        <van-icon name="shopping-cart-o" :badge="count" />
      </button>
    </nav-bar>

    <div class="product__body">
      <section class="product__hero">
        <div class="product__hero__copy">
          <p class="product__hero__eyebrow">{{ category.name || '商品列表' }}</p>
          <h1 class="product__hero__title">{{ heroTitle }}</h1>
          <p class="product__hero__desc">{{ heroDesc }}</p>
        </div>

        <div class="product__hero__media">
          <img v-if="heroImage" :src="heroImage" :alt="category.name || '商品列表'" />
          <div v-else class="product__hero__fallback" />
        </div>
      </section>

      <div class="product__content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad"
          >
            <div class="product__list">
              <article
                v-for="item in list"
                :key="item.id"
                class="product__goods"
                @click="goDetail(item.id)"
              >
                <div class="product__goods__thumb">
                  <img :src="item.picUrl" :alt="item.name" />
                </div>

                <div class="product__goods__body">
                  <h2 class="product__goods__title">{{ item.name }}</h2>
                  <p class="product__goods__desc">{{ item.brief || '精选好物 舒适耐用' }}</p>

                  <div class="product__goods__tags">
                    <span class="product__goods__tag">热门</span>
                    <span class="product__goods__tag">即刻发货</span>
                  </div>

                  <div class="product__goods__footer">
                    <div class="product__goods__price">
                      <strong>¥{{ yuan(item.retailPrice) }}</strong>
                      <span v-if="item.counterPrice">¥{{ yuan(item.counterPrice) }}</span>
                    </div>
                    <button
                      type="button"
                      class="product__goods__button"
                      @click.stop="addCart(item.id)"
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <Skeleton v-if="isSkeletonShow" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { addDefaultGoodsProduct, getCartGoodsCount as getCartGoodsCountApi } from '@/api/cart'
import { firstCategoryGoods, secondCategoryGoods } from '@/api/product'
import { yuan } from '@/filter'
import NavBar from '@/components/NavBar'
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

const heroTitle = computed(() => {
  return `${category.value?.name || '精选好物'} 限时好价`
})

const heroDesc = computed(() => {
  return category.value?.remark || '精选好物 舒享品质生活'
})

const heroImage = computed(() => {
  return category.value?.picUrl || category.value?.iconUrl || list.value[0]?.picUrl || ''
})

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
    count.value = 0
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

const goDetail = (goodsId) => {
  router.push({
    path: `/detail/${goodsId}`,
  })
}

const addCart = async (goodsId) => {
  await addDefaultGoodsProduct({
    goodsId,
    number: 1,
  })

  showToast({
    type: 'success',
    message: '已加入购物车',
  })

  getCartGoodsCount()
}

onMounted(() => {
  initFun.value = props.categoryLevel === '1' ? firstCategoryGoods : secondCategoryGoods
  getProductList()
  getCartGoodsCount()
})
</script>

<style lang="scss" scoped>
.product__cart {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
}

.product__cart :deep(.van-icon) {
  font-size: 36px;
}

.product__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
}

.product__hero {
  overflow: hidden;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.product__hero__copy {
  padding: 24px 28px 0;
}

.product__hero__eyebrow {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.68);
}

.product__hero__title {
  margin-top: 14px;
  font-size: 68px;
  line-height: 1.06;
  font-weight: 600;
  color: #1d1d1f;
}

.product__hero__desc {
  margin-top: 12px;
  font-size: 30px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.58);
}

.product__hero__media {
  height: 252px;
  margin-top: 18px;
  background: linear-gradient(135deg, #f8f1e8 0%, #efe8e0 100%);
}

.product__hero__media img,
.product__hero__fallback {
  width: 100%;
  height: 100%;
}

.product__hero__media img {
  object-fit: cover;
}

.product__hero__fallback {
  background: linear-gradient(135deg, #f7f1e7 0%, #ece5dc 100%);
}

.product__content {
  padding-top: 22px;
}

.product__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product__goods {
  display: grid;
  grid-template-columns: 176px minmax(0, 1fr);
  gap: 18px;
  padding: 20px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.product__goods__thumb {
  width: 176px;
  height: 176px;
  overflow: hidden;
  border-radius: 24px;
  background: #f5f5f7;
}

.product__goods__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product__goods__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product__goods__title {
  font-size: 38px;
  line-height: 1.22;
  font-weight: 600;
  color: #1d1d1f;
}

.product__goods__desc {
  margin-top: 12px;
  font-size: 30px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.48);
}

.product__goods__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.product__goods__tag {
  min-width: 88px;
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.08);
  color: #1677ff;
  font-size: 24px;
  font-weight: 600;
}

.product__goods__footer {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.product__goods__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.product__goods__price strong {
  font-size: 44px;
  line-height: 1;
  color: #1d1d1f;
}

.product__goods__price span {
  font-size: 28px;
  color: rgba(29, 29, 31, 0.34);
  text-decoration: line-through;
}

.product__goods__button {
  min-width: 184px;
  height: 56px;
  padding: 0 22px;
  border: 1px solid rgba(22, 119, 255, 0.22);
  border-radius: 999px;
  background: transparent;
  color: #1677ff;
  font-size: 30px;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 375px) {
  .product__body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .product__goods {
    grid-template-columns: 150px minmax(0, 1fr);
  }

  .product__goods__thumb {
    width: 150px;
    height: 150px;
  }
}
</style>
