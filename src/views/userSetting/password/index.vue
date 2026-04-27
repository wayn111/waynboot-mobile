<template>
  <div class="password-editor wb-page">
    <nav-bar :title="$route.meta.title" />
    <section class="password-editor__hero">
      <span class="password-editor__hero__eyebrow">Security</span>
      <h1 class="password-editor__hero__title">更新登录密码。</h1>
    </section>
    <div class="password-editor__body">
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.oldPassword"
          label="旧密码"
          type="password"
          placeholder="请输入旧密码"
          :rules="[{ required: true, message: '请填写旧密码' }]"
        />
        <van-field
          v-model="form.password"
          label="新密码"
          type="password"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <van-field
          v-model="form.confirmPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入新密码"
          :rules="[{ required: true, message: '请填写确认密码' }]"
        />

        <div class="password-editor__submit">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { showDialog, showToast } from 'vant'

import { updatePassword } from '@/api/user'

const store = useStore()

const form = reactive({
  oldPassword: '',
  password: '',
  confirmPassword: '',
})

const passwordValid = () => {
  return form.password === form.confirmPassword
}

const onSubmit = () => {
  if (!passwordValid()) {
    showToast({
      type: 'fail',
      message: '两次密码不一致',
    })
    return
  }

  updatePassword(form).then(() => {
    showDialog({ message: '保存成功，请重新登录。' }).then(() => {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    })
  })
}
</script>

<style lang="scss" scoped>
.password-editor {
  background: linear-gradient(180deg, #000000 0, #000000 260px, #f5f5f7 260px, #f5f5f7 100%);
}

.password-editor__hero {
  padding: 20px 24px 24px;
  color: #fff;
}

.password-editor__hero__eyebrow {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.72);
}

.password-editor__hero__title {
  margin-top: 14px;
  font-size: 46px;
  line-height: 1.08;
  font-weight: 600;
}

.password-editor__body {
  margin: 0 24px 24px;
  padding: 12px 0 24px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}

.password-editor__submit {
  padding: 30px 15px 0 15px;
}
</style>
