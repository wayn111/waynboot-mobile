<template>
  <div class="home-title">
    <span class="line" />
    <span class="text">{{ name }}</span>
    <span class="line" />
  </div>
</template>

<script setup>


const props = defineProps({name: {
      type: String,
      default: '',
    },})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;
.home-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 26px;
  .line {
    display: inline-block;
    width: 40px;
    height: 2px;
    background: #999;
  }
  .text {
    font-size: $small;
    color: $black;
    padding: 0 20px;
  }
}
</style>
