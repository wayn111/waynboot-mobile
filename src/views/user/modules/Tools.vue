<template>
  <div class="user-tools">
    <div class="user-tools__head">
      <h3 class="user-tools__title">常用工具</h3>
    </div>

    <div class="user-tools__grid">
      <button type="button" class="user-tool-card" @click="router.push('/order/my')">
        <span class="user-tool-card__icon">
          <van-icon name="coupon-o" size="24" color="#0071e3" />
        </span>
        <span class="user-tool-card__copy">
          <strong class="user-tool-card__title">优惠券</strong>
          <span class="user-tool-card__desc">查看已领取优惠</span>
        </span>
        <van-icon name="arrow" class="user-tool-card__arrow" />
      </button>

      <button type="button" class="user-tool-card" @click="router.push('/address')">
        <span class="user-tool-card__icon">
          <van-icon name="location-o" size="24" color="#0071e3" />
        </span>
        <span class="user-tool-card__copy">
          <strong class="user-tool-card__title">收货地址</strong>
          <span class="user-tool-card__desc">管理联系人信息</span>
        </span>
        <van-icon name="arrow" class="user-tool-card__arrow" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.user-tools {
  width: 100%;
  padding: 32px 24px;
  background: #ffffff;
  margin: 0 auto;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.04);
  border-radius: 34px;
  overflow: hidden;
}

.user-tools__title {
  font-size: 34px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.user-tools__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.user-tool-card {
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
  text-align: left;
  color: #1d1d1f;
}

.user-tool-card__icon {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(0, 113, 227, 0.08);
  flex-shrink: 0;
}

.user-tool-card__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-tool-card__title {
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.user-tool-card__desc {
  font-size: 22px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.48);
}

.user-tool-card__arrow {
  font-size: 24px;
  color: rgba(29, 29, 31, 0.32);
}

@media (max-width: 375px) {
  .user-tools {
    padding: 24px 20px;
  }

  .user-tools__grid {
    grid-template-columns: 1fr;
  }
}
</style>
