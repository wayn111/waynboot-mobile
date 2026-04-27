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
        <div class="home-swiper__overlay">
          <div class="home-swiper__content">
            <span class="home-swiper__eyebrow">京选好货</span>
            <h2 class="home-swiper__title">品质生活 值得拥有</h2>
            <p class="home-swiper__desc">精选好物，为生活加分</p>
            <span class="home-swiper__button">
              立即选购
              <van-icon name="arrow" />
            </span>
          </div>
        </div>
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

.home-swiper__item::before {
  position: absolute;
  inset: 0 42% 0 0;
  z-index: 1;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 60%, rgba(255, 255, 255, 0.2) 100%);
  content: '';
  pointer-events: none;
}

.home-swiper__item::after {
  position: absolute;
  inset: auto 0 0 auto;
  width: 58%;
  height: 34%;
  z-index: 1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(248, 250, 252, 0.72) 62%);
  content: '';
  pointer-events: none;
}

.home-swiper__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: saturate(0.86) brightness(1.06);
}

.home-swiper__fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7f1e7 0%, #f1ece5 48%, #ece5dc 100%);
}

.home-swiper__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 34px 34px 30px;
  display: flex;
  align-items: center;
}

.home-swiper__content {
  width: 42%;
}

.home-swiper__eyebrow {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.72);
}

.home-swiper__title {
  margin-top: 12px;
  font-size: 56px;
  line-height: 1.06;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #1d1d1f;
}

.home-swiper__desc {
  margin-top: 12px;
  font-size: 26px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.58);
}

.home-swiper__button {
  margin-top: 24px;
  min-width: 172px;
  height: 58px;
  padding: 0 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(29, 29, 31, 0.9);
  font-size: 28px;
  font-weight: 600;
}

@media (max-width: 375px) {
  .home-swiper__overlay {
    padding: 28px 28px 24px;
  }

  .home-swiper__title {
    font-size: 48px;
  }
}
</style>
