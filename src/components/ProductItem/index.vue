<template>
  <div class="product-item" @click="onClick">
    <image-pic :src="img" width="90" height="90" />
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
            <van-tag type="success">7天退换</van-tag>
          </div>
        </div>
        <div class="desc__bottom__btn">
          <van-button class="btn" size="mini" @click.stop="onAddCart">
            加入购物车
          </van-button>
        </div>
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
  height: 240px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 20px;

  .desc {
    width: 510px;
    height: 240px;

    .desc__top {
      margin-top: 30px;

      .desc__top__title {
        font-size: $small;
        color: $black;
        @include text-ellipsis;
      }

      .desc__top__info {
        min-height: 60px;
        font-size: $mini;
        color: $gray;
        margin-top: 8px;
        line-height: 30px;
        @include text-multiple-ellipsis;
      }
    }

    .desc__bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .desc__bottom__info {
        margin-top: 5px;

        .price {
          .price--new {
            color: $red;
            font-size: $small;
            margin-right: 10px;
          }

          .price--old {
            color: $gray;
            font-size: $mini;
            text-decoration: line-through;
          }
        }

        .tag {
          .van-tag {
            margin-right: 12px;
            padding: 0.2em 1em;
            border-radius: 0.6em;
          }
        }

        .sale {
          width: 300px;
          margin-top: 12px;
          font-size: $mini;
          color: $gray;

          .praise__rate {
            margin-left: 15px;
          }
        }
      }

      .desc__bottom__btn {
        .btn {
          background: $red;
          color: #fff;
          border: none;
          font-size: $mini;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
