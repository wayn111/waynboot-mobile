<template>
  <div class="goods-sku">
    <van-popup
      v-model:show="isShow"
      position="bottom"
      round
      closeable
      @closed="onClosed"
    >
      <div class="sku-container">
        <div class="sku-header">
          <van-image class="sku-header__img" :src="goods.picture" />
          <div class="sku-header__info">
            <div class="sku-header__price">
              <span class="currency">¥</span>
              <span class="price">{{ displayPrice }}</span>
            </div>
            <div class="sku-header__stock">剩余 {{ skuData.stock_num || 0 }} 件</div>
            <div class="sku-header__selected" v-if="selectedNames.length > 0">
              已选：<span v-for="name in selectedNames" :key="name">{{ name }} </span>
            </div>
            <div v-else class="sku-header__selected">请选择商品规格</div>
          </div>
        </div>

        <div class="sku-body">
          <div v-for="spec in skuData.tree || []" :key="spec.k_s" class="sku-group">
            <div class="sku-group__title">{{ spec.k }}</div>
            <div class="sku-group__items">
              <span
                v-for="item in spec.v || []"
                :key="item.id"
                class="sku-item"
                :class="{ 'sku-item--active': selectedValues[spec.k_s]?.id === item.id }"
                @click="onSelectSpec(spec.k_s, item)"
              >
                {{ item.name }}
              </span>
            </div>
          </div>

          <div class="sku-stepper">
            <div class="sku-stepper__title">购买数量</div>
            <van-stepper
              v-model="selectedNum"
              :max="Math.max(1, skuData.stock_num || 1)"
              min="1"
              @change="onStepperChange"
            />
          </div>
        </div>

        <div class="sku-actions">
          <van-button type="warning" class="sku-btn" round @click="handleAction('cart')">
            加入购物车
          </van-button>
          <van-button type="danger" class="sku-btn" round @click="handleAction('buy')">
            立即购买
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import _ from 'lodash'

import { addCart } from '@/api/cart'
import { createSkuState } from './skuState.mjs'

const router = useRouter()

const emit = defineEmits(['update:modelValue', 'getNum', 'initSku', 'initSkuNum'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  skuData: {
    type: Object,
    default() {
      return {}
    },
  },
  goods: {
    type: Object,
    default() {
      return {}
    },
  },
  initialSku: {
    type: Object,
    default() {
      return {}
    },
  },
})

const isShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { selectedValues, selectedNum, selectedNames, syncSelectedFromInitial } = createSkuState(
  props.initialSku
)

const displayPrice = computed(() => {
  return ((Number(props.skuData.price || 0))).toFixed(2)
})

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      syncSelectedFromInitial(props.skuData.tree || [], props.initialSku)
    }
  },
  { immediate: true }
)

watch(
  () => props.initialSku,
  () => {
    if (props.modelValue) {
      syncSelectedFromInitial(props.skuData.tree || [], props.initialSku)
    }
  },
  { deep: true }
)

const onClosed = () => {
  emit('update:modelValue', false)
}

const emitSkuChange = (skuKeyStr, item) => {
  const selectedSku = {}
  Object.keys(selectedValues.value).forEach((key) => {
    selectedSku[key] = selectedValues.value[key]?.id || ''
  })

  emit('initSku', {
    skuValue: { skuKeyStr, name: item?.name || '' },
    selectedSku,
  })
}

const onSelectSpec = (key, item) => {
  if (selectedValues.value[key]?.id === item.id) {
    const nextSelected = { ...selectedValues.value }
    delete nextSelected[key]
    selectedValues.value = nextSelected
    emitSkuChange(key, { name: '' })
    return
  }

  selectedValues.value = {
    ...selectedValues.value,
    [key]: item,
  }
  emitSkuChange(key, item)
}

const onStepperChange = (num) => {
  selectedNum.value = num
  emit('initSkuNum', num)
}

const findProductId = () => {
  const selectedIds = Object.keys(selectedValues.value)
    .sort()
    .map((key) => selectedValues.value[key]?.id)
    .filter(Boolean)

  if (selectedIds.length <= 0) {
    return getProductIdByOne(null)
  }

  if (selectedIds.length === 1) {
    return getProductIdByOne(selectedIds[0])
  }

  if (selectedIds.length === 2) {
    return getProductId(selectedIds[0], selectedIds[1])
  }

  showToast({ message: '目前仅支持两规格', duration: 1500 })
  return 0
}

const validateSkuData = () => {
  const treeKeys = (props.skuData.tree || []).map((item) => item.k_s)
  for (const key of treeKeys) {
    if (!selectedValues.value[key]) {
      showToast({ type: 'fail', message: '请选择完整规格' })
      return false
    }
  }

  const productId = findProductId()
  if (!productId) {
    showToast({ type: 'fail', message: '商品规格组合不存在或已售罄' })
    return false
  }

  return {
    goodsId: props.goods.goodsId,
    number: selectedNum.value,
    productId,
  }
}

const handleAction = async (type) => {
  const params = validateSkuData()
  if (!params) return

  await addCart(params)

  if (type === 'buy') {
    router.push({ name: 'Cart' })
    return
  }

  showToast({
    type: 'success',
    message: '已加入购物车',
    duration: 1500,
  })
  emit('update:modelValue', false)
  emit('getNum')
}

const getProductId = (s1, s2) => {
  let productId = 0
  let s1Name = ''
  let s2Name = ''

  _.each(props.goods.specificationList, (specification) => {
    _.each(specification.valueList, (specValue) => {
      if (specValue.id === s1) {
        s1Name = specValue.value
      } else if (specValue.id === s2) {
        s2Name = specValue.value
      }
    })
  })

  _.each(props.goods.productList, (item) => {
    const result = _.without(item.specifications, s1Name, s2Name)
    if (result.length === 0) {
      productId = item.id
    }
  })

  return productId
}

const getProductIdByOne = (s1) => {
  let productId = 0
  let s1Name = ''

  if (s1) {
    _.each(props.goods.specificationList, (specification) => {
      _.each(specification.valueList, (specValue) => {
        if (specValue.id === s1) {
          s1Name = specValue.value
        }
      })
    })
  }

  _.each(props.goods.productList, (item) => {
    const result = s1Name ? _.without(item.specifications, s1Name) : item.specifications
    if (!result || result.length === 0) {
      productId = item.id
    }
  })

  return productId
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.sku-container {
  padding: 32px;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: 667px;
  max-height: 1067.2px;

  .sku-header {
    display: flex;
    margin-bottom: 40px;

    &__img {
      width: 192px;
      height: 192px;
      border-radius: 24px;
      overflow: hidden;
      margin-right: 24px;
      background: #f5f5f7;
    }

    &__info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    &__price {
      color: $black;
      font-weight: 600;
      margin-bottom: 8px;

      .currency {
        font-size: 24px;
        margin-right: 4px;
      }

      .price {
        font-size: 44px;
      }
    }

    &__stock {
      font-size: 24px;
      color: #666;
      margin-bottom: 8px;
    }

    &__selected {
      font-size: 24px;
      color: #323233;
    }
  }

  .sku-body {
    flex: 1;
    overflow-y: auto;

    .sku-group {
      margin-bottom: 24px;

      &__title {
        font-size: 28px;
        color: #323233;
        margin-bottom: 24px;
      }

      &__items {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;

        .sku-item {
          display: inline-block;
          padding: 12px 24px;
          font-size: 26px;
          color: #323233;
          background: #f5f5f7;
          border-radius: 999px;
          border: 2px solid transparent;

          &--active {
            color: $theme;
            background: rgba(0, 113, 227, 0.1);
            border-color: $theme;
          }
        }
      }
    }

    .sku-stepper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      margin-bottom: 40px;

      &__title {
        font-size: 28px;
        color: #323233;
      }
    }
  }

  .sku-actions {
    display: flex;
    gap: 16px;
    margin-top: auto;
    padding-top: 24px;

    .sku-btn {
      flex: 1;
      height: 80px;
      font-size: 28px;
    }
  }
}
</style>
