<template>
  <div class="nav-compoment">
    <van-sticky>
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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({title: {
      type: String,
      default: '请输入标题',
    },
    leftText: {
      type: String,
      default: '返回',
    },
    leftArrow: {
      type: Boolean,
      default: true,
    },})

const onClickLeft = () => {
  // if (route.name === 'OrderList') {
      //   router.push({ 'name': 'User' })
      // } else {
      //   router.go(-1)
      // }
      router.go(-1)
}
</script>

<style lang="scss">
@use '@/styles/variables.scss' as *; /*// reset vant-nav-bar style
*/
.nav-compoment {
  .van-nav-bar {
    .van-icon {
      color: $black;
    }
    .van-nav-bar__text {
      color: $black;
    }
  }
}
</style>
