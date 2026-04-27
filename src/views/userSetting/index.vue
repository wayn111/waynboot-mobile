<template>
  <div class="user-setting wb-page">
    <nav-bar :title="$route.meta.title" />

    <main class="user-setting__body">
      <section class="user-setting__profile">
        <van-uploader :after-read="afterRead">
          <div class="user-setting__avatar">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" />
            <van-icon v-else class-prefix="iconfont" name="camera" />
          </div>
        </van-uploader>
        <div class="user-setting__profile__copy">
          <span class="user-setting__profile__label">头像</span>
          <strong class="user-setting__profile__name">
            {{ userInfo.nickname || '未设置昵称' }}
          </strong>
        </div>
        <van-uploader :after-read="afterRead">
          <span class="user-setting__profile__action">更换</span>
        </van-uploader>
      </section>

      <section class="user-setting__panel">
        <van-cell-group>
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
      </section>
    </main>

    <van-popup v-model:show="showBirthday" round position="bottom">
      <van-date-picker
        v-model="currentDate"
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
    { text: '女', value: 2 },
  ],
  minDate: new Date(1960, 0, 1),
  maxDate: new Date(),
  currentDate: [],
})

const { showBirthday, showGender, columns, minDate, maxDate, currentDate } = toRefs(state)

const userInfo = computed(() => store.getters.userInfo || {})

const genderText = computed(() => {
  if (userInfo.value.gender === 1) {
    return '男'
  }
  if (userInfo.value.gender === 2) {
    return '女'
  }
  return ''
})

watch(
  () => userInfo.value.birthday,
  (birthday) => {
    let targetDate = dayjs()
    if (birthday) {
      const parsedDate = dayjs(birthday, 'YYYY-MM-DD')
      if (parsedDate.isValid()) {
        targetDate = parsedDate
      }
    }
    currentDate.value = [
      targetDate.format('YYYY'),
      targetDate.format('MM'),
      targetDate.format('DD'),
    ]
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

const confirmBirthday = async ({ selectedValues }) => {
  const birthday = selectedValues.join('-')
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
.user-setting {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 50%, #f5f5f7 100%);
}

.user-setting__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 18px 18px 36px;
}

.user-setting__profile {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 24px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.user-setting__avatar {
  position: relative;
  width: 112px;
  height: 112px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: #f5f5f7;
  box-shadow: inset 0 0 0 1px rgba(29, 29, 31, 0.06);
}

.user-setting__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-setting__avatar i {
  font-size: 48px;
  color: rgba(29, 29, 31, 0.28);
}

.user-setting__profile__copy {
  min-width: 0;
}

.user-setting__profile__label {
  display: block;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.5);
}

.user-setting__profile__name {
  display: block;
  margin-top: 8px;
  font-size: 36px;
  line-height: 1.18;
  font-weight: 700;
  color: #1d1d1f;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-setting__profile__action {
  flex: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.user-setting__panel {
  margin-top: 18px;
  overflow: hidden;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

:deep(.van-cell-group) {
  background: transparent;
}

:deep(.van-cell) {
  align-items: center;
  padding: 26px 24px;
  background: #ffffff;
}

:deep(.van-cell::after) {
  right: 24px;
  left: 24px;
  border-color: rgba(29, 29, 31, 0.08);
}

:deep(.van-cell__title) {
  color: #1d1d1f;
  font-size: 30px;
  line-height: 1.25;
  font-weight: 600;
}

:deep(.van-cell__value) {
  color: rgba(29, 29, 31, 0.56);
  font-size: 28px;
  line-height: 1.25;
}

:deep(.van-cell__right-icon) {
  color: rgba(29, 29, 31, 0.34);
  font-size: 32px;
}

:deep(.van-popup) {
  background: #ffffff;
}

:deep(.van-picker__toolbar),
:deep(.van-picker-column__item),
:deep(.van-picker__confirm),
:deep(.van-picker__cancel) {
  font-size: 28px;
}

@media (max-width: 375px) {
  .user-setting__body {
    padding-right: 16px;
    padding-left: 16px;
  }

  .user-setting__profile {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .user-setting__profile__action {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
