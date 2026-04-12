<template>
  <div class="session-item" @click="onClick">
    <image-pic align="center" width="100%" height="160" :src="img" />
    <div class="title">
      <span class="title__text">{{ title }}</span>
      <count-down :time="time" />
    </div>
    <div class="desc">
      <van-tag round type="success">{{ tagnum }}+款上新</van-tag>

      <span class="desc__text">
        <i>{{ discount }}</i
        >折起
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

import CountDown from '@/components/CountDown'

const props = defineProps({img: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    time: {
      type: Number,
      default: 0,
    },
    tagnum: {
      type: Number,
      default: 100,
    },
    discount: {
      type: Number,
      default: 0,
    },})

const onClick = () => {
  router.push({
        path: '/product/1/1010000',
        query: {
          t: +new Date(),
        },
      })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.session-item {
  width: 700px;
  height: 460px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  .title {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title__text {
      font-size: $small;
      color: $black;
    }
  }
  .desc {
    padding: 0 10px;
    display: flex;
    align-items: center;
    .desc__text {
      margin-left: 14px;
      font-size: $small;
      color: $gray;
      i {
        color: $red;
      }
    }
  }
}
</style>
