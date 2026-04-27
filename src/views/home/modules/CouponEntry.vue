<template>
  <section class="coupon-entry">
    <div class="coupon-entry__head">
      <h2 class="coupon-entry__title">优惠券</h2>
      <button type="button" class="coupon-entry__link" @click="goCouponCenter">
        全部
        <van-icon name="arrow" />
      </button>
    </div>

    <article class="coupon-entry__card" @click="goCouponCenter">
      <div class="coupon-entry__value">
        <span class="coupon-entry__currency">¥</span>
        <strong>{{ featuredCoupon.discount || 1 }}</strong>
      </div>

      <div class="coupon-entry__content">
        <span class="coupon-entry__badge">今日可用</span>
        <h3 class="coupon-entry__name">{{ couponTitle }}</h3>
        <p class="coupon-entry__desc">{{ couponDesc }}</p>
      </div>

      <button type="button" class="coupon-entry__button" @click.stop="receiveCoupon">
        立即领取
      </button>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  couponList: {
    type: Array,
    default: () => [],
  },
})

const featuredCoupon = computed(() => {
  return props.couponList[0] || {
    discount: 1,
    min: 10,
  }
})

const couponTitle = computed(() => {
  if (featuredCoupon.value?.title) {
    return featuredCoupon.value.title
  }

  return `满${featuredCoupon.value.min || 10}减${featuredCoupon.value.discount || 1}`
})

const couponDesc = computed(() => {
  return featuredCoupon.value?.description || '全场通用'
})

const goCouponCenter = () => {
  router.push('/order/coupon')
}

const receiveCoupon = () => {
  goCouponCenter()
}
</script>

<style lang="scss" scoped>
.coupon-entry {
  padding: 20px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.05);
}

.coupon-entry__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.coupon-entry__title {
  font-size: 34px;
  line-height: 1.08;
  font-weight: 600;
  color: #1d1d1f;
}

.coupon-entry__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: rgba(29, 29, 31, 0.42);
  font-size: 26px;
  font-weight: 500;
}

.coupon-entry__card {
  position: relative;
  min-height: 140px;
  padding: 24px 22px;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  border: 1px solid rgba(22, 119, 255, 0.18);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(244, 248, 255, 0.82) 0%, #ffffff 100%);
}

.coupon-entry__card::before,
.coupon-entry__card::after {
  position: absolute;
  top: 50%;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--wb-surface-page);
  transform: translateY(-50%);
  content: '';
}

.coupon-entry__card::before {
  left: -13px;
}

.coupon-entry__card::after {
  right: -13px;
}

.coupon-entry__value {
  line-height: 1;
  color: #1677ff;
}

.coupon-entry__currency {
  font-size: 30px;
  vertical-align: top;
}

.coupon-entry__value strong {
  font-size: 88px;
  font-weight: 600;
}

.coupon-entry__content {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 26px;
}

.coupon-entry__content::before {
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: 0;
  border-left: 2px dashed rgba(22, 119, 255, 0.18);
  content: '';
}

.coupon-entry__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 98px;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(22, 119, 255, 0.08);
  color: #1677ff;
  font-size: 22px;
  font-weight: 600;
}

.coupon-entry__name {
  font-size: 30px;
  line-height: 1.16;
  font-weight: 600;
  color: #1d1d1f;
}

.coupon-entry__desc {
  font-size: 24px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.44);
}

.coupon-entry__button {
  min-width: 148px;
  height: 54px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: #1677ff;
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
}

@media (max-width: 375px) {
  .coupon-entry__card {
    grid-template-columns: 98px minmax(0, 1fr);
  }

  .coupon-entry__button {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>
