<template>
  <div class="address-list">
    <nav-bar :title="$route.meta.title" />

    <van-address-list
      v-model="defaultId"
      :list="list"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { closeToast, showLoadingToast } from 'vant'

import NavBar from '@/components/NavBar'

const router = useRouter()
const store = useStore()

const selectedAddress = computed(() => store.getters.selectedAddress || {})

const state = reactive({
  defaultId: '',
  list: [],
})

const { defaultId, list } = toRefs(state)

const normalizeAddressList = (addressList) => {
  return (addressList || []).map((item) => ({
    ...item,
    address: `${item.province || ''}${item.city || ''}${item.county || ''} ${item.addressDetail || ''}`.trim(),
  }))
}

const syncDefaultId = () => {
  if (selectedAddress.value?.id) {
    defaultId.value = selectedAddress.value.id
    return
  }

  const defaultItem = list.value.find((item) => item.isDefault)
  defaultId.value = defaultItem?.id || ''
}

const loadAddressList = async () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  })

  try {
    const data = await store.dispatch('address/getList')
    list.value = normalizeAddressList(data)
    syncDefaultId()
  } finally {
    closeToast()
  }
}

const onSelect = (item) => {
  store.commit('address/SET_SELECTED_ADDRESS', item)
  router.back()
}

const onAdd = () => {
  router.push({
    path: '/address/edit',
  })
}

const onEdit = (_, index) => {
  router.push({
    path: '/address/edit',
    query: {
      index,
    },
  })
}

onMounted(() => {
  loadAddressList()
})
</script>

<style lang="scss" scoped>
.address-list {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
