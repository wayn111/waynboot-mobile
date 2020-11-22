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
            <van-tag type="danger">自营</van-tag>
          </div>
          <div class="sale">
            <span class="commom__num">评论2000+条</span>
            <span class="praise__rate">70%好评</span>
          </div>
        </div>
        <div class="desc__bottom__btn">
          <van-button class="btn" size="mini" @click.stop="onAddCart">加入购物车</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addDefaultGoodsProduct } from '@/api/cart'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['goodsId', 'img', 'title', 'desc', 'price', 'discount', 'percentage'],
  methods: {
    onClick() {
      this.$router.push({
        path: '/detail/' + this.goodsId
      })
    },
    onAddCart() {
      addDefaultGoodsProduct({
        goodsId: this.goodsId,
        number: 1
      }).then(() => {
        this.$toast({
          message: '已添加至购物车',
          duration: 1500
        })
        this.$emit('getCartGoodsCount')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

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
    .desc__top {
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
        margin-top: 10px;
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
          width: 300px;
          .van-tag {
            font-size: 4px;
            padding: 0.2em 1em;
            border-radius: 0.6em;
          }
        }
        .sale {
          width: 300px;
          margin-top: 16px;
          font-size: $mini;
          color: $gray;
          .praise__rate {
            margin-left: 2vw;
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
