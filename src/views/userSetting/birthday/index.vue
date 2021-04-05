<template>
  <div class="set_nickname">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-field v-model="birthday" label="生日" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button type="primary" size="large" @click="saveBirthday">保存</van-button>
    </div>
  </div>
</template>

<script>
import { profile } from '@/api/user'

export default {
  data() {
    return {
      birthday: '',
      show: false
    }
  },
  created() {
    this.getBirthday()
  },
  methods: {
    getBirthday() {
      this.birthday = this.$store.getters.userInfo.birthday
    },
    saveBirthday() {
      profile({ nickname: this.nickName }).then((res) => {
        this.$dialog.alert({ message: '保存成功' }).then(() => {
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
