<template>
  <div>
    <van-submit-bar
      :price="displayPrice"
      button-text="去结算"
      :disabled="!canSubmit"
      class="submit-bar"
      @submit="onSubmit"
    >
      <van-checkbox
        v-model="checked"
        icon-size="18px"
        :checked-color="variables.theme"
      >
        全选
      </van-checkbox>
    </van-submit-bar>
    <div class="submit-bar-placeholder" style="width: 100%; height: 50px" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import variables from '@/styles/variables.scss?inline'

const router = useRouter()
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const onSubmit = () => {
  if (props.amount <= 0 || props.selectedIds.length <= 0) {
    showToast({
      type: 'fail',
      message: '请至少选择一件商品',
    })
    return
  }

  router.push({
    path: '/order/confirm',
    query: {
      cartIds: props.selectedIds.join(','),
    },
  })
}

const checked = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const canSubmit = computed(() => {
  return props.amount > 0
})

const displayPrice = computed(() => {
  return Math.round((Number(props.amount) || 0) * 100)
})
</script>

<style>
:root {
  --submit-bar-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.08);
}
</style>

<style scoped>
.submit-bar {
  box-shadow: var(--submit-bar-shadow);
}

.van-submit-bar {
  bottom: 50px;
}
</style>
