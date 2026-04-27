<template>
  <div class="product-item" @click="onClick">
    <div class="cover">
      <image-pic :src="img" width="100%" height="100%" />
    </div>
    <div class="desc">
      <div class="desc__top">
        <h3 class="desc__top__title">{{ title }}</h3>
        <p v-if="desc" class="desc__top__info">{{ desc }}</p>
        <div class="tag">
          <span v-if="isNew" class="tag__item">新品</span>
          <span v-if="isHot" class="tag__item">热品</span>
          <span class="tag__item tag__item--muted">销量 {{ virtualSales || 0 }}</span>
        </div>
      </div>
      <div class="desc__bottom">
        <div class="desc__bottom__info">
          <p class="price">
            <span class="price--new">¥{{ yuan(price) }}</span>
            <span v-if="discount" class="price--old">¥{{ yuan(discount) }}</span>
          </p>
        </div>
        <button type="button" class="btn" @click.stop="onAddCart">
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
import { yuan } from '@/filter'

const router = useRouter()
const emit = defineEmits(['getCartGoodsCount'])

const props = defineProps({
  goodsId: [Number, String],
  img: String,
  title: String,
  desc: String,
  price: [Number, String],
  discount: [Number, String],
  isNew: Boolean,
  isHot: Boolean,
  virtualSales: {
    type: [Number, String],
    default: 0,
  },
})

const onClick = () => {
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
  emit('getCartGoodsCount')
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.product-item {
  box-sizing: border-box;
  min-height: 304px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 22px;
  justify-content: space-between;
  background: #ffffff;
  padding: 20px;
  border: 1px solid rgba(210, 210, 215, 0.68);
  border-radius: 32px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.product-item:active {
  transform: scale(0.988);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
}

  .cover {
    width: 212px;
    min-height: 244px;
    border-radius: 28px;
    background: linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    padding: 16px;
  }

  .desc {
    flex: 1;
    min-width: 0;
    min-height: 244px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .desc__top {
      .desc__top__title {
        font-size: 34px;
        color: $black;
        line-height: 1.18;
        letter-spacing: -0.2px;
        font-weight: 600;
        @include text-multiple-ellipsis;
      }

      .desc__top__info {
        min-height: 72px;
        font-size: 28px;
        color: $gray;
        margin-top: 12px;
        line-height: 1.32;
        @include text-multiple-ellipsis;
      }
    }

    .tag {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .tag__item {
      min-height: 42px;
      padding: 0 14px;
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      background: #f2f7ff;
      color: #0066cc;
      font-size: 28px;
      line-height: 1;
      font-weight: 600;
    }

    .tag__item--muted {
      background: #f5f5f7;
      color: rgba(29, 29, 31, 0.52);
      font-weight: 500;
    }

    .desc__bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 18px;

      .desc__bottom__info {
        min-width: 0;

        .price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;

          .price--new {
            color: #0071e3;
            font-size: 38px;
            font-weight: 600;
            line-height: 1;
          }

          .price--old {
            color: $gray-deep;
            font-size: 28px;
            text-decoration: line-through;
          }
        }
      }

      .btn {
        min-width: 164px;
        min-height: 58px;
        padding: 0 18px;
        border: none;
        border-radius: 999px;
        color: #ffffff;
        background: #0071e3;
        font-size: 28px;
        font-weight: 600;
        flex-shrink: 0;
      }
    }
  }

@media (max-width: 375px) {
  .product-item {
    gap: 18px;
    padding: 18px;

    .cover {
      width: 190px;
    }

    .desc .desc__bottom {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>
