<template>
  <div class="section">
    <div class="item_cell_group">
      <van-cell-group>
        <van-cell
          title="规格"
          is-link
          :value="`${name} ${stockNum} 件`"
          @click="onSelectSku"
        />
        <van-cell title="属性" is-link @click="propsPopup = true" />
        <van-cell
          title="送至"
          is-link
          :value="selectedAddress.address || '选择收货地址'"
          @click="handleAddress"
        />
        <van-cell title="运费" value="全国包邮" />
      </van-cell-group>
    </div>

    <van-popup v-if="isShowAttr" v-model:show="propsPopup" position="bottom">
      <popup-props :props-str="attr" @closePopup="closePopup" />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import PopupProps from './Popup-props'

const router = useRouter()
const store = useStore()
const emit = defineEmits(['update:value'])

const selectedAddress = computed(() => store.getters.selectedAddress || {})

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  stockNum: {
    type: Number,
    default: 1,
  },
  freightLimit: {
    type: Number,
    default: 88,
  },
  attr: {
    type: Array,
    default() {
      return []
    },
  },
})

const state = reactive({
  propsPopup: false,
  isShowAttr: false,
})

const { propsPopup, isShowAttr } = toRefs(state)

watch(
  () => props.attr,
  (value) => {
    isShowAttr.value = Array.isArray(value) && value.length > 0
  },
  { immediate: true }
)

const onSelectSku = () => {
  emit('update:value', true)
}

const handleAddress = () => {
  router.push({
    path: '/address',
  })
}

const closePopup = () => {
  propsPopup.value = false
}
</script>

<style lang="scss">
.section {
  .van-button--default {
    border: none;
    border-radius: 0;
  }
}
</style>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.section {
  margin-top: 0;
  overflow: hidden;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  :deep(.van-cell-group) {
    background: transparent;
  }

  :deep(.van-cell) {
    align-items: center;
    padding: 26px 24px;
    background: transparent;
  }

  :deep(.van-cell::after) {
    right: 24px;
    left: 24px;
    border-color: rgba(29, 29, 31, 0.08);
  }

  :deep(.van-cell__title) {
    flex: none;
    width: 96px;
    color: #1d1d1f;
    font-size: 30px;
    line-height: 1.25;
    font-weight: 700;
  }

  :deep(.van-cell__value) {
    color: rgba(29, 29, 31, 0.66);
    font-size: 28px;
    line-height: 1.35;
    text-align: right;
  }

  :deep(.van-cell__right-icon) {
    color: rgba(29, 29, 31, 0.34);
    font-size: 32px;
  }
}
</style>
