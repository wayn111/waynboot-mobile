<template>
  <div class="skeleton">
    <ContentLoader width="375" height="760" primary-color="#ffffff" secondary-color="#f5f5f7">
      <rect x="24" y="24" rx="18" ry="18" width="327" height="220" />
      <rect x="24" y="284" rx="18" ry="18" width="327" height="146" />
      <rect x="24" y="450" rx="18" ry="18" width="327" height="146" />
      <rect x="24" y="616" rx="18" ry="18" width="327" height="146" />
    </ContentLoader>
  </div>
</template>

<script setup>
import { ContentLoader } from 'vue-content-loader'
</script>

<style lang="scss" scoped>
.skeleton {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
  background: #f5f5f7;
}
</style>
