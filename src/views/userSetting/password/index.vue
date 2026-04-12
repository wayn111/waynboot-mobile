<template>
  <div>
    <nav-bar :title="$route.meta.title" />
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

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
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
.bottom_btn {
  padding: 30px 15px 0 15px;
}
</style>
