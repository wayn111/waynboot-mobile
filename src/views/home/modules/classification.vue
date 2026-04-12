<template>
  <div class="classification">
    <img src="./../../../assets/images/icon15.png" class="topImg" />
    <div class="centerContent">
      <div v-for="item in list" :key="item.id" class="listImg">
        <img :src="item.imgUrl" class="listImgOne" @click="onNavigate(item)" />
        <!-- <img :src="item.bottom" class="listImgTwo"/> -->
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  }
})

const onNavigate = (item) => {
  window.location.href = item.jumpUrl
}
</script>

<style lang="scss" scoped>
.classification {
  background-color: #fff;
  .topImg {
    width: 100%;
  }
  .centerContent {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 20px;
    .listImg {
      width: 30%;
      img {
        width: 100%;
      }
    }
  }
}
</style>
