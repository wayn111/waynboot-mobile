<template>
  <div class="order-status wb-page">
    <div class="order-status__body">
      <Header />
    </div>
  </div>
</template>

<script setup>
import Header from './modules/Header'
</script>

<style lang="scss" scoped>
.order-status__body {
  width: 100%;
  max-width: var(--wb-content-width);
  min-height: 100vh;
  margin: 0 auto;
  padding: 112px 24px 24px;
}

@media (max-width: 375px) {
  .order-status__body {
    padding: 96px 20px 24px;
  }
}
</style>
