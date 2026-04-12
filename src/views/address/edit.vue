<template>
  <div class="address-edit">
    <nav-bar :title="$route.meta.title" />

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
  </div>
</template>

<script setup>
import { reactive, toRefs, computed, onMounted } from 'vue'
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

<style></style>
