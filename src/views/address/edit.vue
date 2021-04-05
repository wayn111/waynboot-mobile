<template>
  <div class="address-edit">
    <nav-bar :title="$route.meta.title" />

    <van-address-edit
      :address-info="addressInfo"
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavBar from '@/components/NavBar'

import areaList from '@/utils/area.js'
import { addAddress } from '@/api/address.js'

export default {
  name: 'AddressEdit',
  components: {
    NavBar
  },
  data() {
    return {
      areaList,
      addressInfo: {}
    }
  },
  computed: {
    ...mapGetters(['addressList'])
  },
  mounted() {
    const { index } = this.$route.query
    this.addressInfo = this.addressList[Number(index)]
  },
  methods: {
    onSave(value) {
      addAddress(value).then(res => {
        this.$toast.success('保存成功')
        this.$router.go(-1)
      }).catch(e => {})
    },
    onDelete(value) {
      console.log('删除地址', value)
    }
  }
}
</script>

<style>
</style>
