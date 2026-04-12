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
        <van-card
          v-for="item in goodsList"
          :key="item.id"
          :desc="item.brief"
          :title="item.name"
          :thumb="item.picUrl"
          :price="yuan(item.retailPrice)"
          :origin-price="yuan(item.counterPrice)"
          @click="itemClick(item.id)"
        />
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { yuan } from '@/filter'
import Title from './Title'

const router = useRouter()
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

const itemClick = (goodsId) => {
  router.push({
    path: `/detail/${goodsId}`,
  })
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
  margin-top: 12px;

  .main {
    background: #fff;
  }
}
</style>
