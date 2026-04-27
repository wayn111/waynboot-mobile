<template>
  <div class="coupon-page wb-page wb-page--tabbed">
    <nav-bar :title="$route.meta.title">
      <button type="button" class="coupon-page__more">
        <van-icon name="ellipsis" />
      </button>
    </nav-bar>

    <div class="coupon-page__body">
      <section class="coupon-page__summary">
        <div class="coupon-page__summary__copy">
          <p class="coupon-page__summary__title">可用优惠券 <strong>{{ availableCount }}</strong> 张</p>
          <button type="button" class="coupon-page__summary__link" @click="selectTab('available')">
            今日可领取 {{ availableCount }} 张
            <van-icon name="arrow" />
          </button>
        </div>
        <div class="coupon-page__summary__art">
          <div class="coupon-page__summary__ticket coupon-page__summary__ticket--back" />
          <div class="coupon-page__summary__ticket coupon-page__summary__ticket--front">
            <span>%</span>
          </div>
        </div>
      </section>

      <section class="coupon-page__hero">
        <div class="coupon-page__hero__amount">
          <span>¥</span>
          <strong>{{ featuredCoupon.discount || 0 }}</strong>
          <small>有效期至 {{ featuredCouponLimit }}</small>
        </div>

        <div class="coupon-page__hero__content">
          <h2>{{ featuredTitle }}</h2>
          <p>{{ featuredDesc }}</p>
        </div>

        <button
          type="button"
          class="coupon-page__hero__button"
          @click="handleCouponAction(featuredCoupon)"
        >
          {{ featuredCoupon.receiveStatus ? '去使用' : '立即领取' }}
        </button>
      </section>

      <div class="coupon-page__tabs">
        <button
          v-for="item in tabs"
          :key="item.key"
          type="button"
          class="coupon-page__tab"
          :class="{ 'coupon-page__tab--active': activeTab === item.key }"
          @click="selectTab(item.key)"
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
        <div class="coupon-page__list">
          <article
            v-for="(item, index) in filteredCoupons"
            :key="item.id || index"
            class="coupon-card"
            :class="couponCardClass(item, index)"
          >
            <div class="coupon-card__edge" />

            <div class="coupon-card__amount">
              <span v-if="isDiscountCoupon(item)" class="coupon-card__currency">¥</span>
              <strong>{{ couponAmount(item) }}</strong>
            </div>

            <div class="coupon-card__body">
              <div class="coupon-card__label">{{ couponLabel(item, index) }}</div>
              <h3 class="coupon-card__title">{{ item.title || defaultTitle(item) }}</h3>
              <p class="coupon-card__desc">{{ item.min ? `满${item.min}减${item.discount}` : '指定商品可用' }}</p>
            </div>

            <button
              type="button"
              class="coupon-card__button"
              :class="{ 'coupon-card__button--ghost': item.receiveStatus }"
              @click="handleCouponAction(item)"
            >
              {{ item.receiveStatus ? '去使用' : '立即领取' }}
            </button>
          </article>

          <div v-if="!isLoading && filteredCoupons.length <= 0" class="coupon-page__empty">
            当前没有匹配的优惠券
          </div>
        </div>
      </van-list>

      <button type="button" class="coupon-page__rule">
        <van-icon name="description" />
        <span>优惠券使用规则</span>
        <van-icon name="arrow" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showDialog, showToast } from 'vant'

import { orderCoupon, orderReceive } from '@/api/order'
import { getToken } from '@/utils/auth'
import NavBar from '@/components/NavBar'

const router = useRouter()
const store = useStore()

const state = reactive({
  goodsList: [],
  isLoading: false,
  isFinished: false,
  pageSize: 10,
  pageNum: 1,
  activeTab: 'available',
  tabs: [
    { key: 'available', label: '可领取' },
    { key: 'claimed', label: '已领取' },
    { key: 'expiring', label: '即将过期' },
  ],
})

const { goodsList, isLoading, isFinished, pageSize, pageNum, activeTab, tabs } = toRefs(state)

const availableCoupons = computed(() => {
  return goodsList.value.filter((item) => !item.receiveStatus)
})

const claimedCoupons = computed(() => {
  return goodsList.value.filter((item) => item.receiveStatus)
})

const expiringCoupons = computed(() => {
  return goodsList.value.filter((item) => {
    if (!item.receiveStatus) {
      return false
    }

    const target = item.endTime || item.expireTime || item.expireAt || item.validTime || ''
    const time = new Date(target).getTime()
    if (!time) {
      return false
    }

    const diff = time - Date.now()
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000
  })
})

const filteredCoupons = computed(() => {
  if (activeTab.value === 'claimed') {
    return claimedCoupons.value
  }

  if (activeTab.value === 'expiring') {
    return expiringCoupons.value
  }

  return availableCoupons.value
})

const availableCount = computed(() => {
  return availableCoupons.value.length
})

const featuredCoupon = computed(() => {
  return availableCoupons.value[0] || claimedCoupons.value[0] || goodsList.value[0] || {}
})

const featuredTitle = computed(() => {
  if (featuredCoupon.value.title) {
    return featuredCoupon.value.title
  }
  return featuredCoupon.value.min
    ? `满${featuredCoupon.value.min}减${featuredCoupon.value.discount}`
    : '专属优惠券'
})

const featuredDesc = computed(() => {
  if (featuredCoupon.value.min) {
    return `家居 / 床品 / 夏凉专区`
  }
  return '指定商品可用'
})

const featuredCouponLimit = computed(() => {
  const target =
    featuredCoupon.value.endTime ||
    featuredCoupon.value.expireTime ||
    featuredCoupon.value.expireAt

  if (!target) {
    return '06.30'
  }

  const date = new Date(target)
  if (Number.isNaN(date.getTime())) {
    return '06.30'
  }

  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
})

const getOrderCouponList = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const res = await orderCoupon({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
    })
    const { records = [] } = res.data || {}

    if (pageNum.value === 1) {
      goodsList.value = records
      if (records.some((item) => !item.receiveStatus)) {
        activeTab.value = 'available'
      } else if (records.some((item) => item.receiveStatus)) {
        activeTab.value = 'claimed'
      }
    } else {
      goodsList.value = [...goodsList.value, ...records]
    }

    isFinished.value = records.length < pageSize.value
  } catch (error) {
    showToast({ type: 'fail', message: error?.message || '优惠券加载失败' })
    isFinished.value = true
  } finally {
    isLoading.value = false
  }
}

const onReachBottom = () => {
  pageNum.value += 1
  getOrderCouponList()
}

const selectTab = (tab) => {
  activeTab.value = tab
}

const isDiscountCoupon = (item) => {
  return Number(item.discount || 0) > 0
}

const couponAmount = (item) => {
  if (!isDiscountCoupon(item)) {
    return '9折券'
  }

  return item.discount
}

const defaultTitle = (item) => {
  return item.min ? `满${item.min}减${item.discount}` : '精选商品可用'
}

const couponLabel = (item, index) => {
  if (item.receiveStatus) {
    return '已领取'
  }

  if (index === 0) {
    return '热门'
  }

  if (index === 1) {
    return '新人'
  }

  return '限时'
}

const couponCardClass = (item, index) => {
  if (item.receiveStatus) {
    return 'coupon-card--purple'
  }

  if (index % 3 === 0) {
    return 'coupon-card--orange'
  }

  if (index % 3 === 1) {
    return 'coupon-card--green'
  }

  return 'coupon-card--purple'
}

const onSubmit = async (id) => {
  if (!id) {
    return
  }

  const hasToken = getToken()
  if (!hasToken) {
    showDialog({
      title: '提示',
      message: '您还未登录，请先登录',
    }).then(() => {
      store.dispatch('user/resetToken').then(() => {
        router.push({ name: 'Login' })
      })
    })
    return
  }

  try {
    const res = await orderReceive({ couponId: id })
    if (res.code === 200) {
      pageNum.value = 1
      isFinished.value = false
      getOrderCouponList()
      showToast({ type: 'success', message: '领取成功' })
      return
    }
    showToast({ type: 'fail', message: res.msg })
  } catch (error) {
    showToast({ type: 'fail', message: error?.message || '领取失败' })
  }
}

const handleCouponAction = (item) => {
  if (item.receiveStatus) {
    router.push('/order/my')
    return
  }

  onSubmit(item.id)
}

onMounted(() => {
  getOrderCouponList()
})
</script>

<style lang="scss" scoped>
.coupon-page__more {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  appearance: none;
  background: transparent;
}

.coupon-page__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
}

.coupon-page__summary {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 218px;
  padding: 34px 34px 30px;
  border-radius: 36px;
  background: linear-gradient(135deg, #f7faff 0%, #edf4ff 56%, #e7f0ff 100%);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
}

.coupon-page__summary::before {
  position: absolute;
  inset: auto -36px -56px auto;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.12) 0%, rgba(22, 119, 255, 0) 72%);
  content: '';
}

.coupon-page__summary__title {
  font-size: 36px;
  line-height: 1.2;
  color: #1d1d1f;
}

.coupon-page__summary__title strong {
  margin: 0 6px;
  font-size: 88px;
  color: #1677ff;
  font-weight: 600;
}

.coupon-page__summary__link {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  appearance: none;
  background: transparent;
  color: rgba(29, 29, 31, 0.56);
  font-size: 28px;
}

.coupon-page__summary__art {
  position: relative;
  width: 268px;
  height: 160px;
  flex: none;
}

.coupon-page__summary__ticket {
  position: absolute;
  width: 168px;
  height: 120px;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.72);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(229, 239, 255, 0.58) 100%);
  box-shadow: 0 20px 36px rgba(22, 119, 255, 0.12);
}

.coupon-page__summary__ticket span {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  font-weight: 600;
  color: rgba(22, 119, 255, 0.36);
}

.coupon-page__summary__ticket::before {
  position: absolute;
  top: 50%;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eef4ff;
  transform: translateY(-50%);
  content: '';
}

.coupon-page__summary__ticket--back {
  top: 4px;
  right: 8px;
  opacity: 0.54;
}

.coupon-page__summary__ticket--front {
  right: 48px;
  bottom: 0;
}

.coupon-page__hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 182px minmax(0, 1fr) 180px;
  gap: 24px;
  align-items: center;
  margin-top: 18px;
  padding: 32px 30px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
  border: 2px solid rgba(22, 119, 255, 0.14);
}

.coupon-page__hero::before,
.coupon-page__hero::after {
  position: absolute;
  top: 50%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--wb-surface-page);
  transform: translateY(-50%);
  content: '';
}

.coupon-page__hero::before {
  left: -14px;
}

.coupon-page__hero::after {
  right: -14px;
}

.coupon-page__hero__amount {
  position: relative;
  padding-right: 20px;
  line-height: 1;
  color: #1677ff;
}

.coupon-page__hero__amount::after {
  position: absolute;
  top: 8px;
  right: 0;
  bottom: 8px;
  border-right: 2px dashed rgba(22, 119, 255, 0.18);
  content: '';
}

.coupon-page__hero__amount span {
  font-size: 36px;
  vertical-align: top;
}

.coupon-page__hero__amount strong {
  font-size: 104px;
  font-weight: 600;
}

.coupon-page__hero__amount small {
  display: block;
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.coupon-page__hero__content h2 {
  font-size: 52px;
  line-height: 1.08;
  font-weight: 600;
  color: #1d1d1f;
}

.coupon-page__hero__content p {
  margin-top: 10px;
  font-size: 30px;
  line-height: 1.4;
  color: rgba(29, 29, 31, 0.5);
}

.coupon-page__hero__button {
  min-width: 180px;
  height: 66px;
  padding: 0 24px;
  border: none;
  appearance: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 30px;
  font-weight: 600;
  box-shadow: 0 16px 30px rgba(22, 119, 255, 0.22);
}

.coupon-page__tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
  padding: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.05);
}

.coupon-page__tab {
  height: 60px;
  border: none;
  appearance: none;
  border-radius: 999px;
  background: transparent;
  color: rgba(29, 29, 31, 0.56);
  font-size: 30px;
  font-weight: 600;
}

.coupon-page__tab--active {
  background: #ffffff;
  color: #1677ff;
  box-shadow:
    inset 0 -4px 0 #1677ff,
    0 10px 18px rgba(15, 23, 42, 0.04);
}

.coupon-page__list {
  padding-top: 18px;
}

.coupon-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 154px minmax(0, 1fr) 170px;
  gap: 20px;
  align-items: center;
  min-height: 178px;
  padding: 24px 26px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
}

.coupon-card + .coupon-card {
  margin-top: 16px;
}

.coupon-card::before,
.coupon-card::after {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--wb-surface-page);
  transform: translateY(-50%);
  content: '';
}

.coupon-card::before {
  left: -9px;
}

.coupon-card::after {
  right: -9px;
}

.coupon-card__edge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  border-radius: 8px;
}

.coupon-card--orange .coupon-card__edge {
  background: linear-gradient(180deg, #ffb15f 0%, #ff7f32 100%);
  box-shadow: 0 0 0 1px rgba(255, 122, 26, 0.06);
}

.coupon-card--green .coupon-card__edge {
  background: linear-gradient(180deg, #80d8a4 0%, #4caf72 100%);
  box-shadow: 0 0 0 1px rgba(71, 165, 106, 0.06);
}

.coupon-card--purple .coupon-card__edge {
  background: linear-gradient(180deg, #b5a5ff 0%, #8a63ff 100%);
  box-shadow: 0 0 0 1px rgba(138, 99, 255, 0.06);
}

.coupon-card--orange {
  background: linear-gradient(90deg, rgba(255, 246, 238, 0.98) 0%, #ffffff 56%);
}

.coupon-card--green {
  background: linear-gradient(90deg, rgba(240, 250, 244, 0.98) 0%, #ffffff 56%);
}

.coupon-card--purple {
  background: linear-gradient(90deg, rgba(245, 240, 255, 0.98) 0%, #ffffff 56%);
}

.coupon-card__amount {
  position: relative;
  color: #1d1d1f;
  line-height: 1;
}

.coupon-card__amount::after {
  position: absolute;
  top: -6px;
  right: -16px;
  bottom: -6px;
  border-right: 2px dashed rgba(22, 119, 255, 0.14);
  content: '';
}

.coupon-card--orange .coupon-card__amount {
  color: #ff7a1a;
}

.coupon-card--green .coupon-card__amount {
  color: #47a56a;
}

.coupon-card--purple .coupon-card__amount {
  color: #7f57ff;
}

.coupon-card__currency {
  font-size: 34px;
  vertical-align: top;
}

.coupon-card__amount strong {
  font-size: 88px;
  font-weight: 600;
}

.coupon-card__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 88px;
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 24px;
  font-weight: 600;
}

.coupon-card--orange .coupon-card__label {
  color: #ff7a1a;
}

.coupon-card--green .coupon-card__label {
  color: #47a56a;
}

.coupon-card--purple .coupon-card__label {
  color: #7f57ff;
}

.coupon-card__title {
  margin-top: 16px;
  font-size: 46px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.coupon-card__desc {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.35;
  color: rgba(29, 29, 31, 0.52);
}

.coupon-card__button {
  min-width: 170px;
  height: 60px;
  padding: 0 22px;
  border: none;
  appearance: none;
  border-radius: 999px;
  font-size: 30px;
  font-weight: 600;
  color: #ffffff;
}

.coupon-card--orange .coupon-card__button {
  background: #ff7a1a;
}

.coupon-card--green .coupon-card__button {
  background: #47a56a;
}

.coupon-card--purple .coupon-card__button {
  background: #8a63ff;
}

.coupon-card__button--ghost {
  background: rgba(138, 99, 255, 0.12) !important;
  color: #8a63ff;
  box-shadow: inset 0 0 0 1px rgba(138, 99, 255, 0.18);
}

.coupon-page__empty {
  padding: 42px 24px;
  text-align: center;
  border-radius: 30px;
  background: #ffffff;
  color: rgba(29, 29, 31, 0.5);
  font-size: 30px;
}

.coupon-page__rule {
  width: 100%;
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  appearance: none;
  background: transparent;
  color: rgba(29, 29, 31, 0.56);
  font-size: 28px;
}

@media (max-width: 375px) {
  .coupon-page__body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .coupon-page__summary,
  .coupon-page__hero,
  .coupon-card {
    grid-template-columns: 1fr;
  }

  .coupon-page__summary__art {
    width: 100%;
  }
}
</style>
