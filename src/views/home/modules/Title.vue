<template>
  <div class="home-title">
    <span class="line" />
    <span class="text">{{ name }}</span>
    <span class="line" />
  </div>
</template>

<script setup>


defineProps({name: {
      type: String,
      default: '',
    },})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.home-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 32px 28px 14px;

  &::after {
    content: '继续浏览';
    font-size: 24px;
    color: #0066cc;
    line-height: 1.2;
  }

  .line {
    display: none;
  }
  .text {
    font-size: 42px;
    color: $black;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.22px;
    padding: 0;
  }
}
</style>
