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
    border-radius: 0px;
  }
}
</style>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.section {
  margin-top: 12px;
  background: #fff;

  .van-cell__value {
    min-width: 80%;
  }
}
</style>
