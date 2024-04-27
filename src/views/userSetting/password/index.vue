<template>
  <div>
    <nav-bar :title="$route.meta.title" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.oldPassword"
        label="旧密码"
        type="oldPassword"
        placeholder="请输入旧密码"
        :rules="[{ required: true, message: '请填写旧密码' }]"
      />
      <van-field
        v-model="form.password"
        label="新密码"
        type="password"
        placeholder="请输入新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <van-field
        v-model="form.confirmPassword"
        label="确认密码"
        type="password"
        placeholder="请输入确认密码"
        :rules="[{ required: true, message: '请填写确认密码' }]"
      />

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    form: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    },
    disabled: false,
    totalCount: 0
  }),
  computed: {
    ...mapGetters(['userInfo']),
    btnText() {
      return this.totalCount !== 0 ? `${this.totalCount}秒后获取` : '获取验证码'
    }
  },
  methods: {
    onSubmit() {
      if (!this.passwordValid()) {
        this.$toast.fail('两次密码不一致')
        return
      }
      updatePassword(this.form).then(() => {
        this.$dialog.alert({ message: '保存成功, 请重新登录.' }).then(() => {
          this.$store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      })
    },
    passwordValid() {
      return this.form.password === this.form.confirmPassword
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom_btn {
  padding: 30px 15px 0 15px;
}

.verifi_code {
  padding-left: 10px;
  &::after {
    border-bottom: 0;
    border-left: 1px solid lightgray;
  }

  &_counting {
    color: lightgray;
  }
}
</style>
