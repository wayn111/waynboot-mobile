<template>
  <div class="order-status">
    <Header :status="status" />
  </div>
</template>

<script>
import Header from './modules/Header'

export default {
  name: 'OrderStatus',
  components: {
    Header
  },
  props: {
    status: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.order-status {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
