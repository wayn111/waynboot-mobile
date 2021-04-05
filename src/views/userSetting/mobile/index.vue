<template>
  <div class="set_nickname">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-field v-model="mobile" label="昵称" />
    </van-cell-group>

    <div class="bottom_btn">
      <van-button type="primary" size="large" @click="saveNick">保存</van-button>
    </div>
  </div>
</template>

<script>
import { profile } from '@/api/user'
import { Valid } from '@/utils/index'

export default {
  data() {
    return {
      mobile: ''
    }
  },
  created() {
    this.getMobile()
  },
  methods: {
    getMobile() {
      this.mobile = this.$store.getters.userInfo.mobile
    },
    saveNick() {
      if (Valid.checkPhone(this.mobile) === false) {
        this.$toast.fail('请输入正确的手机号')
        return
      }
      profile({ mobile: this.mobile }).then((res) => {
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
