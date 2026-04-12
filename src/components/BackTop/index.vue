<template>
  <div v-show="isShow" class="back-top">
    <span v-scroll-to="'body'" style="color: #8e8e8e">
      <svg-icon icon-class="backtop" :width="30" :height="30" />
    </span>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'



const props = defineProps({
    offsetTop: {
      type: Number,
      default: 100,
    },
  })

const state = reactive({
      timer: null,
      isShow: false,
    })

const { timer, isShow } = toRefs(state)

const handleScroll = () => {
      if (timer.value) clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
        isShow.value = scrollTop > props.offsetTop
      }, 15)
    }

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
</script>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  right: 30px;
  bottom: 150px;
  z-index: 999;
}
</style>
