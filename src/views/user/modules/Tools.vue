<template>
  <div class="user-tools">
    <van-cell title="收货地址" is-link to="address" />
    <van-cell title="Git仓库" is-link />
    <van-cell title="文档说明" is-link />
    <van-cell title="相关组件" is-link />
    <van-cell title="推荐学习" is-link />
    <van-cell title="退出登录" is-link @click="logout" />
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
        .then(() => {
          this.$notify({
            type: 'success',
            message: '退出成功',
            duration: 2000,
            onOpened: () => {
              this.$router.push({ name: 'Login' })
            }
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-tools {
  width: 702px;
  background: rgba(255, 255, 255, 1);
  margin: 0 auto;
  margin-top: 24px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.09);
  border-radius: 24px;
  overflow: hidden;
}
</style>
