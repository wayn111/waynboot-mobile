<template>
  <div class="my-coupon-page wb-page wb-page--tabbed">
    <nav-bar title="我的优惠券" />

    <div class="my-coupon-page__body">
      <section class="my-coupon-page__summary">
        <div class="my-coupon-page__summary__item">
          <span>未使用</span>
          <strong>{{ availableCount }}</strong>
        </div>
        <div class="my-coupon-page__summary__item">
          <span>已使用</span>
          <strong>{{ usedCount }}</strong>
        </div>
        <div class="my-coupon-page__summary__item">
          <span>已过期</span>
          <strong>{{ expiredCount }}</strong>
        </div>
      </section>

      <div class="my-coupon-page__tabs">
        <button
          v-for="item in tabs"
          :key="item.key"
          type="button"
          class="my-coupon-page__tab"
          :class="{ 'my-coupon-page__tab--active': activeTab === item.key }"
          @click="activeTab = item.key"
        >
          {{ item.label }}
        </button>
      </div>

      <van-list
        v-model:loading="isLoading"
        :finished="isFinished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onReachBottom"
      >
        <div class="my-coupon-page__list">
          <article
            v-for="(item, i) in filteredList"
            :key="item.id || i"
            class="my-coupon-card"
            :class="couponCardClass(item.useStatus, i)"
          >
            <div class="my-coupon-card__edge" />

            <div class="my-coupon-card__amount">
              <span>¥</span>
              <strong>{{ item.discount }}</strong>
            </div>

            <div class="my-coupon-card__body">
              <div class="my-coupon-card__label">{{ statusText(item.useStatus) }}</div>
              <h3 class="my-coupon-card__title">{{ item.title || `满${item.min}减${item.discount}` }}</h3>
              <p class="my-coupon-card__desc">{{ statusHint(item.useStatus) }}</p>
            </div>

            <button
              type="button"
              class="my-coupon-card__button"
              :class="{ 'my-coupon-card__button--ghost': Number(item.useStatus) !== 0 }"
              @click="goCouponCenter"
            >
              {{ Number(item.useStatus) === 0 ? '去使用' : '领更多' }}
            </button>
          </article>

          <div v-if="!isLoading && filteredList.length <= 0" class="my-coupon-page__empty">
            还没有匹配的优惠券
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { orderCouponMy } from '@/api/order'
import NavBar from '@/components/NavBar'

const router = useRouter()

const state = reactive({
  goodsList: [],
  isLoading: false,
  isFinished: false,
  pageSize: 10,
  pageNum: 1,
  activeTab: 'unused',
  tabs: [
    { key: 'unused', label: '未使用' },
    { key: 'used', label: '已使用' },
    { key: 'expired', label: '已过期' },
  ],
})

const { goodsList, isLoading, isFinished, pageSize, pageNum, activeTab, tabs } = toRefs(state)

const availableCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 0).length
})

const usedCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 1).length
})

const expiredCount = computed(() => {
  return goodsList.value.filter((item) => Number(item.useStatus) === 2).length
})

const filteredList = computed(() => {
  if (activeTab.value === 'used') {
    return goodsList.value.filter((item) => Number(item.useStatus) === 1)
  }

  if (activeTab.value === 'expired') {
    return goodsList.value.filter((item) => Number(item.useStatus) === 2)
  }

  return goodsList.value.filter((item) => Number(item.useStatus) === 0)
})

const statusText = (status) => {
  if (Number(status) === 1) return '已使用'
  if (Number(status) === 2) return '已过期'
  return '未使用'
}

const statusHint = (status) => {
  if (Number(status) === 1) return '订单已使用该优惠券'
  if (Number(status) === 2) return '当前不可使用，可前往领券中心领取新券'
  return '下单时自动抵扣'
}

const couponCardClass = (status, index) => {
  if (Number(status) === 1) {
    return 'my-coupon-card--purple'
  }

  if (Number(status) === 2) {
    return 'my-coupon-card--gray'
  }

  return index % 2 === 0 ? 'my-coupon-card--orange' : 'my-coupon-card--green'
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
  padding: 0 24px 24px;
}

.my-coupon-page__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.my-coupon-page__summary__item {
  padding: 22px 18px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  text-align: center;
}

.my-coupon-page__summary__item span {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.48);
}

.my-coupon-page__summary__item strong {
  display: block;
  margin-top: 12px;
  font-size: 52px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-page__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
  padding: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}

.my-coupon-page__tab {
  height: 54px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: rgba(29, 29, 31, 0.56);
  font-size: 30px;
  font-weight: 600;
}

.my-coupon-page__tab--active {
  background: #ffffff;
  color: #1677ff;
  box-shadow: inset 0 -4px 0 #1677ff;
}

.my-coupon-page__list {
  padding-top: 18px;
}

.my-coupon-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px 24px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.my-coupon-card + .my-coupon-card {
  margin-top: 16px;
}

.my-coupon-card__edge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  border-radius: 10px;
}

.my-coupon-card--orange .my-coupon-card__edge {
  background: linear-gradient(180deg, #ffb15f 0%, #ff7f32 100%);
}

.my-coupon-card--green .my-coupon-card__edge {
  background: linear-gradient(180deg, #80d8a4 0%, #4caf72 100%);
}

.my-coupon-card--purple .my-coupon-card__edge {
  background: linear-gradient(180deg, #b5a5ff 0%, #8a63ff 100%);
}

.my-coupon-card--gray .my-coupon-card__edge {
  background: linear-gradient(180deg, #dddddd 0%, #bdbdbd 100%);
}

.my-coupon-card__amount {
  color: #1d1d1f;
  line-height: 1;
}

.my-coupon-card__amount span {
  font-size: 34px;
  vertical-align: top;
}

.my-coupon-card__amount strong {
  font-size: 86px;
  font-weight: 600;
}

.my-coupon-card__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 88px;
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f5f5f7;
  font-size: 24px;
  font-weight: 600;
  color: rgba(29, 29, 31, 0.58);
}

.my-coupon-card__title {
  margin-top: 14px;
  font-size: 44px;
  line-height: 1.12;
  font-weight: 600;
  color: #1d1d1f;
}

.my-coupon-card__desc {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.35;
  color: rgba(29, 29, 31, 0.52);
}

.my-coupon-card__button {
  min-width: 156px;
  height: 56px;
  padding: 0 22px;
  border: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 30px;
  font-weight: 600;
}

.my-coupon-card__button--ghost {
  background: rgba(22, 119, 255, 0.08);
  color: #1677ff;
}

.my-coupon-page__empty {
  padding: 42px 24px;
  text-align: center;
  border-radius: 30px;
  background: #ffffff;
  color: rgba(29, 29, 31, 0.5);
  font-size: 30px;
}

@media (max-width: 375px) {
  .my-coupon-page__body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .my-coupon-page__summary,
  .my-coupon-card {
    grid-template-columns: 1fr;
  }
}
</style>
