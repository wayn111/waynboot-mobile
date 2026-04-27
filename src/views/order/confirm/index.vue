<template>
  <div class="order-confirm wb-page">
    <nav-bar :title="$route.meta.title" />

    <div class="order-confirm__body">
      <button type="button" class="order-confirm__address-card" @click="onContact">
        <div class="order-confirm__address-card__copy">
          <span class="order-confirm__address-card__label">收货信息</span>

          <template v-if="hasAddress">
            <div class="order-confirm__address-card__head">
              <strong class="order-confirm__address-card__name">
                {{ selectedAddress.name || '未命名联系人' }}
              </strong>
              <span class="order-confirm__address-card__tel">{{ selectedAddress.tel || '--' }}</span>
            </div>
            <p class="order-confirm__address-card__detail">{{ fullAddress }}</p>
          </template>

          <template v-else>
            <strong class="order-confirm__address-card__name">请选择收货地址</strong>
            <p class="order-confirm__address-card__detail">下单前先确认联系人、手机号和收货地址。</p>
          </template>
        </div>

        <van-icon name="arrow" class="order-confirm__address-card__arrow" />
      </button>

      <div class="order-confirm__list">
        <list-item :selected-address="selectedAddress" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ListItem from './modules/ListItem'

const router = useRouter()
const store = useStore()

const selectedAddress = computed(() => store.getters.selectedAddress || {})

const hasAddress = computed(() => {
  return Boolean(selectedAddress.value?.id)
})

const fullAddress = computed(() => {
  const currentAddress = selectedAddress.value || {}
  return currentAddress.address || `${currentAddress.province || ''}${currentAddress.city || ''}${currentAddress.county || ''}${currentAddress.addressDetail || ''}`.trim() || '请选择收货地址'
})

const syncContactToSession = () => {
  if (selectedAddress.value.id) {
    sessionStorage.setItem('contact', JSON.stringify(selectedAddress.value))
  }
}

const restoreContactFromSession = () => {
  if (selectedAddress.value.id) {
    return
  }

  const cached = sessionStorage.getItem('contact')
  if (cached) {
    store.commit('address/SET_SELECTED_ADDRESS', JSON.parse(cached))
    sessionStorage.removeItem('contact')
  }
}

const onContact = () => {
  router.push({
    path: '/address',
  })
}

const bindUnloadSync = () => {
  window.addEventListener('beforeunload', syncContactToSession)
}

const unbindUnloadSync = () => {
  window.removeEventListener('beforeunload', syncContactToSession)
}

const initializeContact = () => {
  restoreContactFromSession()
  bindUnloadSync()
}

onMounted(() => {
  initializeContact()
})

onActivated(() => {
  initializeContact()
})

onDeactivated(() => {
  unbindUnloadSync()
})

onBeforeUnmount(() => {
  unbindUnloadSync()
})
</script>

<style lang="scss" scoped>
.order-confirm__body {
  width: 100%;
  max-width: var(--wb-content-width);
  margin: 0 auto;
  padding: 0 24px 24px;
}

.order-confirm__address-card {
  width: 100%;
  padding: 24px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: none;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  text-align: left;
}

.order-confirm__address-card__copy {
  min-width: 0;
  flex: 1;
}

.order-confirm__address-card__label {
  display: block;
  font-size: 26px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.46);
}

.order-confirm__address-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 16px;
  margin-top: 12px;
}

.order-confirm__address-card__name {
  display: block;
  font-size: 36px;
  line-height: 1.1;
  font-weight: 600;
  color: #1d1d1f;
}

.order-confirm__address-card__tel {
  font-size: 28px;
  line-height: 1.2;
  color: rgba(29, 29, 31, 0.62);
}

.order-confirm__address-card__detail {
  margin-top: 10px;
  font-size: 26px;
  line-height: 1.45;
  color: rgba(29, 29, 31, 0.6);
  word-break: break-word;
}

.order-confirm__address-card__arrow {
  flex: none;
  font-size: 28px;
  color: rgba(29, 29, 31, 0.34);
}

.order-confirm__list {
  padding-top: 18px;
}

@media (max-width: 375px) {
  .order-confirm__body {
    padding: 16px 20px 24px;
  }

  .order-confirm__address-card {
    padding: 22px 18px;
  }
}
</style>
