<template>
  <div class="list-item">
    <h3 class="title">
      <van-icon name="shop-o" />
      <span class="title__name">商城自营</span>
    </h3>

    <div v-for="item in goodsList" :key="item.id" class="item">
      <image-pic width="80" height="80" fit="fill" :src="item.picUrl" />
      <div class="item__main">
        <p class="item__main__desc van-multi-ellipsis--l2">
          {{ item.goodsName }}
        </p>
        <p class="item__main__attr">
          <span
            v-for="(specification, index) in item.specifications || []"
            :key="index"
          >
            {{ specification }}
          </span>
        </p>
      </div>
      <div class="item__price">
        <span class="item__price__price">¥{{ yuan(item.price) }}</span>
        <span class="item__price__count">x{{ item.number }}</span>
      </div>
    </div>

    <van-cell-group>
      <van-cell title="商品金额">
        <span class="red">{{ yuan(goodsAmount) }} 元</span>
      </van-cell>
      <van-cell title="运费">
        <span class="red">{{ yuan(freightPrice) }} 元</span>
      </van-cell>
      <van-cell title="优惠券" is-link @click="openCouponPicker">
        <span v-if="selectedCoupon" class="red">-{{ yuan(selectedCoupon.discount) }} 元</span>
        <span v-else class="red">{{ couponColumns.length }} 张可用</span>
      </van-cell>
      <van-field
        v-model="message"
        maxlength="50"
        show-word-limit
        placeholder="请输入备注"
        label="订单备注"
      />
    </van-cell-group>

    <van-submit-bar
      :price="submitBarPrice"
      label="总计："
      button-text="提交订单"
      @submit="onSubmit"
    >
      <span v-if="selectedCoupon" class="tipsCoupon">
        已优惠 {{ yuan(selectedCoupon.discount) }} 元
      </span>
    </van-submit-bar>

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
import { computed, onActivated, reactive, toRefs } from 'vue'
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

const couponDiscount = computed(() => {
  return Number(selectedCoupon.value?.discount || 0)
})

const submitBarPrice = computed(() => {
  return Math.max(0, Math.round((Number(orderTotalAmount.value) || 0) * 100))
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
  resetCouponState()
  goodsList.value = []
  goodsAmount.value = 0
  freightPrice.value = 0
  orderTotalAmount.value = 0

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

onActivated(() => {
  if (!route.query.cartIds) {
    showToast({
      type: 'fail',
      message: '请先勾选商品再结算',
    })
    router.replace('/cart')
    return
  }

  message.value = ''
  loadGoodsList()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.list-item {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  padding: 24px;
  margin-top: 24px;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;

    .title__name {
      margin-left: 18px;
      font-size: $small;
      color: $black;
    }
  }

  .item {
    position: relative;
    margin-top: 34px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .item__main {
      box-sizing: border-box;
      flex-grow: 1;
      height: 160px;
      display: flex;
      flex-direction: column;
      padding: 0 24px;

      .item__main__desc {
        line-height: 30px;
        font-size: $mini;
        color: $black;
        text-align: justify;
      }

      .item__main__attr {
        margin-top: 12px;

        span {
          display: inline-block;
          background: #f7f7f7;
          border-radius: 6px;
          padding: 6px;
          font-size: $mini;
          color: $gray;
          margin-right: 6px;
        }
      }
    }

    .item__price {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .item__price__price {
        font-size: $mini;
        color: $black;
      }

      .item__price__count {
        font-size: $mini;
        color: $gray;
        margin-top: 12px;
      }
    }
  }
}

.tipsCoupon {
  margin-top: 5px;
}
</style>
