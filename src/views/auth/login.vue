<template>
  <div class="login-container">
    <div class="header">
      <img class="header__logo" src="@/assets/logo4.png" alt="logo">
      <!-- <p class="header__title">waynboot-mall</p> -->
    </div>

    <van-form class="form" @submit="onSubmit">
      <van-field
        v-model="form.mobile"
        type="number"
        required
        clearable
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          {
            validator: checkPhone,
            required: true,
            message: '请填写正确的手机号！',
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
        :rules="[{ required: true, message: '请填写密码！' }]"
      />

      <div style="margin: 36px">
        <van-button
          round
          block
          :loading="loading"
          type="info"
          loading-text="登录中..."
          native-type="submit"
        >提交</van-button>

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
        mobile: undefined,
        password: undefined
      },
      loading: false
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
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
              location.href = this.redirect
            },
            onClose: () => {
              location.href = this.redirect
            }
          })
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
      // width: 150px;
      // height: 150px;
      padding-top: 80px;
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
