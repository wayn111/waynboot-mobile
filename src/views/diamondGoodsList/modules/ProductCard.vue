<template>
  <div class="product-card" @click="goDetail">
    <div class="product-card__cover">
      <image-pic :src="goods.picUrl" width="188" height="188" />
    </div>
    <div class="product-card__content">
      <div>
        <div class="product-card__tags">
          <span v-if="goods.isNew">新品</span>
          <span v-if="goods.isHot">热卖</span>
          <span>现货</span>
        </div>
        <h3 class="product-card__title">{{ goods.name }}</h3>
        <p v-if="goods.brief" class="product-card__desc">{{ goods.brief }}</p>
      </div>
      <div class="product-card__footer">
        <div class="product-card__price">
          <span class="product-card__price-current">¥{{ goods.retailPrice }}</span>
          <span v-if="goods.counterPrice" class="product-card__price-old">
            ¥{{ goods.counterPrice }}
          </span>
        </div>
        <button class="product-card__cart" type="button" @click.stop="addToCart">
          加入购物车
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { addDefaultGoodsProduct } from '@/api/cart'

const router = useRouter()
const emit = defineEmits(['cartCountChange'])

const props = defineProps({
  goods: {
    type: Object,
    required: true
  }
})

const goDetail = () => {
  router.push({
    path: `/detail/${props.goods.id}`
  })
}

const addToCart = async () => {
  await addDefaultGoodsProduct({
    goodsId: props.goods.id,
    number: 1
  })

  showToast({
    type: 'success',
    message: '已加入购物车',
    duration: 1500
  })
  emit('cartCountChange')
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.product-card {
  box-sizing: border-box;
  min-height: 292px;
  display: flex;
  align-items: stretch;
  gap: 24px;
  padding: 24px 24px 26px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 32px;
  background: #fff;
  overflow: hidden;

  &:active {
    transform: scale(0.99);
  }
}

.product-card__cover {
  width: 204px;
  height: 204px;
  align-self: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: #f5f5f7;
  overflow: hidden;
}

.product-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 42px;

  span {
    height: 42px;
    display: inline-flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 999px;
    background: #f5f5f7;
    color: #0066cc;
    font-size: 28px;
    line-height: 1;
    font-weight: 600;
  }
}

.product-card__title {
  margin-top: 14px;
  color: $black;
  font-size: 34px;
  line-height: 1.22;
  letter-spacing: -0.2px;
  font-weight: 600;
  @include text-multiple-ellipsis;
}

.product-card__desc {
  margin-top: 10px;
  color: $gray;
  font-size: 28px;
  line-height: 1.42;
  @include text-multiple-ellipsis;
}

.product-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.product-card__price {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}

.product-card__price-current {
  color: $black;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.2px;
  font-weight: 600;
}

.product-card__price-old {
  color: $gray-deep;
  font-size: 28px;
  line-height: 1;
  text-decoration: line-through;
}

.product-card__cart {
  min-width: 172px;
  height: 64px;
  flex-shrink: 0;
  border: 0;
  border-radius: 999px;
  background: #0071e3;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  font-weight: 400;

  &:active {
    transform: scale(0.95);
  }
}

@media (max-width: 360px) {
  .product-card {
    gap: 18px;
    padding: 22px;
  }

  .product-card__cover {
    width: 180px;
    height: 180px;
  }

  .product-card__cart {
    min-width: 152px;
  }
}
</style>
