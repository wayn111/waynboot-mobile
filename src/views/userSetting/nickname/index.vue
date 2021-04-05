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

<script>
import { profile } from '@/api/user'

export default {
  data() {
    return {
      nickName: ''
    }
  },
  created() {
    this.getNick()
  },
  methods: {
    getNick() {
      this.nickName = this.$store.getters.userInfo.nickname
    },
    saveNick() {
      if (!this.nickName) {
        this.$toast.fail('昵称不能为空')
        return
      }
      profile({ nickname: this.nickName }).then((res) => {
        this.$dialog.alert({ message: '保存成功' }).then(async() => {
          await this.$store.dispatch('user/getInfo')
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>

<style scoped>
.bottom_btn {
  padding: 50px 15px 0 15px;
}
</style>
