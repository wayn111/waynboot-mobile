<template>
  <div class="my-coupon-page wb-page wb-page--tabbed">
    <nav-bar title="我的优惠券" />

    <div class="my-coupon-page__body">
      <section class="my-coupon-hero">
        <div class="my-coupon-hero__head">
          <div class="my-coupon-hero__main">
            <span class="my-coupon-hero__eyebrow">优惠管理</span>
            <h1 class="my-coupon-hero__title">{{ availableCount }} 张可用</h1>
            <p class="my-coupon-hero__desc">已领取 {{ goodsList.length }} 张优惠券，下单时会自动匹配可用优惠。</p>
          </div>

          <button type="button" class="my-coupon-hero__button" @click="goCouponCenter">
            去领更多
          </button>
        </div>

        <div class="my-coupon-hero__stats">
          <div class="my-coupon-hero__stat">
            <span class="my-coupon-hero__stat-label">未使用</span>
            <strong class="my-coupon-hero__stat-value">{{ availableCount }}</strong>
          </div>
          <div class="my-coupon-hero__stat">
            <span class="my-coupon-hero__stat-label">已使用</span>
            <strong class="my-coupon-hero__stat-value">{{ usedCount }}</strong>
          </div>
          <div class="my-coupon-hero__stat">
            <span class="my-coupon-hero__stat-label">已过期</span>
            <strong class="my-coupon-hero__stat-value">{{ expiredCount }}</strong>
          </div>
        </div>
      </section>

      <section class="my-coupon-section">
        <div class="my-coupon-section__head">
          <h2 class="my-coupon-section__title">优惠券列表</h2>
          <span class="my-coupon-section__meta">{{ goodsList.length }} 张</span>
        </div>

        <van-list
          v-model:loading="isLoading"
          :finished="isFinished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onReachBottom"
        >
          <div class="my-coupon-section__list">
            <div v-if="!isLoading && goodsList.length <= 0" class="my-coupon-empty">
              <div class="my-coupon-empty__panel">
                <h3 class="my-coupon-empty__title">还没有领取优惠券</h3>
                <p class="my-coupon-empty__desc">去领券中心领取后，这里会按使用状态自动整理。</p>
                <button type="button" class="my-coupon-empty__button" @click="goCouponCenter">
                  前往领券中心
                </button>
              </div>
            </div>

            <article
              v-for="(item, i) in goodsList"
              :key="item.id || i"
              class="my-coupon-card"
            >
              <div class="my-coupon-card__amount">
                <span class="my-coupon-card__currency">¥</span>
                <strong>{{ item.discount }}</strong>
              </div>

              <div class="my-coupon-card__body">
                <div class="my-coupon-card__copy">
                  <h3 class="my-coupon-card__title">{{ item.title }}</h3>
                  <p class="my-coupon-card__desc">满 {{ item.min }} 元可用</p>
                </div>

                <div class="my-coupon-card__footer">
                  <span class="my-coupon-card__hint">{{ statusHint(item.useStatus) }}</span>
                  <span :class="statusClass(item.useStatus)" class="my-coupon-card__status">
                    {{ statusText(item.useStatus) }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </van-list>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { orderCouponMy } from '@/api/order'

const router = useRouter()

const state = reactive({
  goodsList: [],
  isLoading: false,
  isFinished: false,
  pageSize: 10,
  pageNum: 1,
})

const { goodsList, isLoading, isFinished, pageSize, pageNum } = toRefs(state)

const availableCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 0).length
})

const usedCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 1).length
})

const expiredCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 2).length
})

const statusText = (status) => {
  if (Number(status) === 1) return '已使用'
  if (Number(status) === 2) return '已过期'
  return '未使用'
}

const statusHint = (status) => {
  if (Number(status) === 1) return '订单已使用该优惠'
  if (Number(status) === 2) return '当前不可使用'
  return '下单时自动抵扣'
}

const statusClass = (status) => {
  if (Number(status) === 1) {
    return 'my-coupon-card__status--used'
  }
  if (Number(status) === 2) {
    return 'my-coupon-card__status--expired'
  }
  return 'my-coupon-card__status--unused'
}

const getOrderCouponMyList = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const res = await orderCouponMy({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    })
    const records = res?.data?.records || []

    if (pageNum.value === 1) {
      goodsList.value = records
    } else {
      goodsList.value = [...goodsList.value, ...records]
    }

    isFinished.value = records.length < pageSize.value
  } catch (error) {
    showToast({
      type: 'fail',
      message: error?.message || '优惠券加载失败',
    })
    isFinished.value = true
  } finally {
    isLoading.value = false
  }
}

const onReachBottom = () => {
  pageNum.value += 1
  getOrderCouponMyList()
}

const goCouponCenter = () => {
  router.push('/order/coupon')
}

onMounted(() => {
  getOrderCouponMyList()
})
</script>

<style lang="scss" scoped>
.my-coupon-page__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 20px 24px 24px;
}

.my-coupon-hero {
  padding: 24px 22px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.my-coupon-hero__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.my-coupon-hero__main {
  min-width: 0;
  flex: 1;
}

.my-coupon-hero__eyebrow {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.my-coupon-hero__title {
  margin-top: 14px;
  font-size: 54px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.28px;
  color: #1d1d1f;
}

.my-coupon-hero__desc {
  margin-top: 14px;
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.58);
}

.my-coupon-hero__button {
  flex: none;
  min-width: 132px;
  height: 50px;
  padding: 0 20px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
}

.my-coupon-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.my-coupon-hero__stat {
  padding: 18px 16px;
  border-radius: 24px;
  background: #f5f5f7;
}

.my-coupon-hero__stat-label {
  display: block;
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.my-coupon-hero__stat-value {
  display: block;
  margin-top: 12px;
  font-size: 36px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-section {
  margin-top: 20px;
}

.my-coupon-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.my-coupon-section__title {
  font-size: 40px;
  line-height: 1.08;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-section__meta {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.my-coupon-section__list {
  padding-top: 16px;
}

.my-coupon-empty__panel {
  padding: 34px 24px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.my-coupon-empty__title {
  font-size: 38px;
  line-height: 1.12;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-empty__desc {
  margin-top: 14px;
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.56);
}

.my-coupon-empty__button {
  margin-top: 22px;
  min-width: 180px;
  height: 54px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 28px;
  line-height: 1;
  font-weight: 600;
}

.my-coupon-card {
  margin-top: 16px;
  padding: 22px 20px;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.my-coupon-card__amount {
  text-align: left;
  color: #0071e3;
  line-height: 1;
}

.my-coupon-card__currency {
  font-size: 28px;
  vertical-align: top;
}

.my-coupon-card__amount strong {
  font-size: 54px;
  font-weight: 600;
}

.my-coupon-card__body {
  min-width: 0;
}

.my-coupon-card__title {
  font-size: 32px;
  line-height: 1.24;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-card__desc {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.56);
}

.my-coupon-card__footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.my-coupon-card__hint {
  font-size: 26px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.46);
}

.my-coupon-card__status {
  min-width: 116px;
  height: 50px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 26px;
  line-height: 1;
  font-weight: 600;
}

.my-coupon-card__status--used,
.my-coupon-card__status--expired {
  background: rgba(29, 29, 31, 0.08);
  color: rgba(29, 29, 31, 0.56);
}

.my-coupon-card__status--unused {
  background: rgba(0, 113, 227, 0.08);
  color: #0071e3;
}

@media (max-width: 375px) {
  .my-coupon-page__body {
    padding: 16px 20px 24px;
  }

  .my-coupon-hero {
    padding: 22px 18px;
  }

  .my-coupon-hero__head,
  .my-coupon-section__head,
  .my-coupon-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .my-coupon-hero__stats {
    grid-template-columns: 1fr;
  }

  .my-coupon-card {
    grid-template-columns: 1fr;
  }
}
</style>
