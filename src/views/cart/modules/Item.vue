<template>
  <div class="cart-item">
    <van-swipe-cell class="cart-item__swipe" :before-close="beforeClose">
      <div class="cart-item__card">
        <div class="cart-item__select">
          <van-checkbox
            v-model="checked"
            class="cart-item__check"
            icon-size="19px"
            :disabled="invalid"
            :checked-color="variables.theme"
          />
        </div>

        <div class="cart-item__thumb-wrap">
          <img class="cart-item__thumb" :src="thumb" :alt="title" />
        </div>

        <div class="cart-item__content">
          <div class="cart-item__top">
            <h3 class="cart-item__title">{{ title }}</h3>
            <span v-if="invalid" class="cart-item__status">已失效</span>
          </div>

          <p class="cart-item__desc">{{ desc || '默认规格' }}</p>

          <div class="cart-item__footer">
            <div class="cart-item__price-wrap">
              <span class="cart-item__price-label">到手价</span>
              <span class="cart-item__price">¥{{ price }}</span>
              <span v-if="invalid" class="cart-item__stock-warning">库存不足</span>
            </div>

            <van-stepper
              v-if="!invalid"
              :model-value="currentNum"
              button-size="28px"
              min="1"
              :max="maxNumber"
              integer
              async-change
              @change="onChange"
            />
          </div>
        </div>
      </div>

      <template #right>
        <van-button square text="删除" class="cart-item__delete" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { showConfirmDialog, showToast } from 'vant'

import { changeNumber } from '@/api/cart'
import variables from '@/styles/variables.scss?inline'

const emit = defineEmits(['handleDelete', 'changeNum', 'update:modelValue', 'changeChecked'])

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  thumb: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default() {
      return []
    },
  },
  originPrice: {
    type: Number,
    default: 0,
  },
  price: {
    type: String,
    default: '',
  },
  num: {
    type: Number,
    default: 0,
  },
  maxNum: {
    type: Number,
    default: 0,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const currentNum = ref(Number(props.num))

watch(
  () => props.num,
  (value) => {
    currentNum.value = Number(value)
  },
  { immediate: true }
)

const beforeClose = ({ position, instance }) => {
  switch (position) {
    case 'cell':
    case 'outside':
      instance.close()
      break
    case 'right':
      showConfirmDialog({
        message: '确认删除吗？',
      })
        .then(() => {
          emit('handleDelete', props.index)
          instance.close()
        })
        .catch(() => {
          instance.close()
        })
      break
  }
}

const onChange = async (value) => {
  const nextValue = Number(value)
  if (!nextValue || nextValue === currentNum.value) {
    return
  }

  const previousValue = currentNum.value
  currentNum.value = nextValue

  try {
    await changeNumber(props.index, nextValue)
    emit('changeNum', props.index, nextValue)
  } catch (error) {
    currentNum.value = previousValue
    showToast({
      type: 'fail',
      message: error?.message || '数量修改失败',
    })
  }
}

const checked = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
    emit('changeChecked', { val, idx: props.index })
  },
})

const maxNumber = computed(() => {
  return props.maxNum > props.num ? props.maxNum : props.num
})

const invalid = computed(() => {
  return props.maxNum < props.num
})
</script>

<style lang="scss" scoped>
.cart-item {
  position: relative;
}

.cart-item__swipe {
  overflow: hidden;
  border-radius: 34px;
}

.cart-item__card {
  display: grid;
  grid-template-columns: 44px 116px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 20px 20px;
  border-radius: 34px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}

.cart-item__select {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item__check {
  display: flex;
  align-items: center;
}

.cart-item__thumb-wrap {
  width: 116px;
  height: 116px;
  overflow: hidden;
  border-radius: 28px;
  background: #f5f5f7;
}

.cart-item__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.cart-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.cart-item__title {
  font-size: 30px;
  line-height: 1.24;
  font-weight: 600;
  color: #1d1d1f;
  word-break: break-word;
}

.cart-item__status {
  min-height: 34px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(29, 29, 31, 0.08);
  color: rgba(29, 29, 31, 0.6);
  font-size: 24px;
  line-height: 1;
  font-weight: 600;
}

.cart-item__desc {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f5f5f7;
  font-size: 26px;
  line-height: 1.3;
  color: rgba(29, 29, 31, 0.56);
}

.cart-item__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.cart-item__price-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cart-item__price-label {
  font-size: 24px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.42);
}

.cart-item__price {
  font-size: 36px;
  line-height: 1;
  font-weight: 600;
  color: #1d1d1f;
}

.cart-item__stock-warning {
  font-size: 26px;
  color: #d44f44;
}

.cart-item__delete {
  height: 100%;
  min-width: 92px;
  border: none;
  background: #ff6b6b;
  color: #ffffff;
  font-size: 28px;
}

:deep(.van-stepper) {
  background: transparent;
}

:deep(.van-stepper__minus),
:deep(.van-stepper__plus),
:deep(.van-stepper__input) {
  background: #f5f5f7;
  color: #1d1d1f;
  font-size: 26px;
}

:deep(.van-checkbox__icon .van-icon) {
  border-color: rgba(29, 29, 31, 0.12);
  background: #f5f5f7;
}

@media (max-width: 375px) {
  .cart-item__card {
    grid-template-columns: 40px 96px minmax(0, 1fr);
    gap: 14px;
    padding: 16px;
  }

  .cart-item__thumb-wrap {
    width: 96px;
    height: 96px;
  }

  .cart-item__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
