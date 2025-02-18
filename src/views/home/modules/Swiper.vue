<template>
  <div>
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(banner, index) in bannerList" :key="index" @click="onClick(banner.jumpUrl)">
        <image-pic width="100%" :src="banner.imgUrl" />
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
  },
  methods: {
    onClick(jumpUrl) {
      window.location.href = jumpUrl
    }
  }
}
</script>

<style scoped>
::v-deep .van-image__img {
  max-height: 42vw;
}
</style>
