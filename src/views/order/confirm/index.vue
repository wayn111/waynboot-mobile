<template>
  <div class="order-confirm">
    <nav-bar :title="$route.meta.title" />

    <van-contact-card
      :type="contact.type"
      :name="contact.name"
      :tel="contact.tel"
      @click="onContact"
    />

    <div class="list">
      <list-item :selected-address="selectedAddress" />
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  toRefs,
  computed,
  onActivated,
  onDeactivated,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from 'vuex'
import ListItem from './modules/ListItem'

const router = useRouter()
const store = useStore()
const selectedAddress = computed(() => store.getters.selectedAddress || {})

const state = reactive({
  contact: {
    type: 'add',
    name: '',
    tel: '',
  },
})
const { contact } = toRefs(state)

const updateContactCard = () => {
  if (selectedAddress.value.id) {
    const { name, tel } = selectedAddress.value
    contact.value.type = 'edit'
    contact.value.name = name || ''
    contact.value.tel = tel || ''
    return
  }

  contact.value.type = 'add'
  contact.value.name = ''
  contact.value.tel = ''
}

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

watch(selectedAddress, updateContactCard, { immediate: true })

const onContact = () => {
  router.push({
    path: '/address',
  })
}

onActivated(() => {
  restoreContactFromSession()
  updateContactCard()
  window.addEventListener('beforeunload', syncContactToSession)
})

onDeactivated(() => {
  window.removeEventListener('beforeunload', syncContactToSession)
})
</script>

<style lang="scss" scoped>
.order-confirm {
  min-height: 1334px;
  background: #f5f5f5;
}
</style>
