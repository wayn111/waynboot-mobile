<template>
  <div class="card__item">
    <van-checkbox
      v-model="checked"
      icon-size="18px"
      :disabled="invalid"
      :checked-color="variables.theme"
      style="padding: 0 10px 0 16px; background-color: white"
    />

    <van-swipe-cell
      style="width: 100%; background-color: white"
      :before-close="beforeClose"
    >
      <van-card :price="price" :desc="desc" :title="title" :thumb="thumb">
        <template #footer>
          <van-stepper
            v-if="!invalid"
            :model-value="currentNum"
            button-size="26px"
            min="1"
            :max="maxNumber"
            integer
            async-change
            @change="onChange"
          />
        </template>
      </van-card>

      <template #right>
        <van-button square text="删除" type="danger" style="height: 100%" />
      </template>

      <div v-if="invalid" class="invalid">失效</div>
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
.card__item {
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: #f9f8f8;
  padding: 0px 10px 15px 10px;

  .van-card__num {
    font-size: 16px;
  }
}

.van-card__footer {
  position: absolute;
  top: 150px;
  left: -16px;
}

.invalid {
  position: absolute;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border-radius: 50%;
  background-color: #554f4f;
  color: white;
  top: 40px;
  left: 60px;
  filter: opacity(80%);
}
</style>
