<template>
  <div class="user_information">
    <nav-bar title="用户设置" />
    <van-cell-group>
      <van-cell title="头像" class="cell_middle">
        <van-uploader :after-read="afterRead">
          <div class="user_avatar_upload">
            <img
              v-if="avatar"
              :src="avatar"
              alt="你的头像"
            >
            <van-icon v-else class-prefix="iconfont" name="camera" />
          </div>
        </van-uploader>
      </van-cell>

      <van-cell title="昵称" to="/user/information/setNickname" :value="nickName" is-link />
      <van-cell title="性别" :value="genderText" is-link @click="showSex = true" />
      <van-cell title="密码设置" to="/user/information/setPassword" is-link />
      <van-cell title="手机号" to="/user/information/setMobile" :value="mobile" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { base64uploadFile } from '@/api/upload'

export default {
  data() {
    return {
      nickName: 'wayn',
      avatar: null,
      genderText: '',
      showSex: false,
      mobile: 133
    }
  },
  methods: {
    async afterRead(file) {
      debugger
      const data = {
        base64content: file.content,
        filename: file.file.name
      }
      const res = await base64uploadFile(data)
      this.avatar = res.map.url
    }
  }
}
</script>
<style lang="scss" scoped>
.user_information {
  .user_avatar_upload {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #e5e5e5;
    img {
      max-width: 100%;
      max-height: 100%;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      color: #e5e5e5;
    }
  }
}
</style>
