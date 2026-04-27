<template>
  <section class="recommend-feed">
    <div class="recommend-feed__head">
      <h2 class="recommend-feed__title">为你推荐</h2>
      <span class="recommend-feed__meta">
        {{ goodsList.length }}件推荐
        <van-icon name="arrow" />
      </span>
    </div>

    <van-list
      v-model:loading="loading"
      :finished="isFinished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="recommend-feed__list">
        <recommend-card
          v-for="item in goodsList"
          :key="item.id"
          :goods-id="item.id"
          :img="item.picUrl"
          :title="item.name"
          :desc="item.brief"
          :price="item.retailPrice"
          :discount="item.counterPrice"
          :virtual-sales="item.virtualSales"
        />
      </div>
    </van-list>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import RecommendCard from './RecommendCard'

const emit = defineEmits(['onReachBottom', 'update:modelValue'])

const props = defineProps({
  goodsList: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
})

const onReachBottom = () => {
  emit('onReachBottom')
}

const loading = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss" scoped>
.recommend-feed__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.recommend-feed__title {
  font-size: 34px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.recommend-feed__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.44);
}

.recommend-feed__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
