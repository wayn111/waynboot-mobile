<template>
  <section class="home-swiper">
    <van-swipe :autoplay="3200" indicator-color="#d3d6de">
      <van-swipe-item
        v-for="(banner, index) in displayBanners"
        :key="banner.id || index"
        class="home-swiper__item"
        @click="onClick(banner.jumpUrl)"
      >
        <img
          v-if="banner.imgUrl"
          class="home-swiper__image"
          :src="banner.imgUrl"
          :alt="banner.name || 'banner'"
        />
        <div v-else class="home-swiper__fallback" />
      </van-swipe-item>
    </van-swipe>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bannerList: {
    type: Array,
    default: () => [],
  },
})

const displayBanners = computed(() => {
  if (props.bannerList.length > 0) {
    return props.bannerList
  }

  return [
    {
      imgUrl: '',
      jumpUrl: '',
    },
  ]
})

const onClick = (jumpUrl) => {
  if (!jumpUrl) {
    return
  }
  window.location.href = jumpUrl
}
</script>

<style lang="scss" scoped>
.home-swiper {
  :deep(.van-swipe) {
    overflow: hidden;
    border-radius: 30px;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
    background: linear-gradient(135deg, #f8f4eb 0%, #eef1f6 100%);
  }

  :deep(.van-swipe__indicators) {
    bottom: 16px;
  }

  :deep(.van-swipe__indicator) {
    width: 14px;
    height: 14px;
    margin: 0 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    opacity: 0.72;
  }

  :deep(.van-swipe__indicator--active) {
    width: 28px;
    background: #1677ff;
    opacity: 1;
  }
}

.home-swiper__item {
  position: relative;
  aspect-ratio: 2.12 / 1;
  overflow: hidden;
  background: linear-gradient(135deg, #f6f1e9 0%, #eef3f7 100%);
}

.home-swiper__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.home-swiper__fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7f1e7 0%, #f1ece5 48%, #ece5dc 100%);
}
</style>
