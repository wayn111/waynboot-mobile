<template>
  <div>
    <van-submit-bar :price="amount" button-text="去结算" :disabled="disabled" class="submit-bar" @submit="onSubmit">
      <van-checkbox icon-size="18px" :checked-color="variables.theme" v-model="checked">全选</van-checkbox>
    </van-submit-bar>
    <div class="submit-bar-placeholder" style="width:100%;height:50px"></div>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'

export default {
  props: {
    amount: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    variables() {
      return variables
    },
    checked: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return { disabled: false }
  },
  watch: {
    amount(newVal) {
      this.disabled = newVal <= 0
    }
  },
  methods: {
    onSubmit() {
      if (this.amount <= 0) {
        return this.$toast.success('请至少选择一件商品')
      }
      this.$router.push({
        path: '/order/confirm'
      })
    }
  }
}
</script>

<style scoped>
.submit-bar {
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.08);

}
.van-submit-bar {
  bottom: 50px;
}
</style>
