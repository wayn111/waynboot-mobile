<template>
  <div class="description">
    <h3 class="title">商品详情</h3>
    <div class="main">
      <div v-if="description" v-html="description" />
      <div v-else class="description__empty">
        <p>无详情</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.description {
  background: #ffffff;
  margin-top: 16px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  .title {
    color: #1d1d1f;
    font-size: 36px;
    line-height: 1.12;
    font-weight: 700;
    padding: 28px 24px 18px;
  }

  .main {
    padding: 0 24px 28px;
    background-color: transparent;

    :deep(p) {
      padding: 0;
      margin-block-start: 0 !important;
      margin-block-end: 0 !important;
      font-size: 28px;
      line-height: 1.55;
      color: #1d1d1f;
    }

    :deep(img) {
      max-width: 100%;
      display: block;
      border-radius: 24px;
      margin: 0 auto 16px;
    }
  }
}

.description__empty {
  padding: 28px 0;
  text-align: center;
  color: rgba(29, 29, 31, 0.48);
}
</style>
