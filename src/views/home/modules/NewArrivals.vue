<template>
  <section v-if="visibleGoods.length" class="new-arrivals">
    <div class="new-arrivals__head">
      <h2 class="new-arrivals__title">新品上新</h2>
      <button type="button" class="new-arrivals__link" @click="goAll">
        全部
        <van-icon name="arrow" />
      </button>
    </div>

    <div class="new-arrivals__grid">
      <article
        v-for="item in visibleGoods"
        :key="item.id"
        class="new-arrivals__card"
        @click="goDetail(item.id)"
      >
        <div class="new-arrivals__card__thumb">
          <img :src="item.picUrl" :alt="item.name" />
          <span class="new-arrivals__card__badge">NEW</span>
        </div>
        <div class="new-arrivals__card__body">
          <h3 class="new-arrivals__card__title">{{ item.name }}</h3>
          <p class="new-arrivals__card__desc">{{ item.brief || '精选新品，舒适好物' }}</p>
          <div class="new-arrivals__card__footer">
            <div class="new-arrivals__card__price-group">
              <p class="new-arrivals__card__price">¥{{ yuan(item.retailPrice) }}</p>
              <span v-if="item.counterPrice" class="new-arrivals__card__compare">
                ¥{{ yuan(item.counterPrice) }}
              </span>
            </div>
            <button
              type="button"
              class="new-arrivals__card__action"
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

const visibleGoods = computed(() => {
  return props.goodsList.slice(0, 4)
})

const goDetail = (goodsId) => {
  router.push({
    path: `/detail/${goodsId}`,
  })
}

const goAll = () => {
  router.push({ path: '/category' })
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
.new-arrivals__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.new-arrivals__title {
  font-size: 34px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.new-arrivals__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.42);
  cursor: pointer;
}

.new-arrivals__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.new-arrivals__card {
  overflow: hidden;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.new-arrivals__card__thumb {
  position: relative;
  aspect-ratio: 1 / 0.9;
  background: #f5f6f9;
}

.new-arrivals__card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-arrivals__card__body {
  padding: 16px 16px 18px;
}

.new-arrivals__card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.1);
  color: #1677ff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.new-arrivals__card__title {
  min-height: 82px;
  font-size: 32px;
  line-height: 1.26;
  font-weight: 600;
  color: #1d1d1f;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.new-arrivals__card__desc {
  margin-top: 8px;
  min-height: 40px;
  font-size: 26px;
  line-height: 1.35;
  color: rgba(29, 29, 31, 0.46);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.new-arrivals__card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.new-arrivals__card__price-group {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.new-arrivals__card__price {
  font-size: 38px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.new-arrivals__card__compare {
  font-size: 22px;
  color: rgba(29, 29, 31, 0.34);
  text-decoration: line-through;
}

.new-arrivals__card__action {
  width: 42px;
  height: 42px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(22, 119, 255, 0.2);
}
</style>
