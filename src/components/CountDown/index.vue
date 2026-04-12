<template>
  <div>
    <van-count-down v-bind="$attrs">
      <template #default="timeData">
        <span class="item">{{ padZero(timeData.hours) }}</span>
        <span class="item">{{ padZero(timeData.minutes) }}</span>
        <span class="item red">{{ padZero(timeData.seconds) }}</span>
      </template>
    </van-count-down>
  </div>
</template>

<script setup>
const padZero = (value) => {
  return `${value}`.padStart(2, '0')
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.item {
  display: inline-block;
  width: 40px;
  margin-right: 5px;
  color: #fff;
  font-size: $mini;
  text-align: center;
  background-color: $gray;
  border-radius: 6px;
  height: 40px;
  line-height: 40px;
}

.red {
  background: $red;
}
</style>
