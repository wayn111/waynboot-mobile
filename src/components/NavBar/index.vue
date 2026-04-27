<template>
  <div class="nav-compoment">
    <van-sticky :offset-top="0">
      <van-nav-bar
        class="nav"
        :title="title"
        :left-text="leftText"
        :left-arrow="leftArrow"
        @click-left="onClickLeft"
      >
        <template #right>
          <slot />
        </template>
      </van-nav-bar>
    </van-sticky>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  title: {
    type: String,
    default: '请输入标题',
  },
  leftText: {
    type: String,
    default: '',
  },
  leftArrow: {
    type: Boolean,
    default: true,
  },
})

const onClickLeft = () => {
  router.go(-1)
}
</script>

<style lang="scss">
.nav-compoment {
  position: relative;

  :deep(.van-nav-bar) {
    padding-top: max(env(safe-area-inset-top, 0px), 0px);
    background: transparent !important;
  }

  :deep(.van-nav-bar::after) {
    display: none;
  }

  :deep(.van-nav-bar__content) {
    height: 92px;
    padding: 0 18px;
  }

  :deep(.van-nav-bar__left),
  :deep(.van-nav-bar__right) {
    padding: 0;
    min-width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  :deep(.van-nav-bar__title) {
    max-width: 420px;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.18px;
    color: #1d1d1f !important;
  }

  :deep(.van-nav-bar__left:empty),
  :deep(.van-nav-bar__right:empty) {
    background: transparent;
    box-shadow: none;
  }

  :deep(.van-nav-bar__text) {
    font-size: 28px;
  }

  :deep(.van-nav-bar__text),
  :deep(.van-icon),
  :deep(.van-nav-bar__right *),
  :deep(.van-nav-bar__left *),
  :deep(.van-badge__wrapper) {
    color: #1d1d1f !important;
  }

  :deep(.van-nav-bar__arrow) {
    font-size: 34px;
    font-weight: 600;
  }
}
</style>
