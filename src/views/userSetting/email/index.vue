<template>
  <div class="set_nickname wb-page">
    <nav-bar :title="$route.meta.title" />
    <section class="set_nickname__hero">
      <span class="set_nickname__hero__eyebrow">Edit</span>
      <h1 class="set_nickname__hero__title">更新邮箱。</h1>
    </section>
    <div class="set_nickname__body">
      <van-cell-group>
        <van-field v-model="email" label="邮箱" />
      </van-cell-group>

      <div class="bottom_btn">
        <van-button type="primary" size="large" @click="saveEmail">保存</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showDialog, showToast } from 'vant'

import { profile } from '@/api/user'

const router = useRouter()
const store = useStore()

const state = reactive({ email: '' })
const { email } = toRefs(state)

const getEmail = () => {
  email.value = store.getters.userInfo.email
}

const saveEmail = async () => {
  try {
    const res = await profile({ email: email.value })
    if (res.code !== 200) {
      showToast({ type: 'fail', message: res.msg || '保存失败' })
      return
    }

    await store.dispatch('user/getInfo')
    showDialog({ message: '保存成功' }).then(() => {
      router.go(-1)
    })
  } catch (error) {
    showToast({ type: 'fail', message: error?.message || '保存失败' })
  }
}

getEmail()
</script>

<style scoped>
.set_nickname {
  background: #f5f5f7;
  min-height: 100vh;
}

.set_nickname__hero {
  padding: 40px 24px 24px;
  color: #1d1d1f;
}

.set_nickname__hero__eyebrow {
  font-size: 26px;
  color: #86868b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.set_nickname__hero__title {
  margin-top: 12px;
  font-size: 56px;
  line-height: 1.08;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.set_nickname__body {
  margin: 0 24px 24px;
  padding: 12px 0 24px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.bottom_btn {
  padding: 50px 15px 0 15px;
}
</style>
