<template>
  <div class="goods-sku">
    <van-sku
      v-model="isShow"
      :sku="skuData"
      :goods="goods"
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
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    skuData: Object,
    goods: Object,
    initialSku: Object
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
    onBuy() {
      console.log('buy')
    },
    onAddCart() {
      this.$toast.success('添加成功')
      this.$emit('input', false)
    },
    onSkuSelected({ skuValue, selectedSku, selectedSkuComb }) {
      this.$emit('initSku', skuValue)
    },
    onStepperChange(num) {
      this.$emit('initSkuNum', num)
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
