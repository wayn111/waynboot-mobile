<template>
  <div>
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(banner, index) in bannerList" :key="index">
        <image-pic width="100%" height="150" :src="banner.imgUrl" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  props: {
    bannerList: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
