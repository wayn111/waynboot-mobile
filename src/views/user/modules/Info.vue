
<template>
  <div class="user-info">
    <van-icon name="setting-o" class="user__set" @click="toUserSetting()" />
    <div class="userImg">
      <img :src="userInfo.avatar">
    </div>
    <div class="main">
      <div class="main__title">
        <h3 class="name">{{ userInfo.nickname }}</h3>
      </div>
      <div class="main__id" @click="doCopy(userInfo.id)">
        <span class="code">用户id：{{ userInfo.id }}</span>
        <span style="color: #fff">
          <svg-icon icon-class="copy" :width="13" :height="13" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    doCopy(val) {
      this.$copyText(val).then(
        (e) => {
          // success
          this.$toast.success('Id复制成功')
        },
        (e) => {
          // fail
          console.log(e)
        }
      )
    },
    toUserSetting() {
      this.$router.push({ name: 'UserSetting' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.user-info {
  display: flex;
  flex-direction: row;
  padding: 60px 24px 50px 24px;
  background: $red;
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
    color: #fff;
    font-size: 50px;
  }
  .main {
    margin-left: 18px;
    .main__title {
      display: flex;
      flex-direction: row;
      align-items: center;
      // margin-top: 6px;
      .name {
        font-size: $large;
        font-weight: 500;
        color: #fff;
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
        color: #fff;
        margin-right: 10px;
      }
    }
  }
}
</style>
