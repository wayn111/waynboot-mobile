<template>
  <transition name="back-top-fade">
    <button
      v-show="isShow"
      type="button"
      class="back-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg-icon icon-class="backtop" :width="22" :height="22" />
    </button>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  offsetTop: {
    type: Number,
    default: 320,
  },
})

const isShow = ref(false)
let ticking = false

const handleScroll = () => {
  if (ticking) {
    return
  }

  ticking = true
  window.requestAnimationFrame(() => {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    isShow.value = scrollTop > props.offsetTop
    ticking = false
  })
}

const scrollToTop = () => {
  if (typeof window === 'undefined') {
    return
  }

  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const startY =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  const duration = 320
  const startTime = performance.now()
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  const step = (now) => {
    const elapsed = Math.min(1, (now - startTime) / duration)
    const next = startY * (1 - easeOutCubic(elapsed))
    window.scrollTo(0, next)
    if (elapsed < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  right: 28px;
  bottom: calc(220px + env(safe-area-inset-bottom, 0px));
  z-index: 60;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(29, 29, 31, 0.06);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #1d1d1f;
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.12),
    0 6px 16px rgba(15, 23, 42, 0.06);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-top:active {
  transform: scale(0.94);
  box-shadow:
    0 12px 28px rgba(15, 23, 42, 0.16),
    0 4px 12px rgba(15, 23, 42, 0.08);
}

.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.back-top-fade-enter-to,
.back-top-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 375px) {
  .back-top {
    right: 22px;
    bottom: calc(200px + env(safe-area-inset-bottom, 0px));
    width: 76px;
    height: 76px;
  }
}
</style>
