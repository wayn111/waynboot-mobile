<template>
  <div class="login-page">
    <div class="login-page__sky" aria-hidden="true">
      <span class="login-page__cloud login-page__cloud--a" />
      <span class="login-page__cloud login-page__cloud--b" />
      <span class="login-page__cloud login-page__cloud--c" />
    </div>

    <div class="login-page__inner">
      <header class="login-page__header">
        <h1 class="login-page__title">欢迎回来</h1>
        <p class="login-page__subtitle">使用手机号与验证码登录</p>
      </header>

      <div class="login-page__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="login-page__tab is-active"
          aria-selected="true"
        >
          验证码登录
        </button>
        <button
          type="button"
          role="tab"
          class="login-page__tab"
          aria-selected="false"
          @click="onSecondaryTab"
        >
          账号安全
        </button>
      </div>

      <section class="login-card">
        <h2 class="login-card__title">手机号登录</h2>

        <van-form class="login-form" @submit="onSubmit">
          <div class="login-field">
            <van-icon name="phone-o" class="login-field__icon" />
            <van-field
              v-model="form.mobile"
              type="tel"
              clearable
              name="mobile"
              placeholder="请输入手机号"
              maxlength="11"
              :rules="[
                { required: true, message: '手机号不能为空' },
                { validator: checkPhone, message: '请输入正确的手机号码' },
              ]"
            />
          </div>

          <div class="login-field">
            <van-icon name="shield-o" class="login-field__icon" />
            <van-field
              v-model="form.yzm"
              center
              clearable
              type="digit"
              name="yzm"
              placeholder="请输入短信验证码"
              maxlength="6"
              :rules="[{ required: true, message: '验证码不能为空' }]"
            >
              <template #button>
                <span
                  class="login-field__code"
                  :class="{ 'is-disabled': disabled }"
                  @click.stop="getMobileCode"
                >
                  {{ btnText }}
                </span>
              </template>
            </van-field>
          </div>

          <van-button
            round
            block
            :loading="loading"
            type="info"
            loading-text="登录中..."
            native-type="submit"
            class="login-submit"
          >
            登录
          </van-button>
        </van-form>

        <van-checkbox
          v-model="checked"
          checked-color="#0071e3"
          class="login-agreement"
          icon-size="16"
        >
          已阅读并同意<a class="login-agreement__link" @click.stop>《用户协议》</a><a
            class="login-agreement__link"
            @click.stop
          >《隐私协议》</a>
        </van-checkbox>
      </section>
    </div>
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

const onSecondaryTab = () => {
  showToast({ message: '当前仅支持验证码登录' })
}

const btnText = computed(() => {
  return totalCount.value > 0 ? `${totalCount.value}秒后获取` : '获取验证码'
})

onBeforeUnmount(() => {
  clearCountDown()
})
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  padding: 120px 32px 48px;
  overflow: hidden;
  background: linear-gradient(180deg, #eaf1ff 0%, #f4f7ff 38%, #f5f5f7 100%);
  box-sizing: border-box;
}

.login-page__sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.login-page__cloud {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.78;
}

.login-page__cloud--a {
  top: -120px;
  right: -80px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.92), rgba(198, 219, 255, 0.6) 60%, transparent 75%);
}

.login-page__cloud--b {
  top: 40px;
  left: -160px;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle at 70% 40%, rgba(255, 255, 255, 0.7), rgba(186, 210, 255, 0.38) 60%, transparent 75%);
}

.login-page__cloud--c {
  top: 220px;
  right: -60px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75), rgba(170, 198, 255, 0.3) 60%, transparent 75%);
}

.login-page__inner {
  position: relative;
  z-index: 1;
}

.login-page__header {
  margin-bottom: 36px;
}

.login-page__title {
  margin: 0;
  font-size: 60px;
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: #1d1d1f;
}

.login-page__subtitle {
  margin: 20px 0 0;
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.55);
}

.login-page__tabs {
  display: flex;
  gap: 14px;
  margin-bottom: 40px;
  padding: 0;
}

.login-page__tab {
  padding: 16px 28px;
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  font-weight: 500;
  color: rgba(29, 29, 31, 0.52);
  border-radius: 999px;
  transition: background 160ms ease, color 160ms ease, box-shadow 160ms ease;
  cursor: pointer;
}

.login-page__tab.is-active {
  background: #ffffff;
  color: #0071e3;
  font-weight: 600;
  box-shadow: 0 8px 22px rgba(64, 124, 220, 0.14);
}

.login-card {
  position: relative;
  padding: 44px 32px 36px;
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(31, 65, 135, 0.12);
}

.login-card__title {
  margin: 0 0 30px;
  font-size: 36px;
  line-height: 1.1;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.login-field {
  position: relative;
  display: flex;
  align-items: center;
  background: #f3f5f9;
  border-radius: 24px;
  padding-left: 28px;
  transition: background 160ms ease, box-shadow 160ms ease;
}

.login-field:focus-within {
  background: #ffffff;
  box-shadow: inset 0 0 0 2px rgba(0, 113, 227, 0.35);
}

.login-field__icon {
  flex: 0 0 auto;
  font-size: 36px;
  color: rgba(29, 29, 31, 0.45);
  margin-right: 12px;
}

.login-field :deep(.van-cell) {
  flex: 1;
  padding: 28px 24px 28px 0;
  background: transparent;
  font-size: 30px;
  line-height: 1.2;
}

.login-field :deep(.van-cell:after) {
  display: none;
}

.login-field :deep(.van-field__control) {
  color: #1d1d1f;
}

.login-field :deep(.van-field__control::placeholder) {
  color: rgba(29, 29, 31, 0.4);
}

.login-field__code {
  padding: 0 4px;
  font-size: 26px;
  line-height: 1;
  font-weight: 600;
  color: #0071e3;
  white-space: nowrap;
  cursor: pointer;
}

.login-field__code.is-disabled {
  color: rgba(29, 29, 31, 0.4);
  cursor: default;
}

.login-submit {
  margin-top: 18px;
  height: 92px;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #0a84ff 0%, #0071e3 100%);
  border: none;
  box-shadow: 0 16px 36px rgba(10, 132, 255, 0.28);
}

.login-submit:active {
  opacity: 0.92;
}

.login-agreement {
  margin-top: 28px;
  padding: 0 4px;
  align-items: center;
}

.login-agreement :deep(.van-checkbox__label) {
  color: rgba(29, 29, 31, 0.58);
  font-size: 24px;
  line-height: 1.4;
  white-space: normal;
  margin-left: 8px;
}

.login-agreement__link {
  color: #0071e3;
}

@media (max-width: 360px) {
  .login-page {
    padding: 96px 24px 40px;
  }

  .login-page__title {
    font-size: 52px;
  }
}
</style>
