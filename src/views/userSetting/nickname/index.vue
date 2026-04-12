<template>
  <div class="set_nickname">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-field v-model="nickName" label="昵称" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button type="primary" size="large" @click="saveNick">保存</van-button>
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

const state = reactive({ nickName: '' })
const { nickName } = toRefs(state)

const getNick = () => {
  nickName.value = store.getters.userInfo.nickname
}

const saveNick = async () => {
  if (!nickName.value) {
    showToast({ type: 'fail', message: '昵称不能为空' })
    return
  }

  try {
    const res = await profile({ nickname: nickName.value })
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

getNick()
</script>

<style scoped>
.bottom_btn {
  padding: 50px 15px 0 15px;
}
</style>
