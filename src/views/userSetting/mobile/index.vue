<template>
  <div class="set_nickname">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-field v-model="mobile" label="手机号" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button type="primary" size="large" @click="saveMobile">保存</van-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showDialog, showToast } from 'vant'

import { profile } from '@/api/user'
import { Valid } from '@/utils/index'

const router = useRouter()
const store = useStore()

const state = reactive({ mobile: '' })
const { mobile } = toRefs(state)

const getMobile = () => {
  mobile.value = store.getters.userInfo.mobile
}

const saveMobile = async () => {
  if (Valid.checkPhone(mobile.value) === false) {
    showToast({ type: 'fail', message: '请输入正确的手机号' })
    return
  }

  try {
    const res = await profile({ mobile: mobile.value })
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

getMobile()
</script>

<style scoped>
.bottom_btn {
  padding: 50px 15px 0 15px;
}
</style>
