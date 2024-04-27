<template>
  <div class="login-container">
    <div class="header">
      <img class="header__logo" src="@/assets/logo4.png" alt="logo">
    </div>

    <van-form class="form" @submit="onSubmit">
      <van-field
        v-model="form.mobile"
        type="text"
        required
        clearable
        name="登录用户"
        label="登录用户"
        placeholder="请输入登录用户名称"
        :rules="[
          {
            validator: checkPhone,
            required: true
          },
        ]"
      />

      <van-field
        v-model="form.password"
        type="password"
        required
        center
        clearable
        name="密码"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true }]"
      />

      <div style="margin: 36px">
        <van-button
          round
          block
          :loading="loading"
          type="info"
          loading-text="登录中..."
          native-type="submit"
        >登录</van-button>

        <van-button
          style="margin-top: 10px"
          plain
          round
          block
          type="info"
          native-type="button"
          to="/registry"
        >注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || process.env.VUE_APP_BASE_PATH
      },
      immediate: true
    }
  },
  methods: {
    // 校检手机号
    checkPhone(num) {
      if (num === 123456789) return true
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (reg.test(num)) {
        return true
      }
      return false
    },
    // 提交
    onSubmit() {
      this.loading = true
      this.$store
        .dispatch('user/login', this.form)
        .then(() => {
          this.$store.dispatch('address/getList')
          this.$notify({
            type: 'success',
            message: '登录成功',
            duration: 1000,
            onOpened: () => {
              this.$router.push({ 'name': 'Home' })
            },
            onClose: () => {
              this.$router.push({ 'name': 'Home' })
            }
          })
        })
        .catch((e) => {
          this.$toast.fail(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .header__logo {
      display: block;
      width: 100%;
      // height: 800px;
    }
    .header__title {
      font-size: 36px;
      color: #000;
      font-weight: normal;
      padding-top: 30px;
    }
  }

  .form {
    // background: red;
    padding: 24px;
    // margin-top: 50px;
  }
}
</style>
