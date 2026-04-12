<template>
  <div class="user-information">
    <nav-bar :title="$route.meta.title" />

    <van-cell-group>
      <van-cell title="头像" class="cell_middle">
        <van-uploader :after-read="afterRead">
          <div class="user_avatar_upload">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
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
        title="性别"
        :value="genderText"
        is-link
        @click="showGender = true"
      />
      <van-cell
        title="生日"
        :value="userInfo.birthday || ''"
        is-link
        @click="showBirthday = true"
      />
    </van-cell-group>

    <van-popup v-model:show="showBirthday" round position="bottom">
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

    <van-popup v-model:show="showGender" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showGender = false"
        @confirm="onConfirmGender"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { base64uploadFile } from '@/api/upload'
import { profile, uploadAvatar } from '@/api/user'

const store = useStore()

const state = reactive({
  showBirthday: false,
  showGender: false,
  columns: [
    { text: '男', value: 1 },
    { text: 'Ů', value: 2 },
  ],
  minDate: new Date(1960, 0, 1),
  maxDate: new Date(),
  currentDate: new Date(),
})

const { showBirthday, showGender, columns, minDate, maxDate, currentDate } = toRefs(state)

const userInfo = computed(() => store.getters.userInfo || {})

const genderText = computed(() => {
  if (userInfo.value.gender === 1) {
    return '男'
  }
  if (userInfo.value.gender === 2) {
    return 'Ů'
  }
  return ''
})

watch(
  () => userInfo.value.birthday,
  (birthday) => {
    if (!birthday) {
      currentDate.value = new Date()
      return
    }

    const parsedDate = dayjs(birthday, 'YYYY-MM-DD')
    currentDate.value = parsedDate.isValid() ? parsedDate.toDate() : new Date()
  },
  { immediate: true }
)

const refreshUserInfo = async () => {
  await store.dispatch('user/getInfo')
}

const afterRead = async (file) => {
  showLoadingToast({
      message: '正在上传...',
    forbidClick: true,
    duration: 0,
  })

  try {
    const uploadRes = await base64uploadFile({
      base64content: file.content,
      filename: file.file.name,
    })
    const avatar = uploadRes.data
    const res = await uploadAvatar({ avatar })

    closeToast()

    if (res.code !== 200) {
      showToast({
        type: 'fail',
        message: res.msg || '上传头像失败',
      })
      return
    }

    await refreshUserInfo()
    showToast({
      type: 'success',
      message: '上传头像成功',
    })
  } catch (error) {
    closeToast()
    showToast({
      type: 'fail',
      message: error?.message || '上传头像失败',
    })
  }
}

const confirmBirthday = async (value) => {
  const birthday = dayjs(value).format('YYYY-MM-DD')
  const res = await profile({ birthday })

  if (res.code !== 200) {
    showToast({
      type: 'fail',
      message: res.msg || '修改失败',
    })
    return
  }

  await refreshUserInfo()
  showToast({
    type: 'success',
    message: '修改成功',
  })
  showBirthday.value = false
}

const onConfirmGender = async ({ selectedOptions = [] }) => {
  const gender = selectedOptions[0]?.value
  if (!gender) {
    showGender.value = false
    return
  }

  const res = await profile({ gender })
  if (res.code !== 200) {
    showToast({
      type: 'fail',
      message: res.msg || '修改失败',
    })
    return
  }

  await refreshUserInfo()
  showToast({
    type: 'success',
    message: '修改成功',
  })
  showGender.value = false
}
</script>

<style lang="scss" scoped>
.user-information {
  .user_avatar_upload {
    width: 100px;
    height: 100px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
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
