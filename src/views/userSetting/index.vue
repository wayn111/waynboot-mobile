<template>
  <div class="user_information">
    <nav-bar title="用户设置" />
    <van-cell-group>
      <van-cell title="头像" class="cell_middle">
        <van-uploader :after-read="afterRead">
          <div class="user_avatar_upload">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="你的头像">
            <van-icon v-else class-prefix="iconfont" name="camera" />
          </div>
        </van-uploader>
      </van-cell>

      <van-cell
        title="昵称"
        to="/user/information/setNickname"
        :value="userInfo.nickname"
        is-link
      />
      <van-cell
        title="邮箱"
        :value="userInfo.email"
        is-link
      />
      <van-cell
        title="性别"
        :value="userInfo.gender === 1?'男':'女'"
        is-link
        @click="userInfo.gender === 1"
      />
      <van-cell
        title="生日"
        :value="userInfo.birthday"
        is-link
      />
      <van-cell title="密码设置" to="/user/information/setPassword" is-link />
      <van-cell
        title="手机号"
        to="/user/information/setMobile"
        :value="userInfo.mobile"
        is-link
      />
    </van-cell-group>
  </div>
</template>

<script>
import { base64uploadFile } from '@/api/upload'
import { uploadAvatar } from '@/api/user'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    async afterRead(file) {
      const uploadRes = await base64uploadFile({
        base64content: file.content,
        filename: file.file.name
      })
      this.avatar = uploadRes.map.url
      console.log(this.$store.getters)
      const res = await uploadAvatar({
        avatar: this.avatar
      })
      if (res.code !== 200) {
        this.$toast.fail(res.msg)
        return
      }
      await this.$store.dispatch('user/getInfo')
      this.$toast.success('上传头像成功')
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
