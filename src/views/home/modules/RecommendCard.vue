<template>
  <article class="recommend-card" @click="goDetail">
    <div class="recommend-card__media">
      <image-pic fit="cover" width="100%" height="100%" :src="img" />
    </div>

    <div class="recommend-card__body">
      <h3 class="recommend-card__title">{{ title }}</h3>
      <p class="recommend-card__desc">{{ desc || '安心舒适是最好的礼物' }}</p>

      <div class="recommend-card__meta">
        <span class="recommend-card__badge">即刻发货</span>
        <span class="recommend-card__sales">已售 {{ virtualSales || 0 }}</span>
      </div>

      <div class="recommend-card__footer">
        <div class="recommend-card__price-group">
          <span class="recommend-card__price">¥{{ yuan(price) }}</span>
          <span v-if="discount" class="recommend-card__compare">¥{{ yuan(discount) }}</span>
        </div>

        <button
          type="button"
          class="recommend-card__action"
          @click.stop="onAddCart"
        >
          加入购物车
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { addDefaultGoodsProduct } from '@/api/cart'
import { yuan } from '@/filter'

const router = useRouter()

const props = defineProps({
  goodsId: [Number, String],
  img: String,
  title: String,
  desc: String,
  price: [Number, String],
  discount: [Number, String],
  virtualSales: [Number, String],
})

const goDetail = () => {
  router.push({
    path: `/detail/${props.goodsId}`,
  })
}

const onAddCart = async () => {
  await addDefaultGoodsProduct({
    goodsId: props.goodsId,
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
.recommend-card {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  padding: 18px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.recommend-card__media {
  width: 132px;
  height: 132px;
  overflow: hidden;
  border-radius: 22px;
  background: #f5f6f9;
}

.recommend-card__media :deep(.van-image),
.recommend-card__media :deep(.van-image__img),
.recommend-card__media :deep(.van-image__loading) {
  width: 100%;
  height: 100%;
}

.recommend-card__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.recommend-card__title {
  font-size: 32px;
  line-height: 1.22;
  font-weight: 600;
  color: #1d1d1f;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recommend-card__desc {
  margin-top: 8px;
  font-size: 26px;
  line-height: 1.35;
  color: rgba(29, 29, 31, 0.46);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.recommend-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.recommend-card__badge {
  min-width: 92px;
  height: 34px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.08);
  color: #1677ff;
  font-size: 22px;
  font-weight: 600;
}

.recommend-card__sales {
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.44);
}

.recommend-card__footer {
  margin-top: auto;
  padding-top: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.recommend-card__price-group {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.recommend-card__price {
  font-size: 38px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.recommend-card__compare {
  font-size: 22px;
  color: rgba(29, 29, 31, 0.34);
  text-decoration: line-through;
}

.recommend-card__action {
  min-width: 150px;
  height: 50px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
