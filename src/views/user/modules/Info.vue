<template>
  <div class="user-info">
    <div class="user-info__top">
      <div class="user-info__avatar">
        <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" />
        <span v-else class="user-info__avatar-fallback">{{ avatarFallback }}</span>
      </div>

      <div class="user-info__main">
        <span class="user-info__eyebrow">账户信息</span>
        <h2 class="user-info__name">{{ userInfo.nickname || '未设置昵称' }}</h2>
        <p class="user-info__meta">{{ profileSummary }}</p>
        
        <button type="button" class="user-info__id" @click="doCopy(userInfo.id)">
          <span class="user-info__id-text">用户ID {{ userInfo.id || '--' }}</span>
          <span class="user-info__id-icon">
            <van-icon name="notes-o" size="14" />
          </span>
        </button>
      </div>

      <button type="button" class="user-info__setting" @click="toUserSetting">
        <van-icon name="setting-o" class="user-info__setting-icon" />
      </button>
    </div>

    <div class="user-info__actions">
      <button type="button" class="user-info__action" @click="toOrderList">
        <span class="user-info__action-icon">
          <van-icon name="orders-o" size="24" color="#0071e3" />
        </span>
        <span class="user-info__action-copy">
          <strong class="user-info__action-title">全部订单</strong>
          <span class="user-info__action-desc">查看订单进度</span>
        </span>
        <van-icon name="arrow" class="user-info__action-arrow" />
      </button>

      <button type="button" class="user-info__action" @click="toAddress">
        <span class="user-info__action-icon">
          <van-icon name="location-o" size="24" color="#0071e3" />
        </span>
        <span class="user-info__action-copy">
          <strong class="user-info__action-title">收货地址</strong>
          <span class="user-info__action-desc">管理联系人</span>
        </span>
        <van-icon name="arrow" class="user-info__action-arrow" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showToast } from 'vant'
import useClipboard from 'vue-clipboard3'

const router = useRouter()
const store = useStore()

const userInfo = computed(() => store.getters.userInfo || {})
const { toClipboard } = useClipboard()

const maskMobile = (value) => {
  const source = String(value || '')
  if (source.length !== 11) {
    return source
  }

  return `${source.slice(0, 3)}****${source.slice(7)}`
}

const profileSummary = computed(() => {
  if (userInfo.value.mobile) {
    return `手机号 ${maskMobile(userInfo.value.mobile)}`
  }

  if (userInfo.value.email) {
    return userInfo.value.email
  }

  return '--'
})

const avatarFallback = computed(() => {
  return String(userInfo.value.nickname || 'U').slice(0, 1).toUpperCase()
})

const doCopy = async (val) => {
  if (val === undefined || val === null) {
    return
  }

  try {
    await toClipboard(String(val))
    showToast({
      type: 'success',
      message: 'ID 复制成功',
    })
  } catch (error) {
    console.log(error)
    showToast({
      type: 'fail',
      message: '复制失败',
    })
  }
}

const toUserSetting = () => {
  router.push({ name: 'UserSetting' })
}

const toOrderList = () => {
  router.push('/user/order/list/0')
}

const toAddress = () => {
  router.push('/address')
}
</script>

<style lang="scss" scoped>
.user-info {
  padding: 32px 24px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.04);
}

.user-info__top {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.user-info__avatar {
  width: 112px;
  height: 112px;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: rgba(0, 113, 227, 0.08);
}

.user-info__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info__avatar-fallback {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  line-height: 1;
  font-weight: 600;
  color: #0071e3;
}

.user-info__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-info__eyebrow {
  display: block;
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.user-info__name {
  margin-top: 8px;
  font-size: 44px;
  line-height: 1.2;
  font-weight: 600;
  color: #1d1d1f;
  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.user-info__meta {
  margin-top: 6px;
  font-size: 26px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.52);
}

.user-info__id {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  background: #e8f2fc;
}

.user-info__id-text {
  font-size: 22px;
  line-height: 1.2;
  font-weight: 500;
  color: #0071e3;
}

.user-info__id-icon {
  color: #0071e3;
  display: inline-flex;
}

.user-info__setting {
  width: 56px;
  height: 56px;
  flex: none;
  border: none;
  border-radius: 50%;
  background: #f5f5f7;
  color: #1d1d1f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.user-info__setting-icon {
  font-size: 30px;
}

.user-info__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 32px;
}

.user-info__action {
  min-height: 120px;
  padding: 16px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  border: 1px solid rgba(29, 29, 31, 0.04);
  border-radius: 26px;
  background: #fafafc;
  color: #1d1d1f;
  text-align: left;
}

.user-info__action-icon {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(0, 113, 227, 0.08);
  flex-shrink: 0;
}

.user-info__action-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.user-info__action-title {
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.user-info__action-desc {
  font-size: 22px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.48);
}

.user-info__action-arrow {
  font-size: 24px;
  color: rgba(29, 29, 31, 0.32);
}

@media (max-width: 375px) {
  .user-info {
    padding: 24px 20px;
  }

  .user-info__avatar {
    width: 96px;
    height: 96px;
  }

  .user-info__actions {
    grid-template-columns: 1fr;
  }
}
</style>
