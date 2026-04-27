<template>
  <div class="overview">
    <h3 class="title">{{ title }}</h3>
    <p class="desc">{{ desc }}</p>

    <div class="price">
      <span class="price__new">￥{{ yuan(price) }}</span>
      <span class="price__old">￥{{ yuan(discount) }}</span>
      <span class="overview__sales">
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
  margin-top: 18px;
  padding: 30px 28px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  .title {
    font-size: 46px;
    color: #1d1d1f;
    font-weight: 700;
    line-height: 1.12;
  }

  .desc {
    font-size: 30px;
    color: rgba(29, 29, 31, 0.6);
    margin-top: 14px;
    line-height: 1.45;
  }

  .price {
    margin-top: 22px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    .price__new {
      font-size: 48px;
      color: #1d1d1f;
      font-weight: 700;
    }

    .price__old {
      font-size: 30px;
      color: rgba(29, 29, 31, 0.42);
      text-decoration: line-through;
    }
  }
}

.overview__sales {
  margin-left: auto;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}
</style>
