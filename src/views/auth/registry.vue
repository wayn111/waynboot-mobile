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
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[
          {
            validator: checkPhone,
            required: true,
            message: '请输入正确的手机号!',
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
        :rules="[{ required: true, message: '请设置密码' }]"
      />

      <van-field
        v-model="form.confirmPassword"
        type="password"
        required
        clearable
        name="确认密码"
        label="确认密码"
        placeholder="请再次输入密码确认"
        :rules="[{ required: true, message: '请再次输入密码确认' }]"
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
            <img :src="captchaImg" @click="getCaptcha" />
          </div>
        </template>
      </van-field>

      <div style="margin: 36px">
        <van-button
          round
          block
          :loading="loading"
          type="info"
          loading-text="注册中..."
          native-type="submit"
        >
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify, showToast } from 'vant'

import variables from '@/styles/variables.scss?inline'
import { getCaptcha as getCaptchaApi } from '@/api/login'
import { setRegistry } from '@/api/user'

const router = useRouter()

const state = reactive({
  form: {
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaCode: '',
    captchaKey: '',
  },
  loading: false,
  captchaImg: '',
})
const { form, loading, captchaImg } = toRefs(state)

const getCaptcha = () => {
  getCaptchaApi().then((res) => {
    captchaImg.value = res.data.image
    form.value.captchaKey = res.data.key
  })
}

const checkPhone = (num) => {
  if (num === 123456789) return true
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(num)
}

const onSubmit = () => {
  const { password, confirmPassword } = form.value
  if (password !== confirmPassword) {
    showToast({ type: 'fail', message: '确认密码与设置的不一致' })
    return
  }

  loading.value = true
  setRegistry(form.value)
    .then(() => {
      showNotify({
        type: 'success',
        message: '注册成功，请登录',
        duration: 2000,
        onOpened: () => {
          router.back()
        },
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getCaptcha()
})
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
