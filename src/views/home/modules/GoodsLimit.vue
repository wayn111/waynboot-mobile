<template>
  <div class="home-goods">
    <van-cell :title="titleName" is-link to="index" :value="'更多商品'" />
    <van-list
      v-model="loading"
      :finished="isFinished"
      :immediate-check="false"
      @load="onReachBottom"
    >
      <div class="main">
        <goods-item
          v-for="(item, idx) in goodsList"
          :key="idx"
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

const emit = defineEmits(['onReachBottom', 'update:modelValue'])
// import Title from './Title'
import GoodsItem from '@/components/GoodsItem'

const props = defineProps({goodsList: {
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
    },})

const onReachBottom = () => {
  emit('onReachBottom')
}

const loading = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped>
.home-goods {
  margin-top: 12px;
  .main {
    background: #fff;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}
:deep(.van-cell:after ){
  display: none;
}
</style>
