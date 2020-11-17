<template>
  <div class="order-status">
    <Header :status="status" />
    <Share />
  </div>
</template>

<script>
import Header from './modules/Header'
import Share from './modules/Share'

export default {
  name: 'OrderStatus',
  components: {
    Header,
    Share
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
