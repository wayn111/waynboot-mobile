<template>
  <div class="set_nickname">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-field v-model="gender" label="性别" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button type="primary" size="large" @click="saveGender">保存</van-button>
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

const state = reactive({ gender: '' })
const { gender } = toRefs(state)

const getGender = () => {
  gender.value = store.getters.userInfo.gender
}

const saveGender = async () => {
  try {
    const res = await profile({ gender: gender.value })
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

getGender()
</script>

<style scoped>
.bottom_btn {
  padding: 50px 15px 0 15px;
}
</style>
