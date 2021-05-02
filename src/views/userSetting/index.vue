<template>
  <div class="user_information">
    <nav-bar :title="$route.meta.title" />
    <van-cell-group>
      <van-cell title="头像" class="cell_middle">
        <van-uploader :after-read="afterRead">
          <div class="user_avatar_upload">
            <img v-if="userInfo.avatar" :src="userInfo.avatar">
            <van-icon v-else class-prefix="iconfont" name="camera" />
          </div>
        </van-uploader>
      </van-cell>

      <van-cell
        title="昵称"
        to="/userSetting/nickname"
        :value="userInfo.nickname"
        is-link
      />
      <van-cell
        title="邮箱"
        to="/userSetting/email"
        :value="userInfo.email"
        is-link
      />
      <van-cell
        title="性别"
        :value="userInfo.gender === 1 ? '男' : '女'"
        is-link
        @click="showGender = true"
      />
      <van-cell
        title="生日"
        :value="userInfo.birthday"
        is-link
        @click="showBirthday = true"
      />
      <van-cell title="密码设置" to="/userSetting/password" is-link />
      <van-cell
        title="手机号"
        to="/userSetting/mobile"
        :value="userInfo.mobile"
        is-link
      />
    </van-cell-group>
    <van-popup v-model="showBirthday" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmBirthday"
        @cancel="showBirthday = false"
      />
    </van-popup>
    <van-popup v-model="showGender" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showGender = false"
        @confirm="onConfirmGender"
      />
    </van-popup>
  </div>
</template>

<script>
import { base64uploadFile } from '@/api/upload'
import { uploadAvatar } from '@/api/user'
import { mapGetters } from 'vuex'
import { str2date } from '@/utils/index'
import { profile } from '@/api/user'

export default {
  data() {
    return {
      showBirthday: false,
      showGender: false,
      columns: ['男', '女'],
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(),
      currentDate: null,
      pickerDate: null
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    pickerDateHandler: function() {
      this.pickerDate.setDate(this.pickerDate.getDate() + 1)
      return this.pickerDate
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const dayJs = str2date(
        this.$store.getters.userInfo.birthday,
        'YYYY-MM-DD'
      )
      this.currentDate = new Date(dayJs.year(), dayJs.month(), dayJs.date())
    },
    async afterRead(file) {
      this.$toast.loading({
        message: '正在上传...',
        forbidClick: true
      })
      const uploadRes = await base64uploadFile({
        base64content: file.content,
        filename: file.file.name
      })
      this.avatar = uploadRes.map.url
      const res = await uploadAvatar({
        avatar: this.avatar
      })
      if (res.code !== 200) {
        this.$toast.fail(res.msg)
        return
      }
      await this.$store.dispatch('user/getInfo')
      this.$toast.success('上传头像成功')
    },
    confirmBirthday(value) {
      this.pickerDate = value
      profile({ birthday: this.pickerDateHandler }).then(async(res) => {
        if (res.code !== 200) {
          this.$toast.fail(res.msg)
          return
        }
        await this.$store.dispatch('user/getInfo')
        this.$toast.success('修改成功')
        this.showBirthday = false
      })
    },
    onConfirmGender(value, index) {
      profile({ gender: index + 1 }).then(async(res) => {
        if (res.code !== 200) {
          this.$toast.fail(res.msg)
          return
        }
        await this.$store.dispatch('user/getInfo')
        this.$toast.success('修改成功')
        this.showGender = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user_information {
  .user_avatar_upload {
    width: 100px;
    height: 100px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      // 设置图片垂直居中
      display: inline-block;
      vertical-align: middle;
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
