<template>
  <div class="address-edit wb-page">
    <nav-bar :title="$route.meta.title" />

    <main class="address-edit__body">
      <section class="address-edit__summary">
        <h1 class="address-edit__summary__title">{{ pageTitle }}</h1>
        <span class="address-edit__summary__chip">{{ pageMode }}</span>
      </section>

      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-postal
        :show-delete="isEditMode"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { showToast } from 'vant'

import areaList from '@/utils/area.js'
import { addAddress, updateAddress, deleteAddress } from '@/api/address.js'

const router = useRouter()
const route = useRoute()
const store = useStore()

const addressList = computed(() => store.getters.addressList || [])
const editIndex = computed(() => {
  const idx = Number(route.query.index)
  return Number.isInteger(idx) && idx >= 0 ? idx : -1
})
const isEditMode = computed(() => !!addressList.value[editIndex.value])
const pageTitle = computed(() => (isEditMode.value ? '编辑收货地址' : '新增收货地址'))
const pageMode = computed(() => (isEditMode.value ? '编辑' : '新增'))

const state = reactive({
  addressInfo: {},
})
const { addressInfo } = toRefs(state)

const onSave = (value) => {
  const request = isEditMode.value
    ? updateAddress({ ...addressInfo.value, ...value })
    : addAddress(value)

  request
    .then(() => {
      showToast({ type: 'success', message: '保存成功' })
      router.go(-1)
    })
    .catch(() => {})
}

const onDelete = (value) => {
  deleteAddress(value.id)
    .then(() => {
      showToast({ type: 'success', message: '删除成功' })
      router.go(-1)
    })
    .catch(() => {})
}

onMounted(async () => {
  if (editIndex.value >= 0 && addressList.value.length === 0) {
    await store.dispatch('address/getList')
  }

  if (isEditMode.value) {
    addressInfo.value = { ...addressList.value[editIndex.value] }
    return
  }

  addressInfo.value = {}
})
</script>

<style lang="scss" scoped>
.address-edit {
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 52%, #f5f5f7 100%);
}

.address-edit__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 18px 18px 36px;
}

.address-edit__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 24px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.address-edit__summary__title {
  font-size: 36px;
  line-height: 1.18;
  font-weight: 700;
  color: #1d1d1f;
}

.address-edit__summary__chip {
  flex: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

:deep(.van-address-edit) {
  padding: 0;
  --van-address-edit-button-font-size: 30px;
}

:deep(.van-address-edit__fields),
:deep(.van-address-edit__default) {
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

:deep(.van-address-edit__default) {
  margin-top: 18px;
}

:deep(.van-cell) {
  padding: 24px 22px;
  background: #ffffff;
}

:deep(.van-cell::after) {
  right: 22px;
  left: 22px;
  border-color: rgba(29, 29, 31, 0.08);
}

:deep(.van-field__label) {
  width: 5.4em;
  color: rgba(29, 29, 31, 0.72);
  font-size: 28px;
  line-height: 1.35;
}

:deep(.van-field__control),
:deep(.van-field__control::placeholder),
:deep(.van-cell__value),
:deep(.van-cell__title),
:deep(.van-switch-cell .van-cell__title) {
  font-size: 28px;
  line-height: 1.35;
}

:deep(.van-field__control) {
  color: #1d1d1f;
}

:deep(.van-field__control::placeholder) {
  color: rgba(29, 29, 31, 0.34);
}

:deep(.van-cell__right-icon) {
  color: rgba(29, 29, 31, 0.38);
  font-size: 30px;
}

:deep(.van-switch) {
  font-size: 34px;
}

:deep(.van-switch--on) {
  background: #0071e3;
}

:deep(.van-address-edit__buttons) {
  padding: 24px 0 0;
}

:deep(.van-address-edit__button) {
  height: 64px;
  margin-bottom: 16px;
  border-radius: 999px;
  font-weight: 600;
}

:deep(.van-address-edit__button:first-child) {
  border: none;
  background: #0071e3;
  color: #ffffff;
}

:deep(.van-address-edit__button:last-child) {
  border-color: rgba(255, 59, 48, 0.28);
  background: #fff5f4;
  color: #ff3b30;
}

:deep(.van-button__text) {
  font-size: 30px;
  line-height: 1.2;
}

:deep(.van-picker__toolbar),
:deep(.van-picker-column__item),
:deep(.van-picker__confirm),
:deep(.van-picker__cancel) {
  font-size: 28px;
}

@media (max-width: 375px) {
  .address-edit__body {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
