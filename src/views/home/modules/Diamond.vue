<template>
  <div class="home-diamond">
    <div ref="scrollRef" class="scroll-wrapper">
      <div class="scroll-content">
        <div
          v-for="(cate, idx) in pageList"
          :key="idx"
          class="scroll-item__wrapper"
        >
          <div
            v-for="item in cate"
            :key="item.id"
            class="scroll-item"
            @click="onNavigate(item)"
          >
            <img :src="item.iconUrl" alt="分类图标" />
            <p class="text">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pageList.prev.length > 5" class="dot-wrapper">
      <div class="dot" :style="{ transform: `translateX(${rate})` }" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BScroll from '@better-scroll/core'

const router = useRouter()

const props = defineProps({
  diamondList: {
    type: Array,
    default() {
      return []
    },
  },
})

const scrollRef = ref(null)
const rate = ref('0%')
let bs = null

const pageList = computed(() => {
  const data = props.diamondList || []
  const len = data.length

  if (len <= 5) {
    return {
      prev: data,
      next: [],
    }
  }

  if (len <= 10) {
    return {
      prev: data.slice(0, 5),
      next: data.slice(5),
    }
  }

  const middle = Math.ceil(len / 2)
  return {
    prev: data.slice(0, middle),
    next: data.slice(middle),
  }
})

const totalPages = computed(() => {
  return pageList.value.next.length > 0 ? 2 : 1
})

const onNavigate = (item) => {
  if (item.jumpType === 2) {
    return
  }

  router.push({
    path: `/diamondGoodsList/${item.id}`,
  })
}

const initScroll = async () => {
  await nextTick()

  if (!scrollRef.value || totalPages.value <= 1) {
    if (bs) {
      bs.destroy()
      bs = null
    }
    rate.value = '0%'
    return
  }

  if (bs) {
    bs.destroy()
  }

  bs = new BScroll(scrollRef.value, {
    scrollX: true,
    scrollY: false,
    click: true,
    probeType: 3,
  })

  const totalX = Math.abs(bs.maxScrollX)
  bs.on('scroll', (pos) => {
    const currentX = Math.abs(pos.x)
    rate.value = totalX > 0 ? `${Number((currentX / totalX) * 100).toFixed(2)}%` : '0%'
  })
}

watch(
  () => props.diamondList,
  () => {
    initScroll()
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  if (bs) {
    bs.destroy()
    bs = null
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.home-diamond {
  padding: 24px 0 12px 0;
  background: #fff;

  .scroll-wrapper {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  .scroll-content {
    display: inline-block;

    .scroll-item__wrapper {
      .scroll-item {
        font-size: $mini;
        display: inline-block;
        text-align: center;
        color: $black;
        padding: 0 25px 24px 25px;

        img {
          display: block;
          width: 100px;
          height: 100px;
          overflow: hidden;
          background: #f5f5f5;
          margin: 0 auto;
        }

        .text {
          width: 100px;
          margin-top: 12px;
          font-size: 23px;
        }
      }
    }
  }

  .dot-wrapper {
    width: 80px;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    margin: 0 auto;
    overflow: hidden;

    .dot {
      box-sizing: border-box;
      width: 40px;
      height: 4px;
      transition: all 0.4s linear;
      background: $red;
    }
  }
}
</style>
