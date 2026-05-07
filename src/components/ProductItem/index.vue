<template>
  <div class="product-item" @click="onClick">
    <div class="cover">
      <image-pic :src="img" width="160" height="160" />
    </div>
    <div class="desc">
      <div class="desc__top">
        <h3 class="desc__top__title">{{ title }}</h3>
        <p class="desc__top__info">{{ desc }}</p>
      </div>
      <div class="desc__bottom">
        <div class="desc__bottom__info">
          <p class="price">
            <span class="price--new">¥{{ price }}</span>
            <span class="price--old">¥{{ discount }}</span>
          </p>
          <div class="tag">
            <van-tag v-if="isNew" type="danger">新品</van-tag>
            <van-tag v-if="isHot" type="danger">热品</van-tag>
            <van-tag type="success">即刻发货</van-tag>
          </div>
        </div>
        <van-button plain class="btn" size="small" @click.stop="onAddCart">
          加入购物车
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { addDefaultGoodsProduct } from '@/api/cart'

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
  min-height: 276px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.94);
  padding: 24px;
  border-radius: 32px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);

  .cover {
    width: 180px;
    height: 180px;
    border-radius: 28px;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .desc {
    flex: 1;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .desc__top {
      .desc__top__title {
        font-size: 32px;
        color: $black;
        line-height: 1.15;
        letter-spacing: -0.2px;
        font-weight: 600;
        @include text-multiple-ellipsis;
      }

      .desc__top__info {
        min-height: 60px;
        font-size: 24px;
        color: $gray;
        margin-top: 12px;
        line-height: 1.45;
        @include text-multiple-ellipsis;
      }
    }

    .desc__bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 24px;

      .desc__bottom__info {
        .price {
          .price--new {
            color: $black;
            font-size: 34px;
            margin-right: 10px;
            font-weight: 600;
          }

          .price--old {
            color: $gray-deep;
            font-size: 22px;
            text-decoration: line-through;
          }
        }

        .tag {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;

          .van-tag {
            margin-right: 0;
            padding: 8px 16px;
            border-radius: 999px;
          }
        }
      }

      .btn {
        min-width: 152px;
        border-color: rgba(0, 102, 204, 0.22);
        color: #0066cc;
        background: transparent;
        font-size: 22px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
