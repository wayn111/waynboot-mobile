<template>
  <section v-if="hotGoods.length" class="hot-shelf">
    <div class="hot-shelf__head">
      <h2 class="hot-shelf__title">热卖榜单</h2>
      <button type="button" class="hot-shelf__meta" @click="goAll">
        {{ goodsList.length }}件热销
        <van-icon name="arrow" />
      </button>
    </div>

    <div class="hot-shelf__scroller">
      <article
        v-for="(item, index) in hotGoods"
        :key="item.id"
        class="hot-shelf__item"
        @click="goDetail(item.id)"
      >
        <div class="hot-shelf__item__media">
          <span class="hot-shelf__rank" :class="`hot-shelf__rank--${index + 1}`">
            {{ index + 1 }}
          </span>
          <img :src="item.picUrl" :alt="item.name" />
        </div>
        <div class="hot-shelf__item__body">
          <h3 class="hot-shelf__item__title">{{ item.name }}</h3>
          <p class="hot-shelf__item__sales">销量 {{ item.virtualSales || 0 }}</p>
          <div class="hot-shelf__item__footer">
            <p class="hot-shelf__item__price">¥{{ yuan(item.retailPrice) }}</p>
            <button
              type="button"
              class="hot-shelf__item__action"
              @click.stop="onAddCart(item.id)"
            >
              <van-icon name="plus" />
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { addDefaultGoodsProduct } from '@/api/cart'
import { yuan } from '@/filter'

const router = useRouter()

const props = defineProps({
  goodsList: {
    type: Array,
    default: () => [],
  },
})

const hotGoods = computed(() => {
  return props.goodsList.slice(0, 10)
})

const goAll = () => {
  router.push({ path: '/diamondGoodsList' })
}

const goDetail = (goodsId) => {
  router.push({
    path: `/detail/${goodsId}`,
  })
}

const onAddCart = async (goodsId) => {
  await addDefaultGoodsProduct({
    goodsId,
    number: 1,
  })

  showToast({
    type: 'success',
    message: '已加入购物车',
    duration: 1500,
  })
}
</script>

<style lang="scss" scoped>
.hot-shelf__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.hot-shelf__title {
  font-size: 34px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.hot-shelf__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.44);
  cursor: pointer;
}

.hot-shelf {
  overflow: hidden;
}

.hot-shelf__scroller {
  display: flex;
  gap: 12px;
  padding: 0 0 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-padding: 0;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.hot-shelf__scroller::-webkit-scrollbar {
  display: none;
}

.hot-shelf__item {
  flex: 0 0 calc((100% - 20px) / 2.8);
  min-width: 0;
  padding: 12px 12px 14px;
  overflow: hidden;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.05);
  scroll-snap-align: start;
  cursor: pointer;
}

.hot-shelf__item__media {
  position: relative;
  aspect-ratio: 1 / 1.05;
  overflow: hidden;
  border-radius: 22px;
  background: #f7f8fb;
}

.hot-shelf__item__media img {
  width: 100%;
  height: 100%;
  padding: 10px;
  object-fit: contain;
}

.hot-shelf__rank {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #1677ff;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 6px 14px rgba(22, 119, 255, 0.32);
}

.hot-shelf__rank--1 {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff5a3d 100%);
  box-shadow: 0 6px 14px rgba(255, 90, 61, 0.32);
}

.hot-shelf__rank--2 {
  background: linear-gradient(135deg, #4a8bff 0%, #1677ff 100%);
  box-shadow: 0 6px 14px rgba(22, 119, 255, 0.32);
}

.hot-shelf__rank--3 {
  background: linear-gradient(135deg, #7a9bff 0%, #5673e8 100%);
  box-shadow: 0 6px 14px rgba(86, 115, 232, 0.28);
}

.hot-shelf__item__body {
  padding-top: 12px;
}

.hot-shelf__item__title {
  min-height: 68px;
  font-size: 28px;
  line-height: 1.24;
  font-weight: 600;
  color: #1d1d1f;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hot-shelf__item__sales {
  margin-top: 8px;
  font-size: 24px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.48);
}

.hot-shelf__item__footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.hot-shelf__item__price {
  font-size: 34px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.hot-shelf__item__action {
  width: 38px;
  height: 38px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(22, 119, 255, 0.44);
  border-radius: 50%;
  background: #ffffff;
  color: #1677ff;
}

@media (max-width: 375px) {
  .hot-shelf__item {
    flex-basis: calc((100% - 20px) / 2.55);
  }
}

@media (min-width: 430px) {
  .hot-shelf__item {
    flex-basis: calc((100% - 24px) / 3.12);
  }
}
</style>
