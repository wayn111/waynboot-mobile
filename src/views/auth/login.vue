<template>
  <div class="login-container">
    <!-- <div class="header">
      <img class="header__logo" src="@/assets/logo4.png" alt="logo">
    </div> -->

    <van-form class="form" @submit="onSubmit">
      <div class="title-big">Waynboot-mall官网商城</div>
      <div class="title">若该手机号未注册，我们将自动为你注册</div>
      <van-field
        v-model="form.mobile"
        type="text"
        clearable
        name=""
        label=""
        placeholder="请输入手机号码"
        :rules="[
          {
            validator: checkPhone,
          },
        ]"
      />

      <van-field
        v-model="form.yzm"
        center
        clearable
        label=""
        placeholder="请输入短信验证码"
      >
        <template #button>
          <span @click.stop="getMobileCode">{{ btnText }}</span>
          <!-- <van-button
            size="small"
            plain
            type="info"
            native-type="text"
            :disabled="disabled"

          >{{ btnText }}</van-button> -->
        </template>
      </van-field>

      <div class="submitDiv">
        <van-button
          round
          block
          :loading="loading"
          type="info"
          loading-text="登录中..."
          native-type="submit"
          class="submitBtn"
        >登录</van-button>

      </div>
    </van-form>
    <van-checkbox v-model="checked" checked-color="crimson">已阅读并同意《用户协议》《隐私协议》</van-checkbox>
  </div>
</template>

<script>
import { getMobileCode } from '@/api/login'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        mobile: '',
        yzm: ''
      },
      loading: false,
      disabled: false,
      totalCount: 0,
      checked: false,
      isKeyboardOpen: false
    }
  },
  computed: {
    btnText() {
      return this.totalCount !== 0 ? `${this.totalCount}秒后获取` : '获取验证码'
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
  mounted() {
    window.addEventListener('resize', this.checkKeyboard)
    this.checkKeyboard()
  },
  beforeDestroy() {
    // 移除监听
    window.removeEventListener('resize', this.checkKeyboard)
  },
  methods: {
    getMobileCode() {
      if (this.disabled) return
      const { mobile } = this.form
      if (!mobile || !this.checkPhone(mobile)) {
        this.$toast.fail('请先输入正确的手机号码')
        return
      }
      this.disabled = true
      this.totalCount = 60
      this.interval = setInterval(() => {
        this.totalCount--
        if (this.totalCount === 0) {
          clearInterval(this.interval)
          this.disabled = false
        }
      }, 1000)
      getMobileCode({ mobile }).then((res) => {
        this.form.emailKey = res.map.key
        this.$notify({
          type: 'success',
          message: '短信验证码已发送',
          duration: 2000
        })
      })
    },
    // 校检手机号
    checkPhone(num) {
      if (num === 123456789) return true
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (reg.test(num)) {
        return true
      }
      return false
    },
    // 提交
    onSubmit() {
      if (!this.checked) {
        this.$toast.fail('请先勾选同意用户协议及隐私政策')
        return
      }
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
    },
    checkKeyboard() {
      // 根据视口高度与设备屏幕高度比较来判断键盘是否弹出
      this.isKeyboardOpen = window.innerHeight > document.documentElement.clientHeight
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
    margin-top:200px;
    padding: 24px;
    .title-big{
      font-size: 42px;
      color: #000;
      font-weight: normal;
      padding: 0 20px 20px 20px;
    }
    .title {
      color: #b6b6b6;
      padding: 0 20px 40px 20px;
    }
    ::v-deep .van-cell{
      border-bottom: 1px solid #b6b6b6;
      line-height: 40px;
    }
    ::v-deep .van-cell:after{
       display: none;
    }
  }
  ::v-deep .van-checkbox{
    position: absolute;
    bottom: -40vh;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;

    .van-checkbox__label{
      color: #b6b6b6;
    }
  }

  .submitDiv{
    margin:15vw  auto 0;
    width: max-content;
  }
  .submitBtn{
    background-color: crimson;
    border: none;
    width:500px;
    font-size: 30px;
  }
}
</style>
