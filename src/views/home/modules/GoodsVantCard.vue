<template>
  <div class="home-goods">
    <Title :name="titleName" style="background: #fff" />

    <van-list
      v-model:loading="loading"
      :finished="isFinished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <goods-item
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
  </div>
</template>

<script setup>
import { computed } from 'vue'

import GoodsItem from '@/components/GoodsItem'
import Title from './Title'

const emit = defineEmits(['onReachBottom', 'update:modelValue'])

const props = defineProps({
  goodsList: {
    type: Array,
    default() {
      return []
    },
  },
  titleName: {
    type: String,
    default: '',
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
.home-goods {
  overflow: hidden;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);

  .main {
    box-sizing: border-box;
    padding: 0 20px 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
