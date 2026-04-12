<template>
  <div class="overview">
    <h3 class="title">{{ title }}</h3>
    <p class="desc">{{ desc }}</p>

    <div class="price">
      <span class="price__new">￥{{ yuan(price) }}</span>
      <span class="price__old">￥{{ yuan(discount) }}</span>
      <span class="desc" style="float: right; margin: 0">
        销量：{{ virtualSales || 0 }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { yuan } from '@/filter'

defineProps({
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
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.overview {
  padding: 24px;
  background: #fff;

  .title {
    font-size: $normal;
    color: $black;
    font-weight: bolder;
  }

  .desc {
    font-size: $small;
    color: $gray;
    margin-top: 12px;
    line-height: 36px;
    text-align: justify;
  }

  .price {
    margin-top: 12px;

    .price__new {
      font-size: $normal;
      color: $red;
      font-weight: bolder;
      margin-right: 12px;
    }

    .price__old {
      font-size: $small;
      color: $gray;
      text-decoration: line-through;
    }
  }
}
</style>
