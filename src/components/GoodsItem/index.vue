<template>
  <div class="goods-item" @click="onNavigate">
    <div class="pic">
      <image-pic
        fill="cover"
        align="center"
        width="180"
        height="180"
        :src="img"
      />
    </div>
    <div class="meta">
      <p class="title">{{ title }}</p>
      <p v-if="desc" class="brief">{{ desc }}</p>
      <div class="footer">
        <div class="num">
          <span class="num__now">¥</span>{{ yuan(price) }}
        </div>
        <div class="desc">销量 {{ virtualSales || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { yuan } from '@/filter'

const router = useRouter()

const props = defineProps({
  goodsId: {
    type: [Number, String],
    default: 0,
  },
  img: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  price: {
    type: [Number, String],
    default: 0,
  },
  discount: {
    type: [Number, String],
    default: 0,
  },
  virtualSales: {
    type: [Number, String],
    default: 0,
  },
})

const onNavigate = () => {
  router.push({
    path: `/detail/${props.goodsId}`,
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.goods-item {
  position: relative;
  width: calc(50% - 10px);
  overflow: hidden;
  border: 1px solid rgba(29, 29, 31, 0.06);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 28px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;

  .pic {
    display: block;
    height: 240px;
    padding: 22px;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .meta {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 22px;

    .title {
      min-height: 72px;
      font-size: 30px;
      color: $black;
      line-height: 1.16;
      letter-spacing: -0.2px;
      @include text-multiple-ellipsis;
    }

    .brief {
      margin-top: 12px;
      min-height: 60px;
      font-size: 22px;
      color: $gray;
      line-height: 1.4;
      @include text-multiple-ellipsis;
    }

    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      margin-top: 18px;
    }

    .desc {
      font-size: 20px;
      color: $gray;
      text-align: right;
      @include text-ellipsis;
    }

    .num {
      font-size: 34px;
      color: $black;
      font-weight: 600;
      line-height: 1;
    }

    .num__now {
      font-family: DIN-Medium, DIN;
      font-size: 20px;
      margin-right: 2px;
    }
  }
}
</style>
