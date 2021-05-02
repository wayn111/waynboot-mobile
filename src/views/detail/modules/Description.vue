<template>
  <div class="description">
    <h3 class="title">商品详情</h3>
    <div class="main">
      <!-- <image-pic width="100%" fill="cover" :src="description" /> -->
      <div v-if="description" v-html="description" />
      <div v-else style="text-align: center">
        <p>无详情</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.description {
  background: #fff;
  margin-top: 24px;
  .title {
    color: $black;
    font-size: $small;
    padding: 30px;
  }
  .main {
    padding: 0 24px;
    background-color: #fff;
    ::v-deep p {
      padding: 0 10px;
      margin-block-start: 0 !important;
      margin-block-end: 0 !important;
    }
    ::v-deep img {
      max-width: 100%;
      display: block;
    }
  }
}
</style>>
