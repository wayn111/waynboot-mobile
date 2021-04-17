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
      <list-item />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import ListItem from './modules/ListItem'

export default {
  name: 'OrderConfirm',
  components: {
    ListItem
  },
  data() {
    return {
      contact: {
        type: 'add',
        name: '',
        tel: ''
      }
    }
  },
  computed: {
    ...mapGetters(['selectedAddress'])
  },
  mounted() {
  },
  activated() {
    // 对于使用了keep-alive的组件
    // 使用activated这个生命周期钩子刷新地址
    // 在页面加载时读取sessionStorage里的状态信息
    if (!this.selectedAddress.id && sessionStorage.getItem('contact')) {
      this['address/SET_SELECTED_ADDRESS'](JSON.parse(sessionStorage.getItem('contact')))
      sessionStorage.removeItem('contact')
    }

    if (this.selectedAddress.id) {
      const { name, tel } = this.selectedAddress
      this.contact.type = 'edit'
      this.contact.name = name
      this.contact.tel = tel
    } else {
      this.contact.type = 'add'
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('contact', JSON.stringify(this.selectedAddress))
    })
  },
  methods: {
    onContact() {
      this.$router.push({
        path: '/address'
      })
    },
    ...mapMutations([
      'address/SET_SELECTED_ADDRESS' // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    ])
  }
}
</script>

 <style lang="scss" scoped>
.order-confirm {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
