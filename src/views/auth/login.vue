<template>
  <div class="login-container">
    <van-form class="form" @submit="onSubmit">
      <div class="title-big">Waynboot Mall 官网商城</div>
      <div class="title">若该手机号未注册，系统将自动为你注册账号</div>

      <van-field
        v-model="form.mobile"
        type="tel"
        clearable
        name="mobile"
        label=""
        placeholder="请输入手机号码"
        maxlength="11"
        :rules="[
          { required: true, message: '手机号不能为空' },
          { validator: checkPhone, message: '请输入正确的手机号码' },
        ]"
      />

      <van-field
        v-model="form.yzm"
        center
        clearable
        type="digit"
        name="yzm"
        label=""
        placeholder="请输入短信验证码"
        maxlength="6"
        :rules="[{ required: true, message: '验证码不能为空' }]"
      >
        <template #button>
          <span
            class="code-btn"
            :class="{ 'is-disabled': disabled }"
            @click.stop="getMobileCode"
          >
            {{ btnText }}
          </span>
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
        >
          登录
        </van-button>
      </div>
    </van-form>

    <van-checkbox v-model="checked" checked-color="crimson" class="agreement">
      已阅读并同意《用户协议》《隐私协议》
    </van-checkbox>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showNotify, showToast } from 'vant'

import { getMobileCode as getMobileCodeApi } from '@/api/login'

const router = useRouter()
const store = useStore()

const state = reactive({
  form: {
    mobile: '',
    yzm: '',
    emailKey: '',
  },
  loading: false,
  disabled: false,
  totalCount: 0,
  checked: false,
})

const { form, loading, disabled, totalCount, checked } = toRefs(state)

let interval = null

const clearCountDown = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

const startCountDown = () => {
  disabled.value = true
  totalCount.value = 60
  clearCountDown()
  interval = setInterval(() => {
    totalCount.value -= 1
    if (totalCount.value <= 0) {
      clearCountDown()
      totalCount.value = 0
      disabled.value = false
    }
  }, 1000)
}

const checkPhone = (num) => {
  if (num === '123456789') return true
  return /^1[3-9]\d{9}$/.test(num)
}

const getMobileCode = async () => {
  if (disabled.value) return

  const mobileVal = String(form.value.mobile || '')
  if (!mobileVal || !checkPhone(mobileVal)) {
    showToast({ type: 'fail', message: '请输入正确的手机号码' })
    return
  }

  startCountDown()

  try {
    const res = await getMobileCodeApi({ mobile: mobileVal })
    form.value.emailKey = res?.data?.key || res?.map?.key || ''
    showNotify({
      type: 'success',
      message: '短信验证码已发送',
      duration: 2000,
    })
  } catch (error) {
    clearCountDown()
    totalCount.value = 0
    disabled.value = false
    showToast({ type: 'fail', message: error?.message || '验证码发送失败' })
  }
}

const onSubmit = () => {
  if (!checked.value) {
    showToast({ type: 'fail', message: '请先勾选同意用户协议及隐私政策' })
    return
  }

  loading.value = true
  store
    .dispatch('user/login', form.value)
    .then(() => {
      store.dispatch('address/getList')
      showNotify({
        type: 'success',
        message: '登录成功',
        duration: 1000,
        onOpened: () => {
          router.push({ name: 'Home' })
        },
        onClose: () => {
          router.push({ name: 'Home' })
        },
      })
    })
    .catch((error) => {
      showToast({ type: 'fail', message: error?.message || '登录失败' })
    })
    .finally(() => {
      loading.value = false
    })
}

const btnText = computed(() => {
  return totalCount.value > 0 ? `${totalCount.value}秒后获取` : '获取验证码'
})

onBeforeUnmount(() => {
  clearCountDown()
})
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 1334px;
  padding: 200px 24px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .form {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title-big {
      font-size: 42px;
      color: #000;
      font-weight: normal;
      padding: 0 20px 20px 20px;
    }

    .title {
      color: #b6b6b6;
      padding: 0 20px 40px 20px;
    }

    :deep(.van-cell) {
      border-bottom: 1px solid #b6b6b6;
      line-height: 40px;
    }

    :deep(.van-cell:after) {
      display: none;
    }
  }

  .agreement {
    margin-top: auto;
    padding: 120px 20px 0;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: flex-start;

    :deep(.van-checkbox__label) {
      color: #b6b6b6;
      line-height: 40px;
      white-space: normal;
    }
  }

  .code-btn {
    color: #1989fa;
    font-size: 28px;
  }

  .code-btn.is-disabled {
    color: #b6b6b6;
  }

  .submitDiv {
    margin-top: 112.5px;
    width: 100%;
  }

  .submitBtn {
    background-color: crimson;
    border: none;
    width: 100%;
    font-size: 30px;
  }
}
</style>
