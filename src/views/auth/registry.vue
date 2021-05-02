
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
            message: '请输入正确的邮箱地址!',
          },
        ]"
      />

      <van-field
        v-model="form.email"
        type="text"
        required
        clearable
        name="注册邮箱"
        label="注册邮箱"
        placeholder="请输入邮箱地址"
        :rules="[
          {
            validator: checkEmail,
            required: true,
            message: '请输入正确的邮箱地址!',
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
        v-model="form.emailCode"
        type="text"
        required
        center
        clearable
        name="邮箱验证码"
        label="邮箱验证码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入正确的邮箱验证码！' }]"
      >
        <van-button
          slot="button"
          size="small"
          plain
          type="info"
          native-type="button"
          :disabled="disabled"
          @click.stop="getMailCode"
        >{{ btnText }}</van-button>
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
import { getMailCode } from '@/api/login'
import { setRegistry } from '@/api/user'

export default {
  name: 'Regist',
  data() {
    return {
      form: {
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
        emailKey: '',
        key: ''
      },
      disabled: false,
      totalCount: 0,
      loading: false
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
  },
  methods: {
    // 获取邮箱验证码
    getMailCode() {
      const { email } = this.form
      if (!email || !this.checkEmail(email)) {
        this.$toast.fail('请先输入正确的邮箱地址')
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
      getMailCode({ email }).then((res) => {
        this.form.emailKey = res.map.key
        this.$notify({
          type: 'success',
          message: '邮箱验证码已发送',
          duration: 2000
        })
      })
    },
    // 校检邮箱
    checkEmail(email) {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return reg.test(email)
    },
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
