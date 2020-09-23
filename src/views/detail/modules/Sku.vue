<template>
  <div class="goods-sku">
    <van-sku
      v-model="isShow"
      :sku="skuData"
      :goods="goods"
      :goods-id="goods.goodsId"
      :initial-sku="initialSku"
      :hide-stock="skuData.hide_stock"
      :close-on-click-overlay="true"
      @buy-clicked="onBuy"
      @add-cart="onAddCart"
      @sku-selected="onSkuSelected"
      @stepper-change="onStepperChange"
    />
  </div>
</template>

<script>
import { addCart } from '@/api/cart'
import _ from 'lodash'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    skuData: {
      type: Object,
      default() {
        return {}
      }
    },
    goods: {
      type: Object,
      default() {
        return {}
      }
    },
    initialSku: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onBuy(data) {
      addCart(this.validateSkuData(data)).then(() => {
        this.$router.push({ name: 'Cart' })
      })
    },
    onAddCart(data) {
      addCart(this.validateSkuData(data)).then(() => {
        this.$toast({
          message: '已添加至购物车',
          duration: 1500
        })
        this.$emit('input', false)
        this.$emit('getNum')
      })
    },
    // 校验sku数据
    validateSkuData(data) {
      const params = {
        goodsId: data.goodsId,
        number: data.selectedNum,
        productId: 0
      }
      if (_.has(data.selectedSkuComb, 's3')) {
        this.$toast({
          message: '目前仅支持两规格',
          duration: 1500
        })
      } else if (_.has(data.selectedSkuComb, 's2')) {
        params.productId = this.getProductId(
          data.selectedSkuComb.s1,
          data.selectedSkuComb.s2
        )
      } else {
        params.productId = this.getProductIdByOne(data.selectedSkuComb.s1)
      }
      return params
    },
    onSkuSelected({ skuValue, selectedSku, selectedSkuComb }) {
      this.$emit('initSku', { skuValue, selectedSku })
    },
    onStepperChange(num) {
      this.$emit('initSkuNum', num)
    },
    getProductId(s1, s2) {
      var productId
      var s1Name
      var s2Name
      _.each(this.goods.specificationList, specification => {
        _.each(specification.valueList, specValue => {
          if (specValue.id === s1) {
            s1Name = specValue.value
          } else if (specValue.id === s2) {
            s2Name = specValue.value
          }
        })
      })

      _.each(this.goods.productList, v => {
        const result = _.without(v.specifications, s1Name, s2Name)
        if (result.length === 0) {
          productId = v.id
        }
      })
      return productId
    },
    getProductIdByOne(s1) {
      var productId
      var s1Name
      _.each(this.goods.specificationList, (specification) => {
        _.each(specification.valueList, (specValue) => {
          if (specValue.id === s1) {
            s1Name = specValue.value
          }
        })
      })

      _.each(this.goods.productList, (v) => {
        const result = _.without(v.specifications, s1Name)
        if (result.length === 0) {
          productId = v.id
        }
      })
      return productId
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

// reset vant style
.goods-sku {
  .van-sku-messages {
    padding: 0;
  }
  .van-button--danger {
    background: $red;
  }
}
</style>
