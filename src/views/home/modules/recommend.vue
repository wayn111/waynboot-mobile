<template>
  <div class="recommend">
    <div class="centerContent">
      <div v-for="item in list" :key="item.id" class="listImg">
        <img :src="item.imgUrl" class="listImgOne" @click="onNavigate(item)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'


const props = defineProps({list: {
      type: Array,
      default() {
        return []
      },
    },})

const state = reactive({})
const onNavigate = (item) => {
  window.location.href = item.jumpUrl
}
</script>

<style lang="scss" scoped>
.recommend {
  .centerContent {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 20px;
    .listImg {
      width: 48%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
