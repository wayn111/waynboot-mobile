<template>
  <div class="confirm">
    <section class="confirm-panel">
      <div class="confirm-panel__head">
        <h2 class="confirm-panel__title">商品清单</h2>
        <span class="confirm-panel__meta">{{ goodsCount }} 件</span>
      </div>

      <article v-for="item in goodsList" :key="item.id" class="confirm-goods">
        <div class="confirm-goods__media">
          <image-pic width="104" height="104" fit="cover" :src="item.picUrl" />
        </div>

        <div class="confirm-goods__main">
          <h3 class="confirm-goods__title">{{ item.goodsName }}</h3>

          <div class="confirm-goods__specs">
            <span
              v-for="(specification, index) in item.specifications || []"
              :key="index"
              class="confirm-goods__spec"
            >
              {{ specification }}
            </span>
          </div>

          <div class="confirm-goods__footer">
            <div class="confirm-goods__price-wrap">
              <span class="confirm-goods__price-label">单价</span>
              <span class="confirm-goods__price">¥{{ yuan(item.price) }}</span>
            </div>

            <div class="confirm-goods__summary">
              <span class="confirm-goods__count">x{{ item.number }}</span>
              <span class="confirm-goods__subtotal">
                小计 ¥{{ yuan(Number(item.price || 0) * Number(item.number || 0)) }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="confirm-panel">
      <div class="confirm-panel__head">
        <h2 class="confirm-panel__title">金额与优惠</h2>
      </div>

      <div class="confirm-row">
        <span class="confirm-row__label">商品金额</span>
        <span class="confirm-row__value">¥{{ yuan(goodsAmount) }}</span>
      </div>

      <div class="confirm-row">
        <span class="confirm-row__label">运费</span>
        <span class="confirm-row__value">¥{{ yuan(freightPrice) }}</span>
      </div>

      <button type="button" class="confirm-row confirm-row--action" @click="openCouponPicker">
        <span class="confirm-row__label">优惠券</span>
        <span class="confirm-row__value confirm-row__value--link">
          {{ selectedCoupon ? `-¥${yuan(selectedCoupon.discount)}` : couponSummary }}
        </span>
      </button>
    </section>

    <section class="confirm-panel">
      <div class="confirm-panel__head">
        <h2 class="confirm-panel__title">订单备注</h2>
        <span class="confirm-panel__meta">选填</span>
      </div>

      <div class="confirm-remark">
        <van-field
          v-model="message"
          maxlength="50"
          show-word-limit
          placeholder="补充送货要求或发票信息"
        />
      </div>
    </section>

    <div class="confirm-submit">
      <div class="confirm-submit__summary">
        <span class="confirm-submit__label">总计金额</span>
        <strong class="confirm-submit__amount">¥{{ yuan(orderTotalAmount) }}</strong>
        <span v-if="selectedCoupon" class="confirm-submit__tip">
          已优惠 ¥{{ yuan(selectedCoupon.discount) }}
        </span>
      </div>

      <button type="button" class="confirm-submit__button" @click="onSubmit">
        提交订单
      </button>
    </div>

    <div class="confirm-submit-placeholder" />

    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="couponColumns"
        @cancel="showPicker = false"
        @confirm="onConfirmCoupon"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onActivated, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { closeToast, showLoadingToast, showToast } from 'vant'

import { getCheckedGoods } from '@/api/cart'
import { searchResult, submit } from '@/api/order'
import { yuan } from '@/filter'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  selectedAddress: {
    type: Object,
    default: () => ({}),
  },
})

const state = reactive({
  message: '',
  goodsAmount: 0,
  orderTotalAmount: 0,
  goodsList: [],
  orderSn: '',
  actualPrice: 0,
  freightPrice: 0,
  retryCount: 6,
  retryInterval: 600,
  showPicker: false,
  couponColumns: [],
  couponSourceList: [],
  selectedCoupon: null,
  loadingGoods: false,
})

const {
  message,
  goodsAmount,
  orderTotalAmount,
  goodsList,
  orderSn,
  actualPrice,
  freightPrice,
  retryCount,
  retryInterval,
  showPicker,
  couponColumns,
  couponSourceList,
  selectedCoupon,
  loadingGoods,
} = toRefs(state)

const selectedCartIds = computed(() => {
  const cartIds = route.query.cartIds
  if (!cartIds || typeof cartIds !== 'string') {
    return []
  }

  return cartIds
    .split(',')
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id))
})

const goodsCount = computed(() => {
  return goodsList.value.reduce((total, item) => total + Number(item.number || 0), 0)
})

const couponDiscount = computed(() => {
  return Number(selectedCoupon.value?.discount || 0)
})

const couponSummary = computed(() => {
  return couponColumns.value.length > 0 ? `${couponColumns.value.length} 张可用` : '无可用'
})

const selectedCartKey = computed(() => {
  return selectedCartIds.value.join(',')
})

const recalculateAmount = () => {
  const total =
    Number(goodsAmount.value || 0) +
    Number(freightPrice.value || 0) -
    couponDiscount.value

  orderTotalAmount.value = Math.max(0, total)
}

const resetCouponState = () => {
  selectedCoupon.value = null
  couponSourceList.value = []
  couponColumns.value = []
}

const openCouponPicker = () => {
  if (couponColumns.value.length <= 0) {
    return
  }
  showPicker.value = true
}

const loadGoodsList = async () => {
  if (loadingGoods.value) {
    return
  }

  loadingGoods.value = true
  resetCouponState()
  goodsList.value = []
  goodsAmount.value = 0
  freightPrice.value = 0
  orderTotalAmount.value = 0

  try {
    const res = await getCheckedGoods()
    const {
      data,
      freightPrice: apiFreightPrice,
      couponList: apiCouponList,
    } = res.data

    const filteredGoodsList =
      selectedCartIds.value.length > 0
        ? (data || []).filter((item) =>
            selectedCartIds.value.includes(Number(item.id))
          )
        : data || []

    goodsList.value = filteredGoodsList
    goodsAmount.value = filteredGoodsList.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.number || 0)
    }, 0)
    freightPrice.value = Number(apiFreightPrice || 0)
    couponSourceList.value = apiCouponList || []
    couponColumns.value = couponSourceList.value.map((item, index) => ({
      text: `减 ${yuan(item.discount)} 元 ${item.title || ''}`.trim(),
      value: index,
    }))
    recalculateAmount()
  } catch (error) {
    showToast({
      type: 'fail',
      message: error?.message || '订单商品加载失败',
    })
    router.replace('/cart')
  } finally {
    loadingGoods.value = false
  }
}

const pollOrderResult = async () => {
  try {
    await searchResult(orderSn.value)
    closeToast()
    router.push({
      name: 'OrderPay',
      query: {
        orderSn: orderSn.value,
        actualPrice: actualPrice.value,
      },
    })
  } catch (error) {
    retryCount.value -= 1
    if (retryCount.value <= 0) {
      closeToast()
      showToast({
        type: 'fail',
        message: error?.message || '下单失败，请稍后重试',
      })
      return
    }

    setTimeout(() => {
      pollOrderResult()
    }, retryInterval.value)
  }
}

const onSubmit = async () => {
  const addressId = props.selectedAddress?.id
  if (!addressId) {
    showToast({
      type: 'fail',
      message: '请选择地址',
    })
    return
  }

  const cartIdArr = goodsList.value.map((item) => item.id)
  if (cartIdArr.length <= 0) {
    showToast({
      type: 'fail',
      message: '请至少选择一件商品',
    })
    return
  }

  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '下单中，请稍后...',
  })

  retryCount.value = 6

  try {
    const res = await submit({
      cartIdArr,
      addressId,
      message: message.value,
      userCouponId: selectedCoupon.value?.id,
    })

    orderSn.value = res.data.orderSn
    actualPrice.value = res.data.actualPrice

    setTimeout(() => {
      pollOrderResult()
    }, retryInterval.value)
  } catch (error) {
    closeToast()
    showToast({
      type: 'fail',
      message: error?.message || '下单失败，请稍后重试',
    })
  }
}

const onConfirmCoupon = ({ selectedOptions = [] }) => {
  showPicker.value = false
  const currentOption = selectedOptions[0]

  if (!currentOption) {
    selectedCoupon.value = null
    recalculateAmount()
    return
  }

  selectedCoupon.value = couponSourceList.value[currentOption.value] || null
  recalculateAmount()
}

const validateCartSelection = () => {
  if (!selectedCartKey.value) {
    showToast({
      type: 'fail',
      message: '请先勾选商品再结算',
    })
    router.replace('/cart')
    return false
  }

  return true
}

const initializeConfirmGoods = () => {
  if (!validateCartSelection()) {
    return
  }

  message.value = ''
  loadGoodsList()
}

watch(
  selectedCartKey,
  (nextCartKey, previousCartKey) => {
    if (!nextCartKey) {
      validateCartSelection()
      return
    }

    if (nextCartKey !== previousCartKey) {
      initializeConfirmGoods()
    }
  },
  {
    immediate: true,
  }
)

onActivated(() => {
  if (!selectedCartKey.value || goodsList.value.length > 0 || loadingGoods.value) {
    return
  }

  initializeConfirmGoods()
})
</script>

<style lang="scss" scoped>
.confirm {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.confirm-panel {
  padding: 24px 22px;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.confirm-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.confirm-panel__title {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.confirm-panel__meta {
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.42);
}

.confirm-goods {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 16px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 24px;
  background: #f5f5f7;
}

.confirm-goods__media {
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
}

.confirm-goods__main {
  min-width: 0;
}

.confirm-goods__title {
  font-size: 28px;
  line-height: 1.3;
  font-weight: 600;
  color: #1d1d1f;
}

.confirm-goods__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.confirm-goods__spec {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 113, 227, 0.08);
  color: #0071e3;
  font-size: 22px;
  line-height: 1.2;
}

.confirm-goods__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-top: 14px;
}

.confirm-goods__price-wrap,
.confirm-goods__summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.confirm-goods__summary {
  align-items: flex-end;
  text-align: right;
}

.confirm-goods__price-label,
.confirm-goods__count {
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.44);
}

.confirm-goods__price {
  font-size: 32px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.confirm-goods__subtotal {
  font-size: 26px;
  line-height: 1.2;
  font-weight: 600;
  color: #1d1d1f;
}

.confirm-row {
  width: 100%;
  padding: 18px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: none;
  background: transparent;
}

.confirm-row + .confirm-row {
  border-top: 1px solid rgba(29, 29, 31, 0.06);
}

.confirm-row__label,
.confirm-row__value {
  font-size: 28px;
  line-height: 1.3;
}

.confirm-row__label {
  color: rgba(29, 29, 31, 0.6);
}

.confirm-row__value {
  font-weight: 600;
  color: #1d1d1f;
  text-align: right;
}

.confirm-row__value--link {
  color: #0066cc;
}

.confirm-remark {
  margin-top: 16px;
}

.confirm-submit {
  position: fixed;
  left: 24px;
  right: 24px;
  bottom: 24px;
  z-index: 5;
  padding: 18px 18px calc(18px + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
}

.confirm-submit__summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-submit__label {
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.confirm-submit__amount {
  font-size: 40px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.confirm-submit__tip {
  font-size: 24px;
  line-height: 1.2;
  color: #0071e3;
}

.confirm-submit__button {
  flex: none;
  min-width: 200px;
  height: 88px;
  padding: 0 32px;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
  box-shadow: 0 10px 24px rgba(0, 113, 227, 0.28);
  cursor: pointer;
}

.confirm-submit-placeholder {
  width: 100%;
  height: 126px;
}

:deep(.van-field) {
  padding: 0;
  background: transparent;
}

:deep(.van-field__body) {
  min-height: 52px;
  padding: 14px 16px;
  border-radius: 20px;
  background: #f5f5f7;
}

:deep(.van-field__control),
:deep(.van-field__word-num),
:deep(.van-field__word-limit) {
  font-size: 28px;
  line-height: 1.45;
}

@media (max-width: 375px) {
  .confirm-panel {
    padding: 20px 18px;
  }

  .confirm-goods {
    grid-template-columns: 92px minmax(0, 1fr);
    padding: 16px;
  }

  .confirm-submit {
    left: 20px;
    right: 20px;
  }
}
</style>
