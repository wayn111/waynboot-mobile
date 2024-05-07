
<template>
  <div class="registration">
    <nav-bar :title="$route.meta.title">
      <van-icon :color="variables.black" size="18" />
    </nav-bar>

    <van-form
      class="form"
      validate-trigger="onSubmit"
      :show-error="false"
      @submit="onSubmit"
    >
      <van-field
        v-model="form.mobile"
        type="text"
        required
        clearable
        name="手机号码"
        label="手机号码"
        placeholder="请输入手机号码"
        :rules="[
          {
            validator: checkPhone,
            required: true,
            message: '请输入正确的手机号码!',
          },
        ]"
      />

      <van-field
        v-model="form.password"
        type="password"
        required
        clearable
        name="设置密码"
        label="设置密码"
        placeholder="请设置密码"
        :rules="[{ required: true, message: '请设置密码!' }]"
      />

      <van-field
        v-model="form.confirmPassword"
        type="password"
        required
        clearable
        name="确认密码"
        label="确认密码"
        placeholder="请再次输入密码确认"
        :rules="[{ required: true, message: '请再次输入密码确认!' }]"
      />

      <van-field
        v-model="form.captchaCode"
        type="text"
        required
        center
        clearable
        name="图形验证码"
        maxlength="4"
        label="图形验证码"
        placeholder="请输入图形验证码"
        :rules="[{ required: true, message: '请输入正确的图形验证码！' }]"
      >
        <template #button>
          <div class="regist-code">
            <img :src="captchaImg" @click="getCaptcha">
          </div>
        </template>
      </van-field>

      <div style="margin: 36px">
        <van-button
          round
          block
          :loading="loading"
          type="info"
          loading-text="登录中..."
          native-type="submit"
        >注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { getCaptcha } from '@/api/login'
import { setRegistry } from '@/api/user'

export default {
  name: 'Regist',
  data() {
    return {
      form: {
        mobile: '',
        password: '',
        confirmPassword: '',
        captchaCode: '',
        captchaKey: ''
      },
      disabled: false,
      totalCount: 0,
      loading: false,
      captchaImg: ''
    }
  },
  computed: {
    variables() {
      return variables
    },
    btnText() {
      return this.totalCount !== 0 ? `${this.totalCount}秒后获取` : '获取验证码'
    }

  },
  mounted() {
    this.getCaptcha()
  },
  methods: {
    // 获取图形验证码
    getCaptcha() {
      getCaptcha().then((res) => {
        this.captchaImg = res.data.image
        this.form.captchaKey = res.data.key
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
      const { password, confirmPassword } = this.form
      if (password !== confirmPassword) {
        this.$toast.fail('确认密码与设置的不一致')
        return
      }
      this.loading = true
      setRegistry(this.form)
        .then((res) => {
          this.$notify({
            type: 'success',
            message: '注册成功，请登录',
            duration: 2000,
            onOpened: () => {
              this.$router.back()
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
.form {
  padding: 24px;
}
.regist-code {
  height: 40px;
  img {
    vertical-align: middle;
    position: relative;
    top: -2.467vw;
  }
}
</style>
