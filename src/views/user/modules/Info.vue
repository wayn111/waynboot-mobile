<template>
  <div class="user-info">
    <van-icon name="setting-o" class="user__set" @click="toUserSetting" />
    <div class="userImg">
      <img :src="userInfo.avatar" alt="用户头像" />
    </div>
    <div class="main">
      <div class="main__title">
        <h3 class="name">{{ userInfo.nickname }}</h3>
      </div>
      <div class="main__id" @click="doCopy(userInfo.id)">
        <span class="code">用户 ID：{{ userInfo.id }}</span>
        <span style="color: #666">
          <svg-icon icon-class="copy" :width="13" :height="13" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showToast } from 'vant'
import useClipboard from 'vue-clipboard3'

const router = useRouter()
const store = useStore()

const userInfo = computed(() => store.getters.userInfo || {})
const { toClipboard } = useClipboard()

const doCopy = async (val) => {
  if (val === undefined || val === null) {
    return
  }

  try {
    await toClipboard(String(val))
    showToast({
      type: 'success',
      message: 'ID 复制成功',
    })
  } catch (error) {
    console.log(error)
    showToast({
      type: 'fail',
      message: '复制失败',
    })
  }
}

const toUserSetting = () => {
  router.push({ name: 'UserSetting' })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.user-info {
  display: flex;
  flex-direction: row;
  padding: 60px 24px 50px 24px;
  border-radius: 100% 100% 100% 100% / 0% 0% 16% 16%;

  .userImg {
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }

  .user__set {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #000;
    font-size: 50px;
  }

  .main {
    margin-left: 18px;

    .main__title {
      display: flex;
      flex-direction: row;
      align-items: center;

      .name {
        font-size: $large;
        font-weight: 500;
        color: #000;
        display: inline-block;
        max-width: 350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 20px;
      }
    }

    .main__id {
      margin-top: 24px;

      .code {
        font-size: $small;
        font-weight: 400;
        color: $gray;
        margin-right: 10px;
      }
    }
  }
}
</style>
