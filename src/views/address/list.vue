<template>
  <div class="address-list wb-page">
    <nav-bar :title="$route.meta.title" />

    <main class="address-list__body">
      <section class="address-list__summary">
        <div>
          <p class="address-list__summary__label">收货地址</p>
          <strong class="address-list__summary__value">{{ addressCount }}</strong>
        </div>
        <span class="address-list__summary__chip">
          {{ defaultAddressName }}
        </span>
      </section>

      <van-address-list
        v-model="defaultId"
        :list="list"
        add-button-text="新增地址"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      />
    </main>
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

const addressCount = computed(() => `${list.value.length} 个`)

const defaultAddressName = computed(() => {
  const current = list.value.find((item) => item.id === defaultId.value) || list.value.find((item) => item.isDefault)
  return current ? `${current.name || '默认'} 收` : '未设置默认'
})

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
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 48%, #f5f5f7 100%);
}

.address-list__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 18px 18px 184px;
}

.address-list__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 24px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.address-list__summary__label {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.58);
}

.address-list__summary__value {
  display: block;
  margin-top: 8px;
  font-size: 42px;
  line-height: 1;
  font-weight: 700;
  color: #1d1d1f;
}

.address-list__summary__chip {
  max-width: 52%;
  padding: 12px 18px;
  border-radius: 999px;
  background: #f2f7ff;
  color: #0066cc;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.van-address-list) {
  height: auto;
  padding: 0;
  background: transparent;
}

:deep(.van-address-item) {
  padding: 24px 22px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

:deep(.van-address-item:not(:last-child)) {
  margin-bottom: 16px;
}

:deep(.van-address-item .van-cell) {
  align-items: center;
}

:deep(.van-address-item__title) {
  padding-right: 56px;
}

:deep(.van-address-item__name) {
  margin-bottom: 12px;
  font-size: 32px;
  line-height: 1.25;
  font-weight: 700;
  color: #1d1d1f;
}

:deep(.van-address-item__address) {
  font-size: 28px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.72);
}

:deep(.van-address-item__tag) {
  margin-left: 10px;
  padding: 4px 14px;
  border: none;
  border-radius: 999px;
  background: #eaf3ff;
  color: #0071e3;
  font-size: 28px;
  line-height: 1.2;
}

:deep(.van-radio__label) {
  margin-left: 16px;
}

:deep(.van-radio__icon) {
  font-size: 34px;
}

:deep(.van-radio__icon--checked .van-icon) {
  border-color: #0071e3;
  background-color: #0071e3;
}

:deep(.van-address-item__edit) {
  right: 22px;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f7;
  color: #0071e3;
  font-size: 28px;
}

:deep(.van-address-list__bottom) {
  left: 50%;
  width: min(100%, var(--wb-content-width));
  padding: 14px 18px calc(14px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  background: rgba(245, 245, 247, 0.82);
  backdrop-filter: saturate(180%) blur(18px);
}

:deep(.van-address-list__add) {
  height: 64px;
  margin: 0;
  border: none;
  border-radius: 999px;
  background: #0071e3;
  color: #ffffff;
  font-size: 30px;
  font-weight: 600;
}

:deep(.van-empty) {
  padding: 56px 0 64px;
}

:deep(.van-empty__description) {
  font-size: 28px;
  color: rgba(29, 29, 31, 0.48);
}

@media (max-width: 375px) {
  .address-list__body {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
