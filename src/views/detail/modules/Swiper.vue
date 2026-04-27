<template>
  <div class="detail-swiper">
    <van-swipe :autoplay="3000" indicator-color="#0071e3">
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

<style lang="scss" scoped>
.detail-swiper {
  overflow: hidden;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  :deep(.van-image__img) {
    min-height: 520px;
    object-fit: contain;
    background: #ffffff;
  }

  :deep(.van-swipe__indicators) {
    bottom: 18px;
  }

  :deep(.van-swipe__indicator) {
    width: 10px;
    height: 10px;
    background: rgba(29, 29, 31, 0.22);
    opacity: 1;
  }

  :deep(.van-swipe__indicator--active) {
    width: 28px;
    border-radius: 999px;
  }
}
</style>
