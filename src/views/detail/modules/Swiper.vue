<template>
  <div style="background: #fff">
    <van-swipe :autoplay="3000" :indicator-color="variables.red">
      <van-swipe-item
        v-for="(image, index) in banner"
        :key="index"
        @click="onSwipeClick(index)"
      >
        <image-pic width="100%" :src="image" />
      </van-swipe-item>
    </van-swipe>

    <van-image-preview
      v-model:show="show"
      :images="banner"
      :start-position="previewIdx"
    />
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

import variables from '@/styles/variables.scss?inline'

defineProps({
  banner: {
    type: Array,
    default() {
      return []
    },
  },
})

const state = reactive({
  show: false,
  previewIdx: 0,
})

const { show, previewIdx } = toRefs(state)

const onSwipeClick = (index) => {
  previewIdx.value = index
  show.value = true
}
</script>
